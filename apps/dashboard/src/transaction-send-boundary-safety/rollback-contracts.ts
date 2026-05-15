import type { SendRollbackContract } from './types.js';

export function buildSendRollbackContract(input: {
  rollbackContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): SendRollbackContract {
  return {
    rollbackContractId: input.rollbackContractId,
    rollbackModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
