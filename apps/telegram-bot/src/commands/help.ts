import type { Context } from 'telegraf';
import type { IAuditRepository } from '@sonic/db';
import { getTelegramUserInfo } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatHelp } from '../formatters/help.js';

export async function handleHelp(ctx: Context, auditLogger: IAuditRepository): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  await auditTelegramCommand(auditLogger, { info, command: '/help', accepted: true });
  await ctx.reply(formatHelp());
}
