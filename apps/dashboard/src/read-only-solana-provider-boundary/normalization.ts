import {
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION,
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_STATE_KINDS,
  type ReadOnlySolanaProviderBoundaryFixture,
  type ReadOnlySolanaProviderBoundaryKind,
  type ReadOnlySolanaProviderBoundaryName,
  type ReadOnlySolanaProviderBoundaryStateKind,
} from './types.js';

export function stableDeterministicReadOnlySolanaProviderBoundaryChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, 'en-US'))
      .reduce<Record<string, unknown>>((accumulator, [key, nestedValue]) => {
        accumulator[key] = sortKeysDeep(nestedValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidReadOnlySolanaProviderBoundaryName(
  value: unknown,
): value is ReadOnlySolanaProviderBoundaryName {
  return (
    typeof value === 'string' &&
    (READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES as readonly string[]).includes(value)
  );
}
export function isValidReadOnlySolanaProviderBoundaryKind(
  value: unknown,
): value is ReadOnlySolanaProviderBoundaryKind {
  return (
    typeof value === 'string' &&
    (READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS as readonly string[]).includes(value)
  );
}
export function isValidReadOnlySolanaProviderBoundaryStateKind(
  value: unknown,
): value is ReadOnlySolanaProviderBoundaryStateKind {
  return (
    typeof value === 'string' &&
    (READ_ONLY_SOLANA_PROVIDER_BOUNDARY_STATE_KINDS as readonly string[]).includes(value)
  );
}
export function isValidReadOnlySolanaProviderBoundaryGeneratedAt(
  value: unknown,
): value is typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT {
  return value === PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
}
export function isValidReadOnlySolanaProviderBoundarySource(
  value: unknown,
): value is typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE {
  return value === PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE;
}
export function isValidReadOnlySolanaProviderBoundarySchemaVersion(
  value: unknown,
): value is typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION {
  return value === PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION;
}

export function normalizeReadOnlySolanaProviderBoundaryFixture(
  fixture: ReadOnlySolanaProviderBoundaryFixture,
): ReadOnlySolanaProviderBoundaryFixture {
  return {
    ...fixture,
    fieldMappings: [...fixture.fieldMappings].sort((left, right) =>
      left.mappingKind.localeCompare(right.mappingKind, 'en-US'),
    ),
    errorNormalizationRules: [...fixture.errorNormalizationRules].sort((left, right) =>
      left.category.localeCompare(right.category, 'en-US'),
    ),
    conformanceChecks: [...fixture.conformanceChecks].sort((left, right) =>
      left.checkKind.localeCompare(right.checkKind, 'en-US'),
    ),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
    mockToRealMapping: {
      ...fixture.mockToRealMapping,
      fieldMappings: [...fixture.mockToRealMapping.fieldMappings].sort((left, right) =>
        left.mappingKind.localeCompare(right.mappingKind, 'en-US'),
      ),
      unmappedRequiredFields: [...fixture.mockToRealMapping.unmappedRequiredFields].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
  };
}

export function serializeReadOnlySolanaProviderBoundaryFixture(
  fixture: ReadOnlySolanaProviderBoundaryFixture,
): string {
  return stablePrettyJsonStringify(normalizeReadOnlySolanaProviderBoundaryFixture(fixture));
}

export function areReadOnlySolanaProviderBoundaryFixturesEqual(
  left: ReadOnlySolanaProviderBoundaryFixture,
  right: ReadOnlySolanaProviderBoundaryFixture,
): boolean {
  return (
    stableDeterministicReadOnlySolanaProviderBoundaryChecksum(
      serializeReadOnlySolanaProviderBoundaryFixture(left),
    ) ===
    stableDeterministicReadOnlySolanaProviderBoundaryChecksum(
      serializeReadOnlySolanaProviderBoundaryFixture(right),
    )
  );
}

