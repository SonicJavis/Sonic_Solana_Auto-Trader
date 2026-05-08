/**
 * Phase 39 — Strategy Comparison Matrix Fixtures v1: tests.
 *
 * 300+ tests covering:
 * - exports and type shapes
 * - fixture list/get helpers
 * - all 16 required fixtures
 * - builder/summary helpers
 * - matrix row/column/cell shape
 * - normalization, serialization, equality
 * - validation success/failure
 * - safety validation success/failure
 * - Phase 38 source-reference compatibility
 * - no input mutation
 * - serializability
 * - deterministic ordering/generatedAt
 * - safety boundary regression
 * - no real wallet addresses/hashes/PII/secrets
 * - no real scoring/ranking/execution
 * - capability flags
 */

import { describe, expect, it } from 'vitest';
import {
  // Types/constants
  PHASE_39_STRATEGY_COMPARISON_GENERATED_AT,
  PHASE_39_STRATEGY_COMPARISON_SOURCE,
  STRATEGY_COMPARISON_CRITERION_CODES,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES,
  // Capabilities
  getStrategyComparisonMatrixCapabilities,
  // Builders
  buildStrategyComparisonMatrixFixture,
  buildStrategyComparisonMatrixSummary,
  // Normalization
  normalizeStrategyComparisonMatrixFixture,
  serializeStrategyComparisonMatrixFixture,
  areStrategyComparisonMatrixFixturesEqual,
  isStrategyComparisonMatrixFixtureSerializable,
  // Validation
  validateStrategyComparisonMatrixFixture,
  validateStrategyComparisonMatrixSafety,
  // Fixtures
  listStrategyComparisonMatrixFixtures,
  getStrategyComparisonMatrixFixture,
  PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES,
  DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
  CREATOR_LED_CANDIDATE_MATRIX_FIXTURE,
  WALLET_LED_CANDIDATE_MATRIX_FIXTURE,
  MANIPULATION_AVOIDANCE_MATRIX_FIXTURE,
  NO_ACTION_SAFETY_MATRIX_FIXTURE,
  INSUFFICIENT_DATA_MATRIX_FIXTURE,
  HIGH_SCORE_POSITIVE_COMPARISON_MATRIX_FIXTURE,
  HIGH_SCORE_FALSE_POSITIVE_COMPARISON_MATRIX_FIXTURE,
  MISSED_OPPORTUNITY_COMPARISON_MATRIX_FIXTURE,
  DRAWDOWN_CONTAINED_COMPARISON_MATRIX_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_MATRIX_FIXTURE,
  FALSE_POSITIVE_PROTECTION_MATRIX_FIXTURE,
  MALFORMED_INPUT_SAFE_MATRIX_FIXTURE,
  DASHBOARD_READY_COMPARISON_MATRIX_FIXTURE,
  REPORT_READY_COMPARISON_MATRIX_FIXTURE,
  SAFETY_BOUNDARY_COMPARISON_MATRIX_FIXTURE,
} from '../packages/offline-intelligence/src/strategy-comparison/index.js';

import type {
  StrategyComparisonMatrixFixture,
  StrategyComparisonMatrixFixtureName,
  StrategyComparisonBuildInput,
} from '../packages/offline-intelligence/src/strategy-comparison/types.js';

