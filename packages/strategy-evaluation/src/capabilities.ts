/**
 * packages/strategy-evaluation/src/capabilities.ts
 *
 * Phase 16 — Strategy Evaluation capabilities guard.
 *
 * All unsafe capability flags are permanently false.
 * fixtureOnly, analysisOnly, nonExecutable are permanently true.
 */

import type { StrategyEvaluationCapabilities } from './types.js';

export function getStrategyEvaluationCapabilities(): StrategyEvaluationCapabilities {
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
    canCreateOrders: false,
    canCreatePositions: false,
    canCalculateLivePnl: false,
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
  };
}
