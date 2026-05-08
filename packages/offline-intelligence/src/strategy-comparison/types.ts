/**
 * Phase 39 — Strategy Comparison Matrix Fixtures v1: types.
 *
 * Local-only, synthetic-only, deterministic fixture-backed strategy comparison
 * matrix models referencing Phase 38 strategy candidate evaluation fixtures.
 *
 * Safety: no live data, no real scoring/ranking, no recommendations/signals,
 * no execution/wallet logic, no external network, no persistence, no file export.
 */

import type {
  StrategyCandidateEvaluationFixtureKind,
  StrategyCandidateEvaluationFixtureName,
} from '../strategy-candidates/types.js';

export const PHASE_39_STRATEGY_COMPARISON_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_39_STRATEGY_COMPARISON_SOURCE =
  'phase39_strategy_comparison_matrix_fixtures_v1';

export const STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES = [
  'defensive-vs-aggressive-matrix',
  'creator-led-candidate-matrix',
  'wallet-led-candidate-matrix',
  'manipulation-avoidance-matrix',
  'no-action-safety-matrix',
  'insufficient-data-matrix',
  'high-score-positive-comparison-matrix',
  'high-score-false-positive-comparison-matrix',
  'missed-opportunity-comparison-matrix',
  'drawdown-contained-comparison-matrix',
  'mixed-signal-watchlist-matrix',
  'false-positive-protection-matrix',
  'malformed-input-safe-matrix',
  'dashboard-ready-comparison-matrix',
  'report-ready-comparison-matrix',
  'safety-boundary-comparison-matrix',
] as const;

export type StrategyComparisonMatrixFixtureName =
  (typeof STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES)[number];

export const STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS = [
  'defensive-vs-aggressive',
  'creator-led-candidate',
  'wallet-led-candidate',
  'manipulation-avoidance',
  'no-action-safety',
  'insufficient-data',
  'high-score-positive-comparison',
  'high-score-false-positive-comparison',
  'missed-opportunity-comparison',
  'drawdown-contained-comparison',
  'mixed-signal-watchlist',
  'false-positive-protection',
  'malformed-input-safe',
  'dashboard-ready-comparison',
  'report-ready-comparison',
  'safety-boundary-comparison',
] as const;

export type StrategyComparisonMatrixFixtureKind =
  (typeof STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS)[number];

export const STRATEGY_COMPARISON_CRITERION_CODES = [
  'synthetic-risk',
  'quality',
  'confidence',
  'evidence-coverage',
  'false-positive-protection',
  'no-action-safety',
  'overall-safety-posture',
] as const;

export type StrategyComparisonCriterionCode =
  (typeof STRATEGY_COMPARISON_CRITERION_CODES)[number];

/**
 * Reference to a Phase 38 strategy candidate fixture.
 */
