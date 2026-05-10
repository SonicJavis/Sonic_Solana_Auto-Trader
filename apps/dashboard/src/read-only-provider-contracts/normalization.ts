/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: normalization.
 */

import {
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
  READ_ONLY_PROVIDER_CONTRACT_KINDS,
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
  type ReadOnlyProviderContractFixture,
  type ReadOnlyProviderContractKind,
  type ReadOnlyProviderContractName,
} from './types.js';

export function stableDeterministicReadOnlyProviderContractChecksum(content: string): string {
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

export function isValidReadOnlyProviderContractName(
  value: unknown,
): value is ReadOnlyProviderContractName {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_CONTRACT_NAMES as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderContractKind(
  value: unknown,
): value is ReadOnlyProviderContractKind {
  return (
    typeof value === 'string' &&
    (READ_ONLY_PROVIDER_CONTRACT_KINDS as readonly string[]).includes(value)
  );
}

export function isValidReadOnlyProviderContractGeneratedAt(value: unknown): boolean {
  return value === PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT;
}

export function isValidReadOnlyProviderContractSource(value: unknown): boolean {
  return value === PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE;
}

export function normalizeReadOnlyProviderContractFixture(
  fixture: ReadOnlyProviderContractFixture,
): ReadOnlyProviderContractFixture {
  return {
    ...fixture,
    syntheticResponses: [...fixture.syntheticResponses].sort((left, right) =>
      left.responseId.localeCompare(right.responseId),
    ),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId),
    ),
  };
}

export function serializeReadOnlyProviderContractFixture(
  fixture: ReadOnlyProviderContractFixture,
): string {
  return stablePrettyJsonStringify(normalizeReadOnlyProviderContractFixture(fixture));
}

export function areReadOnlyProviderContractFixturesEqual(
  left: ReadOnlyProviderContractFixture,
  right: ReadOnlyProviderContractFixture,
): boolean {
  return (
    serializeReadOnlyProviderContractFixture(left) ===
    serializeReadOnlyProviderContractFixture(right)
  );
}
