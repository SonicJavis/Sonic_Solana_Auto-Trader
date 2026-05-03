import { loadConfig } from '@sonic/config';
import { createLogger, logAppStart, logTelegramStatus } from '@sonic/observability';
import { InMemoryAuditLogger } from '@sonic/db';
import { ModeManager } from '@sonic/mode-manager';
import { APP_VERSION } from '@sonic/shared';
import { createBot } from './bot.js';

const config = loadConfig();
const logger = createLogger({ level: config.LOG_LEVEL, name: 'telegram-bot' });
const auditLogger = new InMemoryAuditLogger();
const modeManager = new ModeManager(auditLogger, config.APP_MODE);

logAppStart(logger, APP_VERSION, config.APP_MODE);
logTelegramStatus(logger, !!config.TELEGRAM_BOT_TOKEN);

if (!config.TELEGRAM_BOT_TOKEN) {
  logger.warn('No TELEGRAM_BOT_TOKEN configured. Running in degraded mode (bot disabled).');
  logger.info('Telegram bot shell initialized in degraded mode. Exiting cleanly.');
  process.exit(0);
}

const bot = createBot(config, modeManager, logger);
bot.launch();
logger.info('Telegram bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
