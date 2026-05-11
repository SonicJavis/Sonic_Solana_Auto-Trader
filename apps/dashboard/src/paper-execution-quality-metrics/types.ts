/**
 * Phase 61 — Paper Execution Quality Metrics v1: types.
 */

import type {
  LaunchRiskBand,
  LaunchRiskEngineAssessmentName,
} from '../launch-risk-engine/types.js';
import type { PaperSniperSimulationName } from '../paper-sniper-simulation/types.js';
import type { RiskExplanationEvidenceName } from '../risk-explanation-evidence/types.js';
import type { SyntheticEventStreamLifecycleStreamName } from '../synthetic-event-stream-lifecycle/types.js';
import type { SyntheticEventStreamReplayHarnessScenarioName } from '../synthetic-event-stream-replay-harness/types.js';

export const PAPER_EXECUTION_QUALITY_METRICS_PHASE = 61 as const;

export const PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT =
  '2026-05-11T00:00:00.000Z' as const;

export const PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE =
  'phase61_paper_execution_quality_metrics_v1' as const;

export const PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_VERSION = '1.0.0' as const;

export const PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION = '1.0.0' as const;

export const PAPER_EXECUTION_QUALITY_METRIC_NAMES = [
  'clean-launch-paper-execution-quality-metrics',
  'thin-liquidity-paper-execution-quality-metrics',
  'concentrated-holders-paper-execution-quality-metrics',
  'suspicious-creator-paper-execution-quality-metrics',
  'possible-bundle-cluster-paper-execution-quality-metrics',
  'metadata-incomplete-paper-execution-quality-metrics',
  'high-early-volume-paper-execution-quality-metrics',
  'safety-rejected-paper-execution-quality-metrics',
] as const;

export const PAPER_EXECUTION_QUALITY_METRIC_KINDS = [
  'clean_launch_paper_execution_quality_metrics',
  'thin_liquidity_paper_execution_quality_metrics',
  'concentrated_holders_paper_execution_quality_metrics',
  'suspicious_creator_paper_execution_quality_metrics',
  'possible_bundle_cluster_paper_execution_quality_metrics',
  'metadata_incomplete_paper_execution_quality_metrics',
  'high_early_volume_paper_execution_quality_metrics',
  'safety_rejected_paper_execution_quality_metrics',
] as const;

export type PaperExecutionQualityMetricName =
  (typeof PAPER_EXECUTION_QUALITY_METRIC_NAMES)[number];
export type PaperExecutionQualityMetricKind =
  (typeof PAPER_EXECUTION_QUALITY_METRIC_KINDS)[number];

export const PAPER_EXECUTION_LATENCY_BUCKETS = [
  'ultra_low',
  'low',
  'moderate',
  'high',
  'critical',
] as const;
export const PAPER_EXECUTION_OBSERVATION_DELAY_BUCKETS = [
  'minimal',
  'light',
  'elevated',
  'severe',
] as const;
export const PAPER_EXECUTION_SUBMISSION_DELAY_BUCKETS = [
  'minimal',
  'light',
  'elevated',
  'severe',
] as const;
export const PAPER_EXECUTION_CONFIRMATION_DELAY_BUCKETS = [
  'minimal',
  'light',
  'elevated',
  'severe',
] as const;
export const PAPER_EXECUTION_LATENCY_QUALITY_LABELS = [
  'quality_excellent',
  'quality_good',
  'quality_degraded',
] as const;

export const PAPER_EXECUTION_FILL_STATUSES = [
  'hypothetical_fill_complete',
  'hypothetical_fill_partial',
  'hypothetical_missed_entry',
  'hypothetical_rejected',
] as const;
export const PAPER_EXECUTION_FILL_QUALITY_LABELS = [
  'quality_high',
  'quality_moderate',
  'quality_limited',
  'quality_rejected',
] as const;
export const PAPER_EXECUTION_MISSED_ENTRY_CLASSIFICATIONS = [
  'none',
  'missed_due_to_latency',
  'missed_due_to_liquidity',
  'missed_due_to_safety',
  'missed_due_to_insufficient_evidence',
] as const;

