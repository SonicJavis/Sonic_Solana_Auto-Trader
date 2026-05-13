import type { SnapshotIntegrityContract } from './types.js';

export function buildSnapshotIntegrityContract(input: {
  fixtureId: string;
  checksum: string;
  manifestHash: string;
  sourceHash: string;
}): SnapshotIntegrityContract {
  return {
    integrityContractId: `${input.fixtureId}-integrity-contract`,
    checksum: input.checksum,
    checksumAlgorithm: 'fnv1a32',
    manifestHash: input.manifestHash,
    sourceHash: input.sourceHash,
    deterministic: true,
  };
}
