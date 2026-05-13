import type { SnapshotReplayLinkage } from './types.js';

export function buildSnapshotReplayLinkage(input: {
  fixtureId: string;
  replayScenarioRef: SnapshotReplayLinkage['replayScenarioRef'];
  parityStatus: SnapshotReplayLinkage['parityStatus'];
  failClosed: boolean;
  sourceRefs: readonly string[];
}): SnapshotReplayLinkage {
  return {
    replayLinkageId: `${input.fixtureId}-replay-linkage`,
    replayScenarioRef: input.replayScenarioRef,
    parityStatus: input.parityStatus,
    failClosed: input.failClosed,
    sourceRefs: [...input.sourceRefs],
  };
}
