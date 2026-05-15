import type { SendScorecard } from './types.js';

export function buildSendScorecard(input: {
  scorecardId: string;
  boundaryScore: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): SendScorecard {
  return {
    scorecardId: input.scorecardId,
    boundaryScore: input.boundaryScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
