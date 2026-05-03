import { randomUUID } from 'crypto';
import { eq, lt, desc, gte, lte, count as drizzleCount, and, type SQL } from 'drizzle-orm';
import { redactObject, safeStringify, redactString } from '@sonic/config';
import type { AuditEvent } from '@sonic/shared';
import type { DbClient } from './client.js';
import { auditEvents } from './schema.js';
import type {
  AuditLogRecord,
  PersistentAuditEventInput,
  PersistentAuditRecord,
  AuditQueryFilters,
  RetentionPolicy,
  RetentionResult,
  AuditStats,
} from './types.js';
import type { IAuditLogger } from './audit-logger.js';

/** Maximum allowed query limit to prevent runaway queries */
const MAX_QUERY_LIMIT = 1_000;
/** Default query limit */
const DEFAULT_QUERY_LIMIT = 100;

/**
 * Extended audit repository interface.
 * Extends IAuditLogger for backward compat (ModeManager, etc. still accept IAuditLogger).
 * Adds persistent query, stats, and retention capabilities.
 */
export interface IAuditRepository extends IAuditLogger {
  /** Record a new audit event from Phase 4 structured input */
  record(input: PersistentAuditEventInput): void;
  /** List recent events, newest-first */
  listRecent(limit?: number): PersistentAuditRecord[];
  /** Query events by filter criteria */
  query(filters: AuditQueryFilters): PersistentAuditRecord[];
  /** Count events matching optional filters */
  count(filters?: AuditQueryFilters): number;
  /** Delete events older than the given cutoff date. Returns deleted count. */
  deleteOlderThan(cutoff: Date): number;
  /** Enforce retention policy. Returns deletion counts. */
  enforceRetention(policy: RetentionPolicy): RetentionResult;
  /** Get aggregate statistics */
  getStats(): AuditStats;
}

/** Redact sensitive data from details before persistence. */
function redactDetails(details: Record<string, unknown> | undefined): string | null {
  if (details === undefined) return null;
  try {
    const redacted = redactObject(details);
    return safeStringify(redacted);
  } catch {
    return null;
  }
}

/** Redact sensitive data from safeSummary before persistence. */
function redactSafeSummary(summary: string | undefined): string | null {
  if (summary === undefined || summary === null) return null;
  // Ensure safeSummary does not contain raw secret patterns
  return redactString(summary);
}

/** Convert a DB row to PersistentAuditRecord */
function rowToRecord(row: typeof auditEvents.$inferSelect): PersistentAuditRecord {
  return {
    id: row.id,
    timestamp: row.timestamp,
    phase: row.phase ?? null,
    eventType: row.eventType,
    severity: row.severity,
    source: row.source ?? null,
    mode: row.mode ?? null,
    message: row.message,
    detailsJson: row.detailsJson ?? null,
    safeSummary: row.safeSummary ?? null,
    createdAt: row.createdAt,
  };
}

/** Convert a PersistentAuditRecord to AuditLogRecord for backward compat */
function recordToLegacy(record: PersistentAuditRecord): AuditLogRecord {
  return {
    id: record.id,
    timestamp: record.timestamp,
    eventType: record.eventType,
    severity: (record.severity === 'warn' || record.severity === 'error') ? record.severity : 'info',
    details: record.detailsJson ?? '{}',
  };
}

/** Clamp a limit value to the allowed bounds */
function clampLimit(limit: number | undefined, defaultVal: number): number {
  if (limit === undefined || limit === null) return defaultVal;
  if (!Number.isFinite(limit) || limit < 1) return 1;
  return Math.min(limit, MAX_QUERY_LIMIT);
}

/** Clamp offset to non-negative */
function clampOffset(offset: number | undefined): number {
  if (offset === undefined || offset === null) return 0;
  if (!Number.isFinite(offset) || offset < 0) return 0;
  return offset;
}

