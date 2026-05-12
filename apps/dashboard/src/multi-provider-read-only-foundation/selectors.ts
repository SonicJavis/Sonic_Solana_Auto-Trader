import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURE_MAP,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES,
} from './fixtures.js';
import type {
  MultiProviderReadOnlyFoundationSelectorQuery,
  MultiProviderReadOnlyFoundationSelectorResult,
} from './types.js';

export function selectMultiProviderReadOnlyFoundationFixture(
  query: MultiProviderReadOnlyFoundationSelectorQuery = {},
): MultiProviderReadOnlyFoundationSelectorResult {
  const fromId = query.fixtureId
    ? MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURE_MAP.get(query.fixtureId) ?? null
    : null;

  const fixture =
    fromId ??
    MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (query.selectedProviderId && candidate.providerSelection.selectedProviderId !== query.selectedProviderId)
        return false;
      return true;
    }) ??
    MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0];

  return {
    selectorId: `${fixture?.fixtureId ?? 'none'}-selector`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase66-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'single_provider_healthy',
    selectedProviderId: fixture?.providerSelection.selectedProviderId ?? 'none',
    matched:
      fixture !== undefined &&
      (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
      (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
      (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind) &&
      (!query.selectedProviderId || fixture.providerSelection.selectedProviderId === query.selectedProviderId),
    source: 'synthetic_fixture_only',
  };
}
