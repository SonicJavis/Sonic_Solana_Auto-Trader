import type { SnapshotNormalizationContract } from './types.js';

export function buildSnapshotNormalizationContract(input: {
  fixtureId: string;
  normalizationMode: SnapshotNormalizationContract['normalizationMode'];
  stableOrdering: boolean;
  deterministicChecksum: boolean;
  localeIndependent: boolean;
  mutationFree: boolean;
}): SnapshotNormalizationContract {
  return {
    normalizationContractId: `${input.fixtureId}-normalization-contract`,
    normalizationMode: input.normalizationMode,
    stableOrdering: input.stableOrdering,
    deterministicChecksum: input.deterministicChecksum,
    localeIndependent: input.localeIndependent,
    mutationFree: input.mutationFree,
  };
}
