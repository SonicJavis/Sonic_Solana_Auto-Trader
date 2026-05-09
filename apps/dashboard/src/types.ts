/**
 * apps/dashboard/src/types.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Render + Capability Types
 *
 * Defines the typed output shapes produced by all dashboard UI shell components.
 * These are pure TypeScript types for a Node-compatible, deterministic,
 * fixture-backed, read-only rendering system.
 *
 * SAFETY: No live data. No Solana RPC. No provider APIs. No wallets.
 *         No execution. No external network. No mutation controls.
 */

// ─── Dashboard item ───────────────────────────────────────────────────────────

/** A single key-value item displayed in a dashboard panel or section. */
export interface DashboardItem {
  readonly key: string;
  readonly label: string;
  readonly value: string | boolean | number | null;
  readonly description?: string;
  readonly badge?: StatusBadgeResult;
}

// ─── Dashboard section ────────────────────────────────────────────────────────

/**
 * A logical section within a rendered component.
 * Maps to a semantic <section> or <region> landmark.
 */
export interface DashboardSection {
  readonly sectionId: string;
  readonly title: string;
  readonly role: string;
  readonly ariaLabel: string;
  readonly items: readonly DashboardItem[];
  readonly subSections?: readonly DashboardSection[];
}

// ─── Status badge ─────────────────────────────────────────────────────────────

/** Output of the StatusBadge component. */
export interface StatusBadgeResult {
  readonly componentType: 'StatusBadge';
  readonly status: string;
  readonly label: string;
  readonly ariaLabel: string;
}

// ─── Safety boundary flags ────────────────────────────────────────────────────

/** Immutable safety boundary flags present on every render result. */
export interface DashboardSafetyBoundary {
  readonly isReadOnly: true;
  readonly isLocalOnly: true;
  readonly isFixtureBacked: true;
  readonly hasLiveData: false;
  readonly hasTradingControls: false;
  readonly hasWalletControls: false;
  readonly hasMutationControls: false;
  readonly hasExternalNetwork: false;
  readonly hasExecutionControls: false;
}

// ─── Render result ────────────────────────────────────────────────────────────

/**
 * The typed output of every dashboard UI shell component.
 * Designed to be deterministic, testable, and accessible.
 */
export interface DashboardRenderResult {
  readonly componentType: string;
  readonly title: string;
  readonly ariaLabel: string;
  readonly role: string;
  readonly sections: readonly DashboardSection[];
  readonly hasHeading: boolean;
  readonly hasLandmark: boolean;
  readonly safetyBoundary: DashboardSafetyBoundary;
}

// ─── Safety banner ────────────────────────────────────────────────────────────

/** Output of the SafetyBanner component. */
export interface SafetyBannerResult {
  readonly componentType: 'SafetyBanner';
  readonly role: 'banner';
  readonly ariaLabel: string;
  readonly notices: readonly string[];
  readonly safetyBoundary: DashboardSafetyBoundary;
}

// ─── Shell navigation ─────────────────────────────────────────────────────────

/** A single navigation entry in the dashboard shell. */
export interface DashboardNavEntry {
  readonly id: string;
  readonly label: string;
  readonly ariaLabel: string;
  readonly isCurrent: boolean;
}

// ─── Full shell output ────────────────────────────────────────────────────────

/** The fully rendered dashboard shell output. */
export interface DashboardShellResult {
  readonly componentType: 'DashboardShell';
  readonly title: string;
  readonly role: 'main';
  readonly ariaLabel: string;
  readonly safetyBanner: SafetyBannerResult;
  readonly navigation: readonly DashboardNavEntry[];
  readonly panels: {
    readonly health: DashboardRenderResult;
    readonly capabilities: DashboardRenderResult;
    readonly overview: DashboardRenderResult;
    readonly evidence: DashboardRenderResult;
    readonly safety: DashboardRenderResult;
    readonly metadata: DashboardRenderResult;
  };
  readonly footer: DashboardRenderResult;
  readonly safetyBoundary: DashboardSafetyBoundary;
}

// ─── Phase 25/26/27 capabilities ─────────────────────────────────────────────

