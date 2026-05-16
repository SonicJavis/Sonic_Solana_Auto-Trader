import type { ReevaluationRollbackContract } from './types.js';

export function buildReevaluationRollbackContract(input: {
  id: string;
  reasonCodes?: readonly string[];
}): ReevaluationRollbackContract {
  return {
    rollbackContractId: input.id,
    reevaluationRollbackRequired: true,
    scheduledTimersAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
