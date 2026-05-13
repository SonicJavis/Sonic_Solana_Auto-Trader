import type { ReplayImportNormalizationContract } from './types.js';

export function buildReplayImportNormalizationContract(
  input: Omit<ReplayImportNormalizationContract, 'normalizationContractId'> & { fixtureId: string },
): ReplayImportNormalizationContract {
  return {
    normalizationContractId: `${input.fixtureId}-normalization`,
    normalizationMode: input.normalizationMode,
    stableOrdering: true,
    deterministicChecksum: true,
    localeIndependent: true,
    mutationFree: true,
  };
}

export const buildSnapshotNormalizationContract = buildReplayImportNormalizationContract;
