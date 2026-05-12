import type {
  PaperExecutionQualityBand,
  PaperExecutionQualityMetricName,
} from '../paper-execution-quality-metrics/types.js';
import type { PaperSniperSimulationName } from '../paper-sniper-simulation/types.js';
import type { RiskExplanationEvidenceName } from '../risk-explanation-evidence/types.js';
import type { LaunchRiskBand, LaunchRiskEngineAssessmentName } from '../launch-risk-engine/types.js';
import type { SyntheticEventStreamReplayHarnessScenarioName } from '../synthetic-event-stream-replay-harness/types.js';
import type { SyntheticEventStreamLifecycleStreamName } from '../synthetic-event-stream-lifecycle/types.js';

export const SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE = 62 as const;
export const PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT =
  '2026-05-12T00:00:00.000Z' as const;
export const PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE =
  'phase62_synthetic_strategy_comparison_lab_v1' as const;
export const PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_VERSION = '1.0.0' as const;
export const PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION = '1.0.0' as const;

export const SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES = [
  'clean-launch-synthetic-strategy-comparison-lab',
  'thin-liquidity-synthetic-strategy-comparison-lab',
  'concentrated-holders-synthetic-strategy-comparison-lab',
  'suspicious-creator-synthetic-strategy-comparison-lab',
  'possible-bundle-cluster-synthetic-strategy-comparison-lab',
  'metadata-incomplete-synthetic-strategy-comparison-lab',
  'high-early-volume-synthetic-strategy-comparison-lab',
  'safety-rejected-synthetic-strategy-comparison-lab',
] as const;

export const SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS = [
  'clean_launch_synthetic_strategy_comparison_lab',
  'thin_liquidity_synthetic_strategy_comparison_lab',
  'concentrated_holders_synthetic_strategy_comparison_lab',
  'suspicious_creator_synthetic_strategy_comparison_lab',
  'possible_bundle_cluster_synthetic_strategy_comparison_lab',
  'metadata_incomplete_synthetic_strategy_comparison_lab',
  'high_early_volume_synthetic_strategy_comparison_lab',
  'safety_rejected_synthetic_strategy_comparison_lab',
] as const;

export type SyntheticStrategyComparisonLabName =
  (typeof SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES)[number];
export type SyntheticStrategyComparisonLabKind =
  (typeof SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS)[number];

export const SYNTHETIC_STRATEGY_VARIANT_IDS = [
  'conservative_safety_first',
  'liquidity_sensitive',
  'latency_sensitive',
  'evidence_weighted',
] as const;
export type SyntheticStrategyVariantId = (typeof SYNTHETIC_STRATEGY_VARIANT_IDS)[number];

export const SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS = [
  'sensitive_to_thin_liquidity',
  'sensitive_to_latency_bucket',
  'sensitive_to_rejection_reason',
  'sensitive_to_risk_band',
  'sensitive_to_evidence_confidence',
  'overfit_warning_small_fixture_set',
  'overfit_warning_single_scenario_dependency',
  'comparison_not_live_predictive',
] as const;
export type SyntheticStrategySensitivityWarningKind =
  (typeof SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS)[number];

export const SYNTHETIC_STRATEGY_COMPARISON_QUALITY_BANDS = [
  'relative_strong',
  'relative_moderate',
  'relative_limited',
  'relative_rejected',
] as const;
export type SyntheticStrategyComparisonQualityBand =
  (typeof SYNTHETIC_STRATEGY_COMPARISON_QUALITY_BANDS)[number];

export interface SyntheticStrategyComparisonLabIdentity {
  readonly labId: string;
  readonly labName: SyntheticStrategyComparisonLabName;
  readonly labKind: SyntheticStrategyComparisonLabKind;
  readonly sourceMetricFixtureName: PaperExecutionQualityMetricName;
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly sourceEvidenceFixtureName: RiskExplanationEvidenceName;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly schemaVersion: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
}