/** Phase 25/26/27/28/29/30 dashboard UI shell capabilities (all unsafe false). */
export interface DashboardUiShellCapabilities {
  readonly dashboardUiShell: true;
  readonly localReadOnlyDashboard: true;
  readonly fixtureBackedDashboardUi: true;
  readonly dashboardUsesViewModels: true;
  readonly dashboardInteractionState: true;
  readonly localDashboardFilters: true;
  readonly inMemoryDashboardState: true;
  readonly deterministicDashboardState: true;
  readonly dashboardPanelVisibility: true;
  readonly dashboardFilterSelectors: true;
  // Phase 27 snapshot capabilities
  readonly dashboardRenderSnapshots: true;
  readonly dashboardRegressionFixtures: true;
  readonly deterministicRenderSnapshots: true;
  readonly snapshotSafetyValidation: true;
  readonly fixtureBackedRenderSnapshots: true;
  readonly dashboardPersistentState: false;
  readonly dashboardExternalStateSync: false;
  readonly dashboardLiveFilters: false;
  readonly dashboardExternalNetwork: false;
  readonly dashboardLiveData: false;
  readonly dashboardTradingControls: false;
  readonly dashboardWalletControls: false;
  readonly dashboardMutationControls: false;
  readonly dashboardExecutionControls: false;
  readonly dashboardWalletConnection: false;
  readonly dashboardRealTimeUpdates: false;
  // Phase 27 snapshot unsafe flags (all false)
  readonly dashboardSnapshotPersistence: false;
  readonly dashboardSnapshotExternalNetwork: false;
  readonly dashboardSnapshotLiveData: false;
  readonly dashboardSnapshotMutationControls: false;
  // Phase 28 report model capabilities
  readonly dashboardReportModels: true;
  readonly dashboardReportFixtures: true;
  readonly deterministicReportModels: true;
  readonly reportSafetyValidation: true;
  readonly fixtureBackedReports: true;
  readonly dashboardReportFileExport: false;
  readonly dashboardReportPersistence: false;
  readonly dashboardReportExternalNetwork: false;
  readonly dashboardReportLiveData: false;
  readonly dashboardReportMutationControls: false;
  // Phase 29 serialization preview capabilities
  readonly dashboardReportSerializationPreview: true;
  readonly dashboardReportJsonPreview: true;
  readonly dashboardReportMarkdownPreview: true;
  readonly dashboardReportTextPreview: true;
  readonly dashboardReportMetadataPreview: true;
  readonly dashboardReportActualFileExport: false;
  readonly dashboardReportDownloadSupport: false;
  // Phase 30 creator intelligence fixture capabilities
  readonly creatorIntelligenceFixtures: true;
  readonly syntheticCreatorProfiles: true;
  readonly creatorNarrativeFixtures: true;
  readonly creatorRiskIndicators: true;
  readonly creatorCredibilityIndicators: true;
  readonly creatorFixtureSafetyValidation: true;
  readonly creatorLiveData: false;
  readonly creatorSocialApiAccess: false;
  readonly creatorScraping: false;
  readonly creatorIdentityResolution: false;
  readonly creatorInvestmentAdvice: false;
  readonly creatorTradingSignals: false;
  readonly creatorExternalNetwork: false;
  readonly creatorPersistence: false;
  // Phase 31 wallet cluster fixture capabilities
  readonly walletClusterIntelligenceFixtures: true;
  readonly syntheticWalletClusters: true;
  readonly walletClusterSignalFixtures: true;
  readonly walletClusterRiskIndicators: true;
  readonly walletClusterQualityIndicators: true;
  readonly walletClusterFixtureSafetyValidation: true;
  readonly walletClusterLiveData: false;
  readonly walletClusterChainAccess: false;
  readonly walletClusterRpcAccess: false;
  readonly walletClusterIdentityResolution: false;
  readonly walletClusterInvestmentAdvice: false;
  readonly walletClusterTradingSignals: false;
  readonly walletClusterExternalNetwork: false;
  readonly walletClusterPersistence: false;
  // Phase 32 manipulation evidence fixture capabilities
  readonly manipulationEvidenceFixtures: true;
  readonly syntheticBundleEvidence: true;
  readonly syntheticLaunchStructureEvidence: true;
  readonly syntheticLiquidityPatternEvidence: true;
  readonly syntheticCoordinationEvidence: true;
  readonly manipulationRiskIndicators: true;
  readonly manipulationQualityIndicators: true;
  readonly manipulationEvidenceSafetyValidation: true;
  readonly manipulationLiveData: false;
  readonly manipulationSolanaRpc: false;
  readonly manipulationProviderApis: false;
  readonly manipulationJitoIntegration: false;
  readonly manipulationMempoolAccess: false;
  readonly manipulationTradingSignals: false;
  readonly manipulationInvestmentAdvice: false;
  readonly manipulationExternalNetwork: false;
  readonly manipulationPersistence: false;
  readonly manipulationExecution: false;
  // Phase 33 composite evidence fixture capabilities
  readonly compositeEvidenceFixtures: true;
  readonly syntheticCompositeEvidence: true;
  readonly compositeCreatorEvidenceRefs: true;
  readonly compositeWalletClusterEvidenceRefs: true;
  readonly compositeManipulationEvidenceRefs: true;
  readonly compositeRiskIndicators: true;
  readonly compositeQualityIndicators: true;
  readonly compositeConfidenceIndicators: true;
  readonly compositeEvidenceWeighting: true;
  readonly compositeEvidenceSafetyValidation: true;
  readonly compositeLiveData: false;
  readonly compositeExternalNetwork: false;
  readonly compositeTradingSignals: false;
  readonly compositeInvestmentAdvice: false;
  readonly compositeExecution: false;
  readonly compositePersistence: false;
  // Phase 34 offline intelligence report integration capabilities
  readonly offlineIntelligenceReportModels: true;
  readonly offlineIntelligenceReportFixtures: true;
  readonly offlineIntelligenceCompositeReportIntegration: true;
  readonly offlineIntelligenceReportRiskSections: true;
  readonly offlineIntelligenceReportQualitySections: true;
  readonly offlineIntelligenceReportConfidenceSections: true;
  readonly offlineIntelligenceReportSourceReferences: true;
  readonly offlineIntelligenceReportSafetyValidation: true;
  readonly offlineIntelligenceReportLiveData: false;
  readonly offlineIntelligenceReportSolanaRpc: false;
  readonly offlineIntelligenceReportProviderApis: false;
  readonly offlineIntelligenceReportJitoIntegration: false;
  readonly offlineIntelligenceReportMempoolAccess: false;
  readonly offlineIntelligenceReportTradingSignals: false;
  readonly offlineIntelligenceReportInvestmentAdvice: false;
  readonly offlineIntelligenceReportExternalNetwork: false;
  readonly offlineIntelligenceReportPersistence: false;
  readonly offlineIntelligenceReportExecution: false;
  readonly offlineIntelligenceReportFileExport: false;
  readonly offlineIntelligenceReportDownloadSupport: false;
  // Phase 35 composite evidence dashboard/report fixture capabilities
  readonly compositeEvidenceDashboardFixtures: true;
  readonly compositeEvidenceReportFixtures: true;
  readonly compositeEvidenceDashboardReportFixtures: true;
  readonly compositeEvidenceFixtureBuilders: true;
  readonly compositeEvidenceFixtureSafetyValidation: true;
  readonly compositeEvidenceFixtureLiveData: false;
  readonly compositeEvidenceFixtureSolanaRpc: false;
  readonly compositeEvidenceFixtureExternalNetwork: false;
  readonly compositeEvidenceFixtureTradingSignals: false;
  readonly compositeEvidenceFixtureInvestmentAdvice: false;
  readonly compositeEvidenceFixtureExecution: false;
  readonly compositeEvidenceFixturePersistence: false;
  readonly compositeEvidenceFixtureFileExport: false;
  readonly compositeEvidenceFixtureDownloadSupport: false;
  // Phase 36 replay outcome fixture capabilities
  readonly replayOutcomeFixtures: true;
  readonly syntheticReplayOutcomes: true;
  readonly replayOutcomeBuilders: true;
  readonly replayOutcomeSafetyValidation: true;
  readonly replayOutcomeCompositeEvidenceReferences: true;
  readonly replayOutcomeReportReferences: true;
  readonly replayOutcomeDashboardReferences: true;
  readonly replayOutcomeLiveData: false;
  readonly replayOutcomeRealBacktesting: false;
  readonly replayOutcomePaperTrading: false;
  readonly replayOutcomeLiveTrading: false;
  readonly replayOutcomeExecution: false;
  readonly replayOutcomeSolanaRpc: false;
  readonly replayOutcomeExternalNetwork: false;
  readonly replayOutcomePersistence: false;
  readonly replayOutcomeFileExport: false;
  readonly replayOutcomeInvestmentAdvice: false;
  readonly replayOutcomeTradingSignals: false;
  // Phase 38 strategy candidate evaluation fixture capabilities
  readonly strategyCandidateEvaluationFixtures: true;
  readonly syntheticStrategyCandidates: true;
  readonly strategyCandidateBuilders: true;
  readonly strategyCandidateSafetyValidation: true;
  readonly strategyCandidateScoreBandReferences: true;
  readonly strategyCandidateRealScoring: false;
  readonly strategyCandidateRealRanking: false;
  readonly strategyCandidateRealBacktesting: false;
  readonly strategyCandidatePaperTrading: false;
  readonly strategyCandidateLiveTrading: false;
  readonly strategyCandidateExecution: false;
  readonly strategyCandidateSolanaRpc: false;
  readonly strategyCandidateExternalNetwork: false;
  readonly strategyCandidatePersistence: false;
  readonly strategyCandidateFileExport: false;
  readonly strategyCandidateInvestmentAdvice: false;
  readonly strategyCandidateTradingSignals: false;
  readonly strategyCandidateRecommendations: false;
  // Phase 39 strategy comparison matrix fixture capabilities
  readonly strategyComparisonMatrixFixtures: true;
  readonly syntheticStrategyComparisonMatrices: true;
  readonly strategyComparisonMatrixBuilders: true;
  readonly strategyComparisonMatrixSafetyValidation: true;
  readonly strategyComparisonCandidateReferences: true;
  readonly strategyComparisonRealScoring: false;
  readonly strategyComparisonRealRanking: false;
  readonly strategyComparisonRealBacktesting: false;
  readonly strategyComparisonPaperTrading: false;
  readonly strategyComparisonLiveTrading: false;
  readonly strategyComparisonExecution: false;
  readonly strategyComparisonSolanaRpc: false;
  readonly strategyComparisonExternalNetwork: false;
  readonly strategyComparisonPersistence: false;
  readonly strategyComparisonFileExport: false;
  readonly strategyComparisonInvestmentAdvice: false;
  readonly strategyComparisonTradingSignals: false;
  readonly strategyComparisonRecommendations: false;
  // Phase 40 strategy review dashboard fixture capabilities
  readonly strategyReviewDashboardFixtures: true;
  readonly syntheticStrategyReviewDashboards: true;
  readonly strategyReviewDashboardBuilders: true;
  readonly strategyReviewDashboardSafetyValidation: true;
  readonly strategyReviewMatrixReferences: true;
  readonly strategyReviewRealUiRendering: false;
  readonly strategyReviewRealScoring: false;
  readonly strategyReviewRealRanking: false;
  readonly strategyReviewRecommendations: false;
  readonly strategyReviewTradingSignals: false;
  readonly strategyReviewPaperTrading: false;
  readonly strategyReviewLiveTrading: false;
  readonly strategyReviewExecution: false;
  readonly strategyReviewSolanaRpc: false;
  readonly strategyReviewExternalNetwork: false;
  readonly strategyReviewPersistence: false;
  readonly strategyReviewFileExport: false;
  readonly strategyReviewInvestmentAdvice: false;
  // Phase 41 strategy review report fixture capabilities
  readonly strategyReviewReportFixtures: true;
  readonly syntheticStrategyReviewReports: true;
  readonly strategyReviewReportBuilders: true;
  readonly strategyReviewReportSafetyValidation: true;
  readonly strategyReviewDashboardReferences: true;
  readonly strategyReviewReportActualFileExport: false;
  readonly strategyReviewReportDownloadSupport: false;
  readonly strategyReviewReportRealUiRendering: false;
  readonly strategyReviewReportRealScoring: false;
  readonly strategyReviewReportRealRanking: false;
  readonly strategyReviewReportRecommendations: false;
  readonly strategyReviewReportTradingSignals: false;
  readonly strategyReviewReportPaperTrading: false;
  readonly strategyReviewReportLiveTrading: false;
  readonly strategyReviewReportExecution: false;
  readonly strategyReviewReportSolanaRpc: false;
  readonly strategyReviewReportExternalNetwork: false;
  readonly strategyReviewReportPersistence: false;
  readonly strategyReviewReportInvestmentAdvice: false;
  // Phase 42 strategy review serialization preview fixture capabilities
  readonly strategyReviewSerializationPreviewFixtures: true;
  readonly syntheticStrategyReviewSerializationPreviews: true;
  readonly strategyReviewSerializationPreviewBuilders: true;
  readonly strategyReviewSerializationSafetyValidation: true;
  readonly strategyReviewReportReferences: true;
  readonly strategyReviewJsonPreview: true;
  readonly strategyReviewMarkdownPreview: true;
  readonly strategyReviewTextPreview: true;
  readonly strategyReviewMetadataPreview: true;
  readonly strategyReviewActualFileExport: false;
  readonly strategyReviewDownloadSupport: false;
  readonly strategyReviewSerializationExternalNetwork: false;
  readonly strategyReviewSerializationPersistence: false;
  readonly strategyReviewSerializationExecution: false;
  readonly strategyReviewSerializationTradingSignals: false;
  readonly strategyReviewSerializationInvestmentAdvice: false;
  // Phase 43 strategy review export planning fixture capabilities
  readonly strategyReviewExportPlanningFixtures: true;
  readonly syntheticStrategyReviewExportPlans: true;
  readonly strategyReviewExportPlanBuilders: true;
  readonly strategyReviewExportPlanSafetyValidation: true;
  readonly strategyReviewSerializationPreviewReferences: true;
  readonly strategyReviewFilesystemWrites: false;
  readonly strategyReviewPdfGeneration: false;
  readonly strategyReviewCsvGeneration: false;
  readonly strategyReviewHtmlGeneration: false;
  readonly strategyReviewExportExternalNetwork: false;
  readonly strategyReviewExportPersistence: false;
  readonly strategyReviewExportExecution: false;
  readonly strategyReviewExportTradingSignals: false;
  readonly strategyReviewExportInvestmentAdvice: false;
}
