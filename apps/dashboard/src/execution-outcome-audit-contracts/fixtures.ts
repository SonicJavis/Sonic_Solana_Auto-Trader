import { buildExecutionOutcomeAuditFixture } from './builders.js';
import {
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS,
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES,
  type ExecutionOutcomeAuditContractKind,
  type ExecutionOutcomeAuditContractName,
  type ExecutionOutcomeAuditFixture,
} from './types.js';
import { validateExecutionOutcomeAuditFixtureTable } from './validation.js';

export const EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES = EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES.map(
  fixtureName => buildExecutionOutcomeAuditFixture({ fixtureName }),
) satisfies readonly ExecutionOutcomeAuditFixture[];

export const EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURE_MAP: ReadonlyMap<
  string,
  ExecutionOutcomeAuditFixture
> = new Map(
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES.length < 8) {
  throw new Error(
    `Phase 86 fixture count mismatch: expected >= 8, received ${EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES.length}`,
  );
}
if (EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES.length !== EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS.length) {
  throw new Error('Phase 86 name/kind cardinality mismatch');
}

const tableValidation = validateExecutionOutcomeAuditFixtureTable(
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(
    `Phase 86 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`,
  );
}

export function listExecutionOutcomeAuditFixtures(): readonly ExecutionOutcomeAuditFixture[] {
  return EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES;
}

export function getExecutionOutcomeAuditFixture(fixtureId: string): ExecutionOutcomeAuditFixture | null {
  return EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES,
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS,
};
export type { ExecutionOutcomeAuditContractName, ExecutionOutcomeAuditContractKind };
