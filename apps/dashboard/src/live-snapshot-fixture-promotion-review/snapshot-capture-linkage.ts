import type { FixturePromotionSnapshotCaptureLinkage } from './types.js';

export function buildFixturePromotionSnapshotCaptureLinkage(input: {
  snapshotCaptureLinkageId: string;
  sourceSnapshotCaptureFixtureRef: string;
  captureStatus: 'staged' | 'quarantined' | 'review_required';
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): FixturePromotionSnapshotCaptureLinkage {
  return {
    snapshotCaptureLinkageId: input.snapshotCaptureLinkageId,
    sourceSnapshotCaptureFixtureRef: input.sourceSnapshotCaptureFixtureRef,
    captureStatus: input.captureStatus,
    linkageStatus: input.linkageStatus,
  };
}
