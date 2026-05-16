import {
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT,
  type ReviewDossierHeader,
} from './types.js';

export function buildReviewDossierHeader(input: {
  id: string;
  dossierName: string;
  sourceReevaluationFixtureRef: string;
  sourceFeedbackFixtureRef: string;
}): ReviewDossierHeader {
  return {
    dossierHeaderId: input.id,
    dossierName: input.dossierName,
    sourceReevaluationFixtureRef: input.sourceReevaluationFixtureRef,
    sourceFeedbackFixtureRef: input.sourceFeedbackFixtureRef,
    deterministicGeneratedAt: PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT,
    manualReviewRequired: true,
    approvalAuthorizesUnlock: false,
  };
}
