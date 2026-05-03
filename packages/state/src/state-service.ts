/**
 * State service — Phase 5.
 *
 * Builds a complete SystemStateSnapshot from the system's current state.
 * Aggregates all read models into a single safe, read-only snapshot.
 */

import type { AppConfig } from '@sonic/config';
import type { IAuditRepository } from '@sonic/db';
import type { AppMode, RuntimeSafetyStatus } from '@sonic/shared';
import { APP_VERSION, LOCKED_MODES, PHASE, PHASE_NAME } from '@sonic/shared';
import { buildAuditStateSnapshot } from './audit-read-model.js';
import { buildModeStateSnapshot } from './mode-read-model.js';
import { buildWorkerStateSnapshot } from './worker-read-model.js';
import { calculateReadiness } from './health-read-model.js';
import type {
  SystemStateSnapshot,
  RuntimeSafetyStateSnapshot,
  DatabaseStateSnapshot,
  UnsafeFlagStateSnapshot,
} from './types.js';

export interface BuildSystemStateSnapshotOpts {
  readonly auditRepo: IAuditRepository;
  readonly config: AppConfig;
  readonly currentMode: AppMode;
  readonly runtimeSafetyStatus: RuntimeSafetyStatus;
  readonly killSwitchActive: boolean;
}

/** Build a RuntimeSafetyStateSnapshot from a RuntimeSafetyStatus */
function buildRuntimeSafetyStateSnapshot(
  status: RuntimeSafetyStatus,
): RuntimeSafetyStateSnapshot {
  const safetyCheckPassed =
    !status.liveTradingEnabled &&
    !status.autoTradingEnabled &&
    !status.transactionSigningEnabled &&
    !status.transactionSendingEnabled &&
    !status.walletLoadingEnabled &&
    !status.solanaRpcEnabled &&
    !status.jitoEnabled &&
    !status.pumpfunTradingEnabled &&
    status.fullAutoLocked &&
    status.limitedLiveLocked;

  return {
    configValid: status.configValid,
    unsafeFlagsDetected: status.unsafeFlagsDetected,
    unsafeFlags: status.unsafeFlags,
    warnings: status.warnings,
    fullAutoLocked: status.fullAutoLocked,
    limitedLiveLocked: status.limitedLiveLocked,
    killSwitchActive: status.killSwitchActive,
    // Always false — belt-and-suspenders type assertion
    liveTradingEnabled: false,
    autoTradingEnabled: false,
    safetyCheckPassed,
  };
}

/** Build a DatabaseStateSnapshot */
function buildDatabaseStateSnapshot(
  config: AppConfig,
  auditTotal: number,
  available: boolean,
): DatabaseStateSnapshot {
  return {
    available,
    path: config.DATABASE_PATH,
    totalEvents: auditTotal,
  };
}

/** Build an UnsafeFlagStateSnapshot */
function buildUnsafeFlagStateSnapshot(
  runtimeSafety: RuntimeSafetyStatus,
  lastDetectedTimestamp: string | null,
): UnsafeFlagStateSnapshot {
  return {
    detected: runtimeSafety.unsafeFlagsDetected,
    flags: runtimeSafety.unsafeFlags,
    lastDetectedTimestamp,
  };
}

/**
 * Build a complete SystemStateSnapshot.
 * Safe for display — no raw secrets, tokens, DATABASE_URL, or detailsJson.
 */
export function buildSystemStateSnapshot(
  opts: BuildSystemStateSnapshotOpts,
): SystemStateSnapshot {
  const auditState = buildAuditStateSnapshot(opts.auditRepo);
  const modeState = buildModeStateSnapshot(opts.currentMode, opts.killSwitchActive);
  const workerState = buildWorkerStateSnapshot(auditState);
  const runtimeSafetyState = buildRuntimeSafetyStateSnapshot(opts.runtimeSafetyStatus);
  const dbState = buildDatabaseStateSnapshot(opts.config, auditState.total, auditState.available);
  const unsafeFlagState = buildUnsafeFlagStateSnapshot(
    opts.runtimeSafetyStatus,
    auditState.lastUnsafeFlagsTimestamp,
  );

  const readiness = calculateReadiness({
    runtimeSafety: runtimeSafetyState,
    audit: auditState,
    worker: workerState,
    mode: modeState,
  });

  return {
    phase: PHASE,
    phaseName: PHASE_NAME,
    appVersion: APP_VERSION,
    appMode: opts.config.APP_MODE,
    safetyProfile: opts.config.SAFETY_PROFILE,
    generatedAt: new Date().toISOString(),
    currentMode: opts.currentMode,
    lockedModes: [...LOCKED_MODES],
    runtimeSafetyStatus: runtimeSafetyState,
    databaseStatus: dbState,
    auditStats: auditState,
    workerStatus: workerState,
    unsafeFlagSummary: unsafeFlagState,
    readiness,
  };
}
