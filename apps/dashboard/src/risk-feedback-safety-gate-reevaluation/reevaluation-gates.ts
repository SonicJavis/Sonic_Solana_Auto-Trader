import {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
  type ReevaluationGate,
  type ReevaluationGateStatus,
} from './types.js';

export function buildReevaluationGate(input: {
  id: string;
  name: string;
  gateStatus: ReevaluationGateStatus;
  blockingReasonCodes?: readonly string[];
}): ReevaluationGate {
  return {
    reevaluationGateId: input.id,
    reevaluationGateName: input.name,
    phase: RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    automaticGateMutationAllowed: false,
    automaticUnlockAllowed: false,
    liveRiskUpdateAllowed: false,
    blockingReasonCodes: input.blockingReasonCodes ?? [],
  };
}
