/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: view models.
 */

import type {
  ReadOnlyProviderAdapterMockFixture,
  ReadOnlyProviderAdapterMockViewModel,
} from './types.js';

export function buildReadOnlyProviderAdapterMockViewModel(
  fixture: ReadOnlyProviderAdapterMockFixture,
): ReadOnlyProviderAdapterMockViewModel {
  const identity = fixture.adapterIdentity;
  const health = fixture.adapterHealthProfile;

  const disabledSummary = identity.disabledByDefault
    ? 'Disabled by default — mock-only adapter gate with disabled live access.'
    : 'Fixture-enabled mock-only adapter gate with disabled live access.';

  return {
    viewModelId: `phase55-view-${fixture.fixtureId}`,
    displayTitle: `${identity.adapterName} read-only adapter mock`,
    displaySubtitle: 'Contract-conforming, fixture-only, future adapter gate.',
    adapterLabel: identity.adapterName,
    domainLabel: identity.adapterDomain,
    sourceProviderContractLabel: fixture.sourceProviderContractName,
    statusLabel: health.healthLabel,
    capabilitySummary:
      'Mock-only, contract-conforming, deterministic, local-only, read-only fixture response surface.',
    disabledSummary,
    nonAdvisorySummary: 'Fixture-only response model; not actionable and not advisory.',
    safetyBadge: 'mock-only | no-live-data | no-network | no-wallet | no-execution',
  };
}
