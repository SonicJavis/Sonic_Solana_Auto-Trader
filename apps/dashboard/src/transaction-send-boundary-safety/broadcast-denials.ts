import type { BroadcastDenial } from './types.js';

export function buildBroadcastDenial(input: { broadcastDenialId: string; reasonCodes: readonly string[] }): BroadcastDenial {
  return {
    broadcastDenialId: input.broadcastDenialId,
    broadcastBlocked: true,
    mempoolBroadcastAllowed: false,
    bundleSubmitAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
