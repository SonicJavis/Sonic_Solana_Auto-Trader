/**
 * Telegram /system command formatters — Phase 5 / Phase 7E.
 *
 * All formatters produce secret-safe output.
 * No raw secrets, tokens, DATABASE_URL, or detailsJson are ever displayed.
 */

import type {
  SystemStateSnapshot,
  ConfigStateSnapshot,
  WorkerStateSnapshot,
  AuditStateSnapshot,
  RuntimeSafetyStateSnapshot,
  SystemReadiness,
  EventEngineReadinessSnapshot,
  Phase8ReadinessGate,
} from '@sonic/state';

const READINESS_ICONS: Record<SystemReadiness, string> = {
  ready: '✅',
  degraded: '⚠️',
  unsafe: '🚨',
  unknown: '❓',
};

function fmtTs(ts: string | null | undefined): string {
  if (!ts) return 'none';
  return ts.replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

/** Format the default /system output (overview) */
export function formatSystemOverview(snapshot: SystemStateSnapshot): string {
  const readinessIcon = READINESS_ICONS[snapshot.readiness];
  const lines = [
    '⚙️ System State',
    '',
    `App: Sonic Solana Auto-Trader`,
    `Version: ${snapshot.appVersion}`,
    `Phase: ${snapshot.phase} — ${snapshot.phaseName}`,
    `Mode: ${snapshot.currentMode}`,
    `App mode (config): ${snapshot.appMode}`,
    `Safety profile: ${snapshot.safetyProfile}`,
    '',
    `Readiness: ${readinessIcon} ${snapshot.readiness.toUpperCase()}`,
    '',
    `DB available: ${snapshot.databaseStatus.available}`,
    `Audit events total: ${snapshot.auditStats.total}`,
    `Last startup: ${fmtTs(snapshot.auditStats.lastStartupTimestamp)}`,
    `Last heartbeat: ${fmtTs(snapshot.auditStats.lastHeartbeatTimestamp)}`,
    `Worker status: ${snapshot.workerStatus.status}`,
    '',
    `FULL_AUTO locked: ${snapshot.runtimeSafetyStatus.fullAutoLocked}`,
    `LIMITED_LIVE locked: ${snapshot.runtimeSafetyStatus.limitedLiveLocked}`,
    `Unsafe flags detected: ${snapshot.runtimeSafetyStatus.unsafeFlagsDetected}`,
    '',
    `Generated: ${fmtTs(snapshot.generatedAt)}`,
    '',
    'Use /system help for subcommands.',
  ];
  return lines.join('\n');
}

/** Format /system health */
export function formatSystemHealth(snapshot: SystemStateSnapshot): string {
  const readinessIcon = READINESS_ICONS[snapshot.readiness];
  const lines = [
    `${readinessIcon} System Health`,
    '',
    `Readiness: ${snapshot.readiness.toUpperCase()}`,
    `Worker status: ${snapshot.workerStatus.status}`,
    `DB available: ${snapshot.databaseStatus.available}`,
    `Audit total: ${snapshot.auditStats.total}`,
    '',
    `Recent warnings: ${snapshot.auditStats.recentWarnCount}`,
    `Recent errors: ${snapshot.auditStats.recentErrorCount}`,
    `Recent critical: ${snapshot.auditStats.recentCriticalCount}`,
    '',
    `Last startup: ${fmtTs(snapshot.auditStats.lastStartupTimestamp)}`,
    `Last heartbeat: ${fmtTs(snapshot.auditStats.lastHeartbeatTimestamp)}`,
    `Heartbeat age: ${snapshot.workerStatus.heartbeatAgeSeconds !== null ? `${snapshot.workerStatus.heartbeatAgeSeconds}s` : 'unknown'}`,
  ];
  return lines.join('\n');
}

/** Format /system safety */
export function formatSystemSafety(snapshot: SystemStateSnapshot): string {
  const safety: RuntimeSafetyStateSnapshot = snapshot.runtimeSafetyStatus;
  const lines = [
    '🛡️ Runtime Safety Status',
    '',
    `Safety check passed: ${safety.safetyCheckPassed}`,
    `Config valid: ${safety.configValid}`,
    `FULL_AUTO locked: ${safety.fullAutoLocked}`,
    `LIMITED_LIVE locked: ${safety.limitedLiveLocked}`,
    `Kill switch active: ${safety.killSwitchActive}`,
    '',
    `Locked modes: ${snapshot.lockedModes.join(', ')}`,
    `Current mode: ${snapshot.currentMode}`,
    '',
    'Unsafe capabilities (all disabled):',
    `  Live trading: ${safety.liveTradingEnabled}`,
    `  Auto trading: ${safety.autoTradingEnabled}`,
    '',
    `Unsafe flags detected: ${safety.unsafeFlagsDetected}`,
    ...(safety.unsafeFlags.length > 0
      ? [`Unsafe flags: ${safety.unsafeFlags.join(', ')} (capabilities remain disabled)`]
      : []),
    ...(safety.warnings.length > 0
      ? ['', 'Warnings:', ...safety.warnings.map((w) => `  ⚠️ ${w}`)]
      : []),
  ];
  return lines.join('\n');
}

/** Format /system audit */
export function formatSystemAudit(audit: AuditStateSnapshot): string {
  const lines = [
    '📊 Audit State',
    '',
    `Available: ${audit.available}`,
    `Total events: ${audit.total}`,
    `Oldest: ${fmtTs(audit.oldest)}`,
    `Newest: ${fmtTs(audit.newest)}`,
    '',
    `Recent warnings: ${audit.recentWarnCount}`,
    `Recent errors: ${audit.recentErrorCount}`,
    `Recent critical: ${audit.recentCriticalCount}`,
    '',
    `Last startup event: ${fmtTs(audit.lastStartupTimestamp)}`,
    `Last heartbeat event: ${fmtTs(audit.lastHeartbeatTimestamp)}`,
    `Last unsafe flags event: ${fmtTs(audit.lastUnsafeFlagsTimestamp)}`,
  ];

  if (Object.keys(audit.bySeverity).length > 0) {
    lines.push('', 'By severity:');
    for (const [sev, count] of Object.entries(audit.bySeverity).sort((a, b) => b[1] - a[1])) {
      lines.push(`  ${sev}: ${count}`);
    }
  }

  return lines.join('\n');
}

/** Format /system worker */
export function formatSystemWorker(worker: WorkerStateSnapshot): string {
  const lines = [
    '🔧 Worker Status',
    '',
    `Status: ${worker.status}`,
    `Last startup: ${fmtTs(worker.lastStartupTimestamp)}`,
    `Last heartbeat: ${fmtTs(worker.lastHeartbeatTimestamp)}`,
    `Heartbeat age: ${worker.heartbeatAgeSeconds !== null ? `${worker.heartbeatAgeSeconds}s` : 'unknown'}`,
    `Last safety check passed: ${worker.lastSafetyCheckPassed !== null ? String(worker.lastSafetyCheckPassed) : 'unknown'}`,
  ];
  return lines.join('\n');
}

/** Format /system config */
export function formatSystemConfig(config: ConfigStateSnapshot): string {
  const lines = [
    '🔧 Config Summary',
    '',
    `App version: ${config.appVersion}`,
    `Phase: ${config.phase}`,
    `App mode: ${config.appMode}`,
    `Safety profile: ${config.safetyProfile}`,
    '',
    `Database path: ${config.databasePathStatus}`,
    `Audit retention days: ${config.auditRetentionDays}`,
    `Audit max events: ${config.auditMaxEvents}`,
    `Audit rotation enabled: ${config.auditRotationEnabled}`,
    '',
    `Telegram configured: ${config.telegramConfigured}`,
    `Admin IDs configured: ${config.adminCount > 0 ? `${config.adminCount} configured` : 'none'}`,
    '',
    'Note: Telegram token and database credentials are never displayed.',
  ];
  return lines.join('\n');
}

/** Format /system help */
export function formatSystemHelp(): string {
  return [
    '⚙️ /system — System State Commands',
    '',
    '/system          — System overview (phase, mode, readiness)',
    '/system health   — Health and readiness details',
    '/system safety   — Runtime safety locks and flags',
    '/system audit    — Audit log statistics',
    '/system worker   — Worker startup and heartbeat status',
    '/system config   — Safe config summary',
    '/system engine   — Event Engine readiness (local/disabled only)',
    '/system phase8   — Phase 8 Token Intelligence readiness gate',
    '/system help     — Show this help',
    '',
    'No secrets, tokens, or raw details are ever shown.',
    'FULL_AUTO and LIMITED_LIVE remain locked.',
  ].join('\n');
}

/** Format /system engine — Event Engine readiness (Phase 7E) */
export function formatSystemEngine(snapshot: EventEngineReadinessSnapshot): string {
  const summary = snapshot.providerReadinessSummary;
  const lines = [
    '🔌 Event Engine Status',
    '',
    `Event Engine core: ${snapshot.eventEngineCore}`,
    `In-memory bus: ${snapshot.inMemoryBus}`,
    `Mock providers: ${snapshot.mockProviders}`,
    `Fixture replay: ${snapshot.fixtureReplay}`,
    `Disabled providers: ${snapshot.disabledProviders}`,
    '',
    'Provider readiness:',
    `  Overall: ${summary.overallReadiness}`,
    `  Provider count: ${summary.providerCount}`,
    `  Unsafe requests: ${summary.unsafeProviderCount}`,
    `  Enabled: ${summary.enabledProviderCount}`,
    `  Live: ${summary.liveProviderCount}`,
    `  Network: ${summary.networkProviderCount}`,
    '',
    `Live providers: ${snapshot.liveProviders}`,
    `Network access: ${snapshot.networkAccess}`,
    `Solana RPC: ${snapshot.solanaRpc}`,
    `Execution triggers: ${snapshot.executionTriggers}`,
    `Wallet access: ${snapshot.walletAccess}`,
    `API key usage: ${snapshot.apiKeyUsage}`,
    '',
    `Phase 8 readiness: ${snapshot.phase8Readiness.readyForTokenIntelligence ? '✅ ready (Token Intelligence models only)' : '⛔ not ready'}`,
    '',
    `Generated: ${fmtTs(snapshot.generatedAt)}`,
  ];
  return lines.join('\n');
}

/** Format /system phase8 — Phase 8 Token Intelligence readiness gate (Phase 7E) */
export function formatPhase8Readiness(gate: Phase8ReadinessGate): string {
  const ready = gate.readyForTokenIntelligence;
  const lines = [
    `${ready ? '✅' : '⛔'} Phase 8 Token Intelligence Readiness`,
    '',
    `Ready for Token Intelligence models: ${ready}`,
    '',
    'IMPORTANT: Phase 8 readiness means ready to build Token Intelligence',
    'models locally. It does NOT mean ready for live data, market ingestion,',
    'wallet access, signing, sending, or trade execution.',
    '',
  ];

  if (gate.blockers.length > 0) {
    lines.push('Blockers:');
    for (const b of gate.blockers) {
      lines.push(`  ⛔ ${b}`);
    }
    lines.push('');
  }

  if (gate.warnings.length > 0) {
    lines.push('Warnings:');
    for (const w of gate.warnings) {
      lines.push(`  ⚠️ ${w}`);
    }
    lines.push('');
  }

  lines.push('Required foundations:');
  for (const f of gate.requiredCompletedPhases) {
    lines.push(`  ✓ ${f}`);
  }

  lines.push('', 'Required safety conditions:');
  for (const s of gate.requiredSafetyConditions) {
    lines.push(`  🔒 ${s}`);
  }

  lines.push('', `Generated: ${fmtTs(gate.generatedAt)}`);
  return lines.join('\n');
}

/** Format an unknown subcommand response */
export function formatSystemUnknown(sub: string): string {
  return [
    `Unknown /system subcommand: ${sub}`,
    '',
    'Supported: health, safety, audit, worker, config, engine, phase8, help',
    'Use /system help for details.',
  ].join('\n');
}
