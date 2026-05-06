/**
 * packages/evidence-ledger/src/capabilities.ts
 *
 * Phase 17 — Evidence Ledger capabilities guard.
 *
 * All unsafe capability flags are permanently false.
 * fixtureOnly, analysisOnly, nonExecutable, appendOnly are permanently true.
 * canMutatePriorEvidence is permanently false.
 */

import type { EvidenceLedgerCapabilities } from './types.js';

export function getEvidenceLedgerCapabilities(): EvidenceLedgerCapabilities {
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
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };
}
