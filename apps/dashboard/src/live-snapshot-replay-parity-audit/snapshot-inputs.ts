import type { LiveSnapshotReplaySnapshotInput } from './types.js';

export function buildLiveSnapshotReplaySnapshotInput(input: {
  snapshotInputId: string;
  snapshotInputKind: string;
  sourceFixtureRef: string;
}): LiveSnapshotReplaySnapshotInput {
  return {
    snapshotInputId: input.snapshotInputId,
    snapshotInputKind: input.snapshotInputKind,
    sourceCaptureFixtureRef: input.sourceFixtureRef,
    sourceFixtureRef: input.sourceFixtureRef,
    stagedOnly: true,
    persisted: false,
    inputStatus: 'ready',
    readOnly: true,
    runtimeCaptureAllowed: false,
    networkAccessAllowed: false,
  };
}
