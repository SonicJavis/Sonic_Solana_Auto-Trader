import type {
  ManualConfirmApprovalStatus,
  ManualConfirmChecklistStatus,
  ManualConfirmGateStatus,
  ManualConfirmScorecard,
} from './types.js';

export function buildManualConfirmScorecard(input: {
  scorecardId: string;
  score: number;
  maxScore: number;
  gateStatus: ManualConfirmGateStatus;
  checklistStatus: ManualConfirmChecklistStatus;
  approvalStatus: ManualConfirmApprovalStatus;
}): ManualConfirmScorecard {
  return {
    scorecardId: input.scorecardId,
    score: input.score,
    maxScore: input.maxScore,
    gateStatus: input.gateStatus,
    checklistStatus: input.checklistStatus,
    approvalStatus: input.approvalStatus,
    failClosed: true,
  };
}
