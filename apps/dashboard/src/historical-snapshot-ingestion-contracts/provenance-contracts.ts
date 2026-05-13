import type { SnapshotProvenanceContract } from './types.js';

export function buildSnapshotProvenanceContract(input: {
  fixtureId: string;
  sourcePhaseRefs: SnapshotProvenanceContract['sourcePhaseRefs'];
  sourceFixtureRefs: readonly string[];
  providerReliabilityRefs: readonly string[];
  replayScenarioRefs: readonly string[];
  dataQualityRefs: readonly string[];
  lineageSummary: string;
}): SnapshotProvenanceContract {
  return {
    provenanceId: `${input.fixtureId}-provenance`,
    sourcePhaseRefs: [...input.sourcePhaseRefs],
    sourceFixtureRefs: [...input.sourceFixtureRefs],
    providerReliabilityRefs: [...input.providerReliabilityRefs],
    replayScenarioRefs: [...input.replayScenarioRefs],
    dataQualityRefs: [...input.dataQualityRefs],
    lineageSummary: input.lineageSummary,
  };
}
