/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: pure replay runner.
 */

import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES,
} from '../synthetic-event-stream-lifecycle/fixtures.js';
import { reduceSyntheticEventStreamLifecycle } from '../synthetic-event-stream-lifecycle/reducers.js';
import {
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
  type SyntheticEventStreamEnvelope,
} from '../synthetic-event-stream-lifecycle/types.js';
import { buildSyntheticEventStreamReplayClock } from './clock.js';
import { compareSyntheticEventStreamReplaySnapshots } from './comparators.js';
import { buildSyntheticEventStreamReplayReport } from './reports.js';
import { buildSyntheticEventStreamReplaySnapshot } from './snapshots.js';
import type {
  RunSyntheticEventStreamReplayHarnessInput,
  SyntheticEventStreamReplayHarnessRunResult,
  SyntheticEventStreamReplayMismatch,
  SyntheticEventStreamReplaySnapshot,
  SyntheticEventStreamReplayStep,
} from './types.js';
import { validateSyntheticEventStreamReplayHarnessSafety } from './validation.js';

function buildReplayStep(input: {
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

function mismatchFromEvent(
  replayId: string,
  stepSequence: number,
  sourceEvent: SyntheticEventStreamEnvelope,
  kind: SyntheticEventStreamReplayMismatch['kind'],
  message: string,
): SyntheticEventStreamReplayMismatch {
  return {
    mismatchId: `phase57-mismatch-${replayId}-${String(stepSequence).padStart(2, '0')}-${kind}`,
    kind,
    stepSequence,
    sourceEventId: sourceEvent.eventId,
    message,
  };
}

export function runSyntheticEventStreamReplayHarness(
  input: RunSyntheticEventStreamReplayHarnessInput,
): SyntheticEventStreamReplayHarnessRunResult {
  const safety = validateSyntheticEventStreamReplayHarnessSafety(input.fixture);
  if (!safety.safe) {
    const rejectedMismatch: SyntheticEventStreamReplayMismatch = {
      mismatchId: `phase57-mismatch-${input.fixture.replayIdentity.replayId}-unsafe_replay_input_rejected`,
      kind: 'unsafe_replay_input_rejected',
      stepSequence: 0,
      sourceEventId: 'phase57-rejected',
      message: 'Unsafe replay input rejected in fixture-only replay harness.',
    };

    const report = buildSyntheticEventStreamReplayReport({
      replayId: input.fixture.replayIdentity.replayId,
      sourceLifecycleFixtureName: input.fixture.sourceLifecycleFixtureName,
      replayStatus: 'rejected',
      replaySteps: [],
      mismatches: [rejectedMismatch],
      snapshots: [],
      finalStateId: 'phase57-rejected',
    });

    return {
      replayStatus: 'rejected',
      sourceFixture: null,
      replaySteps: [],
      actualSnapshots: [],
      mismatches: [rejectedMismatch],
      finalState: null,
      report,
    };
  }

  const sourceFixture =
    SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.find(
      fixture => fixture.fixtureName === input.fixture.sourceLifecycleFixtureName,
    ) ?? null;

  if (!sourceFixture) {
    const missingMismatch: SyntheticEventStreamReplayMismatch = {
      mismatchId: `phase57-mismatch-${input.fixture.replayIdentity.replayId}-replay_source_fixture_not_found`,
      kind: 'replay_source_fixture_not_found',
      stepSequence: 0,
      sourceEventId: 'phase57-missing-source',
      message: 'Source lifecycle fixture for replay was not found.',
    };

    const report = buildSyntheticEventStreamReplayReport({
      replayId: input.fixture.replayIdentity.replayId,
      sourceLifecycleFixtureName: input.fixture.sourceLifecycleFixtureName,
      replayStatus: 'failed',
      replaySteps: [],
      mismatches: [missingMismatch],
      snapshots: [],
      finalStateId: 'phase57-source-missing',
    });

    return {
      replayStatus: 'failed',
      sourceFixture: null,
      replaySteps: [],
      actualSnapshots: [],
      mismatches: [missingMismatch],
      finalState: null,
      report,
    };
  }

  const replayId = input.fixture.replayIdentity.replayId;
  const replaySteps: SyntheticEventStreamReplayStep[] = [];
  const actualSnapshots: SyntheticEventStreamReplaySnapshot[] = [];
  const mismatches: SyntheticEventStreamReplayMismatch[] = [];
  const replayedEvents: SyntheticEventStreamEnvelope[] = [];

  const seenEventIds = new Set<string>();

  for (let index = 0; index < sourceFixture.events.length; index += 1) {
    const sourceEvent = sourceFixture.events[index]!;
    const stepSequence = sourceEvent.sequence;
    const expectedStepSequence = index + 1;
    const inputState = reduceSyntheticEventStreamLifecycle(
      replayedEvents,
      sourceFixture.streamIdentity,
    );

    replayedEvents.push(sourceEvent);

    const outputState = reduceSyntheticEventStreamLifecycle(
      replayedEvents,
      sourceFixture.streamIdentity,
    );

    const actualSnapshot = buildSyntheticEventStreamReplaySnapshot(
      replayId,
      stepSequence,
      sourceEvent,
      outputState,
    );

    const expectedSnapshot =
      input.fixture.expectedSnapshots.find(snapshot => snapshot.snapshotSequence === stepSequence) ?? null;

    const stepMismatches = [
      ...compareSyntheticEventStreamReplaySnapshots({
        expectedSnapshot,
        actualSnapshot,
        sourceEvent,
        stepSequence,
      }),
    ];

    if (sourceEvent.sequence !== expectedStepSequence) {
      stepMismatches.push(
        mismatchFromEvent(
          replayId,
          stepSequence,
          sourceEvent,
          'event_sequence_mismatch',
          'Replay event sequence is not monotonic with replay step order.',
        ),
      );
    }

    if (sourceEvent.schemaVersion !== PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION) {
      stepMismatches.push(
        mismatchFromEvent(
          replayId,
          stepSequence,
          sourceEvent,
          'schema_version_mismatch',
          'Source event schema version is not supported by replay harness.',
        ),
      );
    }

    const hasCausalParentMismatch = sourceEvent.causalParentEventIds.some(parentId => !seenEventIds.has(parentId));
    if (hasCausalParentMismatch) {
      stepMismatches.push(
        mismatchFromEvent(
          replayId,
          stepSequence,
          sourceEvent,
          'causal_parent_mismatch',
          'Source event causal parent references are invalid for replay order.',
        ),
      );
    }

    replaySteps.push(
      buildReplayStep({
        replayId,
        stepSequence,
        sourceEvent,
        inputStateId: inputState.stateId,
        outputStateId: outputState.stateId,
        expectedSnapshotId: expectedSnapshot?.snapshotId ?? 'phase57-snapshot-missing',
        actualSnapshotId: actualSnapshot.snapshotId,
        mismatches: stepMismatches,
      }),
    );

    actualSnapshots.push(actualSnapshot);
    mismatches.push(...stepMismatches);
    seenEventIds.add(sourceEvent.eventId);
  }

  const finalState = reduceSyntheticEventStreamLifecycle(sourceFixture.events, sourceFixture.streamIdentity);

  const replayStatus = mismatches.length === 0 ? 'passed' : 'failed';
  const report = buildSyntheticEventStreamReplayReport({
    replayId,
    sourceLifecycleFixtureName: sourceFixture.fixtureName,
    replayStatus,
    replaySteps,
    mismatches,
    snapshots: actualSnapshots,
    finalStateId: finalState.stateId,
  });

  return {
    replayStatus,
    sourceFixture,
    replaySteps,
    actualSnapshots,
    mismatches,
    finalState,
    report,
  };
}
