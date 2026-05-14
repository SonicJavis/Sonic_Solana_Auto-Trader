import type {
  FixturePromotionDecisionKind,
  FixturePromotionDecisionStatus,
  FixturePromotionReviewerDecision,
} from './types.js';

export function buildFixturePromotionReviewerDecision(input: {
  decisionId: string;
  decisionKind: FixturePromotionDecisionKind;
  reviewerSlot: string;
  decisionStatus: FixturePromotionDecisionStatus;
  evidenceRefs: readonly string[];
}): FixturePromotionReviewerDecision {
  return {
    decisionId: input.decisionId,
    decisionKind: input.decisionKind,
    reviewerSlot: input.reviewerSlot,
    decisionStatus: input.decisionStatus,
    approvalDoesNotPromote: true,
    evidenceRefs: [...input.evidenceRefs],
  };
}
