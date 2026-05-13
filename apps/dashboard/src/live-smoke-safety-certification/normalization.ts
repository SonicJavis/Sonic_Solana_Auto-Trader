import {
  LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS,
  LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SCHEMA_VERSION,
  PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SOURCE,
  type LiveSmokeSafetyCertificationFixture,
  type LiveSmokeSafetyCertificationKind,
  type LiveSmokeSafetyCertificationName,
} from './types.js';

export function stableDeterministicLiveSmokeSafetyCertificationChecksum(content: string): string {
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

export function isValidLiveSmokeSafetyCertificationName(value: unknown): value is LiveSmokeSafetyCertificationName {
  return typeof value === 'string' && (LIVE_SMOKE_SAFETY_CERTIFICATION_NAMES as readonly string[]).includes(value);
}

export function isValidLiveSmokeSafetyCertificationKind(value: unknown): value is LiveSmokeSafetyCertificationKind {
  return typeof value === 'string' && (LIVE_SMOKE_SAFETY_CERTIFICATION_KINDS as readonly string[]).includes(value);
}

export function isValidLiveSmokeSafetyCertificationGeneratedAt(
  value: unknown,
): value is typeof PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT {
  return value === PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_GENERATED_AT;
}

export function isValidLiveSmokeSafetyCertificationSource(
  value: unknown,
): value is typeof PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SOURCE {
  return value === PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SOURCE;
}

export function isValidLiveSmokeSafetyCertificationSchemaVersion(
  value: unknown,
): value is typeof PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SCHEMA_VERSION {
  return value === PHASE_69_LIVE_SMOKE_SAFETY_CERTIFICATION_SCHEMA_VERSION;
}

export function normalizeLiveSmokeSafetyCertificationFixture(
  fixture: LiveSmokeSafetyCertificationFixture,
): LiveSmokeSafetyCertificationFixture {
  return {
    ...fixture,
    smokePlan: {
      ...fixture.smokePlan,
      checkKinds: [...fixture.smokePlan.checkKinds].sort((left, right) => left.localeCompare(right, 'en-US')),
      safetyNotes: [...fixture.smokePlan.safetyNotes].sort((left, right) => left.localeCompare(right, 'en-US')),
    },
    readOnlyChecks: [...fixture.readOnlyChecks].sort((left, right) => left.checkId.localeCompare(right.checkId, 'en-US')),
    selectorExamples: [...fixture.selectorExamples].sort((left, right) =>
      left.selectorId.localeCompare(right.selectorId, 'en-US'),
    ),
    sourcePhase65FixtureSnapshot: [...fixture.sourcePhase65FixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
    sourcePhase66FixtureSnapshot: [...fixture.sourcePhase66FixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
    sourcePhase67FixtureSnapshot: [...fixture.sourcePhase67FixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
    sourcePhase68FixtureSnapshot: [...fixture.sourcePhase68FixtureSnapshot].sort((left, right) =>
      left.localeCompare(right, 'en-US'),
    ),
  };
}

export function serializeLiveSmokeSafetyCertificationFixture(fixture: LiveSmokeSafetyCertificationFixture): string {
  return stablePrettyJsonStringify(normalizeLiveSmokeSafetyCertificationFixture(fixture));
}

export function areLiveSmokeSafetyCertificationFixturesEqual(
  left: LiveSmokeSafetyCertificationFixture,
  right: LiveSmokeSafetyCertificationFixture,
): boolean {
  return (
    stableDeterministicLiveSmokeSafetyCertificationChecksum(serializeLiveSmokeSafetyCertificationFixture(left)) ===
    stableDeterministicLiveSmokeSafetyCertificationChecksum(serializeLiveSmokeSafetyCertificationFixture(right))
  );
}
