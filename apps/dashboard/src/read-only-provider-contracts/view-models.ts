/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: view models.
 */

import type {
  ReadOnlyProviderContractFixture,
  ReadOnlyProviderContractViewModel,
} from './types.js';

export function buildReadOnlyProviderContractViewModel(
  fixture: ReadOnlyProviderContractFixture,
): ReadOnlyProviderContractViewModel {
  const identity = fixture.providerIdentity;
  const health = fixture.providerHealthContract;

  const disabledSummary = identity.disabledByDefault
    ? 'Disabled by default — contract-only gate; no live adapter active.'
    : 'Enabled as fixture-only contract gate; no live adapter active.';

  return {
    viewModelId: `phase54-view-${fixture.fixtureId}`,
    displayTitle: `${identity.providerName} read-only contract`,
    displaySubtitle: 'Synthetic fixture-only provider interface contract',
    providerLabel: identity.providerName,
    domainLabel: identity.providerDomain,
    statusLabel: health.deterministicStatus,
    capabilitySummary:
      'Read-only, fixture-derived, deterministic, local-only provider interface contract.',
    disabledSummary,
    nonAdvisorySummary:
      'Synthetic fixture-only contract; not actionable and not advisory.',
    safetyBadge: 'contract-only | no-live-data | no-network | no-wallet | no-execution',
  };
}
