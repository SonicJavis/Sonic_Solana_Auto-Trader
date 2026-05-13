import type { FirstReadOnlyProviderAdapterName } from '../first-read-only-provider-adapter/types.js';
import type { MultiProviderReadOnlyFoundationName } from '../multi-provider-read-only-foundation/types.js';
import type { PreLiveProviderReadinessLinkage } from './types.js';

export function buildPreLiveProviderReadinessLinkage(input: {
  linkageId: string;
  sourcePhase66FixtureName: MultiProviderReadOnlyFoundationName;
  sourcePhase65FixtureName: FirstReadOnlyProviderAdapterName;
  linked: boolean;
  reasonCodes: readonly string[];
}): PreLiveProviderReadinessLinkage {
  return {
    linkageId: input.linkageId,
    sourcePhase66FixtureName: input.sourcePhase66FixtureName,
    sourcePhase65FixtureName: input.sourcePhase65FixtureName,
    linked: input.linked,
    reasonCodes: [...input.reasonCodes],
  };
}
