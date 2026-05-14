import type { FixturePromotionScorecard } from './types.js';

export function buildFixturePromotionScorecard(input: {
  scorecardId: string;
  promotionScore: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): FixturePromotionScorecard {
  return {
    scorecardId: input.scorecardId,
    promotionScore: input.promotionScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
