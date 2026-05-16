import type { ExecutionOutcomeAuditApiContract } from './types.js';

export function buildExecutionOutcomeAuditApiContract(input: {
  fixtureId: string;
  fixtureIds: readonly string[];
}): ExecutionOutcomeAuditApiContract {
  return {
    list: {
      contractId: `${input.fixtureId}-list-contract`,
      contractKind: 'list',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: { fixtureIds: [...input.fixtureIds], totalCount: input.fixtureIds.length },
    },
    get: {
      contractId: `${input.fixtureId}-get-contract`,
      contractKind: 'get',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: { fixtureId: input.fixtureId },
    },
  };
}
