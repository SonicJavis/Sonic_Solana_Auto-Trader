import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig, loadConfigWithResult, resetConfig, safeConfigSummary } from '../packages/config/src/load.js';
import { redactValue, redactObject, isSensitiveKey, safeStringify } from '../packages/config/src/redact.js';
import { getConfigProvenance } from '../packages/config/src/provenance.js';
import {
  buildRuntimeSafetyStatus,
  getDefaultRuntimeSafetyStatus,
  formatRuntimeSafetyWarnings,
} from '../packages/shared/src/runtime-safety.js';
import { ModeManager } from '../packages/mode-manager/src/manager.js';
import { InMemoryAuditLogger } from '../packages/db/src/audit-logger.js';
import { formatStatus } from '../apps/telegram-bot/src/formatters/status.js';
import { formatSafety } from '../apps/telegram-bot/src/formatters/safety.js';

// =========================================
// loadConfig / loadConfigWithResult
// =========================================
describe('loadConfigWithResult', () => {
  beforeEach(() => {
    resetConfig();
  });

  it('returns valid=true for a clean env', () => {
    const result = loadConfigWithResult({ NODE_ENV: 'test', LOG_LEVEL: 'info', APP_MODE: 'READ_ONLY' });
    expect(result.valid).toBe(true);
  });

  it('defaults APP_MODE to READ_ONLY when not set', () => {
    const result = loadConfigWithResult({});
    expect(result.config.APP_MODE).toBe('READ_ONLY');
  });

  it('defaults SAFETY_PROFILE to strict', () => {
    const result = loadConfigWithResult({});
    expect(result.config.SAFETY_PROFILE).toBe('strict');
  });

  it('defaults all unsafe flags to false', () => {
    const result = loadConfigWithResult({});
    const c = result.config;
    expect(c.ENABLE_LIVE_TRADING).toBe(false);
    expect(c.ENABLE_AUTO_TRADING).toBe(false);
    expect(c.ENABLE_TRANSACTION_SIGNING).toBe(false);
    expect(c.ENABLE_TRANSACTION_SENDING).toBe(false);
    expect(c.ENABLE_WALLET_LOADING).toBe(false);
    expect(c.ENABLE_SOLANA_RPC).toBe(false);
    expect(c.ENABLE_JITO).toBe(false);
    expect(c.ENABLE_PUMPFUN_TRADING).toBe(false);
    expect(c.FULL_AUTO_UNLOCKED).toBe(false);
    expect(c.LIMITED_LIVE_UNLOCKED).toBe(false);
  });

  it('detects unsafe flags when set to "true"', () => {
    const result = loadConfigWithResult({ ENABLE_LIVE_TRADING: 'true' });
    expect(result.unsafeFlagsDetected).toBe(true);
    expect(result.unsafeFlags).toContain('ENABLE_LIVE_TRADING');
  });

  it('detects multiple unsafe flags', () => {
    const result = loadConfigWithResult({
      ENABLE_LIVE_TRADING: 'true',
      ENABLE_AUTO_TRADING: 'true',
      ENABLE_JITO: 'true',
    });
    expect(result.unsafeFlagsDetected).toBe(true);
    expect(result.unsafeFlags.length).toBeGreaterThanOrEqual(3);
  });

  it('includes warning when unsafe flags are detected', () => {
    const result = loadConfigWithResult({ ENABLE_LIVE_TRADING: 'true' });
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.join(' ').toLowerCase()).toContain('unsafe');
  });

  it('rejects LIMITED_LIVE as APP_MODE', () => {
    const result = loadConfigWithResult({ APP_MODE: 'LIMITED_LIVE' });
    expect(result.valid).toBe(false);
  });

  it('rejects FULL_AUTO as APP_MODE', () => {
    const result = loadConfigWithResult({ APP_MODE: 'FULL_AUTO' });
    expect(result.valid).toBe(false);
  });

  it('returns safe defaults when config is invalid', () => {
    const result = loadConfigWithResult({ APP_MODE: 'FULL_AUTO' });
    expect(result.config.APP_MODE).toBe('READ_ONLY');
  });

  it('FULL_AUTO_UNLOCKED flag is detected but does not unlock modes', () => {
    const result = loadConfigWithResult({ FULL_AUTO_UNLOCKED: 'true' });
    expect(result.unsafeFlags).toContain('FULL_AUTO_UNLOCKED');
    // Mode should remain READ_ONLY (default)
    expect(result.config.APP_MODE).toBe('READ_ONLY');
  });

  it('loadConfig returns AppConfig', () => {
    const config = loadConfig({ NODE_ENV: 'test' });
    expect(config.APP_MODE).toBeDefined();
  });
});

