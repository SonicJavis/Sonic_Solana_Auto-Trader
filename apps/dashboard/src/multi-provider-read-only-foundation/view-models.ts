import type {
  MultiProviderReadOnlyFoundationFixture,
  MultiProviderReadOnlyFoundationViewModel,
} from './types.js';

export function buildMultiProviderViewModel(
  fixture: Omit<MultiProviderReadOnlyFoundationFixture, 'viewModel'>,
): MultiProviderReadOnlyFoundationViewModel {
  const staleProviderIds = fixture.staleDataChecks.filter(check => check.stale).map(check => check.providerId);

  return {
    viewModelId: `${fixture.fixtureId}-view-model`,
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    selectedProviderId: fixture.providerSelection.selectedProviderId,
    fallbackProviderIds: fixture.providerSelection.fallbackProviderIds,
    staleProviderIds,
    disabledProviderIds: fixture.providerRegistry.disabledProviderEntries,
    summary: `${fixture.fixtureName} exposes deterministic multi-provider read-only selection and fallback with fail-closed behavior.`,
  };
}
