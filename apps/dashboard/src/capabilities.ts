/**
 * apps/dashboard/src/capabilities.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Capabilities
 *
 * Phase 25/26/27/28/29/30/31/32/33/34/35 dashboard capability flags.
 * All unsafe flags are permanently false.
 * Phase 25 adds the local read-only dashboard UI shell.
 * Phase 26 adds local dashboard interaction state and filters.
 * Phase 27 adds deterministic render snapshots and regression fixtures.
 * Phase 28 adds deterministic local dashboard report export models.
 * Phase 29 adds dashboard report serialization previews.
 * Phase 30 adds creator intelligence fixture capabilities.
 * Phase 31 adds wallet cluster intelligence fixture capabilities.
 * Phase 32 adds manipulation evidence fixture capabilities.
 * Phase 33 adds composite evidence fixture capabilities.
 * Phase 34 adds offline intelligence report integration capabilities.
 * Phase 35 adds composite evidence dashboard/report fixture capabilities.
 */

import type { DashboardUiShellCapabilities } from './types.js';

/**
 * Returns the Phase 25/26/27/28/29/30 dashboard capabilities.
 *
 * All unsafe capabilities (live data, trading controls, wallet controls,
 * mutation controls, execution controls, external network, real-time updates,
 * wallet connection, persistence, snapshot persistence, snapshot live data,
 * snapshot external network, snapshot mutation controls, report file export,
 * report persistence, report live data, report external network, and
 * report mutation controls, creator live data, creator social API access,
 * creator scraping, creator identity resolution, creator investment advice,
 * creator trading signals, creator external network, and creator persistence)
 * are permanently false.
 *
 * The UI shell is:
 * - Local only
 * - Read only
 * - Fixture backed
 * - Deterministic
 * - Non-mutating
 * - External-network-free
 */
