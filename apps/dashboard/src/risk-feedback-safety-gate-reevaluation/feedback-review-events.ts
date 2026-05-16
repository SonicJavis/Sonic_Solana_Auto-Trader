import type { FeedbackReviewEvent } from './types.js';

export function buildFeedbackReviewEvent(input: {
  id: string;
  sourceFeedbackFixtureRef: string;
  reasonCodes?: readonly string[];
}): FeedbackReviewEvent {
  return {
    feedbackReviewEventId: input.id,
    placeholderOnly: true,
    sourceFeedbackFixtureRef: input.sourceFeedbackFixtureRef,
    liveFeedbackLookupAllowed: false,
    manualReviewRequired: true,
    reasonCodes: input.reasonCodes ?? [],
  };
}
