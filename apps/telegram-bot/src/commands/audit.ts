import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { IAuditLogger } from '@sonic/db';
import { getTelegramUserInfo, requireAdmin } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatAuditLog } from '../formatters/audit.js';

export async function handleAudit(ctx: Context, config: AppConfig, auditLogger: IAuditLogger): Promise<void> {
  const info = getTelegramUserInfo(ctx);

  const allowed = await requireAdmin(ctx, config, '/audit', async (uInfo, action, accepted, reason) => {
    await auditTelegramCommand(auditLogger, { info: uInfo, command: action, accepted, reason });
  });
  if (!allowed) return;

  await auditTelegramCommand(auditLogger, { info, command: '/audit', accepted: true });
  const records = await auditLogger.getRecent(10);
  await ctx.reply(formatAuditLog(records));
}
