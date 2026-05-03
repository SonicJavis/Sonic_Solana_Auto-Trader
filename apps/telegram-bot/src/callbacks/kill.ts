import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditRepository } from '@sonic/db';
import { getTelegramUserInfo, isAdmin, hasConfiguredAdmins } from '../permissions.js';
import { auditTelegramCallback } from '../audit.js';

export async function handleKillCallback(
  ctx: Context,
  data: string,
  config: AppConfig,
  modeManager: ModeManager,
  auditLogger: IAuditRepository,
): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const modeBefore = modeManager.getMode();

  if (!hasConfiguredAdmins(config) || !isAdmin(info.userId, config.TELEGRAM_ADMIN_IDS)) {
    await auditTelegramCallback(auditLogger, {
      info,
      callbackId: data,
      accepted: false,
      reason: 'not-admin-callback',
      modeBefore,
    });
    await ctx.answerCbQuery('Unauthorized: Only admins can confirm kill switch.');
    return;
  }

  if (data === 'kill:confirm') {
    const result = await modeManager.setMode('KILL_SWITCH', 'telegram:/kill:confirmed', `Kill switch confirmed via Telegram by user ${info.userId}`);
    const modeAfter = modeManager.getMode();
    await auditTelegramCallback(auditLogger, {
      info,
      callbackId: data,
      accepted: result.accepted,
      reason: result.accepted ? 'kill-switch-activated' : (result.error ?? 'unknown'),
      modeBefore,
      modeAfter,
    });
    if (result.accepted) {
      await ctx.answerCbQuery('KILL SWITCH activated.');
      await ctx.editMessageText('KILL SWITCH ACTIVATED. All operations halted. Mode: KILL_SWITCH');
    } else {
      await ctx.answerCbQuery('Failed to activate kill switch.');
      await ctx.editMessageText(`Failed to activate kill switch: ${result.error ?? 'unknown error'}`);
    }
  } else if (data === 'kill:cancel') {
    await auditTelegramCallback(auditLogger, {
      info,
      callbackId: data,
      accepted: true,
      reason: 'kill-switch-cancelled',
      modeBefore,
      modeAfter: modeBefore,
    });
    await ctx.answerCbQuery('Kill switch cancelled.');
    await ctx.editMessageText('Kill switch cancelled. Mode unchanged.');
  } else {
    await auditTelegramCallback(auditLogger, {
      info,
      callbackId: data,
      accepted: false,
      reason: `invalid-callback-payload:${data}`,
      modeBefore,
    });
    await ctx.answerCbQuery('Invalid callback.');
  }
}
