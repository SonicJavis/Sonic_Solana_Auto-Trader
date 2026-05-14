import type { LiveSnapshotParityComparison, LiveSnapshotReplayParityOutcome } from './types.js';

export function buildLiveSnapshotParityComparison(input: {
  parityComparisonId: string;
  parityStatus: LiveSnapshotReplayParityOutcome;
  mismatchCount: number;
  comparedFields: readonly string[];
}): LiveSnapshotParityComparison {
  const mismatchIds = input.comparedFields.slice(0, input.mismatchCount).map((field, index) => `${field}:${index + 1}`);
  return {
    comparisonId: input.parityComparisonId,
    comparisonKind: 'snapshot_replay_parity',
    matched: input.mismatchCount === 0,
    mismatchIds,
    comparisonStatus:
      input.parityStatus === 'clean'
        ? 'clean'
        : input.parityStatus === 'warning'
          ? 'warning'
          : input.parityStatus === 'missing'
            ? 'blocked'
            : 'rejected',
    parityComparisonId: input.parityComparisonId,
    parityStatus: input.parityStatus,
    mismatchCount: input.mismatchCount,
    comparedFields: input.comparedFields,
  };
}
