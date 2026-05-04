/**
 * Phase 5 Tests — State Store + Safe Read Models
 *
 * Tests cover:
 * A. State types — snapshots have required fields, safe summaries only, no mutable unsafe structures
 * B. Read models — phase/mode/safety/audit/worker/readiness/DB calculations
 * C. Redaction/safety — no raw secrets in snapshots or Telegram output, no raw detailsJson
 * D. Worker support — startup/heartbeat/safety/unsafe-flag events support read models
 * E. Telegram /system — all subcommands work, no raw secrets in output
 * F. Regression — Phase 1–4 tests still pass, no broken exports
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';

// ── packages under test ──────────────────────────────────────────────────────
import {
  buildAuditStateSnapshot,
} from '../packages/state/src/audit-read-model.js';
import {
  buildConfigStateSnapshot,
} from '../packages/state/src/config-read-model.js';
import {
  buildModeStateSnapshot,
} from '../packages/state/src/mode-read-model.js';
import {
  buildWorkerStateSnapshot,
} from '../packages/state/src/worker-read-model.js';
import {
  calculateReadiness,
} from '../packages/state/src/health-read-model.js';
import {
  buildSystemStateSnapshot,
} from '../packages/state/src/state-service.js';
import type {
  SystemStateSnapshot,
  AuditStateSnapshot,
  WorkerStateSnapshot,
  RuntimeSafetyStateSnapshot,
  ModeStateSnapshot,
} from '../packages/state/src/types.js';

// Formatters
import {
  formatSystemOverview,
  formatSystemHealth,
  formatSystemSafety,
  formatSystemAudit,
  formatSystemWorker,
  formatSystemConfig,
  formatSystemHelp,
  formatSystemUnknown,
} from '../apps/telegram-bot/src/formatters/system.js';

// DB
import {
  openDatabase,
  initSchema,
  SqliteAuditRepository,
  InMemoryAuditLogger,
} from '../packages/db/src/index.js';

// Config
import { loadConfig, resetConfig } from '../packages/config/src/load.js';

// Shared
import { buildRuntimeSafetyStatus, PHASE, PHASE_NAME, APP_VERSION, LOCKED_MODES, READ_SAFE_MODES } from '../packages/shared/src/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRepo(): SqliteAuditRepository {
  const { client, sqlite } = openDatabase(':memory:');
  initSchema(sqlite);
  return new SqliteAuditRepository(client);
}

function makeEmptyRepo(): SqliteAuditRepository {
  return makeRepo();
}

function makeDefaultConfig() {
  resetConfig();
  return loadConfig({});
}

function makeDefaultRuntimeSafety() {
  return buildRuntimeSafetyStatus({
    currentPhase: PHASE,
    currentMode: 'READ_ONLY',
    configValid: true,
    unsafeFlagsDetected: false,
    unsafeFlags: [],
    warnings: [],
    killSwitchActive: false,
    adminAllowlistConfigured: false,
    telegramEnabled: false,
    databaseConfigured: true,
  });
}

function makeAuditSnapshot(overrides: Partial<AuditStateSnapshot> = {}): AuditStateSnapshot {
  return {
    available: true,
    total: 0,
    bySeverity: {},
    recentWarnCount: 0,
    recentErrorCount: 0,
    recentCriticalCount: 0,
    lastStartupTimestamp: null,
    lastHeartbeatTimestamp: null,
    lastUnsafeFlagsTimestamp: null,
    oldest: null,
    newest: null,
    ...overrides,
  };
}

function makeWorkerSnapshot(overrides: Partial<WorkerStateSnapshot> = {}): WorkerStateSnapshot {
  return {
    lastStartupTimestamp: null,
    lastHeartbeatTimestamp: null,
    heartbeatAgeSeconds: null,
    status: 'unknown',
    lastSafetyCheckPassed: null,
    ...overrides,
  };
}

function makeRuntimeSafetySnapshot(overrides: Partial<RuntimeSafetyStateSnapshot> = {}): RuntimeSafetyStateSnapshot {
  return {
    configValid: true,
    unsafeFlagsDetected: false,
    unsafeFlags: [],
    warnings: [],
    fullAutoLocked: true,
    limitedLiveLocked: true,
    killSwitchActive: false,
    liveTradingEnabled: false,
    autoTradingEnabled: false,
    safetyCheckPassed: true,
    ...overrides,
  } as RuntimeSafetyStateSnapshot;
}

function makeModeSnapshot(overrides: Partial<ModeStateSnapshot> = {}): ModeStateSnapshot {
  return {
    currentMode: 'READ_ONLY',
    allowedSafeModes: [...READ_SAFE_MODES],
    lockedModes: [...LOCKED_MODES],
    fullAutoLocked: true,
    limitedLiveLocked: true,
    modeSafetyStatus: 'safe',
    ...overrides,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// A. State types
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 5 — State types', () => {
  beforeEach(() => resetConfig());

  it('SystemStateSnapshot has required fields', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();

    const snapshot = buildSystemStateSnapshot({
      auditRepo: repo,
      config,
      currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety,
      killSwitchActive: false,
    });

    expect(snapshot).toHaveProperty('phase');
    expect(snapshot).toHaveProperty('phaseName');
    expect(snapshot).toHaveProperty('appVersion');
    expect(snapshot).toHaveProperty('appMode');
    expect(snapshot).toHaveProperty('safetyProfile');
    expect(snapshot).toHaveProperty('generatedAt');
    expect(snapshot).toHaveProperty('currentMode');
    expect(snapshot).toHaveProperty('lockedModes');
    expect(snapshot).toHaveProperty('runtimeSafetyStatus');
    expect(snapshot).toHaveProperty('databaseStatus');
    expect(snapshot).toHaveProperty('auditStats');
    expect(snapshot).toHaveProperty('workerStatus');
    expect(snapshot).toHaveProperty('unsafeFlagSummary');
    expect(snapshot).toHaveProperty('readiness');
  });

  it('snapshot phase matches PHASE constant', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snapshot = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    expect(snapshot.phase).toBe(PHASE);
    expect(snapshot.phase).toBe(7);
  });

  it('snapshot phaseName matches PHASE_NAME constant', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snapshot = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    expect(snapshot.phaseName).toBe(PHASE_NAME);
  });

  it('snapshot does not expose raw DATABASE_URL', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snapshot = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    const str = JSON.stringify(snapshot);
    // DATABASE_URL raw value is a local path like "./data/sonic.db"
    // The key DATABASE_URL must not appear
    expect(str).not.toContain('DATABASE_URL');
  });

  it('snapshot does not expose TELEGRAM_BOT_TOKEN raw value', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snapshot = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    const str = JSON.stringify(snapshot);
    expect(str).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(str).not.toContain('telegram_bot_token');
  });

  it('snapshot lockedModes contains FULL_AUTO and LIMITED_LIVE', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snapshot = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    expect(snapshot.lockedModes).toContain('FULL_AUTO');
    expect(snapshot.lockedModes).toContain('LIMITED_LIVE');
  });

  it('snapshot runtimeSafetyStatus.liveTradingEnabled is always false', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snapshot = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    expect(snapshot.runtimeSafetyStatus.liveTradingEnabled).toBe(false);
    expect(snapshot.runtimeSafetyStatus.autoTradingEnabled).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// B. Read models
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 5 — Config read model', () => {
  beforeEach(() => resetConfig());

  it('buildConfigStateSnapshot exposes appVersion', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    expect(snap.appVersion).toBe(APP_VERSION);
  });

  it('buildConfigStateSnapshot exposes appMode', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    expect(snap.appMode).toBe('READ_ONLY');
  });

  it('buildConfigStateSnapshot exposes phase', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    expect(snap.phase).toBe(PHASE);
  });

  it('buildConfigStateSnapshot does not expose TELEGRAM_BOT_TOKEN', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    const str = JSON.stringify(snap);
    expect(str).not.toContain('TELEGRAM_BOT_TOKEN');
  });

  it('buildConfigStateSnapshot does not expose DATABASE_URL', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    const str = JSON.stringify(snap);
    expect(str).not.toContain('DATABASE_URL');
  });

  it('buildConfigStateSnapshot shows adminCount not raw IDs', () => {
    const config = loadConfig({ TELEGRAM_ADMIN_IDS: '123456,789012' });
    const snap = buildConfigStateSnapshot(config);
    expect(snap.adminCount).toBe(2);
    const str = JSON.stringify(snap);
    expect(str).not.toContain('123456');
    expect(str).not.toContain('789012');
  });

  it('buildConfigStateSnapshot shows telegramConfigured false when no token', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    expect(snap.telegramConfigured).toBe(false);
  });

  it('buildConfigStateSnapshot shows telegramConfigured true when token set', () => {
    const config = loadConfig({ TELEGRAM_BOT_TOKEN: 'fake-token-for-test-only' });
    const snap = buildConfigStateSnapshot(config);
    expect(snap.telegramConfigured).toBe(true);
  });
});

describe('Phase 5 — Mode read model', () => {
  it('buildModeStateSnapshot reports current mode', () => {
    const snap = buildModeStateSnapshot('READ_ONLY', false);
    expect(snap.currentMode).toBe('READ_ONLY');
  });

  it('buildModeStateSnapshot reports FULL_AUTO as locked', () => {
    const snap = buildModeStateSnapshot('READ_ONLY', false);
    expect(snap.fullAutoLocked).toBe(true);
    expect(snap.lockedModes).toContain('FULL_AUTO');
  });

  it('buildModeStateSnapshot reports LIMITED_LIVE as locked', () => {
    const snap = buildModeStateSnapshot('READ_ONLY', false);
    expect(snap.limitedLiveLocked).toBe(true);
    expect(snap.lockedModes).toContain('LIMITED_LIVE');
  });

  it('buildModeStateSnapshot modeSafetyStatus is safe for READ_ONLY', () => {
    const snap = buildModeStateSnapshot('READ_ONLY', false);
    expect(snap.modeSafetyStatus).toBe('safe');
  });

  it('buildModeStateSnapshot modeSafetyStatus is safe for PAPER', () => {
    const snap = buildModeStateSnapshot('PAPER', false);
    expect(snap.modeSafetyStatus).toBe('safe');
  });

  it('buildModeStateSnapshot modeSafetyStatus is locked when kill switch active', () => {
    const snap = buildModeStateSnapshot('KILL_SWITCH', true);
    expect(snap.modeSafetyStatus).toBe('locked');
  });

  it('buildModeStateSnapshot allowedSafeModes contains expected modes', () => {
    const snap = buildModeStateSnapshot('READ_ONLY', false);
    expect(snap.allowedSafeModes).toContain('READ_ONLY');
    expect(snap.allowedSafeModes).toContain('PAPER');
    expect(snap.allowedSafeModes).not.toContain('FULL_AUTO');
    expect(snap.allowedSafeModes).not.toContain('LIMITED_LIVE');
  });
});

describe('Phase 5 — Audit read model', () => {
  it('buildAuditStateSnapshot returns available=true for in-memory repo', () => {
    const repo = makeEmptyRepo();
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.available).toBe(true);
  });

  it('buildAuditStateSnapshot returns total=0 for empty repo', () => {
    const repo = makeEmptyRepo();
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.total).toBe(0);
  });

  it('buildAuditStateSnapshot counts events after records added', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'SYSTEM_STARTUP', severity: 'info', message: 'startup', source: 'worker' });
    repo.record({ eventType: 'SYSTEM_HEARTBEAT', severity: 'debug', message: 'hb', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.total).toBe(2);
  });

  it('buildAuditStateSnapshot finds lastStartupTimestamp', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'SYSTEM_STARTUP', severity: 'info', message: 'startup', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.lastStartupTimestamp).not.toBeNull();
  });

  it('buildAuditStateSnapshot finds lastHeartbeatTimestamp', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'SYSTEM_HEARTBEAT', severity: 'debug', message: 'hb', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.lastHeartbeatTimestamp).not.toBeNull();
  });

  it('buildAuditStateSnapshot finds lastUnsafeFlagsTimestamp', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'UNSAFE_FLAGS_DETECTED', severity: 'warn', message: 'unsafe', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.lastUnsafeFlagsTimestamp).not.toBeNull();
  });

  it('buildAuditStateSnapshot counts recent warn events', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'TEST_WARN', severity: 'warn', message: 'w1', source: 'worker' });
    repo.record({ eventType: 'TEST_WARN', severity: 'warn', message: 'w2', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.recentWarnCount).toBe(2);
  });

  it('buildAuditStateSnapshot counts recent error events', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'TEST_ERROR', severity: 'error', message: 'e1', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.recentErrorCount).toBe(1);
  });

  it('buildAuditStateSnapshot counts recent critical events', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'TEST_CRIT', severity: 'critical', message: 'c1', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.recentCriticalCount).toBe(1);
  });

  it('buildAuditStateSnapshot does not expose raw detailsJson', () => {
    const repo = makeRepo();
    repo.record({
      eventType: 'SYSTEM_STARTUP',
      severity: 'info',
      message: 'startup',
      source: 'worker',
      details: { secret_token: 'abc123xyz' },
    });
    const snap = buildAuditStateSnapshot(repo);
    const str = JSON.stringify(snap);
    expect(str).not.toContain('secret_token');
    expect(str).not.toContain('abc123xyz');
  });
});

describe('Phase 5 — Worker read model', () => {
  it('buildWorkerStateSnapshot status unknown when no startup', () => {
    const audit = makeAuditSnapshot({ lastStartupTimestamp: null, lastHeartbeatTimestamp: null });
    const snap = buildWorkerStateSnapshot(audit);
    expect(snap.status).toBe('unknown');
  });

  it('buildWorkerStateSnapshot status degraded when startup but no heartbeat', () => {
    const audit = makeAuditSnapshot({ lastStartupTimestamp: new Date().toISOString(), lastHeartbeatTimestamp: null });
    const snap = buildWorkerStateSnapshot(audit);
    expect(snap.status).toBe('degraded');
  });

  it('buildWorkerStateSnapshot status healthy when recent heartbeat', () => {
    const now = new Date().toISOString();
    const audit = makeAuditSnapshot({
      lastStartupTimestamp: now,
      lastHeartbeatTimestamp: now,
    });
    const snap = buildWorkerStateSnapshot(audit);
    expect(snap.status).toBe('healthy');
  });

  it('buildWorkerStateSnapshot status degraded when heartbeat is stale', () => {
    const staleTs = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 min ago
    const audit = makeAuditSnapshot({
      lastStartupTimestamp: staleTs,
      lastHeartbeatTimestamp: staleTs,
    });
    const snap = buildWorkerStateSnapshot(audit);
    expect(snap.status).toBe('degraded');
  });

  it('buildWorkerStateSnapshot computes heartbeatAgeSeconds', () => {
    const ts = new Date(Date.now() - 10_000).toISOString(); // 10s ago
    const audit = makeAuditSnapshot({
      lastStartupTimestamp: ts,
      lastHeartbeatTimestamp: ts,
    });
    const snap = buildWorkerStateSnapshot(audit);
    expect(snap.heartbeatAgeSeconds).not.toBeNull();
    expect(snap.heartbeatAgeSeconds!).toBeGreaterThanOrEqual(9);
  });

  it('buildWorkerStateSnapshot infers lastSafetyCheckPassed=true when startup exists', () => {
    const now = new Date().toISOString();
    const audit = makeAuditSnapshot({ lastStartupTimestamp: now, lastHeartbeatTimestamp: now });
    const snap = buildWorkerStateSnapshot(audit);
    expect(snap.lastSafetyCheckPassed).toBe(true);
  });

  it('buildWorkerStateSnapshot lastSafetyCheckPassed is null when no startup', () => {
    const audit = makeAuditSnapshot({ lastStartupTimestamp: null });
    const snap = buildWorkerStateSnapshot(audit);
    expect(snap.lastSafetyCheckPassed).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// B. Readiness calculation
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 5 — Readiness calculation', () => {
  it('readiness unknown when no startup event', () => {
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot(),
      audit: makeAuditSnapshot({ lastStartupTimestamp: null }),
      worker: makeWorkerSnapshot({ status: 'unknown' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('unknown');
  });

  it('readiness unsafe when safety check failed', () => {
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot({ safetyCheckPassed: false }),
      audit: makeAuditSnapshot({ lastStartupTimestamp: new Date().toISOString() }),
      worker: makeWorkerSnapshot({ status: 'healthy' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('unsafe');
  });

  it('readiness unsafe when fullAutoLocked is false', () => {
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot({ fullAutoLocked: false }),
      audit: makeAuditSnapshot({ lastStartupTimestamp: new Date().toISOString() }),
      worker: makeWorkerSnapshot({ status: 'healthy' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('unsafe');
  });

  it('readiness unsafe when limitedLiveLocked is false', () => {
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot({ limitedLiveLocked: false }),
      audit: makeAuditSnapshot({ lastStartupTimestamp: new Date().toISOString() }),
      worker: makeWorkerSnapshot({ status: 'healthy' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('unsafe');
  });

  it('readiness degraded when worker is degraded', () => {
    const now = new Date().toISOString();
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot(),
      audit: makeAuditSnapshot({ lastStartupTimestamp: now }),
      worker: makeWorkerSnapshot({ status: 'degraded' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('degraded');
  });

  it('readiness degraded when recent warn events exist', () => {
    const now = new Date().toISOString();
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot(),
      audit: makeAuditSnapshot({ lastStartupTimestamp: now, recentWarnCount: 1 }),
      worker: makeWorkerSnapshot({ status: 'healthy' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('degraded');
  });

  it('readiness degraded when recent error events exist', () => {
    const now = new Date().toISOString();
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot(),
      audit: makeAuditSnapshot({ lastStartupTimestamp: now, recentErrorCount: 1 }),
      worker: makeWorkerSnapshot({ status: 'healthy' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('degraded');
  });

  it('readiness degraded when recent critical events exist', () => {
    const now = new Date().toISOString();
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot(),
      audit: makeAuditSnapshot({ lastStartupTimestamp: now, recentCriticalCount: 1 }),
      worker: makeWorkerSnapshot({ status: 'healthy' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('degraded');
  });

  it('readiness ready when all conditions met', () => {
    const now = new Date().toISOString();
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot(),
      audit: makeAuditSnapshot({ lastStartupTimestamp: now, available: true }),
      worker: makeWorkerSnapshot({ status: 'healthy' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('ready');
  });

  it('readiness unsafe when audit unavailable and startup recorded', () => {
    const now = new Date().toISOString();
    const result = calculateReadiness({
      runtimeSafety: makeRuntimeSafetySnapshot(),
      audit: makeAuditSnapshot({ available: false, lastStartupTimestamp: now }),
      worker: makeWorkerSnapshot({ status: 'unknown' }),
      mode: makeModeSnapshot(),
    });
    expect(result).toBe('unsafe');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// C. Redaction / safety
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 5 — Redaction and safety', () => {
  beforeEach(() => resetConfig());

  it('snapshot JSON does not contain raw DATABASE_URL', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snap = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    const str = JSON.stringify(snap);
    expect(str).not.toContain('DATABASE_URL');
  });

  it('snapshot JSON does not contain TELEGRAM_BOT_TOKEN', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snap = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    const str = JSON.stringify(snap);
    expect(str).not.toContain('TELEGRAM_BOT_TOKEN');
  });

  it('snapshot JSON does not contain raw detailsJson field content', () => {
    const repo = makeRepo();
    const secretValue = randomUUID().replace(/-/g, '');
    repo.record({
      eventType: 'SYSTEM_STARTUP',
      severity: 'info',
      message: 'startup',
      details: { internal_secret: secretValue },
    });
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snap = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    const str = JSON.stringify(snap);
    expect(str).not.toContain('internal_secret');
  });

  it('config snapshot does not expose raw secrets', () => {
    const config = loadConfig({ TELEGRAM_BOT_TOKEN: 'supersecrettoken12345' });
    const snap = buildConfigStateSnapshot(config);
    const str = JSON.stringify(snap);
    expect(str).not.toContain('supersecrettoken12345');
    expect(str).not.toContain('TELEGRAM_BOT_TOKEN');
  });

  it('unsafe flags summary does not expose raw secrets', () => {
    const repo = makeRepo();
    const config = makeDefaultConfig();
    const safety = makeDefaultRuntimeSafety();
    const snap = buildSystemStateSnapshot({
      auditRepo: repo, config, currentMode: 'READ_ONLY',
      runtimeSafetyStatus: safety, killSwitchActive: false,
    });
    const str = JSON.stringify(snap);
    // unsafeFlags may contain flag names like ENABLE_LIVE_TRADING — not a secret
    // but must not contain credential-like values
    expect(str).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(str).not.toContain('DATABASE_URL');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// D. Worker support — events support read models
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 5 — Worker event support', () => {
  it('SYSTEM_STARTUP event detected in audit snapshot', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'SYSTEM_STARTUP', severity: 'info', message: 'startup', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.lastStartupTimestamp).not.toBeNull();
  });

  it('SYSTEM_HEARTBEAT event detected in audit snapshot', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'SYSTEM_HEARTBEAT', severity: 'debug', message: 'hb', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.lastHeartbeatTimestamp).not.toBeNull();
  });

  it('RUNTIME_SAFETY_STATUS event counted in audit total', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'RUNTIME_SAFETY_STATUS', severity: 'info', message: 'safety status', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.total).toBe(1);
  });

  it('UNSAFE_FLAGS_DETECTED event detected in audit snapshot', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'UNSAFE_FLAGS_DETECTED', severity: 'warn', message: 'unsafe flags', source: 'worker' });
    const snap = buildAuditStateSnapshot(repo);
    expect(snap.lastUnsafeFlagsTimestamp).not.toBeNull();
    expect(snap.recentWarnCount).toBe(1);
  });

  it('worker snapshot derived correctly from startup + heartbeat', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'SYSTEM_STARTUP', severity: 'info', message: 'startup', source: 'worker' });
    repo.record({ eventType: 'SYSTEM_HEARTBEAT', severity: 'debug', message: 'hb', source: 'worker' });
    const auditSnap = buildAuditStateSnapshot(repo);
    const workerSnap = buildWorkerStateSnapshot(auditSnap);
    expect(workerSnap.lastStartupTimestamp).not.toBeNull();
    expect(workerSnap.lastHeartbeatTimestamp).not.toBeNull();
    expect(workerSnap.status).toBe('healthy');
    expect(workerSnap.lastSafetyCheckPassed).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// E. Telegram /system formatters
// ════════════════════════════════════════════════════════════════════════════

function makeFullSnapshot(): SystemStateSnapshot {
  const repo = makeRepo();
  repo.record({ eventType: 'SYSTEM_STARTUP', severity: 'info', message: 'startup', source: 'worker' });
  repo.record({ eventType: 'SYSTEM_HEARTBEAT', severity: 'debug', message: 'hb', source: 'worker' });
  const config = loadConfig({});
  const safety = makeDefaultRuntimeSafety();
  return buildSystemStateSnapshot({
    auditRepo: repo,
    config,
    currentMode: 'READ_ONLY',
    runtimeSafetyStatus: safety,
    killSwitchActive: false,
  });
}

describe('Phase 5 — Telegram /system formatters', () => {
  beforeEach(() => resetConfig());

  it('formatSystemOverview returns non-empty string', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemOverview(snap);
    expect(text.length).toBeGreaterThan(10);
  });

  it('formatSystemOverview contains phase number', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemOverview(snap);
    expect(text).toContain('Phase: 7');
  });

  it('formatSystemOverview contains mode', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemOverview(snap);
    expect(text).toContain('READ_ONLY');
  });

  it('formatSystemOverview does not expose raw secrets', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemOverview(snap);
    expect(text).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(text).not.toContain('DATABASE_URL');
  });

  it('formatSystemHealth returns readiness', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemHealth(snap);
    expect(text).toMatch(/READY|DEGRADED|UNSAFE|UNKNOWN/);
  });

  it('formatSystemHealth does not expose raw secrets', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemHealth(snap);
    expect(text).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(text).not.toContain('DATABASE_URL');
  });

  it('formatSystemSafety shows locked modes', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemSafety(snap);
    expect(text).toContain('FULL_AUTO locked: true');
    expect(text).toContain('LIMITED_LIVE locked: true');
  });

  it('formatSystemSafety shows live trading disabled', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemSafety(snap);
    expect(text).toContain('Live trading: false');
    expect(text).toContain('Auto trading: false');
  });

  it('formatSystemSafety does not expose raw secrets', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemSafety(snap);
    expect(text).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(text).not.toContain('DATABASE_URL');
  });

  it('formatSystemAudit shows total events', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemAudit(snap.auditStats);
    expect(text).toContain('Total events:');
  });

  it('formatSystemAudit does not expose raw detailsJson', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemAudit(snap.auditStats);
    expect(text).not.toContain('detailsJson');
  });

  it('formatSystemAudit does not expose raw secrets', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemAudit(snap.auditStats);
    expect(text).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(text).not.toContain('DATABASE_URL');
  });

  it('formatSystemWorker shows worker status', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemWorker(snap.workerStatus);
    expect(text).toContain('Status:');
  });

  it('formatSystemWorker does not expose raw secrets', () => {
    const snap = makeFullSnapshot();
    const text = formatSystemWorker(snap.workerStatus);
    expect(text).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(text).not.toContain('DATABASE_URL');
  });

  it('formatSystemConfig shows app version', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    const text = formatSystemConfig(snap);
    expect(text).toContain('App version:');
  });

  it('formatSystemConfig does not expose TELEGRAM_BOT_TOKEN', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    const text = formatSystemConfig(snap);
    expect(text).not.toContain('TELEGRAM_BOT_TOKEN');
  });

  it('formatSystemConfig does not expose DATABASE_URL', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    const text = formatSystemConfig(snap);
    expect(text).not.toContain('DATABASE_URL');
  });

  it('formatSystemConfig explicitly states it does not show tokens', () => {
    const config = makeDefaultConfig();
    const snap = buildConfigStateSnapshot(config);
    const text = formatSystemConfig(snap);
    expect(text.toLowerCase()).toContain('never displayed');
  });

  it('formatSystemHelp lists supported subcommands', () => {
    const text = formatSystemHelp();
    expect(text).toContain('health');
    expect(text).toContain('safety');
    expect(text).toContain('audit');
    expect(text).toContain('worker');
    expect(text).toContain('config');
    expect(text).toContain('help');
  });

  it('formatSystemHelp mentions secrets are never shown', () => {
    const text = formatSystemHelp();
    expect(text.toLowerCase()).toContain('secret');
  });

  it('formatSystemUnknown handles unknown subcommand safely', () => {
    const text = formatSystemUnknown('dangerous-command');
    expect(text).toContain('dangerous-command');
    expect(text).toContain('help');
  });

  it('formatSystemUnknown does not expose raw secrets', () => {
    const text = formatSystemUnknown('TELEGRAM_BOT_TOKEN');
    // It should mention the subcommand name but not expose actual token values
    expect(text).not.toContain('Bearer');
    expect(text).not.toContain('sk-');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// F. Regression — prior phase exports still work
// ════════════════════════════════════════════════════════════════════════════

describe('Phase 5 — Regression', () => {
  beforeEach(() => resetConfig());

  it('InMemoryAuditLogger still implements IAuditRepository interface', async () => {
    const logger = new InMemoryAuditLogger();
    await logger.log({ id: randomUUID(), timestamp: new Date().toISOString(), eventType: 'TEST', severity: 'info', details: {} });
    const records = await logger.getRecent(10);
    expect(records.length).toBe(1);
  });

  it('SqliteAuditRepository still persists events', () => {
    const repo = makeRepo();
    repo.record({ eventType: 'TEST_EVENT', severity: 'info', message: 'test', source: 'test' });
    const records = repo.listRecent(10);
    expect(records.length).toBe(1);
    expect(records[0]!.eventType).toBe('TEST_EVENT');
  });

  it('PHASE constant is 7', () => {
    expect(PHASE).toBe(7);
  });

  it('PHASE_NAME matches Phase 7A', () => {
    expect(PHASE_NAME).toContain('Event Engine');
  });

  it('LOCKED_MODES still contains FULL_AUTO and LIMITED_LIVE', () => {
    expect(LOCKED_MODES).toContain('FULL_AUTO');
    expect(LOCKED_MODES).toContain('LIMITED_LIVE');
  });

  it('buildRuntimeSafetyStatus still returns fullAutoLocked=true', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: PHASE,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: false,
      unsafeFlags: [],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: false,
      telegramEnabled: false,
      databaseConfigured: true,
    });
    expect(status.fullAutoLocked).toBe(true);
    expect(status.limitedLiveLocked).toBe(true);
    expect(status.liveTradingEnabled).toBe(false);
    expect(status.autoTradingEnabled).toBe(false);
  });

  it('state package exports all expected symbols', async () => {
    const stateModule = await import('../packages/state/src/index.js');
    expect(typeof stateModule.buildSystemStateSnapshot).toBe('function');
    expect(typeof stateModule.buildAuditStateSnapshot).toBe('function');
    expect(typeof stateModule.buildConfigStateSnapshot).toBe('function');
    expect(typeof stateModule.buildModeStateSnapshot).toBe('function');
    expect(typeof stateModule.buildWorkerStateSnapshot).toBe('function');
    expect(typeof stateModule.calculateReadiness).toBe('function');
  });
});
