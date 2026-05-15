import {
  PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT,
  PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SCHEMA_VERSION,
  PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SOURCE,
  TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS,
  TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES,
  type TransactionSendBoundarySafetyContractKind,
  type TransactionSendBoundarySafetyContractName,
  type TransactionSendBoundarySafetyFixture,
} from './types.js';

export function stableDeterministicTransactionSendBoundarySafetyChecksum(content: string): string {
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
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}
`;
}

export function isValidTransactionSendBoundarySafetyName(value: unknown): value is TransactionSendBoundarySafetyContractName {
  return typeof value === 'string' && (TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES as readonly string[]).includes(value);
}

export function isValidTransactionSendBoundarySafetyKind(value: unknown): value is TransactionSendBoundarySafetyContractKind {
  return typeof value === 'string' && (TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS as readonly string[]).includes(value);
}

export function isValidTransactionSendBoundarySafetyGeneratedAt(
  value: unknown,
): value is typeof PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT {
  return value === PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT;
}

export function isValidTransactionSendBoundarySafetySource(
  value: unknown,
): value is typeof PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SOURCE {
  return value === PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SOURCE;
}

export function isValidTransactionSendBoundarySafetySchemaVersion(
  value: unknown,
): value is typeof PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SCHEMA_VERSION {
  return value === PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_SCHEMA_VERSION;
}

export function normalizeTransactionSendBoundarySafetyFixture(
  fixture: TransactionSendBoundarySafetyFixture,
): TransactionSendBoundarySafetyFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as TransactionSendBoundarySafetyFixture;
}

export function serializeTransactionSendBoundarySafetyFixture(fixture: TransactionSendBoundarySafetyFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areTransactionSendBoundarySafetyFixturesEqual(
  a: TransactionSendBoundarySafetyFixture,
  b: TransactionSendBoundarySafetyFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
