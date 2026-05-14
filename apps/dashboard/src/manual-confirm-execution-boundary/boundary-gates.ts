import {
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_PHASE,
  type ExecutionBoundaryGate,
  type ExecutionBoundaryGateStatus,
} from './types.js';

export function buildExecutionBoundaryGate(input: {
  boundaryGateId: string;
  boundaryGateName: string;
  gateStatus: ExecutionBoundaryGateStatus;
  blockingReasonCodes: readonly string[];
}): ExecutionBoundaryGate {
  return {
    boundaryGateId: input.boundaryGateId,
    boundaryGateName: input.boundaryGateName,
    phase: MANUAL_CONFIRM_EXECUTION_BOUNDARY_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    executionAllowed: false,
    transactionConstructionAllowed: false,
    transactionSerializationAllowed: false,
    transactionSimulationAllowed: false,
    signingAllowed: false,
    dispatchAllowed: false,
    sendAllowed: false,
    blockingReasonCodes: input.blockingReasonCodes,
  };
}
