import type { ReplayImportSnapshotLinkage } from './types.js';

export function buildReplayImportSnapshotLinkage(
  input: Omit<ReplayImportSnapshotLinkage, 'snapshotLinkageId'> & { fixtureId: string },
): ReplayImportSnapshotLinkage {
  return {
    snapshotLinkageId: `${input.fixtureId}-snapshot-linkage`,
    snapshotFixtureRef: input.snapshotFixtureRef,
    snapshotStatus: input.snapshotStatus,
    failClosed: input.failClosed,
  };
}
