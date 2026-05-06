/**
 * apps/read-only-api/src/capabilities.ts
 *
 * Phase 21 — LocalReadOnlyApiCapabilities guard (extends Phase 20).
 *
 * All unsafe capability flags are permanently false.
 * canStartLocalhostServer is true only for explicit 127.0.0.1 binding.
 * Phase 21 adds canFilterFixtureData, canPaginateFixtureData, canSortFixtureData.
 * No external bind, no live data, no execution of any kind.
 */

import type { LocalReadOnlyApiCapabilities } from './types.js';

/**
 * Returns the permanently-safe LocalReadOnlyApiCapabilities.
 *
 * Unsafe flags: all permanently false.
 * canStartLocalhostServer: true — valid only for 127.0.0.1 binding.
 * Phase 21 query/filter/pagination fields: true.
 * All safe labels (fixtureOnly, analysisOnly, etc.): permanently true.
 */
export function getLocalReadOnlyApiCapabilities(): LocalReadOnlyApiCapabilities {
  return {
    // Unsafe — permanently false
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
    canUseExternalNetwork: false,
    // Allowed — localhost server only
    canStartLocalhostServer: true,
    canServeReadOnlyContracts: true,
    canServeFixtureReadModels: true,
    // Phase 21 — query/filter/pagination (fixture-only, in-memory only)
    canFilterFixtureData: true,
    canPaginateFixtureData: true,
    canSortFixtureData: true,
    // Safety labels
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    localOnly: true,
  };
}
