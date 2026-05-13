import type { ReplayImportScenarioLinkage } from './types.js';

export function buildReplayImportScenarioLinkage(
  input: Omit<ReplayImportScenarioLinkage, 'scenarioLinkageId'> & { fixtureId: string },
): ReplayImportScenarioLinkage {
  return {
    scenarioLinkageId: `${input.fixtureId}-scenario-linkage`,
    scenarioFixtureRef: input.scenarioFixtureRef,
    scenarioStatus: input.scenarioStatus,
    failClosed: input.failClosed,
  };
}

export const buildSnapshotReplayLinkage = buildReplayImportScenarioLinkage;
