import type { ReplayImportRejectionContract } from './types.js';

export function buildReplayImportRejectionContract(
  input: Omit<ReplayImportRejectionContract, 'rejectionId'> & { fixtureId: string },
): ReplayImportRejectionContract {
  return {
    rejectionId: `${input.fixtureId}-rejection`,
    rejectionKind: input.rejectionKind,
    severity: input.severity,
    reasonCode: input.reasonCode,
    failClosed: input.failClosed,
    safetyNotes: [...input.safetyNotes],
  };
}

export const buildSnapshotRejectionContract = buildReplayImportRejectionContract;