export interface SyntheticStrategyVariant {
  readonly variantId: SyntheticStrategyVariantId;
  readonly variantKind: 'synthetic_hypothetical_variant';
  readonly variantName: string;
  readonly description: string;
  readonly syntheticOnly: true;
  readonly hypotheticalOnly: true;
  readonly executable: false;
  readonly emitsSignals: false;
  readonly advisory: false;
  readonly selectionPolicy: null;
}

export interface SyntheticStrategyScenarioSharedInputs {
  readonly sourceRiskBand: LaunchRiskBand;
  readonly sourceQualityBand: PaperExecutionQualityBand;
  readonly latencyQualityLabel: string;
  readonly fillStatus: string;
  readonly slippageBucket: string;
  readonly rejectionTaxonomyKind: string;
}

export interface SyntheticStrategyScenarioCase {
  readonly scenarioId: string;
  readonly scenarioKind: SyntheticStrategyComparisonLabKind;
  readonly sourceMetricFixtureName: PaperExecutionQualityMetricName;
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly sourceEvidenceFixtureName: RiskExplanationEvidenceName;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly sharedInputs: SyntheticStrategyScenarioSharedInputs;
  readonly variantInputSnapshots: Readonly<Record<SyntheticStrategyVariantId, SyntheticStrategyScenarioSharedInputs>>;
}

export interface SyntheticStrategyScenarioMatrix {
  readonly matrixId: string;
  readonly matrixName: string;
  readonly matrixKind: 'synthetic_strategy_scenario_matrix';
  readonly scenarioCases: readonly SyntheticStrategyScenarioCase[];
}

export interface SyntheticStrategyScoreComponents {
  readonly latencyComponent: number;
  readonly fillComponent: number;
  readonly slippageComponent: number;
  readonly rejectionComponent: number;
  readonly evidenceComponent: number;
}

export interface SyntheticStrategyComparisonScorecard {
  readonly scorecardId: string;
  readonly variantId: SyntheticStrategyVariantId;
  readonly scenarioId: string;
  readonly sourceMetricFixtureName: PaperExecutionQualityMetricName;
  readonly scoreComponents: SyntheticStrategyScoreComponents;
  readonly aggregateFixtureScore: number;
  readonly riskAdjustment: number;
  readonly safetyAdjustment: number;
  readonly relativeRank: number;
  readonly qualityBand: SyntheticStrategyComparisonQualityBand;
  readonly sensitivityWarnings: readonly SyntheticStrategySensitivityWarningKind[];
  readonly limitationNotes: readonly string[];
  readonly nonAdvisorySummary: string;
  readonly safetySummary: string;
  readonly validationSummary: string;
  readonly meta: {
    readonly generatedAt: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
    readonly source: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE;
  };
}

export interface SyntheticStrategyComparisonRow {
  readonly rowId: string;
  readonly variantId: SyntheticStrategyVariantId;
  readonly scenarioId: string;
  readonly aggregateQualityBand: SyntheticStrategyComparisonQualityBand;
  readonly relativeFixtureScore: number;
  readonly deterministicRankWithinScenario: number;
  readonly explanationReferences: readonly string[];
  readonly warningReferences: readonly SyntheticStrategySensitivityWarningKind[];
  readonly nonAdvisorySummary: string;
}

export interface SyntheticStrategyComparisonRun {
  readonly runId: string;
  readonly runName: string;
  readonly runKind: 'synthetic_strategy_comparison_run';
  readonly strategyVariantIds: readonly SyntheticStrategyVariantId[];
  readonly scenarioCaseIds: readonly string[];
  readonly comparisonRows: readonly SyntheticStrategyComparisonRow[];
  readonly runSummary: {
    readonly totalRows: number;
    readonly rankedRows: number;
    readonly deterministic: true;
    readonly nonAdvisorySummary: string;
  };
}

export interface SyntheticStrategyComparisonAggregate {
  readonly aggregateId: string;
  readonly fixtureCount: number;
  readonly countByVariant: Readonly<Record<SyntheticStrategyVariantId, number>>;
  readonly countByScenarioKind: Readonly<Record<SyntheticStrategyComparisonLabKind, number>>;
  readonly aggregateFixtureScoreDistribution: Readonly<Record<SyntheticStrategyComparisonQualityBand, number>>;
  readonly sensitivityWarningCounts: Readonly<Record<SyntheticStrategySensitivityWarningKind, number>>;
  readonly nonAdvisorySummary: string;
}

export interface SyntheticStrategyComparisonLabViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: SyntheticStrategyComparisonLabName;
  readonly scenarioCount: number;
  readonly variantCount: number;
  readonly topFixtureScore: number;
  readonly highestFixtureScoreLabel: string;
  readonly sensitivityWarningCount: number;
  readonly nonAdvisorySummary: string;
}

export interface SyntheticStrategyComparisonLabApiListContract {
  readonly contractId: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
  readonly source: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface SyntheticStrategyComparisonLabApiDetailContract {
  readonly contractId: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
  readonly source: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: SyntheticStrategyComparisonLabViewModel;
}

export interface SyntheticStrategyComparisonLabApiSummaryContract {
  readonly contractId: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
  readonly source: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly highestFixtureScoreLabel: string;
    readonly sourceMetricFixtureName: PaperExecutionQualityMetricName;
  };
}

export interface SyntheticStrategyComparisonLabApiErrorContract {
  readonly contractId: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
  readonly source: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'SYNTHETIC_STRATEGY_COMPARISON_LAB_INVALID_REQUEST'
    | 'SYNTHETIC_STRATEGY_COMPARISON_LAB_NOT_FOUND';
  readonly message: string;
}

export interface SyntheticStrategyComparisonLabApiContracts {
  readonly list: SyntheticStrategyComparisonLabApiListContract;
  readonly detail: SyntheticStrategyComparisonLabApiDetailContract;
  readonly summary: SyntheticStrategyComparisonLabApiSummaryContract;
  readonly errors: readonly [
    SyntheticStrategyComparisonLabApiErrorContract,
    SyntheticStrategyComparisonLabApiErrorContract,
  ];
}

export interface SyntheticStrategyComparisonLabSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: SyntheticStrategyComparisonLabName;
  readonly fixtureKind?: SyntheticStrategyComparisonLabKind;
  readonly sourceMetricFixtureName?: PaperExecutionQualityMetricName;
}

export interface SyntheticStrategyComparisonLabSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: SyntheticStrategyComparisonLabKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface SyntheticStrategyComparisonLabCapabilities {
  readonly syntheticStrategyComparisonLab: true;
  readonly syntheticStrategyComparisonFixtures: true;
  readonly deterministicSyntheticStrategyComparison: true;
  readonly localOnlySyntheticStrategyComparison: true;
  readonly readOnlySyntheticStrategyComparison: true;
  readonly fixtureDerivedSyntheticStrategyComparison: true;
  readonly hypotheticalSyntheticStrategyComparison: true;
  readonly syntheticStrategyVariants: true;
  readonly syntheticStrategyScenarioMatrix: true;
  readonly syntheticStrategyComparisonRuns: true;
  readonly syntheticStrategyScorecards: true;
  readonly syntheticStrategySensitivityWarnings: true;
  readonly syntheticStrategyComparisonAggregates: true;
  readonly syntheticStrategyComparisonViewModels: true;
  readonly syntheticStrategyComparisonApiContracts: true;
  readonly syntheticStrategyComparisonSelectors: true;
  readonly syntheticStrategyComparisonLiveData: false;
  readonly syntheticStrategyComparisonNetworkAccess: false;
  readonly syntheticStrategyComparisonRealProviders: false;
  readonly syntheticStrategyComparisonProviderAdapters: false;
  readonly syntheticStrategyComparisonSolanaRpc: false;
  readonly syntheticStrategyComparisonWebSocketAccess: false;
  readonly syntheticStrategyComparisonGeyserYellowstone: false;
  readonly syntheticStrategyComparisonPumpFunIntegration: false;
  readonly syntheticStrategyComparisonDexIntegration: false;
  readonly syntheticStrategyComparisonJitoIntegration: false;
  readonly syntheticStrategyComparisonPersistence: false;
  readonly syntheticStrategyComparisonFilesystemWrites: false;
  readonly syntheticStrategyComparisonDownloads: false;
  readonly syntheticStrategyComparisonRouteHandlers: false;
  readonly syntheticStrategyComparisonHttpServer: false;
  readonly syntheticStrategyComparisonRuntimeRequests: false;
  readonly syntheticStrategyComparisonUiRendering: false;
  readonly syntheticStrategyComparisonDomAccess: false;
  readonly syntheticStrategyComparisonBackgroundJobs: false;
  readonly syntheticStrategyComparisonScheduledJobs: false;
  readonly syntheticStrategyComparisonWalletLogic: false;
  readonly syntheticStrategyComparisonPrivateKeyHandling: false;
  readonly syntheticStrategyComparisonSigning: false;
  readonly syntheticStrategyComparisonTransactionSending: false;
  readonly syntheticStrategyComparisonExecution: false;
  readonly syntheticStrategyComparisonTradingSignals: false;
  readonly syntheticStrategyComparisonRecommendations: false;
  readonly syntheticStrategyComparisonInvestmentAdvice: false;
  readonly syntheticStrategyComparisonLiveExecution: false;
  readonly syntheticStrategyComparisonStrategySelection: false;
  readonly syntheticStrategyComparisonRealOrders: false;
  readonly syntheticStrategyComparisonRealFunds: false;
  readonly syntheticStrategyComparisonRealPnL: false;
}

