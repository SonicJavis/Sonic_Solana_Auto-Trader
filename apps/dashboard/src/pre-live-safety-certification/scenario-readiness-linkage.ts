import type { HistoricalSnapshotIngestionContractName } from '../historical-snapshot-ingestion-contracts/types.js';
import type { HistoricalSnapshotScenarioGeneratorName } from '../historical-snapshot-scenario-generator/types.js';
import type { PreLiveScenarioReadinessLinkage } from './types.js';

export function buildPreLiveScenarioReadinessLinkage(input: {
  linkageId: string;
  sourcePhase72FixtureName: HistoricalSnapshotScenarioGeneratorName;
  sourcePhase71FixtureName: HistoricalSnapshotIngestionContractName;
  linked: boolean;
  reasonCodes: readonly string[];
}): PreLiveScenarioReadinessLinkage {
  return {
    linkageId: input.linkageId,
    sourcePhase72FixtureName: input.sourcePhase72FixtureName,
    sourcePhase71FixtureName: input.sourcePhase71FixtureName,
    linked: input.linked,
    reasonCodes: [...input.reasonCodes],
  };
}
