import type { FeedbackSafetyInvariants } from './types.js';

export function buildFeedbackSafetyInvariants(input: {
  safetyInvariantId: string;
}): FeedbackSafetyInvariants {
  return {
    safetyInvariantId: input.safetyInvariantId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    noLiveFeedback: true,
    noLiveRiskUpdate: true,
  };
}