/**
 * SQLite-backed persistent audit repository.
 *
 * All details and safeSummary are redacted before storage — raw secrets are never persisted.
 * Uses drizzle-orm with better-sqlite3 (synchronous driver).
 * Implements IAuditRepository and IAuditLogger for full backward compatibility.
 */
export class SqliteAuditRepository implements IAuditRepository {
  constructor(private readonly db: DbClient) {}

  // ─── IAuditRepository: record ────────────────────────────────────────────

  /** Record a new audit event from structured input. Redacts before storage. */
  record(input: PersistentAuditEventInput): void {
    const id = randomUUID();
    const timestamp = input.timestamp ?? new Date().toISOString();
    const createdAt = new Date().toISOString();

    // Redact details and safeSummary before persistence
    const detailsJson = redactDetails(input.details);
    const safeSummary = redactSafeSummary(input.safeSummary);

    this.db.insert(auditEvents).values({
      id,
      timestamp,
      phase: input.phase ?? null,
      eventType: input.eventType,
      severity: input.severity,
      source: input.source ?? null,
      mode: input.mode ?? null,
      message: input.message,
      detailsJson,
      safeSummary,
      createdAt,
    }).run();
  }

  // ─── IAuditLogger: log (backward compat) ─────────────────────────────────

  /**
   * Bridge from the old AuditEvent interface.
   * Maps eventType, severity, and details to the persistent format.
   * Implements IAuditLogger for backward compat.
   */
  async log(event: AuditEvent): Promise<void> {
    this.record({
      eventType: event.eventType,
      severity: event.severity === 'warn' ? 'warn'
        : event.severity === 'error' ? 'error'
        : 'info',
      message: event.eventType,
      details: event.details,
      timestamp: event.timestamp,
    });
  }

  // ─── IAuditLogger: getRecent (backward compat) ────────────────────────────

  async getRecent(limit = 100): Promise<AuditLogRecord[]> {
    return this.listRecent(limit).map(recordToLegacy);
  }

  // ─── IAuditRepository: listRecent ────────────────────────────────────────

  listRecent(limit?: number): PersistentAuditRecord[] {
    const safeLimit = clampLimit(limit, DEFAULT_QUERY_LIMIT);
    const rows = this.db
      .select()
      .from(auditEvents)
      .orderBy(desc(auditEvents.timestamp))
      .limit(safeLimit)
      .all();
    return rows.map(rowToRecord);
  }

  // ─── IAuditRepository: query ──────────────────────────────────────────────

