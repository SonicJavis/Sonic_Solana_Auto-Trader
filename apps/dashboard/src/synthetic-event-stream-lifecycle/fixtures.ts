/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: fixtures.
 */

import { buildSyntheticEventStreamLifecycleFixture } from './builders.js';
import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
  type SyntheticEventStreamLifecycleFixture,
  type SyntheticEventStreamLifecycleStreamKind,
  type SyntheticEventStreamLifecycleStreamName,
} from './types.js';

export const SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES =
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES.map(fixtureName =>
    buildSyntheticEventStreamLifecycleFixture({ fixtureName }),
  ) satisfies readonly SyntheticEventStreamLifecycleFixture[];

export const SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURE_MAP: ReadonlyMap<
  string,
  SyntheticEventStreamLifecycleFixture
> = new Map(
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.length < 8) {
  throw new Error(
    `Phase 56 fixture count mismatch: expected >= 8, received ${SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.length}`,
  );
}

if (
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES.length !==
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS.length
) {
  throw new Error('Phase 56 stream name/kind cardinality mismatch');
}

export function listSyntheticEventStreamLifecycleFixtures(): readonly SyntheticEventStreamLifecycleFixture[] {
  return SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES;
}

export function getSyntheticEventStreamLifecycleFixture(
  fixtureId: string,
): SyntheticEventStreamLifecycleFixture | null {
  return SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS,
};

export type {
  SyntheticEventStreamLifecycleStreamName,
  SyntheticEventStreamLifecycleStreamKind,
};
