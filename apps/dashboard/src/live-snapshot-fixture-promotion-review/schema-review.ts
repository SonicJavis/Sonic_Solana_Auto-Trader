import type { FixturePromotionSchemaReview } from './types.js';

export function buildFixturePromotionSchemaReview(input: {
  schemaReviewId: string;
  schemaVersion: string;
  reviewStatus: 'pass' | 'warning' | 'fail';
  warningCodes: readonly string[];
  manualReviewRequired: boolean;
}): FixturePromotionSchemaReview {
  return {
    schemaReviewId: input.schemaReviewId,
    schemaVersion: input.schemaVersion,
    reviewStatus: input.reviewStatus,
    warningCodes: [...input.warningCodes],
    manualReviewRequired: input.manualReviewRequired,
  };
}