export function getDashboardUiShellCapabilities(): DashboardUiShellCapabilities {
  return {
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
    // Phase 27 snapshot capabilities
    dashboardRenderSnapshots: true,
    dashboardRegressionFixtures: true,
    deterministicRenderSnapshots: true,
    snapshotSafetyValidation: true,
    fixtureBackedRenderSnapshots: true,
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
    // Phase 27 snapshot unsafe flags (all false)
    dashboardSnapshotPersistence: false,
    dashboardSnapshotExternalNetwork: false,
    dashboardSnapshotLiveData: false,
    dashboardSnapshotMutationControls: false,
    // Phase 28 report capabilities
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
    // Phase 29 serialization preview capabilities
    dashboardReportSerializationPreview: true,
    dashboardReportJsonPreview: true,
    dashboardReportMarkdownPreview: true,
    dashboardReportTextPreview: true,
    dashboardReportMetadataPreview: true,
    dashboardReportActualFileExport: false,
    dashboardReportDownloadSupport: false,
    // Phase 30 creator intelligence fixture capabilities
    creatorIntelligenceFixtures: true,
    syntheticCreatorProfiles: true,
    creatorNarrativeFixtures: true,
    creatorRiskIndicators: true,
    creatorCredibilityIndicators: true,
    creatorFixtureSafetyValidation: true,
    creatorLiveData: false,
    creatorSocialApiAccess: false,
    creatorScraping: false,
    creatorIdentityResolution: false,
    creatorInvestmentAdvice: false,
    creatorTradingSignals: false,
    creatorExternalNetwork: false,
    creatorPersistence: false,
    // Phase 31 wallet cluster fixture capabilities
    walletClusterIntelligenceFixtures: true,
    syntheticWalletClusters: true,
    walletClusterSignalFixtures: true,
    walletClusterRiskIndicators: true,
    walletClusterQualityIndicators: true,
    walletClusterFixtureSafetyValidation: true,
    walletClusterLiveData: false,
    walletClusterChainAccess: false,
    walletClusterRpcAccess: false,
    walletClusterIdentityResolution: false,
    walletClusterInvestmentAdvice: false,
    walletClusterTradingSignals: false,
    walletClusterExternalNetwork: false,
    walletClusterPersistence: false,
    // Phase 32 manipulation evidence fixture capabilities
    manipulationEvidenceFixtures: true,
    syntheticBundleEvidence: true,
    syntheticLaunchStructureEvidence: true,
    syntheticLiquidityPatternEvidence: true,
    syntheticCoordinationEvidence: true,
    manipulationRiskIndicators: true,
    manipulationQualityIndicators: true,
    manipulationEvidenceSafetyValidation: true,
    manipulationLiveData: false,
    manipulationSolanaRpc: false,
    manipulationProviderApis: false,
    manipulationJitoIntegration: false,
    manipulationMempoolAccess: false,
    manipulationTradingSignals: false,
    manipulationInvestmentAdvice: false,
    manipulationExternalNetwork: false,
    manipulationPersistence: false,
    manipulationExecution: false,
    // Phase 33 composite evidence fixture capabilities
    compositeEvidenceFixtures: true,
    syntheticCompositeEvidence: true,
    compositeCreatorEvidenceRefs: true,
    compositeWalletClusterEvidenceRefs: true,
    compositeManipulationEvidenceRefs: true,
    compositeRiskIndicators: true,
    compositeQualityIndicators: true,
    compositeConfidenceIndicators: true,
    compositeEvidenceWeighting: true,
    compositeEvidenceSafetyValidation: true,
    compositeLiveData: false,
    compositeExternalNetwork: false,
    compositeTradingSignals: false,
    compositeInvestmentAdvice: false,
    compositeExecution: false,
    compositePersistence: false,
    // Phase 34 offline intelligence report integration capabilities
    offlineIntelligenceReportModels: true,
    offlineIntelligenceReportFixtures: true,
    offlineIntelligenceCompositeReportIntegration: true,
    offlineIntelligenceReportRiskSections: true,
    offlineIntelligenceReportQualitySections: true,
    offlineIntelligenceReportConfidenceSections: true,
    offlineIntelligenceReportSourceReferences: true,
    offlineIntelligenceReportSafetyValidation: true,
    offlineIntelligenceReportLiveData: false,
    offlineIntelligenceReportSolanaRpc: false,
    offlineIntelligenceReportProviderApis: false,
    offlineIntelligenceReportJitoIntegration: false,
    offlineIntelligenceReportMempoolAccess: false,
    offlineIntelligenceReportTradingSignals: false,
    offlineIntelligenceReportInvestmentAdvice: false,
    offlineIntelligenceReportExternalNetwork: false,
    offlineIntelligenceReportPersistence: false,
    offlineIntelligenceReportExecution: false,
    offlineIntelligenceReportFileExport: false,
    offlineIntelligenceReportDownloadSupport: false,
    // Phase 35 composite evidence dashboard/report fixture capabilities
    compositeEvidenceDashboardFixtures: true,
    compositeEvidenceReportFixtures: true,
    compositeEvidenceDashboardReportFixtures: true,
    compositeEvidenceFixtureBuilders: true,
    compositeEvidenceFixtureSafetyValidation: true,
    compositeEvidenceFixtureLiveData: false,
    compositeEvidenceFixtureSolanaRpc: false,
    compositeEvidenceFixtureExternalNetwork: false,
    compositeEvidenceFixtureTradingSignals: false,
    compositeEvidenceFixtureInvestmentAdvice: false,
    compositeEvidenceFixtureExecution: false,
    compositeEvidenceFixturePersistence: false,
    compositeEvidenceFixtureFileExport: false,
    compositeEvidenceFixtureDownloadSupport: false,
    // Phase 36 replay outcome fixture capabilities
    replayOutcomeFixtures: true,
    syntheticReplayOutcomes: true,
    replayOutcomeBuilders: true,
    replayOutcomeSafetyValidation: true,
    replayOutcomeCompositeEvidenceReferences: true,
    replayOutcomeReportReferences: true,
    replayOutcomeDashboardReferences: true,
    replayOutcomeLiveData: false,
    replayOutcomeRealBacktesting: false,
    replayOutcomePaperTrading: false,
    replayOutcomeLiveTrading: false,
    replayOutcomeExecution: false,
    replayOutcomeSolanaRpc: false,
    replayOutcomeExternalNetwork: false,
    replayOutcomePersistence: false,
    replayOutcomeFileExport: false,
    replayOutcomeInvestmentAdvice: false,
    replayOutcomeTradingSignals: false,
    // Phase 38 strategy candidate evaluation fixture capabilities
    strategyCandidateEvaluationFixtures: true,
    syntheticStrategyCandidates: true,
    strategyCandidateBuilders: true,
    strategyCandidateSafetyValidation: true,
    strategyCandidateScoreBandReferences: true,
    strategyCandidateRealScoring: false,
    strategyCandidateRealRanking: false,
    strategyCandidateRealBacktesting: false,
    strategyCandidatePaperTrading: false,
    strategyCandidateLiveTrading: false,
    strategyCandidateExecution: false,
    strategyCandidateSolanaRpc: false,
    strategyCandidateExternalNetwork: false,
    strategyCandidatePersistence: false,
    strategyCandidateFileExport: false,
    strategyCandidateInvestmentAdvice: false,
    strategyCandidateTradingSignals: false,
    strategyCandidateRecommendations: false,
    // Phase 39 strategy comparison matrix fixture capabilities
    strategyComparisonMatrixFixtures: true,
    syntheticStrategyComparisonMatrices: true,
    strategyComparisonMatrixBuilders: true,
    strategyComparisonMatrixSafetyValidation: true,
    strategyComparisonCandidateReferences: true,
    strategyComparisonRealScoring: false,
    strategyComparisonRealRanking: false,
    strategyComparisonRealBacktesting: false,
    strategyComparisonPaperTrading: false,
    strategyComparisonLiveTrading: false,
    strategyComparisonExecution: false,
    strategyComparisonSolanaRpc: false,
    strategyComparisonExternalNetwork: false,
    strategyComparisonPersistence: false,
    strategyComparisonFileExport: false,
    strategyComparisonInvestmentAdvice: false,
    strategyComparisonTradingSignals: false,
    strategyComparisonRecommendations: false,
    // Phase 40 strategy review dashboard fixture capabilities
    strategyReviewDashboardFixtures: true,
    syntheticStrategyReviewDashboards: true,
    strategyReviewDashboardBuilders: true,
    strategyReviewDashboardSafetyValidation: true,
    strategyReviewMatrixReferences: true,
    strategyReviewRealUiRendering: false,
    strategyReviewRealScoring: false,
    strategyReviewRealRanking: false,
    strategyReviewRecommendations: false,
    strategyReviewTradingSignals: false,
    strategyReviewPaperTrading: false,
    strategyReviewLiveTrading: false,
    strategyReviewExecution: false,
    strategyReviewSolanaRpc: false,
    strategyReviewExternalNetwork: false,
    strategyReviewPersistence: false,
    strategyReviewFileExport: false,
    strategyReviewInvestmentAdvice: false,
  };
}
