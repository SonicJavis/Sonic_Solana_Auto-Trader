/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: builders.
 */

import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES,
} from '../synthetic-event-stream-lifecycle/fixtures.js';
import { reduceSyntheticEventStreamLifecycle } from '../synthetic-event-stream-lifecycle/reducers.js';
import type { SyntheticEventStreamEnvelope } from '../synthetic-event-stream-lifecycle/types.js';
import { getSyntheticEventStreamReplayHarnessCapabilities } from './capabilities.js';
import { buildSyntheticEventStreamReplayHarnessApiContract } from './contracts.js';
import { buildSyntheticEventStreamReplayClock } from './clock.js';
import { runSyntheticEventStreamReplayHarness } from './harness.js';
import { stableDeterministicSyntheticEventStreamReplayHarnessChecksum } from './normalization.js';
import { buildSyntheticEventStreamReplayReport } from './reports.js';
import { buildSyntheticEventStreamReplaySnapshot } from './snapshots.js';
import {
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_VERSION,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE,
  type BuildSyntheticEventStreamReplayHarnessFixtureInput,
  type SyntheticEventStreamReplayHarnessFixture,
  type SyntheticEventStreamReplayHarnessScenarioKind,
  type SyntheticEventStreamReplayHarnessScenarioName,
  type SyntheticEventStreamReplayMismatch,
  type SyntheticEventStreamReplaySnapshot,
  type SyntheticEventStreamReplayStep,
} from './types.js';
import { buildSyntheticEventStreamReplayHarnessViewModel } from './view-models.js';

interface ReplayScenarioDefinition {
  readonly replayKind: SyntheticEventStreamReplayHarnessScenarioKind;
  readonly sourceLifecycleFixtureName: (typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES)[number]['fixtureName'];
}

const REPLAY_SCENARIO_DEFINITIONS: Readonly<
  Record<SyntheticEventStreamReplayHarnessScenarioName, ReplayScenarioDefinition>
> = {
  'clean-launch-replay': {
    replayKind: 'clean_launch_replay',
    sourceLifecycleFixtureName: 'clean-launch-lifecycle-stream',
  },
  'thin-liquidity-replay': {
    replayKind: 'thin_liquidity_replay',
    sourceLifecycleFixtureName: 'thin-liquidity-lifecycle-stream',
  },
  'concentrated-holders-replay': {
    replayKind: 'concentrated_holders_replay',
    sourceLifecycleFixtureName: 'concentrated-holders-lifecycle-stream',
  },
  'suspicious-creator-replay': {
    replayKind: 'suspicious_creator_replay',
    sourceLifecycleFixtureName: 'suspicious-creator-lifecycle-stream',
  },
  'possible-bundle-cluster-replay': {
    replayKind: 'possible_bundle_cluster_replay',
    sourceLifecycleFixtureName: 'bundle-cluster-lifecycle-stream',
  },
  'metadata-incomplete-replay': {
    replayKind: 'metadata_incomplete_replay',
    sourceLifecycleFixtureName: 'metadata-incomplete-lifecycle-stream',
  },
  'high-early-volume-replay': {
    replayKind: 'high_early_volume_replay',
    sourceLifecycleFixtureName: 'high-early-volume-lifecycle-stream',
  },
  'safety-rejected-replay': {
    replayKind: 'safety_rejected_replay',
    sourceLifecycleFixtureName: 'safety-rejected-lifecycle-stream',
  },
};

function sourceFixtureByName(name: string) {
  return SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.find(fixture => fixture.fixtureName === name) ?? null;
}

function buildExpectedSnapshots(
  replayId: string,
  sourceEvents: readonly SyntheticEventStreamEnvelope[],
  sourceStreamIdentity: (typeof SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES)[number]['streamIdentity'],
): readonly SyntheticEventStreamReplaySnapshot[] {
  const replayedEvents: SyntheticEventStreamEnvelope[] = [];
  return sourceEvents.map(sourceEvent => {
    replayedEvents.push(sourceEvent);
    const derivedState = reduceSyntheticEventStreamLifecycle(replayedEvents, sourceStreamIdentity);

    return buildSyntheticEventStreamReplaySnapshot(
      replayId,
      sourceEvent.sequence,
      sourceEvent,
      derivedState,
    );
  });
}

