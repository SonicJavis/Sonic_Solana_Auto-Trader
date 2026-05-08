/**
 * Phase 39 — Strategy Comparison Matrix Fixtures v1: deterministic fixtures.
 *
 * All 16 required synthetic strategy comparison matrix fixtures.
 * References Phase 38 strategy candidate evaluation fixtures by name/kind.
 *
 * Safety: synthetic-only, deterministic, local-only, no real scoring/ranking,
 * no execution, no real PnL, no external network, no recommendations.
 */

import { buildStrategyComparisonMatrixFixture } from './builders.js';
import type {
  StrategyComparisonBuildInput,
  StrategyComparisonCandidateReference,
  StrategyComparisonCriterion,
  StrategyComparisonMatrixCell,
  StrategyComparisonMatrixFixture,
  StrategyComparisonMatrixFixtureName,
} from './types.js';
import type {
  StrategyCandidateEvaluationFixtureKind,
  StrategyCandidateEvaluationFixtureName,
} from '../strategy-candidates/types.js';

function ref(
  candidateFixtureName: StrategyCandidateEvaluationFixtureName,
  candidateFixtureKind: StrategyCandidateEvaluationFixtureKind,
  candidateId: string,
  candidateTitle: string,
  candidateFamily: StrategyComparisonCandidateReference['candidateFamily'],
  notes: readonly string[],
): StrategyComparisonCandidateReference {
  return {
    candidateFixtureName,
    candidateFixtureKind,
    candidateId,
    candidateTitle,
    candidateFamily,
    fixtureOnly: true,
    syntheticOnly: true,
    notes,
  };
}

function criterion(
  code: StrategyComparisonCriterion['code'],
  label: string,
  description: string,
  dimension: StrategyComparisonCriterion['dimension'],
  notes: readonly string[],
): StrategyComparisonCriterion {
  return { code, label, description, dimension, notes };
}

function cell(
  candidateFixtureName: StrategyCandidateEvaluationFixtureName,
  criterionCode: StrategyComparisonMatrixCell['criterionCode'],
  syntheticScore: number,
  band: StrategyComparisonMatrixCell['band'],
  rationale: string,
): StrategyComparisonMatrixCell {
  return {
    candidateFixtureName,
    criterionCode,
    syntheticScore,
    band,
    rationale,
    fixtureOnly: true,
    syntheticOnly: true,
  };
}

function fixture(input: StrategyComparisonBuildInput): StrategyComparisonMatrixFixture {
  const result = buildStrategyComparisonMatrixFixture(input);
  if (!result.success || result.fixture === null) {
    const issues = result.validation.issues.map(i => `${i.code}: ${i.message}`).join('; ');
    throw new Error(`Phase 39 fixture build failed for "${input.name}": ${issues}`);
  }
  return result.fixture;
}

