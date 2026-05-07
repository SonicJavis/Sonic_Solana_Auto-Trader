/**
 * apps/read-only-api/src/capabilities.ts
 *
 * Phase 22 — LocalReadOnlyApiCapabilities guard (extends Phase 21).
 *
 * All unsafe capability flags are permanently false.
 * canStartLocalhostServer is true only for explicit 127.0.0.1 binding.
 * Phase 21 adds canFilterFixtureData, canPaginateFixtureData, canSortFixtureData.
 * Phase 22 adds canServeResponseEnvelopes, canReturnErrorEnvelopes,
 *   canValidateQueryErrors, canProvideDeterministicMetadata, canProvideEndpointContracts.
 * No external bind, no live data, no execution of any kind.
 */

import type { LocalReadOnlyApiCapabilities } from './types.js';

/**
 * Returns the permanently-safe LocalReadOnlyApiCapabilities.
 *
 * Unsafe flags: all permanently false.
 * canStartLocalhostServer: true — valid only for 127.0.0.1 binding.
 * Phase 21 query/filter/pagination fields: true.
 * Phase 22 response contract fields: true.
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
    // Phase 22 — response contract capabilities
    canServeResponseEnvelopes: true,
    canReturnErrorEnvelopes: true,
    canValidateQueryErrors: true,
    canProvideDeterministicMetadata: true,
    canProvideEndpointContracts: true,
    // Phase 23 — local consumer SDK capabilities
    consumerSdk: true,
    contractFixtures: true,
    typedRequestBuilders: true,
    responseParsers: true,
    fixtureValidation: true,
    inProcessOnlyClient: true,
    externalNetworkClient: false,
    // Phase 24 — local dashboard data adapter / view-model layer
    dashboardDataAdapter: true,
    dashboardViewModels: true,
    fixtureBackedViewModels: true,
    uiReadyDataShapes: true,
    pureViewModelTransforms: true,
    dashboardUi: false,
    externalDashboardData: false,
    // Phase 25 — local read-only dashboard UI shell
    dashboardUiShell: true,
    localReadOnlyDashboard: true,
    fixtureBackedDashboardUi: true,
    dashboardUsesViewModels: true,
    dashboardInteractionState: true,
    localDashboardFilters: true,
    inMemoryDashboardState: true,
    deterministicDashboardState: true,
    dashboardPanelVisibility: true,
    dashboardFilterSelectors: true,
    dashboardPersistentState: false,
    dashboardExternalStateSync: false,
    dashboardLiveFilters: false,
    dashboardExternalNetwork: false,
    dashboardLiveData: false,
    dashboardTradingControls: false,
    dashboardWalletControls: false,
    dashboardMutationControls: false,
    dashboardExecutionControls: false,
    dashboardWalletConnection: false,
    dashboardRealTimeUpdates: false,
    // Phase 28 — local dashboard report export models
    dashboardReportModels: true,
    dashboardReportFixtures: true,
    deterministicReportModels: true,
    reportSafetyValidation: true,
    fixtureBackedReports: true,
    dashboardReportFileExport: false,
    dashboardReportPersistence: false,
    dashboardReportExternalNetwork: false,
    dashboardReportLiveData: false,
    dashboardReportMutationControls: false,
    // Safety labels
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    localOnly: true,
  };
}
