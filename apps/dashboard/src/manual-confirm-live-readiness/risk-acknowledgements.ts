import type { ManualConfirmRiskAcknowledgement } from './types.js';

export function buildManualConfirmRiskAcknowledgement(input: {
  acknowledgementId: string;
  riskAcknowledged: boolean;
  sourceEvidenceRefs: readonly string[];
  acknowledgementStatus: 'acknowledged' | 'pending' | 'rejected';
}): ManualConfirmRiskAcknowledgement {
  return {
    acknowledgementId: input.acknowledgementId,
    riskAcknowledged: input.riskAcknowledged,
    advisoryOutput: false,
    recommendationOutput: false,
    signalOutput: false,
    sourceEvidenceRefs: input.sourceEvidenceRefs,
    acknowledgementStatus: input.acknowledgementStatus,
  };
}
