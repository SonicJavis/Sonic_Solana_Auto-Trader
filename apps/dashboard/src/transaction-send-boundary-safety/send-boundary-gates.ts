import { TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE, type SendBoundaryGate, type SendBoundaryGateStatus } from './types.js';

export function buildSendBoundaryGate(input: {
  sendBoundaryGateId: string;
  sendBoundaryGateName: string;
  gateStatus: SendBoundaryGateStatus;
  blockingReasonCodes: readonly string[];
}): SendBoundaryGate {
  return {
    sendBoundaryGateId: input.sendBoundaryGateId,
    sendBoundaryGateName: input.sendBoundaryGateName,
    phase: TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    sendingAllowed: false,
    networkSubmitAllowed: false,
    broadcastAllowed: false,
    dispatchAllowed: false,
    blockingReasonCodes: [...input.blockingReasonCodes],
  };
}
