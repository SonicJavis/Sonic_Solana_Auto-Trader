/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_EVENT_KINDS,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURE_MAP,
  listSyntheticEventStreamLifecycleFixtures,
  getSyntheticEventStreamLifecycleFixture,
  buildSyntheticEventStreamLifecycleFixture,
  buildSyntheticEventStreamLifecycleViewModel,
  buildSyntheticEventStreamLifecycleApiContract,
  selectSyntheticEventStreamLifecycleFixture,
  selectSyntheticEventStreamLifecycleEvents,
  selectSyntheticEventStreamLifecycleDerivedState,
  selectSyntheticEventStreamLifecycleViewModel,
  selectSyntheticEventStreamLifecycleApiSummary,
  reduceSyntheticEventStreamLifecycle,
  normalizeSyntheticEventStreamLifecycleFixture,
  serializeSyntheticEventStreamLifecycleFixture,
  areSyntheticEventStreamLifecycleFixturesEqual,
  validateSyntheticEventStreamLifecycleFixture,
  validateSyntheticEventStreamLifecycleSafety,
  getSyntheticEventStreamLifecycleCapabilities,
  stableDeterministicSyntheticEventStreamLifecycleChecksum,
  isValidSyntheticEventStreamLifecycleStreamName,
  isValidSyntheticEventStreamLifecycleStreamKind,
  isValidSyntheticEventStreamLifecycleGeneratedAt,
  isValidSyntheticEventStreamLifecycleSource,
  isValidSyntheticEventStreamLifecycleSchemaVersion,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
} from '../apps/dashboard/src/synthetic-event-stream-lifecycle/index.js';
import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE as ROOT_PHASE,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_56_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/synthetic-event-stream-lifecycle');
const PHASE_56_FILES = [
  'types.ts',
  'builders.ts',
  'fixtures.ts',
  'reducers.ts',
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

describe('Phase 56 — source file existence', () => {
  for (const file of PHASE_56_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_56_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/SYNTHETIC_EVENT_STREAM_LIFECYCLE.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/SYNTHETIC_EVENT_STREAM_LIFECYCLE.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 56 — constants, names, kinds, count, map, list', () => {
  it('phase constants and root exports align', () => {
    expect(SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE).toBe(56);
    expect(ROOT_PHASE).toBe(56);
    expect(ROOT_FIXTURES).toEqual(SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES);
  });

  it('has 8 stream names and kinds and at least 8 fixtures', () => {
    expect(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES).toHaveLength(8);
    expect(SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS).toHaveLength(8);
    expect(SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(SYNTHETIC_EVENT_STREAM_LIFECYCLE_EVENT_KINDS).toContain('safety_rejection_recorded');
  });

  it('list/map/get helpers are deterministic', () => {
    expect(listSyntheticEventStreamLifecycleFixtures()).toEqual(
      SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES,
    );

    for (const fixture of SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES) {
      expect(SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getSyntheticEventStreamLifecycleFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getSyntheticEventStreamLifecycleFixture('missing')).toBeNull();
  });
});

describe('Phase 56 — fixture structure, stream identities, event envelopes', () => {
  it('fixtures have unique IDs/names and deterministic stream identities', () => {
    const ids = SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.map(fixture => fixture.fixtureId);
    const names = SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.map(fixture => fixture.fixtureName);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);

    for (const fixture of SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES) {
      expect(fixture.phase).toBe(56);
      expect(fixture.schemaVersion).toBe(PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION);
      expect(fixture.streamIdentity.generatedAt).toBe(PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT);
      expect(fixture.streamIdentity.schemaVersion).toBe(PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION);
      expect(fixture.streamIdentity.deterministicSeed).toContain('phase56:');
      expect(fixture.events.length).toBeGreaterThanOrEqual(14);
      expect(fixture.sourceSyntheticLaunchFixtureName).toContain('launch');
      expect(fixture.sourceProviderAdapterMockName).toContain('adapter-mock');
    }
  });

  it('event envelopes are ordered, append-only, and have valid causal references', () => {
    for (const fixture of SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES) {
      const eventIds = new Set(fixture.events.map(event => event.eventId));
      expect(eventIds.size).toBe(fixture.events.length);

      for (let index = 0; index < fixture.events.length; index += 1) {
        const event = fixture.events[index];
        expect(event.sequence).toBe(index + 1);
        expect(event.schemaVersion).toBe(PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION);
        expect(event.syntheticTimestamp.endsWith('Z')).toBe(true);

        const prior = new Set(fixture.events.slice(0, index).map(nextEvent => nextEvent.eventId));
        for (const parentId of event.causalParentEventIds) {
          expect(eventIds.has(parentId)).toBe(true);
          expect(prior.has(parentId)).toBe(true);
        }
        for (const derivedId of event.derivedFromEventIds) {
          expect(eventIds.has(derivedId)).toBe(true);
        }
      }
    }
  });

  it('lifecycle event kinds are represented across fixtures', () => {
    const usedKinds = new Set(
      SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.flatMap(fixture =>
        fixture.events.map(event => event.eventKind),
      ),
    );

    for (const kind of SYNTHETIC_EVENT_STREAM_LIFECYCLE_EVENT_KINDS) {
      if (kind === 'safety_rejection_recorded') {
        expect(usedKinds.has(kind)).toBe(true);
      } else {
        expect(usedKinds.has(kind)).toBe(true);
      }
    }
  });
});

describe('Phase 56 — builder, reducer, view model, API contracts, selectors', () => {
  it('builder helpers are deterministic', () => {
    const fixtureA = buildSyntheticEventStreamLifecycleFixture({
      fixtureName: 'clean-launch-lifecycle-stream',
    });
    const fixtureB = buildSyntheticEventStreamLifecycleFixture({
      fixtureName: 'clean-launch-lifecycle-stream',
    });

    expect(fixtureA).toEqual(fixtureB);

    const viewA = buildSyntheticEventStreamLifecycleViewModel(fixtureA);
    const viewB = buildSyntheticEventStreamLifecycleViewModel(fixtureB);
    expect(viewA).toEqual(viewB);

    const contractA = buildSyntheticEventStreamLifecycleApiContract({ ...fixtureA, viewModel: viewA });
    const contractB = buildSyntheticEventStreamLifecycleApiContract({ ...fixtureB, viewModel: viewB });
    expect(contractA).toEqual(contractB);
  });

  it('reducer output matches fixture derived state', () => {
    for (const fixture of SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES) {
      const reduced = reduceSyntheticEventStreamLifecycle(fixture.events, fixture.streamIdentity);
      expect(reduced).toEqual(fixture.derivedLifecycleState);
      expect(reduced.eventReferences.length).toBe(fixture.events.length);
      expect(reduced.lastEventSequence).toBe(fixture.events.at(-1)?.sequence ?? 0);
    }
  });

  it('selectors provide deterministic read models/contracts', () => {
    const fixture = SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES[0];
    const selected = selectSyntheticEventStreamLifecycleFixture({ fixtureId: fixture.fixtureId });
    expect(selected.matched).toBe(true);
    expect(selected.selectedFixtureId).toBe(fixture.fixtureId);

    expect(selectSyntheticEventStreamLifecycleEvents(fixture)).toEqual(fixture.events);
    expect(selectSyntheticEventStreamLifecycleDerivedState(fixture)).toEqual(
      fixture.derivedLifecycleState,
    );
    expect(selectSyntheticEventStreamLifecycleViewModel(fixture)).toEqual(fixture.viewModel);
    expect(selectSyntheticEventStreamLifecycleApiSummary(fixture)).toEqual(
      fixture.apiContracts.summary,
    );

    const unmatched = selectSyntheticEventStreamLifecycleFixture({ fixtureId: 'phase56-missing' });
    expect(unmatched.matched).toBe(false);
  });
});

describe('Phase 56 — normalization, serialization, equality, validation', () => {
  it('normalization/serialization/equality are deterministic', () => {
    const base = clone(SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES[0]);
    const scrambled = {
      ...clone(base),
      events: [...base.events].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
    };

    expect(normalizeSyntheticEventStreamLifecycleFixture(scrambled)).toEqual(
      normalizeSyntheticEventStreamLifecycleFixture(base),
    );
    expect(serializeSyntheticEventStreamLifecycleFixture(scrambled)).toBe(
      serializeSyntheticEventStreamLifecycleFixture(base),
    );
    expect(areSyntheticEventStreamLifecycleFixturesEqual(scrambled, base)).toBe(true);
  });

  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES) {
      expect(validateSyntheticEventStreamLifecycleFixture(fixture).valid).toBe(true);
      expect(validateSyntheticEventStreamLifecycleSafety(fixture)).toEqual({
        safe: true,
        violations: [],
      });
    }
  });

  it('validation rejects duplicate sequence, out-of-order events, missing parent, bad schema', () => {
    const fixture = clone(SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES[0]);

    const duplicateSequence = {
      ...fixture,
      events: fixture.events.map((event, index) =>
        index === 1 ? { ...event, sequence: fixture.events[0]?.sequence ?? 1 } : event,
      ),
    };
    expect(validateSyntheticEventStreamLifecycleFixture(duplicateSequence).valid).toBe(false);

    const outOfOrder = {
      ...fixture,
      events: [fixture.events[1], fixture.events[0], ...fixture.events.slice(2)],
    };
    expect(validateSyntheticEventStreamLifecycleFixture(outOfOrder).valid).toBe(false);

    const missingParent = {
      ...fixture,
      events: fixture.events.map((event, index) =>
        index === 2 ? { ...event, causalParentEventIds: ['missing-parent-event-id'] } : event,
      ),
    };
    expect(validateSyntheticEventStreamLifecycleFixture(missingParent).valid).toBe(false);

    const invalidSchema = {
      ...fixture,
      schemaVersion: '2.0.0',
      streamIdentity: {
        ...fixture.streamIdentity,
        schemaVersion: '2.0.0',
      },
    };
    expect(validateSyntheticEventStreamLifecycleFixture(invalidSchema).valid).toBe(false);
  });

  it('safety rejects unsafe advisory text and network/provider references', () => {
    const fixture = clone(SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES[0]);
    const unsafe = {
      ...fixture,
      unsafeText: 'https://unsafe.example fetch( RPC buy signal investment advice',
    };

    const safety = validateSyntheticEventStreamLifecycleSafety(unsafe);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
    expect(validateSyntheticEventStreamLifecycleFixture(unsafe).valid).toBe(false);
  });
});

