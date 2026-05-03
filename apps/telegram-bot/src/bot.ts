import { Telegraf } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditRepository } from '@sonic/db';
import type { Logger } from '@sonic/observability';
import { handleStart } from './commands/start.js';
import { handleHelp } from './commands/help.js';
import { handleStatus } from './commands/status.js';
import { handleMode } from './commands/mode.js';
import { handlePause } from './commands/pause.js';
import { handleKill } from './commands/kill.js';
import { handleAudit } from './commands/audit.js';
import { handleSafety } from './commands/safety.js';
import { handleVersion } from './commands/version.js';
import { handleKillCallback } from './callbacks/kill.js';
import { getTelegramUserInfo } from './permissions.js';
import { auditTelegramCallback } from './audit.js';

export function createBot(
  config: AppConfig,
  modeManager: ModeManager,
  auditLogger: IAuditRepository,
  logger: Logger,
): Telegraf {
  const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN!);

  bot.command('start', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'start' }, 'Command received');
    try {
      await handleStart(ctx, config, modeManager, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /start');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('help', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'help' }, 'Command received');
    try {
      await handleHelp(ctx, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /help');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('status', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'status' }, 'Command received');
    try {
      await handleStatus(ctx, config, modeManager, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /status');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('mode', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'mode' }, 'Command received');
    try {
      await handleMode(ctx, config, modeManager, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /mode');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('pause', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'pause' }, 'Command received');
    try {
      await handlePause(ctx, config, modeManager, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /pause');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('kill', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'kill' }, 'Command received');
    try {
      await handleKill(ctx, config, modeManager, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /kill');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('audit', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'audit' }, 'Command received');
    try {
      await handleAudit(ctx, config, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /audit');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('safety', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'safety' }, 'Command received');
    try {
      await handleSafety(ctx, config, modeManager, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /safety');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.command('version', async (ctx) => {
    logger.info({ userId: ctx.from?.id, command: 'version' }, 'Command received');
    try {
      await handleVersion(ctx, config, auditLogger);
    } catch (err) {
      logger.error({ err }, 'Error handling /version');
      await ctx.reply('An error occurred. Please try again.');
    }
  });

  bot.on('callback_query', async (ctx) => {
    const callbackQuery = ctx.callbackQuery;
    const data = 'data' in callbackQuery ? callbackQuery.data : '';
    logger.info({ userId: ctx.from?.id, callbackData: data }, 'Callback query received');
    try {
      if (data.startsWith('kill:')) {
        await handleKillCallback(ctx, data, config, modeManager, auditLogger);
      } else {
        const info = getTelegramUserInfo(ctx);
        await auditTelegramCallback(auditLogger, {
          info,
          callbackId: data,
          accepted: false,
          reason: 'unknown-callback',
          modeBefore: modeManager.getMode(),
        });
        await ctx.answerCbQuery('Unknown action.');
      }
    } catch (err) {
      logger.error({ err }, 'Error handling callback query');
      try { await ctx.answerCbQuery('An error occurred.'); } catch { /* ignore */ }
    }
  });

  return bot;
}
