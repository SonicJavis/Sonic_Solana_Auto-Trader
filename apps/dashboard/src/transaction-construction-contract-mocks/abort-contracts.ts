import type { ExecutionAbortContract } from './types.js';

export function buildExecutionAbortContract(input: {
  abortContractId: string;
  status: 'ready' | 'blocked' | 'review_required';
}): ExecutionAbortContract {
  return {
    abortContractId: input.abortContractId,
    abortModeled: true,
    runtimeSideEffectsAllowed: false,
    scheduledTimersAllowed: false,
    status: input.status,
  };
}
