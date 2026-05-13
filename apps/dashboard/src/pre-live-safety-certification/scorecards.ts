import type {
  PreLiveCertificationScorecard,
  PreLiveCertificationStatus,
  PreLiveChecklistStatus,
  PreLiveGateStatus,
} from './types.js';

export function buildPreLiveCertificationScorecard(input: {
  scorecardId: string;
  score: number;
  maxScore: number;
  gateStatus: PreLiveGateStatus;
  checklistStatus: PreLiveChecklistStatus;
  certificationStatus: PreLiveCertificationStatus;
}): PreLiveCertificationScorecard {
  return {
    scorecardId: input.scorecardId,
    score: input.score,
    maxScore: input.maxScore,
    gateStatus: input.gateStatus,
    checklistStatus: input.checklistStatus,
    certificationStatus: input.certificationStatus,
    failClosed: true,
  };
}
