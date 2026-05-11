/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: types.
 */

import type { LaunchRiskBand, LaunchRiskEngineAssessmentName } from '../launch-risk-engine/types.js';
import type { RiskExplanationEvidenceName } from '../risk-explanation-evidence/types.js';
import type { SyntheticEventStreamLifecycleStreamName } from '../synthetic-event-stream-lifecycle/types.js';
import type { SyntheticEventStreamReplayHarnessScenarioName } from '../synthetic-event-stream-replay-harness/types.js';

export const PAPER_SNIPER_SIMULATION_PHASE = 60 as const;

export const PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT = '2026-02-27T00:00:00.000Z' as const;

export const PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE =
  'phase60_paper_sniper_simulation_foundation_v1' as const;

export const PHASE_60_PAPER_SNIPER_SIMULATION_VERSION = '1.0.0' as const;

export const PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION = '1.0.0' as const;

export const PAPER_SNIPER_SIMULATION_NAMES = [
  'clean-launch-paper-sniper-simulation',
  'thin-liquidity-paper-sniper-simulation',
  'concentrated-holders-paper-sniper-simulation',
  'suspicious-creator-paper-sniper-simulation',
  'possible-bundle-cluster-paper-sniper-simulation',
  'metadata-incomplete-paper-sniper-simulation',
  'high-early-volume-paper-sniper-simulation',
  'safety-rejected-paper-sniper-simulation',
] as const;

export const PAPER_SNIPER_SIMULATION_KINDS = [
  'clean_launch_paper_sniper_simulation',
  'thin_liquidity_paper_sniper_simulation',
  'concentrated_holders_paper_sniper_simulation',
  'suspicious_creator_paper_sniper_simulation',
  'possible_bundle_cluster_paper_sniper_simulation',
  'metadata_incomplete_paper_sniper_simulation',
  'high_early_volume_paper_sniper_simulation',
  'safety_rejected_paper_sniper_simulation',
] as const;

export type PaperSniperSimulationName = (typeof PAPER_SNIPER_SIMULATION_NAMES)[number];
export type PaperSniperSimulationKind = (typeof PAPER_SNIPER_SIMULATION_KINDS)[number];

export const PAPER_SNIPER_MARKET_LIQUIDITY_BUCKETS = ['deep', 'balanced', 'thin', 'critical'] as const;
export const PAPER_SNIPER_MARKET_VOLATILITY_BUCKETS = ['calm', 'steady', 'elevated', 'severe'] as const;
export const PAPER_SNIPER_LATENCY_BUCKETS = ['fast', 'standard', 'slow', 'degraded'] as const;
export const PAPER_SNIPER_SLIPPAGE_BUCKETS = ['minimal', 'low', 'medium', 'high', 'extreme'] as const;
export const PAPER_SNIPER_FAILURE_BUCKETS = ['rare', 'possible', 'elevated', 'critical'] as const;

export type PaperSniperMarketLiquidityBucket = (typeof PAPER_SNIPER_MARKET_LIQUIDITY_BUCKETS)[number];
export type PaperSniperMarketVolatilityBucket = (typeof PAPER_SNIPER_MARKET_VOLATILITY_BUCKETS)[number];
export type PaperSniperLatencyBucket = (typeof PAPER_SNIPER_LATENCY_BUCKETS)[number];
export type PaperSniperSlippageBucket = (typeof PAPER_SNIPER_SLIPPAGE_BUCKETS)[number];
export type PaperSniperFailureBucket = (typeof PAPER_SNIPER_FAILURE_BUCKETS)[number];

export interface PaperSniperSimulationIdentity {
  readonly simulationId: string;
  readonly simulationName: PaperSniperSimulationName;
  readonly simulationKind: PaperSniperSimulationKind;
  readonly sourcePhase59FixtureName: RiskExplanationEvidenceName;
  readonly sourcePhase58FixtureName: LaunchRiskEngineAssessmentName;
  readonly sourcePhase57FixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourcePhase56FixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly schemaVersion: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
}

export interface PaperSniperMarketModel {
  readonly modelId: string;
  readonly liquidityBucket: PaperSniperMarketLiquidityBucket;
  readonly volatilityBucket: PaperSniperMarketVolatilityBucket;
  readonly marketDepthUsd: number;
  readonly expectedSpreadBps: number;
  readonly safetyNotes: readonly string[];
}

export interface PaperSniperLatencyModel {
  readonly modelId: string;
  readonly latencyBucket: PaperSniperLatencyBucket;
  readonly quoteLatencyMs: number;
  readonly submitLatencyMs: number;
  readonly confirmationLatencyMs: number;
  readonly endToEndLatencyMs: number;
  readonly safetyNotes: readonly string[];
}

export interface PaperSniperSlippageModel {
  readonly modelId: string;
  readonly slippageBucket: PaperSniperSlippageBucket;
  readonly expectedSlippageBps: number;
  readonly maxSlippageBps: number;
  readonly safetyNotes: readonly string[];
}

