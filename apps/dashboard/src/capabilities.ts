/**
 * apps/dashboard/src/capabilities.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Capabilities
 *
 * Phase 25/26/27/28/29 dashboard capability flags.
 * All unsafe flags are permanently false.
 * Phase 25 adds the local read-only dashboard UI shell.
 * Phase 26 adds local dashboard interaction state and filters.
 * Phase 27 adds deterministic render snapshots and regression fixtures.
 * Phase 28 adds deterministic local dashboard report export models.
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
  };
}
