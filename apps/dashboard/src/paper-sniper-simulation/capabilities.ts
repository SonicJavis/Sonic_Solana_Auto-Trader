/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: capabilities.
 */

import type { PaperSniperSimulationCapabilities } from './types.js';

export function getPaperSniperSimulationCapabilities(): PaperSniperSimulationCapabilities {
  return {
    paperSniperSimulationFoundation: true,
    paperSniperSimulationFixtures: true,
    deterministicPaperSniperSimulation: true,
    localOnlyPaperSniperSimulation: true,
    readOnlyPaperSniperSimulation: true,
    fixtureDerivedPaperSniperSimulation: true,
    paperSniperMarketModel: true,
    paperSniperLatencyModel: true,
    paperSniperSlippageModel: true,
    paperSniperFailureModel: true,
    paperSniperSimulator: true,
    paperSniperOutcomes: true,
    paperSniperViewModels: true,
    paperSniperApiContracts: true,
    paperSniperSelectors: true,
    paperSniperLiveData: false,
    paperSniperNetworkAccess: false,
    paperSniperRealProviders: false,
    paperSniperProviderAdapters: false,
    paperSniperSolanaRpc: false,
    paperSniperWebSocketAccess: false,
    paperSniperGeyserYellowstone: false,
    paperSniperPumpFunIntegration: false,
    paperSniperDexIntegration: false,
    paperSniperJitoIntegration: false,
    paperSniperPersistence: false,
    paperSniperFilesystemWrites: false,
    paperSniperDownloads: false,
    paperSniperRouteHandlers: false,
    paperSniperHttpServer: false,
    paperSniperRuntimeRequests: false,
    paperSniperUiRendering: false,
    paperSniperDomAccess: false,
    paperSniperBackgroundJobs: false,
    paperSniperScheduledJobs: false,
    paperSniperWalletLogic: false,
    paperSniperPrivateKeyHandling: false,
    paperSniperSigning: false,
    paperSniperTransactionSending: false,
    paperSniperExecution: false,
    paperSniperTradingSignals: false,
    paperSniperRecommendations: false,
    paperSniperInvestmentAdvice: false,
    paperSniperLiveExecution: false,
  };
}