  query(filters: AuditQueryFilters): PersistentAuditRecord[] {
    const safeLimit = clampLimit(filters.limit, DEFAULT_QUERY_LIMIT);
    const safeOffset = clampOffset(filters.offset);

    const conditions: SQL[] = [];
    if (filters.eventType !== undefined) {
      conditions.push(eq(auditEvents.eventType, filters.eventType));
    }
    if (filters.severity !== undefined) {
      conditions.push(eq(auditEvents.severity, filters.severity));
    }
    if (filters.source !== undefined) {
      conditions.push(eq(auditEvents.source, filters.source));
    }
    if (filters.mode !== undefined) {
      conditions.push(eq(auditEvents.mode, filters.mode));
    }
    if (filters.timestampFrom !== undefined) {
      conditions.push(gte(auditEvents.timestamp, filters.timestampFrom));
    }
    if (filters.timestampTo !== undefined) {
      conditions.push(lte(auditEvents.timestamp, filters.timestampTo));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = this.db
      .select()
      .from(auditEvents)
      .where(where)
      .orderBy(desc(auditEvents.timestamp))
      .limit(safeLimit)
      .offset(safeOffset)
      .all();

    return rows.map(rowToRecord);
  }

  // ─── IAuditRepository: count ──────────────────────────────────────────────

  count(filters?: AuditQueryFilters): number {
    const conditions: SQL[] = [];
    if (filters?.eventType !== undefined) {
      conditions.push(eq(auditEvents.eventType, filters.eventType));
    }
    if (filters?.severity !== undefined) {
      conditions.push(eq(auditEvents.severity, filters.severity));
    }
    if (filters?.source !== undefined) {
      conditions.push(eq(auditEvents.source, filters.source));
    }
    if (filters?.mode !== undefined) {
      conditions.push(eq(auditEvents.mode, filters.mode));
    }
    if (filters?.timestampFrom !== undefined) {
      conditions.push(gte(auditEvents.timestamp, filters.timestampFrom));
    }
    if (filters?.timestampTo !== undefined) {
      conditions.push(lte(auditEvents.timestamp, filters.timestampTo));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = this.db
      .select({ count: drizzleCount() })
      .from(auditEvents)
      .where(where)
      .get();

    return result?.count ?? 0;
  }

  // ─── IAuditRepository: deleteOlderThan ───────────────────────────────────

  deleteOlderThan(cutoff: Date): number {
    const cutoffIso = cutoff.toISOString();
    const result = this.db
      .delete(auditEvents)
      .where(lt(auditEvents.timestamp, cutoffIso))
      .run();
    return result.changes;
  }

  // ─── IAuditRepository: enforceRetention ──────────────────────────────────

  enforceRetention(policy: RetentionPolicy): RetentionResult {
    if (!policy.enabled) {
      return { deletedOld: 0, deletedExcess: 0, totalDeleted: 0 };
    }

    // 1. Delete events older than retentionDays
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - policy.retentionDays);
    const deletedOld = this.deleteOlderThan(cutoff);

    // 2. If total still exceeds maxEvents, delete oldest excess
    const total = this.count();
    let deletedExcess = 0;
    if (total > policy.maxEvents) {
      const excess = total - policy.maxEvents;
      // Find the cutoff timestamp for the Nth oldest row
      const cutoffRow = this.db
        .select({ timestamp: auditEvents.timestamp })
        .from(auditEvents)
        .orderBy(auditEvents.timestamp) // oldest-first
        .limit(1)
        .offset(excess - 1)
        .get();

      if (cutoffRow?.timestamp !== undefined) {
        const result = this.db
          .delete(auditEvents)
          .where(lte(auditEvents.timestamp, cutoffRow.timestamp))
          .run();
        deletedExcess = result.changes;
      }
    }

    return {
      deletedOld,
      deletedExcess,
      totalDeleted: deletedOld + deletedExcess,
    };
  }

  // ─── IAuditRepository: getStats ───────────────────────────────────────────

  getStats(): AuditStats {
    const total = this.count();

    const byTypeRows = this.db
      .select({ eventType: auditEvents.eventType, count: drizzleCount() })
      .from(auditEvents)
      .groupBy(auditEvents.eventType)
      .all();

    const bySeverityRows = this.db
      .select({ severity: auditEvents.severity, count: drizzleCount() })
      .from(auditEvents)
      .groupBy(auditEvents.severity)
      .all();

    const oldestRow = this.db
      .select({ timestamp: auditEvents.timestamp })
      .from(auditEvents)
      .orderBy(auditEvents.timestamp)
      .limit(1)
      .get();

    const newestRow = this.db
      .select({ timestamp: auditEvents.timestamp })
      .from(auditEvents)
      .orderBy(desc(auditEvents.timestamp))
      .limit(1)
      .get();

    const byEventType: Record<string, number> = {};
    for (const row of byTypeRows) {
      byEventType[row.eventType] = row.count;
    }

    const bySeverity: Record<string, number> = {};
    for (const row of bySeverityRows) {
      bySeverity[row.severity] = row.count;
    }

    return {
      total,
      byEventType,
      bySeverity,
      oldest: oldestRow?.timestamp ?? null,
      newest: newestRow?.timestamp ?? null,
    };
  }
}

// ─── Helper: build from config-like object ───────────────────────────────────