// =========================================
// safeConfigSummary
// =========================================
describe('safeConfigSummary', () => {
  it('redacts DATABASE_URL', () => {
    const config = loadConfig({});
    const summary = safeConfigSummary(config);
    expect(summary['DATABASE_URL']).toBe('[REDACTED]');
  });

  it('redacts TELEGRAM_BOT_TOKEN when set', () => {
    const config = loadConfig({ TELEGRAM_BOT_TOKEN: 'secret-bot-token-12345' });
    const summary = safeConfigSummary(config);
    expect(summary['TELEGRAM_BOT_TOKEN']).toBe('[REDACTED]');
  });

  it('shows "not set" marker for TELEGRAM_BOT_TOKEN when missing (before final redact pass)', () => {
    const config = loadConfig({});
    // TELEGRAM_BOT_TOKEN is always redacted in summary (key contains 'token')
    const summary = safeConfigSummary(config);
    expect(summary['TELEGRAM_BOT_TOKEN']).toBe('[REDACTED]');
  });

  it('includes all unsafe flags in summary', () => {
    const config = loadConfig({});
    const summary = safeConfigSummary(config);
    expect(summary['ENABLE_LIVE_TRADING']).toBe(false);
    expect(summary['FULL_AUTO_UNLOCKED']).toBe(false);
  });
});

// =========================================
// Redaction utilities
// =========================================
describe('redactValue', () => {
  it('returns boolean unchanged', () => {
    expect(redactValue(true)).toBe(true);
    expect(redactValue(false)).toBe(false);
  });

  it('returns number unchanged', () => {
    expect(redactValue(42)).toBe(42);
  });

  it('returns null unchanged', () => {
    expect(redactValue(null)).toBeNull();
  });

  it('redacts long hex strings', () => {
    const hex = 'a'.repeat(32);
    expect(redactValue(hex)).toBe('[REDACTED]');
  });

  it('does not redact short strings', () => {
    expect(redactValue('short')).toBe('short');
  });

  it('redacts nested object with sensitive key', () => {
    const result = redactValue({ token: 'some-secret-value-here' });
    expect((result as Record<string, unknown>)['token']).toBe('[REDACTED]');
  });
});

describe('isSensitiveKey', () => {
  it('detects "token" key', () => {
    expect(isSensitiveKey('TELEGRAM_BOT_TOKEN')).toBe(true);
  });

  it('detects "secret" key', () => {
    expect(isSensitiveKey('MY_SECRET')).toBe(true);
  });

  it('detects "password" key', () => {
    expect(isSensitiveKey('DB_PASSWORD')).toBe(true);
  });

  it('detects "private" key', () => {
    expect(isSensitiveKey('PRIVATE_KEY')).toBe(true);
  });

  it('does not flag "mode" key', () => {
    expect(isSensitiveKey('APP_MODE')).toBe(false);
  });

  it('does not flag "enabled" key', () => {
    expect(isSensitiveKey('ENABLE_LIVE_TRADING')).toBe(false);
  });
});

describe('redactObject', () => {
  it('redacts sensitive keys', () => {
    const result = redactObject({ TELEGRAM_BOT_TOKEN: 'abc123', APP_MODE: 'READ_ONLY' });
    expect(result['TELEGRAM_BOT_TOKEN']).toBe('[REDACTED]');
    expect(result['APP_MODE']).toBe('READ_ONLY');
  });

  it('handles nested objects', () => {
    const result = redactObject({ nested: { password: 'secret123' } });
    expect((result['nested'] as Record<string, unknown>)['password']).toBe('[REDACTED]');
  });

  it('handles circular references', () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj['self'] = obj;
    expect(() => redactObject(obj)).not.toThrow();
  });
});

describe('safeStringify', () => {
  it('serializes plain objects', () => {
    const result = safeStringify({ a: 1, b: 'test' });
    expect(result).toContain('"a"');
    expect(result).toContain('"b"');
  });

  it('handles circular references without throwing', () => {
    const obj: Record<string, unknown> = { x: 1 };
    obj['self'] = obj;
    expect(() => safeStringify(obj)).not.toThrow();
    const result = safeStringify(obj);
    expect(result).toContain('[circular]');
  });
});

