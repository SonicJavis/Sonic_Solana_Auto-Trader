import type { SnapshotScenarioQualityLinkage } from './types.js';

export function buildSnapshotScenarioQualityLinkage(input: {
  fixtureId: string;
  sourceQualityFixtureRef: SnapshotScenarioQualityLinkage['sourceQualityFixtureRef'];
  qualityStatus: SnapshotScenarioQualityLinkage['qualityStatus'];
  qualityReasonCodes: readonly string[];
}): SnapshotScenarioQualityLinkage {
  return {
    qualityLinkageId: `${input.fixtureId}-quality-linkage`,
    sourceQualityFixtureRef: input.sourceQualityFixtureRef,
    qualityStatus: input.qualityStatus,
    qualityReasonCodes: [...input.qualityReasonCodes],
  };
}
