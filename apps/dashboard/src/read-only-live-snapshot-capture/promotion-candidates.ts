import type { LiveSnapshotPromotionCandidate, LiveSnapshotPromotionStatus } from './types.js';

export function buildLiveSnapshotPromotionCandidate(input: {
  candidateId: string;
  promotionStatus: LiveSnapshotPromotionStatus;
}): LiveSnapshotPromotionCandidate {
  return {
    candidateId: input.candidateId,
    fixtureCandidateOnly: true,
    automaticPromotionAllowed: false,
    manualReviewRequired: true,
    promotionStatus: input.promotionStatus,
  };
}
