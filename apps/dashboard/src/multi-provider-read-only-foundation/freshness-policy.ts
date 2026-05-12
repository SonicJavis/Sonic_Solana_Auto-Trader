import type { MultiProviderFreshnessPolicy, ReadOnlyStaleAction } from './types.js';

export function buildReadOnlyFreshnessPolicy(input: {
  fixtureId: string;
  policyName: string;
  maxAgeMs: number;
  staleAction: ReadOnlyStaleAction;
}): MultiProviderFreshnessPolicy {
  return {
    policyId: `${input.fixtureId}-freshness-policy`,
    policyName: input.policyName,
    maxAgeMs: input.maxAgeMs,
    staleAction: input.staleAction,
    failClosed: true,
    noLiveRefresh: true,
  };
}