export function buildSyntheticEventStreamReplayStep(input: {
  readonly replayId: string;
  readonly stepSequence: number;
  readonly sourceEvent: SyntheticEventStreamEnvelope;
  readonly inputStateId: string;
  readonly outputStateId: string;
  readonly expectedSnapshotId: string;
  readonly actualSnapshotId: string;
  readonly mismatches: readonly SyntheticEventStreamReplayMismatch[];
}): SyntheticEventStreamReplayStep {
  const clock = buildSyntheticEventStreamReplayClock(input.replayId, input.stepSequence);
  return {
    stepId: `phase57-step-${input.replayId}-${String(input.stepSequence).padStart(2, '0')}`,
    stepSequence: input.stepSequence,
    sourceEventId: input.sourceEvent.eventId,
    sourceEventKind: input.sourceEvent.eventKind,
    clockTimestamp: clock.currentTimestamp,
    inputStateId: input.inputStateId,
    outputStateId: input.outputStateId,
    expectedSnapshotId: input.expectedSnapshotId,
    actualSnapshotId: input.actualSnapshotId,
    mismatches: input.mismatches,
    safetyNotes: ['fixture-only', 'non-actionable', 'deterministic report', 'not a signal'],
  };
}

export function buildSyntheticEventStreamReplayHarnessFixture(
  input: BuildSyntheticEventStreamReplayHarnessFixtureInput,
): SyntheticEventStreamReplayHarnessFixture {
  const definition = REPLAY_SCENARIO_DEFINITIONS[input.fixtureName];
  const sourceFixture = sourceFixtureByName(definition.sourceLifecycleFixtureName);

  if (!sourceFixture) {
    throw new Error(`Phase 57 source lifecycle fixture missing: ${definition.sourceLifecycleFixtureName}`);
  }

  const deterministicSeed = `phase57:${input.fixtureName}:${definition.replayKind}`;
  const checksum = stableDeterministicSyntheticEventStreamReplayHarnessChecksum(deterministicSeed);
  const fixtureId = `phase57-fixture-${checksum.replace(':', '-')}`;
  const replayId = `phase57-replay-${checksum.replace(':', '-')}`;

  const replayIdentity = {
    replayId,
    replayName: input.fixtureName,
    replayKind: definition.replayKind,
    sourceLifecycleFixtureName: definition.sourceLifecycleFixtureName,
    schemaVersion: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
    deterministicSeed,
    generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
  } as const;

  const expectedSnapshots = buildExpectedSnapshots(
    replayId,
    sourceFixture.events,
    sourceFixture.streamIdentity,
  );

  const replayClock = buildSyntheticEventStreamReplayClock(replayId, 0);

  const initialRun = runSyntheticEventStreamReplayHarness({
    fixture: {
      fixtureId,
      fixtureName: input.fixtureName,
      fixtureKind: definition.replayKind,
      sourceLifecycleFixtureName: definition.sourceLifecycleFixtureName,
      replayIdentity,
      expectedSnapshots,
    },
  });

  const capabilityFlags = getSyntheticEventStreamReplayHarnessCapabilities();

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: definition.replayKind,
    phase: SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE,
    schemaVersion: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
    sourceLifecycleFixtureName: definition.sourceLifecycleFixtureName,
    replayIdentity,
    replayClock,
    replaySteps: initialRun.replaySteps,
    expectedSnapshots,
    actualReport: initialRun.report,
    capabilityFlags,
    meta: {
      generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
      source: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
      version: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_VERSION,
      phase: SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      noLiveData: true,
      noNetworkAccess: true,
      nonAdvisory: true,
      notASignal: true,
    },
  } as const;

  const viewModel = buildSyntheticEventStreamReplayHarnessViewModel(
    partialFixture as unknown as SyntheticEventStreamReplayHarnessFixture,
  );

  const withViewModel = {
    ...partialFixture,
    viewModel,
  } as unknown as SyntheticEventStreamReplayHarnessFixture;

  const apiContracts = buildSyntheticEventStreamReplayHarnessApiContract(withViewModel);

  return {
    ...withViewModel,
    apiContracts,
    selectorExamples: [
      {
        selectorId: `phase57-selector-by-id-${fixtureId}`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: definition.replayKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
      {
        selectorId: `phase57-selector-by-kind-${definition.replayKind}`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: definition.replayKind,
        matched: true,
        source: 'synthetic_fixture_only',
      },
    ],
  };
}

export { buildSyntheticEventStreamReplayClock };

export { buildSyntheticEventStreamReplaySnapshot };

export { buildSyntheticEventStreamReplayReport };
