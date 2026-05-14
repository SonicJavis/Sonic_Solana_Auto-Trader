import type { LiveSnapshotParityScorecard } from './types.js';

export function buildLiveSnapshotParityScorecard(input: {
  parityScorecardId: string;
  parityScore: number;
  classification: 'clean' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): LiveSnapshotParityScorecard {
  return {
    parityScorecardId: input.parityScorecardId,
    parityScore: input.parityScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
