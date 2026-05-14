import type { FixturePromotionQuarantineReview } from './types.js';

export function buildFixturePromotionQuarantineReview(input: {
  quarantineReviewId: string;
  quarantined: boolean;
  quarantineReasonCodes: readonly string[];
}): FixturePromotionQuarantineReview {
  return {
    quarantineReviewId: input.quarantineReviewId,
    quarantined: input.quarantined,
    quarantineReasonCodes: [...input.quarantineReasonCodes],
    releaseAllowed: false,
    manualReviewRequired: true,
  };
}
