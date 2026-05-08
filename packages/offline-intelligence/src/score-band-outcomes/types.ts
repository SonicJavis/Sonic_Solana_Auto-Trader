/**
 * Phase 37 — Score Band Outcome Analysis Models v1: types.
 *
 * Local-only, synthetic-only, deterministic typed models that group Phase 36 synthetic
 * replay outcome fixtures into deterministic score bands for future strategy analysis.
 *
 * This layer is fixture-backed only and does not inspect live data, perform real scoring,
 * run replay/backtests, execute trades, access wallets, or contact any external sources.
 */

import type { ReplayOutcomeFixtureName, ReplayOutcomeFixtureKind } from '../replay-outcomes/types.js';

export const PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_37_SCORE_BAND_OUTCOMES_SOURCE =
  'phase37_score_band_outcome_analysis_models_v1';

export const SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES = [
  'low-score-safe-skip',
  'low-score-false-negative',
  'medium-score-watchlist-flat',
  'medium-score-mixed-outcome',
  'high-score-positive-outcome',
  'high-score-false-positive',
  'manipulation-risk-avoidance',
  'creator-risk-avoidance',
  'wallet-risk-avoidance',
  'insufficient-data',
  'missed-opportunity',
  'drawdown-contained',
  'no-action-safety',
  'malformed-input-safe',
  'dashboard-ready-score-band',
  'report-ready-score-band',
] as const;

export type ScoreBandOutcomeAnalysisFixtureName =
  (typeof SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES)[number];

export const SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS = [
  'low-score-safe-skip',
  'low-score-false-negative',
  'medium-score-watchlist-flat',
  'medium-score-mixed-outcome',
  'high-score-positive-outcome',
  'high-score-false-positive',
  'manipulation-risk-avoidance',
  'creator-risk-avoidance',
  'wallet-risk-avoidance',
  'insufficient-data',
  'missed-opportunity',
  'drawdown-contained',
  'no-action-safety',
  'malformed-input-safe',
  'dashboard-ready',
  'report-ready',
] as const;

export type ScoreBandOutcomeAnalysisFixtureKind =
  (typeof SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS)[number];

/**
 * Synthetic score band range categories.
 * These represent purely illustrative band labels for grouping synthetic replay outcomes.
 * They do not represent real trading scores, rankings, or strategy signals.
 */
export const SCORE_BAND_RANGE_CATEGORIES = [
  'low',
  'medium',
  'high',
  'unknown',
] as const;

export type ScoreBandCategory = (typeof SCORE_BAND_RANGE_CATEGORIES)[number];

export interface ScoreBandRange {
  /** Illustrative synthetic lower bound label. Not a real score. */
  readonly lowerLabel: string;
  /** Illustrative synthetic upper bound label. Not a real score. */
  readonly upperLabel: string;
  /** Descriptive category for this synthetic band. */
  readonly category: ScoreBandCategory;
  readonly notes: readonly string[];
}

export interface ScoreBandOutcomeReference {
  readonly replayOutcomeFixtureName: ReplayOutcomeFixtureName;
  readonly replayOutcomeFixtureKind: ReplayOutcomeFixtureKind;
  readonly scoreBandCategory: ScoreBandCategory;
  readonly notes: readonly string[];
}

export interface ScoreBandRiskIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high' | 'critical';
  readonly category: 'score-band' | 'creator' | 'wallet-cluster' | 'manipulation' | 'composite' | 'outcome';
  readonly rationale: string;
}

export interface ScoreBandQualityIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high';
  readonly category: 'score-band' | 'creator' | 'wallet-cluster' | 'manipulation' | 'composite' | 'outcome';
  readonly rationale: string;
}

export interface ScoreBandConfidenceIndicator {
  readonly code: string;
  readonly label: string;
  readonly confidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly referenceCount: number;
  readonly rationale: string;
}

export interface ScoreBandOutcomeDistribution {
  /**
   * Count of synthetic replay outcomes mapped to this band.
   * A synthetic-only label; does not represent real strategy backtest results.
   */
  readonly syntheticOutcomeCount: number;
  readonly positiveOutcomeCount: number;
  readonly flatOutcomeCount: number;
  readonly riskAvoidedCount: number;
  readonly skippedCount: number;
  readonly missedOpportunityCount: number;
  readonly containedCount: number;
  readonly noActionCount: number;
  readonly notes: readonly string[];
}

