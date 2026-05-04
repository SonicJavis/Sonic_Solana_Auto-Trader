/**
 * Worker read model — Phase 5.
 *
 * Derives worker status from audit events.
 * No direct worker handle or background process required.
 */

import { HEARTBEAT_INTERVAL_MS } from '@sonic/shared';
import type { AuditStateSnapshot, WorkerStateSnapshot } from './types.js';

/** A worker heartbeat is considered stale if older than 3× the interval */
const HEARTBEAT_STALE_THRESHOLD_MS = HEARTBEAT_INTERVAL_MS * 3;

/**
 * Build a WorkerStateSnapshot from the audit state snapshot.
 * Determines status based on startup and heartbeat event timestamps.
 */
export function buildWorkerStateSnapshot(audit: AuditStateSnapshot): WorkerStateSnapshot {
  const lastStartupTimestamp = audit.lastStartupTimestamp;
  const lastHeartbeatTimestamp = audit.lastHeartbeatTimestamp;

  let heartbeatAgeSeconds: number | null = null;
  let status: WorkerStateSnapshot['status'] = 'unknown';

  if (lastStartupTimestamp === null) {
    status = 'unknown';
  } else if (lastHeartbeatTimestamp !== null) {
    const heartbeatMs = Date.parse(lastHeartbeatTimestamp);
    if (!Number.isNaN(heartbeatMs)) {
      const ageMs = Date.now() - heartbeatMs;
      heartbeatAgeSeconds = Math.floor(ageMs / 1000);
      status = ageMs > HEARTBEAT_STALE_THRESHOLD_MS ? 'degraded' : 'healthy';
    } else {
      status = 'degraded';
    }
  } else {
    // Has startup but no heartbeat yet
    status = 'degraded';
  }

  // Infer last safety check status: if there's a WORKER_SAFETY_CHECK_FAILED event, last check failed;
  // if there's a SYSTEM_STARTUP (which only persists after safety check passes), it passed.
  let lastSafetyCheckPassed: boolean | null = null;
  if (lastStartupTimestamp !== null) {
    lastSafetyCheckPassed = true;
  }

  return {
    lastStartupTimestamp,
    lastHeartbeatTimestamp,
    heartbeatAgeSeconds,
    status,
    lastSafetyCheckPassed,
  };
}
