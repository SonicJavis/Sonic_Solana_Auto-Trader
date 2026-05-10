/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS,
  SYNTHETIC_EVENT_STREAM_REPLAY_MISMATCH_KINDS,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURE_MAP,
  listSyntheticEventStreamReplayHarnessFixtures,
  getSyntheticEventStreamReplayHarnessFixture,
  buildSyntheticEventStreamReplayHarnessFixture,
  buildSyntheticEventStreamReplayClock,
  buildSyntheticEventStreamReplayStep,
  buildSyntheticEventStreamReplaySnapshot,
  buildSyntheticEventStreamReplayReport,
  runSyntheticEventStreamReplayHarness,
  compareSyntheticEventStreamReplaySnapshots,
  buildSyntheticEventStreamReplayHarnessViewModel,
  buildSyntheticEventStreamReplayHarnessApiContract,
  selectSyntheticEventStreamReplayHarnessFixture,
  selectSyntheticEventStreamReplayHarnessSnapshots,
  selectSyntheticEventStreamReplayHarnessReport,
  selectSyntheticEventStreamReplayHarnessViewModel,
  selectSyntheticEventStreamReplayHarnessApiSummary,
  normalizeSyntheticEventStreamReplayHarnessFixture,
  serializeSyntheticEventStreamReplayHarnessFixture,
  areSyntheticEventStreamReplayHarnessFixturesEqual,
  validateSyntheticEventStreamReplayHarnessFixture,
  validateSyntheticEventStreamReplayHarnessSafety,
  validateSyntheticEventStreamReplayHarnessFixtureTable,
  getSyntheticEventStreamReplayHarnessCapabilities,
  stableDeterministicSyntheticEventStreamReplayHarnessChecksum,
  isValidSyntheticEventStreamReplayHarnessScenarioName,
  isValidSyntheticEventStreamReplayHarnessScenarioKind,
  isValidSyntheticEventStreamReplayHarnessGeneratedAt,
  isValidSyntheticEventStreamReplayHarnessSource,
  isValidSyntheticEventStreamReplayHarnessSchemaVersion,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
} from '../apps/dashboard/src/synthetic-event-stream-replay-harness/index.js';
import { SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES } from '../apps/dashboard/src/synthetic-event-stream-lifecycle/index.js';
import {
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE as ROOT_PHASE,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES as ROOT_FIXTURES,
  listSyntheticEventStreamReplayHarnessFixtures as rootListFixtures,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_57_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/synthetic-event-stream-replay-harness');
const PHASE_57_FILES = [
  'types.ts',
  'clock.ts',
  'builders.ts',
  'fixtures.ts',
  'harness.ts',
  'snapshots.ts',
  'reports.ts',
  'comparators.ts',
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

describe('Phase 57 — source file existence', () => {
  for (const file of PHASE_57_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_57_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 57 — constants, names, kinds, count, map, list', () => {
  it('phase constants and root exports align', () => {
    expect(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE).toBe(57);
    expect(ROOT_PHASE).toBe(57);
    expect(ROOT_FIXTURES).toEqual(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES);
  });

  it('has 8 scenario names and kinds and expected mismatch taxonomy', () => {
    expect(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES).toHaveLength(8);
    expect(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS).toHaveLength(8);
    expect(SYNTHETIC_EVENT_STREAM_REPLAY_MISMATCH_KINDS).toEqual([
      'missing_expected_snapshot',
      'snapshot_checksum_mismatch',
      'state_summary_mismatch',
      'event_sequence_mismatch',
      'causal_parent_mismatch',
      'schema_version_mismatch',
      'unsafe_replay_input_rejected',
      'replay_source_fixture_not_found',
    ]);
  });

  it('fixture list/map/get helpers are deterministic', () => {
    expect(rootListFixtures()).toEqual(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES);
    expect(listSyntheticEventStreamReplayHarnessFixtures()).toEqual(
      SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES,
    );

    for (const fixture of SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES) {
      expect(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getSyntheticEventStreamReplayHarnessFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getSyntheticEventStreamReplayHarnessFixture('missing')).toBeNull();
  });
});

describe('Phase 57 — fixture structure and source linkage', () => {
  it('every replay fixture references a unique Phase 56 lifecycle fixture', () => {
    const sourceNames = SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.map(
      fixture => fixture.sourceLifecycleFixtureName,
    );

    expect(new Set(sourceNames).size).toBe(sourceNames.length);
    expect(new Set(sourceNames)).toEqual(
      new Set(SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.map(fixture => fixture.fixtureName)),
    );
  });

  it('replay identities, clocks, steps, snapshots, reports are deterministic', () => {
    for (const fixture of SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES) {
      expect(fixture.phase).toBe(57);
      expect(fixture.schemaVersion).toBe(PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION);
      expect(fixture.replayIdentity.generatedAt).toBe(
        PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
      );
      expect(fixture.replayClock.deterministic).toBe(true);
      expect(fixture.replaySteps.length).toBe(fixture.expectedSnapshots.length);
      expect(fixture.actualReport.totalSteps).toBe(fixture.replaySteps.length);
      expect(fixture.actualReport.totalEvents).toBe(fixture.expectedSnapshots.length);
      expect(fixture.actualReport.snapshotChecksums).toHaveLength(fixture.expectedSnapshots.length);
      expect(fixture.viewModel.nonAdvisorySummary).toContain('not a signal');
    }
  });
});

describe('Phase 57 — helper builders and harness', () => {
  it('fixture builder and harness are deterministic across repeated builds', () => {
    const fixtureA = buildSyntheticEventStreamReplayHarnessFixture({
      fixtureName: 'clean-launch-replay',
    });
    const fixtureB = buildSyntheticEventStreamReplayHarnessFixture({
      fixtureName: 'clean-launch-replay',
    });

    expect(fixtureA).toEqual(fixtureB);

    const runA = runSyntheticEventStreamReplayHarness({
      fixture: {
        fixtureId: fixtureA.fixtureId,
        fixtureName: fixtureA.fixtureName,
        fixtureKind: fixtureA.fixtureKind,
        sourceLifecycleFixtureName: fixtureA.sourceLifecycleFixtureName,
        replayIdentity: fixtureA.replayIdentity,
        expectedSnapshots: fixtureA.expectedSnapshots,
      },
    });

    const runB = runSyntheticEventStreamReplayHarness({
      fixture: {
        fixtureId: fixtureB.fixtureId,
        fixtureName: fixtureB.fixtureName,
        fixtureKind: fixtureB.fixtureKind,
        sourceLifecycleFixtureName: fixtureB.sourceLifecycleFixtureName,
        replayIdentity: fixtureB.replayIdentity,
        expectedSnapshots: fixtureB.expectedSnapshots,
      },
    });

    expect(runA).toEqual(runB);
    expect(runA.report.replayStatus).toBe('passed');
  });

  it('clock, step, snapshot, report helper builders produce valid deterministic shapes', () => {
    const sourceFixture = SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES[0];
    if (!sourceFixture) throw new Error('missing source fixture');

    const clock = buildSyntheticEventStreamReplayClock('phase57-test-replay', 2);
    expect(clock.stepIndex).toBe(2);
    expect(clock.currentTimestamp).toBe('2026-02-06T00:02:00.000Z');

    const event = sourceFixture.events[0]!;
    const snapshot = buildSyntheticEventStreamReplaySnapshot(
      'phase57-test-replay',
      1,
      event,
      sourceFixture.derivedLifecycleState,
    );

    const mismatches = compareSyntheticEventStreamReplaySnapshots({
      expectedSnapshot: snapshot,
      actualSnapshot: snapshot,
      sourceEvent: event,
      stepSequence: 1,
    });

    const step = buildSyntheticEventStreamReplayStep({
      replayId: 'phase57-test-replay',
      stepSequence: 1,
      sourceEvent: event,
      inputStateId: 'state-in',
      outputStateId: 'state-out',
      expectedSnapshotId: snapshot.snapshotId,
      actualSnapshotId: snapshot.snapshotId,
      mismatches,
    });

    const report = buildSyntheticEventStreamReplayReport({
      replayId: 'phase57-test-replay',
      sourceLifecycleFixtureName: sourceFixture.fixtureName,
      replayStatus: 'passed',
      replaySteps: [step],
      mismatches,
      snapshots: [snapshot],
      finalStateId: 'state-out',
    });

    expect(step.mismatches).toEqual([]);
    expect(snapshot.lifecycleStateChecksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(report.totalSteps).toBe(1);
    expect(report.passedSteps).toBe(1);
  });
});

describe('Phase 57 — comparators and negative replay cases', () => {
  it('detects missing expected snapshot mismatch', () => {
    const fixture = clone(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]);
    const run = runSyntheticEventStreamReplayHarness({
      fixture: {
        fixtureId: fixture.fixtureId,
        fixtureName: fixture.fixtureName,
        fixtureKind: fixture.fixtureKind,
        sourceLifecycleFixtureName: fixture.sourceLifecycleFixtureName,
        replayIdentity: fixture.replayIdentity,
        expectedSnapshots: fixture.expectedSnapshots.slice(1),
      },
    });

    expect(run.replayStatus).toBe('failed');
    expect(run.mismatches.some(mismatch => mismatch.kind === 'missing_expected_snapshot')).toBe(true);
  });

  it('detects altered checksum mismatch', () => {
    const fixture = clone(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]);
    fixture.expectedSnapshots[0]!.lifecycleStateChecksum = 'fnv1a32:deadbeef';

    const run = runSyntheticEventStreamReplayHarness({
      fixture: {
        fixtureId: fixture.fixtureId,
        fixtureName: fixture.fixtureName,
        fixtureKind: fixture.fixtureKind,
        sourceLifecycleFixtureName: fixture.sourceLifecycleFixtureName,
        replayIdentity: fixture.replayIdentity,
        expectedSnapshots: fixture.expectedSnapshots,
      },
    });

    expect(run.replayStatus).toBe('failed');
    expect(run.mismatches.some(mismatch => mismatch.kind === 'snapshot_checksum_mismatch')).toBe(true);
  });

  it('validation rejects out-of-order steps and invalid schema version', () => {
    const fixture = clone(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]);
    const outOfOrder = {
      ...fixture,
      replaySteps: [fixture.replaySteps[1], fixture.replaySteps[0], ...fixture.replaySteps.slice(2)],
    };
    expect(validateSyntheticEventStreamReplayHarnessFixture(outOfOrder).valid).toBe(false);

    const invalidSchema = {
      ...fixture,
      schemaVersion: '2.0.0',
      replayIdentity: {
        ...fixture.replayIdentity,
        schemaVersion: '2.0.0',
      },
    };
    expect(validateSyntheticEventStreamReplayHarnessFixture(invalidSchema).valid).toBe(false);
  });

  it('validation and harness reject unsafe advisory/provider/network text', () => {
    const fixture = clone(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]);
    const unsafe = {
      ...fixture,
      unsafeText: 'https://unsafe.example fetch( RPC WebSocket buy signal investment advice',
    };

    const safety = validateSyntheticEventStreamReplayHarnessSafety(unsafe);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
    expect(validateSyntheticEventStreamReplayHarnessFixture(unsafe).valid).toBe(false);

    const unsafeRun = runSyntheticEventStreamReplayHarness({
      fixture: {
        fixtureId: fixture.fixtureId,
        fixtureName: fixture.fixtureName,
        fixtureKind: fixture.fixtureKind,
        sourceLifecycleFixtureName: fixture.sourceLifecycleFixtureName,
        replayIdentity: {
          ...fixture.replayIdentity,
          deterministicSeed: 'phase57:unsafe:buy signal',
        },
        expectedSnapshots: fixture.expectedSnapshots,
      },
    });

    expect(unsafeRun.replayStatus).toBe('rejected');
    expect(unsafeRun.mismatches[0]?.kind).toBe('unsafe_replay_input_rejected');
  });
});

describe('Phase 57 — selectors, view models, contracts, normalization, validation', () => {
  it('selectors return deterministic local-only summaries', () => {
    const fixture = SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]!;
    const selected = selectSyntheticEventStreamReplayHarnessFixture({ fixtureId: fixture.fixtureId });
    expect(selected.matched).toBe(true);
    expect(selected.selectedFixtureId).toBe(fixture.fixtureId);

    expect(selectSyntheticEventStreamReplayHarnessSnapshots(fixture)).toEqual(fixture.expectedSnapshots);
    expect(selectSyntheticEventStreamReplayHarnessReport(fixture)).toEqual(fixture.actualReport);
    expect(selectSyntheticEventStreamReplayHarnessViewModel(fixture)).toEqual(fixture.viewModel);
    expect(selectSyntheticEventStreamReplayHarnessApiSummary(fixture)).toEqual(fixture.apiContracts.summary);
  });

  it('view models and contracts are deterministic and derived from fixture data', () => {
    const fixture = SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]!;
    const viewA = buildSyntheticEventStreamReplayHarnessViewModel(fixture);
    const viewB = buildSyntheticEventStreamReplayHarnessViewModel(fixture);
    expect(viewA).toEqual(viewB);

    const contractA = buildSyntheticEventStreamReplayHarnessApiContract({ ...fixture, viewModel: viewA });
    const contractB = buildSyntheticEventStreamReplayHarnessApiContract({ ...fixture, viewModel: viewB });
    expect(contractA).toEqual(contractB);
  });

  it('normalization, serialization, equality, checksum and isValid helpers are deterministic', () => {
    const fixture = clone(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]!);
    const scrambled = {
      ...fixture,
      replaySteps: [...fixture.replaySteps].reverse(),
      expectedSnapshots: [...fixture.expectedSnapshots].reverse(),
      selectorExamples: [...fixture.selectorExamples].reverse(),
    };

    expect(normalizeSyntheticEventStreamReplayHarnessFixture(scrambled)).toEqual(
      normalizeSyntheticEventStreamReplayHarnessFixture(fixture),
    );
    expect(serializeSyntheticEventStreamReplayHarnessFixture(scrambled)).toBe(
      serializeSyntheticEventStreamReplayHarnessFixture(fixture),
    );
    expect(areSyntheticEventStreamReplayHarnessFixturesEqual(scrambled, fixture)).toBe(true);

    const checksum = stableDeterministicSyntheticEventStreamReplayHarnessChecksum('phase57-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicSyntheticEventStreamReplayHarnessChecksum('phase57-check')).toBe(checksum);

    for (const name of SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES) {
      expect(isValidSyntheticEventStreamReplayHarnessScenarioName(name)).toBe(true);
    }
    for (const kind of SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS) {
      expect(isValidSyntheticEventStreamReplayHarnessScenarioKind(kind)).toBe(true);
    }

    expect(
      isValidSyntheticEventStreamReplayHarnessGeneratedAt(
        PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
      ),
    ).toBe(true);
    expect(
      isValidSyntheticEventStreamReplayHarnessSource(
        PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
      ),
    ).toBe(true);
    expect(
      isValidSyntheticEventStreamReplayHarnessSchemaVersion(
        PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
      ),
    ).toBe(true);
  });

  it('all fixtures validate and fixture table uniqueness passes', () => {
    const ids = SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.map(fixture => fixture.fixtureId);
    const names = SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.map(fixture => fixture.fixtureName);

    expect(validateSyntheticEventStreamReplayHarnessFixtureTable(ids, names).valid).toBe(true);

    for (const fixture of SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES) {
      expect(validateSyntheticEventStreamReplayHarnessFixture(fixture).valid).toBe(true);
      expect(validateSyntheticEventStreamReplayHarnessSafety(fixture)).toEqual({
        safe: true,
        violations: [],
      });
    }
  });
});

