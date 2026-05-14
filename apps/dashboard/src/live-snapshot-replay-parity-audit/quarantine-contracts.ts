import type { LiveSnapshotReplayParityQuarantineContract } from './types.js';

export function buildLiveSnapshotReplayParityQuarantineContract(input: {
  quarantineId: string;
  quarantined: boolean;
  reasonCodes: readonly string[];
}): LiveSnapshotReplayParityQuarantineContract {
  return {
    quarantineId: input.quarantineId,
    quarantined: input.quarantined,
    reasonCodes: input.reasonCodes,
    failClosed: true,
    promotionAllowed: false,
    releaseAllowed: false,
  };
}
