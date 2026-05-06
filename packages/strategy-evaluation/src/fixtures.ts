/**
 * packages/strategy-evaluation/src/fixtures.ts
 *
 * Phase 16 — Deterministic synthetic StrategyEvaluation fixtures.
 *
 * Rules:
 *   - synthetic data only
 *   - fixtureOnly: true, liveData: false, safeToDisplay: true
 *   - analysisOnly: true, nonExecutable: true
 *   - no real token mints, wallet addresses, private data
 *   - no real URLs, no provider names requiring live access
 *   - no network calls
 *   - deterministic across test runs (no Date.now() or random)
 *
 * Fixtures are built from Phase 15 StrategyIntent fixtures.
 */

import type { StrategyEvaluationFixture, StrategyEvaluation } from './types.js';
import { buildStrategyEvaluation } from './evaluation-builder.js';
import {
  CLEAN_STRATEGY_INTENT_FIXTURE,
  DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE,
  DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE,
  FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE,
  INCONCLUSIVE_STRATEGY_INTENT_FIXTURE,
  REGRESSION_STRATEGY_INTENT_FIXTURE,
} from '@sonic/strategy-intent';

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildFixtureEvaluation(intents: import('@sonic/strategy-intent').StrategyIntent[], label: string): StrategyEvaluation {
  const result = buildStrategyEvaluation({
    intents,
    sourceKind: 'fixture_batch',
    fixtureOnly: true,
    liveData: false,
  });

  if (!result.ok) {
    // This should never happen with valid fixture intents
    throw new Error(`Failed to build ${label} evaluation fixture: ${result.message}`);
  }

  return result.value;
}

// ─── Clean fixture ────────────────────────────────────────────────────────────

const CLEAN_EVALUATION = buildFixtureEvaluation(
  [CLEAN_STRATEGY_INTENT_FIXTURE.intent],
  'clean',
);

export const CLEAN_STRATEGY_EVALUATION_FIXTURE: StrategyEvaluationFixture = {
  fixtureId: 'clean_strategy_evaluation_fixture',
  displayName: 'Clean Strategy Evaluation Fixture',
  description: 'A synthetic clean evaluation with strong evidence and analysis_only_heavy classification.',
  evaluation: CLEAN_EVALUATION,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Degraded fixture ─────────────────────────────────────────────────────────

const DEGRADED_EVALUATION = buildFixtureEvaluation(
  [
    DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent,
    DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE.intent,
  ],
  'degraded',
);

export const DEGRADED_STRATEGY_EVALUATION_FIXTURE: StrategyEvaluationFixture = {
  fixtureId: 'degraded_strategy_evaluation_fixture',
  displayName: 'Degraded Strategy Evaluation Fixture',
  description: 'A synthetic degraded evaluation with degraded evidence and watch_only_heavy classification.',
  evaluation: DEGRADED_EVALUATION,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Failed fixture ───────────────────────────────────────────────────────────

const FAILED_EVALUATION = buildFixtureEvaluation(
  [FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent],
  'failed',
);

export const FAILED_STRATEGY_EVALUATION_FIXTURE: StrategyEvaluationFixture = {
  fixtureId: 'failed_strategy_evaluation_fixture',
  displayName: 'Failed Strategy Evaluation Fixture',
  description: 'A synthetic failed evaluation with failed evidence and reject_heavy classification.',
  evaluation: FAILED_EVALUATION,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Inconclusive fixture ─────────────────────────────────────────────────────

const INCONCLUSIVE_EVALUATION = buildFixtureEvaluation(
  [INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent],
  'inconclusive',
);

export const INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE: StrategyEvaluationFixture = {
  fixtureId: 'inconclusive_strategy_evaluation_fixture',
  displayName: 'Inconclusive Strategy Evaluation Fixture',
  description: 'A synthetic inconclusive evaluation with inconclusive evidence and insufficient_evidence classification.',
  evaluation: INCONCLUSIVE_EVALUATION,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Mixed fixture ────────────────────────────────────────────────────────────

const MIXED_EVALUATION = buildFixtureEvaluation(
  [
    CLEAN_STRATEGY_INTENT_FIXTURE.intent,
    DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE.intent,
    FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE.intent,
    INCONCLUSIVE_STRATEGY_INTENT_FIXTURE.intent,
  ],
  'mixed',
);

export const MIXED_STRATEGY_EVALUATION_FIXTURE: StrategyEvaluationFixture = {
  fixtureId: 'mixed_strategy_evaluation_fixture',
  displayName: 'Mixed Strategy Evaluation Fixture',
  description: 'A synthetic mixed evaluation combining clean, degraded, failed, and inconclusive intents.',
  evaluation: MIXED_EVALUATION,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Regression fixture ───────────────────────────────────────────────────────

const REGRESSION_EVALUATION = buildFixtureEvaluation(
  [REGRESSION_STRATEGY_INTENT_FIXTURE.intent],
  'regression',
);

export const REGRESSION_STRATEGY_EVALUATION_FIXTURE: StrategyEvaluationFixture = {
  fixtureId: 'regression_strategy_evaluation_fixture',
  displayName: 'Regression Strategy Evaluation Fixture',
  description: 'A synthetic regression evaluation detecting regression between baseline and candidate fixture runs.',
  evaluation: REGRESSION_EVALUATION,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── All fixtures ─────────────────────────────────────────────────────────────

export const ALL_STRATEGY_EVALUATION_FIXTURES: readonly StrategyEvaluationFixture[] = [
  CLEAN_STRATEGY_EVALUATION_FIXTURE,
  DEGRADED_STRATEGY_EVALUATION_FIXTURE,
  FAILED_STRATEGY_EVALUATION_FIXTURE,
  INCONCLUSIVE_STRATEGY_EVALUATION_FIXTURE,
  MIXED_STRATEGY_EVALUATION_FIXTURE,
  REGRESSION_STRATEGY_EVALUATION_FIXTURE,
];
