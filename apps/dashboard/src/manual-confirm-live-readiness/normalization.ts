import {
  MANUAL_CONFIRM_LIVE_READINESS_KINDS,
  MANUAL_CONFIRM_LIVE_READINESS_NAMES,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SCHEMA_VERSION,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SOURCE,
  type ManualConfirmLiveReadinessFixture,
  type ManualConfirmLiveReadinessKind,
  type ManualConfirmLiveReadinessName,
} from './types.js';

export function stableDeterministicManualConfirmChecksum(content: string): string {
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

export function isValidManualConfirmLiveReadinessName(value: unknown): value is ManualConfirmLiveReadinessName {
  return typeof value === 'string' && (MANUAL_CONFIRM_LIVE_READINESS_NAMES as readonly string[]).includes(value);
}

export function isValidManualConfirmLiveReadinessKind(value: unknown): value is ManualConfirmLiveReadinessKind {
  return typeof value === 'string' && (MANUAL_CONFIRM_LIVE_READINESS_KINDS as readonly string[]).includes(value);
}

export function isValidManualConfirmGeneratedAt(
  value: unknown,
): value is typeof PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT {
  return value === PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT;
}

export function isValidManualConfirmSource(
  value: unknown,
): value is typeof PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SOURCE {
  return value === PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SOURCE;
}

export function isValidManualConfirmSchemaVersion(
  value: unknown,
): value is typeof PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SCHEMA_VERSION {
  return value === PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_SCHEMA_VERSION;
}

export function normalizeManualConfirmLiveReadinessFixture(
  fixture: ManualConfirmLiveReadinessFixture,
): ManualConfirmLiveReadinessFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as ManualConfirmLiveReadinessFixture;
}

export function serializeManualConfirmLiveReadinessFixture(
  fixture: ManualConfirmLiveReadinessFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function areManualConfirmLiveReadinessFixturesEqual(
  a: ManualConfirmLiveReadinessFixture,
  b: ManualConfirmLiveReadinessFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
