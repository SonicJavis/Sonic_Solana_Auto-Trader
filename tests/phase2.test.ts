import { describe, it, expect, vi } from 'vitest';
import type { Context } from 'telegraf';
import { InMemoryAuditLogger } from '../packages/db/src/audit-logger.js';
import { ModeManager } from '../packages/mode-manager/src/manager.js';
import { isAdmin, hasConfiguredAdmins, getTelegramUserInfo } from '../apps/telegram-bot/src/permissions.js';
import { auditTelegramCommand, auditTelegramCallback } from '../apps/telegram-bot/src/audit.js';
import { formatStatus } from '../apps/telegram-bot/src/formatters/status.js';
import { formatSafety } from '../apps/telegram-bot/src/formatters/safety.js';
import { formatAuditLog, formatAuditRecord } from '../apps/telegram-bot/src/formatters/audit.js';
import { formatVersion } from '../apps/telegram-bot/src/formatters/version.js';
import type { AppConfig } from '../packages/config/src/schema.js';

// --- Helper factories ---

function makeAuditLogger() {
  return new InMemoryAuditLogger();
}

function makeModeManager(auditLogger = makeAuditLogger()) {
  return new ModeManager(auditLogger);
}

function makeConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    NODE_ENV: 'test',
    LOG_LEVEL: 'info',
    APP_MODE: 'READ_ONLY',
    APP_VERSION: '0.1.0',
    SAFETY_PROFILE: 'strict',
    TELEGRAM_BOT_TOKEN: undefined,
    TELEGRAM_ADMIN_IDS: [],
    DATABASE_URL: './data/sonic.db',
    ENABLE_LIVE_TRADING: false,
    ENABLE_AUTO_TRADING: false,
    ENABLE_TRANSACTION_SIGNING: false,
    ENABLE_TRANSACTION_SENDING: false,
    ENABLE_WALLET_LOADING: false,
    ENABLE_SOLANA_RPC: false,
    ENABLE_JITO: false,
    ENABLE_PUMPFUN_TRADING: false,
    FULL_AUTO_UNLOCKED: false,
    LIMITED_LIVE_UNLOCKED: false,
    ...overrides,
  };
}

function makeUserInfo(userId = 123, username = 'testuser', chatId = 456) {
  return { userId, username, chatId };
}

function makeMockCtx(opts: {
  userId?: number;
  username?: string;
  chatId?: number;
  messageText?: string;
} = {}) {
  const replies: string[] = [];
  const cbAnswers: string[] = [];
  const editedMessages: string[] = [];
  return {
    from: { id: opts.userId ?? 123, username: opts.username ?? 'testuser' },
    chat: { id: opts.chatId ?? 456 },
    message: opts.messageText ? { text: opts.messageText } : { text: '' },
    reply: vi.fn(async (text: string) => { replies.push(text); }),
    answerCbQuery: vi.fn(async (text: string) => { cbAnswers.push(text); }),
    editMessageText: vi.fn(async (text: string) => { editedMessages.push(text); }),
    callbackQuery: { data: '' },
    _replies: replies,
    _cbAnswers: cbAnswers,
    _editedMessages: editedMessages,
  };
}

// =========================================
// Permission Tests
// =========================================
describe('Permission helpers', () => {
  it('isAdmin returns false when admin list is empty', () => {
    expect(isAdmin(123, [])).toBe(false);
  });

  it('isAdmin returns false for non-admin user', () => {
    expect(isAdmin(999, ['123', '456'])).toBe(false);
  });

  it('isAdmin returns true for configured admin', () => {
    expect(isAdmin(123, ['123', '456'])).toBe(true);
  });

  it('hasConfiguredAdmins returns false for empty list', () => {
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: [] });
    expect(hasConfiguredAdmins(config)).toBe(false);
  });

  it('hasConfiguredAdmins returns true when admins are configured', () => {
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    expect(hasConfiguredAdmins(config)).toBe(true);
  });

  it('getTelegramUserInfo extracts user info from context', () => {
    const ctx = makeMockCtx({ userId: 42, username: 'alice', chatId: 99 });
    const info = getTelegramUserInfo(ctx as unknown as Context);
    expect(info.userId).toBe(42);
    expect(info.username).toBe('alice');
    expect(info.chatId).toBe(99);
  });
});

