import type { ManualConfirmScenarioReadinessLinkage } from './types.js';

export function buildManualConfirmScenarioReadinessLinkage(input: {
  linkageId: string;
  phase72FixtureRef: string;
  scenarioReadinessVerified: boolean;
  scenarioStatus: string;
}): ManualConfirmScenarioReadinessLinkage {
  return {
    linkageId: input.linkageId,
    phase72FixtureRef: input.phase72FixtureRef,
    scenarioReadinessVerified: input.scenarioReadinessVerified,
    scenarioStatus: input.scenarioStatus,
  };
}
