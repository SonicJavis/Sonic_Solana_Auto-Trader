/**
 * Phase 58 — Launch Risk Engine v1: capabilities.
 *
 * Deterministic capability flags for the launch risk engine.
 * Non-advisory, synthetic, local-only.
 */

import type { LaunchRiskEngineCapabilities } from './types.js';

export function getLaunchRiskEngineCapabilities(): LaunchRiskEngineCapabilities {
  return {
    launchRiskEngine: true,
    launchRiskEngineFixtures: true,
    deterministicLaunchRiskEngine: true,
    localOnlyLaunchRiskEngine: true,
    readOnlyLaunchRiskEngine: true,
    fixtureDerivedLaunchRiskEngine: true,
    ruleBasedLaunchRiskEngine: true,
    launchRiskFactorOutputs: true,
    launchRiskAssessments: true,
    launchRiskThresholds: true,
    launchRiskViewModels: true,
    launchRiskApiContracts: true,
    launchRiskSelectors: true,
    launchRiskLiveData: false,
    launchRiskNetworkAccess: false,
    launchRiskRealProviders: false,
    launchRiskProviderAdapters: false,
    launchRiskSolanaRpc: false,
    launchRiskWebSocketAccess: false,
    launchRiskGeyserYellowstone: false,
    launchRiskPumpFunIntegration: false,
    launchRiskDexIntegration: false,
    launchRiskJitoIntegration: false,
    launchRiskPersistence: false,
    launchRiskFilesystemWrites: false,
    launchRiskDownloads: false,
    launchRiskRouteHandlers: false,
    launchRiskHttpServer: false,
    launchRiskRuntimeRequests: false,
    launchRiskUiRendering: false,
    launchRiskDomAccess: false,
    launchRiskBackgroundJobs: false,
    launchRiskScheduledJobs: false,
    launchRiskWalletLogic: false,
    launchRiskPrivateKeyHandling: false,
    launchRiskSigning: false,
    launchRiskTransactionSending: false,
    launchRiskExecution: false,
    launchRiskTradingSignals: false,
    launchRiskRecommendations: false,
    launchRiskInvestmentAdvice: false,
    launchRiskPaperSimulation: false,
    launchRiskLiveExecution: false,
    launchRiskStrategySelection: false,
  };
}
