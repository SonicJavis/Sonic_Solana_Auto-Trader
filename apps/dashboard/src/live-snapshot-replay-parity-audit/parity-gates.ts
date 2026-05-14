import {
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE,
  type LiveSnapshotReplayParityGate,
  type LiveSnapshotReplayParityGateStatus,
} from './types.js';

export function buildLiveSnapshotReplayParityGate(input: {
  parityGateId: string;
  parityGateName: string;
  gateStatus: LiveSnapshotReplayParityGateStatus;
  reasonCodes: readonly string[];
}): LiveSnapshotReplayParityGate {
  return {
    parityGateId: input.parityGateId,
    parityGateName: input.parityGateName,
    phase: LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    runtimeReplayAllowed: false,
    automaticPromotionAllowed: false,
    blockingReasonCodes: input.reasonCodes,
    reasonCodes: input.reasonCodes,
  };
}
