/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: capabilities.
 */

import type { ReadOnlyProviderContractCapabilities } from './types.js';

export function getReadOnlyProviderContractCapabilities(): ReadOnlyProviderContractCapabilities {
  return {
    readOnlyProviderContracts: true,
    syntheticReadOnlyProviderContracts: true,
    deterministicReadOnlyProviderContracts: true,
    localOnlyReadOnlyProviderContracts: true,
    fixtureDerivedReadOnlyProviderContracts: true,
    readOnlyProviderContractViewModels: true,
    readOnlyProviderApiContracts: true,
    readOnlyProviderSelectors: true,
    readOnlyProviderAdapterGate: true,
    readOnlyProviderLiveData: false,
    readOnlyProviderNetworkAccess: false,
    readOnlyProviderAdapters: false,
    readOnlyProviderSolanaRpc: false,
    readOnlyProviderWebSockets: false,
    readOnlyProviderGeyserYellowstone: false,
    readOnlyProviderPumpFunIntegration: false,
    readOnlyProviderDexIntegration: false,
    readOnlyProviderJitoIntegration: false,
    readOnlyProviderPersistence: false,
    readOnlyProviderFilesystemWrites: false,
    readOnlyProviderDownloads: false,
    readOnlyProviderRouteHandlers: false,
    readOnlyProviderHttpServer: false,
    readOnlyProviderRuntimeRequests: false,
    readOnlyProviderUiRendering: false,
    readOnlyProviderDomAccess: false,
    readOnlyProviderBackgroundJobs: false,
    readOnlyProviderScheduledJobs: false,
    readOnlyProviderWalletLogic: false,
    readOnlyProviderPrivateKeyHandling: false,
    readOnlyProviderSigning: false,
    readOnlyProviderTransactionSending: false,
    readOnlyProviderExecution: false,
    readOnlyProviderTradingSignals: false,
    readOnlyProviderRecommendations: false,
    readOnlyProviderInvestmentAdvice: false,
  };
}