// =========================================
// Audit Tests
// =========================================
describe('Audit helpers', () => {
  it('auditTelegramCommand records a TELEGRAM_COMMAND event', async () => {
    const auditLogger = makeAuditLogger();
    const info = makeUserInfo();
    await auditTelegramCommand(auditLogger, { info, command: '/test', accepted: true });
    const records = await auditLogger.getRecent(5);
    expect(records.length).toBe(1);
    expect(records[0]?.eventType).toBe('TELEGRAM_COMMAND');
  });

  it('auditTelegramCallback records a TELEGRAM_CALLBACK event', async () => {
    const auditLogger = makeAuditLogger();
    const info = makeUserInfo();
    await auditTelegramCallback(auditLogger, { info, callbackId: 'kill:confirm', accepted: true });
    const records = await auditLogger.getRecent(5);
    expect(records.length).toBe(1);
    expect(records[0]?.eventType).toBe('TELEGRAM_CALLBACK');
  });

  it('rejected command records severity warn', async () => {
    const auditLogger = makeAuditLogger();
    const info = makeUserInfo();
    await auditTelegramCommand(auditLogger, { info, command: '/kill', accepted: false, reason: 'not-admin' });
    const records = await auditLogger.getRecent(1);
    expect(records[0]?.severity).toBe('warn');
  });
});

// =========================================
// Formatter Tests
// =========================================
describe('Status formatter', () => {
  it('includes "trading enabled: false"', () => {
    const text = formatStatus({ mode: 'READ_ONLY', uptimeSeconds: 0, telegramEnabled: true, adminConfigured: true, killSwitchActive: false });
    expect(text.toLowerCase()).toContain('trading enabled: false');
  });

  it('includes "execution enabled: false"', () => {
    const text = formatStatus({ mode: 'READ_ONLY', uptimeSeconds: 0, telegramEnabled: true, adminConfigured: true, killSwitchActive: false });
    expect(text.toLowerCase()).toContain('execution enabled: false');
  });

  it('includes "wallet loaded: false"', () => {
    const text = formatStatus({ mode: 'READ_ONLY', uptimeSeconds: 0, telegramEnabled: true, adminConfigured: true, killSwitchActive: false });
    expect(text.toLowerCase()).toContain('wallet loaded: false');
  });

  it('includes FULL_AUTO locked: true', () => {
    const text = formatStatus({ mode: 'READ_ONLY', uptimeSeconds: 0, telegramEnabled: true, adminConfigured: true, killSwitchActive: false });
    expect(text).toContain('FULL_AUTO locked: true');
  });

  it('includes LIMITED_LIVE locked: true', () => {
    const text = formatStatus({ mode: 'READ_ONLY', uptimeSeconds: 0, telegramEnabled: true, adminConfigured: true, killSwitchActive: false });
    expect(text).toContain('LIMITED_LIVE locked: true');
  });

  it('shows kill switch active when true', () => {
    const text = formatStatus({ mode: 'KILL_SWITCH', uptimeSeconds: 0, telegramEnabled: true, adminConfigured: true, killSwitchActive: true });
    expect(text).toContain('Kill switch active: true');
  });
});

describe('Safety formatter', () => {
  it('includes private key handling not implemented', () => {
    const text = formatSafety({ mode: 'READ_ONLY', adminConfigured: true, killSwitchActive: false });
    expect(text.toLowerCase()).toContain('private key handling: not implemented');
  });

  it('includes FULL_AUTO: locked', () => {
    const text = formatSafety({ mode: 'READ_ONLY', adminConfigured: true, killSwitchActive: false });
    expect(text).toContain('FULL_AUTO: locked');
  });

  it('includes LIMITED_LIVE: locked', () => {
    const text = formatSafety({ mode: 'READ_ONLY', adminConfigured: true, killSwitchActive: false });
    expect(text).toContain('LIMITED_LIVE: locked');
  });

  it('includes wallet loading not implemented', () => {
    const text = formatSafety({ mode: 'READ_ONLY', adminConfigured: true, killSwitchActive: false });
    expect(text.toLowerCase()).toContain('wallet loading: not implemented');
  });
});

describe('Audit formatter', () => {
  it('handles empty audit log gracefully', () => {
    const text = formatAuditLog([]);
    expect(text).toContain('No audit events');
  });

  it('redacts token-like field values', () => {
    const record = {
      id: '1',
      timestamp: new Date().toISOString(),
      eventType: 'TEST',
      severity: 'info' as const,
      details: JSON.stringify({ token: 'abc123secretxyzabcdef123456789012345' }),
    };
    const text = formatAuditRecord(record);
    expect(text).not.toContain('abc123secretxyz');
    expect(text).toContain('[REDACTED]');
  });

  it('redacts long secret-like string values', () => {
    const record = {
      id: '1',
      timestamp: new Date().toISOString(),
      eventType: 'TEST',
      severity: 'info' as const,
      details: JSON.stringify({ someField: 'A'.repeat(40) }),
    };
    const text = formatAuditRecord(record);
    expect(text).toContain('[REDACTED]');
    expect(text).not.toContain('A'.repeat(40));
  });

  it('shows non-sensitive values', () => {
    const record = {
      id: '1',
      timestamp: new Date().toISOString(),
      eventType: 'TELEGRAM_COMMAND',
      severity: 'info' as const,
      details: JSON.stringify({ command: '/status', userId: 123, accepted: true }),
    };
    const text = formatAuditRecord(record);
    expect(text).toContain('/status');
  });
});

