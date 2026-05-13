import type { SnapshotScenarioLineage } from './types.js';

export function buildSnapshotScenarioLineage(input: {
  fixtureId: string;
  sourceSnapshotRefs: readonly string[];
  sourceManifestRefs: readonly string[];
  sourceReliabilityRefs: readonly string[];
  sourceReplayRefs: readonly string[];
  generatedScenarioRefs: readonly string[];
  lineageSummary: string;
}): SnapshotScenarioLineage {
  return {
    lineageId: `${input.fixtureId}-scenario-lineage`,
    sourceSnapshotRefs: [...input.sourceSnapshotRefs],
    sourceManifestRefs: [...input.sourceManifestRefs],
    sourceReliabilityRefs: [...input.sourceReliabilityRefs],
    sourceReplayRefs: [...input.sourceReplayRefs],
    generatedScenarioRefs: [...input.generatedScenarioRefs],
    lineageSummary: input.lineageSummary,
  };
}