export const PAPER_EXECUTION_SLIPPAGE_BUCKETS = [
  'negligible',
  'low',
  'medium',
  'high',
  'extreme',
] as const;
export const PAPER_EXECUTION_PRICE_IMPACT_BUCKETS = [
  'minimal',
  'light',
  'moderate',
  'heavy',
] as const;
export const PAPER_EXECUTION_LIQUIDITY_SENSITIVITY_LABELS = [
  'insensitive',
  'moderate',
  'sensitive',
  'fragile',
] as const;
export const PAPER_EXECUTION_SLIPPAGE_QUALITY_LABELS = [
  'quality_high',
  'quality_moderate',
  'quality_limited',
  'quality_degraded',
] as const;

export const PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS = [
  'quality_no_rejection',
  'quality_rejected_latency',
  'quality_rejected_risk',
  'quality_rejected_safety',
  'quality_rejected_liquidity',
  'quality_rejected_concentration',
  'quality_rejected_replay_mismatch',
  'quality_rejected_insufficient_evidence',
] as const;

export const PAPER_EXECUTION_QUALITY_BANDS = [
  'quality_strong',
  'quality_moderate',
  'quality_weak',
  'quality_rejected',
] as const;

export type PaperExecutionLatencyBucket = (typeof PAPER_EXECUTION_LATENCY_BUCKETS)[number];
export type PaperExecutionObservationDelayBucket =
  (typeof PAPER_EXECUTION_OBSERVATION_DELAY_BUCKETS)[number];
export type PaperExecutionSubmissionDelayBucket =
  (typeof PAPER_EXECUTION_SUBMISSION_DELAY_BUCKETS)[number];
export type PaperExecutionConfirmationDelayBucket =
  (typeof PAPER_EXECUTION_CONFIRMATION_DELAY_BUCKETS)[number];
export type PaperExecutionLatencyQualityLabel =
  (typeof PAPER_EXECUTION_LATENCY_QUALITY_LABELS)[number];

export type PaperExecutionFillStatus = (typeof PAPER_EXECUTION_FILL_STATUSES)[number];
export type PaperExecutionFillQualityLabel =
  (typeof PAPER_EXECUTION_FILL_QUALITY_LABELS)[number];
export type PaperExecutionMissedEntryClassification =
  (typeof PAPER_EXECUTION_MISSED_ENTRY_CLASSIFICATIONS)[number];

export type PaperExecutionSlippageBucket = (typeof PAPER_EXECUTION_SLIPPAGE_BUCKETS)[number];
export type PaperExecutionPriceImpactBucket =
  (typeof PAPER_EXECUTION_PRICE_IMPACT_BUCKETS)[number];
export type PaperExecutionLiquiditySensitivityLabel =
  (typeof PAPER_EXECUTION_LIQUIDITY_SENSITIVITY_LABELS)[number];
export type PaperExecutionSlippageQualityLabel =
  (typeof PAPER_EXECUTION_SLIPPAGE_QUALITY_LABELS)[number];

export type PaperExecutionRejectionTaxonomyKind =
  (typeof PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS)[number];
export type PaperExecutionQualityBand = (typeof PAPER_EXECUTION_QUALITY_BANDS)[number];

export interface PaperExecutionQualityMetricsIdentity {
  readonly metricSetId: string;
  readonly metricSetName: PaperExecutionQualityMetricName;
  readonly metricSetKind: PaperExecutionQualityMetricKind;
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly sourceEvidenceFixtureName: RiskExplanationEvidenceName;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly schemaVersion: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
}

export interface PaperLatencyMetrics {
  readonly metricsId: string;
  readonly latencyBucket: PaperExecutionLatencyBucket;
  readonly observationDelayBucket: PaperExecutionObservationDelayBucket;
  readonly simulatedSubmissionDelayBucket: PaperExecutionSubmissionDelayBucket;
  readonly simulatedConfirmationDelayBucket: PaperExecutionConfirmationDelayBucket;
  readonly latencyQualityLabel: PaperExecutionLatencyQualityLabel;
  readonly qualityNotes: readonly string[];
}

