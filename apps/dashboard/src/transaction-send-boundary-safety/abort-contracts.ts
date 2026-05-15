import type { SendAbortContract } from './types.js';

export function buildSendAbortContract(input: { abortContractId: string; status: 'ready' | 'blocked' | 'review_required' }): SendAbortContract {
  return {
    abortContractId: input.abortContractId,
    abortModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
