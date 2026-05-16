import type { FinalityOutcomePlaceholder } from './types.js';

export function buildFinalityOutcomePlaceholder(input: {
  finalityOutcomePlaceholderId: string;
  reasonCodes: readonly string[];
}): FinalityOutcomePlaceholder {
  return {
    finalityOutcomePlaceholderId: input.finalityOutcomePlaceholderId,
    deterministicLabelOnly: true,
    liveFinalityFetched: false,
    reasonCodes: [...input.reasonCodes],
  };
}
