import { buildTransactionSendBoundarySafetyFixture } from './builders.js';
import {
  TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS,
  TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES,
  type TransactionSendBoundarySafetyContractKind,
  type TransactionSendBoundarySafetyContractName,
  type TransactionSendBoundarySafetyFixture,
} from './types.js';
import { validateTransactionSendBoundarySafetyFixtureTable } from './validation.js';

export const TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES = TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES.map(fixtureName =>
  buildTransactionSendBoundarySafetyFixture({ fixtureName }),
) satisfies readonly TransactionSendBoundarySafetyFixture[];

export const TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURE_MAP: ReadonlyMap<string, TransactionSendBoundarySafetyFixture> = new Map(
  TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES.length < 8) {
  throw new Error(
    `Phase 84 fixture count mismatch: expected >= 8, received ${TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES.length}`,
  );
}
if (TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES.length !== TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS.length) {
  throw new Error('Phase 84 name/kind cardinality mismatch');
}

const tableValidation = validateTransactionSendBoundarySafetyFixtureTable(TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 84 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listTransactionSendBoundarySafetyFixtures(): readonly TransactionSendBoundarySafetyFixture[] {
  return TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES;
}

export function getTransactionSendBoundarySafetyFixture(fixtureId: string): TransactionSendBoundarySafetyFixture | null {
  return TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES, TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS };
export type { TransactionSendBoundarySafetyContractName, TransactionSendBoundarySafetyContractKind };
