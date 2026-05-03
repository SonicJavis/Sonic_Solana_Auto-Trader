import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { loadConfigWithResult, safeConfigSummary } from '@sonic/config';
import {
  createLogger,
  logAppStart,
  logModeLoaded,
  logConfigValidated,
  logWorkerHeartbeat,
  logUnsafeFlagsDetected,
  logSafetyStatus,
  logWorkerSafetyCheckPassed,
  logWorkerSafetyCheckFailed,
} from '@sonic/observability';
import {
  InMemoryAuditLogger,
  SqliteAuditRepository,
  openDatabase,
  initSchema,
  applyRetention,
  buildRetentionPolicy,
} from '@sonic/db';
import { ModeManager } from '@sonic/mode-manager';
import {
  APP_VERSION,
  HEARTBEAT_INTERVAL_MS,
  PHASE,
  PHASE_NAME,
  buildRuntimeSafetyStatus,
} from '@sonic/shared';

const startTime = Date.now();

// ── 1. Load config safely ────────────────────────────────────────────────────
const configResult = loadConfigWithResult();
const config = configResult.config;

// ── 2. Create redacted logger ────────────────────────────────────────────────
const logger = createLogger({ level: config.LOG_LEVEL, name: 'worker' });

logAppStart(logger, APP_VERSION, config.APP_MODE);
logConfigValidated(logger, configResult.valid);

if (!configResult.valid) {
  logger.warn({ warnings: configResult.warnings }, 'Config validation failed — safe defaults applied');
}

if (configResult.unsafeFlagsDetected) {
  logUnsafeFlagsDetected(logger, configResult.unsafeFlags);
}

// ── 3. Initialize database ────────────────────────────────────────────────────
let auditRepo: SqliteAuditRepository;
try {
  // Ensure data directory exists
  const dbDir = dirname(config.DATABASE_PATH);
  if (dbDir && dbDir !== '.') {
    mkdirSync(dbDir, { recursive: true });
  }
  const { client, sqlite } = openDatabase(config.DATABASE_PATH);
  initSchema(sqlite);
  auditRepo = new SqliteAuditRepository(client);
  auditRepo.record({
    eventType: 'DATABASE_INITIALIZED',
    severity: 'info',
    source: 'worker',
    message: 'SQLite audit database initialized successfully',
    details: { path: config.DATABASE_PATH },
  });
  logger.info({ path: config.DATABASE_PATH }, 'Audit database initialized');
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  logger.error({ error: message }, 'Database initialization failed — worker cannot start (fail-closed)');
  process.exit(1);
}

// ── 4. Apply retention ────────────────────────────────────────────────────────
const retentionPolicy = buildRetentionPolicy({
  enabled: config.AUDIT_ROTATION_ENABLED,
  retentionDays: config.AUDIT_RETENTION_DAYS,
  maxEvents: config.AUDIT_MAX_EVENTS,
});

const retentionResult = applyRetention(auditRepo, retentionPolicy);
if (retentionResult !== null) {
  logger.info(
    { deletedOld: retentionResult.deletedOld, deletedExcess: retentionResult.deletedExcess },
    'Audit retention applied',
  );
} else {
  logger.warn('Audit retention failed — stale events may accumulate');
}

// ── 5. Initialize mode manager ────────────────────────────────────────────────
const modeManager = new ModeManager(auditRepo, config.APP_MODE);

logModeLoaded(logger, modeManager.getMode());

// ── 6. Build runtime safety status ────────────────────────────────────────────
const safetyStatus = buildRuntimeSafetyStatus({
  currentPhase: PHASE,
  currentMode: modeManager.getMode(),
  configValid: configResult.valid,
  unsafeFlagsDetected: configResult.unsafeFlagsDetected,
  unsafeFlags: configResult.unsafeFlags,
  warnings: configResult.warnings,
  killSwitchActive: modeManager.isKillSwitchActive(),
  adminAllowlistConfigured: config.TELEGRAM_ADMIN_IDS.length > 0,
  telegramEnabled: config.TELEGRAM_BOT_TOKEN !== undefined,
  databaseConfigured: true,
});

