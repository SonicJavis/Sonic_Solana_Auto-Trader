import type { FeedbackAbortContract } from './types.js';

export function buildFeedbackAbortContract(input: {
  abortContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): FeedbackAbortContract {
  return {
    abortContractId: input.abortContractId,
    abortModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