describe('Version formatter', () => {
  it('includes current phase', () => {
    const text = formatVersion('test');
    expect(text).toContain('Phase: 6');
  });

  it('includes safety notice', () => {
    const text = formatVersion('test');
    expect(text.toLowerCase()).toContain('trading disabled');
  });
});

// =========================================
// Mode Manager Phase 2 Tests
// =========================================
describe('Mode manager Phase 2', () => {
  it('FULL_AUTO cannot be enabled', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const result = await manager.setMode('FULL_AUTO', 'test');
    expect(result.success).toBe(false);
    expect(manager.getMode()).toBe('READ_ONLY');
  });

  it('LIMITED_LIVE cannot be enabled', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const result = await manager.setMode('LIMITED_LIVE', 'test');
    expect(result.success).toBe(false);
    expect(manager.getMode()).toBe('READ_ONLY');
  });

  it('can transition to PAPER', async () => {
    const manager = makeModeManager();
    const result = await manager.setMode('PAPER', 'test');
    expect(result.success).toBe(true);
    expect(manager.getMode()).toBe('PAPER');
  });

  it('can transition to MANUAL_CONFIRM', async () => {
    const manager = makeModeManager();
    const result = await manager.setMode('MANUAL_CONFIRM', 'test');
    expect(result.success).toBe(true);
    expect(manager.getMode()).toBe('MANUAL_CONFIRM');
  });

  it('can transition to PAUSED', async () => {
    const manager = makeModeManager();
    const result = await manager.setMode('PAUSED', 'test');
    expect(result.success).toBe(true);
    expect(manager.getMode()).toBe('PAUSED');
  });

  it('can transition to KILL_SWITCH', async () => {
    const manager = makeModeManager();
    const result = await manager.setMode('KILL_SWITCH', 'test');
    expect(result.success).toBe(true);
    expect(manager.getMode()).toBe('KILL_SWITCH');
    expect(manager.isKillSwitchActive()).toBe(true);
  });
});

// =========================================
// Command handler tests (using mock ctx)
// =========================================

describe('/pause command', () => {
  it('non-admin cannot pause', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['999'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handlePause } = await import('../apps/telegram-bot/src/commands/pause.js');
    await handlePause(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Unauthorized'));

    const records = await auditLogger.getRecent(10);
    const commandRecords = records.filter(r => r.eventType === 'TELEGRAM_COMMAND');
    expect(commandRecords.length).toBeGreaterThan(0);
    const rejected = commandRecords.find(r => {
      const d = JSON.parse(r.details) as Record<string, unknown>;
      return d['accepted'] === false;
    });
    expect(rejected).toBeDefined();
  });

  it('missing admin IDs locks pause command', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: [] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handlePause } = await import('../apps/telegram-bot/src/commands/pause.js');
    await handlePause(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('locked'));
  });

  it('admin can pause', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handlePause } = await import('../apps/telegram-bot/src/commands/pause.js');
    await handlePause(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('PAUSED');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('paused'));
  });
});

describe('/kill command', () => {
  it('non-admin cannot use /kill', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['999'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleKill } = await import('../apps/telegram-bot/src/commands/kill.js');
    await handleKill(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Unauthorized'));
  });

  it('admin gets confirmation prompt', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleKill } = await import('../apps/telegram-bot/src/commands/kill.js');
    await handleKill(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalled();
    const replyText = ctx._replies[0] ?? '';
    expect(replyText.toLowerCase()).toContain('confirm');
  });

  it('/kill does not immediately set KILL_SWITCH', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleKill } = await import('../apps/telegram-bot/src/commands/kill.js');
    await handleKill(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
  });
});

