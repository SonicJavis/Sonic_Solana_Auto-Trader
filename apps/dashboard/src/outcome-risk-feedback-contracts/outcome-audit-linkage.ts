import type { FeedbackOutcomeAuditLinkage } from './types.js';

export function buildFeedbackOutcomeAuditLinkage(input: {
  feedbackOutcomeAuditLinkageId: string;
  sourceOutcomeAuditRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): FeedbackOutcomeAuditLinkage {
  return {
    feedbackOutcomeAuditLinkageId: input.feedbackOutcomeAuditLinkageId,
    sourceOutcomeAuditRef: input.sourceOutcomeAuditRef,
    linkageStatus: input.linkageStatus,
  };
}
