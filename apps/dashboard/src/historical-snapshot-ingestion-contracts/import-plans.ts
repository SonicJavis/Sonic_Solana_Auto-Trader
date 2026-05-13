import type { SnapshotImportPlan } from './types.js';

export function buildSnapshotImportPlan(input: {
  fixtureId: string;
  plannedSteps: readonly string[];
  expectedOutcome: string;
}): SnapshotImportPlan {
  return {
    importPlanId: `${input.fixtureId}-import-plan`,
    planMode: 'fixture_contract_only',
    disabledRuntimeImport: true,
    requiresNetwork: false,
    requiresFilesystem: false,
    requiresSecrets: false,
    plannedSteps: [...input.plannedSteps],
    expectedOutcome: input.expectedOutcome,
  };
}
