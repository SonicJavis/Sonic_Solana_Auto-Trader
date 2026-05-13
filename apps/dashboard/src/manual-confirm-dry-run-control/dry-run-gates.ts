import { MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE, type ManualConfirmDryRunGate, type ManualConfirmDryRunGateStatus } from './types.js';

export function buildManualConfirmDryRunGate(input: {
  dryRunGateId: string;
  dryRunGateName: string;
  dryRunGateKind: string;
  gateStatus: ManualConfirmDryRunGateStatus;
  blockingReasonCodes: readonly string[];
}): ManualConfirmDryRunGate {
  return {
    dryRunGateId: input.dryRunGateId,
    dryRunGateName: input.dryRunGateName,
    dryRunGateKind: input.dryRunGateKind,
    phase: MANUAL_CONFIRM_DRY_RUN_CONTROL_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    dryRunOnly: true,
    liveExecutionAllowed: false,
    blockingReasonCodes: input.blockingReasonCodes,
  };
}
