/**
 * packages/strategy-evaluation/src/types.ts
 *
 * Phase 16 — Strategy Evaluation Report types.
 *
 * All output models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *   analysisOnly: true
 *   nonExecutable: true
 *
 * IMPORTANT: StrategyEvaluation is NOT a real evaluation with actionable results.
 * It is an internal analysis model only.
 * It must never create real trade intents, execution plans, orders,
 * paper trades, live data access, or any actionable output.
 */

// ─── Capabilities ────────────────────────────────────────────────────────────

/** All unsafe capability flags are permanently false. */
export interface StrategyEvaluationCapabilities {
  readonly canUseLiveData: false;
  readonly canUseSolanaRpc: false;
  readonly canUseProviderApis: false;
  readonly canAccessPrivateKeys: false;
  readonly canCreateTradeIntents: false;
  readonly canCreateExecutionPlans: false;
  readonly canPaperTrade: false;
  readonly canTrade: false;
  readonly canExecute: false;
  readonly canWriteToDatabase: false;
  readonly canSendTelegramAlerts: false;
  readonly canConstructTransactions: false;
  readonly canSimulateTransactions: false;
  readonly canCreateOrders: false;
  readonly canCreatePositions: false;
  readonly canCalculateLivePnl: false;
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
}

// ─── Score bands ─────────────────────────────────────────────────────────────

/**
 * Score band for a strategy evaluation review.
 * These are evidence quality bands for fixture-only review — NOT trade signals.
 */
export type StrategyScoreBand =
  | 'excellent_fixture_review'
  | 'strong_fixture_review'
  | 'moderate_fixture_review'
  | 'weak_fixture_review'
  | 'degraded_fixture_review'
  | 'failed_fixture_review'
  | 'inconclusive_fixture_review';

/** Per-band counts and summary for a set of strategy intents. */
export interface StrategyScoreBandSummary {
  readonly excellent: number;
  readonly strong: number;
  readonly moderate: number;
  readonly weak: number;
  readonly degraded: number;
  readonly failed: number;
  readonly inconclusive: number;
  readonly total: number;
  readonly summaryText: string;
}

// ─── Evidence distribution ────────────────────────────────────────────────────

/** Distribution of evidence quality across a set of strategy intents. */
export interface StrategyEvidenceDistribution {
  readonly total: number;
  readonly strongCount: number;
  readonly moderateCount: number;
  readonly weakCount: number;
  readonly degradedCount: number;
  readonly failedCount: number;
  readonly inconclusiveCount: number;
  readonly classificationCounts: Readonly<Record<string, number>>;
  readonly familyCounts: Readonly<Record<string, number>>;
  readonly summaryText: string;
}

// ─── Safety gate summary ──────────────────────────────────────────────────────

/** Aggregated safety gate status across a set of strategy intents. */
export interface StrategySafetyGateSummary {
  readonly total: number;
  readonly passed: number;
  readonly warning: number;
  readonly blocked: number;
  readonly inconclusive: number;
  readonly mostCommonBlockedGateIds: readonly string[];
  readonly summaryText: string;
}

// ─── Family comparison ────────────────────────────────────────────────────────

/** Per-family analysis comparison across a set of strategy intents. */
export interface StrategyFamilyComparison {
  readonly familyName: string;
  readonly intentCount: number;
  readonly averageConfidence: number;
  readonly evidenceQualityCounts: Readonly<Record<string, number>>;
  readonly gateStatusCounts: Readonly<Record<string, number>>;
  readonly summaryText: string;
}

// ─── Severity ─────────────────────────────────────────────────────────────────

/** Analysis-only severity levels. No action-oriented names. */
export type StrategyEvaluationSeverity = 'info' | 'warning' | 'risk' | 'failure' | 'inconclusive';

// ─── Classification ───────────────────────────────────────────────────────────

/**
 * Non-actionable evaluation classification.
 * These values are analysis-only labels — NOT recommendations to act.
 */
export type StrategyEvaluationClassification =
  | 'reject_heavy'
  | 'watch_only_heavy'
  | 'analysis_only_heavy'
  | 'insufficient_evidence'
  | 'fixture_only';

// ─── Source kind ──────────────────────────────────────────────────────────────

/** Identifies what kind of fixture source was used to build the evaluation. */
export type StrategyEvaluationSourceKind =
  | 'fixture_batch'
  | 'fixture_single'
  | 'fixture_only';

// ─── Finding ─────────────────────────────────────────────────────────────────

/** A single analysis finding within a strategy evaluation. */
export interface StrategyEvaluationFinding {
  readonly severity: StrategyEvaluationSeverity;
  readonly code: string;
  readonly message: string;
  readonly safeToDisplay: true;
}

// ─── StrategyEvaluation ───────────────────────────────────────────────────────

/**
 * The core evaluation report model.
 *
 * IMPORTANT SAFETY NOTE:
 * This is NOT a real evaluation with actionable outputs.
 * It is an internal, fixture-only, analysis-only, non-executable model for human review.
 * It must never be used to place trades, construct transactions,
 * or enable any form of execution.
 */
export interface StrategyEvaluation {
  readonly id: string;
  readonly sourceKind: StrategyEvaluationSourceKind;
  readonly intentCount: number;
  readonly classification: StrategyEvaluationClassification;
  readonly scoreBandSummary: StrategyScoreBandSummary;
  readonly evidenceDistribution: StrategyEvidenceDistribution;
  readonly safetyGateSummary: StrategySafetyGateSummary;
  readonly familyComparisons: readonly StrategyFamilyComparison[];
  readonly findings: readonly StrategyEvaluationFinding[];
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
}

// ─── Input ────────────────────────────────────────────────────────────────────

/** Input for building a StrategyEvaluation. All data must be fixture-only. */
export interface StrategyEvaluationInput {
  readonly intents: readonly import('@sonic/strategy-intent').StrategyIntent[];
  readonly sourceKind?: StrategyEvaluationSourceKind;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

// ─── Report ───────────────────────────────────────────────────────────────────

/** A strategy evaluation report wrapping evaluation with metadata. */
export interface StrategyEvaluationReport {
  readonly reportId: string;
  readonly evaluation: StrategyEvaluation;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
}

// ─── Export ───────────────────────────────────────────────────────────────────

/** Deterministic JSON-safe export of a strategy evaluation. */
export interface StrategyEvaluationExport {
  readonly exportKind: 'strategy_evaluation_export';
  readonly evaluation: StrategyEvaluation;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
}

// ─── Fixture ─────────────────────────────────────────────────────────────────

/** A named, deterministic StrategyEvaluation fixture for test/review use. */
export interface StrategyEvaluationFixture {
  readonly fixtureId: string;
  readonly displayName: string;
  readonly description: string;
  readonly evaluation: StrategyEvaluation;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type StrategyEvaluationErrorCode =
  | 'INVALID_STRATEGY_EVALUATION_INPUT'
  | 'INVALID_STRATEGY_EVALUATION'
  | 'UNSAFE_STRATEGY_EVALUATION_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'ANALYSIS_ONLY_REQUIRED'
  | 'NON_EXECUTABLE_REQUIRED'
  | 'SAFE_TO_DISPLAY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'STRATEGY_EVALUATION_FIXTURE_ONLY'
  | 'EMPTY_INTENTS';
