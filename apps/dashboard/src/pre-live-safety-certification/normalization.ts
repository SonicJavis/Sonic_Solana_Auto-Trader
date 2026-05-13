import {
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT,
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SCHEMA_VERSION,
  PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SOURCE,
  PRE_LIVE_SAFETY_CERTIFICATION_NAMES,
  PRE_LIVE_SAFETY_CERTIFICATION_KINDS,
  type PreLiveSafetyCertificationFixture,
  type PreLiveSafetyCertificationKind,
  type PreLiveSafetyCertificationName,
} from './types.js';

export function stableDeterministicPreLiveSafetyCertificationChecksum(content: string): string {
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

export function isValidPreLiveSafetyCertificationName(value: unknown): value is PreLiveSafetyCertificationName {
  return typeof value === 'string' && (PRE_LIVE_SAFETY_CERTIFICATION_NAMES as readonly string[]).includes(value);
}

export function isValidPreLiveSafetyCertificationKind(value: unknown): value is PreLiveSafetyCertificationKind {
  return typeof value === 'string' && (PRE_LIVE_SAFETY_CERTIFICATION_KINDS as readonly string[]).includes(value);
}

export function isValidPreLiveSafetyCertificationGeneratedAt(
  value: unknown,
): value is typeof PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT {
  return value === PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_GENERATED_AT;
}

export function isValidPreLiveSafetyCertificationSource(
  value: unknown,
): value is typeof PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SOURCE {
  return value === PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SOURCE;
}

export function isValidPreLiveSafetyCertificationSchemaVersion(
  value: unknown,
): value is typeof PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SCHEMA_VERSION {
  return value === PHASE_75_PRE_LIVE_SAFETY_CERTIFICATION_SCHEMA_VERSION;
}

export function normalizePreLiveSafetyCertificationFixture(
  fixture: PreLiveSafetyCertificationFixture,
): PreLiveSafetyCertificationFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as PreLiveSafetyCertificationFixture;
}

export function serializePreLiveSafetyCertificationFixture(
  fixture: PreLiveSafetyCertificationFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function arePreLiveSafetyCertificationFixturesEqual(
  a: PreLiveSafetyCertificationFixture,
  b: PreLiveSafetyCertificationFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
