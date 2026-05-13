import type { ManualConfirmConfirmationSnapshot, ManualConfirmDryRunSnapshotStatus } from './types.js';

export function buildManualConfirmConfirmationSnapshot(input: {
  snapshotId: string;
  sourceManualConfirmReadinessRef: string;
  phraseSnapshotRef: string;
  roleSeparationSnapshotRef: string;
  coolingOffSnapshotRef: string;
  snapshotStatus: ManualConfirmDryRunSnapshotStatus;
}): ManualConfirmConfirmationSnapshot {
  return {
    snapshotId: input.snapshotId,
    sourceManualConfirmReadinessRef: input.sourceManualConfirmReadinessRef,
    phraseSnapshotRef: input.phraseSnapshotRef,
    roleSeparationSnapshotRef: input.roleSeparationSnapshotRef,
    coolingOffSnapshotRef: input.coolingOffSnapshotRef,
    snapshotStatus: input.snapshotStatus,
  };
}
