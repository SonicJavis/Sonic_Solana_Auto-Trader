import {
  MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS,
  MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SCHEMA_VERSION,
  PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SOURCE,
  type ManualConfirmDryRunControlFixture,
  type ManualConfirmDryRunControlKind,
  type ManualConfirmDryRunControlName,
} from './types.js';

export function stableDeterministicManualConfirmDryRunControlChecksum(content: string): string {
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

export function isValidManualConfirmDryRunControlName(value: unknown): value is ManualConfirmDryRunControlName {
  return typeof value === 'string' && (MANUAL_CONFIRM_DRY_RUN_CONTROL_NAMES as readonly string[]).includes(value);
}

export function isValidManualConfirmDryRunControlKind(value: unknown): value is ManualConfirmDryRunControlKind {
  return typeof value === 'string' && (MANUAL_CONFIRM_DRY_RUN_CONTROL_KINDS as readonly string[]).includes(value);
}

export function isValidManualConfirmDryRunControlGeneratedAt(
  value: unknown,
): value is typeof PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT {
  return value === PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_GENERATED_AT;
}

export function isValidManualConfirmDryRunControlSource(
  value: unknown,
): value is typeof PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SOURCE {
  return value === PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SOURCE;
}

export function isValidManualConfirmDryRunControlSchemaVersion(
  value: unknown,
): value is typeof PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SCHEMA_VERSION {
  return value === PHASE_77_MANUAL_CONFIRM_DRY_RUN_CONTROL_SCHEMA_VERSION;
}

export function normalizeManualConfirmDryRunControlFixture(
  fixture: ManualConfirmDryRunControlFixture,
): ManualConfirmDryRunControlFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as ManualConfirmDryRunControlFixture;
}

export function serializeManualConfirmDryRunControlFixture(
  fixture: ManualConfirmDryRunControlFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function areManualConfirmDryRunControlFixturesEqual(
  a: ManualConfirmDryRunControlFixture,
  b: ManualConfirmDryRunControlFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
