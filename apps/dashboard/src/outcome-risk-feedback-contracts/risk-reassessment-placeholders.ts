import type { RiskReassessmentPlaceholder } from './types.js';

export function buildRiskReassessmentPlaceholder(input: {
  riskReassessmentPlaceholderId: string;
  reasonCodes: readonly string[];
}): RiskReassessmentPlaceholder {
  return {
    riskReassessmentPlaceholderId: input.riskReassessmentPlaceholderId,
    deterministicLabelOnly: true,
    liveReassessmentAllowed: false,
    reassessmentOutputProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