export interface ScoreBandOutcomeSummary {
  readonly phase: 37;
  readonly name: ScoreBandOutcomeAnalysisFixtureName;
  readonly kind: ScoreBandOutcomeAnalysisFixtureKind;
  readonly scoreBandCategory: ScoreBandCategory;
  readonly dominantOutcomeCategory:
    | 'positive'
    | 'flat'
    | 'risk-avoided'
    | 'skipped'
    | 'missed-opportunity'
    | 'drawdown-contained'
    | 'safety-no-action'
    | 'mixed';
  readonly overallRiskBand: 'low' | 'moderate' | 'elevated' | 'high' | 'critical' | 'unknown';
  readonly overallQualityBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly overallConfidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly riskCount: number;
  readonly qualityCount: number;
  readonly confidenceCount: number;
  readonly topRiskCodes: readonly string[];
  readonly topQualityCodes: readonly string[];
  readonly referencedReplayOutcomeFixtureName: ReplayOutcomeFixtureName;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly liveData: false;
  readonly realScoring: false;
  readonly realBacktesting: false;
  readonly paperTrading: false;
  readonly liveTrading: false;
  readonly execution: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly safeToDisplay: true;
  readonly generatedAt: string;
  readonly notes: readonly string[];
}

export interface ScoreBandOutcomeFixtureMeta {
  readonly phase: 37;
  readonly generatedAt: string;
  readonly source: typeof PHASE_37_SCORE_BAND_OUTCOMES_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly inMemoryOnly: true;
  readonly liveData: false;
  readonly realScoring: false;
  readonly realBacktesting: false;
  readonly paperTrading: false;
  readonly liveTrading: false;
  readonly execution: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly fileExport: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly notes: readonly string[];
}

export interface ScoreBandOutcomeAnalysisFixture {
  readonly name: ScoreBandOutcomeAnalysisFixtureName;
  readonly kind: ScoreBandOutcomeAnalysisFixtureKind;
  readonly scoreBandRange: ScoreBandRange;
  readonly outcomeReference: ScoreBandOutcomeReference;
  readonly riskIndicators: readonly ScoreBandRiskIndicator[];
  readonly qualityIndicators: readonly ScoreBandQualityIndicator[];
  readonly confidenceIndicators: readonly ScoreBandConfidenceIndicator[];
  readonly outcomeDistribution: ScoreBandOutcomeDistribution;
  readonly summary: ScoreBandOutcomeSummary;
  readonly safeNotes: readonly string[];
  readonly meta: ScoreBandOutcomeFixtureMeta;
}

export interface ScoreBandOutcomeValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ScoreBandOutcomeValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ScoreBandOutcomeValidationIssue[];
}

export interface ScoreBandOutcomeSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface ScoreBandOutcomeBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly scoreBandRange: ScoreBandRange;
  readonly outcomeReference: ScoreBandOutcomeReference;
  readonly riskIndicators?: readonly ScoreBandRiskIndicator[] | null;
  readonly qualityIndicators?: readonly ScoreBandQualityIndicator[] | null;
  readonly confidenceIndicators?: readonly ScoreBandConfidenceIndicator[] | null;
  readonly outcomeDistribution?: ScoreBandOutcomeDistribution | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface ScoreBandOutcomeBuildResult {
  readonly success: boolean;
  readonly fixture: ScoreBandOutcomeAnalysisFixture | null;
  readonly validation: ScoreBandOutcomeValidationResult;
  readonly safety: ScoreBandOutcomeSafetyResult;
}

export interface ScoreBandOutcomeFixtureCapabilities {
  readonly scoreBandOutcomeAnalysisFixtures: true;
  readonly syntheticScoreBandOutcomes: true;
  readonly scoreBandOutcomeBuilders: true;
  readonly scoreBandOutcomeSafetyValidation: true;
  readonly scoreBandReplayOutcomeReferences: true;
  readonly scoreBandRealScoring: false;
  readonly scoreBandRealBacktesting: false;
  readonly scoreBandPaperTrading: false;
  readonly scoreBandLiveTrading: false;
  readonly scoreBandExecution: false;
  readonly scoreBandSolanaRpc: false;
  readonly scoreBandExternalNetwork: false;
  readonly scoreBandPersistence: false;
  readonly scoreBandFileExport: false;
  readonly scoreBandInvestmentAdvice: false;
  readonly scoreBandTradingSignals: false;
}
