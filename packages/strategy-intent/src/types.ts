/**
 * packages/strategy-intent/src/types.ts
 *
 * Phase 15 — Strategy Intent Model types.
 *
 * All output models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *   analysisOnly: true
 *   nonExecutable: true
 *
 * IMPORTANT: StrategyIntent is NOT a real trade intent.
 * It is an internal analysis model only.
 * It must never create real trade intents, execution plans, orders,
 * paper trades, live data access, or any actionable output.
 */

// ─── Capabilities ────────────────────────────────────────────────────────────

/** All unsafe capability flags are permanently false. */
export interface StrategyIntentCapabilities {
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
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
}

// ─── Strategy family ─────────────────────────────────────────────────────────

/**
 * Safe strategy family classification for fixture-only analysis review.
 * These are NOT trade signals, NOT recommendations, NOT actionable decisions.
 * They are evidence-classification labels for human review only.
 */
export type StrategyFamily =
  | 'defensive_new_launch_filter'
  | 'creator_leaderboard_review'
  | 'wallet_cluster_review'
  | 'manipulation_avoidance_review'
  | 'replay_regression_review'
  | 'insufficient_evidence_review'
  | 'fixture_only_review';

// ─── Evidence quality ─────────────────────────────────────────────────────────

/** Quality assessment of fixture-only evidence. */
export type StrategyEvidenceQuality =
  | 'strong_fixture_evidence'
  | 'moderate_fixture_evidence'
  | 'weak_fixture_evidence'
  | 'degraded_fixture_evidence'
  | 'failed_fixture_evidence'
  | 'inconclusive_fixture_evidence';

// ─── Classification ───────────────────────────────────────────────────────────

/**
 * Non-actionable analysis classification of a strategy intent.
 * These values are analysis-only labels — NOT recommendations to act.
 */
export type StrategyIntentClassification =
  | 'reject'
  | 'watch_only'
  | 'analysis_only'
  | 'insufficient_evidence'
  | 'fixture_only';

// ─── Severity ─────────────────────────────────────────────────────────────────

/** Analysis-only severity levels. No action-oriented names. */
export type StrategyIntentSeverity = 'info' | 'warning' | 'risk' | 'failure' | 'inconclusive';

// ─── Safety gate status ───────────────────────────────────────────────────────

export type StrategySafetyGateStatus = 'passed' | 'blocked' | 'warning' | 'inconclusive';

// ─── Safety gate ─────────────────────────────────────────────────────────────

/** Analysis-only safety gate. No gate may create side effects. */
export interface StrategySafetyGate {
  readonly gateId: string;
  readonly gateName: string;
  readonly status: StrategySafetyGateStatus;
  readonly reason: string;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly safeToDisplay: true;
}

// ─── Rationale ────────────────────────────────────────────────────────────────

/** Non-actionable rationale for a strategy intent. */
export interface StrategyIntentRationale {
  readonly summary: string;
  readonly evidenceNotes: readonly string[];
  readonly safetyNotes: readonly string[];
  readonly limitationNotes: readonly string[];
  readonly reviewNotes: readonly string[];
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
}

// ─── Finding ─────────────────────────────────────────────────────────────────

/** A single analysis finding within a strategy intent. */
export interface StrategyIntentFinding {
  readonly severity: StrategyIntentSeverity;
  readonly code: string;
  readonly message: string;
  readonly safeToDisplay: true;
}

// ─── Source kind ─────────────────────────────────────────────────────────────

/** Identifies what kind of fixture source was used to build the intent. */
export type StrategyIntentSourceKind =
  | 'replay_run'
  | 'replay_run_report'
  | 'replay_comparison'
  | 'replay_comparison_report'
  | 'combined'
  | 'fixture_only';

// ─── StrategyIntent ───────────────────────────────────────────────────────────

/**
 * The core analysis model.
 *
 * IMPORTANT SAFETY NOTE:
 * This is NOT a real trade intent. It is an internal, fixture-only,
 * analysis-only, non-executable model for human review.
 * It must never be used to place trades, construct transactions,
 * or enable any form of execution.
 */
export interface StrategyIntent {
  readonly id: string;
  readonly strategyFamily: StrategyFamily;
  readonly classification: StrategyIntentClassification;
  readonly evidenceQuality: StrategyEvidenceQuality;
  readonly confidence: number;
  readonly safetyGates: readonly StrategySafetyGate[];
  readonly rationale: StrategyIntentRationale;
  readonly findings: readonly StrategyIntentFinding[];
  readonly sourceKind: StrategyIntentSourceKind;
  readonly sourceId: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
}

// ─── Input ────────────────────────────────────────────────────────────────────

/** Input for building a StrategyIntent. All data must be fixture-only. */
export interface StrategyIntentInput {
  readonly sourceKind: StrategyIntentSourceKind;
  readonly sourceId: string;
  readonly finalVerdict?: string;
  readonly finalRiskScore?: number;
  readonly averageConfidence?: number;
  readonly scenarioId?: string;
  readonly regression?: boolean;
  readonly verdictChanged?: boolean;
  readonly scoreDelta?: number;
  readonly warningCount?: number;
  readonly failureCount?: number;
  readonly degradedCount?: number;
  readonly inconclusiveCount?: number;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

// ─── Fixture ─────────────────────────────────────────────────────────────────

/** A named, deterministic StrategyIntent fixture for test/review use. */
export interface StrategyIntentFixture {
  readonly fixtureId: string;
  readonly displayName: string;
  readonly description: string;
  readonly intent: StrategyIntent;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type StrategyIntentErrorCode =
  | 'INVALID_STRATEGY_INTENT_INPUT'
  | 'INVALID_STRATEGY_INTENT'
  | 'UNSAFE_STRATEGY_INTENT_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'ANALYSIS_ONLY_REQUIRED'
  | 'NON_EXECUTABLE_REQUIRED'
  | 'SAFE_TO_DISPLAY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'STRATEGY_INTENT_FIXTURE_ONLY';
