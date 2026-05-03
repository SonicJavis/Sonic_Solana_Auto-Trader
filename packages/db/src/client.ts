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
  const sqlite = new Database(dbPath);
  // Enable WAL mode for better concurrent read performance
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  const client = drizzle(sqlite, { schema });
  return { client, sqlite };
}
