import type { FixturePromotionParityReviewLinkage } from './types.js';

export function buildFixturePromotionParityReviewLinkage(input: {
  parityReviewLinkageId: string;
  sourceParityAuditFixtureRef: string;
  parityStatus: 'clean' | 'warning' | 'mismatch';
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): FixturePromotionParityReviewLinkage {
  return {
    parityReviewLinkageId: input.parityReviewLinkageId,
    sourceParityAuditFixtureRef: input.sourceParityAuditFixtureRef,
    parityStatus: input.parityStatus,
    linkageStatus: input.linkageStatus,
  };
}
