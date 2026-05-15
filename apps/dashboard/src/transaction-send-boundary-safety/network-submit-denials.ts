import type { NetworkSubmitDenial } from './types.js';

export function buildNetworkSubmitDenial(input: {
  networkSubmitDenialId: string;
  reasonCodes: readonly string[];
}): NetworkSubmitDenial {
  return {
    networkSubmitDenialId: input.networkSubmitDenialId,
    networkSubmitBlocked: true,
    rpcWriteBlocked: true,
    endpointSubmitBlocked: true,
    reasonCodes: [...input.reasonCodes],
  };
}
