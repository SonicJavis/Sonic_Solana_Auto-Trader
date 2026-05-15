import type { ObservationRollbackContract } from './types.js';

export function buildObservationRollbackContract(input: {
  rollbackContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): ObservationRollbackContract {
  return {
    rollbackContractId: input.rollbackContractId,
    rollbackModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
