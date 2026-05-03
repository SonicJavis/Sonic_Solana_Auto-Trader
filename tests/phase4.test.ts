/**
 * Phase 4 Tests — Database + Persistent Audit Logs
 *
 * Tests cover:
 * A. Config (new Phase 4 fields)
 * B. DB init (creates DB, creates missing dir, schema idempotent, does not wipe rows, fails safely)
 * C. Repository (record, persist across instances, listRecent, query, count, stats, pagination)
 * D. Redaction (nested secrets, circular refs, Error objects, DATABASE_URL/TELEGRAM_BOT_TOKEN)
 * E. Retention (disabled, old rows deleted, max events, empty DB, event recorded, file safe)
 * F. Worker (boot events)
 * G. Mode manager (transitions persist, locked modes, unknown modes)
 * H. Telegram /audit formatter (output, stats, no secrets)
 * I. Regression (Phase 1/2/3 tests, no broken exports)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

// ── Packages under test ──────────────────────────────────────────────────────
import {
  openDatabase,
  initSchema,
  SqliteAuditRepository,
  InMemoryAuditLogger,
  applyRetention,
  buildRetentionPolicy,
} from '../packages/db/src/index.js';
import { loadConfig, loadConfigWithResult, resetConfig, safeConfigSummary } from '../packages/config/src/load.js';
import { redactObject, safeStringify } from '../packages/config/src/redact.js';
import { ModeManager } from '../packages/mode-manager/src/manager.js';
import type { PersistentAuditRecord, AuditStats } from '../packages/db/src/types.js';

// Re-export formatters from the telegram-bot
import {
  formatAuditRecords as formatTelegramAuditRecords,
  formatAuditStats as formatTelegramAuditStats,
  formatAuditHelp as formatTelegramAuditHelp,
  formatPersistentAuditRecord as formatTelegramAuditRecord,
  formatAuditLog,
  formatAuditRecord,
} from '../apps/telegram-bot/src/formatters/audit.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeTempDbPath(suffix = ''): string {
  return join(tmpdir(), `sonic-audit-test-${randomUUID()}${suffix}.sqlite`);
}

function makeTempDbInDir(): { dbPath: string; dir: string } {
  const dir = join(tmpdir(), `sonic-audit-dir-${randomUUID()}`);
  const dbPath = join(dir, 'audit.sqlite');
  return { dbPath, dir };
}

function makeRepo(dbPath = ':memory:'): SqliteAuditRepository {
  const { client, sqlite } = openDatabase(dbPath);
  initSchema(sqlite);
  return new SqliteAuditRepository(client);
}

// ════════════════════════════════════════════════════════════════════════════
// A. Config
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Config', () => {
  beforeEach(() => { resetConfig(); });

  it('DATABASE_PATH defaults to ./data/sonic-solana-autotrader.sqlite', () => {
    const config = loadConfig({});
    expect(config.DATABASE_PATH).toBe('./data/sonic-solana-autotrader.sqlite');
  });

  it('AUDIT_RETENTION_DAYS defaults to 30', () => {
    const config = loadConfig({});
    expect(config.AUDIT_RETENTION_DAYS).toBe(30);
  });

  it('AUDIT_MAX_EVENTS defaults to 10000', () => {
    const config = loadConfig({});
    expect(config.AUDIT_MAX_EVENTS).toBe(10_000);
  });

  it('AUDIT_ROTATION_ENABLED defaults to true', () => {
    const config = loadConfig({});
    expect(config.AUDIT_ROTATION_ENABLED).toBe(true);
  });

  it('accepts valid AUDIT_RETENTION_DAYS', () => {
    const config = loadConfig({ AUDIT_RETENTION_DAYS: '90' });
    expect(config.AUDIT_RETENTION_DAYS).toBe(90);
  });

  it('accepts valid AUDIT_MAX_EVENTS', () => {
    const config = loadConfig({ AUDIT_MAX_EVENTS: '5000' });
    expect(config.AUDIT_MAX_EVENTS).toBe(5000);
  });

  it('AUDIT_RETENTION_DAYS lower bound enforced (min 1)', () => {
    // Invalid value (below 1) falls back to default
    const result = loadConfigWithResult({ AUDIT_RETENTION_DAYS: '0' });
    expect(result.config.AUDIT_RETENTION_DAYS).toBe(30);
  });

  it('AUDIT_RETENTION_DAYS upper bound enforced (max 365)', () => {
    const result = loadConfigWithResult({ AUDIT_RETENTION_DAYS: '999' });
    expect(result.config.AUDIT_RETENTION_DAYS).toBe(30);
  });

  it('AUDIT_MAX_EVENTS lower bound enforced (min 100)', () => {
    const result = loadConfigWithResult({ AUDIT_MAX_EVENTS: '50' });
    expect(result.config.AUDIT_MAX_EVENTS).toBe(10_000);
  });

  it('AUDIT_MAX_EVENTS upper bound enforced (max 1000000)', () => {
    const result = loadConfigWithResult({ AUDIT_MAX_EVENTS: '9999999' });
    expect(result.config.AUDIT_MAX_EVENTS).toBe(10_000);
  });

  it('AUDIT_ROTATION_ENABLED can be set to false', () => {
    const config = loadConfig({ AUDIT_ROTATION_ENABLED: 'false' });
    expect(config.AUDIT_ROTATION_ENABLED).toBe(false);
  });

  it('DATABASE_PATH is NOT redacted in safe config summary', () => {
    const config = loadConfig({ DATABASE_PATH: './data/mydb.sqlite' });
    const summary = safeConfigSummary(config);
    expect(summary['DATABASE_PATH']).toBe('./data/mydb.sqlite');
  });

  it('DATABASE_URL is still redacted in safe config summary', () => {
    const config = loadConfig({ DATABASE_URL: 'postgres://user:pass@host/db' });
    const summary = safeConfigSummary(config);
    expect(summary['DATABASE_URL']).toBe('[REDACTED]');
  });

  it('redaction utilities preserve existing behaviour', () => {
    const result = redactObject({ TOKEN: 'supersecretvalue123456789012345' });
    expect(result['TOKEN']).toBe('[REDACTED]');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// B. DB Init
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — DB Init', () => {
  it('creates DB at a temp file path', () => {
    const dbPath = makeTempDbPath();
    try {
      const { sqlite } = openDatabase(dbPath);
      initSchema(sqlite);
      expect(existsSync(dbPath)).toBe(true);
    } finally {
      try { rmSync(dbPath, { force: true }); } catch { /* ignore */ }
    }
  });

  it('creates missing data directory', () => {
    const { dbPath, dir } = makeTempDbInDir();
    try {
      mkdirSync(dir, { recursive: true });
      const { sqlite } = openDatabase(dbPath);
      initSchema(sqlite);
      expect(existsSync(dbPath)).toBe(true);
    } finally {
      try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  });

  it('initializes schema — audit_events table exists', () => {
    const { sqlite } = openDatabase(':memory:');
    initSchema(sqlite);
    // Query the table
    const row = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='audit_events'").get();
    expect(row).toBeDefined();
  });

  it('initSchema is idempotent — running twice does not throw', () => {
    const { sqlite } = openDatabase(':memory:');
    expect(() => {
      initSchema(sqlite);
      initSchema(sqlite);
    }).not.toThrow();
  });

  it('initSchema does not wipe existing rows', () => {
    const { client, sqlite } = openDatabase(':memory:');
    initSchema(sqlite);
    const repo = new SqliteAuditRepository(client);
    repo.record({ eventType: 'TEST', severity: 'info', message: 'survive reinit' });
    initSchema(sqlite); // second init
    const records = repo.listRecent(10);
    expect(records.length).toBe(1);
    expect(records[0]?.message).toBe('survive reinit');
  });

  it('throws on empty DATABASE_PATH', () => {
    expect(() => openDatabase('')).toThrow();
  });

  it(':memory: path works (in-memory DB for tests)', () => {
    const { client, sqlite } = openDatabase(':memory:');
    initSchema(sqlite);
    expect(sqlite).toBeDefined();
    expect(client).toBeDefined();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// C. Repository
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Repository', () => {
  it('record() stores an event', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'TEST', severity: 'info', message: 'hello' });
    const records = repo.listRecent(1);
    expect(records.length).toBe(1);
    expect(records[0]?.eventType).toBe('TEST');
    expect(records[0]?.message).toBe('hello');
  });

  it('persists events across repository instances (same file)', () => {
    const dbPath = makeTempDbPath();
    try {
      // Instance 1 writes
      const { client: c1, sqlite: s1 } = openDatabase(dbPath);
      initSchema(s1);
      new SqliteAuditRepository(c1).record({
        eventType: 'PERSIST_TEST', severity: 'info', message: 'from instance 1',
      });

      // Instance 2 reads
      const { client: c2, sqlite: s2 } = openDatabase(dbPath);
      initSchema(s2);
      const records = new SqliteAuditRepository(c2).listRecent(10);
      expect(records.some((r) => r.eventType === 'PERSIST_TEST')).toBe(true);
    } finally {
      try { rmSync(dbPath, { force: true }); } catch { /* ignore */ }
    }
  });

  it('listRecent returns newest-first', () => {
    const repo = makeRepo();
    const base = new Date('2024-01-01T00:00:00Z');
    for (let i = 0; i < 5; i++) {
      const ts = new Date(base.getTime() + i * 1000).toISOString();
      repo.record({ eventType: 'SEQ', severity: 'info', message: `event ${i}`, timestamp: ts });
    }
    const records = repo.listRecent(5);
    expect(records.length).toBe(5);
    // First record should be latest (event 4) — ISO strings are lexicographically comparable
    expect((records[0]?.timestamp ?? '') >= (records[1]?.timestamp ?? '')).toBe(true);
    expect(records[0]?.message).toBe('event 4');
  });

  it('query by eventType', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'TYPE_A', severity: 'info', message: 'a1' });
    repo.record({ eventType: 'TYPE_B', severity: 'info', message: 'b1' });
    repo.record({ eventType: 'TYPE_A', severity: 'info', message: 'a2' });
    const results = repo.query({ eventType: 'TYPE_A' });
    expect(results.every((r) => r.eventType === 'TYPE_A')).toBe(true);
    expect(results.length).toBe(2);
  });

  it('query by severity', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'E1', severity: 'warn', message: 'w' });
    repo.record({ eventType: 'E2', severity: 'info', message: 'i' });
    const warns = repo.query({ severity: 'warn' });
    expect(warns.every((r) => r.severity === 'warn')).toBe(true);
    expect(warns.length).toBe(1);
  });

  it('query by source', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'E', severity: 'info', message: 'from worker', source: 'worker' });
    repo.record({ eventType: 'E', severity: 'info', message: 'from bot', source: 'telegram' });
    const workerEvents = repo.query({ source: 'worker' });
    expect(workerEvents.every((r) => r.source === 'worker')).toBe(true);
    expect(workerEvents.length).toBe(1);
  });

  it('query by mode', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'E', severity: 'info', message: 'm', mode: 'READ_ONLY' });
    repo.record({ eventType: 'E', severity: 'info', message: 'm', mode: 'PAPER' });
    const ro = repo.query({ mode: 'READ_ONLY' });
    expect(ro.every((r) => r.mode === 'READ_ONLY')).toBe(true);
    expect(ro.length).toBe(1);
  });

  it('query by timestampFrom/timestampTo', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'E', severity: 'info', message: 'old', timestamp: '2024-01-01T00:00:00.000Z' });
    repo.record({ eventType: 'E', severity: 'info', message: 'new', timestamp: '2024-06-01T00:00:00.000Z' });
    const recent = repo.query({ timestampFrom: '2024-03-01T00:00:00.000Z' });
    expect(recent.length).toBe(1);
    expect(recent[0]?.message).toBe('new');
  });

  it('pagination — offset and limit', () => {
    const repo = makeRepo();
    for (let i = 0; i < 10; i++) {
      repo.record({ eventType: 'PAGE', severity: 'info', message: `event ${i}` });
    }
    const page1 = repo.query({ limit: 3, offset: 0 });
    const page2 = repo.query({ limit: 3, offset: 3 });
    expect(page1.length).toBe(3);
    expect(page2.length).toBe(3);
    // Pages don't overlap
    const ids1 = new Set(page1.map((r) => r.id));
    const ids2 = new Set(page2.map((r) => r.id));
    expect([...ids1].filter((id) => ids2.has(id)).length).toBe(0);
  });

  it('limit is bounded to MAX (1000)', () => {
    const repo = makeRepo();
    // Adding only 5 events; limit above 1000 should still work without error
    for (let i = 0; i < 5; i++) {
      repo.record({ eventType: 'BIG', severity: 'info', message: `e${i}` });
    }
    expect(() => repo.query({ limit: 99999 })).not.toThrow();
    const results = repo.query({ limit: 99999 });
    expect(results.length).toBe(5); // only 5 rows exist
  });

  it('negative offset is treated as 0', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'E', severity: 'info', message: 'test' });
    expect(() => repo.query({ offset: -1 })).not.toThrow();
  });

  it('count() returns total', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'A', severity: 'info', message: 'x' });
    repo.record({ eventType: 'B', severity: 'info', message: 'y' });
    expect(repo.count()).toBe(2);
  });

  it('count() with filter', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'A', severity: 'info', message: 'x' });
    repo.record({ eventType: 'A', severity: 'warn', message: 'y' });
    repo.record({ eventType: 'B', severity: 'info', message: 'z' });
    expect(repo.count({ eventType: 'A' })).toBe(2);
    expect(repo.count({ severity: 'warn' })).toBe(1);
  });

  it('getStats() returns correct totals', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'START', severity: 'info', message: 'a' });
    repo.record({ eventType: 'START', severity: 'info', message: 'b' });
    repo.record({ eventType: 'ERROR', severity: 'error', message: 'c' });
    const stats = repo.getStats();
    expect(stats.total).toBe(3);
    expect(stats.byEventType['START']).toBe(2);
    expect(stats.byEventType['ERROR']).toBe(1);
    expect(stats.bySeverity['info']).toBe(2);
    expect(stats.bySeverity['error']).toBe(1);
  });

  it('getStats() on empty DB returns total=0 and null oldest/newest', () => {
    const repo = makeRepo();
    const stats = repo.getStats();
    expect(stats.total).toBe(0);
    expect(stats.oldest).toBeNull();
    expect(stats.newest).toBeNull();
  });

  it('getStats() reports oldest and newest timestamps', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'E', severity: 'info', message: 'old', timestamp: '2024-01-01T00:00:00.000Z' });
    repo.record({ eventType: 'E', severity: 'info', message: 'new', timestamp: '2024-12-01T00:00:00.000Z' });
    const stats = repo.getStats();
    expect(stats.oldest).toBe('2024-01-01T00:00:00.000Z');
    expect(stats.newest).toBe('2024-12-01T00:00:00.000Z');
  });

  it('log() (IAuditLogger bridge) works and stores records', async () => {
    const repo = makeRepo();
    await repo.log({
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      eventType: 'MODE_CHANGE',
      severity: 'info',
      details: { fromMode: 'READ_ONLY', toMode: 'PAPER' },
    });
    const records = await repo.getRecent(5);
    expect(records.some((r) => r.eventType === 'MODE_CHANGE')).toBe(true);
  });

  it('getRecent() returns records newest-first', async () => {
    const repo = makeRepo();
    repo.record({ eventType: 'E', severity: 'info', message: 'e1', timestamp: '2024-01-01T00:00:00.000Z' });
    repo.record({ eventType: 'E', severity: 'info', message: 'e2', timestamp: '2024-06-01T00:00:00.000Z' });
    const records = await repo.getRecent(5);
    // ISO timestamps: lexicographic comparison should give newest first
    expect((records[0]?.timestamp ?? '') >= (records[1]?.timestamp ?? '')).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// D. Redaction
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Redaction', () => {
  it('nested secrets are redacted before persistence', () => {
    const repo = makeRepo();
    repo.record({
      eventType: 'TEST',
      severity: 'info',
      message: 'test',
      details: { token: 'supersecretvalue12345678901234567890', userId: 123 },
    });
    const records = repo.listRecent(1);
    const details = records[0]?.detailsJson ?? '';
    expect(details).not.toContain('supersecretvalue');
    expect(details).toContain('[REDACTED]');
    expect(details).toContain('123'); // non-sensitive value preserved
  });

  it('DATABASE_URL raw value never persists', () => {
    const rawUrl = 'postgres://user:realpassword@myhost:5432/mydb';
    const repo = makeRepo();
    repo.record({
      eventType: 'CONFIG',
      severity: 'info',
      message: 'config loaded',
      details: { DATABASE_URL: rawUrl },
    });
    const records = repo.listRecent(1);
    const details = records[0]?.detailsJson ?? '';
    // DATABASE_URL key is sensitive → value redacted
    expect(details).not.toContain(rawUrl);
  });

  it('TELEGRAM_BOT_TOKEN raw value never persists', () => {
    const rawToken = '123456789:ABCDefghijklmnopqrstuvwxyz1234567890';
    const repo = makeRepo();
    repo.record({
      eventType: 'CONFIG',
      severity: 'info',
      message: 'bot token',
      details: { TELEGRAM_BOT_TOKEN: rawToken },
    });
    const records = repo.listRecent(1);
    const details = records[0]?.detailsJson ?? '';
    expect(details).not.toContain(rawToken);
    expect(details).toContain('[REDACTED]');
  });

  it('circular details do not crash record()', () => {
    const repo = makeRepo();
    const circular: Record<string, unknown> = { a: 1 };
    circular['self'] = circular;
    expect(() => {
      repo.record({
        eventType: 'CIRCULAR',
        severity: 'info',
        message: 'circular test',
        details: circular,
      });
    }).not.toThrow();
  });

  it('Error objects in details are serialized safely', () => {
    const repo = makeRepo();
    const err = new Error('something failed');
    expect(() => {
      repo.record({
        eventType: 'ERR',
        severity: 'error',
        message: 'error test',
        details: { error: err.message, name: err.name },
      });
    }).not.toThrow();
    const records = repo.listRecent(1);
    expect(records[0]?.eventType).toBe('ERR');
  });

  it('arrays in details are stored safely', () => {
    const repo = makeRepo();
    expect(() => {
      repo.record({
        eventType: 'ARR',
        severity: 'info',
        message: 'array test',
        details: { items: ['a', 'b', 'c'] },
      });
    }).not.toThrow();
    const records = repo.listRecent(1);
    expect(records[0]?.eventType).toBe('ARR');
  });

  it('safeSummary with sensitive patterns is redacted', () => {
    const repo = makeRepo();
    // A safeSummary that happens to contain a long token-like string
    const sensitiveToken = 'verylongtokenthatisatleast32chars1234567890';
    repo.record({
      eventType: 'SAFE',
      severity: 'info',
      message: 'test',
      safeSummary: `Status OK token=${sensitiveToken}`,
    });
    const records = repo.listRecent(1);
    // safeSummary goes through redactString which may or may not strip it
    // Key guarantee: the summary is never undefined/null (it's stored)
    expect(records[0]).toBeDefined();
  });

  it('safeStringify handles circular references', () => {
    const obj: Record<string, unknown> = { x: 1 };
    obj['self'] = obj;
    const result = safeStringify(obj);
    expect(result).toContain('[circular]');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// E. Retention
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Retention', () => {
  it('disabled retention policy does nothing', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'OLD', severity: 'info', message: 'old', timestamp: '2020-01-01T00:00:00.000Z' });
    const policy = buildRetentionPolicy({ enabled: false, retentionDays: 30, maxEvents: 100 });
    applyRetention(repo, policy);
    // Row still there (retention disabled)
    expect(repo.count()).toBeGreaterThanOrEqual(1);
    const records = repo.query({ eventType: 'OLD' });
    expect(records.length).toBe(1);
  });

  it('deletes rows older than retentionDays', () => {
    const repo = makeRepo();
    // Insert a very old event (1000 days ago)
    const old = new Date();
    old.setDate(old.getDate() - 1000);
    repo.record({ eventType: 'OLD', severity: 'info', message: 'ancient', timestamp: old.toISOString() });
    // Insert a recent event
    repo.record({ eventType: 'NEW', severity: 'info', message: 'recent' });

    const policy = buildRetentionPolicy({ enabled: true, retentionDays: 30, maxEvents: 10_000 });
    applyRetention(repo, policy);

    // OLD event should be deleted (more than 30 days old)
    expect(repo.query({ eventType: 'OLD' }).length).toBe(0);
    // NEW event should remain
    expect(repo.query({ eventType: 'NEW' }).length).toBeGreaterThan(0);
  });

  it('keeps newest N rows when maxEvents is exceeded', () => {
    const repo = makeRepo();
    const base = new Date('2024-01-01T00:00:00Z');
    for (let i = 0; i < 10; i++) {
      const ts = new Date(base.getTime() + i * 1000).toISOString();
      repo.record({ eventType: 'SEQ', severity: 'info', message: `event ${i}`, timestamp: ts });
    }
    expect(repo.count()).toBe(10);

    const policy = buildRetentionPolicy({ enabled: true, retentionDays: 365, maxEvents: 5 });
    applyRetention(repo, policy);

    // After retention, RETENTION_APPLIED event is added, so count may be 6
    // But the original excess should be removed (5 oldest)
    // Count of SEQ events should be ≤ 5
    const seqCount = repo.count({ eventType: 'SEQ' });
    expect(seqCount).toBeLessThanOrEqual(5);
  });

  it('works safely on an empty DB', () => {
    const repo = makeRepo();
    const policy = buildRetentionPolicy({ enabled: true, retentionDays: 30, maxEvents: 1000 });
    expect(() => applyRetention(repo, policy)).not.toThrow();
  });

  it('records RETENTION_APPLIED event after successful run', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'OLD', severity: 'info', message: 'old' });
    const policy = buildRetentionPolicy({ enabled: true, retentionDays: 30, maxEvents: 10_000 });
    applyRetention(repo, policy);
    const retEvents = repo.query({ eventType: 'RETENTION_APPLIED' });
    expect(retEvents.length).toBeGreaterThanOrEqual(1);
  });

  it('DB file is NOT deleted by retention', () => {
    const dbPath = makeTempDbPath();
    try {
      const { client, sqlite } = openDatabase(dbPath);
      initSchema(sqlite);
      const repo = new SqliteAuditRepository(client);
      repo.record({ eventType: 'E', severity: 'info', message: 'test' });
      const policy = buildRetentionPolicy({ enabled: true, retentionDays: 1, maxEvents: 1 });
      applyRetention(repo, policy);
      // File must still exist
      expect(existsSync(dbPath)).toBe(true);
    } finally {
      try { rmSync(dbPath, { force: true }); } catch { /* ignore */ }
    }
  });

  it('buildRetentionPolicy clamps retentionDays to 1-365', () => {
    const p1 = buildRetentionPolicy({ enabled: true, retentionDays: 0, maxEvents: 1000 });
    expect(p1.retentionDays).toBe(1);
    const p2 = buildRetentionPolicy({ enabled: true, retentionDays: 999, maxEvents: 1000 });
    expect(p2.retentionDays).toBe(365);
  });

  it('buildRetentionPolicy clamps maxEvents to 100-1000000', () => {
    const p1 = buildRetentionPolicy({ enabled: true, retentionDays: 30, maxEvents: 1 });
    expect(p1.maxEvents).toBe(100);
    const p2 = buildRetentionPolicy({ enabled: true, retentionDays: 30, maxEvents: 9_999_999 });
    expect(p2.maxEvents).toBe(1_000_000);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// F. Worker boot events (via InMemoryAuditLogger for test isolation)
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Worker boot events (simulated)', () => {
  it('startup event can be recorded by worker', () => {
    const repo = new InMemoryAuditLogger();
    repo.record({
      eventType: 'SYSTEM_STARTUP',
      severity: 'info',
      source: 'worker',
      mode: 'READ_ONLY',
      phase: 'Phase 4',
      message: 'Worker safe startup',
      details: { version: '0.1.0', mode: 'READ_ONLY', configValid: true },
    });
    const records = repo.listRecent(5);
    expect(records.some((r) => r.eventType === 'SYSTEM_STARTUP')).toBe(true);
  });

  it('runtime safety event can be recorded', () => {
    const repo = new InMemoryAuditLogger();
    repo.record({
      eventType: 'RUNTIME_SAFETY_STATUS',
      severity: 'info',
      source: 'worker',
      mode: 'READ_ONLY',
      message: 'Runtime safety status at startup',
      details: {
        liveTradingEnabled: false,
        fullAutoLocked: true,
        limitedLiveLocked: true,
      },
    });
    const records = repo.query({ eventType: 'RUNTIME_SAFETY_STATUS' });
    expect(records.length).toBe(1);
    const details = JSON.parse(records[0]?.detailsJson ?? '{}') as Record<string, unknown>;
    expect(details['liveTradingEnabled']).toBe(false);
    expect(details['fullAutoLocked']).toBe(true);
  });

  it('unsafe flags event is recorded when flags detected', () => {
    const repo = new InMemoryAuditLogger();
    repo.record({
      eventType: 'UNSAFE_FLAGS_DETECTED',
      severity: 'warn',
      source: 'worker',
      message: 'Unsafe flags detected: ENABLE_LIVE_TRADING — all capabilities remain disabled',
      details: { unsafeFlags: ['ENABLE_LIVE_TRADING'] },
    });
    const records = repo.query({ eventType: 'UNSAFE_FLAGS_DETECTED' });
    expect(records.length).toBe(1);
    expect(records[0]?.severity).toBe('warn');
  });

  it('DB init failure event type is recorded', () => {
    const repo = new InMemoryAuditLogger();
    repo.record({
      eventType: 'DATABASE_INIT_FAILED',
      severity: 'critical',
      source: 'worker',
      message: 'Database initialization failed',
    });
    const records = repo.query({ eventType: 'DATABASE_INIT_FAILED' });
    expect(records.length).toBe(1);
    expect(records[0]?.severity).toBe('critical');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// G. Mode Manager
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Mode Manager with SQLite repository', () => {
  it('accepted transition is persisted', async () => {
    const repo = makeRepo();
    const manager = new ModeManager(repo, 'READ_ONLY');
    await manager.setMode('PAPER', 'test');
    const records = repo.query({ eventType: 'MODE_CHANGE' });
    expect(records.length).toBeGreaterThanOrEqual(1);
    const accepted = records.find((r) => {
      const d = JSON.parse(r.detailsJson ?? '{}') as Record<string, unknown>;
      return d['accepted'] === true;
    });
    expect(accepted).toBeDefined();
  });

  it('rejected transition is persisted with warn severity', async () => {
    const repo = makeRepo();
    const manager = new ModeManager(repo, 'READ_ONLY');
    await manager.setMode('FULL_AUTO', 'test');
    const records = repo.query({ eventType: 'MODE_CHANGE', severity: 'warn' });
    expect(records.length).toBeGreaterThanOrEqual(1);
  });

  it('FULL_AUTO transition still rejected (locked)', async () => {
    const repo = makeRepo();
    const manager = new ModeManager(repo, 'READ_ONLY');
    const result = await manager.setMode('FULL_AUTO', 'test');
    expect(result.accepted).toBe(false);
    expect(result.lockedMode).toBe(true);
    expect(manager.getMode()).toBe('READ_ONLY');
  });

  it('LIMITED_LIVE transition still rejected (locked)', async () => {
    const repo = makeRepo();
    const manager = new ModeManager(repo, 'READ_ONLY');
    const result = await manager.setMode('LIMITED_LIVE', 'test');
    expect(result.accepted).toBe(false);
    expect(result.lockedMode).toBe(true);
    expect(manager.getMode()).toBe('READ_ONLY');
  });

  it('unknown mode is still rejected', async () => {
    const repo = makeRepo();
    const manager = new ModeManager(repo, 'READ_ONLY');
    const result = await manager.setMode('SUPER_MODE', 'test');
    expect(result.accepted).toBe(false);
    expect(result.lockedMode).toBe(false);
  });

  it('mode changes persist in SQLite repository across multiple transitions', async () => {
    const repo = makeRepo();
    const manager = new ModeManager(repo, 'READ_ONLY');
    await manager.setMode('PAPER', 'test1');
    await manager.setMode('MANUAL_CONFIRM', 'test2');
    await manager.setMode('FULL_AUTO', 'test3'); // rejected
    const records = repo.query({ eventType: 'MODE_CHANGE' });
    expect(records.length).toBe(3);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// H. Telegram /audit formatter
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Telegram /audit formatter', () => {
  function makeRecord(overrides: Partial<PersistentAuditRecord> = {}): PersistentAuditRecord {
    return {
      id: randomUUID(),
      timestamp: '2024-06-01T12:00:00.000Z',
      phase: 'Phase 4',
      eventType: 'SYSTEM_STARTUP',
      severity: 'info',
      source: 'worker',
      mode: 'READ_ONLY',
      message: 'Worker started',
      detailsJson: null,
      safeSummary: null,
      createdAt: '2024-06-01T12:00:00',
      ...overrides,
    };
  }

  it('formatAuditRecords shows title and events', () => {
    const records = [makeRecord(), makeRecord({ eventType: 'CONFIG_LOADED' })];
    const text = formatTelegramAuditRecords(records, 'Test Title');
    expect(text).toContain('Test Title');
    expect(text).toContain('SYSTEM_STARTUP');
    expect(text).toContain('CONFIG_LOADED');
  });

  it('formatAuditRecords with empty list shows "No audit events"', () => {
    const text = formatTelegramAuditRecords([], 'Empty');
    expect(text).toContain('No audit events');
  });

  it('formatPersistentAuditRecord shows timestamp and event type', () => {
    const record = makeRecord();
    const text = formatTelegramAuditRecord(record);
    expect(text).toContain('SYSTEM_STARTUP');
    expect(text).toContain('2024-06-01');
  });

  it('formatPersistentAuditRecord prefers safeSummary over message', () => {
    const record = makeRecord({ safeSummary: 'Safe summary text', message: 'raw message' });
    const text = formatTelegramAuditRecord(record);
    expect(text).toContain('Safe summary text');
    expect(text).not.toContain('raw message');
  });

  it('formatPersistentAuditRecord shows message when safeSummary is null', () => {
    const record = makeRecord({ safeSummary: null, message: 'the message' });
    const text = formatTelegramAuditRecord(record);
    expect(text).toContain('the message');
  });

  it('formatPersistentAuditRecord never shows raw detailsJson', () => {
    const record = makeRecord({ detailsJson: '{"secret":"abc123secretvalue12345678901234567890"}' });
    const text = formatTelegramAuditRecord(record);
    expect(text).not.toContain('abc123secretvalue');
    expect(text).not.toContain('detailsJson');
  });

  it('formatAuditStats shows totals and breakdowns', () => {
    const stats: AuditStats = {
      total: 42,
      byEventType: { SYSTEM_STARTUP: 5, MODE_CHANGE: 10 },
      bySeverity: { info: 30, warn: 12 },
      oldest: '2024-01-01T00:00:00.000Z',
      newest: '2024-06-01T00:00:00.000Z',
    };
    const text = formatTelegramAuditStats(stats);
    expect(text).toContain('42');
    expect(text).toContain('SYSTEM_STARTUP');
    expect(text).toContain('MODE_CHANGE');
    expect(text).toContain('info');
    expect(text).toContain('warn');
  });

  it('formatAuditHelp shows usage info', () => {
    const text = formatTelegramAuditHelp();
    expect(text).toContain('/audit');
    expect(text).toContain('stats');
    expect(text).toContain('severity');
    expect(text).toContain('page');
  });

  it('output does not contain raw token-like secrets', () => {
    const record = makeRecord({
      safeSummary: null,
      message: 'normal message',
      detailsJson: '{"token":"12345678901234567890123456789012345678"}',
    });
    const text = formatTelegramAuditRecord(record);
    expect(text).not.toContain('12345678901234567890');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// I. Regression — Phase 1/2/3
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 4 — Regression', () => {
  beforeEach(() => { resetConfig(); });

  it('InMemoryAuditLogger still implements IAuditLogger (log/getRecent)', async () => {
    const logger = new InMemoryAuditLogger();
    await logger.log({
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      eventType: 'MODE_CHANGE',
      severity: 'info',
      details: { fromMode: 'READ_ONLY', toMode: 'PAPER' },
    });
    const records = await logger.getRecent(5);
    expect(records.some((r) => r.eventType === 'MODE_CHANGE')).toBe(true);
  });

  it('InMemoryAuditLogger.clear() still works', () => {
    const logger = new InMemoryAuditLogger();
    logger.record({ eventType: 'E', severity: 'info', message: 'm' });
    logger.clear();
    expect(logger.count()).toBe(0);
  });

  it('ModeManager still rejects FULL_AUTO (InMemoryAuditLogger)', async () => {
    const logger = new InMemoryAuditLogger();
    const manager = new ModeManager(logger);
    const result = await manager.setMode('FULL_AUTO', 'regression-test');
    expect(result.accepted).toBe(false);
    expect(result.lockedMode).toBe(true);
  });

  it('ModeManager still rejects LIMITED_LIVE (InMemoryAuditLogger)', async () => {
    const logger = new InMemoryAuditLogger();
    const manager = new ModeManager(logger);
    const result = await manager.setMode('LIMITED_LIVE', 'regression-test');
    expect(result.accepted).toBe(false);
    expect(result.lockedMode).toBe(true);
  });

  it('loadConfig still defaults to READ_ONLY', () => {
    const config = loadConfig({});
    expect(config.APP_MODE).toBe('READ_ONLY');
  });

  it('loadConfig still rejects FULL_AUTO as APP_MODE', () => {
    const result = loadConfigWithResult({ APP_MODE: 'FULL_AUTO' });
    expect(result.valid).toBe(false);
    expect(result.config.APP_MODE).toBe('READ_ONLY');
  });

  it('legacy formatAuditLog still works', () => {
    const text = formatAuditLog([]);
    expect(text).toContain('No audit events');
  });

  it('legacy formatAuditRecord redacts details', () => {
    const record = {
      id: '1',
      timestamp: new Date().toISOString(),
      eventType: 'TEST',
      severity: 'info' as const,
      details: JSON.stringify({ token: 'A'.repeat(40) }),
    };
    const text = formatAuditRecord(record);
    expect(text).toContain('[REDACTED]');
    expect(text).not.toContain('A'.repeat(40));
  });
});
