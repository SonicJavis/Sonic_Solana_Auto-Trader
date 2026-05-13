import {
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT,
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION,
  PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SOURCE,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS,
  PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES,
  type ProviderReliabilityDriftAuditFixture,
  type ProviderReliabilityDriftAuditKind,
  type ProviderReliabilityDriftAuditName,
} from './types.js';

export function stableDeterministicProviderReliabilityDriftAuditChecksum(content: string): string {
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

export function isValidProviderReliabilityDriftAuditName(value: unknown): value is ProviderReliabilityDriftAuditName {
  return typeof value === 'string' && (PROVIDER_RELIABILITY_DRIFT_AUDIT_NAMES as readonly string[]).includes(value);
}

export function isValidProviderReliabilityDriftAuditKind(value: unknown): value is ProviderReliabilityDriftAuditKind {
  return typeof value === 'string' && (PROVIDER_RELIABILITY_DRIFT_AUDIT_KINDS as readonly string[]).includes(value);
}

export function isValidProviderReliabilityDriftAuditGeneratedAt(
  value: unknown,
): value is typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT {
  return value === PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_GENERATED_AT;
}

export function isValidProviderReliabilityDriftAuditSource(
  value: unknown,
): value is typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SOURCE {
  return value === PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SOURCE;
}

export function isValidProviderReliabilityDriftAuditSchemaVersion(
  value: unknown,
): value is typeof PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION {
  return value === PHASE_70_PROVIDER_RELIABILITY_DRIFT_AUDIT_SCHEMA_VERSION;
}

export function normalizeProviderReliabilityDriftAuditFixture(
  fixture: ProviderReliabilityDriftAuditFixture,
): ProviderReliabilityDriftAuditFixture {
  return {
    ...fixture,
    driftAudit: {
      ...fixture.driftAudit,
      mismatchFields: [...fixture.driftAudit.mismatchFields].sort((left, right) => left.localeCompare(right, 'en-US')),
    },
    schemaDrift: {
      ...fixture.schemaDrift,
      missingFields: [...fixture.schemaDrift.missingFields].sort((left, right) => left.localeCompare(right, 'en-US')),
      extraFields: [...fixture.schemaDrift.extraFields].sort((left, right) => left.localeCompare(right, 'en-US')),
      incompatibleFields: [...fixture.schemaDrift.incompatibleFields].sort((left, right) =>
        left.localeCompare(right, 'en-US'),
      ),
    },
    instabilityEvents: [...fixture.instabilityEvents].sort((left, right) => left.eventId.localeCompare(right.eventId, 'en-US')),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) => left.selectorId.localeCompare(right.selectorId, 'en-US')),
    sourcePhase65FixtureSnapshot: [...fixture.sourcePhase65FixtureSnapshot].sort((left, right) => left.localeCompare(right, 'en-US')),
    sourcePhase66FixtureSnapshot: [...fixture.sourcePhase66FixtureSnapshot].sort((left, right) => left.localeCompare(right, 'en-US')),
    sourcePhase67FixtureSnapshot: [...fixture.sourcePhase67FixtureSnapshot].sort((left, right) => left.localeCompare(right, 'en-US')),
    sourcePhase68FixtureSnapshot: [...fixture.sourcePhase68FixtureSnapshot].sort((left, right) => left.localeCompare(right, 'en-US')),
    sourcePhase69FixtureSnapshot: [...fixture.sourcePhase69FixtureSnapshot].sort((left, right) => left.localeCompare(right, 'en-US')),
  };
}

export function serializeProviderReliabilityDriftAuditFixture(
  fixture: ProviderReliabilityDriftAuditFixture,
): string {
  return stablePrettyJsonStringify(normalizeProviderReliabilityDriftAuditFixture(fixture));
}

export function areProviderReliabilityDriftAuditFixturesEqual(
  left: ProviderReliabilityDriftAuditFixture,
  right: ProviderReliabilityDriftAuditFixture,
): boolean {
  return (
    stableDeterministicProviderReliabilityDriftAuditChecksum(serializeProviderReliabilityDriftAuditFixture(left)) ===
    stableDeterministicProviderReliabilityDriftAuditChecksum(serializeProviderReliabilityDriftAuditFixture(right))
  );
}
