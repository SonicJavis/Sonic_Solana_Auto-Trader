import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditLogger } from '@sonic/db';
import type { AppMode } from '@sonic/shared';
import { ALL_MODES, LOCKED_MODES } from '@sonic/shared';
import { getTelegramUserInfo, requireAdmin } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';

const PHASE2_ALLOWED_TARGETS: AppMode[] = ['READ_ONLY', 'PAPER', 'MANUAL_CONFIRM', 'PAUSED', 'KILL_SWITCH'];
const PHASE2_BLOCKED_TARGETS: AppMode[] = ['LIMITED_LIVE', 'FULL_AUTO'];

function normalizeMode(input: string): AppMode | null {
  const upper = input.toUpperCase().trim();
  if ((ALL_MODES as readonly string[]).includes(upper)) {
    return upper as AppMode;
  }
  return null;
}

export async function handleMode(ctx: Context, config: AppConfig, modeManager: ModeManager, auditLogger: IAuditLogger): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const currentMode = modeManager.getMode();

  const text = (ctx.message && 'text' in ctx.message) ? ctx.message.text : '';
  const parts = text.trim().split(/\s+/);
  const arg = parts[1];

  if (!arg) {
    await auditTelegramCommand(auditLogger, { info, command: '/mode', accepted: true, modeBefore: currentMode });
    await ctx.reply(
      [
        `Current mode: ${currentMode}`,
        '',
        'Phase 2 allowed target modes:',
        '  ' + PHASE2_ALLOWED_TARGETS.join(', '),
        '',
        'Blocked modes (locked):',
        '  ' + PHASE2_BLOCKED_TARGETS.join(', '),
        '',
        'Usage: /mode READ_ONLY | PAPER | MANUAL_CONFIRM | PAUSED | KILL_SWITCH',
        '(Admin only to change mode)',
      ].join('\n'),
    );
    return;
  }

  const allowed = await requireAdmin(ctx, config, '/mode', async (uInfo, action, accepted, reason) => {
    await auditTelegramCommand(auditLogger, {
      info: uInfo,
      command: action,
      accepted,
      reason,
      modeBefore: currentMode,
    });
  });
  if (!allowed) return;

  const targetMode = normalizeMode(arg);
  if (!targetMode) {
    await auditTelegramCommand(auditLogger, {
      info,
      command: '/mode',
      accepted: false,
      reason: `unknown-mode:${arg}`,
      modeBefore: currentMode,
    });
    await ctx.reply(`Unknown mode: "${arg}". Valid Phase 2 modes: ${PHASE2_ALLOWED_TARGETS.join(', ')}`);
    return;
  }

  if ((LOCKED_MODES as AppMode[]).includes(targetMode)) {
    await auditTelegramCommand(auditLogger, {
      info,
      command: '/mode',
      accepted: false,
      reason: `blocked-locked-mode:${targetMode}`,
      modeBefore: currentMode,
    });
    await ctx.reply(`Mode ${targetMode} is locked and cannot be enabled. Phase 2 does not allow ${targetMode}.`);
    return;
  }

  if (!PHASE2_ALLOWED_TARGETS.includes(targetMode)) {
    await auditTelegramCommand(auditLogger, {
      info,
      command: '/mode',
      accepted: false,
      reason: `blocked-phase2:${targetMode}`,
      modeBefore: currentMode,
    });
    await ctx.reply(`Mode ${targetMode} is not allowed in Phase 2.`);
    return;
  }

  const result = await modeManager.setMode(targetMode, `telegram:/mode`, `Mode change via Telegram /mode by user ${info.userId}`);
  const newMode = modeManager.getMode();

  if (result.success) {
    await auditTelegramCommand(auditLogger, {
      info,
      command: '/mode',
      accepted: true,
      reason: `mode-changed`,
      modeBefore: currentMode,
      modeAfter: newMode,
    });
    await ctx.reply(`Mode changed: ${currentMode} -> ${newMode}`);
  } else {
    await auditTelegramCommand(auditLogger, {
      info,
      command: '/mode',
      accepted: false,
      reason: result.error,
      modeBefore: currentMode,
    });
    await ctx.reply(`Failed to change mode: ${result.error}`);
  }
}
