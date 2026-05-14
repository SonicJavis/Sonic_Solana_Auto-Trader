import type { FixturePromotionProvenanceReview } from './types.js';

export function buildFixturePromotionProvenanceReview(input: {
  provenanceReviewId: string;
  reviewStatus: 'pass' | 'warning' | 'fail';
  sourcePhaseRefs: readonly string[];
  sourceFixtureRefs: readonly string[];
}): FixturePromotionProvenanceReview {
  return {
    provenanceReviewId: input.provenanceReviewId,
    reviewStatus: input.reviewStatus,
    sourcePhaseRefs: [...input.sourcePhaseRefs],
    sourceFixtureRefs: [...input.sourceFixtureRefs],
  };
}
