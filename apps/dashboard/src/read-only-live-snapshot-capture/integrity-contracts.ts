import type { LiveSnapshotIntegrityContract } from './types.js';

export function buildLiveSnapshotIntegrityContract(input: {
  integrityId: string;
  checksum: string;
  evidenceBundleId: string;
}): LiveSnapshotIntegrityContract {
  return {
    integrityId: input.integrityId,
    checksum: input.checksum,
    checksumKind: 'fnv1a32',
    evidenceBundleId: input.evidenceBundleId,
  };
}
