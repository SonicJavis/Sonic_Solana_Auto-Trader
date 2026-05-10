/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: reports.
 */

import {
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
  type SyntheticEventStreamReplayMismatch,
  type SyntheticEventStreamReplayReport,
  type SyntheticEventStreamReplaySnapshot,
  type SyntheticEventStreamReplayStatus,
  type SyntheticEventStreamReplayStep,
} from './types.js';
import type { SyntheticEventStreamLifecycleStreamName } from '../synthetic-event-stream-lifecycle/types.js';

export function buildSyntheticEventStreamReplayReport(input: {
  readonly replayId: string;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly replayStatus: SyntheticEventStreamReplayStatus;
  readonly replaySteps: readonly SyntheticEventStreamReplayStep[];
  readonly mismatches: readonly SyntheticEventStreamReplayMismatch[];
  readonly snapshots: readonly SyntheticEventStreamReplaySnapshot[];
  readonly finalStateId: string;
}): SyntheticEventStreamReplayReport {
  const failedSteps = input.replaySteps.filter(step => step.mismatches.length > 0).length;
  const passedSteps = input.replaySteps.length - failedSteps;

  return {
    reportId: `phase57-report-${input.replayId}`,
    replayStatus: input.replayStatus,
    sourceLifecycleFixtureName: input.sourceLifecycleFixtureName,
    totalEvents: input.snapshots.length,
    totalSteps: input.replaySteps.length,
    passedSteps,
    failedSteps,
    mismatchCount: input.mismatches.length,
    finalStateId: input.finalStateId,
    snapshotChecksums: input.snapshots.map(snapshot => snapshot.lifecycleStateChecksum),
    summary:
      input.replayStatus === 'passed'
        ? 'Synthetic event stream replay matched expected snapshots in fixture-only mode.'
        : input.replayStatus === 'rejected'
          ? 'Synthetic event stream replay rejected unsafe replay input in fixture-only mode.'
          : 'Synthetic event stream replay completed with deterministic mismatches in fixture-only mode.',
    validationSummary: `Validated ${input.replaySteps.length} replay steps and ${input.snapshots.length} snapshots.`,
    safetySummary: 'Replay report is fixture-only, non-actionable, deterministic, and not a signal.',
    meta: {
      generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
      source: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
      schemaVersion: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
      deterministic: true,
    },
  };
}
