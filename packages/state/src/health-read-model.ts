/**
 * Health / readiness read model — Phase 5.
 *
 * Calculates SystemReadiness from the system state components.
 * Rules are documented, simple, and tested.
 */

import type { RuntimeSafetyStateSnapshot, AuditStateSnapshot, WorkerStateSnapshot, ModeStateSnapshot, SystemReadiness } from './types.js';

export interface ReadinessInput {
  readonly runtimeSafety: RuntimeSafetyStateSnapshot;
  readonly audit: AuditStateSnapshot;
  readonly worker: WorkerStateSnapshot;
  readonly mode: ModeStateSnapshot;
}

/**
 * Calculate system readiness from component snapshots.
 *
 * Rules (evaluated in priority order):
 *
 * unsafe:
 *   - runtime safety check failed
 *   - FULL_AUTO or LIMITED_LIVE appears unlocked
 *   - audit/database unavailable (when a startup event exists, meaning DB was once OK)
 *
 * degraded:
 *   - no recent heartbeat (worker status is 'degraded')
 *   - recent warn, error, or critical events exist
 *
 * ready:
 *   - safe mode, DB/audit available, runtime safety passed, locked modes locked, worker healthy
 *
 * unknown:
 *   - insufficient data (no startup event recorded)
 */
export function calculateReadiness(input: ReadinessInput): SystemReadiness {
  const { runtimeSafety, audit, worker, mode } = input;

  // unsafe: safety check failed
  if (!runtimeSafety.safetyCheckPassed) return 'unsafe';

  // unsafe: locked modes not locked
  if (!runtimeSafety.fullAutoLocked || !runtimeSafety.limitedLiveLocked) return 'unsafe';
  if (!mode.fullAutoLocked || !mode.limitedLiveLocked) return 'unsafe';

  // unsafe: live/auto trading enabled (should always be false, belt-and-suspenders)
  if (runtimeSafety.liveTradingEnabled || runtimeSafety.autoTradingEnabled) return 'unsafe';

  // unsafe: audit DB unavailable after a startup event was recorded
  if (!audit.available && audit.lastStartupTimestamp !== null) return 'unsafe';

  // unknown: no startup event has ever been recorded
  if (audit.lastStartupTimestamp === null) return 'unknown';

  // degraded: worker status is degraded or unknown
  if (worker.status === 'degraded' || worker.status === 'unknown') return 'degraded';

  // degraded: recent warn/error/critical events
  if (audit.recentWarnCount > 0 || audit.recentErrorCount > 0 || audit.recentCriticalCount > 0) {
    return 'degraded';
  }

  // ready: all conditions met
  return 'ready';
}
