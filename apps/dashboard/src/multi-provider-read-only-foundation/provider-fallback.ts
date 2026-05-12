import type { MultiProviderFallbackFixture } from './types.js';

export function buildProviderFallbackFixture(input: {
  fixtureId: string;
  primaryProviderId: string;
  fallbackProviderIds: readonly string[];
  fallbackReasonCodes: readonly string[];
}): MultiProviderFallbackFixture {
  return {
    fallbackPolicyId: `${input.fixtureId}-provider-fallback`,
    primaryProviderId: input.primaryProviderId,
    fallbackProviderIds: input.fallbackProviderIds,
    fallbackReasonCodes: input.fallbackReasonCodes,
    unsafeFallbackBlocked: true,
  };
}
