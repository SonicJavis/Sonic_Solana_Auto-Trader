import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditLogger } from '@sonic/db';
import { getTelegramUserInfo, requireAdmin } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';

export async function handlePause(ctx: Context, config: AppConfig, modeManager: ModeManager, auditLogger: IAuditLogger): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const modeBefore = modeManager.getMode();

  const allowed = await requireAdmin(ctx, config, '/pause', async (uInfo, action, accepted, reason) => {
    await auditTelegramCommand(auditLogger, { info: uInfo, command: action, accepted, reason, modeBefore });
  });
  if (!allowed) return;

  const result = await modeManager.setMode('PAUSED', 'telegram:/pause', `Pause requested via Telegram by user ${info.userId}`);
  const modeAfter = modeManager.getMode();

  if (result.success) {
    await auditTelegramCommand(auditLogger, {
      info,
      command: '/pause',
      accepted: true,
      reason: 'paused',
      modeBefore,
      modeAfter,
    });
    await ctx.reply('System paused. Mode is now PAUSED.');
  } else {
    await auditTelegramCommand(auditLogger, {
      info,
      command: '/pause',
      accepted: false,
      reason: result.error,
      modeBefore,
    });
    await ctx.reply(`Failed to pause: ${result.error ?? 'unknown error'}`);
  }
}
