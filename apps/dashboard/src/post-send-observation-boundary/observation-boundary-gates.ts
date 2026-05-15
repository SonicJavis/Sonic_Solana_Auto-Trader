import { POST_SEND_OBSERVATION_BOUNDARY_PHASE, type ObservationBoundaryGate, type ObservationBoundaryGateStatus } from './types.js';

export function buildObservationBoundaryGate(input: {
  observationBoundaryGateId: string;
  observationBoundaryGateName: string;
  gateStatus: ObservationBoundaryGateStatus;
  blockingReasonCodes: readonly string[];
}): ObservationBoundaryGate {
  return {
    observationBoundaryGateId: input.observationBoundaryGateId,
    observationBoundaryGateName: input.observationBoundaryGateName,
    phase: POST_SEND_OBSERVATION_BOUNDARY_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    liveObservationAllowed: false,
    pollingAllowed: false,
    subscriptionAllowed: false,
    networkReadAllowed: false,
    blockingReasonCodes: [...input.blockingReasonCodes],
  };
}
