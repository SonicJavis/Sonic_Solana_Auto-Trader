import type { LiveSnapshotNormalizationContract } from './types.js';

export function buildLiveSnapshotNormalizationContract(input: {
  normalizationId: string;
  schemaVersion: string;
}): LiveSnapshotNormalizationContract {
  return {
    normalizationId: input.normalizationId,
    schemaVersion: input.schemaVersion,
    deterministicSerialization: true,
    stableOrdering: true,
  };
}
