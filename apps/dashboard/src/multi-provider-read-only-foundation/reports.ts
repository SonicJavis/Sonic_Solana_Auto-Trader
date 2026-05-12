import type { MultiProviderReadOnlyFoundationReport } from './types.js';

export function buildMultiProviderReadOnlyFoundationReport(
  fixture: {
    readonly fixtureId: string;
    readonly providerRegistry: {
      readonly providerEntries: readonly unknown[];
      readonly disabledProviderEntries: readonly string[];
    };
    readonly providerHealthScores: readonly { readonly status: string }[];
    readonly staleDataChecks: readonly { readonly stale: boolean }[];
    readonly freshnessPolicy: { readonly policyName: string; readonly staleAction: string };
    readonly cachePolicy: { readonly policyName: string; readonly deterministicTtlMs: number };
    readonly providerSelection: { readonly selectedProviderId: string };
    readonly providerFallback: { readonly primaryProviderId: string; readonly fallbackProviderIds: readonly string[] };
  },
): MultiProviderReadOnlyFoundationReport {
  const staleCount = fixture.staleDataChecks.filter(check => check.stale).length;
  const disabledCount = fixture.providerRegistry.disabledProviderEntries.length;
  const healthyCount = fixture.providerHealthScores.filter(score => score.status === 'healthy').length;

  return {
    reportId: `${fixture.fixtureId}-report`,
    registrySummary: `${fixture.providerRegistry.providerEntries.length} providers registered; ${disabledCount} disabled by default.`,
    healthSummary: `${healthyCount} healthy providers across deterministic health scoring.`,
    staleDataSummary: `${staleCount} providers marked stale within deterministic checks.`,
    freshnessSummary: `${fixture.freshnessPolicy.policyName} with stale action ${fixture.freshnessPolicy.staleAction}.`,
    cachePolicySummary: `${fixture.cachePolicy.policyName} with deterministic TTL ${fixture.cachePolicy.deterministicTtlMs}ms.`,
    selectionSummary: `Selected provider ${fixture.providerSelection.selectedProviderId}; fail-closed selection enabled.`,
    fallbackSummary: `Primary ${fixture.providerFallback.primaryProviderId}; fallback candidates ${fixture.providerFallback.fallbackProviderIds.join(', ') || 'none'}.`,
    safetySummary:
      'Read-only, fixture-only, local-only, deterministic multi-provider foundation with no live network, credential handling, signing, sending, execution, persistence, or advisory outputs.',
  };
}
