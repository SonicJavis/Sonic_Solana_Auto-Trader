import {
  OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE,
  type FeedbackLoopGate,
  type FeedbackLoopGateStatus,
} from './types.js';

export function buildFeedbackLoopGate(input: {
  feedbackLoopGateId: string;
  feedbackLoopGateName: string;
  gateStatus: FeedbackLoopGateStatus;
  blockingReasonCodes: readonly string[];
}): FeedbackLoopGate {
  return {
    feedbackLoopGateId: input.feedbackLoopGateId,
    feedbackLoopGateName: input.feedbackLoopGateName,
    phase: OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    liveRiskUpdateAllowed: false,
    automaticRiskMutationAllowed: false,
    safetyGateMutationAllowed: false,
    blockingReasonCodes: [...input.blockingReasonCodes],
  };
}