export interface PaperFillQualityMetrics {
  readonly metricsId: string;
  readonly hypotheticalFillStatus: PaperExecutionFillStatus;
  readonly simulatedFillQualityLabel: PaperExecutionFillQualityLabel;
  readonly simulatedMissedEntryClassification: PaperExecutionMissedEntryClassification;
  readonly simulatedRejectionReason: PaperExecutionRejectionTaxonomyKind;
  readonly sourceOutcomeId: string;
  readonly sourceOutcomeReferences: readonly string[];
  readonly qualityNotes: readonly string[];
}

export interface PaperSlippageMetrics {
  readonly metricsId: string;
  readonly simulatedSlippageBucket: PaperExecutionSlippageBucket;
  readonly syntheticPriceImpactBucket: PaperExecutionPriceImpactBucket;
  readonly liquiditySensitivityLabel: PaperExecutionLiquiditySensitivityLabel;
  readonly slippageQualityLabel: PaperExecutionSlippageQualityLabel;
  readonly qualityNotes: readonly string[];
}

export interface PaperRejectionMetrics {
  readonly metricsId: string;
  readonly rejectionTaxonomyKind: PaperExecutionRejectionTaxonomyKind;
  readonly rejectionQualityLabel: 'quality_clear' | 'quality_blocked';
  readonly missedEntryReason: PaperExecutionMissedEntryClassification;
  readonly qualityNotes: readonly string[];
}

export interface PaperExecutionQualityScorecard {
  readonly scorecardId: string;
  readonly scorecardKind: 'paper_execution_quality_scorecard';
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly latencyQuality: PaperExecutionLatencyQualityLabel;
  readonly fillQuality: PaperExecutionFillQualityLabel;
  readonly slippageQuality: PaperExecutionSlippageQualityLabel;
  readonly rejectionQuality: PaperRejectionMetrics['rejectionQualityLabel'];
  readonly aggregateQualityBand: PaperExecutionQualityBand;
  readonly qualityWarnings: readonly string[];
  readonly limitationNotes: readonly string[];
  readonly nonAdvisorySummary: string;
  readonly sourceOutcomeId: string;
  readonly sourceEvidenceReferenceIds: readonly string[];
  readonly safetySummary: string;
  readonly validationSummary: string;
  readonly meta: {
    readonly generatedAt: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
    readonly source: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE;
  };
}

export interface PaperExecutionQualityAggregateSummary {
  readonly aggregateId: string;
  readonly fixtureCount: number;
  readonly countByLatencyBucket: Readonly<Record<PaperExecutionLatencyBucket, number>>;
  readonly countBySlippageBucket: Readonly<Record<PaperExecutionSlippageBucket, number>>;
  readonly countByFillStatus: Readonly<Record<PaperExecutionFillStatus, number>>;
  readonly countByRejectionReason: Readonly<Record<PaperExecutionRejectionTaxonomyKind, number>>;
  readonly aggregateQualityDistribution: Readonly<Record<PaperExecutionQualityBand, number>>;
  readonly nonAdvisorySummary: string;
}

export interface PaperExecutionQualityMetricsViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: PaperExecutionQualityMetricName;
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly latencyQualityLabel: PaperExecutionLatencyQualityLabel;
  readonly fillStatus: PaperExecutionFillStatus;
  readonly slippageBucket: PaperExecutionSlippageBucket;
  readonly rejectionTaxonomyKind: PaperExecutionRejectionTaxonomyKind;
  readonly aggregateQualityBand: PaperExecutionQualityBand;
  readonly nonAdvisorySummary: string;
}

export interface PaperExecutionQualityMetricsApiListContract {
  readonly contractId: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
  readonly source: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface PaperExecutionQualityMetricsApiDetailContract {
  readonly contractId: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
  readonly source: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: PaperExecutionQualityMetricsViewModel;
}

export interface PaperExecutionQualityMetricsApiSummaryContract {
  readonly contractId: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
  readonly source: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly aggregateQualityBand: PaperExecutionQualityBand;
    readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  };
}

