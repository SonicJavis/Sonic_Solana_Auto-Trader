import type { FeedbackReplayLinkage } from './types.js';

export function buildFeedbackReplayLinkage(input: {
  feedbackReplayLinkageId: string;
  sourceReplayFixtureRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): FeedbackReplayLinkage {
  return {
    feedbackReplayLinkageId: input.feedbackReplayLinkageId,
    sourceReplayFixtureRef: input.sourceReplayFixtureRef,
    linkageStatus: input.linkageStatus,
  };
}
