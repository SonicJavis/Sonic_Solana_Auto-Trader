import type { ProviderAwareReplayImportContractName } from '../provider-aware-replay-import-contracts/types.js';
import type { ProviderAwareReplayScenarioName } from '../provider-aware-replay-scenarios/types.js';
import type { PreLiveReplayReadinessLinkage } from './types.js';

export function buildPreLiveReplayReadinessLinkage(input: {
  linkageId: string;
  sourcePhase73FixtureName: ProviderAwareReplayImportContractName;
  sourcePhase68FixtureName: ProviderAwareReplayScenarioName;
  linked: boolean;
  replayImportComplete: boolean;
  reasonCodes: readonly string[];
}): PreLiveReplayReadinessLinkage {
  return {
    linkageId: input.linkageId,
    sourcePhase73FixtureName: input.sourcePhase73FixtureName,
    sourcePhase68FixtureName: input.sourcePhase68FixtureName,
    linked: input.linked,
    replayImportComplete: input.replayImportComplete,
    reasonCodes: [...input.reasonCodes],
  };
}
