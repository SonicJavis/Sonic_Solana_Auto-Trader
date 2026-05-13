import {
  MANUAL_CONFIRM_LIVE_READINESS_PHASE,
  type ManualConfirmGateKind,
  type ManualConfirmGateStatus,
  type ManualConfirmReadinessGate,
} from './types.js';

export function buildManualConfirmReadinessGate(input: {
  readinessGateId: string;
  readinessGateName: string;
  readinessGateKind: ManualConfirmGateKind;
  gateStatus: ManualConfirmGateStatus;
  blockingReasonCodes: readonly string[];
}): ManualConfirmReadinessGate {
  return {
    readinessGateId: input.readinessGateId,
    readinessGateName: input.readinessGateName,
    readinessGateKind: input.readinessGateKind,
    phase: MANUAL_CONFIRM_LIVE_READINESS_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    manualLiveAllowed: false,
    executionAllowed: false,
    blockingReasonCodes: input.blockingReasonCodes,
  };
}
