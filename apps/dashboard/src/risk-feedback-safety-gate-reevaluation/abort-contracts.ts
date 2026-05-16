import type { ReevaluationAbortContract } from './types.js';

export function buildReevaluationAbortContract(input: {
  id: string;
  reasonCodes?: readonly string[];
}): ReevaluationAbortContract {
  return {
    abortContractId: input.id,
    reevaluationAbortRequired: true,
    scheduledTimersAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
