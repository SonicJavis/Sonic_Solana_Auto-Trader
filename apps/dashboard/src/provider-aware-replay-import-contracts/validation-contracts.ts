import type { ReplayImportValidationContract } from './types.js';

export function buildReplayImportValidationContract(
  input: Omit<ReplayImportValidationContract, 'validationId'> & { fixtureId: string },
): ReplayImportValidationContract {
  return {
    validationId: `${input.fixtureId}-validation`,
    rules: [...input.rules],
    rejectionReasons: [...input.rejectionReasons],
    criticalFailureReasons: [...input.criticalFailureReasons],
    warningReasons: [...input.warningReasons],
    failClosed: true,
  };
}

export const buildSnapshotValidationContract = buildReplayImportValidationContract;
