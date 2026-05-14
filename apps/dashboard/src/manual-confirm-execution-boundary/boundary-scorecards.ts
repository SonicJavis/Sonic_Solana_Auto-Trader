import type { ExecutionBoundaryScorecard } from './types.js';

export function buildExecutionBoundaryScorecard(input: {
  scorecardId: string;
  boundaryScore: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): ExecutionBoundaryScorecard {
  return {
    scorecardId: input.scorecardId,
    boundaryScore: input.boundaryScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
