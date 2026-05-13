import type { LiveSnapshotQuarantineContract } from './types.js';

export function buildLiveSnapshotQuarantineContract(input: {
  quarantineId: string;
  quarantined: boolean;
  reasonCodes: readonly string[];
}): LiveSnapshotQuarantineContract {
  return {
    quarantineId: input.quarantineId,
    quarantined: input.quarantined,
    reasonCodes: input.reasonCodes,
    failClosed: true,
    promotionAllowed: false,
  };
}
