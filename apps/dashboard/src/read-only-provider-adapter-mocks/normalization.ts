/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: normalization.
 */

import {
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
  type ReadOnlyProviderAdapterMockFixture,
  type ReadOnlyProviderAdapterMockKind,
  type ReadOnlyProviderAdapterMockName,
} from './types.js';

export function stableDeterministicReadOnlyProviderAdapterMockChecksum(content: string): string {
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

export function isValidReadOnlyProviderAdapterMockName(
  value: unknown,
): value is ReadOnlyProviderAdapterMockName {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderAdapterMockKind(
  value: unknown,
): value is ReadOnlyProviderAdapterMockKind {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderAdapterMockGeneratedAt(value: unknown): boolean {
  return value === PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT;
}

export function isValidReadOnlyProviderAdapterMockSource(value: unknown): boolean {
  return value === PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE;
}

export function normalizeReadOnlyProviderAdapterMockFixture(
  fixture: ReadOnlyProviderAdapterMockFixture,
): ReadOnlyProviderAdapterMockFixture {
  return {
    ...fixture,
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId),
    ),
  };
}

export function serializeReadOnlyProviderAdapterMockFixture(
  fixture: ReadOnlyProviderAdapterMockFixture,
): string {
  return stablePrettyJsonStringify(normalizeReadOnlyProviderAdapterMockFixture(fixture));
}

export function areReadOnlyProviderAdapterMockFixturesEqual(
  left: ReadOnlyProviderAdapterMockFixture,
  right: ReadOnlyProviderAdapterMockFixture,
): boolean {
  return (
    serializeReadOnlyProviderAdapterMockFixture(left) ===
    serializeReadOnlyProviderAdapterMockFixture(right)
  );
}
