import type { LiveSnapshotReplayExpectationLinkage } from './types.js';

export function buildLiveSnapshotReplayExpectationLinkage(input: {
  replayExpectationLinkageId: string;
  replayExpectationRef: string;
  expectationPresent: boolean;
  linkageStatus: 'aligned' | 'missing' | 'warning' | 'blocked';
}): LiveSnapshotReplayExpectationLinkage {
  return {
    expectationId: input.replayExpectationLinkageId,
    sourceReplayFixtureRef: input.replayExpectationRef,
    expectedStateKind: 'replay_state',
    expectedChecksum: input.expectationPresent ? 'fnv1a32:expected' : 'fnv1a32:missing',
    expectationStatus:
      input.linkageStatus === 'missing'
        ? 'missing'
        : input.linkageStatus === 'blocked'
          ? 'blocked'
          : input.linkageStatus === 'warning'
            ? 'review_required'
            : 'ready',
    replayExpectationLinkageId: input.replayExpectationLinkageId,
    replayExpectationRef: input.replayExpectationRef,
    expectationPresent: input.expectationPresent,
    linkageStatus: input.linkageStatus,
    failClosed: true,
  };
}
