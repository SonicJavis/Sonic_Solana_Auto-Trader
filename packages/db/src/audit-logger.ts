import { randomUUID } from 'crypto';
import type { AuditEvent } from '@sonic/shared';
import type { AuditLogRecord, PersistentAuditEventInput, PersistentAuditRecord, AuditQueryFilters, AuditStats, RetentionPolicy, RetentionResult } from './types.js';
import type { IAuditRepository } from './audit-repository.js';

export interface IAuditLogger {
  log(event: AuditEvent): Promise<void>;
  getRecent(limit?: number): Promise<AuditLogRecord[]>;
}

/**
 * In-memory audit logger.
 * Implements IAuditRepository for full interface compatibility (used in tests, worker fallback).
 * Does NOT persist across process restarts.
 */
export class InMemoryAuditLogger implements IAuditRepository {
  private readonly records: PersistentAuditRecord[] = [];

  // ─── IAuditLogger ────────────────────────────────────────────────────────

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

  async getRecent(limit = 100): Promise<AuditLogRecord[]> {
    return this.listRecent(limit).map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      eventType: r.eventType,
      severity: (r.severity === 'warn' || r.severity === 'error') ? r.severity : 'info',
      details: r.detailsJson ?? '{}',
    }));
  }

  // ─── IAuditRepository ────────────────────────────────────────────────────

  record(input: PersistentAuditEventInput): void {
    const id = randomUUID();
    const timestamp = input.timestamp ?? new Date().toISOString();
    const createdAt = new Date().toISOString();

    let detailsJson: string | null = null;
    if (input.details !== undefined) {
      try {
        detailsJson = JSON.stringify(input.details);
      } catch {
        detailsJson = null;
      }
    }

    this.records.push({
      id,
      timestamp,
      phase: input.phase ?? null,
      eventType: input.eventType,
      severity: input.severity,
      source: input.source ?? null,
      mode: input.mode ?? null,
      message: input.message,
      detailsJson,
      safeSummary: input.safeSummary ?? null,
      createdAt,
    });
  }

  listRecent(limit = 100): PersistentAuditRecord[] {
    const safeLimit = Math.max(1, Math.min(limit, 1_000));
    return [...this.records].reverse().slice(0, safeLimit);
  }

  query(filters: AuditQueryFilters): PersistentAuditRecord[] {
    const safeLimit = Math.max(1, Math.min(filters.limit ?? 100, 1_000));
    const safeOffset = Math.max(0, filters.offset ?? 0);

    let results = [...this.records];

    if (filters.eventType !== undefined) {
      results = results.filter((r) => r.eventType === filters.eventType);
    }
    if (filters.severity !== undefined) {
      results = results.filter((r) => r.severity === filters.severity);
    }
    if (filters.source !== undefined) {
      results = results.filter((r) => r.source === filters.source);
    }
    if (filters.mode !== undefined) {
      results = results.filter((r) => r.mode === filters.mode);
    }
    if (filters.timestampFrom !== undefined) {
      results = results.filter((r) => r.timestamp >= (filters.timestampFrom as string));
    }
    if (filters.timestampTo !== undefined) {
      results = results.filter((r) => r.timestamp <= (filters.timestampTo as string));
    }

    // newest-first
    results.reverse();

    return results.slice(safeOffset, safeOffset + safeLimit);
  }

  count(filters?: AuditQueryFilters): number {
    if (!filters) return this.records.length;
    return this.query({ ...filters, limit: 1_000, offset: 0 }).length;
  }

  deleteOlderThan(cutoff: Date): number {
    const cutoffIso = cutoff.toISOString();
    const before = this.records.length;
    const keep = this.records.filter((r) => r.timestamp >= cutoffIso);
    this.records.length = 0;
    this.records.push(...keep);
    return before - this.records.length;
  }

  enforceRetention(policy: RetentionPolicy): RetentionResult {
    if (!policy.enabled) {
      return { deletedOld: 0, deletedExcess: 0, totalDeleted: 0 };
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - policy.retentionDays);
    const deletedOld = this.deleteOlderThan(cutoff);

    const total = this.records.length;
    let deletedExcess = 0;
    if (total > policy.maxEvents) {
      const excess = total - policy.maxEvents;
      // Remove oldest (front of array)
      this.records.splice(0, excess);
      deletedExcess = excess;
    }

    return {
      deletedOld,
      deletedExcess,
      totalDeleted: deletedOld + deletedExcess,
    };
  }

  getStats(): AuditStats {
    const byEventType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    for (const r of this.records) {
      byEventType[r.eventType] = (byEventType[r.eventType] ?? 0) + 1;
      bySeverity[r.severity] = (bySeverity[r.severity] ?? 0) + 1;
    }

    const sorted = [...this.records].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return {
      total: this.records.length,
      byEventType,
      bySeverity,
      oldest: sorted[0]?.timestamp ?? null,
      newest: sorted[sorted.length - 1]?.timestamp ?? null,
    };
  }

  /** Clear all records (useful for test cleanup) */
  clear(): void {
    this.records.length = 0;
  }
}
