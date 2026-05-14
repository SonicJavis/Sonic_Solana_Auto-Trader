import { buildTransactionConstructionContractMockFixture } from './builders.js';
import {
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_KINDS,
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES,
  type TransactionConstructionContractMockFixture,
  type TransactionConstructionContractMockKind,
  type TransactionConstructionContractMockName,
} from './types.js';
import { validateTransactionConstructionContractMockFixtureTable } from './validation.js';

export const TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES = TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES.map(fixtureName =>
  buildTransactionConstructionContractMockFixture({ fixtureName }),
) satisfies readonly TransactionConstructionContractMockFixture[];

export const TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURE_MAP: ReadonlyMap<string, TransactionConstructionContractMockFixture> =
  new Map(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES.length < 8) {
  throw new Error(
    `Phase 82 fixture count mismatch: expected >= 8, received ${TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES.length}`,
  );
}
if (TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES.length !== TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_KINDS.length) {
  throw new Error('Phase 82 name/kind cardinality mismatch');
}

const tableValidation = validateTransactionConstructionContractMockFixtureTable(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 82 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listTransactionConstructionContractMockFixtures(): readonly TransactionConstructionContractMockFixture[] {
  return TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES;
}

export function getTransactionConstructionContractMockFixture(fixtureId: string): TransactionConstructionContractMockFixture | null {
  return TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES, TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_KINDS };
export type { TransactionConstructionContractMockName, TransactionConstructionContractMockKind };
