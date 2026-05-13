import type { SnapshotValidationContract } from './types.js';

export function buildSnapshotValidationContract(input: {
  fixtureId: string;
  rules: readonly string[];
  rejectionReasons: readonly string[];
  criticalFailureReasons: readonly string[];
  warningReasons: readonly string[];
  failClosed: boolean;
}): SnapshotValidationContract {
  return {
    validationContractId: `${input.fixtureId}-validation-contract`,
    rules: [...input.rules],
    rejectionReasons: [...input.rejectionReasons],
    criticalFailureReasons: [...input.criticalFailureReasons],
    warningReasons: [...input.warningReasons],
    failClosed: input.failClosed,
  };
}
