/**
 * packages/strategy-intent/src/capabilities.ts
 *
 * Phase 15 — Strategy Intent capabilities guard.
 *
 * All unsafe capability flags are permanently false.
 * This package is fixture-only, analysis-only, and non-executable.
 */

import type { StrategyIntentCapabilities } from './types.js';

/**
 * Returns the permanently-safe StrategyIntent capabilities object.
 *
 * All unsafe flags are false.
 * fixtureOnly, analysisOnly, and nonExecutable are true.
 *
 * This function cannot be used to enable live data, trading, execution,
 * wallet access, provider access, or any other unsafe capability.
 */
export function getStrategyIntentCapabilities(): StrategyIntentCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canAccessPrivateKeys: false,
    canCreateTradeIntents: false,
    canCreateExecutionPlans: false,
    canPaperTrade: false,
    canTrade: false,
    canExecute: false,
    canWriteToDatabase: false,
    canSendTelegramAlerts: false,
    canConstructTransactions: false,
    canSimulateTransactions: false,
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
  };
}
