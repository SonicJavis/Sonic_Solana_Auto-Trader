import type { ManualConfirmProviderReadinessLinkage } from './types.js';

export function buildManualConfirmProviderReadinessLinkage(input: {
  linkageId: string;
  phase65FixtureRef: string;
  phase66FixtureRef: string;
  providerReadinessVerified: boolean;
}): ManualConfirmProviderReadinessLinkage {
  return {
    linkageId: input.linkageId,
    phase65FixtureRef: input.phase65FixtureRef,
    phase66FixtureRef: input.phase66FixtureRef,
    providerReadinessVerified: input.providerReadinessVerified,
    readOnlyOnly: true,
  };
}
