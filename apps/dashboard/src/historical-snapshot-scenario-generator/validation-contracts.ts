import type { SnapshotScenarioValidationContract } from './types.js';

export function buildSnapshotScenarioValidationContract(input: {
  fixtureId: string;
  rules: readonly string[];
  rejectionReasons: readonly string[];
  criticalFailureReasons: readonly string[];
  warningReasons: readonly string[];
  failClosed: boolean;
}): SnapshotScenarioValidationContract {
  return {
    validationId: `${input.fixtureId}-scenario-validation`,
    rules: [...input.rules],
    rejectionReasons: [...input.rejectionReasons],
    criticalFailureReasons: [...input.criticalFailureReasons],
    warningReasons: [...input.warningReasons],
    failClosed: input.failClosed,
  };
}
