import type { FeedbackEvidenceModelLinkage } from './types.js';

export function buildFeedbackEvidenceModelLinkage(input: {
  feedbackEvidenceModelLinkageId: string;
  sourceEvidenceModelRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): FeedbackEvidenceModelLinkage {
  return {
    feedbackEvidenceModelLinkageId: input.feedbackEvidenceModelLinkageId,
    sourceEvidenceModelRef: input.sourceEvidenceModelRef,
    linkageStatus: input.linkageStatus,
  };
}
