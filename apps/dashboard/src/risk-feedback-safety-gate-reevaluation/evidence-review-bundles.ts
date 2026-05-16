import type { EvidenceReviewBundle } from './types.js';

export function buildEvidenceReviewBundle(input: {
  id: string;
  sourcePhaseRefs?: readonly string[];
  sourceFixtureRefs?: readonly string[];
  feedbackRefs?: readonly string[];
  riskRefs?: readonly string[];
  outcomeRefs?: readonly string[];
  certificationRefs?: readonly string[];
  validationCommandRefs?: readonly string[];
  safetyGrepRefs?: readonly string[];
  docsRefs?: readonly string[];
  evidenceComplete?: boolean;
}): EvidenceReviewBundle {
  return {
    evidenceReviewBundleId: input.id,
    sourcePhaseRefs: input.sourcePhaseRefs ?? [],
    sourceFixtureRefs: input.sourceFixtureRefs ?? [],
    feedbackRefs: input.feedbackRefs ?? [],
    riskRefs: input.riskRefs ?? [],
    outcomeRefs: input.outcomeRefs ?? [],
    certificationRefs: input.certificationRefs ?? [],
    validationCommandRefs: input.validationCommandRefs ?? [],
    safetyGrepRefs: input.safetyGrepRefs ?? [],
    docsRefs: input.docsRefs ?? [],
    evidenceComplete: input.evidenceComplete ?? false,
  };
}
