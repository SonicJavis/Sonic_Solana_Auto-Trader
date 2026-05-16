import {
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
  type DossierScorecard,
} from './types.js';

export function buildDossierScorecard(input: {
  id: string;
  score: number;
  classification: 'ready' | 'warning' | 'blocked' | 'rejected';
}): DossierScorecard {
  return {
    scorecardId: input.id,
    phase: SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
    score: input.score,
    classification: input.classification,
    safetyConfirmed: true,
    deterministicOnly: true,
  };
}
