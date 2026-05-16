import type { RiskDeltaPlaceholder } from './types.js';

export function buildRiskDeltaPlaceholder(input: {
  riskDeltaPlaceholderId: string;
  reasonCodes: readonly string[];
}): RiskDeltaPlaceholder {
  return {
    riskDeltaPlaceholderId: input.riskDeltaPlaceholderId,
    deltaComputedFromLiveData: false,
    deterministicLabelOnly: true,
    liveDeltaOutputProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
