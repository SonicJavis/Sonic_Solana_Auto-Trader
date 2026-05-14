import type { SigningAbortContract } from './types.js';

export function buildSigningAbortContract(input: {
  abortContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): SigningAbortContract {
  return {
    abortContractId: input.abortContractId,
    abortModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
