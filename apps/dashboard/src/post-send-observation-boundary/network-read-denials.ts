import type { NetworkReadDenial } from './types.js';

export function buildNetworkReadDenial(input: {
  networkReadDenialId: string;
  reasonCodes: readonly string[];
}): NetworkReadDenial {
  return {
    networkReadDenialId: input.networkReadDenialId,
    networkReadRuntimeAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
