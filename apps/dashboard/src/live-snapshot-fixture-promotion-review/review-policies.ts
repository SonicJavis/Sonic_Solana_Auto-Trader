import type { FixturePromotionPolicyStatus, FixturePromotionReviewPolicy } from './types.js';

export function buildFixturePromotionReviewPolicy(input: {
  policyId: string;
  multipleReviewersRequired: number;
  policyStatus: FixturePromotionPolicyStatus;
}): FixturePromotionReviewPolicy {
  return {
    policyId: input.policyId,
    manualReviewRequired: true,
    automaticApprovalAllowed: false,
    automaticPromotionAllowed: false,
    multipleReviewersRequired: input.multipleReviewersRequired,
    policyStatus: input.policyStatus,
  };
}
