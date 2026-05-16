import type { NetworkObservationDenial } from './types.js';

export function buildNetworkObservationDenial(input: {
  networkObservationDenialId: string;
  reasonCodes: readonly string[];
}): NetworkObservationDenial {
  return {
    networkObservationDenialId: input.networkObservationDenialId,
    networkReadBlocked: true,
    subscriptionBlocked: true,
    pollingBlocked: true,
    reasonCodes: [...input.reasonCodes],
  };
}
