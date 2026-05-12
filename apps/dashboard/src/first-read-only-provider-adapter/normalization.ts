import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SOURCE,
  type FirstReadOnlyProviderAdapterFixture,
  type FirstReadOnlyProviderAdapterKind,
  type FirstReadOnlyProviderAdapterName,
} from './types.js';

export function stableDeterministicFirstReadOnlyProviderAdapterChecksum(content: string): string {
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

export function isValidFirstReadOnlyProviderAdapterName(
  value: unknown,
): value is FirstReadOnlyProviderAdapterName {
  return (
    typeof value === 'string' &&
    (FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES as readonly string[]).includes(value)
  );
}

export function isValidFirstReadOnlyProviderAdapterKind(
  value: unknown,
): value is FirstReadOnlyProviderAdapterKind {
  return (
    typeof value === 'string' &&
    (FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS as readonly string[]).includes(value)
  );
}

export function isValidFirstReadOnlyProviderAdapterGeneratedAt(
  value: unknown,
): value is typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT {
  return value === PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT;
}

export function isValidFirstReadOnlyProviderAdapterSource(
  value: unknown,
): value is typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SOURCE {
  return value === PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SOURCE;
}

export function isValidFirstReadOnlyProviderAdapterSchemaVersion(
  value: unknown,
): value is typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION {
  return value === PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION;
}

export function normalizeFirstReadOnlyProviderAdapterFixture(
  fixture: FirstReadOnlyProviderAdapterFixture,
): FirstReadOnlyProviderAdapterFixture {
  return {
    ...fixture,
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
    responseMapping: {
      ...fixture.responseMapping,
      missingRequiredFields: [...fixture.responseMapping.missingRequiredFields].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
    errorNormalization: {
      ...fixture.errorNormalization,
      categories: [...fixture.errorNormalization.categories].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
  };
}

export function serializeFirstReadOnlyProviderAdapterFixture(
  fixture: FirstReadOnlyProviderAdapterFixture,
): string {
  return stablePrettyJsonStringify(normalizeFirstReadOnlyProviderAdapterFixture(fixture));
}

export function areFirstReadOnlyProviderAdapterFixturesEqual(
  left: FirstReadOnlyProviderAdapterFixture,
  right: FirstReadOnlyProviderAdapterFixture,
): boolean {
  return (
    stableDeterministicFirstReadOnlyProviderAdapterChecksum(
      serializeFirstReadOnlyProviderAdapterFixture(left),
    ) ===
    stableDeterministicFirstReadOnlyProviderAdapterChecksum(
      serializeFirstReadOnlyProviderAdapterFixture(right),
    )
  );
}
