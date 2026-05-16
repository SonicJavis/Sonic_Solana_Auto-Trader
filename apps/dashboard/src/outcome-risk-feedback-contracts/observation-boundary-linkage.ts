import type { FeedbackObservationBoundaryLinkage } from './types.js';

export function buildFeedbackObservationBoundaryLinkage(input: {
  feedbackObservationBoundaryLinkageId: string;
  sourceObservationBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): FeedbackObservationBoundaryLinkage {
  return {
    feedbackObservationBoundaryLinkageId: input.feedbackObservationBoundaryLinkageId,
    sourceObservationBoundaryRef: input.sourceObservationBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
