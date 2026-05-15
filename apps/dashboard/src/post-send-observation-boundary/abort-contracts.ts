import type { ObservationAbortContract } from './types.js';

export function buildObservationAbortContract(input: {
  abortContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): ObservationAbortContract {
  return {
    abortContractId: input.abortContractId,
    abortModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
