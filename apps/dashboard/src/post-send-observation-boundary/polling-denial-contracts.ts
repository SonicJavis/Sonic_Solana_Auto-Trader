import type { PollingDenialContract } from './types.js';

export function buildPollingDenialContract(input: {
  pollingDenialId: string;
  reasonCodes: readonly string[];
}): PollingDenialContract {
  return {
    pollingDenialId: input.pollingDenialId,
    pollingRuntimeAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
