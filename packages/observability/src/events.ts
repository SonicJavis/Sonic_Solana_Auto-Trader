import type { Logger } from './logger.js';
import type { AppMode } from '@sonic/shared';
import type { RuntimeSafetyStatus } from '@sonic/shared';

export function logAppStart(logger: Logger, version: string, mode: AppMode): void {
  logger.info({ version, mode, phase: 3 }, 'Sonic Auto-Trader starting');
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
  logger.info(
    { uptimeSeconds, mode, tradingEnabled: false, executionEnabled: false },
    'Worker heartbeat',
  );
}

export function logUnsafeFlagsDetected(logger: Logger, flags: string[]): void {
  logger.warn(
    { unsafeFlags: flags, allCapabilitiesDisabled: true },
    'Unsafe flags detected — all unsafe capabilities remain disabled in Phase 3',
  );
}

export function logSafetyStatus(logger: Logger, status: RuntimeSafetyStatus): void {
  logger.info(
    {
      phase: status.currentPhase,
      mode: status.currentMode,
      liveTradingEnabled: status.liveTradingEnabled,
      autoTradingEnabled: status.autoTradingEnabled,
      transactionSigningEnabled: status.transactionSigningEnabled,
      transactionSendingEnabled: status.transactionSendingEnabled,
      walletLoadingEnabled: status.walletLoadingEnabled,
      solanaRpcEnabled: status.solanaRpcEnabled,
      jitoEnabled: status.jitoEnabled,
      pumpfunTradingEnabled: status.pumpfunTradingEnabled,
      fullAutoLocked: status.fullAutoLocked,
      limitedLiveLocked: status.limitedLiveLocked,
      killSwitchActive: status.killSwitchActive,
      unsafeFlagsDetected: status.unsafeFlagsDetected,
      configValid: status.configValid,
    },
    'Worker safety status',
  );
}

export function logWorkerSafetyCheckPassed(logger: Logger): void {
  logger.info('Worker safety check passed');
}

export function logWorkerSafetyCheckFailed(logger: Logger, reason: string): void {
  logger.error({ reason }, 'Worker safety check failed — worker will not start');
}
