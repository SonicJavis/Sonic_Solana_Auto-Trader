import type { FinalityObservationPlaceholder } from './types.js';

export function buildFinalityObservationPlaceholder(input: {
  finalityObservationPlaceholderId: string;
  reasonCodes: readonly string[];
}): FinalityObservationPlaceholder {
  return {
    finalityObservationPlaceholderId: input.finalityObservationPlaceholderId,
    liveFinalityFetchAllowed: false,
    deterministicLabelOnly: true,
    reasonCodes: [...input.reasonCodes],
  };
}
