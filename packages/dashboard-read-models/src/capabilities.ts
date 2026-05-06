/**
 * packages/dashboard-read-models/src/capabilities.ts
 *
 * Phase 18 — Dashboard Read Model capabilities guard.
 *
 * All unsafe capability flags are permanently false.
 * fixtureOnly, analysisOnly, nonExecutable, readOnly are permanently true.
 * canRenderUi is permanently false.
 */

import type { DashboardReadModelCapabilities } from './types.js';

export function getDashboardReadModelCapabilities(): DashboardReadModelCapabilities {
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
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  };
}
