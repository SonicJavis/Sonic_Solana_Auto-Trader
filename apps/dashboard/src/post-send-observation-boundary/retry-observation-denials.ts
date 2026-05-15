import type { RetryObservationDenial } from './types.js';

export function buildRetryObservationDenial(input: {
  retryObservationDenialId: string;
  reasonCodes: readonly string[];
}): RetryObservationDenial {
  return {
    retryObservationDenialId: input.retryObservationDenialId,
    retryRuntimeAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
