export interface AuditLogRecord {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'info' | 'warn' | 'error';
  details: string;
}

export interface ModeChangeRecord {
  id: string;
  timestamp: string;
  fromMode: string;
  toMode: string;
  triggeredBy: string;
  reason?: string;
}

export interface SystemEventRecord {
  id: string;
  timestamp: string;
  eventType: string;
  message: string;
  data?: string;
}

export interface SettingRecord {
  key: string;
  value: string;
  updatedAt: string;
}

// Phase 4 persistent audit types

/** Allowed severity levels for persistent audit events */
export type AuditSeverity = 'debug' | 'info' | 'warn' | 'error' | 'critical';

/** Input for recording a persistent audit event */
export interface PersistentAuditEventInput {
  readonly eventType: string;
  readonly severity: AuditSeverity;
  readonly source?: string | undefined;
  readonly mode?: string | undefined;
  readonly message: string;
  readonly details?: Record<string, unknown> | undefined;
  readonly safeSummary?: string | undefined;
  readonly phase?: string | undefined;
  /** Override timestamp (useful for tests). Defaults to now. */
  readonly timestamp?: string | undefined;
}

/** A record as stored/returned from the audit DB or in-memory store */
export interface PersistentAuditRecord {
  readonly id: string;
  readonly timestamp: string;
  readonly phase: string | null;
  readonly eventType: string;
  readonly severity: string;
  readonly source: string | null;
  readonly mode: string | null;
  readonly message: string;
  readonly detailsJson: string | null;
  readonly safeSummary: string | null;
  readonly createdAt: string;
}

/** Filters for querying audit events */
export interface AuditQueryFilters {
  readonly eventType?: string | undefined;
  readonly severity?: string | undefined;
  readonly source?: string | undefined;
  readonly mode?: string | undefined;
  readonly timestampFrom?: string | undefined;
  readonly timestampTo?: string | undefined;
  readonly limit?: number | undefined;
  readonly offset?: number | undefined;
}

/** Retention/rotation policy */
export interface RetentionPolicy {
  readonly enabled: boolean;
  readonly retentionDays: number;
  readonly maxEvents: number;
}

/** Result of a retention enforcement pass */
export interface RetentionResult {
  readonly deletedOld: number;
  readonly deletedExcess: number;
  readonly totalDeleted: number;
}

/** Aggregate statistics for the audit log */
export interface AuditStats {
  readonly total: number;
  readonly byEventType: Readonly<Record<string, number>>;
  readonly bySeverity: Readonly<Record<string, number>>;
  readonly oldest: string | null;
  readonly newest: string | null;
}
