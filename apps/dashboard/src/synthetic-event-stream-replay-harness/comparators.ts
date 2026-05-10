/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: comparators.
 */

import {
  type CompareSyntheticEventStreamReplaySnapshotsInput,
  type SyntheticEventStreamReplayMismatch,
} from './types.js';

export function compareSyntheticEventStreamReplaySnapshots(
  input: CompareSyntheticEventStreamReplaySnapshotsInput,
): readonly SyntheticEventStreamReplayMismatch[] {
  const mismatches: SyntheticEventStreamReplayMismatch[] = [];
  const { expectedSnapshot, actualSnapshot, sourceEvent, stepSequence } = input;

  if (expectedSnapshot === null) {
    mismatches.push({
      mismatchId: `phase57-mismatch-${sourceEvent.eventId}-${stepSequence}-missing_expected_snapshot`,
      kind: 'missing_expected_snapshot',
      stepSequence,
      sourceEventId: sourceEvent.eventId,
      message: 'Expected snapshot is missing for replay step.',
    });
    return mismatches;
  }

  if (expectedSnapshot.lifecycleStateChecksum !== actualSnapshot.lifecycleStateChecksum) {
    mismatches.push({
      mismatchId: `phase57-mismatch-${sourceEvent.eventId}-${stepSequence}-snapshot_checksum_mismatch`,
      kind: 'snapshot_checksum_mismatch',
      stepSequence,
      sourceEventId: sourceEvent.eventId,
      message: 'Snapshot checksum mismatch between expected and actual replay snapshot.',
    });
  }

  if (
    JSON.stringify(expectedSnapshot.selectedStateSummary) !==
    JSON.stringify(actualSnapshot.selectedStateSummary)
  ) {
    mismatches.push({
      mismatchId: `phase57-mismatch-${sourceEvent.eventId}-${stepSequence}-state_summary_mismatch`,
      kind: 'state_summary_mismatch',
      stepSequence,
      sourceEventId: sourceEvent.eventId,
      message: 'Selected lifecycle state summary mismatch between expected and actual snapshot.',
    });
  }

  if (expectedSnapshot.snapshotSequence !== stepSequence || sourceEvent.sequence !== stepSequence) {
    mismatches.push({
      mismatchId: `phase57-mismatch-${sourceEvent.eventId}-${stepSequence}-event_sequence_mismatch`,
      kind: 'event_sequence_mismatch',
      stepSequence,
      sourceEventId: sourceEvent.eventId,
      message: 'Replay step sequence and event sequence are not aligned.',
    });
  }

  return mismatches;
}
