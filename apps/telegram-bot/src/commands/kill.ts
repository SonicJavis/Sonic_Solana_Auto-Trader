import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditRepository } from '@sonic/db';
import { Markup } from 'telegraf';
import { getTelegramUserInfo, requireAdmin } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';

export async function handleKill(ctx: Context, config: AppConfig, modeManager: ModeManager, auditLogger: IAuditRepository): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const modeBefore = modeManager.getMode();

  const allowed = await requireAdmin(ctx, config, '/kill', async (uInfo, action, accepted, reason) => {
    await auditTelegramCommand(auditLogger, { info: uInfo, command: action, accepted, reason, modeBefore });
  });
  if (!allowed) return;

  await auditTelegramCommand(auditLogger, {
    info,
    command: '/kill',
    accepted: true,
    reason: 'kill-requested-awaiting-confirmation',
    modeBefore,
  });

  await ctx.reply(
    'WARNING: Are you sure you want to activate the KILL SWITCH?\n\nThis will halt all system operations and set mode to KILL_SWITCH.\n\nThis action requires confirmation.',
    Markup.inlineKeyboard([
      Markup.button.callback('CONFIRM KILL_SWITCH', 'kill:confirm'),
      Markup.button.callback('Cancel', 'kill:cancel'),
    ]),
  );
}