describe('Kill callback', () => {
  it('kill:confirm sets KILL_SWITCH', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleKillCallback } = await import('../apps/telegram-bot/src/callbacks/kill.js');
    await handleKillCallback(ctx as unknown as Context, 'kill:confirm', config, manager, auditLogger);

    expect(manager.getMode()).toBe('KILL_SWITCH');
    expect(manager.isKillSwitchActive()).toBe(true);

    const records = await auditLogger.getRecent(10);
    const callbackRecords = records.filter(r => r.eventType === 'TELEGRAM_CALLBACK');
    expect(callbackRecords.length).toBeGreaterThan(0);
  });

  it('kill:cancel does not change mode', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleKillCallback } = await import('../apps/telegram-bot/src/callbacks/kill.js');
    await handleKillCallback(ctx as unknown as Context, 'kill:cancel', config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.answerCbQuery).toHaveBeenCalledWith(expect.stringContaining('cancel'));

    const records = await auditLogger.getRecent(10);
    const callbackRecords = records.filter(r => r.eventType === 'TELEGRAM_CALLBACK');
    expect(callbackRecords.length).toBeGreaterThan(0);
  });

  it('non-admin callback is rejected and audited', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['999'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleKillCallback } = await import('../apps/telegram-bot/src/callbacks/kill.js');
    await handleKillCallback(ctx as unknown as Context, 'kill:confirm', config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    const records = await auditLogger.getRecent(10);
    const rejected = records.find(r => {
      const d = JSON.parse(r.details) as Record<string, unknown>;
      return d['accepted'] === false;
    });
    expect(rejected).toBeDefined();
  });

  it('invalid callback payload is rejected and audited', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleKillCallback } = await import('../apps/telegram-bot/src/callbacks/kill.js');
    await handleKillCallback(ctx as unknown as Context, 'kill:unknown_action', config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    const records = await auditLogger.getRecent(10);
    const rejected = records.find(r => {
      const d = JSON.parse(r.details) as Record<string, unknown>;
      return d['accepted'] === false;
    });
    expect(rejected).toBeDefined();
  });
});

describe('/mode command', () => {
  it('shows current mode without argument (no admin required)', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: [] });
    const ctx = makeMockCtx({ userId: 123, messageText: '/mode' });

    const { handleMode } = await import('../apps/telegram-bot/src/commands/mode.js');
    await handleMode(ctx as unknown as Context, config, manager, auditLogger);

    expect(ctx.reply).toHaveBeenCalled();
    expect(ctx._replies[0]).toContain('READ_ONLY');
  });

  it('cannot set LIMITED_LIVE', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123, messageText: '/mode LIMITED_LIVE' });

    const { handleMode } = await import('../apps/telegram-bot/src/commands/mode.js');
    await handleMode(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('locked'));
  });

  it('cannot set FULL_AUTO', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123, messageText: '/mode FULL_AUTO' });

    const { handleMode } = await import('../apps/telegram-bot/src/commands/mode.js');
    await handleMode(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('locked'));
  });

  it('unknown mode is rejected and audited', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123, messageText: '/mode TURBO_MODE' });

    const { handleMode } = await import('../apps/telegram-bot/src/commands/mode.js');
    await handleMode(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Unknown mode'));
  });

  it('admin can change to PAPER', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123, messageText: '/mode PAPER' });

    const { handleMode } = await import('../apps/telegram-bot/src/commands/mode.js');
    await handleMode(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('PAPER');
  });

  it('non-admin cannot change mode with argument', async () => {
    const auditLogger = makeAuditLogger();
    const manager = makeModeManager(auditLogger);
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['999'] });
    const ctx = makeMockCtx({ userId: 123, messageText: '/mode PAPER' });

    const { handleMode } = await import('../apps/telegram-bot/src/commands/mode.js');
    await handleMode(ctx as unknown as Context, config, manager, auditLogger);

    expect(manager.getMode()).toBe('READ_ONLY');
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Unauthorized'));
  });
});

describe('/audit command', () => {
  it('non-admin cannot use /audit', async () => {
    const auditLogger = makeAuditLogger();
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['999'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleAudit } = await import('../apps/telegram-bot/src/commands/audit.js');
    await handleAudit(ctx as unknown as Context, config, auditLogger);

    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Unauthorized'));
  });

  it('admin can view audit log', async () => {
    const auditLogger = makeAuditLogger();
    const config = makeConfig({ TELEGRAM_ADMIN_IDS: ['123'] });
    const ctx = makeMockCtx({ userId: 123 });

    const { handleAudit } = await import('../apps/telegram-bot/src/commands/audit.js');
    await handleAudit(ctx as unknown as Context, config, auditLogger);

    expect(ctx.reply).toHaveBeenCalled();
    const replyText = ctx._replies[0] ?? '';
    expect(replyText.toLowerCase()).toContain('audit');
  });
});

describe('Boot with missing token', () => {
  it('can build ModeManager without Telegram token', () => {
    const auditLogger = makeAuditLogger();
    expect(() => new ModeManager(auditLogger)).not.toThrow();
  });

  it('config is valid without TELEGRAM_BOT_TOKEN', () => {
    const config = makeConfig({ TELEGRAM_BOT_TOKEN: undefined });
    expect(config.TELEGRAM_BOT_TOKEN).toBeUndefined();
    expect(config.APP_MODE).toBe('READ_ONLY');
  });
});
