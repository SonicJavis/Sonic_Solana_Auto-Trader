import type { LiveSnapshotIntegrityParity } from './types.js';

export function buildLiveSnapshotIntegrityParity(input: {
  integrityParityId: string;
  expectedChecksum: string;
  actualChecksum: string;
  integrityStatus: 'pass' | 'warning' | 'fail';
  parityMatch: boolean;
}): LiveSnapshotIntegrityParity {
  return {
    integrityParityId: input.integrityParityId,
    checksumKind: 'fnv1a32',
    expectedChecksum: input.expectedChecksum,
    actualChecksum: input.actualChecksum,
    integrityStatus: input.integrityStatus,
    parityMatch: input.parityMatch,
  };
}
