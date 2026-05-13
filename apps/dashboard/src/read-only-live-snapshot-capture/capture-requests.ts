import type { LiveSnapshotCaptureRequest, LiveSnapshotCaptureRequestStatus } from './types.js';

export function buildLiveSnapshotCaptureRequest(input: {
  requestId: string;
  requestKind: string;
  targetProviderId: string;
  requestStatus: LiveSnapshotCaptureRequestStatus;
}): LiveSnapshotCaptureRequest {
  return {
    requestId: input.requestId,
    requestKind: input.requestKind,
    readOnly: true,
    writeMethodAllowed: false,
    dispatchAllowed: false,
    targetProviderId: input.targetProviderId,
    requestStatus: input.requestStatus,
  };
}
