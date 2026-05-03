import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditLogger } from '@sonic/db';
import { getTelegramUserInfo, hasConfiguredAdmins } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatStatus } from '../formatters/status.js';

const startTime = Date.now();

export async function handleStatus(ctx: Context, config: AppConfig, modeManager: ModeManager, auditLogger: IAuditLogger): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const mode = modeManager.getMode();
  await auditTelegramCommand(auditLogger, { info, command: '/status', accepted: true, modeBefore: mode });
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const text = formatStatus({
    mode,
    uptimeSeconds,
    telegramEnabled: !!config.TELEGRAM_BOT_TOKEN,
    adminConfigured: hasConfiguredAdmins(config),
    killSwitchActive: modeManager.isKillSwitchActive(),
  });
  await ctx.reply(text);
}
