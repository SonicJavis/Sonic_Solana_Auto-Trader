import {
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_KINDS,
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES,
  PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_GENERATED_AT,
  PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_SCHEMA_VERSION,
  PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_SOURCE,
  type TransactionConstructionContractMockFixture,
  type TransactionConstructionContractMockKind,
  type TransactionConstructionContractMockName,
} from './types.js';

export function stableDeterministicTransactionConstructionContractMockChecksum(content: string): string {
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

export function isValidTransactionConstructionContractMockName(value: unknown): value is TransactionConstructionContractMockName {
  return typeof value === 'string' && (TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES as readonly string[]).includes(value);
}

export function isValidTransactionConstructionContractMockKind(value: unknown): value is TransactionConstructionContractMockKind {
  return typeof value === 'string' && (TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_KINDS as readonly string[]).includes(value);
}

export function isValidTransactionConstructionContractMockGeneratedAt(
  value: unknown,
): value is typeof PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_GENERATED_AT {
  return value === PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_GENERATED_AT;
}

export function isValidTransactionConstructionContractMockSource(
  value: unknown,
): value is typeof PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_SOURCE {
  return value === PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_SOURCE;
}

export function isValidTransactionConstructionContractMockSchemaVersion(
  value: unknown,
): value is typeof PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_SCHEMA_VERSION {
  return value === PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_SCHEMA_VERSION;
}

export function normalizeTransactionConstructionContractMockFixture(
  fixture: TransactionConstructionContractMockFixture,
): TransactionConstructionContractMockFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as TransactionConstructionContractMockFixture;
}

export function serializeTransactionConstructionContractMockFixture(fixture: TransactionConstructionContractMockFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areTransactionConstructionContractMockFixturesEqual(
  a: TransactionConstructionContractMockFixture,
  b: TransactionConstructionContractMockFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