export interface PaperSniperFailureModel {
  readonly modelId: string;
  readonly failureBucket: PaperSniperFailureBucket;
  readonly staleQuoteProbability: number;
  readonly routeMismatchProbability: number;
  readonly liquidityFailureProbability: number;
  readonly rejectedBySafetyProbability: number;
  readonly aggregateFailureProbability: number;
  readonly safetyNotes: readonly string[];
}

export type PaperSniperSimulationStatus =
  | 'simulated_fill'
  | 'simulated_partial_fill'
  | 'simulated_reject';

export interface PaperSniperSimulationStep {
  readonly stepId: string;
  readonly stepSequence: number;
  readonly status: PaperSniperSimulationStatus;
  readonly expectedFillPct: number;
  readonly expectedSlippageBps: number;
  readonly expectedLatencyMs: number;
  readonly failureReason: 'none' | 'stale_quote' | 'route_mismatch' | 'liquidity_failure' | 'safety_rejection';
  readonly summary: string;
}

export interface PaperSniperSimulationOutcome {
  readonly outcomeId: string;
  readonly outcomeStatus: PaperSniperSimulationStatus;
  readonly expectedFillPct: number;
  readonly expectedSlippageBps: number;
  readonly expectedLatencyMs: number;
  readonly expectedFailureProbability: number;
  readonly expectedConfidenceLabel: 'high_confidence' | 'moderate_confidence' | 'low_confidence';
  readonly summary: string;
  readonly safetySummary: string;
  readonly steps: readonly PaperSniperSimulationStep[];
  readonly meta: {
    readonly deterministic: true;
    readonly generatedAt: typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
    readonly source: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE;
  };
}

export interface PaperSniperSimulationOutcomesSummary {
  readonly summaryId: string;
  readonly projectedStatus: PaperSniperSimulationStatus;
  readonly simulatedFillPct: number;
  readonly simulatedSlippageBps: number;
  readonly simulatedLatencyMs: number;
  readonly simulatedFailureProbability: number;
  readonly bucketSummary: string;
  readonly nonAdvisorySummary: string;
}

export interface PaperSniperSimulationViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly simulationKind: PaperSniperSimulationKind;
  readonly sourcePhase58FixtureName: LaunchRiskEngineAssessmentName;
  readonly sourceRiskBand: LaunchRiskBand;
  readonly projectedStatus: PaperSniperSimulationStatus;
  readonly projectedFillPct: number;
  readonly projectedSlippageBps: number;
  readonly projectedLatencyMs: number;
  readonly nonAdvisorySummary: string;
}

export interface PaperSniperSimulationApiListContract {
  readonly contractId: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
  readonly source: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface PaperSniperSimulationApiDetailContract {
  readonly contractId: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
  readonly source: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: PaperSniperSimulationViewModel;
}

export interface PaperSniperSimulationApiSummaryContract {
  readonly contractId: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
  readonly source: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly simulationKind: PaperSniperSimulationKind;
    readonly projectedStatus: PaperSniperSimulationStatus;
    readonly sourcePhase58FixtureName: LaunchRiskEngineAssessmentName;
  };
}

export interface PaperSniperSimulationApiErrorContract {
  readonly contractId: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
  readonly source: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'PAPER_SNIPER_SIMULATION_INVALID_REQUEST'
    | 'PAPER_SNIPER_SIMULATION_NOT_FOUND';
  readonly message: string;
}

export interface PaperSniperSimulationApiContracts {
  readonly list: PaperSniperSimulationApiListContract;
  readonly detail: PaperSniperSimulationApiDetailContract;
  readonly summary: PaperSniperSimulationApiSummaryContract;
  readonly errors: readonly [
    PaperSniperSimulationApiErrorContract,
    PaperSniperSimulationApiErrorContract,
  ];
}

export interface PaperSniperSimulationSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: PaperSniperSimulationName;
  readonly fixtureKind?: PaperSniperSimulationKind;
  readonly sourcePhase58FixtureName?: LaunchRiskEngineAssessmentName;
  readonly sourcePhase59FixtureName?: RiskExplanationEvidenceName;
}

