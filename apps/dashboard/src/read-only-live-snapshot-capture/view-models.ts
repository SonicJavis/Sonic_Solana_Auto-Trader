import type {
  LiveSnapshotCaptureGateStatus,
  LiveSnapshotCaptureRequestStatus,
  LiveSnapshotCaptureViewModel,
  LiveSnapshotPromotionStatus,
  ReadOnlyLiveSnapshotCaptureName,
} from './types.js';

export function buildLiveSnapshotViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: ReadOnlyLiveSnapshotCaptureName;
  gateStatus: LiveSnapshotCaptureGateStatus;
  requestStatus: LiveSnapshotCaptureRequestStatus;
  promotionStatus: LiveSnapshotPromotionStatus;
}): LiveSnapshotCaptureViewModel {
  return {
    ...input,
    summary: `${input.fixtureName} => gate:${input.gateStatus} / request:${input.requestStatus} / promotion:${input.promotionStatus}`,
  };
}
