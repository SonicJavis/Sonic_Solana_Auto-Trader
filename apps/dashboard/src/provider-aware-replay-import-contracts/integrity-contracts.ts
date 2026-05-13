import type { ReplayImportIntegrityContract } from './types.js';

export function buildReplayImportIntegrityContract(
  input: Omit<ReplayImportIntegrityContract, 'integrityId'> & { fixtureId: string },
): ReplayImportIntegrityContract {
  return {
    integrityId: `${input.fixtureId}-integrity`,
    checksum: input.checksum,
    checksumAlgorithm: 'fnv1a32',
    manifestHash: input.manifestHash,
    sourceHash: input.sourceHash,
    deterministic: true,
  };
}

export const buildSnapshotIntegrityContract = buildReplayImportIntegrityContract;