const STANDARD_CRITERIA: readonly StrategyComparisonCriterion[] = [
  criterion('synthetic-risk', 'Synthetic Risk', 'Synthetic risk assessment for offline comparison.', 'risk-control', ['Synthetic only.']),
  criterion('quality', 'Quality', 'Synthetic quality assessment for offline comparison.', 'quality-check', ['Synthetic only.']),
  criterion('confidence', 'Confidence', 'Synthetic confidence assessment for offline comparison.', 'confidence-check', ['Synthetic only.']),
  criterion('evidence-coverage', 'Evidence Coverage', 'Synthetic evidence coverage for offline comparison.', 'data-sufficiency', ['Synthetic only.']),
  criterion('false-positive-protection', 'False-Positive Protection', 'Synthetic false-positive protection assessment.', 'safety-boundary', ['Synthetic only.']),
  criterion('no-action-safety', 'No-Action Safety', 'Synthetic no-action safety posture.', 'safety-boundary', ['Synthetic only.']),
  criterion('overall-safety-posture', 'Overall Safety Posture', 'Synthetic overall safety posture assessment.', 'safety-boundary', ['Synthetic only.']),
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. defensive-vs-aggressive-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'defensive-vs-aggressive-matrix',
  kind: 'defensive-vs-aggressive',
  title: 'Defensive vs. Aggressive Strategy Comparison Matrix',
  description:
    'Synthetic offline comparison of a defensive-new-launch candidate against an aggressive wallet-leader-copy candidate across safety criteria. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'defensive-new-launch-candidate',
      'defensive-new-launch',
      'cand-def-001',
      'Defensive New Launch',
      'defensive',
      ['Phase 38 defensive strategy candidate reference.'],
    ),
    ref(
      'wallet-leader-copy-candidate',
      'wallet-leader-copy',
      'cand-wlc-001',
      'Wallet Leader Copy',
      'wallet-pattern',
      ['Phase 38 wallet-pattern strategy candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('defensive-new-launch-candidate', 'synthetic-risk', 80, 'high', 'Defensive candidate has high synthetic risk control.'),
    cell('defensive-new-launch-candidate', 'quality', 75, 'high', 'Defensive candidate has high synthetic quality.'),
    cell('defensive-new-launch-candidate', 'confidence', 70, 'moderate', 'Defensive candidate has moderate synthetic confidence.'),
    cell('defensive-new-launch-candidate', 'evidence-coverage', 65, 'moderate', 'Defensive candidate has moderate evidence coverage.'),
    cell('defensive-new-launch-candidate', 'false-positive-protection', 85, 'high', 'Defensive candidate excels at false-positive protection.'),
    cell('defensive-new-launch-candidate', 'no-action-safety', 90, 'high', 'Defensive candidate prioritizes no-action safety.'),
    cell('defensive-new-launch-candidate', 'overall-safety-posture', 80, 'high', 'Defensive candidate has high overall safety posture.'),
    cell('wallet-leader-copy-candidate', 'synthetic-risk', 45, 'moderate', 'Wallet-copy candidate has moderate synthetic risk.'),
    cell('wallet-leader-copy-candidate', 'quality', 55, 'moderate', 'Wallet-copy candidate has moderate synthetic quality.'),
    cell('wallet-leader-copy-candidate', 'confidence', 50, 'moderate', 'Wallet-copy candidate has moderate synthetic confidence.'),
    cell('wallet-leader-copy-candidate', 'evidence-coverage', 60, 'moderate', 'Wallet-copy candidate has moderate evidence coverage.'),
    cell('wallet-leader-copy-candidate', 'false-positive-protection', 40, 'low', 'Wallet-copy candidate has lower false-positive protection.'),
    cell('wallet-leader-copy-candidate', 'no-action-safety', 35, 'low', 'Wallet-copy candidate has lower no-action safety.'),
    cell('wallet-leader-copy-candidate', 'overall-safety-posture', 45, 'moderate', 'Wallet-copy candidate has moderate overall safety posture.'),
  ],
  safeNotes: ['Synthetic defensive-vs-aggressive comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. creator-led-candidate-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const CREATOR_LED_CANDIDATE_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'creator-led-candidate-matrix',
  kind: 'creator-led-candidate',
  title: 'Creator-Led Strategy Candidate Comparison Matrix',
  description:
    'Synthetic offline comparison of creator-leaderboard and post-bundle-dip candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'creator-leaderboard-candidate',
      'creator-leaderboard',
      'cand-cl-001',
      'Creator Leaderboard Candidate',
      'creator-pattern',
      ['Phase 38 creator-pattern strategy candidate reference.'],
    ),
    ref(
      'post-bundle-dip-candidate',
      'post-bundle-dip',
      'cand-pbd-001',
      'Post-Bundle Dip Candidate',
      'structure-pattern',
      ['Phase 38 structure-pattern strategy candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('creator-leaderboard-candidate', 'synthetic-risk', 60, 'moderate', 'Creator candidate has moderate synthetic risk.'),
    cell('creator-leaderboard-candidate', 'quality', 70, 'moderate', 'Creator candidate has moderate synthetic quality.'),
    cell('creator-leaderboard-candidate', 'confidence', 65, 'moderate', 'Creator candidate has moderate synthetic confidence.'),
    cell('creator-leaderboard-candidate', 'evidence-coverage', 75, 'high', 'Creator candidate has high evidence coverage.'),
    cell('creator-leaderboard-candidate', 'false-positive-protection', 55, 'moderate', 'Creator candidate has moderate false-positive protection.'),
    cell('creator-leaderboard-candidate', 'no-action-safety', 60, 'moderate', 'Creator candidate has moderate no-action safety.'),
    cell('creator-leaderboard-candidate', 'overall-safety-posture', 65, 'moderate', 'Creator candidate has moderate overall safety posture.'),
    cell('post-bundle-dip-candidate', 'synthetic-risk', 50, 'moderate', 'Post-bundle-dip candidate has moderate synthetic risk.'),
    cell('post-bundle-dip-candidate', 'quality', 55, 'moderate', 'Post-bundle-dip candidate has moderate synthetic quality.'),
    cell('post-bundle-dip-candidate', 'confidence', 45, 'moderate', 'Post-bundle-dip candidate has moderate synthetic confidence.'),
    cell('post-bundle-dip-candidate', 'evidence-coverage', 50, 'moderate', 'Post-bundle-dip candidate has moderate evidence coverage.'),
    cell('post-bundle-dip-candidate', 'false-positive-protection', 60, 'moderate', 'Post-bundle-dip candidate has moderate false-positive protection.'),
    cell('post-bundle-dip-candidate', 'no-action-safety', 55, 'moderate', 'Post-bundle-dip candidate has moderate no-action safety.'),
    cell('post-bundle-dip-candidate', 'overall-safety-posture', 55, 'moderate', 'Post-bundle-dip candidate has moderate overall safety posture.'),
  ],
  safeNotes: ['Synthetic creator-led comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. wallet-led-candidate-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const WALLET_LED_CANDIDATE_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'wallet-led-candidate-matrix',
  kind: 'wallet-led-candidate',
  title: 'Wallet-Led Strategy Candidate Comparison Matrix',
  description:
    'Synthetic offline comparison of wallet-leader-copy and drawdown-contained candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'wallet-leader-copy-candidate',
      'wallet-leader-copy',
      'cand-wlc-002',
      'Wallet Leader Copy',
      'wallet-pattern',
      ['Phase 38 wallet-pattern candidate reference.'],
    ),
    ref(
      'drawdown-contained-candidate',
      'drawdown-contained',
      'cand-ddc-001',
      'Drawdown Contained Candidate',
      'defensive',
      ['Phase 38 defensive candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('wallet-leader-copy-candidate', 'synthetic-risk', 50, 'moderate', 'Wallet-copy candidate has moderate synthetic risk.'),
    cell('wallet-leader-copy-candidate', 'quality', 55, 'moderate', 'Wallet-copy candidate has moderate quality.'),
    cell('wallet-leader-copy-candidate', 'confidence', 60, 'moderate', 'Wallet-copy candidate has moderate confidence.'),
    cell('wallet-leader-copy-candidate', 'evidence-coverage', 65, 'moderate', 'Wallet-copy candidate has moderate evidence coverage.'),
    cell('wallet-leader-copy-candidate', 'false-positive-protection', 45, 'moderate', 'Wallet-copy candidate has moderate FP protection.'),
    cell('wallet-leader-copy-candidate', 'no-action-safety', 40, 'low', 'Wallet-copy candidate has lower no-action safety.'),
    cell('wallet-leader-copy-candidate', 'overall-safety-posture', 50, 'moderate', 'Wallet-copy candidate has moderate safety posture.'),
    cell('drawdown-contained-candidate', 'synthetic-risk', 75, 'high', 'Drawdown-contained candidate has high risk control.'),
    cell('drawdown-contained-candidate', 'quality', 70, 'moderate', 'Drawdown-contained candidate has moderate quality.'),
    cell('drawdown-contained-candidate', 'confidence', 65, 'moderate', 'Drawdown-contained candidate has moderate confidence.'),
    cell('drawdown-contained-candidate', 'evidence-coverage', 60, 'moderate', 'Drawdown-contained candidate has moderate evidence coverage.'),
    cell('drawdown-contained-candidate', 'false-positive-protection', 80, 'high', 'Drawdown-contained candidate has high FP protection.'),
    cell('drawdown-contained-candidate', 'no-action-safety', 85, 'high', 'Drawdown-contained candidate has high no-action safety.'),
    cell('drawdown-contained-candidate', 'overall-safety-posture', 75, 'high', 'Drawdown-contained candidate has high safety posture.'),
  ],
  safeNotes: ['Synthetic wallet-led comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. manipulation-avoidance-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const MANIPULATION_AVOIDANCE_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'manipulation-avoidance-matrix',
  kind: 'manipulation-avoidance',
  title: 'Manipulation Avoidance Comparison Matrix',
  description:
    'Synthetic offline comparison of manipulation-avoidance and high-score-false-positive candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'manipulation-avoidance-candidate',
      'manipulation-avoidance',
      'cand-ma-001',
      'Manipulation Avoidance Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'high-score-false-positive-candidate',
      'high-score-false-positive',
      'cand-hsfp-001',
      'High-Score False-Positive Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('manipulation-avoidance-candidate', 'synthetic-risk', 85, 'high', 'Manipulation-avoidance candidate has high risk control.'),
    cell('manipulation-avoidance-candidate', 'quality', 80, 'high', 'Manipulation-avoidance candidate has high quality.'),
    cell('manipulation-avoidance-candidate', 'confidence', 75, 'high', 'Manipulation-avoidance candidate has high confidence.'),
    cell('manipulation-avoidance-candidate', 'evidence-coverage', 80, 'high', 'Manipulation-avoidance candidate has high evidence coverage.'),
    cell('manipulation-avoidance-candidate', 'false-positive-protection', 90, 'high', 'Manipulation-avoidance candidate has very high FP protection.'),
    cell('manipulation-avoidance-candidate', 'no-action-safety', 90, 'high', 'Manipulation-avoidance candidate has very high no-action safety.'),
    cell('manipulation-avoidance-candidate', 'overall-safety-posture', 85, 'high', 'Manipulation-avoidance candidate has high overall safety posture.'),
    cell('high-score-false-positive-candidate', 'synthetic-risk', 40, 'low', 'False-positive candidate has low risk control.'),
    cell('high-score-false-positive-candidate', 'quality', 35, 'low', 'False-positive candidate has low quality.'),
    cell('high-score-false-positive-candidate', 'confidence', 30, 'low', 'False-positive candidate has low confidence.'),
    cell('high-score-false-positive-candidate', 'evidence-coverage', 35, 'low', 'False-positive candidate has low evidence coverage.'),
    cell('high-score-false-positive-candidate', 'false-positive-protection', 25, 'low', 'False-positive candidate has very low FP protection.'),
    cell('high-score-false-positive-candidate', 'no-action-safety', 30, 'low', 'False-positive candidate has low no-action safety.'),
    cell('high-score-false-positive-candidate', 'overall-safety-posture', 30, 'low', 'False-positive candidate has low overall safety posture.'),
  ],
  safeNotes: ['Synthetic manipulation-avoidance comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. no-action-safety-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const NO_ACTION_SAFETY_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'no-action-safety-matrix',
  kind: 'no-action-safety',
  title: 'No-Action Safety Comparison Matrix',
  description:
    'Synthetic offline comparison of no-action-safety and insufficient-data candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'no-action-safety-candidate',
      'no-action-safety',
      'cand-nas-001',
      'No-Action Safety Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'insufficient-data-candidate',
      'insufficient-data',
      'cand-id-001',
      'Insufficient Data Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('no-action-safety-candidate', 'synthetic-risk', 90, 'high', 'No-action-safety candidate has very high risk control.'),
    cell('no-action-safety-candidate', 'quality', 70, 'moderate', 'No-action-safety candidate has moderate quality.'),
    cell('no-action-safety-candidate', 'confidence', 60, 'moderate', 'No-action-safety candidate has moderate confidence.'),
    cell('no-action-safety-candidate', 'evidence-coverage', 55, 'moderate', 'No-action-safety candidate has moderate evidence coverage.'),
    cell('no-action-safety-candidate', 'false-positive-protection', 85, 'high', 'No-action-safety candidate has high FP protection.'),
    cell('no-action-safety-candidate', 'no-action-safety', 95, 'high', 'No-action-safety candidate excels at no-action safety.'),
    cell('no-action-safety-candidate', 'overall-safety-posture', 85, 'high', 'No-action-safety candidate has high overall safety posture.'),
    cell('insufficient-data-candidate', 'synthetic-risk', 70, 'moderate', 'Insufficient-data candidate has moderate risk control.'),
    cell('insufficient-data-candidate', 'quality', 30, 'low', 'Insufficient-data candidate has low quality.'),
    cell('insufficient-data-candidate', 'confidence', 25, 'low', 'Insufficient-data candidate has low confidence.'),
    cell('insufficient-data-candidate', 'evidence-coverage', 20, 'low', 'Insufficient-data candidate has low evidence coverage.'),
    cell('insufficient-data-candidate', 'false-positive-protection', 75, 'high', 'Insufficient-data candidate defaults to high FP protection.'),
    cell('insufficient-data-candidate', 'no-action-safety', 80, 'high', 'Insufficient-data candidate defaults to no-action safety.'),
    cell('insufficient-data-candidate', 'overall-safety-posture', 65, 'moderate', 'Insufficient-data candidate has moderate overall safety posture.'),
  ],
  safeNotes: ['Synthetic no-action-safety comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. insufficient-data-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const INSUFFICIENT_DATA_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'insufficient-data-matrix',
  kind: 'insufficient-data',
  title: 'Insufficient Data Comparison Matrix',
  description:
    'Synthetic offline comparison of insufficient-data and malformed-input-safe candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'insufficient-data-candidate',
      'insufficient-data',
      'cand-id-002',
      'Insufficient Data Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'malformed-input-safe-candidate',
      'malformed-input-safe',
      'cand-mis-001',
      'Malformed Input Safe Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('insufficient-data-candidate', 'synthetic-risk', 65, 'moderate', 'Insufficient-data candidate has moderate risk control.'),
    cell('insufficient-data-candidate', 'quality', 28, 'low', 'Insufficient-data candidate has low quality.'),
    cell('insufficient-data-candidate', 'confidence', 22, 'low', 'Insufficient-data candidate has low confidence.'),
    cell('insufficient-data-candidate', 'evidence-coverage', 18, 'low', 'Insufficient-data candidate has very low evidence coverage.'),
    cell('insufficient-data-candidate', 'false-positive-protection', 72, 'moderate', 'Insufficient-data candidate has moderate FP protection.'),
    cell('insufficient-data-candidate', 'no-action-safety', 78, 'high', 'Insufficient-data candidate has high no-action safety.'),
    cell('insufficient-data-candidate', 'overall-safety-posture', 60, 'moderate', 'Insufficient-data candidate has moderate safety posture.'),
    cell('malformed-input-safe-candidate', 'synthetic-risk', 75, 'high', 'Malformed-input-safe candidate has high risk control.'),
    cell('malformed-input-safe-candidate', 'quality', 50, 'moderate', 'Malformed-input-safe candidate has moderate quality.'),
    cell('malformed-input-safe-candidate', 'confidence', 45, 'moderate', 'Malformed-input-safe candidate has moderate confidence.'),
    cell('malformed-input-safe-candidate', 'evidence-coverage', 40, 'low', 'Malformed-input-safe candidate has low evidence coverage.'),
    cell('malformed-input-safe-candidate', 'false-positive-protection', 85, 'high', 'Malformed-input-safe candidate has high FP protection.'),
    cell('malformed-input-safe-candidate', 'no-action-safety', 90, 'high', 'Malformed-input-safe candidate has high no-action safety.'),
    cell('malformed-input-safe-candidate', 'overall-safety-posture', 72, 'moderate', 'Malformed-input-safe candidate has moderate safety posture.'),
  ],
  safeNotes: ['Synthetic insufficient-data comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. high-score-positive-comparison-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const HIGH_SCORE_POSITIVE_COMPARISON_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'high-score-positive-comparison-matrix',
  kind: 'high-score-positive-comparison',
  title: 'High-Score Positive Comparison Matrix',
  description:
    'Synthetic offline comparison of high-score-positive and creator-leaderboard candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'high-score-positive-candidate',
      'high-score-positive',
      'cand-hsp-001',
      'High-Score Positive Candidate',
      'structure-pattern',
      ['Phase 38 structure-pattern candidate reference.'],
    ),
    ref(
      'creator-leaderboard-candidate',
      'creator-leaderboard',
      'cand-cl-002',
      'Creator Leaderboard Candidate',
      'creator-pattern',
      ['Phase 38 creator-pattern candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('high-score-positive-candidate', 'synthetic-risk', 70, 'moderate', 'High-score-positive candidate has moderate risk control.'),
    cell('high-score-positive-candidate', 'quality', 80, 'high', 'High-score-positive candidate has high quality.'),
    cell('high-score-positive-candidate', 'confidence', 75, 'high', 'High-score-positive candidate has high confidence.'),
    cell('high-score-positive-candidate', 'evidence-coverage', 80, 'high', 'High-score-positive candidate has high evidence coverage.'),
    cell('high-score-positive-candidate', 'false-positive-protection', 65, 'moderate', 'High-score-positive candidate has moderate FP protection.'),
    cell('high-score-positive-candidate', 'no-action-safety', 60, 'moderate', 'High-score-positive candidate has moderate no-action safety.'),
    cell('high-score-positive-candidate', 'overall-safety-posture', 70, 'moderate', 'High-score-positive candidate has moderate overall safety posture.'),
    cell('creator-leaderboard-candidate', 'synthetic-risk', 60, 'moderate', 'Creator candidate has moderate risk control.'),
    cell('creator-leaderboard-candidate', 'quality', 70, 'moderate', 'Creator candidate has moderate quality.'),
    cell('creator-leaderboard-candidate', 'confidence', 65, 'moderate', 'Creator candidate has moderate confidence.'),
    cell('creator-leaderboard-candidate', 'evidence-coverage', 75, 'high', 'Creator candidate has high evidence coverage.'),
    cell('creator-leaderboard-candidate', 'false-positive-protection', 55, 'moderate', 'Creator candidate has moderate FP protection.'),
    cell('creator-leaderboard-candidate', 'no-action-safety', 60, 'moderate', 'Creator candidate has moderate no-action safety.'),
    cell('creator-leaderboard-candidate', 'overall-safety-posture', 65, 'moderate', 'Creator candidate has moderate overall safety posture.'),
  ],
  safeNotes: ['Synthetic high-score-positive comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. high-score-false-positive-comparison-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const HIGH_SCORE_FALSE_POSITIVE_COMPARISON_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'high-score-false-positive-comparison-matrix',
  kind: 'high-score-false-positive-comparison',
  title: 'High-Score False-Positive Comparison Matrix',
  description:
    'Synthetic offline comparison of high-score-false-positive and manipulation-avoidance candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'high-score-false-positive-candidate',
      'high-score-false-positive',
      'cand-hsfp-002',
      'High-Score False-Positive Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'manipulation-avoidance-candidate',
      'manipulation-avoidance',
      'cand-ma-002',
      'Manipulation Avoidance Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('high-score-false-positive-candidate', 'synthetic-risk', 30, 'low', 'False-positive candidate has low risk control.'),
    cell('high-score-false-positive-candidate', 'quality', 25, 'low', 'False-positive candidate has low quality.'),
    cell('high-score-false-positive-candidate', 'confidence', 20, 'low', 'False-positive candidate has low confidence.'),
    cell('high-score-false-positive-candidate', 'evidence-coverage', 25, 'low', 'False-positive candidate has low evidence coverage.'),
    cell('high-score-false-positive-candidate', 'false-positive-protection', 15, 'low', 'False-positive candidate has very low FP protection.'),
    cell('high-score-false-positive-candidate', 'no-action-safety', 25, 'low', 'False-positive candidate has low no-action safety.'),
    cell('high-score-false-positive-candidate', 'overall-safety-posture', 25, 'low', 'False-positive candidate has low overall safety posture.'),
    cell('manipulation-avoidance-candidate', 'synthetic-risk', 88, 'high', 'Manipulation-avoidance candidate has very high risk control.'),
    cell('manipulation-avoidance-candidate', 'quality', 82, 'high', 'Manipulation-avoidance candidate has high quality.'),
    cell('manipulation-avoidance-candidate', 'confidence', 78, 'high', 'Manipulation-avoidance candidate has high confidence.'),
    cell('manipulation-avoidance-candidate', 'evidence-coverage', 82, 'high', 'Manipulation-avoidance candidate has high evidence coverage.'),
    cell('manipulation-avoidance-candidate', 'false-positive-protection', 92, 'high', 'Manipulation-avoidance candidate has very high FP protection.'),
    cell('manipulation-avoidance-candidate', 'no-action-safety', 92, 'high', 'Manipulation-avoidance candidate has very high no-action safety.'),
    cell('manipulation-avoidance-candidate', 'overall-safety-posture', 88, 'high', 'Manipulation-avoidance candidate has very high safety posture.'),
  ],
  safeNotes: ['Synthetic high-score false-positive comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. missed-opportunity-comparison-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const MISSED_OPPORTUNITY_COMPARISON_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'missed-opportunity-comparison-matrix',
  kind: 'missed-opportunity-comparison',
  title: 'Missed Opportunity Comparison Matrix',
  description:
    'Synthetic offline comparison of missed-opportunity and no-action-safety candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'missed-opportunity-candidate',
      'missed-opportunity',
      'cand-mo-001',
      'Missed Opportunity Candidate',
      'structure-pattern',
      ['Phase 38 structure-pattern candidate reference.'],
    ),
    ref(
      'no-action-safety-candidate',
      'no-action-safety',
      'cand-nas-002',
      'No-Action Safety Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('missed-opportunity-candidate', 'synthetic-risk', 50, 'moderate', 'Missed-opportunity candidate has moderate risk control.'),
    cell('missed-opportunity-candidate', 'quality', 55, 'moderate', 'Missed-opportunity candidate has moderate quality.'),
    cell('missed-opportunity-candidate', 'confidence', 40, 'low', 'Missed-opportunity candidate has low confidence.'),
    cell('missed-opportunity-candidate', 'evidence-coverage', 45, 'moderate', 'Missed-opportunity candidate has moderate evidence coverage.'),
    cell('missed-opportunity-candidate', 'false-positive-protection', 60, 'moderate', 'Missed-opportunity candidate has moderate FP protection.'),
    cell('missed-opportunity-candidate', 'no-action-safety', 55, 'moderate', 'Missed-opportunity candidate has moderate no-action safety.'),
    cell('missed-opportunity-candidate', 'overall-safety-posture', 55, 'moderate', 'Missed-opportunity candidate has moderate overall safety posture.'),
    cell('no-action-safety-candidate', 'synthetic-risk', 88, 'high', 'No-action-safety candidate has high risk control.'),
    cell('no-action-safety-candidate', 'quality', 72, 'moderate', 'No-action-safety candidate has moderate quality.'),
    cell('no-action-safety-candidate', 'confidence', 62, 'moderate', 'No-action-safety candidate has moderate confidence.'),
    cell('no-action-safety-candidate', 'evidence-coverage', 57, 'moderate', 'No-action-safety candidate has moderate evidence coverage.'),
    cell('no-action-safety-candidate', 'false-positive-protection', 87, 'high', 'No-action-safety candidate has high FP protection.'),
    cell('no-action-safety-candidate', 'no-action-safety', 96, 'high', 'No-action-safety candidate excels at no-action safety.'),
    cell('no-action-safety-candidate', 'overall-safety-posture', 87, 'high', 'No-action-safety candidate has high overall safety posture.'),
  ],
  safeNotes: ['Synthetic missed-opportunity comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. drawdown-contained-comparison-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const DRAWDOWN_CONTAINED_COMPARISON_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'drawdown-contained-comparison-matrix',
  kind: 'drawdown-contained-comparison',
  title: 'Drawdown Contained Comparison Matrix',
  description:
    'Synthetic offline comparison of drawdown-contained and defensive-new-launch candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'drawdown-contained-candidate',
      'drawdown-contained',
      'cand-ddc-002',
      'Drawdown Contained Candidate',
      'defensive',
      ['Phase 38 defensive candidate reference.'],
    ),
    ref(
      'defensive-new-launch-candidate',
      'defensive-new-launch',
      'cand-def-002',
      'Defensive New Launch',
      'defensive',
      ['Phase 38 defensive candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('drawdown-contained-candidate', 'synthetic-risk', 78, 'high', 'Drawdown-contained candidate has high risk control.'),
    cell('drawdown-contained-candidate', 'quality', 72, 'moderate', 'Drawdown-contained candidate has moderate quality.'),
    cell('drawdown-contained-candidate', 'confidence', 68, 'moderate', 'Drawdown-contained candidate has moderate confidence.'),
    cell('drawdown-contained-candidate', 'evidence-coverage', 62, 'moderate', 'Drawdown-contained candidate has moderate evidence coverage.'),
    cell('drawdown-contained-candidate', 'false-positive-protection', 82, 'high', 'Drawdown-contained candidate has high FP protection.'),
    cell('drawdown-contained-candidate', 'no-action-safety', 87, 'high', 'Drawdown-contained candidate has high no-action safety.'),
    cell('drawdown-contained-candidate', 'overall-safety-posture', 78, 'high', 'Drawdown-contained candidate has high overall safety posture.'),
    cell('defensive-new-launch-candidate', 'synthetic-risk', 82, 'high', 'Defensive candidate has high risk control.'),
    cell('defensive-new-launch-candidate', 'quality', 77, 'high', 'Defensive candidate has high quality.'),
    cell('defensive-new-launch-candidate', 'confidence', 72, 'moderate', 'Defensive candidate has moderate confidence.'),
    cell('defensive-new-launch-candidate', 'evidence-coverage', 67, 'moderate', 'Defensive candidate has moderate evidence coverage.'),
    cell('defensive-new-launch-candidate', 'false-positive-protection', 87, 'high', 'Defensive candidate has high FP protection.'),
    cell('defensive-new-launch-candidate', 'no-action-safety', 92, 'high', 'Defensive candidate has very high no-action safety.'),
    cell('defensive-new-launch-candidate', 'overall-safety-posture', 82, 'high', 'Defensive candidate has high overall safety posture.'),
  ],
  safeNotes: ['Synthetic drawdown-contained comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. mixed-signal-watchlist-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const MIXED_SIGNAL_WATCHLIST_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'mixed-signal-watchlist-matrix',
  kind: 'mixed-signal-watchlist',
  title: 'Mixed-Signal Watchlist Comparison Matrix',
  description:
    'Synthetic offline comparison of mixed-signal-watchlist and post-bundle-dip candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'mixed-signal-watchlist-candidate',
      'mixed-signal-watchlist',
      'cand-msw-001',
      'Mixed-Signal Watchlist Candidate',
      'structure-pattern',
      ['Phase 38 structure-pattern candidate reference.'],
    ),
    ref(
      'post-bundle-dip-candidate',
      'post-bundle-dip',
      'cand-pbd-002',
      'Post-Bundle Dip Candidate',
      'structure-pattern',
      ['Phase 38 structure-pattern candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('mixed-signal-watchlist-candidate', 'synthetic-risk', 55, 'moderate', 'Mixed-signal candidate has moderate risk control.'),
    cell('mixed-signal-watchlist-candidate', 'quality', 50, 'moderate', 'Mixed-signal candidate has moderate quality.'),
    cell('mixed-signal-watchlist-candidate', 'confidence', 45, 'moderate', 'Mixed-signal candidate has moderate confidence.'),
    cell('mixed-signal-watchlist-candidate', 'evidence-coverage', 50, 'moderate', 'Mixed-signal candidate has moderate evidence coverage.'),
    cell('mixed-signal-watchlist-candidate', 'false-positive-protection', 55, 'moderate', 'Mixed-signal candidate has moderate FP protection.'),
    cell('mixed-signal-watchlist-candidate', 'no-action-safety', 60, 'moderate', 'Mixed-signal candidate has moderate no-action safety.'),
    cell('mixed-signal-watchlist-candidate', 'overall-safety-posture', 55, 'moderate', 'Mixed-signal candidate has moderate overall safety posture.'),
    cell('post-bundle-dip-candidate', 'synthetic-risk', 52, 'moderate', 'Post-bundle-dip candidate has moderate risk control.'),
    cell('post-bundle-dip-candidate', 'quality', 57, 'moderate', 'Post-bundle-dip candidate has moderate quality.'),
    cell('post-bundle-dip-candidate', 'confidence', 47, 'moderate', 'Post-bundle-dip candidate has moderate confidence.'),
    cell('post-bundle-dip-candidate', 'evidence-coverage', 52, 'moderate', 'Post-bundle-dip candidate has moderate evidence coverage.'),
    cell('post-bundle-dip-candidate', 'false-positive-protection', 62, 'moderate', 'Post-bundle-dip candidate has moderate FP protection.'),
    cell('post-bundle-dip-candidate', 'no-action-safety', 57, 'moderate', 'Post-bundle-dip candidate has moderate no-action safety.'),
    cell('post-bundle-dip-candidate', 'overall-safety-posture', 57, 'moderate', 'Post-bundle-dip candidate has moderate overall safety posture.'),
  ],
  safeNotes: ['Synthetic mixed-signal comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. false-positive-protection-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const FALSE_POSITIVE_PROTECTION_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'false-positive-protection-matrix',
  kind: 'false-positive-protection',
  title: 'False-Positive Protection Comparison Matrix',
  description:
    'Synthetic offline comparison of manipulation-avoidance, no-action-safety, and malformed-input-safe candidates on false-positive protection criteria. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'manipulation-avoidance-candidate',
      'manipulation-avoidance',
      'cand-ma-003',
      'Manipulation Avoidance Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'no-action-safety-candidate',
      'no-action-safety',
      'cand-nas-003',
      'No-Action Safety Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'malformed-input-safe-candidate',
      'malformed-input-safe',
      'cand-mis-002',
      'Malformed Input Safe Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('manipulation-avoidance-candidate', 'synthetic-risk', 87, 'high', 'High risk control for FP-protection comparison.'),
    cell('manipulation-avoidance-candidate', 'quality', 83, 'high', 'High quality for FP-protection comparison.'),
    cell('manipulation-avoidance-candidate', 'confidence', 79, 'high', 'High confidence for FP-protection comparison.'),
    cell('manipulation-avoidance-candidate', 'evidence-coverage', 83, 'high', 'High evidence coverage for FP-protection comparison.'),
    cell('manipulation-avoidance-candidate', 'false-positive-protection', 93, 'high', 'Very high FP protection.'),
    cell('manipulation-avoidance-candidate', 'no-action-safety', 93, 'high', 'Very high no-action safety for FP-protection comparison.'),
    cell('manipulation-avoidance-candidate', 'overall-safety-posture', 87, 'high', 'Very high overall safety for FP-protection comparison.'),
    cell('no-action-safety-candidate', 'synthetic-risk', 91, 'high', 'High risk control for FP-protection comparison.'),
    cell('no-action-safety-candidate', 'quality', 71, 'moderate', 'Moderate quality for FP-protection comparison.'),
    cell('no-action-safety-candidate', 'confidence', 61, 'moderate', 'Moderate confidence for FP-protection comparison.'),
    cell('no-action-safety-candidate', 'evidence-coverage', 56, 'moderate', 'Moderate evidence coverage for FP-protection comparison.'),
    cell('no-action-safety-candidate', 'false-positive-protection', 88, 'high', 'High FP protection.'),
    cell('no-action-safety-candidate', 'no-action-safety', 97, 'high', 'Very high no-action safety.'),
    cell('no-action-safety-candidate', 'overall-safety-posture', 87, 'high', 'High overall safety posture.'),
    cell('malformed-input-safe-candidate', 'synthetic-risk', 77, 'high', 'High risk control for FP-protection comparison.'),
    cell('malformed-input-safe-candidate', 'quality', 53, 'moderate', 'Moderate quality for FP-protection comparison.'),
    cell('malformed-input-safe-candidate', 'confidence', 48, 'moderate', 'Moderate confidence for FP-protection comparison.'),
    cell('malformed-input-safe-candidate', 'evidence-coverage', 43, 'moderate', 'Low-moderate evidence coverage for FP-protection comparison.'),
    cell('malformed-input-safe-candidate', 'false-positive-protection', 87, 'high', 'High FP protection.'),
    cell('malformed-input-safe-candidate', 'no-action-safety', 92, 'high', 'High no-action safety.'),
    cell('malformed-input-safe-candidate', 'overall-safety-posture', 75, 'high', 'High overall safety posture.'),
  ],
  safeNotes: ['Synthetic false-positive-protection comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. malformed-input-safe-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const MALFORMED_INPUT_SAFE_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'malformed-input-safe-matrix',
  kind: 'malformed-input-safe',
  title: 'Malformed-Input Safe Comparison Matrix',
  description:
    'Synthetic offline comparison of malformed-input-safe and insufficient-data candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'malformed-input-safe-candidate',
      'malformed-input-safe',
      'cand-mis-003',
      'Malformed Input Safe Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'insufficient-data-candidate',
      'insufficient-data',
      'cand-id-003',
      'Insufficient Data Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('malformed-input-safe-candidate', 'synthetic-risk', 76, 'high', 'Malformed-input-safe candidate has high risk control.'),
    cell('malformed-input-safe-candidate', 'quality', 52, 'moderate', 'Malformed-input-safe candidate has moderate quality.'),
    cell('malformed-input-safe-candidate', 'confidence', 47, 'moderate', 'Malformed-input-safe candidate has moderate confidence.'),
    cell('malformed-input-safe-candidate', 'evidence-coverage', 42, 'low', 'Malformed-input-safe candidate has low evidence coverage.'),
    cell('malformed-input-safe-candidate', 'false-positive-protection', 86, 'high', 'Malformed-input-safe candidate has high FP protection.'),
    cell('malformed-input-safe-candidate', 'no-action-safety', 91, 'high', 'Malformed-input-safe candidate has high no-action safety.'),
    cell('malformed-input-safe-candidate', 'overall-safety-posture', 73, 'moderate', 'Malformed-input-safe candidate has moderate safety posture.'),
    cell('insufficient-data-candidate', 'synthetic-risk', 66, 'moderate', 'Insufficient-data candidate has moderate risk control.'),
    cell('insufficient-data-candidate', 'quality', 27, 'low', 'Insufficient-data candidate has low quality.'),
    cell('insufficient-data-candidate', 'confidence', 21, 'low', 'Insufficient-data candidate has low confidence.'),
    cell('insufficient-data-candidate', 'evidence-coverage', 17, 'low', 'Insufficient-data candidate has very low evidence coverage.'),
    cell('insufficient-data-candidate', 'false-positive-protection', 71, 'moderate', 'Insufficient-data candidate has moderate FP protection.'),
    cell('insufficient-data-candidate', 'no-action-safety', 79, 'high', 'Insufficient-data candidate has high no-action safety by default.'),
    cell('insufficient-data-candidate', 'overall-safety-posture', 61, 'moderate', 'Insufficient-data candidate has moderate safety posture.'),
  ],
  safeNotes: ['Synthetic malformed-input comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. dashboard-ready-comparison-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const DASHBOARD_READY_COMPARISON_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'dashboard-ready-comparison-matrix',
  kind: 'dashboard-ready-comparison',
  title: 'Dashboard-Ready Comparison Matrix',
  description:
    'Synthetic offline comparison of dashboard-ready and report-ready strategy candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'dashboard-ready-strategy-candidate',
      'dashboard-ready',
      'cand-dr-001',
      'Dashboard-Ready Strategy Candidate',
      'presentation-ready',
      ['Phase 38 presentation-ready candidate reference.'],
    ),
    ref(
      'report-ready-strategy-candidate',
      'report-ready',
      'cand-rr-001',
      'Report-Ready Strategy Candidate',
      'presentation-ready',
      ['Phase 38 presentation-ready candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('dashboard-ready-strategy-candidate', 'synthetic-risk', 70, 'moderate', 'Dashboard-ready candidate has moderate risk control.'),
    cell('dashboard-ready-strategy-candidate', 'quality', 80, 'high', 'Dashboard-ready candidate has high quality.'),
    cell('dashboard-ready-strategy-candidate', 'confidence', 75, 'high', 'Dashboard-ready candidate has high confidence.'),
    cell('dashboard-ready-strategy-candidate', 'evidence-coverage', 78, 'high', 'Dashboard-ready candidate has high evidence coverage.'),
    cell('dashboard-ready-strategy-candidate', 'false-positive-protection', 72, 'moderate', 'Dashboard-ready candidate has moderate FP protection.'),
    cell('dashboard-ready-strategy-candidate', 'no-action-safety', 68, 'moderate', 'Dashboard-ready candidate has moderate no-action safety.'),
    cell('dashboard-ready-strategy-candidate', 'overall-safety-posture', 74, 'moderate', 'Dashboard-ready candidate has moderate overall safety posture.'),
    cell('report-ready-strategy-candidate', 'synthetic-risk', 72, 'moderate', 'Report-ready candidate has moderate risk control.'),
    cell('report-ready-strategy-candidate', 'quality', 82, 'high', 'Report-ready candidate has high quality.'),
    cell('report-ready-strategy-candidate', 'confidence', 77, 'high', 'Report-ready candidate has high confidence.'),
    cell('report-ready-strategy-candidate', 'evidence-coverage', 80, 'high', 'Report-ready candidate has high evidence coverage.'),
    cell('report-ready-strategy-candidate', 'false-positive-protection', 74, 'moderate', 'Report-ready candidate has moderate FP protection.'),
    cell('report-ready-strategy-candidate', 'no-action-safety', 70, 'moderate', 'Report-ready candidate has moderate no-action safety.'),
    cell('report-ready-strategy-candidate', 'overall-safety-posture', 76, 'high', 'Report-ready candidate has high overall safety posture.'),
  ],
  safeNotes: ['Synthetic dashboard-ready comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. report-ready-comparison-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_READY_COMPARISON_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'report-ready-comparison-matrix',
  kind: 'report-ready-comparison',
  title: 'Report-Ready Comparison Matrix',
  description:
    'Synthetic offline comparison of report-ready, dashboard-ready, and safety-boundary candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'report-ready-strategy-candidate',
      'report-ready',
      'cand-rr-002',
      'Report-Ready Strategy Candidate',
      'presentation-ready',
      ['Phase 38 presentation-ready candidate reference.'],
    ),
    ref(
      'dashboard-ready-strategy-candidate',
      'dashboard-ready',
      'cand-dr-002',
      'Dashboard-Ready Strategy Candidate',
      'presentation-ready',
      ['Phase 38 presentation-ready candidate reference.'],
    ),
    ref(
      'safety-boundary-strategy-candidate',
      'safety-boundary',
      'cand-sb-001',
      'Safety-Boundary Strategy Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('report-ready-strategy-candidate', 'synthetic-risk', 73, 'moderate', 'Report-ready candidate has moderate risk control.'),
    cell('report-ready-strategy-candidate', 'quality', 83, 'high', 'Report-ready candidate has high quality.'),
    cell('report-ready-strategy-candidate', 'confidence', 78, 'high', 'Report-ready candidate has high confidence.'),
    cell('report-ready-strategy-candidate', 'evidence-coverage', 81, 'high', 'Report-ready candidate has high evidence coverage.'),
    cell('report-ready-strategy-candidate', 'false-positive-protection', 75, 'high', 'Report-ready candidate has high FP protection.'),
    cell('report-ready-strategy-candidate', 'no-action-safety', 71, 'moderate', 'Report-ready candidate has moderate no-action safety.'),
    cell('report-ready-strategy-candidate', 'overall-safety-posture', 77, 'high', 'Report-ready candidate has high overall safety posture.'),
    cell('dashboard-ready-strategy-candidate', 'synthetic-risk', 71, 'moderate', 'Dashboard-ready candidate has moderate risk control.'),
    cell('dashboard-ready-strategy-candidate', 'quality', 81, 'high', 'Dashboard-ready candidate has high quality.'),
    cell('dashboard-ready-strategy-candidate', 'confidence', 76, 'high', 'Dashboard-ready candidate has high confidence.'),
    cell('dashboard-ready-strategy-candidate', 'evidence-coverage', 79, 'high', 'Dashboard-ready candidate has high evidence coverage.'),
    cell('dashboard-ready-strategy-candidate', 'false-positive-protection', 73, 'moderate', 'Dashboard-ready candidate has moderate FP protection.'),
    cell('dashboard-ready-strategy-candidate', 'no-action-safety', 69, 'moderate', 'Dashboard-ready candidate has moderate no-action safety.'),
    cell('dashboard-ready-strategy-candidate', 'overall-safety-posture', 75, 'high', 'Dashboard-ready candidate has high overall safety posture.'),
    cell('safety-boundary-strategy-candidate', 'synthetic-risk', 88, 'high', 'Safety-boundary candidate has high risk control.'),
    cell('safety-boundary-strategy-candidate', 'quality', 76, 'high', 'Safety-boundary candidate has high quality.'),
    cell('safety-boundary-strategy-candidate', 'confidence', 68, 'moderate', 'Safety-boundary candidate has moderate confidence.'),
    cell('safety-boundary-strategy-candidate', 'evidence-coverage', 65, 'moderate', 'Safety-boundary candidate has moderate evidence coverage.'),
    cell('safety-boundary-strategy-candidate', 'false-positive-protection', 90, 'high', 'Safety-boundary candidate has very high FP protection.'),
    cell('safety-boundary-strategy-candidate', 'no-action-safety', 93, 'high', 'Safety-boundary candidate has very high no-action safety.'),
    cell('safety-boundary-strategy-candidate', 'overall-safety-posture', 88, 'high', 'Safety-boundary candidate has very high overall safety posture.'),
  ],
  safeNotes: ['Synthetic report-ready comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 16. safety-boundary-comparison-matrix
// ─────────────────────────────────────────────────────────────────────────────
export const SAFETY_BOUNDARY_COMPARISON_MATRIX_FIXTURE: StrategyComparisonMatrixFixture = fixture({
  name: 'safety-boundary-comparison-matrix',
  kind: 'safety-boundary-comparison',
  title: 'Safety-Boundary Comparison Matrix',
  description:
    'Synthetic offline comparison of all safety-boundary candidates. No real scoring or ranking.',
  candidateReferences: [
    ref(
      'safety-boundary-strategy-candidate',
      'safety-boundary',
      'cand-sb-002',
      'Safety-Boundary Strategy Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'manipulation-avoidance-candidate',
      'manipulation-avoidance',
      'cand-ma-004',
      'Manipulation Avoidance Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'no-action-safety-candidate',
      'no-action-safety',
      'cand-nas-004',
      'No-Action Safety Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
    ref(
      'insufficient-data-candidate',
      'insufficient-data',
      'cand-id-004',
      'Insufficient Data Candidate',
      'safety-boundary',
      ['Phase 38 safety-boundary candidate reference.'],
    ),
  ],
  criteria: STANDARD_CRITERIA,
  cells: [
    cell('safety-boundary-strategy-candidate', 'synthetic-risk', 89, 'high', 'Safety-boundary candidate has high risk control.'),
    cell('safety-boundary-strategy-candidate', 'quality', 77, 'high', 'Safety-boundary candidate has high quality.'),
    cell('safety-boundary-strategy-candidate', 'confidence', 69, 'moderate', 'Safety-boundary candidate has moderate confidence.'),
    cell('safety-boundary-strategy-candidate', 'evidence-coverage', 66, 'moderate', 'Safety-boundary candidate has moderate evidence coverage.'),
    cell('safety-boundary-strategy-candidate', 'false-positive-protection', 91, 'high', 'Safety-boundary candidate has very high FP protection.'),
    cell('safety-boundary-strategy-candidate', 'no-action-safety', 94, 'high', 'Safety-boundary candidate has very high no-action safety.'),
    cell('safety-boundary-strategy-candidate', 'overall-safety-posture', 89, 'high', 'Safety-boundary candidate has very high overall safety posture.'),
    cell('manipulation-avoidance-candidate', 'synthetic-risk', 86, 'high', 'Manipulation-avoidance candidate has high risk control.'),
    cell('manipulation-avoidance-candidate', 'quality', 81, 'high', 'Manipulation-avoidance candidate has high quality.'),
    cell('manipulation-avoidance-candidate', 'confidence', 76, 'high', 'Manipulation-avoidance candidate has high confidence.'),
    cell('manipulation-avoidance-candidate', 'evidence-coverage', 81, 'high', 'Manipulation-avoidance candidate has high evidence coverage.'),
    cell('manipulation-avoidance-candidate', 'false-positive-protection', 91, 'high', 'Manipulation-avoidance candidate has very high FP protection.'),
    cell('manipulation-avoidance-candidate', 'no-action-safety', 91, 'high', 'Manipulation-avoidance candidate has very high no-action safety.'),
    cell('manipulation-avoidance-candidate', 'overall-safety-posture', 86, 'high', 'Manipulation-avoidance candidate has very high overall safety posture.'),
    cell('no-action-safety-candidate', 'synthetic-risk', 90, 'high', 'No-action-safety candidate has high risk control.'),
    cell('no-action-safety-candidate', 'quality', 71, 'moderate', 'No-action-safety candidate has moderate quality.'),
    cell('no-action-safety-candidate', 'confidence', 62, 'moderate', 'No-action-safety candidate has moderate confidence.'),
    cell('no-action-safety-candidate', 'evidence-coverage', 57, 'moderate', 'No-action-safety candidate has moderate evidence coverage.'),
    cell('no-action-safety-candidate', 'false-positive-protection', 87, 'high', 'No-action-safety candidate has high FP protection.'),
    cell('no-action-safety-candidate', 'no-action-safety', 96, 'high', 'No-action-safety candidate excels at no-action safety.'),
    cell('no-action-safety-candidate', 'overall-safety-posture', 86, 'high', 'No-action-safety candidate has high overall safety posture.'),
    cell('insufficient-data-candidate', 'synthetic-risk', 67, 'moderate', 'Insufficient-data candidate has moderate risk control.'),
    cell('insufficient-data-candidate', 'quality', 29, 'low', 'Insufficient-data candidate has low quality.'),
    cell('insufficient-data-candidate', 'confidence', 23, 'low', 'Insufficient-data candidate has low confidence.'),
    cell('insufficient-data-candidate', 'evidence-coverage', 19, 'low', 'Insufficient-data candidate has very low evidence coverage.'),
    cell('insufficient-data-candidate', 'false-positive-protection', 73, 'moderate', 'Insufficient-data candidate has moderate FP protection.'),
    cell('insufficient-data-candidate', 'no-action-safety', 80, 'high', 'Insufficient-data candidate defaults to high no-action safety.'),
    cell('insufficient-data-candidate', 'overall-safety-posture', 62, 'moderate', 'Insufficient-data candidate has moderate safety posture.'),
  ],
  safeNotes: ['Synthetic safety-boundary comparison. No real scoring, ranking, or execution.'],
});

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────
export const PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES: ReadonlyMap<
  StrategyComparisonMatrixFixtureName,
  StrategyComparisonMatrixFixture
> = new Map([
  ['defensive-vs-aggressive-matrix', DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE],
  ['creator-led-candidate-matrix', CREATOR_LED_CANDIDATE_MATRIX_FIXTURE],
  ['wallet-led-candidate-matrix', WALLET_LED_CANDIDATE_MATRIX_FIXTURE],
  ['manipulation-avoidance-matrix', MANIPULATION_AVOIDANCE_MATRIX_FIXTURE],
  ['no-action-safety-matrix', NO_ACTION_SAFETY_MATRIX_FIXTURE],
  ['insufficient-data-matrix', INSUFFICIENT_DATA_MATRIX_FIXTURE],
  ['high-score-positive-comparison-matrix', HIGH_SCORE_POSITIVE_COMPARISON_MATRIX_FIXTURE],
  ['high-score-false-positive-comparison-matrix', HIGH_SCORE_FALSE_POSITIVE_COMPARISON_MATRIX_FIXTURE],
  ['missed-opportunity-comparison-matrix', MISSED_OPPORTUNITY_COMPARISON_MATRIX_FIXTURE],
  ['drawdown-contained-comparison-matrix', DRAWDOWN_CONTAINED_COMPARISON_MATRIX_FIXTURE],
  ['mixed-signal-watchlist-matrix', MIXED_SIGNAL_WATCHLIST_MATRIX_FIXTURE],
  ['false-positive-protection-matrix', FALSE_POSITIVE_PROTECTION_MATRIX_FIXTURE],
  ['malformed-input-safe-matrix', MALFORMED_INPUT_SAFE_MATRIX_FIXTURE],
  ['dashboard-ready-comparison-matrix', DASHBOARD_READY_COMPARISON_MATRIX_FIXTURE],
  ['report-ready-comparison-matrix', REPORT_READY_COMPARISON_MATRIX_FIXTURE],
  ['safety-boundary-comparison-matrix', SAFETY_BOUNDARY_COMPARISON_MATRIX_FIXTURE],
]);

export function listStrategyComparisonMatrixFixtures(): readonly StrategyComparisonMatrixFixtureName[] {
  return [...PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.keys()].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getStrategyComparisonMatrixFixture(
  name: StrategyComparisonMatrixFixtureName,
): StrategyComparisonMatrixFixture | undefined {
  return PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.get(name);
}
