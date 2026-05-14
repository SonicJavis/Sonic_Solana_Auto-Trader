import {
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_KINDS,
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES,
  PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_GENERATED_AT,
  PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_SCHEMA_VERSION,
  PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_SOURCE,
  type ManualConfirmExecutionBoundaryFixture,
  type ManualConfirmExecutionBoundaryKind,
  type ManualConfirmExecutionBoundaryName,
} from './types.js';

export function stableDeterministicManualConfirmExecutionBoundaryChecksum(content: string): string {
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
      .sort(([a], [b]) => a.localeCompare(b, 'en-US'))
      .reduce<Record<string, unknown>>((acc, [key, nested]) => {
        acc[key] = sortKeysDeep(nested);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidManualConfirmExecutionBoundaryName(value: unknown): value is ManualConfirmExecutionBoundaryName {
  return typeof value === 'string' && (MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES as readonly string[]).includes(value);
}

export function isValidManualConfirmExecutionBoundaryKind(value: unknown): value is ManualConfirmExecutionBoundaryKind {
  return typeof value === 'string' && (MANUAL_CONFIRM_EXECUTION_BOUNDARY_KINDS as readonly string[]).includes(value);
}

export function isValidManualConfirmExecutionBoundaryGeneratedAt(
  value: unknown,
): value is typeof PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_GENERATED_AT {
  return value === PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_GENERATED_AT;
}

export function isValidManualConfirmExecutionBoundarySource(
  value: unknown,
): value is typeof PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_SOURCE {
  return value === PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_SOURCE;
}

export function isValidManualConfirmExecutionBoundarySchemaVersion(
  value: unknown,
): value is typeof PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_SCHEMA_VERSION {
  return value === PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_SCHEMA_VERSION;
}

export function normalizeManualConfirmExecutionBoundaryFixture(
  fixture: ManualConfirmExecutionBoundaryFixture,
): ManualConfirmExecutionBoundaryFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as ManualConfirmExecutionBoundaryFixture;
}

export function serializeManualConfirmExecutionBoundaryFixture(fixture: ManualConfirmExecutionBoundaryFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areManualConfirmExecutionBoundaryFixturesEqual(
  a: ManualConfirmExecutionBoundaryFixture,
  b: ManualConfirmExecutionBoundaryFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
