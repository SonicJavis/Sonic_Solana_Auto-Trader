import {
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE,
  type FixturePromotionReviewGate,
  type FixturePromotionReviewGateStatus,
} from './types.js';

export function buildFixturePromotionReviewGate(input: {
  reviewGateId: string;
  reviewGateName: string;
  gateStatus: FixturePromotionReviewGateStatus;
  blockingReasonCodes: readonly string[];
}): FixturePromotionReviewGate {
  return {
    reviewGateId: input.reviewGateId,
    reviewGateName: input.reviewGateName,
    phase: LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    filesystemWriteAllowed: false,
    automaticPromotionAllowed: false,
    blockingReasonCodes: input.blockingReasonCodes,
  };
}
