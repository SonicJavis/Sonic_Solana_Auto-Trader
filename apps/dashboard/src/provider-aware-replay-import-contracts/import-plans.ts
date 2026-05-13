import type { ReplayImportPlan } from './types.js';

export function buildReplayImportPlan(input: Omit<ReplayImportPlan, 'importPlanId'> & { fixtureId: string }): ReplayImportPlan {
  return {
    importPlanId: `${input.fixtureId}-import-plan`,
    planMode: 'fixture_contract_only',
    candidateIds: [...input.candidateIds],
    disabledRuntimeImport: true,
    disabledFilesystemImport: true,
    requiresNetwork: false,
    requiresFilesystem: false,
    requiresSecrets: false,
    expectedOutcome: input.expectedOutcome,
  };
}

export const buildSnapshotImportPlan = buildReplayImportPlan;