export interface StrategyComparisonCandidateReference {
  readonly candidateFixtureName: StrategyCandidateEvaluationFixtureName;
  readonly candidateFixtureKind: StrategyCandidateEvaluationFixtureKind;
  readonly candidateId: string;
  readonly candidateTitle: string;
  readonly candidateFamily:
    | 'defensive'
    | 'creator-pattern'
    | 'wallet-pattern'
    | 'structure-pattern'
    | 'safety-boundary'
    | 'presentation-ready';
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

/**
 * A comparison criterion used in the matrix.
 */
export interface StrategyComparisonCriterion {
  readonly code: StrategyComparisonCriterionCode;
  readonly label: string;
  readonly description: string;
  readonly dimension:
    | 'risk-control'
    | 'quality-check'
    | 'confidence-check'
    | 'safety-boundary'
    | 'data-sufficiency';
  readonly notes: readonly string[];
}

/**
 * A single cell in the comparison matrix (one candidate × one criterion).
 */
export interface StrategyComparisonMatrixCell {
  readonly candidateFixtureName: StrategyCandidateEvaluationFixtureName;
  readonly criterionCode: StrategyComparisonCriterionCode;
  readonly syntheticScore: number; // 0–100, synthetic only
  readonly band: 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
  readonly rationale: string;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
}

/**
 * A row in the comparison matrix (one candidate, all criteria cells).
 */
export interface StrategyComparisonMatrixRow {
  readonly candidateReference: StrategyComparisonCandidateReference;
  readonly cells: readonly StrategyComparisonMatrixCell[];
  readonly rowSyntheticOverallScore: number; // 0–100, synthetic only
  readonly rowOverallBand: 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
  readonly rowNotes: readonly string[];
}

/**
 * A column in the comparison matrix (one criterion, all candidate values).
 */
export interface StrategyComparisonMatrixColumn {
  readonly criterion: StrategyComparisonCriterion;
  readonly cells: readonly StrategyComparisonMatrixCell[];
  readonly columnNotes: readonly string[];
}

/**
 * Summary of the full comparison matrix.
 */
export interface StrategyComparisonMatrixSummary {
  readonly phase: 39;
  readonly name: StrategyComparisonMatrixFixtureName;
  readonly kind: StrategyComparisonMatrixFixtureKind;
  readonly candidateCount: number;
  readonly criterionCount: number;
  readonly cellCount: number;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly syntheticMinScore: number;
  readonly syntheticMaxScore: number;
  readonly syntheticMeanScore: number;
  readonly bandDistribution: Readonly<Record<string, number>>;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly liveData: false;
  readonly realScoring: false;
  readonly realRanking: false;
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

/**
 * Safety boundary declaration for a comparison matrix fixture.
 */
export interface StrategyComparisonSafetyBoundary {
  readonly noRealScoring: true;
  readonly noRealRanking: true;
  readonly noRealReplay: true;
  readonly noRealBacktesting: true;
  readonly noPaperTrading: true;
  readonly noLiveTrading: true;
  readonly noExecution: true;
  readonly noSolanaRpc: true;
  readonly noExternalNetwork: true;
  readonly noPersistence: true;
  readonly noFileExport: true;
  readonly noWalletAccess: true;
  readonly noPrivateKeys: true;
  readonly noInvestmentAdvice: true;
  readonly noTradingSignals: true;
  readonly noRecommendations: true;
  readonly noRealWalletAddresses: true;
  readonly noRealTransactionHashes: true;
  readonly noPersonalData: true;
  readonly deterministic: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly notes: readonly string[];
}

/**
 * Metadata for a comparison matrix fixture.
 */
export interface StrategyComparisonMatrixFixtureMeta {
  readonly phase: 39;
  readonly generatedAt: string;
  readonly source: typeof PHASE_39_STRATEGY_COMPARISON_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly inMemoryOnly: true;
  readonly liveData: false;
  readonly realScoring: false;
  readonly realRanking: false;
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

/**
 * A full strategy comparison matrix fixture.
 */
export interface StrategyComparisonMatrixFixture {
  readonly name: StrategyComparisonMatrixFixtureName;
  readonly kind: StrategyComparisonMatrixFixtureKind;
  readonly title: string;
  readonly description: string;
  readonly candidateReferences: readonly StrategyComparisonCandidateReference[];
  readonly criteria: readonly StrategyComparisonCriterion[];
  readonly rows: readonly StrategyComparisonMatrixRow[];
  readonly columns: readonly StrategyComparisonMatrixColumn[];
  readonly summary: StrategyComparisonMatrixSummary;
  readonly safetyBoundary: StrategyComparisonSafetyBoundary;
  readonly safeNotes: readonly string[];
  readonly meta: StrategyComparisonMatrixFixtureMeta;
}

/**
 * Validation issue for a comparison matrix fixture.
 */
export interface StrategyComparisonValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

/**
 * Validation result for a comparison matrix fixture.
 */
export interface StrategyComparisonValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyComparisonValidationIssue[];
}

/**
 * Safety validation result for a comparison matrix fixture.
 */
export interface StrategyComparisonSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

/**
 * Input for building a comparison matrix fixture.
 */
export interface StrategyComparisonBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly title: string;
  readonly description: string;
  readonly candidateReferences: readonly StrategyComparisonCandidateReference[];
  readonly criteria?: readonly StrategyComparisonCriterion[] | null;
  readonly cells?: readonly StrategyComparisonMatrixCell[] | null;
  readonly safeNotes?: readonly string[] | null;
}

/**
 * Result of building a comparison matrix fixture.
 */
export interface StrategyComparisonBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyComparisonMatrixFixture | null;
  readonly validation: StrategyComparisonValidationResult;
  readonly safety: StrategyComparisonSafetyResult;
}

/**
 * Phase 39 capability flags for strategy comparison matrix fixtures.
 */
export interface StrategyComparisonMatrixFixtureCapabilities {
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
}