export interface PaperSniperSimulationSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: PaperSniperSimulationKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface PaperSniperSimulationCapabilities {
  readonly paperSniperSimulationFoundation: true;
  readonly paperSniperSimulationFixtures: true;
  readonly deterministicPaperSniperSimulation: true;
  readonly localOnlyPaperSniperSimulation: true;
  readonly readOnlyPaperSniperSimulation: true;
  readonly fixtureDerivedPaperSniperSimulation: true;
  readonly paperSniperMarketModel: true;
  readonly paperSniperLatencyModel: true;
  readonly paperSniperSlippageModel: true;
  readonly paperSniperFailureModel: true;
  readonly paperSniperSimulator: true;
  readonly paperSniperOutcomes: true;
  readonly paperSniperViewModels: true;
  readonly paperSniperApiContracts: true;
  readonly paperSniperSelectors: true;
  readonly paperSniperLiveData: false;
  readonly paperSniperNetworkAccess: false;
  readonly paperSniperRealProviders: false;
  readonly paperSniperProviderAdapters: false;
  readonly paperSniperSolanaRpc: false;
  readonly paperSniperWebSocketAccess: false;
  readonly paperSniperGeyserYellowstone: false;
  readonly paperSniperPumpFunIntegration: false;
  readonly paperSniperDexIntegration: false;
  readonly paperSniperJitoIntegration: false;
  readonly paperSniperPersistence: false;
  readonly paperSniperFilesystemWrites: false;
  readonly paperSniperDownloads: false;
  readonly paperSniperRouteHandlers: false;
  readonly paperSniperHttpServer: false;
  readonly paperSniperRuntimeRequests: false;
  readonly paperSniperUiRendering: false;
  readonly paperSniperDomAccess: false;
  readonly paperSniperBackgroundJobs: false;
  readonly paperSniperScheduledJobs: false;
  readonly paperSniperWalletLogic: false;
  readonly paperSniperPrivateKeyHandling: false;
  readonly paperSniperSigning: false;
  readonly paperSniperTransactionSending: false;
  readonly paperSniperExecution: false;
  readonly paperSniperTradingSignals: false;
  readonly paperSniperRecommendations: false;
  readonly paperSniperInvestmentAdvice: false;
  readonly paperSniperLiveExecution: false;
}

export interface PaperSniperSimulationFixture {
  readonly fixtureId: string;
  readonly fixtureName: PaperSniperSimulationName;
  readonly fixtureKind: PaperSniperSimulationKind;
  readonly phase: typeof PAPER_SNIPER_SIMULATION_PHASE;
  readonly schemaVersion: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION;
  readonly sourcePhase59FixtureName: RiskExplanationEvidenceName;
  readonly sourcePhase58FixtureName: LaunchRiskEngineAssessmentName;
  readonly sourcePhase57FixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly sourcePhase56FixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly sourceRiskBand: LaunchRiskBand;
  readonly simulationIdentity: PaperSniperSimulationIdentity;
  readonly marketModel: PaperSniperMarketModel;
  readonly latencyModel: PaperSniperLatencyModel;
  readonly slippageModel: PaperSniperSlippageModel;
  readonly failureModel: PaperSniperFailureModel;
  readonly outcome: PaperSniperSimulationOutcome;
  readonly outcomesSummary: PaperSniperSimulationOutcomesSummary;
  readonly viewModel: PaperSniperSimulationViewModel;
  readonly apiContracts: PaperSniperSimulationApiContracts;
  readonly selectorExamples: readonly PaperSniperSimulationSelectorResult[];
  readonly capabilityFlags: PaperSniperSimulationCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
    readonly source: typeof PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE;
    readonly version: typeof PHASE_60_PAPER_SNIPER_SIMULATION_VERSION;
    readonly phase: typeof PAPER_SNIPER_SIMULATION_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly nonAdvisory: true;
    readonly notASignal: true;
  };
}

export interface BuildPaperSniperSimulationFixtureInput {
  readonly fixtureName: PaperSniperSimulationName;
}

export interface BuildPaperSniperMarketModelInput {
  readonly fixtureId: string;
  readonly riskBand: LaunchRiskBand;
  readonly sourcePhase58FixtureName: LaunchRiskEngineAssessmentName;
}

export interface BuildPaperSniperLatencyModelInput {
  readonly fixtureId: string;
  readonly riskBand: LaunchRiskBand;
}

export interface BuildPaperSniperSlippageModelInput {
  readonly fixtureId: string;
  readonly riskBand: LaunchRiskBand;
}

export interface BuildPaperSniperFailureModelInput {
  readonly fixtureId: string;
  readonly riskBand: LaunchRiskBand;
}

export interface RunPaperSniperSimulationInput {
  readonly fixtureId: string;
  readonly fixtureKind: PaperSniperSimulationKind;
  readonly marketModel: PaperSniperMarketModel;
  readonly latencyModel: PaperSniperLatencyModel;
  readonly slippageModel: PaperSniperSlippageModel;
  readonly failureModel: PaperSniperFailureModel;
}

export interface BuildPaperSniperOutcomesSummaryInput {
  readonly fixtureId: string;
  readonly marketModel: PaperSniperMarketModel;
  readonly latencyModel: PaperSniperLatencyModel;
  readonly slippageModel: PaperSniperSlippageModel;
  readonly failureModel: PaperSniperFailureModel;
  readonly outcome: PaperSniperSimulationOutcome;
}

export interface PaperSniperSimulationValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface PaperSniperSimulationValidationResult {
  readonly valid: boolean;
  readonly issues: readonly PaperSniperSimulationValidationIssue[];
}

export interface PaperSniperSimulationSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
