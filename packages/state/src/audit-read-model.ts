/**
 * Audit read model — Phase 5.
 *
 * Derives structured state from the audit repository.
 * Never exposes raw detailsJson. Read-only.
 */

import type { IAuditRepository } from '@sonic/db';
import type { AuditStateSnapshot } from './types.js';

/** How many recent events to scan for warn/error/critical counts */
const RECENT_SCAN_LIMIT = 200;

/** Find the most recent record with the given eventType */
function findLastByType(
  repo: IAuditRepository,
  eventType: string,
): string | null {
  const records = repo.query({ eventType, limit: 1 });
  return records[0]?.timestamp ?? null;
}

/**
 * Build an AuditStateSnapshot from the audit repository.
 * All data is derived from stored events — no raw secrets or detailsJson exposed.
 */
export function buildAuditStateSnapshot(repo: IAuditRepository): AuditStateSnapshot {
  let available = false;
  let total = 0;
  let bySeverity: Record<string, number> = {};
  let oldest: string | null = null;
  let newest: string | null = null;
  let recentWarnCount = 0;
  let recentErrorCount = 0;
  let recentCriticalCount = 0;
  let lastStartupTimestamp: string | null = null;
  let lastHeartbeatTimestamp: string | null = null;
  let lastUnsafeFlagsTimestamp: string | null = null;

  try {
    const stats = repo.getStats();
    available = true;
    total = stats.total;
    bySeverity = { ...stats.bySeverity };
    oldest = stats.oldest;
    newest = stats.newest;

    // Count recent warn/error/critical
    const recent = repo.listRecent(RECENT_SCAN_LIMIT);
    for (const r of recent) {
      if (r.severity === 'warn') recentWarnCount++;
      else if (r.severity === 'error') recentErrorCount++;
      else if (r.severity === 'critical') recentCriticalCount++;
    }

    lastStartupTimestamp = findLastByType(repo, 'SYSTEM_STARTUP');
    lastHeartbeatTimestamp = findLastByType(repo, 'SYSTEM_HEARTBEAT');
    lastUnsafeFlagsTimestamp = findLastByType(repo, 'UNSAFE_FLAGS_DETECTED');
  } catch {
    available = false;
  }

  return {
    available,
    total,
    bySeverity,
    recentWarnCount,
    recentErrorCount,
    recentCriticalCount,
    lastStartupTimestamp,
    lastHeartbeatTimestamp,
    lastUnsafeFlagsTimestamp,
    oldest,
    newest,
  };
}
