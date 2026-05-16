import {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
  type ReevaluationScorecard,
} from './types.js';

export function buildReevaluationScorecard(input: {
  id: string;
  score: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
}): ReevaluationScorecard {
  return {
    scorecardId: input.id,
    phase: RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
    score: input.score,
    classification: input.classification,
    safetyConfirmed: true,
    deterministicOnly: true,
  };
}
