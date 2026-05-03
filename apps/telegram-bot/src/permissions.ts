import type { AppConfig } from '@sonic/config';
import type { Context } from 'telegraf';

export interface TelegramUserInfo {
  userId: number;
  username?: string | undefined;
  chatId: number;
}

export function getTelegramUserInfo(ctx: Context): TelegramUserInfo {
  return {
    userId: ctx.from?.id ?? 0,
    username: ctx.from?.username,
    chatId: ctx.chat?.id ?? 0,
  };
}

export function isAdmin(userId: number, adminIds: string[]): boolean {
  if (adminIds.length === 0) return false; // IMPORTANT: empty means NO admins, not all admins
  return adminIds.includes(String(userId));
}

export function hasConfiguredAdmins(config: AppConfig): boolean {
  return config.TELEGRAM_ADMIN_IDS.length > 0;
}

export async function requireAdmin(
  ctx: Context,
  config: AppConfig,
  action: string,
  auditFn: (info: TelegramUserInfo, action: string, accepted: boolean, reason: string) => Promise<void>,
): Promise<boolean> {
  const info = getTelegramUserInfo(ctx);
  if (!hasConfiguredAdmins(config)) {
    await auditFn(info, action, false, 'no-admin-configured');
    await ctx.reply('Control commands are locked: no admin IDs are configured.');
    return false;
  }
  if (!isAdmin(info.userId, config.TELEGRAM_ADMIN_IDS)) {
    await auditFn(info, action, false, 'not-admin');
    await ctx.reply('Unauthorized: Only configured admins can use this command.');
    return false;
  }
  return true;
}
