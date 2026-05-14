import type { ExecutionPromotionReviewLinkage } from './types.js';

export function buildExecutionPromotionReviewLinkage(input: {
  promotionReviewLinkageId: string;
  sourcePromotionReviewRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ExecutionPromotionReviewLinkage {
  return {
    promotionReviewLinkageId: input.promotionReviewLinkageId,
    sourcePromotionReviewRef: input.sourcePromotionReviewRef,
    linkageStatus: input.linkageStatus,
  };
}
