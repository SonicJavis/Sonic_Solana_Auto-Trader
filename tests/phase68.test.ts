import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE,
  PROVIDER_AWARE_REPLAY_SCENARIO_NAMES,
  PROVIDER_AWARE_REPLAY_SCENARIO_KINDS,
  PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES,
  PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURE_MAP,
  listProviderAwareReplayScenarioFixtures,
  getProviderAwareReplayScenarioFixture,
  buildProviderAwareReplayScenarioFixture,
  buildProviderAwareReplayImport,
  buildProviderAwareReplayScenario,
  buildProviderReplayProvenanceMapping,
  buildProviderReplayParityCheck,
  buildProviderFixtureRegenerationContract,
  buildProviderObservationReplayReport,
  buildGeneratedLifecyclePreview,
  buildReplayExpectationModel,
  buildProviderAwareReplayViewModel,
  buildProviderAwareReplayApiContract,
  selectProviderAwareReplayScenarioFixture,
  validateProviderAwareReplayScenarioFixture,
  validateProviderAwareReplayScenarioSafety,
  normalizeProviderAwareReplayScenarioFixture,
  serializeProviderAwareReplayScenarioFixture,
  areProviderAwareReplayScenarioFixturesEqual,
  stableDeterministicProviderAwareReplayScenarioChecksum,
  getProviderAwareReplayScenarioCapabilities,
  PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT,
  PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE as ROOT_PHASE,
  PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { CROSS_PROVIDER_DATA_QUALITY_NAMES } from '../apps/dashboard/src/cross-provider-data-quality/index.js';
import { SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES } from '../apps/dashboard/src/synthetic-event-stream-replay-harness/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES } from '../apps/dashboard/src/synthetic-event-stream-lifecycle/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_68_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/provider-aware-replay-scenarios');
const PHASE_68_FILES = [
  'types.ts',
  'import-models.ts',
  'scenario-generation.ts',
  'provenance-mapping.ts',
  'parity-checks.ts',
  'regeneration-contracts.ts',
  'observation-reports.ts',
  'lifecycle-preview.ts',
  'replay-expectations.ts',
  'builders.ts',
  'fixtures.ts',
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

describe('Phase 68 — source file existence', () => {
  for (const file of PHASE_68_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_68_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/PROVIDER_AWARE_REPLAY_SCENARIOS.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/PROVIDER_AWARE_REPLAY_SCENARIOS.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 68 — constants and fixture table', () => {
  it('constants and root exports align', () => {
    expect(PROVIDER_AWARE_REPLAY_SCENARIOS_PHASE).toBe(68);
    expect(ROOT_PHASE).toBe(68);
    expect(ROOT_FIXTURES).toEqual(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES);
    expect(PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
  });

  it('names/kinds/count/map/list/get are deterministic', () => {
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toHaveLength(8);
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_KINDS).toHaveLength(8);
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES).toHaveLength(8);
    expect(listProviderAwareReplayScenarioFixtures()).toEqual(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES);

    for (const fixture of PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES) {
      expect(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getProviderAwareReplayScenarioFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getProviderAwareReplayScenarioFixture('missing')).toBeNull();
  });
});

describe('Phase 68 — fixture structure and linkage', () => {
  it('fixtures include required deterministic surfaces and source linkage', () => {
    for (const fixture of PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES) {
      expect(fixture.phase).toBe(68);
      expect(CROSS_PROVIDER_DATA_QUALITY_NAMES).toContain(fixture.importModel.sourceQualityFixtureName);
      expect(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES).toContain(fixture.importModel.replayFixtureName);
      expect(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES).toContain(fixture.importModel.lifecycleFixtureName);
      expect(fixture.importModel.liveData).toBe(false);
      expect(fixture.generatedScenario.providerProvenanceRefs.length).toBeGreaterThan(0);
      expect(fixture.parityCheck.expectedSnapshotIds.length).toBeGreaterThan(0);
      expect(fixture.regenerationContract.filesystemWrites).toBe(false);
      expect(fixture.regenerationContract.downloads).toBe(false);
      expect(fixture.observationReport.safetySummary.toLowerCase()).toContain('read-only');
      expect(fixture.lifecyclePreview.eventPreviewIds.length).toBe(fixture.lifecyclePreview.deterministicSequence.length);
      expect(fixture.replayExpectation.expectedStepCount).toBeGreaterThan(0);
    }
  });

  it('required scenario fixture names are present', () => {
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('high-confidence-provider-agreement-scenario');
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('stale-provider-replay-scenario');
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('missing-field-partial-scenario');
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('conflicting-values-fail-closed-scenario');
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('unhealthy-provider-rejected-scenario');
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('fallback-reconciled-provider-scenario');
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('all-conflict-regeneration-blocked-scenario');
    expect(PROVIDER_AWARE_REPLAY_SCENARIO_NAMES).toContain('unsafe-provider-capability-blocked-scenario');
  });
});

describe('Phase 68 — helper builders and model layers', () => {
  it('fixture builder is deterministic', () => {
    const a = buildProviderAwareReplayScenarioFixture({ fixtureName: 'fallback-reconciled-provider-scenario' });
    const b = buildProviderAwareReplayScenarioFixture({ fixtureName: 'fallback-reconciled-provider-scenario' });
    expect(a).toEqual(b);
  });

  it('individual helper builders produce deterministic records', () => {
    const importModel = buildProviderAwareReplayImport({
      fixtureName: 'stale-provider-replay-scenario',
      sourceQualityFixtureName: 'stale-provider-mismatch',
      sourceReconciliationIds: ['r-1'],
      sourceProviderIds: ['provider-b', 'provider-a'],
      replayFixtureName: 'thin-liquidity-replay',
      lifecycleFixtureName: 'thin-liquidity-lifecycle-stream',
      importStatus: 'ready',
    });
    const provenance = buildProviderReplayProvenanceMapping({
      fixtureId: 'phase68-sample',
      sourceProviderId: 'provider-a',
      sourceFieldPath: 'token.supply',
      targetScenarioFieldPath: 'generatedScenario.token.supply',
      sourceFixtureName: 'missing-field-partial-confidence',
      confidenceLabel: 'medium',
    });
    const lifecycle = buildGeneratedLifecyclePreview({
      fixtureId: 'phase68-sample',
      sourceScenarioId: 'phase68-sample-scenario',
      eventKinds: ['launch_detected', 'metadata_state_observed', 'lifecycle_snapshot_derived'],
    });
    const scenario = buildProviderAwareReplayScenario({
      fixtureId: 'phase68-sample',
      scenarioName: 'missing-field-partial-scenario',
      scenarioKind: 'missing_field_partial_scenario',
      sourceQualityFixtureName: 'missing-field-partial-confidence',
      sourceConfidenceLabel: 'medium',
      sourceIssueIds: ['i-1'],
      sourceMismatchReportIds: ['m-1'],
      providerProvenanceRefs: [provenance.provenanceMappingId],
      generatedLifecyclePreviewIds: [lifecycle.lifecyclePreviewId],
      expectedReplaySnapshotIds: ['s-1'],
      replayFixtureName: 'metadata-incomplete-replay',
      lifecycleFixtureName: 'metadata-incomplete-lifecycle-stream',
      failClosed: false,
    });
    const parity = buildProviderReplayParityCheck({
      fixtureId: 'phase68-sample',
      scenarioId: scenario.scenarioId,
      replayFixtureName: 'metadata-incomplete-replay',
      expectedSnapshotIds: ['s-1'],
      observedSnapshotIds: ['s-1'],
      mismatches: [],
      parityStatus: 'passed',
      failClosed: false,
    });
    const regeneration = buildProviderFixtureRegenerationContract({
      fixtureId: 'phase68-sample',
      sourceQualityFixtureName: 'missing-field-partial-confidence',
      targetScenarioName: 'missing-field-partial-scenario',
    });
    const expectation = buildReplayExpectationModel({
      fixtureId: 'phase68-sample',
      sourceScenarioId: scenario.scenarioId,
      expectedStepCount: 3,
      expectedFinalStateKind: 'review_completed',
      expectedMismatchCount: 0,
      expectedFailClosed: false,
      sourceRefs: ['src-1'],
    });
    const viewModel = buildProviderAwareReplayViewModel({
      fixtureId: 'phase68-sample',
      fixtureName: 'missing-field-partial-scenario',
      generatedScenario: scenario,
      parityCheck: parity,
    });
    const report = buildProviderObservationReplayReport({
      fixtureId: 'phase68-sample',
      importModel,
      generatedScenario: scenario,
      provenanceMappings: [provenance],
      parityCheck: parity,
      regenerationContract: regeneration,
    });
    const contract = buildProviderAwareReplayApiContract({
      fixtureId: 'phase68-sample',
      viewModel,
      fixtureIds: ['phase68-sample'],
    });

    expect(importModel.sourceProviderIds).toEqual(['provider-a', 'provider-b']);
    expect(provenance.sourcePhase).toBe(67);
    expect(lifecycle.causalLinks[1]?.parentEventPreviewIds).toEqual([lifecycle.eventPreviewIds[0]]);
    expect(parity.summary.toLowerCase()).toContain('parity');
    expect(regeneration.deterministicPreviewOnly).toBe(true);
    expect(expectation.expectedStepCount).toBe(3);
    expect(report.reportId).toContain('phase68-sample');
    expect(contract.list.contractKind).toBe('list');
  });
});

describe('Phase 68 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic matches and misses', () => {
    const fixture = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES[0]!;
    const found = selectProviderAwareReplayScenarioFixture({ fixtureId: fixture.fixtureId });
    expect(found.matched).toBe(true);
    expect(found.selectedFixtureId).toBe(fixture.fixtureId);

    const missing = selectProviderAwareReplayScenarioFixture({ fixtureId: 'missing' });
    expect(missing.matched).toBe(false);
  });

  it('normalization/serialization/equality/checksum are deterministic', () => {
    const base = clone(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      provenanceMappings: [...base.provenanceMappings].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
    };

    expect(normalizeProviderAwareReplayScenarioFixture(scrambled)).toEqual(
      normalizeProviderAwareReplayScenarioFixture(base),
    );
    expect(serializeProviderAwareReplayScenarioFixture(scrambled)).toBe(
      serializeProviderAwareReplayScenarioFixture(base),
    );
    expect(areProviderAwareReplayScenarioFixturesEqual(scrambled, base)).toBe(true);

    const checksum = stableDeterministicProviderAwareReplayScenarioChecksum('phase68-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicProviderAwareReplayScenarioChecksum('phase68-check')).toBe(checksum);
  });
});

describe('Phase 68 — validation and safety', () => {
  it('all shipped fixtures validate and are safety-clean', () => {
    for (const fixture of PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES) {
      expect(validateProviderAwareReplayScenarioFixture(fixture).valid).toBe(true);
      expect(validateProviderAwareReplayScenarioSafety(fixture).safe).toBe(true);
    }
  });

  it('rejects unsafe live data/capability/parity/regeneration drift', () => {
    const fixture = clone(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      importModel: { ...fixture.importModel, liveData: true as never },
      parityCheck: {
        ...fixture.parityCheck,
        mismatches: [
          {
            mismatchId: 'critical-mismatch',
            mismatchKind: 'critical_reconciliation_conflict',
            severity: 'critical',
            message: 'critical',
          },
        ],
        expectedSnapshotIds: [],
        failClosed: false,
      },
      regenerationContract: {
        ...fixture.regenerationContract,
        filesystemWrites: true as never,
        downloads: true as never,
      },
      capabilityFlags: {
        ...fixture.capabilityFlags,
        providerAwareReplayExecution: true as never,
      },
    };

    const validation = validateProviderAwareReplayScenarioFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'IMPORT_MODEL_LIVE_DATA_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'PARITY_EXPECTED_SNAPSHOTS_REQUIRED')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'PARITY_CRITICAL_MUST_FAIL_CLOSED')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'REGENERATION_FILESYSTEM_WRITES_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });

  it('rejects advisory/wallet/network text and source snapshot mutation', () => {
    const fixture = clone(PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES[0]!);
    const unsafe = {
      ...fixture,
      generatedScenario: {
        ...fixture.generatedScenario,
        safetyNotes: ['buy signal for profit with wallet and fetch( endpoint https://unsafe.example'],
      },
      sourcePhase67FixtureSnapshot: ['mutated'] as never,
    };

    const validation = validateProviderAwareReplayScenarioFixture(unsafe as never);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_WALLET_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_NETWORK_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'MUTATED_PHASE67_SOURCE_SNAPSHOT')).toBe(true);
  });
});

