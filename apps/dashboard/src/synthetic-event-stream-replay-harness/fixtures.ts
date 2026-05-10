/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: fixtures.
 */

import { buildSyntheticEventStreamReplayHarnessFixture } from './builders.js';
import {
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES,
  type SyntheticEventStreamReplayHarnessFixture,
  type SyntheticEventStreamReplayHarnessScenarioKind,
  type SyntheticEventStreamReplayHarnessScenarioName,
} from './types.js';

export const SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES =
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES.map(fixtureName =>
    buildSyntheticEventStreamReplayHarnessFixture({ fixtureName }),
  ) satisfies readonly SyntheticEventStreamReplayHarnessFixture[];

export const SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURE_MAP: ReadonlyMap<
  string,
  SyntheticEventStreamReplayHarnessFixture
> = new Map(SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.length < 8) {
  throw new Error(
    `Phase 57 fixture count mismatch: expected >= 8, received ${SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.length}`,
  );
}

if (
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES.length !==
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS.length
) {
  throw new Error('Phase 57 replay scenario name/kind cardinality mismatch');
}

export function listSyntheticEventStreamReplayHarnessFixtures(): readonly SyntheticEventStreamReplayHarnessFixture[] {
  return SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES;
}

export function getSyntheticEventStreamReplayHarnessFixture(
  fixtureId: string,
): SyntheticEventStreamReplayHarnessFixture | null {
  return SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS,
};

export type {
  SyntheticEventStreamReplayHarnessScenarioName,
  SyntheticEventStreamReplayHarnessScenarioKind,
};
