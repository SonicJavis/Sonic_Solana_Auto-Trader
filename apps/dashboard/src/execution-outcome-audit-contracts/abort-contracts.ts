import type { OutcomeAbortContract } from './types.js';

export function buildOutcomeAbortContract(input: {
  abortContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): OutcomeAbortContract {
  return {
    abortContractId: input.abortContractId,
    abortModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
