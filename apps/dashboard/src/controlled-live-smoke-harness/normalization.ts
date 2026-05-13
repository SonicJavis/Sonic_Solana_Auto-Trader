import {
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT,
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SCHEMA_VERSION,
  PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SOURCE,
  CONTROLLED_LIVE_SMOKE_HARNESS_NAMES,
  CONTROLLED_LIVE_SMOKE_HARNESS_KINDS,
  type ControlledLiveSmokeHarnessFixture,
  type ControlledLiveSmokeHarnessKind,
  type ControlledLiveSmokeHarnessName,
} from './types.js';

export function stableDeterministicControlledLiveSmokeHarnessChecksum(content: string): string {
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

export function isValidControlledLiveSmokeHarnessName(value: unknown): value is ControlledLiveSmokeHarnessName {
  return typeof value === 'string' && (CONTROLLED_LIVE_SMOKE_HARNESS_NAMES as readonly string[]).includes(value);
}

export function isValidControlledLiveSmokeHarnessKind(value: unknown): value is ControlledLiveSmokeHarnessKind {
  return typeof value === 'string' && (CONTROLLED_LIVE_SMOKE_HARNESS_KINDS as readonly string[]).includes(value);
}

export function isValidControlledLiveSmokeHarnessGeneratedAt(
  value: unknown,
): value is typeof PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT {
  return value === PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_GENERATED_AT;
}

export function isValidControlledLiveSmokeHarnessSource(
  value: unknown,
): value is typeof PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SOURCE {
  return value === PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SOURCE;
}

export function isValidControlledLiveSmokeHarnessSchemaVersion(
  value: unknown,
): value is typeof PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SCHEMA_VERSION {
  return value === PHASE_74_CONTROLLED_LIVE_SMOKE_HARNESS_SCHEMA_VERSION;
}

export function normalizeControlledLiveSmokeHarnessFixture(
  fixture: ControlledLiveSmokeHarnessFixture,
): ControlledLiveSmokeHarnessFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as ControlledLiveSmokeHarnessFixture;
}

export function serializeControlledLiveSmokeHarnessFixture(
  fixture: ControlledLiveSmokeHarnessFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function areControlledLiveSmokeHarnessFixturesEqual(
  a: ControlledLiveSmokeHarnessFixture,
  b: ControlledLiveSmokeHarnessFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
