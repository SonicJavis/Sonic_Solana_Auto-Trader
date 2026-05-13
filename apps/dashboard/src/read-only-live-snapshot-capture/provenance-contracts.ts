import type { LiveSnapshotProvenanceContract } from './types.js';

export function buildLiveSnapshotProvenanceContract(input: {
  provenanceId: string;
  sourcePhaseRefs: readonly string[];
  sourceFixtureRefs: readonly string[];
  docsRefs: readonly string[];
}): LiveSnapshotProvenanceContract {
  return {
    provenanceId: input.provenanceId,
    sourcePhaseRefs: input.sourcePhaseRefs,
    sourceFixtureRefs: input.sourceFixtureRefs,
    docsRefs: input.docsRefs,
  };
}
