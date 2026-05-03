import type { Logger } from './logger.js';
import type { AppMode } from '@sonic/shared';

export function logAppStart(logger: Logger, version: string, mode: AppMode): void {
  logger.info({ version, mode, phase: 1 }, 'Sonic Auto-Trader starting');
}

export function logModeLoaded(logger: Logger, mode: AppMode): void {
  logger.info({ mode }, 'Mode loaded');
}

export function logConfigValidated(logger: Logger, valid: boolean): void {
  logger.info({ valid }, 'Config validation complete');
}

export function logTelegramStatus(logger: Logger, enabled: boolean): void {
  if (enabled) {
    logger.info('Telegram bot enabled');
  } else {
    logger.warn('Telegram bot disabled - no token configured');
  }
}

export function logWorkerHeartbeat(logger: Logger, uptimeSeconds: number, mode: AppMode): void {
  logger.info({ uptimeSeconds, mode, tradingEnabled: false, executionEnabled: false }, 'Worker heartbeat');
}
