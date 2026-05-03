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
import { InMemoryAuditLogger } from '@sonic/db';
import { ModeManager } from '@sonic/mode-manager';
import {
  APP_VERSION,
  HEARTBEAT_INTERVAL_MS,
  PHASE,
  PHASE_NAME,
  buildRuntimeSafetyStatus,
} from '@sonic/shared';

const startTime = Date.now();

// 1. Load config safely
const configResult = loadConfigWithResult();
const config = configResult.config;

// 2. Create redacted logger
const logger = createLogger({ level: config.LOG_LEVEL, name: 'worker' });

logAppStart(logger, APP_VERSION, config.APP_MODE);
logConfigValidated(logger, configResult.valid);

if (!configResult.valid) {
  logger.warn({ warnings: configResult.warnings }, 'Config validation failed — safe defaults applied');
}

if (configResult.unsafeFlagsDetected) {
  logUnsafeFlagsDetected(logger, configResult.unsafeFlags);
}

// 3. Load mode manager
const auditLogger = new InMemoryAuditLogger();
const modeManager = new ModeManager(auditLogger, config.APP_MODE);

logModeLoaded(logger, modeManager.getMode());

// 4. Build runtime safety status
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
  databaseConfigured: config.DATABASE_URL !== '',
});

// 5. Safety check — fail closed if critical safety invariants are violated
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
  process.exit(1);
}

logWorkerSafetyCheckPassed(logger);

// 6. Log safe startup summary
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

// 7. Start heartbeat
const heartbeat = setInterval(() => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  logWorkerHeartbeat(logger, uptimeSeconds, modeManager.getMode());
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
