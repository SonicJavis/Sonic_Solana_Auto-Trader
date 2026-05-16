import type { EvidenceFeedbackBundle } from './types.js';

export function buildEvidenceFeedbackBundle(input: {
  evidenceBundleId: string;
  sourcePhaseRefs: readonly string[];
  sourceFixtureRefs: readonly string[];
  outcomeAuditRefs: readonly string[];
  riskEvidenceRefs: readonly string[];
  validationCommandRefs: readonly string[];
  safetyGrepRefs: readonly string[];
  docsRefs: readonly string[];
  evidenceComplete: boolean;
}): EvidenceFeedbackBundle {
  return {
    evidenceBundleId: input.evidenceBundleId,
    sourcePhaseRefs: [...input.sourcePhaseRefs],
    sourceFixtureRefs: [...input.sourceFixtureRefs],
    outcomeAuditRefs: [...input.outcomeAuditRefs],
    riskEvidenceRefs: [...input.riskEvidenceRefs],
    validationCommandRefs: [...input.validationCommandRefs],
    safetyGrepRefs: [...input.safetyGrepRefs],
    docsRefs: [...input.docsRefs],
    evidenceComplete: input.evidenceComplete,
  };
}
