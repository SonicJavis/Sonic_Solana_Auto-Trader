/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: types.
 */

export const SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE = 53 as const;

export const PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT =
  '2026-01-09T00:00:00.000Z' as const;

export const PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE =
  'phase53_synthetic_launch_intelligence_foundation_v1' as const;

export const PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_VERSION = '1.0.0' as const;

export const SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES = [
  'clean-launch-baseline',
  'low-liquidity-launch',
  'concentrated-holder-launch',
  'suspicious-creator-history-launch',
  'possible-bundle-cluster-launch',
  'metadata-incomplete-launch',
  'high-velocity-early-volume-launch',
  'safety-rejected-launch',
] as const;

export const SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS = [
  'clean_launch',
  'low_liquidity',
  'holder_concentration',
  'creator_history_risk',
  'wallet_cluster_pattern',
  'metadata_incomplete',
  'early_volume_velocity',
  'safety_rejected',
] as const;

export type SyntheticLaunchIntelligenceScenarioName =
  (typeof SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES)[number];

export type SyntheticLaunchIntelligenceScenarioKind =
  (typeof SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS)[number];

export type SyntheticLaunchEventKind =
  | 'launch_detected'
  | 'pool_created'
  | 'initial_liquidity_added'
  | 'early_volume_burst'
  | 'creator_activity_observed'
  | 'holder_distribution_snapshot_captured'
  | 'suspicious_bundle_pattern_observed'
  | 'risk_review_completed';

export type SyntheticRiskCategory =
  | 'metadata_integrity'
  | 'liquidity_quality'
  | 'holder_concentration'
  | 'creator_history'
  | 'wallet_cluster_pattern'
  | 'early_volume_velocity'
  | 'safety_boundary';

export type SyntheticRiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SyntheticLaunchIntelligenceCapabilities {
  readonly syntheticLaunchIntelligence: true;
  readonly syntheticLaunchIntelligenceFixtures: true;
  readonly deterministicSyntheticLaunchIntelligence: true;
  readonly localOnlySyntheticLaunchIntelligence: true;
  readonly readOnlySyntheticLaunchIntelligence: true;
  readonly fixtureDerivedSyntheticLaunchIntelligence: true;
  readonly syntheticLaunchViewModels: true;
  readonly syntheticLaunchApiContracts: true;
  readonly syntheticLaunchSelectors: true;
  readonly syntheticLaunchLiveData: false;
  readonly syntheticLaunchNetworkAccess: false;
  readonly syntheticLaunchProviderAdapters: false;
  readonly syntheticLaunchSolanaRpc: false;
  readonly syntheticLaunchPumpFunIntegration: false;
  readonly syntheticLaunchDexIntegration: false;
  readonly syntheticLaunchJitoIntegration: false;
  readonly syntheticLaunchPersistence: false;
  readonly syntheticLaunchFilesystemWrites: false;
  readonly syntheticLaunchDownloads: false;
  readonly syntheticLaunchRouteHandlers: false;
  readonly syntheticLaunchHttpServer: false;
  readonly syntheticLaunchRuntimeRequests: false;
  readonly syntheticLaunchUiRendering: false;
  readonly syntheticLaunchDomAccess: false;
  readonly syntheticLaunchBackgroundJobs: false;
  readonly syntheticLaunchScheduledJobs: false;
  readonly syntheticLaunchWalletLogic: false;
  readonly syntheticLaunchPrivateKeyHandling: false;
  readonly syntheticLaunchSigning: false;
  readonly syntheticLaunchTransactionSending: false;
  readonly syntheticLaunchExecution: false;
  readonly syntheticLaunchTradingSignals: false;
  readonly syntheticLaunchRecommendations: false;
  readonly syntheticLaunchInvestmentAdvice: false;
}

