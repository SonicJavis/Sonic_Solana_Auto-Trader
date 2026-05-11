/**
 * Phase 60 — Paper Sniper Simulation Foundation v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PAPER_SNIPER_SIMULATION_PHASE,
  PAPER_SNIPER_SIMULATION_NAMES,
  PAPER_SNIPER_SIMULATION_KINDS,
  PAPER_SNIPER_MARKET_LIQUIDITY_BUCKETS,
  PAPER_SNIPER_MARKET_VOLATILITY_BUCKETS,
  PAPER_SNIPER_LATENCY_BUCKETS,
  PAPER_SNIPER_SLIPPAGE_BUCKETS,
  PAPER_SNIPER_FAILURE_BUCKETS,
  PAPER_SNIPER_SIMULATION_FIXTURES,
  PAPER_SNIPER_SIMULATION_FIXTURE_MAP,
  listPaperSniperSimulationFixtures,
  getPaperSniperSimulationFixture,
  buildPaperSniperSimulationFixture,
  buildPaperSniperMarketModel,
  buildPaperSniperLatencyModel,
  buildPaperSniperSlippageModel,
  buildPaperSniperFailureModel,
  runPaperSniperSimulation,
  buildPaperSniperSimulationOutcomesSummary,
  buildPaperSniperSimulationViewModel,
  buildPaperSniperSimulationApiContract,
  selectPaperSniperSimulationFixture,
  selectPaperSniperSimulationOutcome,
  selectPaperSniperSimulationViewModel,
  selectPaperSniperSimulationApiSummary,
  validatePaperSniperSimulationFixture,
  validatePaperSniperSimulationSafety,
  normalizePaperSniperSimulationFixture,
  serializePaperSniperSimulationFixture,
  arePaperSniperSimulationFixturesEqual,
  stableDeterministicPaperSniperSimulationChecksum,
  PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
  PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
  PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION,
} from '../apps/dashboard/src/paper-sniper-simulation/index.js';
import {
  PAPER_SNIPER_SIMULATION_PHASE as ROOT_PHASE,
  PAPER_SNIPER_SIMULATION_FIXTURES as ROOT_FIXTURES,
  listPaperSniperSimulationFixtures as rootListFixtures,
} from '../apps/dashboard/src/index.js';
import {
  RISK_EXPLANATION_EVIDENCE_FIXTURES,
  RISK_EXPLANATION_EVIDENCE_NAMES,
} from '../apps/dashboard/src/risk-explanation-evidence/index.js';
import { LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES } from '../apps/dashboard/src/launch-risk-engine/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../apps/dashboard/src/synthetic-event-stream-replay-harness/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../apps/dashboard/src/synthetic-event-stream-lifecycle/index.js';
import { getPaperSniperSimulationCapabilities } from '../apps/dashboard/src/paper-sniper-simulation/capabilities.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_60_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/paper-sniper-simulation');
const PHASE_60_FILES = [
  'types.ts',
  'market-model.ts',
  'latency-model.ts',
  'slippage-model.ts',
  'failure-model.ts',
  'builders.ts',
  'fixtures.ts',
  'simulator.ts',
  'outcomes.ts',
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

describe('Phase 60 — source file existence', () => {
  for (const file of PHASE_60_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_60_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/PAPER_SNIPER_SIMULATION.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/PAPER_SNIPER_SIMULATION.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 60 — constants, fixtures, map/list/get, root exports', () => {
  it('constants and root exports align', () => {
    expect(PAPER_SNIPER_SIMULATION_PHASE).toBe(60);
    expect(ROOT_PHASE).toBe(60);
    expect(ROOT_FIXTURES).toEqual(PAPER_SNIPER_SIMULATION_FIXTURES);
  });

  it('has 8 names/kinds and deterministic fixtures', () => {
    expect(PAPER_SNIPER_SIMULATION_NAMES).toHaveLength(8);
    expect(PAPER_SNIPER_SIMULATION_KINDS).toHaveLength(8);
    expect(PAPER_SNIPER_SIMULATION_FIXTURES).toHaveLength(8);
    expect(PAPER_SNIPER_MARKET_LIQUIDITY_BUCKETS).toContain('critical');
    expect(PAPER_SNIPER_MARKET_VOLATILITY_BUCKETS).toContain('severe');
    expect(PAPER_SNIPER_LATENCY_BUCKETS).toContain('degraded');
    expect(PAPER_SNIPER_SLIPPAGE_BUCKETS).toContain('extreme');
    expect(PAPER_SNIPER_FAILURE_BUCKETS).toContain('critical');
  });

  it('map/list/get helpers are deterministic', () => {
    expect(rootListFixtures()).toEqual(PAPER_SNIPER_SIMULATION_FIXTURES);
    expect(listPaperSniperSimulationFixtures()).toEqual(PAPER_SNIPER_SIMULATION_FIXTURES);
    for (const fixture of PAPER_SNIPER_SIMULATION_FIXTURES) {
      expect(PAPER_SNIPER_SIMULATION_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getPaperSniperSimulationFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getPaperSniperSimulationFixture('missing')).toBeNull();
  });
});

describe('Phase 60 — source linkage to phases 59/58/57/56', () => {
  it('fixtures link to valid source fixture names', () => {
    for (const fixture of PAPER_SNIPER_SIMULATION_FIXTURES) {
      expect((RISK_EXPLANATION_EVIDENCE_NAMES as readonly string[])).toContain(
        fixture.sourcePhase59FixtureName,
      );
      expect((LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[])).toContain(
        fixture.sourcePhase58FixtureName,
      );
      expect((SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[])).toContain(
        fixture.sourcePhase57FixtureName,
      );
      expect((SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[])).toContain(
        fixture.sourcePhase56FixtureName,
      );
      expect(fixture.schemaVersion).toBe(PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION);
    }
  });

  it('covers every phase 59 risk explanation fixture', () => {
    const sourceNames = PAPER_SNIPER_SIMULATION_FIXTURES.map(f => f.sourcePhase59FixtureName);
    for (const phase59 of RISK_EXPLANATION_EVIDENCE_FIXTURES) {
      expect(sourceNames).toContain(phase59.fixtureName);
    }
  });
});

describe('Phase 60 — builders, simulator, outcomes, view-models, contracts, selectors', () => {
  it('fixture builder is deterministic', () => {
    const a = buildPaperSniperSimulationFixture({
      fixtureName: 'clean-launch-paper-sniper-simulation',
    });
    const b = buildPaperSniperSimulationFixture({
      fixtureName: 'clean-launch-paper-sniper-simulation',
    });
    expect(a).toEqual(b);
  });

  it('model builders and simulator return deterministic shapes', () => {
    const market = buildPaperSniperMarketModel({
      fixtureId: 'fixture-1',
      riskBand: 'moderate',
      sourcePhase58FixtureName: 'thin-liquidity-risk-assessment',
    });
    const latency = buildPaperSniperLatencyModel({ fixtureId: 'fixture-1', riskBand: 'moderate' });
    const slippage = buildPaperSniperSlippageModel({ fixtureId: 'fixture-1', riskBand: 'moderate' });
    const failure = buildPaperSniperFailureModel({ fixtureId: 'fixture-1', riskBand: 'moderate' });
    const outcome = runPaperSniperSimulation({
      fixtureId: 'fixture-1',
      fixtureKind: 'thin_liquidity_paper_sniper_simulation',
      marketModel: market,
      latencyModel: latency,
      slippageModel: slippage,
      failureModel: failure,
    });
    const summary = buildPaperSniperSimulationOutcomesSummary({
      fixtureId: 'fixture-1',
      marketModel: market,
      latencyModel: latency,
      slippageModel: slippage,
      failureModel: failure,
      outcome,
    });
    expect(outcome.steps).toHaveLength(3);
    expect(summary.bucketSummary).toContain('liquidity=');
  });

  it('view-model, contracts, selectors are deterministic', () => {
    const fixture = PAPER_SNIPER_SIMULATION_FIXTURES[0]!;
    const viewA = buildPaperSniperSimulationViewModel(fixture);
    const viewB = buildPaperSniperSimulationViewModel(fixture);
    expect(viewA).toEqual(viewB);
    const contracts = buildPaperSniperSimulationApiContract({ ...fixture, viewModel: viewA });
    expect(contracts.list.contractKind).toBe('list');
    expect(contracts.detail.contractKind).toBe('detail');
    expect(contracts.summary.contractKind).toBe('summary');
    const selected = selectPaperSniperSimulationFixture({ fixtureId: fixture.fixtureId });
    expect(selected.matched).toBe(true);
    expect(selectPaperSniperSimulationOutcome(fixture)).toEqual(fixture.outcome);
    expect(selectPaperSniperSimulationViewModel(fixture)).toEqual(fixture.viewModel);
    expect(selectPaperSniperSimulationApiSummary(fixture)).toEqual(fixture.apiContracts.summary);
  });
});

describe('Phase 60 — normalization, serialization, validation', () => {
  it('normalization/serialization/equality are deterministic', () => {
    const base = clone(PAPER_SNIPER_SIMULATION_FIXTURES[0]!);
    const scrambled = {
      ...clone(base),
      outcome: {
        ...base.outcome,
        steps: [...base.outcome.steps].reverse(),
      },
      selectorExamples: [...base.selectorExamples].reverse(),
    };
    expect(normalizePaperSniperSimulationFixture(scrambled)).toEqual(
      normalizePaperSniperSimulationFixture(base),
    );
    expect(serializePaperSniperSimulationFixture(scrambled)).toBe(
      serializePaperSniperSimulationFixture(base),
    );
    expect(arePaperSniperSimulationFixturesEqual(scrambled, base)).toBe(true);
  });

  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of PAPER_SNIPER_SIMULATION_FIXTURES) {
      const result = validatePaperSniperSimulationFixture(fixture);
      if (!result.valid) {
        throw new Error(`Validation failed for: ${fixture.fixtureName}: ${JSON.stringify(result.issues)}`);
      }
      expect(result.valid).toBe(true);
      expect(validatePaperSniperSimulationSafety(fixture)).toEqual({ safe: true, violations: [] });
    }
  });

  it('validation rejects invalid buckets and unsafe execution text', () => {
    const fixture = clone(PAPER_SNIPER_SIMULATION_FIXTURES[0]!);
    fixture.marketModel.liquidityBucket = 'invalid' as never;
    fixture.outcome.summary = 'place order now with wallet';
    const result = validatePaperSniperSimulationFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_MARKET_LIQUIDITY_BUCKET')).toBe(true);
    expect(
      result.issues.some(
        issue =>
          issue.code === 'UNSAFE_ORDER_REFERENCE' ||
          issue.code === 'UNSAFE_WALLET_REFERENCE' ||
          issue.code === 'UNSAFE_ADVISORY_LANGUAGE',
      ),
    ).toBe(true);
  });

  it('validation rejects provider and transaction references', () => {
    const fixture = clone(PAPER_SNIPER_SIMULATION_FIXTURES[0]!);
    fixture.outcome.safetySummary = 'sendTransaction via provider';
    const result = validatePaperSniperSimulationFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_PROVIDER_REFERENCE')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSAFE_TRANSACTION_REFERENCE')).toBe(true);
  });
});

describe('Phase 60 — capability flags and propagation', () => {
  it('module capability flags are correct', () => {
    const caps = getPaperSniperSimulationCapabilities();
    expect(caps.paperSniperSimulationFoundation).toBe(true);
    expect(caps.paperSniperSimulator).toBe(true);
    expect(caps.paperSniperNetworkAccess).toBe(false);
    expect(caps.paperSniperExecution).toBe(false);
  });

  it('dashboard/read-only-api capabilities include Phase 60 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['paperSniperSimulationFoundation']).toBe(true);
    expect(dashboardCaps['paperSniperExecution']).toBe(false);
    const dashboardCapsSource = readFileSync(
      resolve(REPO_ROOT, 'apps/dashboard/src/capabilities.ts'),
      'utf-8',
    );
    expect(dashboardCapsSource.toLowerCase()).not.toContain('websocket');

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['paperSniperSimulationFoundation']).toBe(true);
    expect(apiCaps['paperSniperWebSocketAccess']).toBe(false);
    expect(apiCaps['paperSniperExecution']).toBe(false);
  });
});

describe('Phase 60 — determinism and safety scan', () => {
  it('deterministic checksum helper is stable', () => {
    const checksum = stableDeterministicPaperSniperSimulationChecksum('phase60-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicPaperSniperSimulationChecksum('phase60-check')).toBe(checksum);
  });

  it('phase files avoid nondeterministic/network/runtime primitives', () => {
    for (const file of PHASE_60_FILES) {
      const content = readFileSync(resolve(PHASE_60_SRC, file), 'utf-8');
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
    expect(PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT).toBe('2026-02-27T00:00:00.000Z');
    expect(PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE).toBe(
      'phase60_paper_sniper_simulation_foundation_v1',
    );
    expect(PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION).toBe('1.0.0');
  });
});
