/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: normalization.
 */

import {
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES,
  type SyntheticEventStreamReplayHarnessFixture,
  type SyntheticEventStreamReplayHarnessScenarioKind,
  type SyntheticEventStreamReplayHarnessScenarioName,
} from './types.js';

export function stableDeterministicSyntheticEventStreamReplayHarnessChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((accumulator, [key, nextValue]) => {
        accumulator[key] = sortKeysDeep(nextValue);
        return accumulator;
      }, {});
  }

  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidSyntheticEventStreamReplayHarnessScenarioName(
  value: unknown,
): value is SyntheticEventStreamReplayHarnessScenarioName {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES as readonly string[]).includes(value)
  );
}

export function isValidSyntheticEventStreamReplayHarnessScenarioKind(
  value: unknown,
): value is SyntheticEventStreamReplayHarnessScenarioKind {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS as readonly string[]).includes(value)
  );
}

export function isValidSyntheticEventStreamReplayHarnessGeneratedAt(value: unknown): boolean {
  return value === PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT;
}

export function isValidSyntheticEventStreamReplayHarnessSource(value: unknown): boolean {
  return value === PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE;
}

export function isValidSyntheticEventStreamReplayHarnessSchemaVersion(value: unknown): boolean {
  return value === PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCHEMA_VERSION;
}

export function normalizeSyntheticEventStreamReplayHarnessFixture(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessFixture {
  return {
    ...fixture,
    replaySteps: [...fixture.replaySteps].sort((left, right) => left.stepSequence - right.stepSequence),
    expectedSnapshots: [...fixture.expectedSnapshots].sort(
      (left, right) => left.snapshotSequence - right.snapshotSequence,
    ),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId),
    ),
  };
}

export function serializeSyntheticEventStreamReplayHarnessFixture(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): string {
  return stablePrettyJsonStringify(normalizeSyntheticEventStreamReplayHarnessFixture(fixture));
}

export function areSyntheticEventStreamReplayHarnessFixturesEqual(
  left: SyntheticEventStreamReplayHarnessFixture,
  right: SyntheticEventStreamReplayHarnessFixture,
): boolean {
  return (
    serializeSyntheticEventStreamReplayHarnessFixture(left) ===
    serializeSyntheticEventStreamReplayHarnessFixture(right)
  );
}
