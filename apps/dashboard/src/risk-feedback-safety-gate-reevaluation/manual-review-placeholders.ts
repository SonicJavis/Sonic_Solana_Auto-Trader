import type { ManualReviewPlaceholder, ReevaluationReviewStatus } from './types.js';

export function buildManualReviewPlaceholder(input: {
  id: string;
  reviewStatus?: ReevaluationReviewStatus;
}): ManualReviewPlaceholder {
  return {
    manualReviewPlaceholderId: input.id,
    manualReviewRequired: true,
    reviewAuthorizesUnlock: false,
    separateFuturePhaseRequired: true,
    reviewStatus: input.reviewStatus ?? 'pending',
  };
}