export interface SyntheticStrategyComparisonLabFixture {
  readonly fixtureId: string;
  readonly fixtureName: SyntheticStrategyComparisonLabName;
  readonly fixtureKind: SyntheticStrategyComparisonLabKind;
  readonly phase: typeof SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE;
  readonly schemaVersion: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION;
  readonly sourceMetricFixtureName: PaperExecutionQualityMetricName;
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly sourceEvidenceFixtureName: RiskExplanationEvidenceName;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly comparisonIdentity: SyntheticStrategyComparisonLabIdentity;
  readonly strategyVariants: readonly SyntheticStrategyVariant[];
  readonly scenarioMatrix: SyntheticStrategyScenarioMatrix;
  readonly comparisonRun: SyntheticStrategyComparisonRun;
  readonly scorecards: readonly SyntheticStrategyComparisonScorecard[];
  readonly aggregateSummary: SyntheticStrategyComparisonAggregate;
  readonly viewModel: SyntheticStrategyComparisonLabViewModel;
  readonly apiContracts: SyntheticStrategyComparisonLabApiContracts;
  readonly selectorExamples: readonly SyntheticStrategyComparisonLabSelectorResult[];
  readonly capabilityFlags: SyntheticStrategyComparisonLabCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT;
    readonly source: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE;
    readonly version: typeof PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_VERSION;
    readonly phase: typeof SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly hypotheticalOnly: true;
    readonly nonAdvisory: true;
    readonly notASignal: true;
  };
}

export interface BuildSyntheticStrategyComparisonLabFixtureInput {
  readonly fixtureName: SyntheticStrategyComparisonLabName;
}

export interface BuildSyntheticStrategyComparisonScorecardInput {
  readonly fixtureId: string;
  readonly variantId: SyntheticStrategyVariantId;
  readonly scenario: SyntheticStrategyScenarioCase;
  readonly sourceMetricFixtureName: PaperExecutionQualityMetricName;
  readonly sourceRiskBand: LaunchRiskBand;
  readonly sourceQualityBand: PaperExecutionQualityBand;
}

export interface BuildSyntheticStrategyComparisonRunInput {
  readonly fixtureId: string;
  readonly variants: readonly SyntheticStrategyVariant[];
  readonly scenarioMatrix: SyntheticStrategyScenarioMatrix;
  readonly scorecards: readonly SyntheticStrategyComparisonScorecard[];
}

export interface SyntheticStrategyComparisonLabValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface SyntheticStrategyComparisonLabValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SyntheticStrategyComparisonLabValidationIssue[];
}

export interface SyntheticStrategyComparisonLabSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
