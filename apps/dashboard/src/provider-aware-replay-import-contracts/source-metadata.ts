import type { ReplayImportSourceMetadata } from './types.js';

export function buildReplayImportSourceMetadata(input: ReplayImportSourceMetadata): ReplayImportSourceMetadata {
  return {
    ...input,
    sourcePhaseRefs: [...input.sourcePhaseRefs],
    sourceFixtureRefs: [...input.sourceFixtureRefs],
    sourceProviderIds: [...input.sourceProviderIds],
    sourceScenarioRefs: [...input.sourceScenarioRefs],
    sourceSnapshotRefs: [...input.sourceSnapshotRefs],
    sourceReliabilityRefs: [...input.sourceReliabilityRefs],
  };
}

export const buildSnapshotSourceMetadata = buildReplayImportSourceMetadata;
