import type { SnapshotScenarioReliabilityLinkage } from './types.js';

export function buildSnapshotScenarioReliabilityLinkage(input: {
  fixtureId: string;
  sourceReliabilityFixtureRef: SnapshotScenarioReliabilityLinkage['sourceReliabilityFixtureRef'];
  reliabilityStatus: SnapshotScenarioReliabilityLinkage['reliabilityStatus'];
  driftSeverity: SnapshotScenarioReliabilityLinkage['driftSeverity'];
}): SnapshotScenarioReliabilityLinkage {
  return {
    reliabilityLinkageId: `${input.fixtureId}-reliability-linkage`,
    sourceReliabilityFixtureRef: input.sourceReliabilityFixtureRef,
    reliabilityStatus: input.reliabilityStatus,
    driftSeverity: input.driftSeverity,
  };
}
