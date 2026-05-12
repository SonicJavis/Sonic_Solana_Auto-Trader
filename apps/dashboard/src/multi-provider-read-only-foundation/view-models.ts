import type { MultiProviderReadOnlyFoundationViewModel } from './types.js';

export function buildMultiProviderViewModel(
  fixture: {
    readonly fixtureId: string;
    readonly fixtureName: MultiProviderReadOnlyFoundationViewModel['fixtureName'];
    readonly providerSelection: { readonly selectedProviderId: string; readonly fallbackProviderIds: readonly string[] };
    readonly staleDataChecks: readonly { readonly providerId: string; readonly stale: boolean }[];
    readonly providerRegistry: { readonly disabledProviderEntries: readonly string[] };
  },
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
