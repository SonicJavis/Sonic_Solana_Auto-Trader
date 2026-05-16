import type { OutcomeScorecard } from './types.js';

export function buildOutcomeScorecard(input: {
  scorecardId: string;
  auditScore: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
  reviewRequired: boolean;
}): OutcomeScorecard {
  return {
    scorecardId: input.scorecardId,
    auditScore: input.auditScore,
    classification: input.classification,
    reviewRequired: input.reviewRequired,
  };
}
