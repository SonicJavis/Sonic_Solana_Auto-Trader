import type { LiveSnapshotPromotionGate, LiveSnapshotReplayPromotionStatus } from './types.js';

export function buildLiveSnapshotPromotionGate(input: {
  promotionGateId: string;
  promotionStatus: LiveSnapshotReplayPromotionStatus;
}): LiveSnapshotPromotionGate {
  return {
    promotionGateId: input.promotionGateId,
    promotionAllowed: false,
    promotionStatus: input.promotionStatus,
    fixtureOnly: true,
    automaticPromotionAllowed: false,
    manualReviewRequired: true,
  };
}
