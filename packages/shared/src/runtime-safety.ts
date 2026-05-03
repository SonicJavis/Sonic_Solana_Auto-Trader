import type { AppMode } from './modes.js';

export interface RuntimeSafetyStatus {
  readonly currentPhase: number;
  readonly currentMode: AppMode;
  readonly readOnlyDefault: boolean;
  // Always false in Phase 3
  readonly liveTradingEnabled: boolean;
  readonly autoTradingEnabled: boolean;
  readonly transactionSigningEnabled: boolean;
  readonly transactionSendingEnabled: boolean;
  readonly walletLoadingEnabled: boolean;
  readonly solanaRpcEnabled: boolean;
  readonly jitoEnabled: boolean;
  readonly pumpfunTradingEnabled: boolean;
  // Always true in Phase 3
  readonly fullAutoLocked: boolean;
  readonly limitedLiveLocked: boolean;
  // State
  readonly killSwitchAvailable: boolean;
  readonly killSwitchActive: boolean;
  readonly adminAllowlistConfigured: boolean;
  readonly telegramEnabled: boolean;
  readonly databaseConfigured: boolean;
  readonly configValid: boolean;
  readonly unsafeFlagsDetected: boolean;
  readonly unsafeFlags: readonly string[];
  readonly warnings: readonly string[];
  readonly timestamp: string;
}

export interface BuildRuntimeSafetyStatusOpts {
  readonly currentPhase: number;
  readonly currentMode: AppMode;
  readonly configValid: boolean;
  readonly unsafeFlagsDetected: boolean;
  readonly unsafeFlags: readonly string[];
  readonly warnings: readonly string[];
  readonly killSwitchActive: boolean;
  readonly adminAllowlistConfigured: boolean;
  readonly telegramEnabled: boolean;
  readonly databaseConfigured: boolean;
}

export function buildRuntimeSafetyStatus(
  opts: BuildRuntimeSafetyStatusOpts,
): RuntimeSafetyStatus {
  return {
    currentPhase: opts.currentPhase,
    currentMode: opts.currentMode,
    readOnlyDefault: true,
    // Phase 3: always false regardless of any env flags
    liveTradingEnabled: false,
    autoTradingEnabled: false,
    transactionSigningEnabled: false,
    transactionSendingEnabled: false,
    walletLoadingEnabled: false,
    solanaRpcEnabled: false,
    jitoEnabled: false,
    pumpfunTradingEnabled: false,
    // Phase 3: always locked
    fullAutoLocked: true,
    limitedLiveLocked: true,
    killSwitchAvailable: true,
    killSwitchActive: opts.killSwitchActive,
    adminAllowlistConfigured: opts.adminAllowlistConfigured,
    telegramEnabled: opts.telegramEnabled,
    databaseConfigured: opts.databaseConfigured,
    configValid: opts.configValid,
    unsafeFlagsDetected: opts.unsafeFlagsDetected,
    unsafeFlags: opts.unsafeFlags,
    warnings: opts.warnings,
    timestamp: new Date().toISOString(),
  };
}

export function getDefaultRuntimeSafetyStatus(): RuntimeSafetyStatus {
  return buildRuntimeSafetyStatus({
    currentPhase: 3,
    currentMode: 'READ_ONLY',
    configValid: false,
    unsafeFlagsDetected: false,
    unsafeFlags: [],
    warnings: ['Using default safety status - config not loaded'],
    killSwitchActive: false,
    adminAllowlistConfigured: false,
    telegramEnabled: false,
    databaseConfigured: false,
  });
}

export function formatRuntimeSafetyWarnings(status: RuntimeSafetyStatus): string[] {
  const warnings: string[] = [...status.warnings];
  if (status.unsafeFlagsDetected) {
    warnings.push(`Unsafe flags detected: ${status.unsafeFlags.join(', ')} — capabilities remain disabled`);
  }
  if (!status.configValid) {
    warnings.push('Config validation failed — safe defaults applied');
  }
  if (!status.adminAllowlistConfigured) {
    warnings.push('No admin IDs configured — all control commands locked');
  }
  return warnings;
}
