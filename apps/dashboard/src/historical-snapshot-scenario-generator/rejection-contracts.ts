import type { SnapshotScenarioRejectionContract } from './types.js';

export function buildSnapshotScenarioRejectionContract(input: {
  fixtureId: string;
  rejectionKind: SnapshotScenarioRejectionContract['rejectionKind'];
  severity: SnapshotScenarioRejectionContract['severity'];
  reasonCode: string;
  failClosed: boolean;
  safetyNotes: readonly string[];
}): SnapshotScenarioRejectionContract {
  return {
    rejectionId: `${input.fixtureId}-scenario-rejection`,
    rejectionKind: input.rejectionKind,
    severity: input.severity,
    reasonCode: input.reasonCode,
    failClosed: input.failClosed,
    safetyNotes: [...input.safetyNotes],
  };
}
