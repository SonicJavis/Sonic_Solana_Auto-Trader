import { mkdirSync } from 'fs';
import { dirname } from 'path';
import type Database from 'better-sqlite3';

/**
 * CREATE TABLE IF NOT EXISTS SQL for the audit_events table.
 * Programmatic schema creation — safe to run repeatedly (idempotent).
 * Does NOT drop existing tables or delete rows.
 */
const CREATE_AUDIT_EVENTS_TABLE = `
CREATE TABLE IF NOT EXISTS audit_events (
  id          TEXT PRIMARY KEY NOT NULL,
  timestamp   TEXT NOT NULL,
  phase       TEXT,
  event_type  TEXT NOT NULL,
  severity    TEXT NOT NULL,
  source      TEXT,
  mode        TEXT,
  message     TEXT NOT NULL,
  details_json TEXT,
  safe_summary TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
)
`.trim();

const CREATE_TIMESTAMP_IDX = `CREATE INDEX IF NOT EXISTS audit_events_timestamp_idx ON audit_events (timestamp)`;
const CREATE_EVENT_TYPE_IDX = `CREATE INDEX IF NOT EXISTS audit_events_event_type_idx ON audit_events (event_type)`;
const CREATE_SEVERITY_IDX = `CREATE INDEX IF NOT EXISTS audit_events_severity_idx ON audit_events (severity)`;
const CREATE_SOURCE_IDX = `CREATE INDEX IF NOT EXISTS audit_events_source_idx ON audit_events (source)`;
const CREATE_MODE_IDX = `CREATE INDEX IF NOT EXISTS audit_events_mode_idx ON audit_events (mode)`;

/**
 * Ensures the directory for the given DB path exists, creating it if necessary.
 * Throws if creation fails.
 */
export function ensureDataDir(dbPath: string): void {
  const dir = dirname(dbPath);
  if (dir && dir !== '.') {
    try {
      mkdirSync(dir, { recursive: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to create data directory "${dir}": ${message}`);
    }
  }
}

/**
 * Initialises the audit_events schema in the SQLite database.
 * Safe to run repeatedly — uses CREATE TABLE IF NOT EXISTS.
 * Does NOT delete existing rows.
 */
export function initSchema(sqlite: Database.Database): void {
  sqlite.exec(CREATE_AUDIT_EVENTS_TABLE);
  sqlite.exec(CREATE_TIMESTAMP_IDX);
  sqlite.exec(CREATE_EVENT_TYPE_IDX);
  sqlite.exec(CREATE_SEVERITY_IDX);
  sqlite.exec(CREATE_SOURCE_IDX);
  sqlite.exec(CREATE_MODE_IDX);
}