describe('Phase 57 — capabilities, propagation, immutability, and safety posture', () => {
  it('phase capability flags are correct and propagated', () => {
    const caps = getSyntheticEventStreamReplayHarnessCapabilities();
    expect(caps.syntheticEventStreamReplayHarness).toBe(true);
    expect(caps.syntheticEventStreamReplayApiContracts).toBe(true);
    expect(caps.syntheticEventStreamReplayExecution).toBe(false);
    expect(caps.syntheticEventStreamReplayPaperSimulation).toBe(false);

    const dashboardCaps = getDashboardUiShellCapabilities();
    expect(dashboardCaps.syntheticEventStreamReplayHarness).toBe(true);
    expect(dashboardCaps.syntheticEventStreamReplayNetworkAccess).toBe(false);

    const apiCaps = getLocalReadOnlyApiCapabilities();
    expect(apiCaps.syntheticEventStreamReplayHarness).toBe(true);
    expect(apiCaps.syntheticEventStreamReplayExecution).toBe(false);
  });

  it('source immutability holds when mutating clone', () => {
    const source = SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0]!;
    const copy = clone(source);
    copy.expectedSnapshots[0]!.selectedStateSummary.lifecycleStatus = 'mutated';
    expect(source.expectedSnapshots[0]?.selectedStateSummary.lifecycleStatus).not.toBe('mutated');
  });

  it('phase files avoid nondeterministic and unsafe runtime primitives', () => {
    for (const file of PHASE_57_FILES) {
      const content = readFileSync(resolve(PHASE_57_SRC, file), 'utf-8');
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

  it('fixtures remain synthetic local-only read-only and no paper simulation/live execution', () => {
    for (const fixture of SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES) {
      expect(fixture.safety.fixtureOnly).toBe(true);
      expect(fixture.safety.noLiveData).toBe(true);
      expect(fixture.safety.noNetworkAccess).toBe(true);
      expect(fixture.safety.notASignal).toBe(true);
      expect(fixture.capabilityFlags.syntheticEventStreamReplayPaperSimulation).toBe(false);
      expect(fixture.capabilityFlags.syntheticEventStreamReplayLiveExecution).toBe(false);
    }
  });

  it('Phase 58 is preview only and not implemented here', () => {
    const doc = readFileSync(
      resolve(REPO_ROOT, 'docs/SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS.md'),
      'utf-8',
    );
    expect(doc).toContain('Phase 58 — Launch Risk Engine v1');
    expect(doc).toContain('not implemented');
  });
});
