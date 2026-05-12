import {
  CROSS_PROVIDER_DATA_QUALITY_KINDS,
  CROSS_PROVIDER_DATA_QUALITY_NAMES,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SCHEMA_VERSION,
  PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SOURCE,
  type CrossProviderDataQualityFixture,
  type CrossProviderDataQualityKind,
  type CrossProviderDataQualityName,
} from './types.js';

export function stableDeterministicCrossProviderDataQualityChecksum(content: string): string {
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

export function isValidCrossProviderDataQualityName(value: unknown): value is CrossProviderDataQualityName {
  return typeof value === 'string' && (CROSS_PROVIDER_DATA_QUALITY_NAMES as readonly string[]).includes(value);
}

export function isValidCrossProviderDataQualityKind(value: unknown): value is CrossProviderDataQualityKind {
  return typeof value === 'string' && (CROSS_PROVIDER_DATA_QUALITY_KINDS as readonly string[]).includes(value);
}

export function isValidCrossProviderDataQualityGeneratedAt(
  value: unknown,
): value is typeof PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT {
  return value === PHASE_67_CROSS_PROVIDER_DATA_QUALITY_GENERATED_AT;
}

export function isValidCrossProviderDataQualitySource(
  value: unknown,
): value is typeof PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SOURCE {
  return value === PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SOURCE;
}

export function isValidCrossProviderDataQualitySchemaVersion(
  value: unknown,
): value is typeof PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SCHEMA_VERSION {
  return value === PHASE_67_CROSS_PROVIDER_DATA_QUALITY_SCHEMA_VERSION;
}

export function normalizeCrossProviderDataQualityFixture(
  fixture: CrossProviderDataQualityFixture,
): CrossProviderDataQualityFixture {
  return {
    ...fixture,
    dataQualityIssues: [...fixture.dataQualityIssues].sort((left, right) =>
      left.issueId.localeCompare(right.issueId, 'en-US'),
    ),
    mismatchReports: [...fixture.mismatchReports].sort((left, right) =>
      left.mismatchReportId.localeCompare(right.mismatchReportId, 'en-US'),
    ),
    provenanceRecords: [...fixture.provenanceRecords].sort((left, right) =>
      left.provenanceId.localeCompare(right.provenanceId, 'en-US'),
    ),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
    sourcePhase66FixtureSnapshot: [...fixture.sourcePhase66FixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
  };
}

export function serializeCrossProviderDataQualityFixture(fixture: CrossProviderDataQualityFixture): string {
  return stablePrettyJsonStringify(normalizeCrossProviderDataQualityFixture(fixture));
}

export function areCrossProviderDataQualityFixturesEqual(
  left: CrossProviderDataQualityFixture,
  right: CrossProviderDataQualityFixture,
): boolean {
  return (
    stableDeterministicCrossProviderDataQualityChecksum(serializeCrossProviderDataQualityFixture(left)) ===
    stableDeterministicCrossProviderDataQualityChecksum(serializeCrossProviderDataQualityFixture(right))
  );
}