// =========================================
// Config provenance
// =========================================
describe('getConfigProvenance', () => {
  it('marks env-sourced fields correctly', () => {
    const config = loadConfig({ NODE_ENV: 'test' });
    const entries = getConfigProvenance({ NODE_ENV: 'test' }, config);
    const nodeEnv = entries.find((e) => e.field === 'NODE_ENV');
    expect(nodeEnv?.source).toBe('env');
    expect(nodeEnv?.defaultUsed).toBe(false);
  });

  it('marks default-sourced fields correctly', () => {
    const config = loadConfig({});
    const entries = getConfigProvenance({}, config);
    const nodeEnv = entries.find((e) => e.field === 'NODE_ENV');
    expect(nodeEnv?.source).toBe('default');
    expect(nodeEnv?.defaultUsed).toBe(true);
  });

  it('marks sensitive fields as redacted', () => {
    const config = loadConfig({ TELEGRAM_BOT_TOKEN: 'secret' });
    const entries = getConfigProvenance({ TELEGRAM_BOT_TOKEN: 'secret' }, config);
    const tokenEntry = entries.find((e) => e.field === 'TELEGRAM_BOT_TOKEN');
    expect(tokenEntry?.sensitive).toBe(true);
    expect(tokenEntry?.redacted).toBe(true);
    expect(tokenEntry?.safeDisplayValue).toBe('[REDACTED]');
  });

  it('returns an entry for every config field', () => {
    const config = loadConfig({});
    const entries = getConfigProvenance({}, config);
    expect(entries.length).toBeGreaterThan(0);
    const fields = entries.map((e) => e.field);
    expect(fields).toContain('APP_MODE');
    expect(fields).toContain('ENABLE_LIVE_TRADING');
  });
});

// =========================================
// RuntimeSafetyStatus
// =========================================
describe('buildRuntimeSafetyStatus', () => {
  it('always sets liveTradingEnabled to false', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: false,
      unsafeFlags: [],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: true,
      telegramEnabled: true,
      databaseConfigured: true,
    });
    expect(status.liveTradingEnabled).toBe(false);
  });

  it('always sets fullAutoLocked to true', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'PAPER',
      configValid: true,
      unsafeFlagsDetected: true,
      unsafeFlags: ['ENABLE_LIVE_TRADING'],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: true,
      telegramEnabled: true,
      databaseConfigured: true,
    });
    expect(status.fullAutoLocked).toBe(true);
    expect(status.limitedLiveLocked).toBe(true);
  });

  it('all unsafe capability flags are always false', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: true,
      unsafeFlags: ['ENABLE_LIVE_TRADING', 'ENABLE_JITO'],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: false,
      telegramEnabled: false,
      databaseConfigured: false,
    });
    expect(status.autoTradingEnabled).toBe(false);
    expect(status.transactionSigningEnabled).toBe(false);
    expect(status.transactionSendingEnabled).toBe(false);
    expect(status.walletLoadingEnabled).toBe(false);
    expect(status.solanaRpcEnabled).toBe(false);
    expect(status.jitoEnabled).toBe(false);
    expect(status.pumpfunTradingEnabled).toBe(false);
  });

  it('includes timestamp', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: false,
      unsafeFlags: [],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: false,
      telegramEnabled: false,
      databaseConfigured: false,
    });
    expect(status.timestamp).toBeDefined();
    expect(new Date(status.timestamp).getTime()).toBeGreaterThan(0);
  });
});

describe('getDefaultRuntimeSafetyStatus', () => {
  it('returns phase 3 as current phase', () => {
    const status = getDefaultRuntimeSafetyStatus();
    expect(status.currentPhase).toBe(3);
  });

  it('defaults to READ_ONLY mode', () => {
    const status = getDefaultRuntimeSafetyStatus();
    expect(status.currentMode).toBe('READ_ONLY');
  });

  it('has configValid=false', () => {
    const status = getDefaultRuntimeSafetyStatus();
    expect(status.configValid).toBe(false);
  });
});

describe('formatRuntimeSafetyWarnings', () => {
  it('includes unsafe flag warning when detected', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: true,
      unsafeFlags: ['ENABLE_LIVE_TRADING'],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: true,
      telegramEnabled: true,
      databaseConfigured: true,
    });
    const warnings = formatRuntimeSafetyWarnings(status);
    expect(warnings.some((w) => w.toLowerCase().includes('unsafe flags'))).toBe(true);
  });

  it('includes config invalid warning', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: false,
      unsafeFlagsDetected: false,
      unsafeFlags: [],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: true,
      telegramEnabled: true,
      databaseConfigured: true,
    });
    const warnings = formatRuntimeSafetyWarnings(status);
    expect(warnings.some((w) => w.toLowerCase().includes('config'))).toBe(true);
  });

  it('includes no-admin warning when not configured', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: false,
      unsafeFlags: [],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: false,
      telegramEnabled: true,
      databaseConfigured: true,
    });
    const warnings = formatRuntimeSafetyWarnings(status);
    expect(warnings.some((w) => w.toLowerCase().includes('admin'))).toBe(true);
  });
});

