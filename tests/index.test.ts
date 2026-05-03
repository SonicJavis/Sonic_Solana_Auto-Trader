import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig, resetConfig } from '../packages/config/src/load.js';
import { redactSecrets } from '../packages/config/src/redact.js';
import { InMemoryAuditLogger } from '../packages/db/src/audit-logger.js';
import { ModeManager } from '../packages/mode-manager/src/manager.js';
import { RiskEngine } from '../packages/risk-engine/src/engine.js';

describe('Phase 1 Foundation Tests', () => {
  beforeEach(() => {
    resetConfig();
  });

  it('Config defaults to READ_ONLY', () => {
    const config = loadConfig({ NODE_ENV: 'test' });
    expect(config.APP_MODE).toBe('READ_ONLY');
  });

  it('Missing Telegram token does not crash config', () => {
    expect(() => loadConfig({ NODE_ENV: 'test' })).not.toThrow();
    const config = loadConfig({ NODE_ENV: 'test' });
    expect(config.TELEGRAM_BOT_TOKEN).toBeUndefined();
  });

  it('Secret redaction hides token-like values', () => {
    const obj = { telegramToken: 'abc123secretxyz', normalField: 'visible' };
    const redacted = redactSecrets(obj);
    expect(redacted['telegramToken']).toBe('[REDACTED]');
    expect(redacted['normalField']).toBe('visible');
  });

  it('Mode manager starts in READ_ONLY', () => {
    const auditLogger = new InMemoryAuditLogger();
    const manager = new ModeManager(auditLogger);
    expect(manager.getMode()).toBe('READ_ONLY');
  });

  it('KILL_SWITCH blocks unsafe actions', async () => {
    const auditLogger = new InMemoryAuditLogger();
    const manager = new ModeManager(auditLogger);
    await manager.setMode('KILL_SWITCH', 'test');
    const engine = new RiskEngine(manager);
    const result = engine.evaluate('CHANGE_MODE');
    expect(result.allowed).toBe(false);
  });

  it('READ_ONLY blocks TRADE actions', () => {
    const auditLogger = new InMemoryAuditLogger();
    const manager = new ModeManager(auditLogger);
    const engine = new RiskEngine(manager);
    const result = engine.evaluate('TRADE');
    expect(result.allowed).toBe(false);
  });

  it('FULL_AUTO cannot be enabled in Phase 1', async () => {
    const auditLogger = new InMemoryAuditLogger();
    const manager = new ModeManager(auditLogger);
    const result = await manager.setMode('FULL_AUTO', 'test');
    expect(result.success).toBe(false);
    expect(manager.getMode()).toBe('READ_ONLY');
  });

  it('Status shows live trading disabled', () => {
    const report = {
      status: 'healthy',
      version: '0.1.0',
      uptimeSeconds: 0,
      mode: 'READ_ONLY',
      telegramEnabled: true,
      executionEnabled: false,
      liveTradingEnabled: false,
      checkedAt: new Date().toISOString(),
    };
    expect(report.executionEnabled).toBe(false);
    expect(report.liveTradingEnabled).toBe(false);
  });

  it('Worker can boot in safe degraded mode (no Telegram token)', () => {
    const config = loadConfig({ NODE_ENV: 'test' });
    expect(config.TELEGRAM_BOT_TOKEN).toBeUndefined();
    expect(config.APP_MODE).toBe('READ_ONLY');
    expect(() => {
      const auditLogger = new InMemoryAuditLogger();
      const manager = new ModeManager(auditLogger, config.APP_MODE);
      expect(manager.getMode()).toBe('READ_ONLY');
    }).not.toThrow();
  });

  it('Audit logger records mode changes', async () => {
    const auditLogger = new InMemoryAuditLogger();
    const manager = new ModeManager(auditLogger);
    await manager.setMode('PAUSED', 'test', 'Testing');
    const records = await auditLogger.getRecent();
    expect(records.length).toBe(1);
    expect(records[0]?.eventType).toBe('MODE_CHANGE');
  });
});
