import type { MultiProviderCachePolicy } from './types.js';

export function buildReadOnlyCachePolicy(input: {
  fixtureId: string;
  policyName: string;
  deterministicTtlMs: number;
}): MultiProviderCachePolicy {
  return {
    cachePolicyId: `${input.fixtureId}-cache-policy`,
    policyName: input.policyName,
    fixtureOnly: true,
    persistentCache: false,
    filesystemCache: false,
    browserCache: false,
    deterministicTtlMs: input.deterministicTtlMs,
  };
}
