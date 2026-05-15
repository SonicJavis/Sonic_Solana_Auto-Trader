import type { ObservationScorecard } from './types.js';

export function buildObservationScorecard(input: {
  scorecardId: string;
  boundaryScore: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): ObservationScorecard {
  return {
    scorecardId: input.scorecardId,
    boundaryScore: input.boundaryScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