describe('Phase 68 — fixture-specific expectations', () => {
  it('fail-closed scenarios remain fail-closed', () => {
    const allConflict = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(
      fixture => fixture.fixtureName === 'all-conflict-regeneration-blocked-scenario',
    );
    const conflicting = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(
      fixture => fixture.fixtureName === 'conflicting-values-fail-closed-scenario',
    );

    expect(allConflict?.parityCheck.failClosed).toBe(true);
    expect(conflicting?.parityCheck.failClosed).toBe(true);
  });

  it('unsafe provider scenario remains rejected and blocked', () => {
    const fixture = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(
      entry => entry.fixtureName === 'unsafe-provider-capability-blocked-scenario',
    );
    expect(fixture?.importModel.importStatus).toBe('rejected');
    expect(fixture?.parityCheck.parityStatus).toBe('rejected');
  });
});

describe('Phase 68 — capabilities and propagation', () => {
  it('phase capabilities expose required positive and negative flags', () => {
    const caps = getProviderAwareReplayScenarioCapabilities();
    expect(caps.providerAwareReplayScenarios).toBe(true);
    expect(caps.replayParityChecks).toBe(true);
    expect(caps.providerAwareReplayExecution).toBe(false);
    expect(caps.providerAwareReplayInvestmentAdvice).toBe(false);
  });

  it('dashboard and read-only API capabilities include phase68 flags', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.providerAwareReplayScenarios).toBe(true);
    expect(dashboard.providerAwareReplayExecution).toBe(false);
    expect(api.providerAwareReplayScenarios).toBe(true);
    expect(api.providerAwareReplayExecution).toBe(false);
  });
});

describe('Phase 68 — safety scan assertions', () => {
  it('phase68 source avoids forbidden runtime primitives', () => {
    const forbidden = [/Date\.now\(/, /Math\.random\(/, /randomUUID\(/];

    for (const file of PHASE_68_FILES) {
      const content = readFileSync(resolve(PHASE_68_SRC, file), 'utf-8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('docs retain Phase 69 as preview-only, not implemented', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/PROVIDER_AWARE_REPLAY_SCENARIOS.md'), 'utf-8');
    expect(doc).toContain('Phase 69');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(doc.toLowerCase()).toContain('not implemented');
  });
});
