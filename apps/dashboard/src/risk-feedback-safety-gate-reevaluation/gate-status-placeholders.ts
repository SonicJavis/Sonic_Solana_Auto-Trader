import type { GateStatusPlaceholder } from './types.js';

export function buildGateStatusPlaceholder(input: {
  id: string;
  reasonCodes?: readonly string[];
}): GateStatusPlaceholder {
  return {
    gateStatusPlaceholderId: input.id,
    deterministicLabelOnly: true,
    liveGateStatusFetched: false,
    gateStatusMutationProduced: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
