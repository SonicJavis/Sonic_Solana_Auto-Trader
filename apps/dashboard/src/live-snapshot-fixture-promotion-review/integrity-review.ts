import type { FixturePromotionIntegrityReview } from './types.js';

export function buildFixturePromotionIntegrityReview(input: {
  integrityReviewId: string;
  expectedChecksum: string;
  observedChecksum: string;
  reviewStatus: 'pass' | 'warning' | 'fail';
}): FixturePromotionIntegrityReview {
  return {
    integrityReviewId: input.integrityReviewId,
    checksumKind: 'fnv1a32',
    expectedChecksum: input.expectedChecksum,
    observedChecksum: input.observedChecksum,
    reviewStatus: input.reviewStatus,
  };
}
