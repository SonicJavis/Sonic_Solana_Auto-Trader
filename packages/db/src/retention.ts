import type { IAuditRepository } from './audit-repository.js';
import type { RetentionPolicy, RetentionResult, PersistentAuditEventInput } from './types.js';
import {
  RETENTION_DAYS_MIN,
  RETENTION_DAYS_MAX,
  RETENTION_MAX_EVENTS_MIN,
  RETENTION_MAX_EVENTS_MAX,
} from './types.js';

export type { RetentionPolicy, RetentionResult };

/**
 * Apply retention policy to the audit repository.
 *
 * If AUDIT_ROTATION_ENABLED=false → nothing is deleted.
 * If enabled:
 *   1. Delete events older than AUDIT_RETENTION_DAYS.
 *   2. If total > AUDIT_MAX_EVENTS, keep newest AUDIT_MAX_EVENTS rows.
 *
 * Records RETENTION_APPLIED (on success) or RETENTION_FAILED (on error).
 * RETENTION_FAILED is logged but does NOT cause a fatal error — the system
 * continues running; stale events may accumulate until next successful pass.
 *
 * @returns RetentionResult if succeeded, null if an error occurred.
 */
export function applyRetention(
  repo: IAuditRepository,
  policy: RetentionPolicy,
): RetentionResult | null {
  try {
    const result = repo.enforceRetention(policy);

    const retentionEvent: PersistentAuditEventInput = {
      eventType: 'RETENTION_APPLIED',
      severity: 'info',
      source: 'retention',
      message: `Retention applied: deleted ${result.totalDeleted} events (old=${result.deletedOld}, excess=${result.deletedExcess})`,
      details: {
        enabled: policy.enabled,
        retentionDays: policy.retentionDays,
        maxEvents: policy.maxEvents,
        deletedOld: result.deletedOld,
        deletedExcess: result.deletedExcess,
        totalDeleted: result.totalDeleted,
      },
    };

    repo.record(retentionEvent);
    return result;
  } catch (err: unknown) {
    // RETENTION_FAILED — warn but do not crash (fail-warn rather than fail-closed).
    // Stale events may accumulate; the audit DB remains functional.
    const message = err instanceof Error ? err.message : String(err);
    try {
      const failEvent: PersistentAuditEventInput = {
        eventType: 'RETENTION_FAILED',
        severity: 'warn',
        source: 'retention',
        message: `Retention failed: ${message}`,
        details: { error: message },
      };
      repo.record(failEvent);
    } catch {
      // If we can't even record the failure, swallow silently to avoid crash loops.
    }
    return null;
  }
}

/**
 * Build a RetentionPolicy from validated config values.
 */
export function buildRetentionPolicy(opts: {
  enabled: boolean;
  retentionDays: number;
  maxEvents: number;
}): RetentionPolicy {
  return {
    enabled: opts.enabled,
    retentionDays: Math.max(RETENTION_DAYS_MIN, Math.min(RETENTION_DAYS_MAX, opts.retentionDays)),
    maxEvents: Math.max(RETENTION_MAX_EVENTS_MIN, Math.min(RETENTION_MAX_EVENTS_MAX, opts.maxEvents)),
  };
}
