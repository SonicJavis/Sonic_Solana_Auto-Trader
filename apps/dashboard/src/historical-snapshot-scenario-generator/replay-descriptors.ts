import type { SnapshotReplayDescriptor } from './types.js';

export function buildSnapshotReplayDescriptor(input: {
  fixtureId: string;
  replayKind: SnapshotReplayDescriptor['replayKind'];
  expectedStepCount: number;
  expectedSnapshotCount: number;
  expectedFinalStateKind: string;
}): SnapshotReplayDescriptor {
  return {
    replayDescriptorId: `${input.fixtureId}-replay-descriptor`,
    replayKind: input.replayKind,
    expectedStepCount: input.expectedStepCount,
    expectedSnapshotCount: input.expectedSnapshotCount,
    expectedFinalStateKind: input.expectedFinalStateKind,
    replayImportMode: 'deterministic_fixture_only',
    liveReplayImport: false,
  };
}
