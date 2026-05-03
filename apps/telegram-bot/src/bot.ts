import { Telegraf } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { Logger } from '@sonic/observability';
import { APP_VERSION } from '@sonic/shared';

const startTime = Date.now();

function isAdmin(userId: number, adminIds: string[]): boolean {
  if (adminIds.length === 0) return true;
  return adminIds.includes(String(userId));
}

export function createBot(
  config: AppConfig,
  modeManager: ModeManager,
  logger: Logger,
): Telegraf {
  const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN!);

  bot.command('start', (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'start' }, 'Command received');
    void ctx.reply(
      `🤖 Sonic Solana Auto-Trader\nPhase 1 - Safe Foundation\n\nStatus: READ_ONLY mode\n⚠️ No trading enabled.\n\nUse /help for commands.`,
    );
  });

  bot.command('help', (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'help' }, 'Command received');
    void ctx.reply(
      `/start - Introduction\n/help - This message\n/status - System status\n/mode - Current mode\n/pause - Pause system\n/kill - Kill switch`,
    );
  });

  bot.command('status', (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'status' }, 'Command received');
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const mode = modeManager.getMode();
    void ctx.reply(
      `📊 System Status\n` +
        `Version: ${APP_VERSION}\n` +
        `Mode: ${mode}\n` +
        `Uptime: ${uptimeSeconds}s\n` +
        `Telegram: enabled\n` +
        `Execution: disabled\n` +
        `Live trading: disabled\n` +
        `Phase: 1 (Safe Foundation)`,
    );
  });

  bot.command('mode', (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'mode' }, 'Command received');
    void ctx.reply(`Current mode: ${modeManager.getMode()}`);
  });

  bot.command('pause', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'pause' }, 'Command received');
    if (!isAdmin(ctx.from?.id ?? 0, config.TELEGRAM_ADMIN_IDS)) {
      void ctx.reply('Unauthorized: Only admins can change mode.');
      return;
    }
    const result = await modeManager.setMode('PAUSED', `telegram:${ctx.from?.id}`, 'User requested pause');
    if (result.success) {
      void ctx.reply('⏸ System paused.');
    } else {
      void ctx.reply(`Failed to pause: ${result.error}`);
    }
  });

  bot.command('kill', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'kill' }, 'Command received');
    if (!isAdmin(ctx.from?.id ?? 0, config.TELEGRAM_ADMIN_IDS)) {
      void ctx.reply('Unauthorized: Only admins can activate kill switch.');
      return;
    }
    const result = await modeManager.setMode('KILL_SWITCH', `telegram:${ctx.from?.id}`, 'Kill switch activated');
    if (result.success) {
      void ctx.reply('🛑 KILL SWITCH activated. All operations halted.');
    } else {
      void ctx.reply(`Failed: ${result.error}`);
    }
  });

  return bot;
}
