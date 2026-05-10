/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: deterministic clock.
 */

import {
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
  type SyntheticEventStreamReplayClock,
} from './types.js';

export const SYNTHETIC_EVENT_STREAM_REPLAY_CLOCK_START_TIMESTAMP =
  '2026-02-06T00:00:00.000Z' as const;

function toIsoMinuteTimestamp(stepIndex: number): string {
  const bounded = Number.isFinite(stepIndex) && stepIndex > 0 ? Math.trunc(stepIndex) : 0;
  const minute = String(bounded).padStart(2, '0');
  return `2026-02-06T00:${minute}:00.000Z`;
}

export function buildSyntheticEventStreamReplayClock(
  replayId: string,
  stepIndex: number,
): SyntheticEventStreamReplayClock {
  return {
    clockId: `phase57-clock-${replayId}-${String(stepIndex).padStart(2, '0')}`,
    startTimestamp: SYNTHETIC_EVENT_STREAM_REPLAY_CLOCK_START_TIMESTAMP,
    stepIndex,
    currentTimestamp: toIsoMinuteTimestamp(stepIndex),
    schemaVersion: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
    deterministic: true,
  };
}
