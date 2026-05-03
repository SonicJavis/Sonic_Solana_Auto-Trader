import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditLogger } from '@sonic/db';
import { getTelegramUserInfo, hasConfiguredAdmins } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatSafety } from '../formatters/safety.js';

export async function handleSafety(ctx: Context, config: AppConfig, modeManager: ModeManager, auditLogger: IAuditLogger): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const mode = modeManager.getMode();
  await auditTelegramCommand(auditLogger, { info, command: '/safety', accepted: true, modeBefore: mode });
  const text = formatSafety({
    mode,
    adminConfigured: hasConfiguredAdmins(config),
    killSwitchActive: modeManager.isKillSwitchActive(),
  });
  await ctx.reply(text);
}