export interface PaperExecutionQualityMetricsApiErrorContract {
  readonly contractId: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
  readonly source: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'PAPER_EXECUTION_QUALITY_METRICS_INVALID_REQUEST'
    | 'PAPER_EXECUTION_QUALITY_METRICS_NOT_FOUND';
  readonly message: string;
}

export interface PaperExecutionQualityMetricsApiContracts {
  readonly list: PaperExecutionQualityMetricsApiListContract;
  readonly detail: PaperExecutionQualityMetricsApiDetailContract;
  readonly summary: PaperExecutionQualityMetricsApiSummaryContract;
  readonly errors: readonly [
    PaperExecutionQualityMetricsApiErrorContract,
    PaperExecutionQualityMetricsApiErrorContract,
  ];
}

export interface PaperExecutionQualityMetricSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: PaperExecutionQualityMetricName;
  readonly fixtureKind?: PaperExecutionQualityMetricKind;
  readonly sourceSimulationFixtureName?: PaperSniperSimulationName;
}

export interface PaperExecutionQualityMetricSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: PaperExecutionQualityMetricKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface PaperExecutionQualityMetricsCapabilities {
  readonly paperExecutionQualityMetrics: true;
  readonly paperExecutionQualityMetricFixtures: true;
  readonly deterministicPaperExecutionQualityMetrics: true;
  readonly localOnlyPaperExecutionQualityMetrics: true;
  readonly readOnlyPaperExecutionQualityMetrics: true;
  readonly fixtureDerivedPaperExecutionQualityMetrics: true;
  readonly hypotheticalPaperExecutionQualityMetrics: true;
  readonly paperLatencyMetrics: true;
  readonly paperFillQualityMetrics: true;
  readonly paperSlippageMetrics: true;
  readonly paperRejectionMetrics: true;
  readonly paperExecutionQualityScorecards: true;
  readonly paperExecutionQualityAggregates: true;
  readonly paperExecutionQualityViewModels: true;
  readonly paperExecutionQualityApiContracts: true;
  readonly paperExecutionQualitySelectors: true;
  readonly paperExecutionQualityLiveData: false;
  readonly paperExecutionQualityNetworkAccess: false;
  readonly paperExecutionQualityRealProviders: false;
  readonly paperExecutionQualityProviderAdapters: false;
  readonly paperExecutionQualitySolanaRpc: false;
  readonly paperExecutionQualityWebSocketAccess: false;
  readonly paperExecutionQualityGeyserYellowstone: false;
  readonly paperExecutionQualityPumpFunIntegration: false;
  readonly paperExecutionQualityDexIntegration: false;
  readonly paperExecutionQualityJitoIntegration: false;
  readonly paperExecutionQualityPersistence: false;
  readonly paperExecutionQualityFilesystemWrites: false;
  readonly paperExecutionQualityDownloads: false;
  readonly paperExecutionQualityRouteHandlers: false;
  readonly paperExecutionQualityHttpServer: false;
  readonly paperExecutionQualityRuntimeRequests: false;
  readonly paperExecutionQualityUiRendering: false;
  readonly paperExecutionQualityDomAccess: false;
  readonly paperExecutionQualityBackgroundJobs: false;
  readonly paperExecutionQualityScheduledJobs: false;
  readonly paperExecutionQualityWalletLogic: false;
  readonly paperExecutionQualityPrivateKeyHandling: false;
  readonly paperExecutionQualitySigning: false;
  readonly paperExecutionQualityTransactionSending: false;
  readonly paperExecutionQualityExecution: false;
  readonly paperExecutionQualityTradingSignals: false;
  readonly paperExecutionQualityRecommendations: false;
  readonly paperExecutionQualityInvestmentAdvice: false;
  readonly paperExecutionQualityLiveExecution: false;
  readonly paperExecutionQualityStrategySelection: false;
  readonly paperExecutionQualityRealOrders: false;
  readonly paperExecutionQualityRealFunds: false;
  readonly paperExecutionQualityRealPnL: false;
}

