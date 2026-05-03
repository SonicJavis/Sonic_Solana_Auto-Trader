/**
 * Phase 5 state snapshot types.
 *
 * All types are read-only summaries — no raw secrets, no raw detailsJson,
 * no private keys, no DB handles, no mutable state.
 */

/** System readiness values */
export type SystemReadiness = 'ready' | 'degraded' | 'unsafe' | 'unknown';

/**
 * Top-level system state snapshot.
 * Safe for display in Telegram or any control-plane UI.
 * Never contains raw secrets, tokens, DATABASE_URL, or detailsJson.
 */
export interface SystemStateSnapshot {
  readonly phase: number;
  readonly phaseName: string;
  readonly appVersion: string;
  readonly appMode: string;
  readonly safetyProfile: string;
  readonly generatedAt: string;
  readonly currentMode: string;
  readonly lockedModes: readonly string[];
  readonly runtimeSafetyStatus: RuntimeSafetyStateSnapshot;
  readonly databaseStatus: DatabaseStateSnapshot;
  readonly auditStats: AuditStateSnapshot;
  readonly workerStatus: WorkerStateSnapshot;
  readonly unsafeFlagSummary: UnsafeFlagStateSnapshot;
  readonly readiness: SystemReadiness;
}

/**
 * Safe config summary for control-plane read models.
 * Never exposes raw tokens, DATABASE_URL, or credential-like values.
 */
export interface ConfigStateSnapshot {
  readonly appVersion: string;
  readonly appMode: string;
  readonly safetyProfile: string;
  readonly phase: number;
  /** Whether the configured DATABASE_PATH looks like a local path (safe to display) */
  readonly databasePathStatus: string;
  readonly auditRetentionDays: number;
  readonly auditMaxEvents: number;
  readonly auditRotationEnabled: boolean;
  /** Count of configured admin IDs — never the IDs themselves */
  readonly adminCount: number;
  readonly telegramConfigured: boolean;
}

/**
 * Safe mode status snapshot.
 * Reports current mode, allowed safe modes, and locked modes.
 * Never mutates mode state.
 */
export interface ModeStateSnapshot {
  readonly currentMode: string;
  readonly allowedSafeModes: readonly string[];
  readonly lockedModes: readonly string[];
  readonly fullAutoLocked: boolean;
  readonly limitedLiveLocked: boolean;
  /** 'safe' if current mode is a safe mode; 'locked' if kill switch active; 'unsafe' otherwise */
  readonly modeSafetyStatus: 'safe' | 'unsafe' | 'locked';
}

/**
 * Safe runtime safety status snapshot.
 * All unsafe capability flags remain false. All lock flags remain true.
 * Never exposes raw secrets or unsafe state.
 */
export interface RuntimeSafetyStateSnapshot {
  readonly configValid: boolean;
  readonly unsafeFlagsDetected: boolean;
  readonly unsafeFlags: readonly string[];
  readonly warnings: readonly string[];
  readonly fullAutoLocked: boolean;
  readonly limitedLiveLocked: boolean;
  readonly killSwitchActive: boolean;
  readonly liveTradingEnabled: false;
  readonly autoTradingEnabled: false;
  readonly safetyCheckPassed: boolean;
}

/**
 * Audit/event-store state snapshot.
 * Shows aggregate counts and last-event timestamps only.
 * Never exposes raw detailsJson.
 */
export interface AuditStateSnapshot {
  readonly available: boolean;
  readonly total: number;
  readonly bySeverity: Readonly<Record<string, number>>;
  readonly recentWarnCount: number;
  readonly recentErrorCount: number;
  readonly recentCriticalCount: number;
  readonly lastStartupTimestamp: string | null;
  readonly lastHeartbeatTimestamp: string | null;
  readonly lastUnsafeFlagsTimestamp: string | null;
  readonly oldest: string | null;
  readonly newest: string | null;
}

/**
 * Worker boot/heartbeat state snapshot.
 * Derived from audit events — no direct worker handle.
 */
export interface WorkerStateSnapshot {
  readonly lastStartupTimestamp: string | null;
  readonly lastHeartbeatTimestamp: string | null;
  /** Age in seconds since the last heartbeat, or null if none recorded */
  readonly heartbeatAgeSeconds: number | null;
  readonly status: 'healthy' | 'degraded' | 'unknown';
  /** Whether the last persisted safety check event reported success, or null if none */
  readonly lastSafetyCheckPassed: boolean | null;
}

/**
 * Database availability summary.
 * Never exposes raw DATABASE_URL.
 */
export interface DatabaseStateSnapshot {
  readonly available: boolean;
  /** Safe local filesystem path display (not DATABASE_URL) */
  readonly path: string;
  readonly totalEvents: number;
}

/**
 * Unsafe flag summary.
 * Shows detection state and last detection timestamp — never activates anything.
 */
export interface UnsafeFlagStateSnapshot {
  readonly detected: boolean;
  readonly flags: readonly string[];
  readonly lastDetectedTimestamp: string | null;
}
