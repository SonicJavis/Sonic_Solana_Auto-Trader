import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

export type DbClient = ReturnType<typeof drizzle<typeof schema>>;

export interface OpenDatabaseResult {
  readonly client: DbClient;
  readonly sqlite: Database.Database;
}

/**
 * Opens a SQLite database at the given path and returns a Drizzle client
 * along with the raw better-sqlite3 instance for schema creation.
 * The path must be a valid local filesystem path.
 * Throws if the path is empty/invalid.
 */
export function openDatabase(dbPath: string): OpenDatabaseResult {
  if (!dbPath || dbPath.trim() === '') {
    throw new Error('DATABASE_PATH must be a non-empty local filesystem path');
  }
  // Guard against null bytes (path injection)
  if (dbPath.includes('\0')) {
    throw new Error('DATABASE_PATH contains invalid characters');
  }
  // Allow only :memory: or local filesystem paths — reject remote URL schemes
  const trimmed = dbPath.trim();
  if (trimmed !== ':memory:' && /^[a-z][a-z0-9+\-.]*:\/\//i.test(trimmed)) {
    throw new Error('DATABASE_PATH must be a local filesystem path, not a URL');
  }
  const sqlite = new Database(dbPath);
  // Enable WAL mode for better concurrent read performance
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  const client = drizzle(sqlite, { schema });
  return { client, sqlite };
}
