/**
 * Phase 61 — Paper Execution Quality Metrics v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PAPER_EXECUTION_QUALITY_METRICS_PHASE,
  PAPER_EXECUTION_QUALITY_METRIC_NAMES,
  PAPER_EXECUTION_QUALITY_METRIC_KINDS,
  PAPER_EXECUTION_LATENCY_BUCKETS,
  PAPER_EXECUTION_FILL_STATUSES,
  PAPER_EXECUTION_SLIPPAGE_BUCKETS,
  PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS,
  PAPER_EXECUTION_QUALITY_BANDS,
  PAPER_EXECUTION_QUALITY_METRIC_FIXTURES,
  PAPER_EXECUTION_QUALITY_METRIC_FIXTURE_MAP,
  listPaperExecutionQualityMetricFixtures,
  getPaperExecutionQualityMetricFixture,
  buildPaperExecutionQualityMetricFixture,
  buildPaperLatencyMetrics,
  buildPaperFillQualityMetrics,
  buildPaperSlippageMetrics,
  buildPaperRejectionMetrics,
  buildPaperExecutionQualityScorecard,
  aggregatePaperExecutionQualityMetrics,
  buildPaperExecutionQualityMetricsViewModel,
  buildPaperExecutionQualityMetricsApiContract,
  selectPaperExecutionQualityMetricFixture,
  selectPaperExecutionQualityScorecard,
  selectPaperExecutionQualityAggregateSummary,
  selectPaperExecutionQualityMetricsViewModel,
  selectPaperExecutionQualityMetricsApiSummary,
  validatePaperExecutionQualityMetricFixture,
  validatePaperExecutionQualityMetricsSafety,
  normalizePaperExecutionQualityMetricFixture,
  serializePaperExecutionQualityMetricFixture,
  arePaperExecutionQualityMetricFixturesEqual,
  stableDeterministicPaperExecutionQualityMetricsChecksum,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION,
} from '../apps/dashboard/src/paper-execution-quality-metrics/index.js';
import {
  PAPER_EXECUTION_QUALITY_METRICS_PHASE as ROOT_PHASE,
  PAPER_EXECUTION_QUALITY_METRIC_FIXTURES as ROOT_FIXTURES,
  listPaperExecutionQualityMetricFixtures as rootListFixtures,
} from '../apps/dashboard/src/index.js';
import {
  PAPER_SNIPER_SIMULATION_FIXTURES,
  PAPER_SNIPER_SIMULATION_NAMES,
} from '../apps/dashboard/src/paper-sniper-simulation/index.js';
import { RISK_EXPLANATION_EVIDENCE_NAMES } from '../apps/dashboard/src/risk-explanation-evidence/index.js';
import { LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES } from '../apps/dashboard/src/launch-risk-engine/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../apps/dashboard/src/synthetic-event-stream-replay-harness/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../apps/dashboard/src/synthetic-event-stream-lifecycle/index.js';
import { getPaperExecutionQualityMetricsCapabilities } from '../apps/dashboard/src/paper-execution-quality-metrics/capabilities.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_61_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/paper-execution-quality-metrics');
const PHASE_61_FILES = [
  'types.ts',
  'latency-metrics.ts',
  'fill-quality-metrics.ts',
  'slippage-metrics.ts',
  'rejection-metrics.ts',
  'builders.ts',
  'fixtures.ts',
  'aggregators.ts',
  'scorecards.ts',
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

describe('Phase 61 — source file existence', () => {
  for (const file of PHASE_61_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_61_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/PAPER_EXECUTION_QUALITY_METRICS.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/PAPER_EXECUTION_QUALITY_METRICS.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
    expect(content).toContain('Phase 62 — Synthetic Strategy Comparison Lab v1');
  });
});

describe('Phase 61 — constants, count, map/list/get, root exports', () => {
  it('constants and root exports align', () => {
    expect(PAPER_EXECUTION_QUALITY_METRICS_PHASE).toBe(61);
    expect(ROOT_PHASE).toBe(61);
    expect(ROOT_FIXTURES).toEqual(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES);
  });

  it('has deterministic names, kinds, fixtures, and bucket taxonomies', () => {
    expect(PAPER_EXECUTION_QUALITY_METRIC_NAMES).toHaveLength(8);
    expect(PAPER_EXECUTION_QUALITY_METRIC_KINDS).toHaveLength(8);
    expect(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES).toHaveLength(8);
    expect(PAPER_EXECUTION_LATENCY_BUCKETS).toContain('critical');
    expect(PAPER_EXECUTION_FILL_STATUSES).toContain('hypothetical_rejected');
    expect(PAPER_EXECUTION_SLIPPAGE_BUCKETS).toContain('extreme');
    expect(PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS).toContain('quality_rejected_safety');
    expect(PAPER_EXECUTION_QUALITY_BANDS).toContain('quality_rejected');
  });

  it('map/list/get helpers are deterministic', () => {
    expect(rootListFixtures()).toEqual(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES);
    expect(listPaperExecutionQualityMetricFixtures()).toEqual(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES);
    for (const fixture of PAPER_EXECUTION_QUALITY_METRIC_FIXTURES) {
      expect(PAPER_EXECUTION_QUALITY_METRIC_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getPaperExecutionQualityMetricFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getPaperExecutionQualityMetricFixture('missing')).toBeNull();
  });
});

describe('Phase 61 — source linkage to phases 60/59/58/57/56', () => {
  it('fixtures link to valid source fixture names', () => {
    for (const fixture of PAPER_EXECUTION_QUALITY_METRIC_FIXTURES) {
      expect((PAPER_SNIPER_SIMULATION_NAMES as readonly string[])).toContain(
        fixture.sourceSimulationFixtureName,
      );
      expect((RISK_EXPLANATION_EVIDENCE_NAMES as readonly string[])).toContain(
        fixture.sourceEvidenceFixtureName,
      );
      expect((LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[])).toContain(
        fixture.sourceRiskFixtureName,
      );
      expect((SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[])).toContain(
        fixture.sourceReplayFixtureName,
      );
      expect((SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[])).toContain(
        fixture.sourceLifecycleFixtureName,
      );
      expect(fixture.schemaVersion).toBe(PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION);
      expect(fixture.metricsIdentity.generatedAt).toBe(
        PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
      );
    }
  });

  it('covers every practical Phase 60 paper sniper simulation fixture', () => {
    const sourceNames = PAPER_EXECUTION_QUALITY_METRIC_FIXTURES.map(
      fixture => fixture.sourceSimulationFixtureName,
    );
    for (const phase60 of PAPER_SNIPER_SIMULATION_FIXTURES) {
      expect(sourceNames).toContain(phase60.fixtureName);
    }
  });
});

describe('Phase 61 — builders, scorecards, aggregates, view-models, contracts, selectors', () => {
  it('fixture builder is deterministic', () => {
    const a = buildPaperExecutionQualityMetricFixture({
      fixtureName: 'clean-launch-paper-execution-quality-metrics',
    });
    const b = buildPaperExecutionQualityMetricFixture({
      fixtureName: 'clean-launch-paper-execution-quality-metrics',
    });
    expect(a).toEqual(b);
  });

  it('metric builders return deterministic shapes', () => {
    const latency = buildPaperLatencyMetrics({ fixtureId: 'fixture-1', sourceLatencyBucket: 'standard' });
    const fill = buildPaperFillQualityMetrics({
      fixtureId: 'fixture-1',
      sourceOutcomeStatus: 'simulated_partial_fill',
      sourceFailureReason: 'liquidity_failure',
      sourceOutcomeId: 'outcome-1',
    });
    const slippage = buildPaperSlippageMetrics({
      fixtureId: 'fixture-1',
      sourceSlippageBucket: 'medium',
      sourceLiquidityBucket: 'thin',
    });
    const rejection = buildPaperRejectionMetrics({
      fixtureId: 'fixture-1',
      sourceRiskBand: 'elevated',
      sourceFailureBucket: 'elevated',
      sourceOutcomeStatus: 'simulated_partial_fill',
      sourceFailureReason: 'liquidity_failure',
    });
    const scorecard = buildPaperExecutionQualityScorecard({
      fixtureId: 'fixture-1',
      sourceSimulationFixtureName: 'thin-liquidity-paper-sniper-simulation',
      latencyMetrics: latency,
      fillQualityMetrics: fill,
      slippageMetrics: slippage,
      rejectionMetrics: rejection,
    });
    expect(latency.latencyQualityLabel).toBe('quality_excellent');
    expect(fill.hypotheticalFillStatus).toBe('hypothetical_fill_partial');
    expect(slippage.syntheticPriceImpactBucket).toBe('moderate');
    expect(rejection.rejectionTaxonomyKind).toBe('quality_no_rejection');
    expect(scorecard.aggregateQualityBand).toBe('quality_strong');
  });

  it('aggregate, view-model, contract, and selector helpers are deterministic', () => {
    const fixture = PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!;
    const aggregate = aggregatePaperExecutionQualityMetrics(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES);
    const viewA = buildPaperExecutionQualityMetricsViewModel(fixture);
    const viewB = buildPaperExecutionQualityMetricsViewModel(fixture);
    const contracts = buildPaperExecutionQualityMetricsApiContract({ ...fixture, viewModel: viewA });
    const selected = selectPaperExecutionQualityMetricFixture({ fixtureId: fixture.fixtureId });

    expect(aggregate).toEqual(fixture.aggregateSummary);
    expect(viewA).toEqual(viewB);
    expect(contracts.list.contractKind).toBe('list');
    expect(contracts.detail.contractKind).toBe('detail');
    expect(contracts.summary.contractKind).toBe('summary');
    expect(selected.matched).toBe(true);
    expect(selectPaperExecutionQualityScorecard(fixture)).toEqual(fixture.scorecard);
    expect(selectPaperExecutionQualityAggregateSummary(fixture)).toEqual(fixture.aggregateSummary);
    expect(selectPaperExecutionQualityMetricsViewModel(fixture)).toEqual(fixture.viewModel);
    expect(selectPaperExecutionQualityMetricsApiSummary(fixture)).toEqual(fixture.apiContracts.summary);
  });

  it('aggregate counts sum to fixture count without strategy ranking', () => {
    const aggregate = aggregatePaperExecutionQualityMetrics(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES);
    expect(Object.values(aggregate.countByLatencyBucket).reduce((sum, value) => sum + value, 0)).toBe(8);
    expect(Object.values(aggregate.countBySlippageBucket).reduce((sum, value) => sum + value, 0)).toBe(8);
    expect(Object.values(aggregate.countByFillStatus).reduce((sum, value) => sum + value, 0)).toBe(8);
    expect(Object.values(aggregate.aggregateQualityDistribution).reduce((sum, value) => sum + value, 0)).toBe(8);
    expect(aggregate.nonAdvisorySummary.toLowerCase()).not.toContain('recommend');
  });
});

describe('Phase 61 — normalization, serialization, equality, determinism', () => {
  it('normalization/serialization/equality are deterministic', () => {
    const base = clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!);
    const scrambled = {
      ...clone(base),
      scorecard: {
        ...base.scorecard,
        qualityWarnings: [...base.scorecard.qualityWarnings].reverse(),
        limitationNotes: [...base.scorecard.limitationNotes].reverse(),
        sourceEvidenceReferenceIds: [...base.scorecard.sourceEvidenceReferenceIds].reverse(),
      },
      selectorExamples: [...base.selectorExamples].reverse(),
    };
    expect(normalizePaperExecutionQualityMetricFixture(scrambled)).toEqual(
      normalizePaperExecutionQualityMetricFixture(base),
    );
    expect(serializePaperExecutionQualityMetricFixture(scrambled)).toBe(
      serializePaperExecutionQualityMetricFixture(base),
    );
    expect(arePaperExecutionQualityMetricFixturesEqual(scrambled, base)).toBe(true);
  });

  it('deterministic checksum helper is stable', () => {
    const checksum = stableDeterministicPaperExecutionQualityMetricsChecksum('phase61-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicPaperExecutionQualityMetricsChecksum('phase61-check')).toBe(checksum);
  });

  it('source immutability holds when mutating a clone', () => {
    const source = PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!;
    const copy = clone(source);
    copy.scorecard.nonAdvisorySummary = 'mutated';
    expect(source.scorecard.nonAdvisorySummary).not.toBe('mutated');
  });
});

describe('Phase 61 — validation and safety', () => {
  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of PAPER_EXECUTION_QUALITY_METRIC_FIXTURES) {
      const result = validatePaperExecutionQualityMetricFixture(fixture);
      if (!result.valid) {
        throw new Error(`Validation failed for: ${fixture.fixtureName}: ${JSON.stringify(result.issues)}`);
      }
      expect(result.valid).toBe(true);
      expect(validatePaperExecutionQualityMetricsSafety(fixture)).toEqual({ safe: true, violations: [] });
    }
  });

  it('validation rejects missing source simulation reference', () => {
    const fixture = { ...clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!), sourceSimulationFixtureName: 'missing' };
    const result = validatePaperExecutionQualityMetricFixture(fixture as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'MISSING_SOURCE_SIMULATION_FIXTURE')).toBe(true);
  });

  it('validation rejects invalid latency bucket', () => {
    const fixture = clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!);
    fixture.latencyMetrics.latencyBucket = 'invalid' as never;
    const result = validatePaperExecutionQualityMetricFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_LATENCY_BUCKET')).toBe(true);
  });

  it('validation rejects invalid slippage bucket', () => {
    const fixture = clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!);
    fixture.slippageMetrics.simulatedSlippageBucket = 'invalid' as never;
    const result = validatePaperExecutionQualityMetricFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_SLIPPAGE_BUCKET')).toBe(true);
  });

  it('validation rejects invalid fill status', () => {
    const fixture = clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!);
    fixture.fillQualityMetrics.hypotheticalFillStatus = 'invalid' as never;
    const result = validatePaperExecutionQualityMetricFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_FILL_STATUS')).toBe(true);
  });

  it('validation rejects invalid rejection taxonomy', () => {
    const fixture = clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!);
    fixture.rejectionMetrics.rejectionTaxonomyKind = 'invalid' as never;
    const result = validatePaperExecutionQualityMetricFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_REJECTION_TAXONOMY')).toBe(true);
  });

  it('validation rejects unsafe advisory text', () => {
    const fixture = clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!);
    fixture.scorecard.nonAdvisorySummary = 'buy now profit opportunity';
    const result = validatePaperExecutionQualityMetricFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_ADVISORY_LANGUAGE')).toBe(true);
  });

  it('validation rejects real order/fill/wallet/transaction/provider references', () => {
    const fixture = clone(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0]!);
    fixture.scorecard.validationSummary = 'provider sendTransaction wallet real order fill id';
    const result = validatePaperExecutionQualityMetricFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_PROVIDER_REFERENCE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_TRANSACTION_REFERENCE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_WALLET_REFERENCE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_ORDER_REFERENCE')).toBe(true);
  });
});

describe('Phase 61 — capabilities and propagation', () => {
  it('module capability flags are correct', () => {
    const caps = getPaperExecutionQualityMetricsCapabilities();
    expect(caps.paperExecutionQualityMetrics).toBe(true);
    expect(caps.paperExecutionQualityScorecards).toBe(true);
    expect(caps.paperExecutionQualityNetworkAccess).toBe(false);
    expect(caps.paperExecutionQualityExecution).toBe(false);
    expect(caps.paperExecutionQualityRealOrders).toBe(false);
  });

  it('dashboard and read-only-api capabilities include Phase 61 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['paperExecutionQualityMetrics']).toBe(true);
    expect(dashboardCaps['paperExecutionQualityExecution']).toBe(false);
    const dashboardCapsSource = readFileSync(
      resolve(REPO_ROOT, 'apps/dashboard/src/capabilities.ts'),
      'utf-8',
    );
    expect(dashboardCapsSource.toLowerCase()).not.toContain('websocket');

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['paperExecutionQualityMetrics']).toBe(true);
    expect(apiCaps['paperExecutionQualityWebSocketAccess']).toBe(false);
    expect(apiCaps['paperExecutionQualityExecution']).toBe(false);
  });
});

describe('Phase 61 — safety scan and deterministic constants', () => {
  it('phase files avoid nondeterministic/network/runtime primitives', () => {
    for (const file of PHASE_61_FILES) {
      const content = readFileSync(resolve(PHASE_61_SRC, file), 'utf-8');
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
        expect(content).not.toMatch(/localStorage\./);
        expect(content).not.toMatch(/indexedDB\./);
        expect(content).not.toMatch(/listen\(/);
      }
    }
  });

  it('module constants remain deterministic', () => {
    expect(PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT).toBe('2026-05-11T00:00:00.000Z');
    expect(PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE).toBe(
      'phase61_paper_execution_quality_metrics_v1',
    );
    expect(PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION).toBe('1.0.0');
  });

  it('fixtures remain hypothetical-only and non-advisory', () => {
    for (const fixture of PAPER_EXECUTION_QUALITY_METRIC_FIXTURES) {
      expect(fixture.safety.hypotheticalOnly).toBe(true);
      expect(fixture.safety.noNetworkAccess).toBe(true);
      expect(fixture.safety.notASignal).toBe(true);
      expect(fixture.capabilityFlags.paperExecutionQualityStrategySelection).toBe(false);
      expect(fixture.capabilityFlags.paperExecutionQualityLiveExecution).toBe(false);
      expect(fixture.capabilityFlags.paperExecutionQualityRealFunds).toBe(false);
      expect(fixture.scorecard.nonAdvisorySummary.toLowerCase()).not.toContain('profit');
      expect(fixture.scorecard.nonAdvisorySummary.toLowerCase()).not.toContain('recommend');
    }
  });
});
