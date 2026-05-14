import type { SigningScorecard } from './types.js';

export function buildSigningScorecard(input: {
  scorecardId: string;
  boundaryScore: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): SigningScorecard {
  return {
    scorecardId: input.scorecardId,
    boundaryScore: input.boundaryScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