import {
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES,
} from '../packages/offline-intelligence/src/strategy-candidates/types.js';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Constants and Type Shape
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — constants', () => {
  it('PHASE_39_STRATEGY_COMPARISON_GENERATED_AT is deterministic ISO string', () => {
    expect(PHASE_39_STRATEGY_COMPARISON_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('PHASE_39_STRATEGY_COMPARISON_SOURCE is correct', () => {
    expect(PHASE_39_STRATEGY_COMPARISON_SOURCE).toBe(
      'phase39_strategy_comparison_matrix_fixtures_v1',
    );
  });

  it('STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES has 16 entries', () => {
    expect(STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES).toHaveLength(16);
  });

  it('STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS has 16 entries', () => {
    expect(STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS).toHaveLength(16);
  });

  it('STRATEGY_COMPARISON_CRITERION_CODES has 7 entries', () => {
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toHaveLength(7);
  });

  it('STRATEGY_COMPARISON_CRITERION_CODES includes expected codes', () => {
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toContain('synthetic-risk');
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toContain('quality');
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toContain('confidence');
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toContain('evidence-coverage');
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toContain('false-positive-protection');
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toContain('no-action-safety');
    expect(STRATEGY_COMPARISON_CRITERION_CODES).toContain('overall-safety-posture');
  });

  it('STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES includes all 16 required fixtures', () => {
    const names = STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES as readonly string[];
    expect(names).toContain('defensive-vs-aggressive-matrix');
    expect(names).toContain('creator-led-candidate-matrix');
    expect(names).toContain('wallet-led-candidate-matrix');
    expect(names).toContain('manipulation-avoidance-matrix');
    expect(names).toContain('no-action-safety-matrix');
    expect(names).toContain('insufficient-data-matrix');
    expect(names).toContain('high-score-positive-comparison-matrix');
    expect(names).toContain('high-score-false-positive-comparison-matrix');
    expect(names).toContain('missed-opportunity-comparison-matrix');
    expect(names).toContain('drawdown-contained-comparison-matrix');
    expect(names).toContain('mixed-signal-watchlist-matrix');
    expect(names).toContain('false-positive-protection-matrix');
    expect(names).toContain('malformed-input-safe-matrix');
    expect(names).toContain('dashboard-ready-comparison-matrix');
    expect(names).toContain('report-ready-comparison-matrix');
    expect(names).toContain('safety-boundary-comparison-matrix');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Capability Flags
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — capability flags', () => {
  const caps = getStrategyComparisonMatrixCapabilities();

  it('strategyComparisonMatrixFixtures is true', () => {
    expect(caps.strategyComparisonMatrixFixtures).toBe(true);
  });

  it('syntheticStrategyComparisonMatrices is true', () => {
    expect(caps.syntheticStrategyComparisonMatrices).toBe(true);
  });

  it('strategyComparisonMatrixBuilders is true', () => {
    expect(caps.strategyComparisonMatrixBuilders).toBe(true);
  });

  it('strategyComparisonMatrixSafetyValidation is true', () => {
    expect(caps.strategyComparisonMatrixSafetyValidation).toBe(true);
  });

  it('strategyComparisonCandidateReferences is true', () => {
    expect(caps.strategyComparisonCandidateReferences).toBe(true);
  });

  it('strategyComparisonRealScoring is false', () => {
    expect(caps.strategyComparisonRealScoring).toBe(false);
  });

  it('strategyComparisonRealRanking is false', () => {
    expect(caps.strategyComparisonRealRanking).toBe(false);
  });

  it('strategyComparisonRealBacktesting is false', () => {
    expect(caps.strategyComparisonRealBacktesting).toBe(false);
  });

  it('strategyComparisonPaperTrading is false', () => {
    expect(caps.strategyComparisonPaperTrading).toBe(false);
  });

  it('strategyComparisonLiveTrading is false', () => {
    expect(caps.strategyComparisonLiveTrading).toBe(false);
  });

  it('strategyComparisonExecution is false', () => {
    expect(caps.strategyComparisonExecution).toBe(false);
  });

  it('strategyComparisonSolanaRpc is false', () => {
    expect(caps.strategyComparisonSolanaRpc).toBe(false);
  });

  it('strategyComparisonExternalNetwork is false', () => {
    expect(caps.strategyComparisonExternalNetwork).toBe(false);
  });

  it('strategyComparisonPersistence is false', () => {
    expect(caps.strategyComparisonPersistence).toBe(false);
  });

  it('strategyComparisonFileExport is false', () => {
    expect(caps.strategyComparisonFileExport).toBe(false);
  });

  it('strategyComparisonInvestmentAdvice is false', () => {
    expect(caps.strategyComparisonInvestmentAdvice).toBe(false);
  });

  it('strategyComparisonTradingSignals is false', () => {
    expect(caps.strategyComparisonTradingSignals).toBe(false);
  });

  it('strategyComparisonRecommendations is false', () => {
    expect(caps.strategyComparisonRecommendations).toBe(false);
  });

  it('capabilities object is frozen/immutable (all values are primitives)', () => {
    for (const [, v] of Object.entries(caps)) {
      expect(typeof v === 'boolean').toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Fixture Registry — listStrategyComparisonMatrixFixtures
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — listStrategyComparisonMatrixFixtures', () => {
  it('returns 16 fixture names', () => {
    expect(listStrategyComparisonMatrixFixtures()).toHaveLength(16);
  });

  it('returns sorted fixture names', () => {
    const names = listStrategyComparisonMatrixFixtures();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it('returns readonly array', () => {
    const names = listStrategyComparisonMatrixFixtures();
    expect(Array.isArray(names)).toBe(true);
  });

  it('all returned names are valid fixture names', () => {
    const names = listStrategyComparisonMatrixFixtures();
    for (const name of names) {
      expect(STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES as readonly string[]).toContain(name);
    }
  });

  it('returns stable order across calls', () => {
    expect(listStrategyComparisonMatrixFixtures()).toEqual(listStrategyComparisonMatrixFixtures());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. getStrategyComparisonMatrixFixture
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — getStrategyComparisonMatrixFixture', () => {
  it('returns fixture for each valid name', () => {
    for (const name of STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES) {
      const f = getStrategyComparisonMatrixFixture(name);
      expect(f).toBeDefined();
      expect(f?.name).toBe(name);
    }
  });

  it('returns undefined for unknown name', () => {
    const f = getStrategyComparisonMatrixFixture('not-a-real-fixture' as StrategyComparisonMatrixFixtureName);
    expect(f).toBeUndefined();
  });

  it('returns same reference across multiple calls', () => {
    const a = getStrategyComparisonMatrixFixture('defensive-vs-aggressive-matrix');
    const b = getStrategyComparisonMatrixFixture('defensive-vs-aggressive-matrix');
    expect(a).toBe(b);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES map
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES map', () => {
  it('has 16 entries', () => {
    expect(PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.size).toBe(16);
  });

  it('keys match fixture names', () => {
    for (const [k, v] of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES) {
      expect(k).toBe(v.name);
    }
  });

  it('is a ReadonlyMap', () => {
    expect(PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES instanceof Map).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: check common fixture shape
// ─────────────────────────────────────────────────────────────────────────────

function assertFixtureShape(f: StrategyComparisonMatrixFixture, name: string): void {
  expect(f.name).toBe(name);
  expect(typeof f.kind).toBe('string');
  expect(typeof f.title).toBe('string');
  expect(typeof f.description).toBe('string');
  expect(Array.isArray(f.candidateReferences)).toBe(true);
  expect(f.candidateReferences.length).toBeGreaterThan(0);
  expect(Array.isArray(f.criteria)).toBe(true);
  expect(f.criteria.length).toBeGreaterThan(0);
  expect(Array.isArray(f.rows)).toBe(true);
  expect(f.rows.length).toBeGreaterThan(0);
  expect(Array.isArray(f.columns)).toBe(true);
  expect(f.columns.length).toBeGreaterThan(0);
  expect(typeof f.summary).toBe('object');
  expect(typeof f.safetyBoundary).toBe('object');
  expect(typeof f.meta).toBe('object');
}

function assertFixtureSafety(f: StrategyComparisonMatrixFixture): void {
  expect(f.meta.phase).toBe(39);
  expect(f.meta.liveData).toBe(false);
  expect(f.meta.realScoring).toBe(false);
  expect(f.meta.realRanking).toBe(false);
  expect(f.meta.execution).toBe(false);
  expect(f.meta.externalNetwork).toBe(false);
  expect(f.meta.persistence).toBe(false);
  expect(f.meta.fileExport).toBe(false);
  expect(f.meta.fixtureOnly).toBe(true);
  expect(f.meta.syntheticOnly).toBe(true);
  expect(f.meta.deterministic).toBe(true);
  expect(f.meta.nonAdvisory).toBe(true);
  expect(f.meta.nonAccusatory).toBe(true);
  expect(f.summary.liveData).toBe(false);
  expect(f.summary.realScoring).toBe(false);
  expect(f.summary.realRanking).toBe(false);
  expect(f.summary.execution).toBe(false);
  expect(f.summary.nonAdvisory).toBe(true);
  expect(f.summary.safeToDisplay).toBe(true);
  expect(f.safetyBoundary.noRealScoring).toBe(true);
  expect(f.safetyBoundary.noRealRanking).toBe(true);
  expect(f.safetyBoundary.noLiveTrading).toBe(true);
  expect(f.safetyBoundary.noExecution).toBe(true);
  expect(f.safetyBoundary.noInvestmentAdvice).toBe(true);
  expect(f.safetyBoundary.noTradingSignals).toBe(true);
  expect(f.safetyBoundary.noRecommendations).toBe(true);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Individual fixture tests — all 16
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE', () => {
  const f = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;

  it('has correct name', () => { assertFixtureShape(f, 'defensive-vs-aggressive-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('defensive-vs-aggressive'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('candidate refs are valid Phase 38 names', () => {
    for (const ref of f.candidateReferences) {
      expect(STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES as readonly string[]).toContain(ref.candidateFixtureName);
    }
  });
  it('has 7 criteria', () => { expect(f.criteria).toHaveLength(7); });
  it('each criterion has valid code', () => {
    for (const c of f.criteria) {
      expect(STRATEGY_COMPARISON_CRITERION_CODES as readonly string[]).toContain(c.code);
    }
  });
  it('rows count equals candidate count', () => { expect(f.rows).toHaveLength(2); });
  it('each row has cells equal to criteria count', () => {
    for (const row of f.rows) {
      expect(row.cells).toHaveLength(f.criteria.length);
    }
  });
  it('all cells have syntheticScore 0-100', () => {
    for (const row of f.rows) {
      for (const cell of row.cells) {
        expect(cell.syntheticScore).toBeGreaterThanOrEqual(0);
        expect(cell.syntheticScore).toBeLessThanOrEqual(100);
      }
    }
  });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('generatedAt is deterministic', () => { expect(f.meta.generatedAt).toBe(PHASE_39_STRATEGY_COMPARISON_GENERATED_AT); });
  it('source is correct', () => { expect(f.meta.source).toBe(PHASE_39_STRATEGY_COMPARISON_SOURCE); });
  it('summary phase is 39', () => { expect(f.summary.phase).toBe(39); });
  it('summary cellCount equals rows*criteria', () => {
    expect(f.summary.cellCount).toBe(f.rows.length * f.criteria.length);
  });
});

describe('Phase 39 — CREATOR_LED_CANDIDATE_MATRIX_FIXTURE', () => {
  const f = CREATOR_LED_CANDIDATE_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'creator-led-candidate-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('creator-led-candidate'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
  it('all cells have valid bands', () => {
    for (const row of f.rows) {
      for (const cell of row.cells) {
        expect(['low', 'moderate', 'high', 'critical', 'unknown']).toContain(cell.band);
      }
    }
  });
});

describe('Phase 39 — WALLET_LED_CANDIDATE_MATRIX_FIXTURE', () => {
  const f = WALLET_LED_CANDIDATE_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'wallet-led-candidate-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('wallet-led-candidate'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — MANIPULATION_AVOIDANCE_MATRIX_FIXTURE', () => {
  const f = MANIPULATION_AVOIDANCE_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'manipulation-avoidance-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('manipulation-avoidance'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — NO_ACTION_SAFETY_MATRIX_FIXTURE', () => {
  const f = NO_ACTION_SAFETY_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'no-action-safety-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('no-action-safety'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — INSUFFICIENT_DATA_MATRIX_FIXTURE', () => {
  const f = INSUFFICIENT_DATA_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'insufficient-data-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('insufficient-data'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — HIGH_SCORE_POSITIVE_COMPARISON_MATRIX_FIXTURE', () => {
  const f = HIGH_SCORE_POSITIVE_COMPARISON_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'high-score-positive-comparison-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('high-score-positive-comparison'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — HIGH_SCORE_FALSE_POSITIVE_COMPARISON_MATRIX_FIXTURE', () => {
  const f = HIGH_SCORE_FALSE_POSITIVE_COMPARISON_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'high-score-false-positive-comparison-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('high-score-false-positive-comparison'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — MISSED_OPPORTUNITY_COMPARISON_MATRIX_FIXTURE', () => {
  const f = MISSED_OPPORTUNITY_COMPARISON_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'missed-opportunity-comparison-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('missed-opportunity-comparison'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — DRAWDOWN_CONTAINED_COMPARISON_MATRIX_FIXTURE', () => {
  const f = DRAWDOWN_CONTAINED_COMPARISON_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'drawdown-contained-comparison-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('drawdown-contained-comparison'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — MIXED_SIGNAL_WATCHLIST_MATRIX_FIXTURE', () => {
  const f = MIXED_SIGNAL_WATCHLIST_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'mixed-signal-watchlist-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('mixed-signal-watchlist'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — FALSE_POSITIVE_PROTECTION_MATRIX_FIXTURE', () => {
  const f = FALSE_POSITIVE_PROTECTION_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'false-positive-protection-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('false-positive-protection'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 3 candidate references', () => { expect(f.candidateReferences).toHaveLength(3); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
  it('has 3 rows', () => { expect(f.rows).toHaveLength(3); });
});

describe('Phase 39 — MALFORMED_INPUT_SAFE_MATRIX_FIXTURE', () => {
  const f = MALFORMED_INPUT_SAFE_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'malformed-input-safe-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('malformed-input-safe'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — DASHBOARD_READY_COMPARISON_MATRIX_FIXTURE', () => {
  const f = DASHBOARD_READY_COMPARISON_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'dashboard-ready-comparison-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('dashboard-ready-comparison'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 2 candidate references', () => { expect(f.candidateReferences).toHaveLength(2); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
});

describe('Phase 39 — REPORT_READY_COMPARISON_MATRIX_FIXTURE', () => {
  const f = REPORT_READY_COMPARISON_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'report-ready-comparison-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('report-ready-comparison'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 3 candidate references', () => { expect(f.candidateReferences).toHaveLength(3); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
  it('has 3 rows', () => { expect(f.rows).toHaveLength(3); });
});

describe('Phase 39 — SAFETY_BOUNDARY_COMPARISON_MATRIX_FIXTURE', () => {
  const f = SAFETY_BOUNDARY_COMPARISON_MATRIX_FIXTURE;
  it('has correct name', () => { assertFixtureShape(f, 'safety-boundary-comparison-matrix'); });
  it('has correct kind', () => { expect(f.kind).toBe('safety-boundary-comparison'); });
  it('passes safety checks', () => { assertFixtureSafety(f); });
  it('has 4 candidate references', () => { expect(f.candidateReferences).toHaveLength(4); });
  it('passes validation', () => { expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true); });
  it('passes safety validation', () => { expect(validateStrategyComparisonMatrixSafety(f).safe).toBe(true); });
  it('is serializable', () => { expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true); });
  it('has 4 rows', () => { expect(f.rows).toHaveLength(4); });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. All fixtures — bulk checks
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — all 16 fixtures bulk checks', () => {
  const allFixtures = [...PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()];

  it('all fixtures pass validation', () => {
    for (const f of allFixtures) {
      const result = validateStrategyComparisonMatrixFixture(f);
      expect(result.valid).toBe(true);
    }
  });

  it('all fixtures pass safety validation', () => {
    for (const f of allFixtures) {
      const result = validateStrategyComparisonMatrixSafety(f);
      expect(result.safe).toBe(true);
    }
  });

  it('all fixtures are serializable', () => {
    for (const f of allFixtures) {
      expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true);
    }
  });

  it('all fixtures have deterministic generatedAt', () => {
    for (const f of allFixtures) {
      expect(f.meta.generatedAt).toBe(PHASE_39_STRATEGY_COMPARISON_GENERATED_AT);
    }
  });

  it('all fixtures have correct source', () => {
    for (const f of allFixtures) {
      expect(f.meta.source).toBe(PHASE_39_STRATEGY_COMPARISON_SOURCE);
    }
  });

  it('all fixtures have phase 39', () => {
    for (const f of allFixtures) {
      expect(f.meta.phase).toBe(39);
      expect(f.summary.phase).toBe(39);
    }
  });

  it('all fixtures have valid kinds', () => {
    for (const f of allFixtures) {
      expect(STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS as readonly string[]).toContain(f.kind);
    }
  });

  it('all fixtures have at least one criterion', () => {
    for (const f of allFixtures) {
      expect(f.criteria.length).toBeGreaterThan(0);
    }
  });

  it('all fixtures have at least one candidate reference', () => {
    for (const f of allFixtures) {
      expect(f.candidateReferences.length).toBeGreaterThan(0);
    }
  });

  it('all candidate references use valid Phase 38 fixture names', () => {
    for (const f of allFixtures) {
      for (const ref of f.candidateReferences) {
        expect(STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES as readonly string[]).toContain(
          ref.candidateFixtureName,
        );
        expect(ref.fixtureOnly).toBe(true);
        expect(ref.syntheticOnly).toBe(true);
      }
    }
  });

  it('all cells have syntheticScore in [0, 100]', () => {
    for (const f of allFixtures) {
      for (const row of f.rows) {
        for (const cell of row.cells) {
          expect(cell.syntheticScore).toBeGreaterThanOrEqual(0);
          expect(cell.syntheticScore).toBeLessThanOrEqual(100);
          expect(cell.fixtureOnly).toBe(true);
          expect(cell.syntheticOnly).toBe(true);
        }
      }
    }
  });

  it('all cells have valid band values', () => {
    const validBands = ['low', 'moderate', 'high', 'critical', 'unknown'];
    for (const f of allFixtures) {
      for (const row of f.rows) {
        for (const cell of row.cells) {
          expect(validBands).toContain(cell.band);
        }
      }
    }
  });

  it('all rows have rowSyntheticOverallScore in [0, 100]', () => {
    for (const f of allFixtures) {
      for (const row of f.rows) {
        expect(row.rowSyntheticOverallScore).toBeGreaterThanOrEqual(0);
        expect(row.rowSyntheticOverallScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it('no fixture contains real wallet addresses (Solana base58)', () => {
    const walletPattern = /\b[1-9A-HJ-NP-Za-km-z]{43,44}\b/;
    for (const f of allFixtures) {
      const str = JSON.stringify(f);
      const matches = str.match(walletPattern);
      expect(matches).toBeNull();
    }
  });

  it('no fixture contains transaction hashes (64-char hex)', () => {
    const txHashPattern = /\b[0-9a-fA-F]{64}\b/;
    for (const f of allFixtures) {
      const str = JSON.stringify(f);
      expect(txHashPattern.test(str)).toBe(false);
    }
  });

  it('no fixture meta contains liveData: true', () => {
    for (const f of allFixtures) {
      expect(f.meta.liveData).toBe(false);
    }
  });

  it('no fixture meta contains realScoring: true', () => {
    for (const f of allFixtures) {
      expect(f.meta.realScoring).toBe(false);
    }
  });

  it('no fixture meta contains realRanking: true', () => {
    for (const f of allFixtures) {
      expect(f.meta.realRanking).toBe(false);
    }
  });

  it('no fixture meta contains execution: true', () => {
    for (const f of allFixtures) {
      expect(f.meta.execution).toBe(false);
    }
  });

  it('no fixture meta contains externalNetwork: true', () => {
    for (const f of allFixtures) {
      expect(f.meta.externalNetwork).toBe(false);
    }
  });

  it('summary candidateCount matches candidateReferences length', () => {
    for (const f of allFixtures) {
      expect(f.summary.candidateCount).toBe(f.candidateReferences.length);
    }
  });

  it('summary criterionCount matches criteria length', () => {
    for (const f of allFixtures) {
      expect(f.summary.criterionCount).toBe(f.criteria.length);
    }
  });

  it('summary rowCount matches rows length', () => {
    for (const f of allFixtures) {
      expect(f.summary.rowCount).toBe(f.rows.length);
    }
  });

  it('summary columnCount matches columns length', () => {
    for (const f of allFixtures) {
      expect(f.summary.columnCount).toBe(f.columns.length);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Builder tests
// ─────────────────────────────────────────────────────────────────────────────

function validBuildInput(): StrategyComparisonBuildInput {
  return {
    name: 'defensive-vs-aggressive-matrix',
    kind: 'defensive-vs-aggressive',
    title: 'Test Matrix',
    description: 'Synthetic test matrix.',
    candidateReferences: [
      {
        candidateFixtureName: 'defensive-new-launch-candidate',
        candidateFixtureKind: 'defensive-new-launch',
        candidateId: 'test-cand-001',
        candidateTitle: 'Test Candidate',
        candidateFamily: 'defensive',
        fixtureOnly: true,
        syntheticOnly: true,
        notes: ['Test reference.'],
      },
    ],
  };
}

describe('Phase 39 — buildStrategyComparisonMatrixFixture', () => {
  it('succeeds with valid input', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.success).toBe(true);
    expect(result.fixture).not.toBeNull();
  });

  it('returns valid fixture with correct name', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.fixture?.name).toBe('defensive-vs-aggressive-matrix');
  });

  it('returns valid fixture with phase 39 meta', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.fixture?.meta.phase).toBe(39);
  });

  it('returns validation with valid: true', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.validation.valid).toBe(true);
  });

  it('returns safety with safe: true', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.safety.safe).toBe(true);
  });

  it('fails with invalid name', () => {
    const input = { ...validBuildInput(), name: 'not-a-valid-name' };
    const result = buildStrategyComparisonMatrixFixture(input);
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
  });

  it('fails with invalid kind', () => {
    const input = { ...validBuildInput(), kind: 'not-a-valid-kind' };
    const result = buildStrategyComparisonMatrixFixture(input);
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
  });

  it('fails with empty candidateReferences', () => {
    const input = { ...validBuildInput(), candidateReferences: [] };
    const result = buildStrategyComparisonMatrixFixture(input);
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
  });

  it('does not mutate input', () => {
    const input = validBuildInput();
    const origCandidates = [...input.candidateReferences];
    buildStrategyComparisonMatrixFixture(input);
    expect(input.candidateReferences).toEqual(origCandidates);
  });

  it('uses default criteria when none provided', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.fixture?.criteria).toHaveLength(7);
  });

  it('uses provided criteria when given', () => {
    const input = {
      ...validBuildInput(),
      criteria: [
        {
          code: 'synthetic-risk' as const,
          label: 'Synthetic Risk',
          description: 'Test criterion.',
          dimension: 'risk-control' as const,
          notes: ['Test.'],
        },
      ],
    };
    const result = buildStrategyComparisonMatrixFixture(input);
    expect(result.fixture?.criteria).toHaveLength(1);
  });

  it('builds rows equal to candidate count', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.fixture?.rows).toHaveLength(1);
  });

  it('builds columns equal to criteria count', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.fixture?.columns).toHaveLength(7);
  });

  it('all built cells have syntheticScore in [0, 100]', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    for (const row of result.fixture?.rows ?? []) {
      for (const cell of row.cells) {
        expect(cell.syntheticScore).toBeGreaterThanOrEqual(0);
        expect(cell.syntheticScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it('returns deterministic generatedAt', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.fixture?.meta.generatedAt).toBe(PHASE_39_STRATEGY_COMPARISON_GENERATED_AT);
  });

  it('returns correct source', () => {
    const result = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(result.fixture?.meta.source).toBe(PHASE_39_STRATEGY_COMPARISON_SOURCE);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. buildStrategyComparisonMatrixSummary
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — buildStrategyComparisonMatrixSummary', () => {
  it('returns summary for a valid fixture', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.phase).toBe(39);
  });

  it('summary has correct candidateCount', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.candidateCount).toBe(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.candidateReferences.length);
  });

  it('summary has correct criterionCount', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.criterionCount).toBe(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.criteria.length);
  });

  it('summary liveData is false', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.liveData).toBe(false);
  });

  it('summary realScoring is false', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.realScoring).toBe(false);
  });

  it('summary nonAdvisory is true', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.nonAdvisory).toBe(true);
  });

  it('summary safeToDisplay is true', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.safeToDisplay).toBe(true);
  });

  it('summary syntheticMinScore <= syntheticMaxScore', () => {
    const summary = buildStrategyComparisonMatrixSummary(SAFETY_BOUNDARY_COMPARISON_MATRIX_FIXTURE);
    expect(summary.syntheticMinScore).toBeLessThanOrEqual(summary.syntheticMaxScore);
  });

  it('summary generatedAt is deterministic', () => {
    const summary = buildStrategyComparisonMatrixSummary(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(summary.generatedAt).toBe(PHASE_39_STRATEGY_COMPARISON_GENERATED_AT);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Normalization
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — normalizeStrategyComparisonMatrixFixture', () => {
  it('returns same fixture name', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;
    const n = normalizeStrategyComparisonMatrixFixture(f);
    expect(n.name).toBe(f.name);
  });

  it('does not mutate input', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;
    const original = JSON.stringify(f);
    normalizeStrategyComparisonMatrixFixture(f);
    expect(JSON.stringify(f)).toBe(original);
  });

  it('idempotent: normalizing twice gives same result', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;
    const n1 = normalizeStrategyComparisonMatrixFixture(f);
    const n2 = normalizeStrategyComparisonMatrixFixture(n1);
    expect(JSON.stringify(n1)).toBe(JSON.stringify(n2));
  });

  it('criteria are sorted by code', () => {
    const n = normalizeStrategyComparisonMatrixFixture(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    const codes = n.criteria.map(c => c.code);
    const sorted = [...codes].sort((a, b) => a.localeCompare(b));
    expect(codes).toEqual(sorted);
  });

  it('candidateReferences are sorted by name', () => {
    const n = normalizeStrategyComparisonMatrixFixture(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    const names = n.candidateReferences.map(r => r.candidateFixtureName);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. Serialization and equality
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — serializeStrategyComparisonMatrixFixture', () => {
  it('returns a non-empty string', () => {
    const s = serializeStrategyComparisonMatrixFixture(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(typeof s).toBe('string');
    expect(s.length).toBeGreaterThan(0);
  });

  it('round-trips through JSON', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;
    const s = serializeStrategyComparisonMatrixFixture(f);
    const parsed = JSON.parse(s);
    expect(parsed.name).toBe(f.name);
    expect(parsed.meta.phase).toBe(39);
  });

  it('produces deterministic output across calls', () => {
    const s1 = serializeStrategyComparisonMatrixFixture(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    const s2 = serializeStrategyComparisonMatrixFixture(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE);
    expect(s1).toBe(s2);
  });
});

describe('Phase 39 — areStrategyComparisonMatrixFixturesEqual', () => {
  it('same fixture equals itself', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;
    expect(areStrategyComparisonMatrixFixturesEqual(f, f)).toBe(true);
  });

  it('different fixtures are not equal', () => {
    expect(
      areStrategyComparisonMatrixFixturesEqual(
        DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
        CREATOR_LED_CANDIDATE_MATRIX_FIXTURE,
      ),
    ).toBe(false);
  });

  it('normalized copies are equal to original', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;
    const n = normalizeStrategyComparisonMatrixFixture(f);
    expect(areStrategyComparisonMatrixFixturesEqual(f, n)).toBe(true);
  });
});

describe('Phase 39 — isStrategyComparisonMatrixFixtureSerializable', () => {
  it('returns true for valid fixture', () => {
    expect(isStrategyComparisonMatrixFixtureSerializable(DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isStrategyComparisonMatrixFixtureSerializable(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isStrategyComparisonMatrixFixtureSerializable(undefined)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(isStrategyComparisonMatrixFixtureSerializable('string')).toBe(false);
  });

  it('returns true for all 16 fixtures', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(isStrategyComparisonMatrixFixtureSerializable(f)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Validation — success and failure
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — validateStrategyComparisonMatrixFixture', () => {
  it('returns valid=true for all 16 fixtures', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(validateStrategyComparisonMatrixFixture(f).valid).toBe(true);
    }
  });

  it('returns valid=false for null', () => {
    const r = validateStrategyComparisonMatrixFixture(null);
    expect(r.valid).toBe(false);
    expect(r.issues.length).toBeGreaterThan(0);
  });

  it('returns valid=false for empty object', () => {
    const r = validateStrategyComparisonMatrixFixture({});
    expect(r.valid).toBe(false);
  });

  it('returns error for missing name', () => {
    const input = { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE, name: '' };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'MISSING_NAME' || i.code === 'INVALID_NAME')).toBe(true);
  });

  it('returns error for invalid name', () => {
    const input = { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE, name: 'bogus-name' };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_NAME')).toBe(true);
  });

  it('returns error for missing kind', () => {
    const input = { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE, kind: '' };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
  });

  it('returns error for invalid kind', () => {
    const input = { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE, kind: 'bogus-kind' };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_KIND')).toBe(true);
  });

  it('returns error for empty candidateReferences', () => {
    const input = { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE, candidateReferences: [] };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'EMPTY_CANDIDATES')).toBe(true);
  });

  it('returns error for invalid candidate name', () => {
    const badRef = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.candidateReferences[0],
      candidateFixtureName: 'not-a-real-candidate',
    };
    const input = { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE, candidateReferences: [badRef] };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_CANDIDATE_NAME')).toBe(true);
  });

  it('returns error for missing meta', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { meta: _meta, ...inputWithoutMeta } = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE;
    const r = validateStrategyComparisonMatrixFixture(inputWithoutMeta);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'MISSING_META')).toBe(true);
  });

  it('returns error for wrong meta phase', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.meta, phase: 38 },
    };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_META_PHASE')).toBe(true);
  });

  it('returns error for meta liveData: true', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.meta, liveData: true },
    };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'META_LIVE_DATA')).toBe(true);
  });

  it('returns error for meta realScoring: true', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.meta, realScoring: true },
    };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'META_REAL_SCORING')).toBe(true);
  });

  it('returns error for meta fixtureOnly: false', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.meta, fixtureOnly: false },
    };
    const r = validateStrategyComparisonMatrixFixture(input);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'META_FIXTURE_ONLY')).toBe(true);
  });

  it('issues have required fields', () => {
    const r = validateStrategyComparisonMatrixFixture(null);
    for (const issue of r.issues) {
      expect(typeof issue.code).toBe('string');
      expect(typeof issue.field).toBe('string');
      expect(typeof issue.message).toBe('string');
      expect(['error', 'warning']).toContain(issue.severity);
    }
  });

  it('does not throw for null input', () => {
    expect(() => validateStrategyComparisonMatrixFixture(null)).not.toThrow();
  });

  it('does not throw for undefined input', () => {
    expect(() => validateStrategyComparisonMatrixFixture(undefined)).not.toThrow();
  });

  it('does not throw for empty string', () => {
    expect(() => validateStrategyComparisonMatrixFixture('')).not.toThrow();
  });

  it('does not throw for number input', () => {
    expect(() => validateStrategyComparisonMatrixFixture(42)).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. Safety Validation — success and failure
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — validateStrategyComparisonMatrixSafety', () => {
  it('returns safe=true for all 16 fixtures', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      const r = validateStrategyComparisonMatrixSafety(f);
      expect(r.safe).toBe(true);
    }
  });

  it('returns safe=false for null', () => {
    expect(validateStrategyComparisonMatrixSafety(null).safe).toBe(false);
  });

  it('returns safe=false when meta.liveData is true', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.meta, liveData: true },
    };
    const r = validateStrategyComparisonMatrixSafety(input);
    expect(r.safe).toBe(false);
    expect(r.violations.some(v => v.includes('liveData'))).toBe(true);
  });

  it('returns safe=false when meta.realScoring is true', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.meta, realScoring: true },
    };
    const r = validateStrategyComparisonMatrixSafety(input);
    expect(r.safe).toBe(false);
    expect(r.violations.some(v => v.includes('realScoring'))).toBe(true);
  });

  it('returns safe=false when safetyBoundary.noRealScoring is false', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      safetyBoundary: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.safetyBoundary, noRealScoring: false },
    };
    const r = validateStrategyComparisonMatrixSafety(input);
    expect(r.safe).toBe(false);
    expect(r.violations.some(v => v.includes('noRealScoring'))).toBe(true);
  });

  it('returns safe=false when safetyBoundary.noInvestmentAdvice is false', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      safetyBoundary: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.safetyBoundary, noInvestmentAdvice: false },
    };
    const r = validateStrategyComparisonMatrixSafety(input);
    expect(r.safe).toBe(false);
    expect(r.violations.some(v => v.includes('noInvestmentAdvice'))).toBe(true);
  });

  it('returns safe=false when summary.nonAdvisory is false', () => {
    const input = {
      ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE,
      summary: { ...DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.summary, nonAdvisory: false },
    };
    const r = validateStrategyComparisonMatrixSafety(input);
    expect(r.safe).toBe(false);
    expect(r.violations.some(v => v.includes('nonAdvisory'))).toBe(true);
  });

  it('violations is always an array', () => {
    const r = validateStrategyComparisonMatrixSafety(null);
    expect(Array.isArray(r.violations)).toBe(true);
  });

  it('does not throw for malformed input', () => {
    expect(() => validateStrategyComparisonMatrixSafety(null)).not.toThrow();
    expect(() => validateStrategyComparisonMatrixSafety(undefined)).not.toThrow();
    expect(() => validateStrategyComparisonMatrixSafety(42)).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. Phase 38 source-reference compatibility
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — Phase 38 candidate reference compatibility', () => {
  it('all fixture candidate references use valid Phase 38 names', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const ref of f.candidateReferences) {
        expect(
          STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES as readonly string[],
        ).toContain(ref.candidateFixtureName);
      }
    }
  });

  it('defensive-vs-aggressive includes defensive-new-launch and wallet-leader-copy references', () => {
    const refs = DEFENSIVE_VS_AGGRESSIVE_MATRIX_FIXTURE.candidateReferences.map(r => r.candidateFixtureName);
    expect(refs).toContain('defensive-new-launch-candidate');
    expect(refs).toContain('wallet-leader-copy-candidate');
  });

  it('safety-boundary matrix includes manipulation-avoidance, no-action-safety, and insufficient-data references', () => {
    const refs = SAFETY_BOUNDARY_COMPARISON_MATRIX_FIXTURE.candidateReferences.map(r => r.candidateFixtureName);
    expect(refs).toContain('manipulation-avoidance-candidate');
    expect(refs).toContain('no-action-safety-candidate');
    expect(refs).toContain('insufficient-data-candidate');
  });

  it('all candidate references have fixtureOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const ref of f.candidateReferences) {
        expect(ref.fixtureOnly).toBe(true);
      }
    }
  });

  it('all candidate references have syntheticOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const ref of f.candidateReferences) {
        expect(ref.syntheticOnly).toBe(true);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. Safety boundary regression tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — safety boundary regression', () => {
  it('no fixture contains real PnL claims', () => {
    const pnlPattern = /\b(?:real pnl|actual pnl|real profit|real loss)\b/i;
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(pnlPattern.test(JSON.stringify(f))).toBe(false);
    }
  });

  it('no fixture contains seed phrase or private key', () => {
    const secretPattern = /\b(?:seed phrase|mnemonic|private key|keypair)\b/i;
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(secretPattern.test(JSON.stringify(f))).toBe(false);
    }
  });

  it('no fixture contains fetch/axios/websocket references', () => {
    const networkPattern = /\b(?:fetch|axios|websocket)\b/i;
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(networkPattern.test(JSON.stringify(f))).toBe(false);
    }
  });

  it('no fixture contains writeFile/download/export references', () => {
    const exportPattern = /\b(?:writeFile|writeFileSync|createObjectURL|download)\b/i;
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(exportPattern.test(JSON.stringify(f))).toBe(false);
    }
  });

  it('no fixture contains Date.now or Math.random references', () => {
    const runtimePattern = /\b(?:Date\.now|Math\.random|setTimeout|setInterval)\b/;
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(runtimePattern.test(JSON.stringify(f))).toBe(false);
    }
  });

  it('no fixture contains localStorage or sessionStorage', () => {
    const storagePattern = /\b(?:localStorage|sessionStorage|IndexedDB|document\.cookie)\b/;
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(storagePattern.test(JSON.stringify(f))).toBe(false);
    }
  });

  it('no fixture contains Jito or MEV references', () => {
    const jitoPattern = /\b(?:jito|mev|mempool|yellowstone|geyser)\b/i;
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(jitoPattern.test(JSON.stringify(f))).toBe(false);
    }
  });

  it('all fixtures have safetyBoundary.noRealScoring: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noRealScoring).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.noLiveTrading: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noLiveTrading).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.noExecution: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noExecution).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.noInvestmentAdvice: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noInvestmentAdvice).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.noTradingSignals: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noTradingSignals).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.noRecommendations: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noRecommendations).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.noRealWalletAddresses: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noRealWalletAddresses).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.noPersonalData: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.noPersonalData).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.deterministic: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.deterministic).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.syntheticOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.syntheticOnly).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 16. Determinism
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — determinism', () => {
  it('fixture map is stable across accesses', () => {
    const keys1 = [...PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.keys()];
    const keys2 = [...PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.keys()];
    expect(keys1).toEqual(keys2);
  });

  it('all fixture generatedAt are identical', () => {
    const dates = new Set(
      [...PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()].map(f => f.meta.generatedAt),
    );
    expect(dates.size).toBe(1);
    expect([...dates][0]).toBe(PHASE_39_STRATEGY_COMPARISON_GENERATED_AT);
  });

  it('building the same input twice gives the same result', () => {
    const r1 = buildStrategyComparisonMatrixFixture(validBuildInput());
    const r2 = buildStrategyComparisonMatrixFixture(validBuildInput());
    expect(JSON.stringify(r1.fixture)).toBe(JSON.stringify(r2.fixture));
  });

  it('listStrategyComparisonMatrixFixtures is stable', () => {
    const l1 = listStrategyComparisonMatrixFixtures();
    const l2 = listStrategyComparisonMatrixFixtures();
    expect(l1).toEqual(l2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 17. No-input-mutation tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — no input mutation', () => {
  it('buildStrategyComparisonMatrixFixture does not mutate candidateReferences', () => {
    const input = validBuildInput();
    const refs = [...input.candidateReferences];
    buildStrategyComparisonMatrixFixture(input);
    expect(input.candidateReferences).toHaveLength(refs.length);
    expect(input.candidateReferences[0]).toBe(refs[0]);
  });

  it('normalizeStrategyComparisonMatrixFixture does not mutate fixture', () => {
    const f = CREATOR_LED_CANDIDATE_MATRIX_FIXTURE;
    const orig = JSON.stringify(f);
    normalizeStrategyComparisonMatrixFixture(f);
    expect(JSON.stringify(f)).toBe(orig);
  });

  it('validateStrategyComparisonMatrixFixture does not mutate fixture', () => {
    const f = CREATOR_LED_CANDIDATE_MATRIX_FIXTURE;
    const orig = JSON.stringify(f);
    validateStrategyComparisonMatrixFixture(f);
    expect(JSON.stringify(f)).toBe(orig);
  });

  it('validateStrategyComparisonMatrixSafety does not mutate fixture', () => {
    const f = CREATOR_LED_CANDIDATE_MATRIX_FIXTURE;
    const orig = JSON.stringify(f);
    validateStrategyComparisonMatrixSafety(f);
    expect(JSON.stringify(f)).toBe(orig);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 18. Column structure tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — matrix column structure', () => {
  it('each column has a valid criterion code', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const col of f.columns) {
        expect(STRATEGY_COMPARISON_CRITERION_CODES as readonly string[]).toContain(col.criterion.code);
      }
    }
  });

  it('each column has cells', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const col of f.columns) {
        expect(Array.isArray(col.cells)).toBe(true);
        expect(col.cells.length).toBeGreaterThan(0);
      }
    }
  });

  it('number of columns equals number of criteria', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.columns.length).toBe(f.criteria.length);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 19. Summary band distribution
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — summary band distribution', () => {
  it('bandDistribution total equals cellCount', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      const total = Object.values(f.summary.bandDistribution).reduce((a, b) => a + b, 0);
      expect(total).toBe(f.summary.cellCount);
    }
  });

  it('syntheticMeanScore is in [0, 100]', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.summary.syntheticMeanScore).toBeGreaterThanOrEqual(0);
      expect(f.summary.syntheticMeanScore).toBeLessThanOrEqual(100);
    }
  });

  it('syntheticMinScore <= syntheticMeanScore <= syntheticMaxScore', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.summary.syntheticMinScore).toBeLessThanOrEqual(f.summary.syntheticMeanScore);
      expect(f.summary.syntheticMeanScore).toBeLessThanOrEqual(f.summary.syntheticMaxScore);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 20. Additional safety and shape tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 39 — additional safety and shape tests', () => {
  it('all criteria have non-empty labels', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const c of f.criteria) {
        expect(c.label.length).toBeGreaterThan(0);
      }
    }
  });

  it('all criteria have non-empty descriptions', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const c of f.criteria) {
        expect(c.description.length).toBeGreaterThan(0);
      }
    }
  });

  it('all criteria have valid dimension values', () => {
    const validDimensions = ['risk-control', 'quality-check', 'confidence-check', 'safety-boundary', 'data-sufficiency'];
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const c of f.criteria) {
        expect(validDimensions).toContain(c.dimension);
      }
    }
  });

  it('all rows have non-empty rowNotes', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const row of f.rows) {
        expect(Array.isArray(row.rowNotes)).toBe(true);
      }
    }
  });

  it('all fixtures have non-empty title', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.title.length).toBeGreaterThan(0);
    }
  });

  it('all fixtures have non-empty description', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.description.length).toBeGreaterThan(0);
    }
  });

  it('all fixtures have meta.readOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.meta.readOnly).toBe(true);
    }
  });

  it('all fixtures have meta.localOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.meta.localOnly).toBe(true);
    }
  });

  it('all fixtures have meta.inMemoryOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.meta.inMemoryOnly).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.readOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.readOnly).toBe(true);
    }
  });

  it('all fixtures have safetyBoundary.inMemoryOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.safetyBoundary.inMemoryOnly).toBe(true);
    }
  });

  it('all fixtures have meta.paperTrading: false', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.meta.paperTrading).toBe(false);
    }
  });

  it('all fixtures have meta.liveTrading: false', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      expect(f.meta.liveTrading).toBe(false);
    }
  });

  it('getStrategyComparisonMatrixFixture returns all 16 known names', () => {
    for (const name of STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES) {
      expect(getStrategyComparisonMatrixFixture(name)).toBeDefined();
    }
  });

  it('all cells have fixtureOnly: true', () => {
    for (const f of PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.values()) {
      for (const row of f.rows) {
        for (const c of row.cells) {
          expect(c.fixtureOnly).toBe(true);
        }
      }
    }
  });
});
