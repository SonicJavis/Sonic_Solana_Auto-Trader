import type { LiveSnapshotScenarioExpectationLinkage } from './types.js';

export function buildLiveSnapshotScenarioExpectationLinkage(input: {
  scenarioExpectationLinkageId: string;
  scenarioExpectationRef: string;
  expectationPresent: boolean;
  linkageStatus: 'aligned' | 'missing' | 'warning' | 'blocked';
}): LiveSnapshotScenarioExpectationLinkage {
  return {
    scenarioExpectationId: input.scenarioExpectationLinkageId,
    sourceScenarioFixtureRef: input.scenarioExpectationRef,
    expectedLifecycleRef: `${input.scenarioExpectationRef}:lifecycle`,
    expectedReplayRef: `${input.scenarioExpectationRef}:replay`,
    expectationStatus:
      input.linkageStatus === 'missing'
        ? 'missing'
        : input.linkageStatus === 'blocked'
          ? 'blocked'
          : input.linkageStatus === 'warning'
            ? 'review_required'
            : 'ready',
    scenarioExpectationLinkageId: input.scenarioExpectationLinkageId,
    scenarioExpectationRef: input.scenarioExpectationRef,
    expectationPresent: input.expectationPresent,
    linkageStatus: input.linkageStatus,
    failClosed: true,
  };
}
