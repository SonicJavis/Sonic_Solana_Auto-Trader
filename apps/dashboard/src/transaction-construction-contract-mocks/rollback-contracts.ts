import type { ExecutionRollbackContract } from './types.js';

export function buildExecutionRollbackContract(input: {
  rollbackContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): ExecutionRollbackContract {
  return {
    rollbackContractId: input.rollbackContractId,
    rollbackModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
