import type { MultiProviderReadOnlyFoundationFixture, MultiProviderReadOnlyFoundationReport } from './types.js';

export function buildMultiProviderReadOnlyFoundationReport(
  fixture: Omit<MultiProviderReadOnlyFoundationFixture, 'report'>,
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
      'Read-only, fixture-only, local-only, deterministic multi-provider foundation with no live network, wallet, signing, sending, execution, persistence, or advisory outputs.',
  };
}
