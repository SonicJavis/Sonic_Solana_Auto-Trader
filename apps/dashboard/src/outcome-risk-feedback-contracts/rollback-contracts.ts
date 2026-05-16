import type { FeedbackRollbackContract } from './types.js';

export function buildFeedbackRollbackContract(input: {
  rollbackContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): FeedbackRollbackContract {
  return {
    rollbackContractId: input.rollbackContractId,
    rollbackModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