// =========================================
// ModeManager Phase 3
// =========================================
describe('ModeManager Phase 3', () => {
  it('returns TransitionResult with accepted and success fields', async () => {
    const manager = new ModeManager(new InMemoryAuditLogger());
    const result = await manager.setMode('PAPER', 'test');
    expect(result.accepted).toBe(true);
    expect(result.success).toBe(true);
    expect(result.previousMode).toBe('READ_ONLY');
    expect(result.resultingMode).toBe('PAPER');
  });

  it('rejected transitions have lockedMode=true for FULL_AUTO', async () => {
    const manager = new ModeManager(new InMemoryAuditLogger());
    const result = await manager.setMode('FULL_AUTO', 'test');
    expect(result.accepted).toBe(false);
    expect(result.success).toBe(false);
    expect(result.lockedMode).toBe(true);
    expect(result.rejectionReason).toBeDefined();
    expect(result.error).toBeDefined();
  });

  it('rejected transitions have lockedMode=true for LIMITED_LIVE', async () => {
    const manager = new ModeManager(new InMemoryAuditLogger());
    const result = await manager.setMode('LIMITED_LIVE', 'test');
    expect(result.lockedMode).toBe(true);
  });

  it('unknown mode returns lockedMode=false', async () => {
    const manager = new ModeManager(new InMemoryAuditLogger());
    const result = await manager.setMode('TURBO_MODE', 'test');
    expect(result.accepted).toBe(false);
    expect(result.lockedMode).toBe(false);
  });

  it('includes timestamp in result', async () => {
    const manager = new ModeManager(new InMemoryAuditLogger());
    const result = await manager.setMode('PAPER', 'test');
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('logs audit event on successful transition', async () => {
    const auditLogger = new InMemoryAuditLogger();
    const manager = new ModeManager(auditLogger);
    await manager.setMode('PAPER', 'test-trigger', 'testing');
    const records = await auditLogger.getRecent(5);
    const modeEvent = records.find((r) => r.eventType === 'MODE_CHANGE');
    expect(modeEvent).toBeDefined();
  });

  it('logs audit event with warn severity on rejected transition', async () => {
    const auditLogger = new InMemoryAuditLogger();
    const manager = new ModeManager(auditLogger);
    await manager.setMode('FULL_AUTO', 'test-trigger');
    const records = await auditLogger.getRecent(5);
    const modeEvent = records.find((r) => r.eventType === 'MODE_CHANGE');
    expect(modeEvent?.severity).toBe('warn');
  });
});

// =========================================
// Formatter Phase 3 additions
// =========================================
describe('formatStatus Phase 3', () => {
  it('shows unsafe flags section when runtimeSafety has unsafe flags', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: true,
      unsafeFlags: ['ENABLE_LIVE_TRADING'],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: true,
      telegramEnabled: true,
      databaseConfigured: true,
    });
    const text = formatStatus({
      mode: 'READ_ONLY',
      uptimeSeconds: 0,
      telegramEnabled: true,
      adminConfigured: true,
      killSwitchActive: false,
      runtimeSafety: status,
    });
    expect(text).toContain('ENABLE_LIVE_TRADING');
    expect(text.toLowerCase()).toContain('unsafe flags');
  });

  it('shows "Unsafe flags detected: false" when no unsafe flags', () => {
    const text = formatStatus({
      mode: 'READ_ONLY',
      uptimeSeconds: 0,
      telegramEnabled: true,
      adminConfigured: true,
      killSwitchActive: false,
    });
    expect(text).toContain('Unsafe flags detected: false');
  });
});

describe('formatSafety Phase 3', () => {
  it('shows unsafe flags warning in safety formatter', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 3,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: true,
      unsafeFlags: ['ENABLE_JITO'],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: true,
      telegramEnabled: true,
      databaseConfigured: true,
    });
    const text = formatSafety({
      mode: 'READ_ONLY',
      adminConfigured: true,
      killSwitchActive: false,
      runtimeSafety: status,
    });
    expect(text.toLowerCase()).toContain('unsafe flags');
    expect(text).toContain('ENABLE_JITO');
  });

  it('includes Jito and Pump.fun lines', () => {
    const text = formatSafety({
      mode: 'READ_ONLY',
      adminConfigured: true,
      killSwitchActive: false,
    });
    expect(text.toLowerCase()).toContain('jito');
    expect(text.toLowerCase()).toContain('pump.fun');
  });
});
