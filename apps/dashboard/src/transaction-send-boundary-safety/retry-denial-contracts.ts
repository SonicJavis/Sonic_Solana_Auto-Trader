import type { RetryDenialContract } from './types.js';

export function buildRetryDenialContract(input: { retryDenialId: string; reasonCodes: readonly string[] }): RetryDenialContract {
  return {
    retryDenialId: input.retryDenialId,
    retryRuntimeAllowed: false,
    scheduledTimersAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
