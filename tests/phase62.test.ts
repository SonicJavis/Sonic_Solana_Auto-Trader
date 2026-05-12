/**
 * Phase 62 — Synthetic Strategy Comparison Lab v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS,
  SYNTHETIC_STRATEGY_VARIANT_IDS,
  SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURE_MAP,
  listSyntheticStrategyComparisonLabFixtures,
  getSyntheticStrategyComparisonLabFixture,
  buildSyntheticStrategyComparisonLabFixture,
  buildSyntheticStrategyVariant,
  buildSyntheticStrategyScenarioMatrix,
  buildSyntheticStrategyComparisonRun,
  buildSyntheticStrategyComparisonScorecard,
  buildSyntheticStrategyComparisonAggregate,
  buildSyntheticStrategyComparisonLabViewModel,
  buildSyntheticStrategyComparisonLabApiContract,
  selectSyntheticStrategyComparisonLabFixture,
  selectSyntheticStrategyComparisonLabViewModel,
  selectSyntheticStrategyComparisonLabAggregate,
  selectSyntheticStrategyComparisonLabApiSummary,
  validateSyntheticStrategyComparisonLabFixture,
  validateSyntheticStrategyComparisonLabSafety,
  normalizeSyntheticStrategyComparisonLabFixture,
  serializeSyntheticStrategyComparisonLabFixture,
  areSyntheticStrategyComparisonLabFixturesEqual,
  stableDeterministicSyntheticStrategyComparisonLabChecksum,
  getSyntheticStrategyComparisonLabCapabilities,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION,
} from '../apps/dashboard/src/synthetic-strategy-comparison-lab/index.js';
import {
  PAPER_EXECUTION_QUALITY_METRIC_NAMES,
  PAPER_EXECUTION_QUALITY_METRIC_FIXTURES,
} from '../apps/dashboard/src/paper-execution-quality-metrics/index.js';
import {
  SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE as ROOT_PHASE,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_62_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/synthetic-strategy-comparison-lab');
const PHASE_62_FILES = [
  'types.ts',
  'strategy-variants.ts',
  'scenario-matrix.ts',
  'comparison-runs.ts',
  'scorecards.ts',
  'sensitivity.ts',
  'builders.ts',
  'fixtures.ts',
  'aggregators.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 62 — source file existence', () => {
  for (const file of PHASE_62_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_62_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }
});

describe('Phase 62 — constants, fixtures, root exports', () => {
  it('constants and root exports align', () => {
    expect(SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE).toBe(62);
    expect(ROOT_PHASE).toBe(62);
    expect(ROOT_FIXTURES).toEqual(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES);
  });

  it('has deterministic fixture names, kinds, variants, and warnings', () => {
    expect(SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES).toHaveLength(8);
    expect(SYNTHETIC_STRATEGY_COMPARISON_LAB_KINDS).toHaveLength(8);
    expect(SYNTHETIC_STRATEGY_VARIANT_IDS).toHaveLength(4);
    expect(SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS).toContain('comparison_not_live_predictive');
    expect(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES).toHaveLength(8);
  });

  it('map/list/get helpers are deterministic', () => {
    expect(listSyntheticStrategyComparisonLabFixtures()).toEqual(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES);
    for (const fixture of SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES) {
      expect(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getSyntheticStrategyComparisonLabFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getSyntheticStrategyComparisonLabFixture('missing')).toBeNull();
  });
});

describe('Phase 62 — source linkage and deterministic structure', () => {
  it('links each fixture to a valid Phase 61 metric fixture', () => {
    for (const fixture of SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES) {
      expect((PAPER_EXECUTION_QUALITY_METRIC_NAMES as readonly string[])).toContain(
        fixture.sourceMetricFixtureName,
      );
      expect(fixture.comparisonIdentity.sourceMetricFixtureName).toBe(fixture.sourceMetricFixtureName);
      expect(fixture.schemaVersion).toBe(PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION);
      expect(fixture.meta.generatedAt).toBe(PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT);
      expect(fixture.meta.source).toBe(PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE);
    }
  });

  it('covers practical Phase 61 fixtures with one comparison fixture per metric fixture', () => {
    const sourceNames = SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES.map(fixture => fixture.sourceMetricFixtureName);
    for (const metricFixture of PAPER_EXECUTION_QUALITY_METRIC_FIXTURES) {
      expect(sourceNames).toContain(metricFixture.fixtureName);
    }
  });

  it('each scenario has identical inputs across variants', () => {
    for (const fixture of SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES) {
      const scenario = fixture.scenarioMatrix.scenarioCases[0]!;
      const snapshots = Object.values(scenario.variantInputSnapshots);
      expect(snapshots).toHaveLength(4);
      expect(new Set(snapshots.map(snapshot => JSON.stringify(snapshot))).size).toBe(1);
    }
  });
});

describe('Phase 62 — builders and selectors', () => {
  it('fixture builder is deterministic', () => {
    const a = buildSyntheticStrategyComparisonLabFixture({
      fixtureName: 'clean-launch-synthetic-strategy-comparison-lab',
    });
    const b = buildSyntheticStrategyComparisonLabFixture({
      fixtureName: 'clean-launch-synthetic-strategy-comparison-lab',
    });
    expect(a).toEqual(b);
  });

  it('variant, scenario, scorecard, run, aggregate, view model, contract, and selectors are deterministic', () => {
    const fixture = SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0]!;
    const variant = buildSyntheticStrategyVariant('conservative_safety_first');
    expect(variant.executable).toBe(false);
    expect(variant.advisory).toBe(false);

    const matrix = buildSyntheticStrategyScenarioMatrix({
      fixtureId: 'fixture-id',
      fixtureName: fixture.fixtureName,
      fixtureKind: fixture.fixtureKind,
      sourceMetricFixture: PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!,
      variants: fixture.strategyVariants,
    });
    expect(matrix.scenarioCases).toHaveLength(1);

    const scorecards = fixture.strategyVariants.map(variantItem =>
      buildSyntheticStrategyComparisonScorecard({
        fixtureId: 'fixture-id',
        variantId: variantItem.variantId,
        scenario: matrix.scenarioCases[0]!,
        sourceMetricFixtureName: PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!.fixtureName,
        sourceRiskBand: PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!.sourceRiskBand,
        sourceQualityBand: PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!.scorecard.aggregateQualityBand,
      }),
    );

    const runResult = buildSyntheticStrategyComparisonRun({
      fixtureId: 'fixture-id',
      variants: fixture.strategyVariants,
      scenarioMatrix: matrix,
      scorecards,
    });
    expect(runResult.run.comparisonRows).toHaveLength(4);
    expect(runResult.rankedScorecards.every(scorecard => scorecard.relativeRank > 0)).toBe(true);

    const aggregate = buildSyntheticStrategyComparisonAggregate({
      fixtureId: 'fixture-id',
      fixtureName: fixture.fixtureName,
      fixtureKind: fixture.fixtureKind,
      scorecards: runResult.rankedScorecards,
      rows: runResult.run.comparisonRows,
    });
    expect(Object.values(aggregate.countByVariant).reduce((sum, value) => sum + value, 0)).toBe(4);

    const viewModel = buildSyntheticStrategyComparisonLabViewModel(fixture);
    const contracts = buildSyntheticStrategyComparisonLabApiContract({ ...fixture, viewModel });
    expect(contracts.list.contractKind).toBe('list');
    expect(contracts.detail.contractKind).toBe('detail');
    expect(contracts.summary.contractKind).toBe('summary');

    const selector = selectSyntheticStrategyComparisonLabFixture({ fixtureId: fixture.fixtureId });
    expect(selector.matched).toBe(true);
    expect(selectSyntheticStrategyComparisonLabViewModel(fixture)).toEqual(fixture.viewModel);
    expect(selectSyntheticStrategyComparisonLabAggregate(fixture)).toEqual(fixture.aggregateSummary);
    expect(selectSyntheticStrategyComparisonLabApiSummary(fixture)).toEqual(fixture.apiContracts.summary);
  });
});

describe('Phase 62 — normalization, serialization, equality', () => {
  it('normalization and equality are deterministic', () => {
    const base = clone(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0]!);
    const scrambled = {
      ...clone(base),
      strategyVariants: [...base.strategyVariants].reverse(),
      scorecards: [...base.scorecards].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
    };
    expect(normalizeSyntheticStrategyComparisonLabFixture(scrambled)).toEqual(
      normalizeSyntheticStrategyComparisonLabFixture(base),
    );
    expect(serializeSyntheticStrategyComparisonLabFixture(scrambled)).toBe(
      serializeSyntheticStrategyComparisonLabFixture(base),
    );
    expect(areSyntheticStrategyComparisonLabFixturesEqual(scrambled, base)).toBe(true);
  });

  it('checksum helper is stable', () => {
    const checksum = stableDeterministicSyntheticStrategyComparisonLabChecksum('phase62-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicSyntheticStrategyComparisonLabChecksum('phase62-check')).toBe(checksum);
  });
});

describe('Phase 62 — validation and safety failures', () => {
  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES) {
      const result = validateSyntheticStrategyComparisonLabFixture(fixture);
      if (!result.valid) throw new Error(JSON.stringify(result.issues));
      expect(result.valid).toBe(true);
      expect(validateSyntheticStrategyComparisonLabSafety(fixture)).toEqual({ safe: true, violations: [] });
    }
  });

  it('validation rejects missing source metric reference', () => {
    const fixture = { ...clone(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0]!), sourceMetricFixtureName: 'missing' };
    const result = validateSyntheticStrategyComparisonLabFixture(fixture as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'MISSING_SOURCE_METRIC_FIXTURE')).toBe(true);
  });

  it('validation rejects invalid strategy variant', () => {
    const fixture = clone(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0]!);
    fixture.strategyVariants[0]!.variantId = 'invalid_variant' as never;
    const result = validateSyntheticStrategyComparisonLabFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_STRATEGY_VARIANT')).toBe(true);
  });

  it('validation rejects inconsistent scenario matrix and non-identical scenario inputs', () => {
    const fixture = clone(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0]!);
    const scenario = fixture.scenarioMatrix.scenarioCases[0]!;
    scenario.variantInputSnapshots.evidence_weighted = {
      ...scenario.variantInputSnapshots.evidence_weighted,
      fillStatus: 'changed',
    } as never;
    const result = validateSyntheticStrategyComparisonLabFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'NON_IDENTICAL_SCENARIO_INPUTS')).toBe(true);
  });

  it('validation rejects invalid score/rank', () => {
    const fixture = clone(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0]!);
    fixture.scorecards[0]!.aggregateFixtureScore = -1;
    fixture.scorecards[0]!.relativeRank = 0;
    const result = validateSyntheticStrategyComparisonLabFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_SCORE_VALUE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'INVALID_SCORE_RANK')).toBe(true);
  });

  it('validation rejects unsafe advisory/provider/wallet/transaction/order text', () => {
    const fixture = clone(SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0]!);
    fixture.scorecards[0]!.validationSummary = 'buy now provider sendTransaction wallet real order';
    const result = validateSyntheticStrategyComparisonLabFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_ADVISORY_LANGUAGE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_PROVIDER_REFERENCE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_TRANSACTION_REFERENCE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_WALLET_REFERENCE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_ORDER_REFERENCE')).toBe(true);
  });
});

describe('Phase 62 — capabilities and safety scans', () => {
  it('module capability flags are correct', () => {
    const caps = getSyntheticStrategyComparisonLabCapabilities();
    expect(caps.syntheticStrategyComparisonLab).toBe(true);
    expect(caps.syntheticStrategyComparisonRecommendations).toBe(false);
    expect(caps.syntheticStrategyComparisonRealPnL).toBe(false);
  });

  it('dashboard and read-only-api capabilities include Phase 62 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['syntheticStrategyComparisonLab']).toBe(true);
    const dashboardCapsSource = readFileSync(resolve(REPO_ROOT, 'apps/dashboard/src/capabilities.ts'), 'utf-8');
    expect(dashboardCapsSource.toLowerCase()).not.toContain('websocket');

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['syntheticStrategyComparisonLab']).toBe(true);
    expect(apiCaps['syntheticStrategyComparisonWebSocketAccess']).toBe(false);
  });

  it('phase files avoid nondeterministic and runtime primitives', () => {
    for (const file of PHASE_62_FILES) {
      const content = readFileSync(resolve(PHASE_62_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/randomUUID\(/);
      expect(content).not.toMatch(/process\.env/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
      if (file !== 'validation.ts') {
        expect(content).not.toMatch(/fetch\(/);
        expect(content).not.toMatch(/writeFile\(/);
        expect(content).not.toMatch(/createWriteStream\(/);
        expect(content).not.toMatch(/document\./);
        expect(content).not.toMatch(/window\./);
      }
    }
  });

  it('constants remain deterministic and Phase 63 remains preview-only', () => {
    expect(PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
    expect(PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE).toBe('phase62_synthetic_strategy_comparison_lab_v1');
    expect(PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION).toBe('1.0.0');
  });
});
