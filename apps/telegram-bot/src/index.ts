import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { loadConfig } from '@sonic/config';
import { createLogger, logAppStart, logTelegramStatus } from '@sonic/observability';
import {
  SqliteAuditRepository,
  openDatabase,
  initSchema,
} from '@sonic/db';
import { ModeManager } from '@sonic/mode-manager';
import { APP_VERSION } from '@sonic/shared';
import { createBot } from './bot.js';

const config = loadConfig();
const logger = createLogger({ level: config.LOG_LEVEL, name: 'telegram-bot' });

// Initialize SQLite audit repository (fail-closed on error)
let auditRepo: SqliteAuditRepository;
try {
  const dbDir = dirname(config.DATABASE_PATH);
  if (dbDir && dbDir !== '.') {
    mkdirSync(dbDir, { recursive: true });
  }
  const { client, sqlite } = openDatabase(config.DATABASE_PATH);
  initSchema(sqlite);
  auditRepo = new SqliteAuditRepository(client);
  auditRepo.record({
    eventType: 'DATABASE_INITIALIZED',
    severity: 'info',
    source: 'telegram-bot',
    message: 'SQLite audit database initialized',
  });
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  logger.error({ error: message }, 'Database initialization failed — telegram-bot cannot start (fail-closed)');
  process.exit(1);
}

const modeManager = new ModeManager(auditRepo, config.APP_MODE);

logAppStart(logger, APP_VERSION, config.APP_MODE);
logTelegramStatus(logger, !!config.TELEGRAM_BOT_TOKEN);

if (!config.TELEGRAM_BOT_TOKEN) {
  logger.warn('No TELEGRAM_BOT_TOKEN configured. Running in degraded mode (bot disabled).');
  logger.info('Telegram bot shell initialized in degraded mode. Exiting cleanly.');
  process.exit(0);
}

const bot = createBot(config, modeManager, auditRepo, logger);
bot.launch();
logger.info('Telegram bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
