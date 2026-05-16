import type { FeedbackScorecard } from './types.js';

export function buildFeedbackScorecard(input: {
  scorecardId: string;
  auditScore: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): FeedbackScorecard {
  return {
    scorecardId: input.scorecardId,
    auditScore: input.auditScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
