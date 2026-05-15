import type { PreflightDenialPlaceholder } from './types.js';

export function buildPreflightDenialPlaceholder(input: {
  preflightDenialId: string;
  reasonCodes: readonly string[];
}): PreflightDenialPlaceholder {
  return {
    preflightDenialId: input.preflightDenialId,
    livePreflightAllowed: false,
    simulationAgainstLiveRpcAllowed: false,
    preflightResultProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
