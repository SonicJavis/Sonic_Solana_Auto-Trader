import type { OutcomeRiskFeedbackContractName } from '../outcome-risk-feedback-contracts/types.js';
import type { DossierFeedbackLinkage, DossierLinkStatus } from './types.js';

export function buildDossierFeedbackLinkage(input: {
  id: string;
  sourceFeedbackFixtureRefs: readonly OutcomeRiskFeedbackContractName[];
  linkageStatus: DossierLinkStatus;
}): DossierFeedbackLinkage {
  return {
    feedbackLinkageId: input.id,
    sourceFeedbackPhase: 87,
    sourceFeedbackFixtureRefs: input.sourceFeedbackFixtureRefs,
    linkageStatus: input.linkageStatus,
    liveFeedbackLookupAllowed: false,
  };
}