export interface PaperExecutionQualityMetricFixture {
  readonly fixtureId: string;
  readonly fixtureName: PaperExecutionQualityMetricName;
  readonly fixtureKind: PaperExecutionQualityMetricKind;
  readonly phase: typeof PAPER_EXECUTION_QUALITY_METRICS_PHASE;
  readonly schemaVersion: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION;
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly sourceEvidenceFixtureName: RiskExplanationEvidenceName;
  readonly sourceRiskFixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly sourceRiskBand: LaunchRiskBand;
  readonly metricsIdentity: PaperExecutionQualityMetricsIdentity;
  readonly latencyMetrics: PaperLatencyMetrics;
  readonly fillQualityMetrics: PaperFillQualityMetrics;
  readonly slippageMetrics: PaperSlippageMetrics;
  readonly rejectionMetrics: PaperRejectionMetrics;
  readonly scorecard: PaperExecutionQualityScorecard;
  readonly aggregateSummary: PaperExecutionQualityAggregateSummary;
  readonly viewModel: PaperExecutionQualityMetricsViewModel;
  readonly apiContracts: PaperExecutionQualityMetricsApiContracts;
  readonly selectorExamples: readonly PaperExecutionQualityMetricSelectorResult[];
  readonly capabilityFlags: PaperExecutionQualityMetricsCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT;
    readonly source: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE;
    readonly version: typeof PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_VERSION;
    readonly phase: typeof PAPER_EXECUTION_QUALITY_METRICS_PHASE;
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

export interface BuildPaperExecutionQualityMetricFixtureInput {
  readonly fixtureName: PaperExecutionQualityMetricName;
}

export interface BuildPaperLatencyMetricsInput {
  readonly fixtureId: string;
  readonly sourceLatencyBucket: 'fast' | 'standard' | 'slow' | 'degraded';
}

export interface BuildPaperFillQualityMetricsInput {
  readonly fixtureId: string;
  readonly sourceOutcomeStatus: 'simulated_fill' | 'simulated_partial_fill' | 'simulated_reject';
  readonly sourceFailureReason: 'none' | 'stale_quote' | 'route_mismatch' | 'liquidity_failure' | 'safety_rejection';
  readonly sourceOutcomeId: string;
}

export interface BuildPaperSlippageMetricsInput {
  readonly fixtureId: string;
  readonly sourceSlippageBucket: 'minimal' | 'low' | 'medium' | 'high' | 'extreme';
  readonly sourceLiquidityBucket: 'deep' | 'balanced' | 'thin' | 'critical';
}

export interface BuildPaperRejectionMetricsInput {
  readonly fixtureId: string;
  readonly sourceRiskBand: LaunchRiskBand;
  readonly sourceFailureBucket: 'rare' | 'possible' | 'elevated' | 'critical';
  readonly sourceOutcomeStatus: 'simulated_fill' | 'simulated_partial_fill' | 'simulated_reject';
  readonly sourceFailureReason: 'none' | 'stale_quote' | 'route_mismatch' | 'liquidity_failure' | 'safety_rejection';
}

export interface BuildPaperExecutionQualityScorecardInput {
  readonly fixtureId: string;
  readonly sourceSimulationFixtureName: PaperSniperSimulationName;
  readonly latencyMetrics: PaperLatencyMetrics;
  readonly fillQualityMetrics: PaperFillQualityMetrics;
  readonly slippageMetrics: PaperSlippageMetrics;
  readonly rejectionMetrics: PaperRejectionMetrics;
}

export interface PaperExecutionQualityMetricValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface PaperExecutionQualityMetricValidationResult {
  readonly valid: boolean;
  readonly issues: readonly PaperExecutionQualityMetricValidationIssue[];
}

export interface PaperExecutionQualityMetricsSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