export interface SyntheticTokenProfile {
  readonly tokenMintPlaceholderId: string;
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
  readonly syntheticSupply: number;
  readonly launchTimestamp: string;
  readonly metadataCompletenessScore: number;
  readonly hasName: boolean;
  readonly hasSymbol: boolean;
  readonly hasDescription: boolean;
  readonly hasImage: boolean;
  readonly hasSocialLinks: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticLaunchEvent {
  readonly eventId: string;
  readonly eventKind: SyntheticLaunchEventKind;
  readonly eventOrder: number;
  readonly syntheticTimestamp: string;
  readonly summary: string;
  readonly source: 'synthetic_fixture_only';
  readonly confidenceLabel: 'low' | 'medium' | 'high';
  readonly safetyNotes: readonly string[];
}

export interface SyntheticPoolLiquiditySnapshot {
  readonly snapshotId: string;
  readonly poolFixtureId: string;
  readonly syntheticTimestamp: string;
  readonly syntheticLiquidityUsd: number;
  readonly syntheticLiquidityChangeUsd: number;
  readonly liquidityConcentrationLabel: 'balanced' | 'moderate' | 'concentrated';
  readonly eventKind: 'initial_liquidity' | 'liquidity_change';
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticCreatorProfile {
  readonly creatorFixtureId: string;
  readonly launchHistoryCount: number;
  readonly reputationLabels: readonly string[];
  readonly riskFlags: readonly string[];
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticHolderDistributionSnapshot {
  readonly snapshotId: string;
  readonly syntheticTimestamp: string;
  readonly holderCount: number;
  readonly topHolderConcentrationPct: number;
  readonly hhiScore: number;
  readonly giniApprox: number;
  readonly clusterFlags: readonly string[];
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticWalletClusterIndicator {
  readonly clusterId: string;
  readonly leaderPattern: string;
  readonly followerPattern: string;
  readonly timingWindowSeconds: number;
  readonly concentrationLabel: 'low' | 'medium' | 'high';
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticLaunchRiskFactorSummary {
  readonly riskFactorId: string;
  readonly category: SyntheticRiskCategory;
  readonly severity: SyntheticRiskSeverity;
  readonly label: string;
  readonly description: string;
  readonly evidenceReferenceIds: readonly string[];
  readonly isRejectionReason: boolean;
  readonly nonAdvisory: true;
  readonly safetyNotes: readonly string[];
}

export interface SyntheticLaunchRiskReview {
  readonly reviewId: string;
  readonly reviewStatus: 'approved_for_fixture_display' | 'rejected_for_fixture_display';
  readonly rejectionReasons: readonly string[];
  readonly safetyNotes: readonly string[];
  readonly nonAdvisory: true;
  readonly notActionable: true;
}

export interface SyntheticLaunchIntelligenceViewModel {
  readonly viewModelId: string;
  readonly displayTitle: string;
  readonly displaySubtitle: string;
  readonly scenarioLabel: string;
  readonly scenarioKind: SyntheticLaunchIntelligenceScenarioKind;
  readonly launchEventCount: number;
  readonly liquidityLabel: string;
  readonly holderRiskLabel: string;
  readonly creatorRiskLabel: string;
  readonly clusterRiskLabel: string;
  readonly overallRiskSeverity: SyntheticRiskSeverity;
  readonly nonAdvisorySummary: string;
}

export type SyntheticLaunchApiContractKind = 'list' | 'detail' | 'summary' | 'error';

export interface SyntheticLaunchApiContractBase {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: SyntheticLaunchApiContractKind;
  readonly statusCode: 200 | 400 | 404;
  readonly generatedAt: typeof PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT;
  readonly source: typeof PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

export interface SyntheticLaunchApiListContract extends SyntheticLaunchApiContractBase {
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface SyntheticLaunchApiDetailContract extends SyntheticLaunchApiContractBase {
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly data: SyntheticLaunchIntelligenceViewModel;
}

export interface SyntheticLaunchApiSummaryContract extends SyntheticLaunchApiContractBase {
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly data: {
    readonly fixtureId: string;
    readonly scenarioKind: SyntheticLaunchIntelligenceScenarioKind;
    readonly overallRiskSeverity: SyntheticRiskSeverity;
    readonly rejection: boolean;
  };
}

export interface SyntheticLaunchApiErrorContract extends SyntheticLaunchApiContractBase {
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly errorCode: 'SYNTHETIC_LAUNCH_INVALID_REQUEST' | 'SYNTHETIC_LAUNCH_NOT_FOUND';
  readonly message: string;
}

export interface SyntheticLaunchIntelligenceApiContracts {
  readonly list: SyntheticLaunchApiListContract;
  readonly detail: SyntheticLaunchApiDetailContract;
  readonly summary: SyntheticLaunchApiSummaryContract;
  readonly errors: readonly [SyntheticLaunchApiErrorContract, SyntheticLaunchApiErrorContract];
}

export interface SyntheticLaunchIntelligenceSelectorQuery {
  readonly fixtureId?: string;
  readonly scenarioKind?: SyntheticLaunchIntelligenceScenarioKind;
  readonly minimumRiskSeverity?: SyntheticRiskSeverity;
}

export interface SyntheticLaunchIntelligenceSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedScenarioKind: SyntheticLaunchIntelligenceScenarioKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticLaunchIntelligenceMeta {
  readonly generatedAt: typeof PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT;
  readonly source: typeof PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE;
  readonly version: typeof PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_VERSION;
  readonly deterministicSeed: string;
  readonly fixtureOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly liveData: false;
  readonly networkAccess: false;
  readonly persistence: false;
  readonly execution: false;
}

export interface SyntheticLaunchIntelligenceSafety {
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly nonExecutable: true;
  readonly nonAdvisory: true;
  readonly notActionable: true;
}

export interface SyntheticLaunchIntelligenceFixture {
  readonly fixtureId: string;
  readonly fixtureName: SyntheticLaunchIntelligenceScenarioName;
  readonly fixtureKind: SyntheticLaunchIntelligenceScenarioKind;
  readonly phase: typeof SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE;
  readonly scenarioLabel: string;
  readonly generatedAt: typeof PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT;
  readonly deterministicSeed: string;
  readonly tokenProfile: SyntheticTokenProfile;
  readonly launchEvents: readonly SyntheticLaunchEvent[];
  readonly poolLiquiditySnapshots: readonly SyntheticPoolLiquiditySnapshot[];
  readonly creatorProfile: SyntheticCreatorProfile;
  readonly holderDistributionSnapshots: readonly SyntheticHolderDistributionSnapshot[];
  readonly walletClusterIndicators: readonly SyntheticWalletClusterIndicator[];
  readonly riskFactorSummaries: readonly SyntheticLaunchRiskFactorSummary[];
  readonly riskReview: SyntheticLaunchRiskReview;
  readonly viewModel: SyntheticLaunchIntelligenceViewModel;
  readonly apiContracts: SyntheticLaunchIntelligenceApiContracts;
  readonly selectorExamples: readonly SyntheticLaunchIntelligenceSelectorResult[];
  readonly capabilityFlags: SyntheticLaunchIntelligenceCapabilities;
  readonly meta: SyntheticLaunchIntelligenceMeta;
  readonly safety: SyntheticLaunchIntelligenceSafety;
}

export interface BuildSyntheticLaunchIntelligenceFixtureInput {
  readonly fixtureName: SyntheticLaunchIntelligenceScenarioName;
}

export interface SyntheticLaunchIntelligenceValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface SyntheticLaunchIntelligenceValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SyntheticLaunchIntelligenceValidationIssue[];
}

export interface SyntheticLaunchIntelligenceSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
