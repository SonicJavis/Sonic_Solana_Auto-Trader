import {
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS,
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES,
  PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT,
  PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SCHEMA_VERSION,
  PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SOURCE,
  type ExecutionOutcomeAuditContractKind,
  type ExecutionOutcomeAuditContractName,
  type ExecutionOutcomeAuditFixture,
} from './types.js';

export function stableDeterministicExecutionOutcomeAuditChecksum(content: string): string {
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

export function isValidExecutionOutcomeAuditContractName(
  value: unknown,
): value is ExecutionOutcomeAuditContractName {
  return (
    typeof value === 'string' &&
    (EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES as readonly string[]).includes(value)
  );
}

export function isValidExecutionOutcomeAuditContractKind(
  value: unknown,
): value is ExecutionOutcomeAuditContractKind {
  return (
    typeof value === 'string' &&
    (EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS as readonly string[]).includes(value)
  );
}

export function isValidExecutionOutcomeAuditGeneratedAt(
  value: unknown,
): value is typeof PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT {
  return value === PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT;
}

export function isValidExecutionOutcomeAuditSource(
  value: unknown,
): value is typeof PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SOURCE {
  return value === PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SOURCE;
}

export function isValidExecutionOutcomeAuditSchemaVersion(
  value: unknown,
): value is typeof PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SCHEMA_VERSION {
  return value === PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_SCHEMA_VERSION;
}

export function normalizeExecutionOutcomeAuditFixture(
  fixture: ExecutionOutcomeAuditFixture,
): ExecutionOutcomeAuditFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as ExecutionOutcomeAuditFixture;
}

export function serializeExecutionOutcomeAuditFixture(fixture: ExecutionOutcomeAuditFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areExecutionOutcomeAuditFixturesEqual(
  a: ExecutionOutcomeAuditFixture,
  b: ExecutionOutcomeAuditFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
