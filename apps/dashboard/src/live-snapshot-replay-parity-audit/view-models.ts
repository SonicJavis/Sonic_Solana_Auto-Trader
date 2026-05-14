import type {
  LiveSnapshotReplayParityAuditName,
  LiveSnapshotReplayParityAuditViewModel,
  LiveSnapshotReplayParityGateStatus,
  LiveSnapshotReplayParityOutcome,
  LiveSnapshotReplayPromotionStatus,
} from './types.js';

export function buildLiveSnapshotReplayParityAuditViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: LiveSnapshotReplayParityAuditName;
  gateStatus: LiveSnapshotReplayParityGateStatus;
  parityStatus: LiveSnapshotReplayParityOutcome;
  promotionStatus: LiveSnapshotReplayPromotionStatus;
}): LiveSnapshotReplayParityAuditViewModel {
  return {
    ...input,
    summary: `${input.fixtureName} => gate:${input.gateStatus} / parity:${input.parityStatus} / promotion:${input.promotionStatus}`,
  };
}
