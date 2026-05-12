import type { ProviderReconciliationPolicy, ProviderReconciliationResult } from './types.js';

export function buildProviderReconciliationPolicy(input: {
  fixtureId: string;
  policyName: string;
  preferFreshness: boolean;
  preferHigherHealth: boolean;
  preferConformance: boolean;
}): ProviderReconciliationPolicy {
  return {
    policyId: `${input.fixtureId}-policy`,
    policyName: input.policyName,
    failClosed: true,
    preferFreshness: input.preferFreshness,
    preferHigherHealth: input.preferHigherHealth,
    preferConformance: input.preferConformance,
    rejectUnsafeProviders: true,
    noLiveFallback: true,
    noLiveRefresh: true,
  };
}

export function buildProviderReconciliationResult(input: {
  fixtureId: string;
  selectedProviderId: string;
  rejectedProviderIds: readonly string[];
  unresolvedFieldPaths: readonly string[];
  reconciledFields: readonly string[];
  confidenceScore: number;
  confidenceLabel: ProviderReconciliationResult['confidenceLabel'];
  issueIds: readonly string[];
  failClosed: boolean;
  summary: string;
}): ProviderReconciliationResult {
  return {
    reconciliationId: `${input.fixtureId}-reconciliation`,
    selectedProviderId: input.selectedProviderId,
    rejectedProviderIds: [...input.rejectedProviderIds],
    unresolvedFieldPaths: [...input.unresolvedFieldPaths],
    reconciledFields: [...input.reconciledFields],
    confidenceScore: input.confidenceScore,
    confidenceLabel: input.confidenceLabel,
    issueIds: [...input.issueIds],
    failClosed: input.failClosed,
    summary: input.summary,
  };
}
