import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SCHEMA_VERSION,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SOURCE,
  type MultiProviderReadOnlyFoundationFixture,
  type MultiProviderReadOnlyFoundationKind,
  type MultiProviderReadOnlyFoundationName,
} from './types.js';

export function stableDeterministicMultiProviderReadOnlyFoundationChecksum(content: string): string {
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

export function isValidMultiProviderReadOnlyFoundationName(
  value: unknown,
): value is MultiProviderReadOnlyFoundationName {
  return (
    typeof value === 'string' &&
    (MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES as readonly string[]).includes(value)
  );
}

export function isValidMultiProviderReadOnlyFoundationKind(
  value: unknown,
): value is MultiProviderReadOnlyFoundationKind {
  return (
    typeof value === 'string' &&
    (MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS as readonly string[]).includes(value)
  );
}

export function isValidMultiProviderReadOnlyFoundationGeneratedAt(
  value: unknown,
): value is typeof PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT {
  return value === PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT;
}

export function isValidMultiProviderReadOnlyFoundationSource(
  value: unknown,
): value is typeof PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SOURCE {
  return value === PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SOURCE;
}

export function isValidMultiProviderReadOnlyFoundationSchemaVersion(
  value: unknown,
): value is typeof PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SCHEMA_VERSION {
  return value === PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SCHEMA_VERSION;
}

export function normalizeMultiProviderReadOnlyFoundationFixture(
  fixture: MultiProviderReadOnlyFoundationFixture,
): MultiProviderReadOnlyFoundationFixture {
  return {
    ...fixture,
    providerRegistry: {
      ...fixture.providerRegistry,
      defaultProviderOrder: [...fixture.providerRegistry.defaultProviderOrder].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      disabledProviderEntries: [...fixture.providerRegistry.disabledProviderEntries].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      providerEntries: [...fixture.providerRegistry.providerEntries].sort((left, right) =>
        left.providerId.localeCompare(right.providerId, 'en-US'),
      ),
    },
    providerHealthScores: [...fixture.providerHealthScores].sort((left, right) =>
      left.providerId.localeCompare(right.providerId, 'en-US'),
    ),
    staleDataChecks: [...fixture.staleDataChecks].sort((left, right) =>
      left.providerId.localeCompare(right.providerId, 'en-US'),
    ),
    normalizedProviderRecord: {
      ...fixture.normalizedProviderRecord,
      normalizedFields: [...fixture.normalizedProviderRecord.normalizedFields].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      missingFields: [...fixture.normalizedProviderRecord.missingFields].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      semanticCaveats: [...fixture.normalizedProviderRecord.semanticCaveats].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
    providerSelection: {
      ...fixture.providerSelection,
      fallbackProviderIds: [...fixture.providerSelection.fallbackProviderIds].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
    providerFallback: {
      ...fixture.providerFallback,
      fallbackProviderIds: [...fixture.providerFallback.fallbackProviderIds].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
      fallbackReasonCodes: [...fixture.providerFallback.fallbackReasonCodes].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
  };
}

export function serializeMultiProviderReadOnlyFoundationFixture(
  fixture: MultiProviderReadOnlyFoundationFixture,
): string {
  return stablePrettyJsonStringify(normalizeMultiProviderReadOnlyFoundationFixture(fixture));
}

export function areMultiProviderReadOnlyFoundationFixturesEqual(
  left: MultiProviderReadOnlyFoundationFixture,
  right: MultiProviderReadOnlyFoundationFixture,
): boolean {
  return (
    stableDeterministicMultiProviderReadOnlyFoundationChecksum(
      serializeMultiProviderReadOnlyFoundationFixture(left),
    ) ===
    stableDeterministicMultiProviderReadOnlyFoundationChecksum(
      serializeMultiProviderReadOnlyFoundationFixture(right),
    )
  );
}
