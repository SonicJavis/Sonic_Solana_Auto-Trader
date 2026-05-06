/**
 * packages/read-only-api-contracts/src/capabilities.ts
 *
 * Phase 19 — Read-Only API Contract capabilities guard.
 *
 * All unsafe capability flags are permanently false.
 * fixtureOnly, analysisOnly, nonExecutable, readOnly, contractOnly are permanently true.
 * canStartHttpServer, canOpenNetworkPort, canUseApiFramework are permanently false.
 */

import type { ReadOnlyApiCapabilities } from './types.js';

export function getReadOnlyApiCapabilities(): ReadOnlyApiCapabilities {
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
    canMutatePriorEvidence: false,
    canRenderUi: false,
    canStartHttpServer: false,
    canOpenNetworkPort: false,
    canUseApiFramework: false,
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  };
}
