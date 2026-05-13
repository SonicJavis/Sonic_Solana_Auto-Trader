import type { ReplayImportProvenanceContract } from './types.js';

export function buildReplayImportProvenanceContract(
  input: Omit<ReplayImportProvenanceContract, 'provenanceId'> & { fixtureId: string },
): ReplayImportProvenanceContract {
  return {
    provenanceId: `${input.fixtureId}-provenance`,
    sourceScenarioRefs: [...input.sourceScenarioRefs],
    sourceSnapshotRefs: [...input.sourceSnapshotRefs],
    sourceReliabilityRefs: [...input.sourceReliabilityRefs],
    sourceQualityRefs: [...input.sourceQualityRefs],
    lineageSummary: input.lineageSummary,
  };
}

export const buildSnapshotProvenanceContract = buildReplayImportProvenanceContract;
