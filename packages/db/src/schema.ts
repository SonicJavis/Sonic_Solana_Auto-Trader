import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * audit_events table — persistent audit log.
 *
 * detailsJson and safeSummary must be redacted before insertion.
 * Raw secrets (DATABASE_URL, TELEGRAM_BOT_TOKEN, private keys) must never be stored.
 *
 * Schema is created programmatically via migrate.ts (CREATE TABLE IF NOT EXISTS).
 */
export const auditEvents = sqliteTable(
  'audit_events',
  {
    id: text('id').primaryKey(),
    timestamp: text('timestamp').notNull(),
    phase: text('phase'),
    eventType: text('event_type').notNull(),
    severity: text('severity').notNull(),
    source: text('source'),
    mode: text('mode'),
    message: text('message').notNull(),
    detailsJson: text('details_json'),
    safeSummary: text('safe_summary'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => ({
    timestampIdx: index('audit_events_timestamp_idx').on(table.timestamp),
    eventTypeIdx: index('audit_events_event_type_idx').on(table.eventType),
    severityIdx: index('audit_events_severity_idx').on(table.severity),
    sourceIdx: index('audit_events_source_idx').on(table.source),
    modeIdx: index('audit_events_mode_idx').on(table.mode),
  }),
);

export type AuditEventRow = typeof auditEvents.$inferSelect;
export type NewAuditEventRow = typeof auditEvents.$inferInsert;