describe('Phase 56 — capabilities, propagation, determinism and safety posture', () => {
  it('phase capabilities and propagation include phase56 flags', () => {
    const caps = getSyntheticEventStreamLifecycleCapabilities();
    expect(caps.syntheticEventStreamLifecycle).toBe(true);
    expect(caps.syntheticEventStreamApiContracts).toBe(true);
    expect(caps.syntheticEventStreamExecution).toBe(false);
    expect(caps.syntheticEventStreamReplayHarness).toBe(false);

    const dashboardCaps = getDashboardUiShellCapabilities();
    expect(dashboardCaps.syntheticEventStreamLifecycle).toBe(true);
    expect(dashboardCaps.syntheticEventStreamNetworkAccess).toBe(false);

    const apiCaps = getLocalReadOnlyApiCapabilities();
    expect(apiCaps.syntheticEventStreamLifecycle).toBe(true);
    expect(apiCaps.syntheticEventStreamExecution).toBe(false);
  });

  it('checksum and isValid helpers are deterministic', () => {
    const checksum = stableDeterministicSyntheticEventStreamLifecycleChecksum('phase56-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicSyntheticEventStreamLifecycleChecksum('phase56-check')).toBe(checksum);

    for (const name of SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES) {
      expect(isValidSyntheticEventStreamLifecycleStreamName(name)).toBe(true);
    }
    for (const kind of SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS) {
      expect(isValidSyntheticEventStreamLifecycleStreamKind(kind)).toBe(true);
    }

    expect(isValidSyntheticEventStreamLifecycleGeneratedAt(PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT)).toBe(true);
    expect(isValidSyntheticEventStreamLifecycleSource(PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE)).toBe(true);
    expect(isValidSyntheticEventStreamLifecycleSchemaVersion(PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION)).toBe(true);
  });

  it('source immutability and no mutation of source fixtures', () => {
    const source = SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES[0];
    const copy = clone(source);
    copy.events[0]!.payload['observation'] = 'mutated';
    expect(source.events[0]?.payload['observation']).not.toBe('mutated');
  });

  it('phase files avoid nondeterministic/network/runtime primitives', () => {
    for (const file of PHASE_56_FILES) {
      const content = readFileSync(resolve(PHASE_56_SRC, file), 'utf-8');
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

  it('fixtures remain synthetic local-only read-only and no replay/paper simulation', () => {
    for (const fixture of SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES) {
      expect(fixture.safety.nonAdvisory).toBe(true);
      expect(fixture.safety.noLiveData).toBe(true);
      expect(fixture.safety.noNetworkAccess).toBe(true);
      expect(fixture.safety.notASignal).toBe(true);
      expect(fixture.capabilityFlags.syntheticEventStreamReplayHarness).toBe(false);
      expect(fixture.capabilityFlags.syntheticEventStreamPaperSimulation).toBe(false);
    }
  });

  it('Phase 57 is preview only and not implemented here', () => {
    const doc = readFileSync(
      resolve(REPO_ROOT, 'docs/SYNTHETIC_EVENT_STREAM_LIFECYCLE.md'),
      'utf-8',
    );
    expect(doc).toContain('Phase 57 — Synthetic Event Stream Replay Harness v1');
    expect(doc).toContain('not implemented');
  });
});
