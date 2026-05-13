import {
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE,
  type LiveSnapshotCaptureGate,
  type LiveSnapshotCaptureGateStatus,
} from './types.js';

export function buildLiveSnapshotCaptureGate(input: {
  captureGateId: string;
  captureGateName: string;
  gateStatus: LiveSnapshotCaptureGateStatus;
  blockingReasonCodes: readonly string[];
}): LiveSnapshotCaptureGate {
  return {
    captureGateId: input.captureGateId,
    captureGateName: input.captureGateName,
    phase: READ_ONLY_LIVE_SNAPSHOT_CAPTURE_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    liveCaptureRuntimeAllowed: false,
    blockingReasonCodes: input.blockingReasonCodes,
  };
}
