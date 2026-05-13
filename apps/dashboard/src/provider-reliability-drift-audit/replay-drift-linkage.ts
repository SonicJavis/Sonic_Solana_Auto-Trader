import type { ProviderReplayDriftLinkage } from './types.js';

export function buildProviderReplayDriftLinkage(input: {
  fixtureId: string;
  providerId: string;
  replayScenarioName: ProviderReplayDriftLinkage['replayScenarioName'];
  parityStatus: ProviderReplayDriftLinkage['parityStatus'];
  driftCompatible: boolean;
  sourceRefs: readonly string[];
}): ProviderReplayDriftLinkage {
  return {
    replayLinkageId: `${input.fixtureId}-replay-linkage`,
    providerId: input.providerId,
    replayScenarioName: input.replayScenarioName,
    parityStatus: input.parityStatus,
    driftCompatible: input.driftCompatible,
    sourceRefs: [...input.sourceRefs].sort((left, right) => left.localeCompare(right, 'en-US')),
  };
}
