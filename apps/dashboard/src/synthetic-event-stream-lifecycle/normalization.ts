/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: normalization.
 */

import {
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
  type SyntheticEventStreamLifecycleFixture,
  type SyntheticEventStreamLifecycleStreamKind,
  type SyntheticEventStreamLifecycleStreamName,
} from './types.js';

export function stableDeterministicSyntheticEventStreamLifecycleChecksum(content: string): string {
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
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}
`;
}

export function isValidSyntheticEventStreamLifecycleStreamName(
  value: unknown,
): value is SyntheticEventStreamLifecycleStreamName {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[]).includes(value)
  );
}

export function isValidSyntheticEventStreamLifecycleStreamKind(
  value: unknown,
): value is SyntheticEventStreamLifecycleStreamKind {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS as readonly string[]).includes(value)
  );
}

export function isValidSyntheticEventStreamLifecycleGeneratedAt(value: unknown): boolean {
  return value === PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT;
}

export function isValidSyntheticEventStreamLifecycleSource(value: unknown): boolean {
  return value === PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE;
}

export function isValidSyntheticEventStreamLifecycleSchemaVersion(value: unknown): boolean {
  return value === PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION;
}

export function normalizeSyntheticEventStreamLifecycleFixture(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleFixture {
  return {
    ...fixture,
    events: [...fixture.events].sort((left, right) => {
      if (left.sequence !== right.sequence) {
        return left.sequence - right.sequence;
      }
      return left.eventId.localeCompare(right.eventId);
    }),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId),
    ),
    derivedLifecycleState: {
      ...fixture.derivedLifecycleState,
      eventReferences: [...fixture.derivedLifecycleState.eventReferences].sort((left, right) =>
        left.localeCompare(right),
      ),
    },
  };
}

export function serializeSyntheticEventStreamLifecycleFixture(
  fixture: SyntheticEventStreamLifecycleFixture,
): string {
  return stablePrettyJsonStringify(normalizeSyntheticEventStreamLifecycleFixture(fixture));
}

export function areSyntheticEventStreamLifecycleFixturesEqual(
  left: SyntheticEventStreamLifecycleFixture,
  right: SyntheticEventStreamLifecycleFixture,
): boolean {
  return (
    serializeSyntheticEventStreamLifecycleFixture(left) ===
    serializeSyntheticEventStreamLifecycleFixture(right)
  );
}
