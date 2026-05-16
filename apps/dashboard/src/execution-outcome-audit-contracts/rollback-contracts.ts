import type { OutcomeRollbackContract } from './types.js';

export function buildOutcomeRollbackContract(input: {
  rollbackContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): OutcomeRollbackContract {
  return {
    rollbackContractId: input.rollbackContractId,
    rollbackModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
