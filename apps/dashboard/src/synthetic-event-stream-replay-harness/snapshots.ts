/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: snapshots.
 */

import type {
  SyntheticEventStreamEnvelope,
  SyntheticEventStreamLifecycleDerivedState,
} from '../synthetic-event-stream-lifecycle/types.js';
import { buildSyntheticEventStreamReplayClock } from './clock.js';
import { stableDeterministicSyntheticEventStreamReplayHarnessChecksum } from './normalization.js';
import {
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
  type SyntheticEventStreamReplaySnapshot,
  type SyntheticEventStreamReplayStateSummary,
} from './types.js';

function buildSelectedStateSummary(
  state: SyntheticEventStreamLifecycleDerivedState,
): SyntheticEventStreamReplayStateSummary {
  return {
    lifecycleStatus: state.lifecycleStatus,
    safetyStatus: state.safetyState.status,
    liquidityLabel: state.liquidityState.liquidityLabel,
    metadataLabel: state.metadataState.metadataCompletenessLabel,
    holderLabel: state.holderState.concentrationLabel,
    creatorLabel: state.creatorState.creatorRiskLabel,
    anomalyLabel: state.anomalyState.anomalyLabel,
    reviewOutcome: state.riskReviewState.reviewOutcome,
    eventReferenceCount: state.eventReferences.length,
  };
}

export function buildSyntheticEventStreamReplaySnapshot(
  replayId: string,
  stepSequence: number,
  sourceEvent: SyntheticEventStreamEnvelope,
  state: SyntheticEventStreamLifecycleDerivedState,
): SyntheticEventStreamReplaySnapshot {
  const selectedStateSummary = buildSelectedStateSummary(state);
  const lifecycleStateChecksum = stableDeterministicSyntheticEventStreamReplayHarnessChecksum(
    JSON.stringify({
      replayId,
      stepSequence,
      stateId: state.stateId,
      selectedStateSummary,
    }),
  );

  return {
    snapshotId: `phase57-snapshot-${replayId}-${String(stepSequence).padStart(2, '0')}`,
    snapshotSequence: stepSequence,
    sourceEventId: sourceEvent.eventId,
    lifecycleStateChecksum,
    selectedStateSummary,
    eventReferences: [...state.eventReferences],
    deterministicTimestamp: buildSyntheticEventStreamReplayClock(replayId, stepSequence).currentTimestamp,
    schemaVersion: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
  };
}