// ── 7. Safety check — fail closed if critical safety invariants are violated ──
const safetyCheckPassed =
  !safetyStatus.liveTradingEnabled &&
  !safetyStatus.autoTradingEnabled &&
  !safetyStatus.transactionSigningEnabled &&
  !safetyStatus.transactionSendingEnabled &&
  !safetyStatus.walletLoadingEnabled &&
  !safetyStatus.solanaRpcEnabled &&
  !safetyStatus.jitoEnabled &&
  !safetyStatus.pumpfunTradingEnabled &&
  safetyStatus.fullAutoLocked &&
  safetyStatus.limitedLiveLocked;

if (!safetyCheckPassed) {
  logWorkerSafetyCheckFailed(logger, 'Critical safety invariant violated');
  auditRepo.record({
    eventType: 'WORKER_SAFETY_CHECK_FAILED',
    severity: 'critical',
    source: 'worker',
    mode: modeManager.getMode(),
    message: 'Critical safety invariant violated — worker will not start',
  });
  process.exit(1);
}

logWorkerSafetyCheckPassed(logger);

// ── 8. Persist startup and safety events ─────────────────────────────────────
auditRepo.record({
  eventType: 'SYSTEM_STARTUP',
  severity: 'info',
  source: 'worker',
  mode: modeManager.getMode(),
  phase: `Phase ${PHASE}`,
  message: `Worker safe startup — Phase ${PHASE} (${PHASE_NAME})`,
  details: {
    version: APP_VERSION,
    mode: modeManager.getMode(),
    configValid: configResult.valid,
  },
});

if (configResult.unsafeFlagsDetected) {
  auditRepo.record({
    eventType: 'UNSAFE_FLAGS_DETECTED',
    severity: 'warn',
    source: 'worker',
    mode: modeManager.getMode(),
    message: `Unsafe flags detected: ${configResult.unsafeFlags.join(', ')} — all capabilities remain disabled`,
    details: { unsafeFlags: configResult.unsafeFlags },
  });
}

auditRepo.record({
  eventType: 'RUNTIME_SAFETY_STATUS',
  severity: 'info',
  source: 'worker',
  mode: modeManager.getMode(),
  phase: `Phase ${PHASE}`,
  message: 'Runtime safety status at startup',
  details: {
    liveTradingEnabled: safetyStatus.liveTradingEnabled,
    autoTradingEnabled: safetyStatus.autoTradingEnabled,
    fullAutoLocked: safetyStatus.fullAutoLocked,
    limitedLiveLocked: safetyStatus.limitedLiveLocked,
    configValid: safetyStatus.configValid,
    unsafeFlagsDetected: safetyStatus.unsafeFlagsDetected,
  },
});

// ── 9. Log safe startup summary ───────────────────────────────────────────────
logSafetyStatus(logger, safetyStatus);

logger.info(
  {
    phase: `Phase ${PHASE} - ${PHASE_NAME}`,
    mode: modeManager.getMode(),
    configSummary: safeConfigSummary(config),
    tradingEnabled: false,
    autoTradingEnabled: false,
    signingEnabled: false,
    sendingEnabled: false,
    walletLoadingEnabled: false,
    solanaRpcEnabled: false,
    jitoEnabled: false,
    pumpfunTradingEnabled: false,
    fullAutoLocked: true,
    limitedLiveLocked: true,
  },
  'Worker safe startup complete',
);

// ── 10. Start heartbeat ────────────────────────────────────────────────────────
const heartbeat = setInterval(() => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  logWorkerHeartbeat(logger, uptimeSeconds, modeManager.getMode());
  auditRepo.record({
    eventType: 'SYSTEM_HEARTBEAT',
    severity: 'debug',
    source: 'worker',
    mode: modeManager.getMode(),
    phase: `Phase ${PHASE}`,
    message: `Worker heartbeat — uptime ${uptimeSeconds}s`,
    details: { uptimeSeconds },
  });
}, HEARTBEAT_INTERVAL_MS);

process.once('SIGINT', () => {
  clearInterval(heartbeat);
  logger.info('Worker shutting down');
  process.exit(0);
});

process.once('SIGTERM', () => {
  clearInterval(heartbeat);
  logger.info('Worker shutting down');
  process.exit(0);
});

// Silence unused import — InMemoryAuditLogger kept for type usage in fallback scenarios
void (InMemoryAuditLogger);
