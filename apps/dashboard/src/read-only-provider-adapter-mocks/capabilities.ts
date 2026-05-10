/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: capabilities.
 */

import type { ReadOnlyProviderAdapterMockCapabilities } from './types.js';

export function getReadOnlyProviderAdapterMockCapabilities(): ReadOnlyProviderAdapterMockCapabilities {
  return {
    readOnlyProviderAdapterMocks: true,
    syntheticReadOnlyProviderAdapterMocks: true,
    deterministicReadOnlyProviderAdapterMocks: true,
    localOnlyReadOnlyProviderAdapterMocks: true,
    fixtureDerivedReadOnlyProviderAdapterMocks: true,
    pureReadOnlyProviderAdapterMocks: true,
    readOnlyProviderAdapterMockViewModels: true,
    readOnlyProviderAdapterMockApiContracts: true,
    readOnlyProviderAdapterMockSelectors: true,
    readOnlyProviderAdapterMockLiveData: false,
    readOnlyProviderAdapterMockNetworkAccess: false,
    readOnlyProviderAdapterMockRealAdapters: false,
    readOnlyProviderAdapterMockSolanaRpc: false,
    readOnlyProviderAdapterMockWebSocketAccess: false,
    readOnlyProviderAdapterMockGeyserYellowstone: false,
    readOnlyProviderAdapterMockPumpFunIntegration: false,
    readOnlyProviderAdapterMockDexIntegration: false,
    readOnlyProviderAdapterMockJitoIntegration: false,
    readOnlyProviderAdapterMockPersistence: false,
    readOnlyProviderAdapterMockFilesystemWrites: false,
    readOnlyProviderAdapterMockDownloads: false,
    readOnlyProviderAdapterMockRouteHandlers: false,
    readOnlyProviderAdapterMockHttpServer: false,
    readOnlyProviderAdapterMockRuntimeRequests: false,
    readOnlyProviderAdapterMockUiRendering: false,
    readOnlyProviderAdapterMockDomAccess: false,
    readOnlyProviderAdapterMockBackgroundJobs: false,
    readOnlyProviderAdapterMockScheduledJobs: false,
    readOnlyProviderAdapterMockWalletLogic: false,
    readOnlyProviderAdapterMockPrivateKeyHandling: false,
    readOnlyProviderAdapterMockSigning: false,
    readOnlyProviderAdapterMockTransactionSending: false,
    readOnlyProviderAdapterMockExecution: false,
    readOnlyProviderAdapterMockTradingSignals: false,
    readOnlyProviderAdapterMockRecommendations: false,
    readOnlyProviderAdapterMockInvestmentAdvice: false,
  };
}
