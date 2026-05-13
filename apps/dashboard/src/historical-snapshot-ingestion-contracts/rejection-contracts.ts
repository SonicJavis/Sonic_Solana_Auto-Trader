import type { SnapshotRejectionContract } from './types.js';

export function buildSnapshotRejectionContract(input: {
  fixtureId: string;
  rejectionKind: SnapshotRejectionContract['rejectionKind'];
  severity: SnapshotRejectionContract['severity'];
  reasonCode: string;
  failClosed: boolean;
  safetyNotes: readonly string[];
}): SnapshotRejectionContract {
  return {
    rejectionId: `${input.fixtureId}-rejection`,
    rejectionKind: input.rejectionKind,
    severity: input.severity,
    reasonCode: input.reasonCode,
    failClosed: input.failClosed,
    safetyNotes: [...input.safetyNotes],
  };
}
