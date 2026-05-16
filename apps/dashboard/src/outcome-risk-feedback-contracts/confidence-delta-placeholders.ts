import type { ConfidenceDeltaPlaceholder } from './types.js';

export function buildConfidenceDeltaPlaceholder(input: {
  confidenceDeltaPlaceholderId: string;
  reasonCodes: readonly string[];
}): ConfidenceDeltaPlaceholder {
  return {
    confidenceDeltaPlaceholderId: input.confidenceDeltaPlaceholderId,
    deltaComputedFromLiveData: false,
    deterministicLabelOnly: true,
    liveDeltaOutputProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
