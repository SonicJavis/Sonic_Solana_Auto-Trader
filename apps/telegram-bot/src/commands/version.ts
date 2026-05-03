import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { IAuditRepository } from '@sonic/db';
import { getTelegramUserInfo } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatVersion } from '../formatters/version.js';

export async function handleVersion(ctx: Context, config: AppConfig, auditLogger: IAuditRepository): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  await auditTelegramCommand(auditLogger, { info, command: '/version', accepted: true });
  await ctx.reply(formatVersion(config.NODE_ENV));
}
