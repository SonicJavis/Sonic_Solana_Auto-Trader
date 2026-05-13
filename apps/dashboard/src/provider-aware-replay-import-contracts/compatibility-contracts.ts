import type { ReplayImportCompatibilityContract } from './types.js';

export function buildReplayImportCompatibilityContract(
  input: Omit<ReplayImportCompatibilityContract, 'compatibilityId'> & { fixtureId: string },
): ReplayImportCompatibilityContract {
  return {
    compatibilityId: `${input.fixtureId}-compatibility`,
    replaySchemaCompatible: input.replaySchemaCompatible,
    scenarioCompatible: input.scenarioCompatible,
    snapshotCompatible: input.snapshotCompatible,
    qualityCompatible: input.qualityCompatible,
    reliabilityCompatible: input.reliabilityCompatible,
    compatibilityStatus: input.compatibilityStatus,
    incompatibilityReasonCodes: [...input.incompatibilityReasonCodes],
    failClosed: input.failClosed,
  };
}

export const buildSnapshotSchemaContract = buildReplayImportCompatibilityContract;
