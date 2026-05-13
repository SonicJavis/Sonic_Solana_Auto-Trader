import type { LiveSnapshotResponseStaging, LiveSnapshotResponseStagingStatus } from './types.js';

export function buildLiveSnapshotResponseStaging(input: {
  stagingId: string;
  stagedResponseKind: string;
  stagingStatus: LiveSnapshotResponseStagingStatus;
}): LiveSnapshotResponseStaging {
  return {
    stagingId: input.stagingId,
    stagedResponseKind: input.stagedResponseKind,
    stagedOnly: true,
    persisted: false,
    filesystemWriteAllowed: false,
    stagingStatus: input.stagingStatus,
  };
}
