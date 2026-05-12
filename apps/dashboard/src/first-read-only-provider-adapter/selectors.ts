import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURE_MAP,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES,
} from './fixtures.js';
import type {
  FirstReadOnlyProviderAdapterSelectorQuery,
  FirstReadOnlyProviderAdapterSelectorResult,
} from './types.js';

export function selectFirstReadOnlyProviderAdapterFixture(
  query: FirstReadOnlyProviderAdapterSelectorQuery = {},
): FirstReadOnlyProviderAdapterSelectorResult {
  const fromId = query.fixtureId
    ? FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURE_MAP.get(query.fixtureId) ?? null
    : null;
  const fixture =
    fromId ??
    FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (query.configState && candidate.providerConfig.mode !== query.configState) return false;
      return true;
    }) ??
    FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0];

  return {
    selectorId: `${fixture?.fixtureId ?? 'none'}-selector`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase65-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'offline_account_info_success',
    matched:
      fixture !== undefined &&
      (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
      (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
      (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind) &&
      (!query.configState || fixture.providerConfig.mode === query.configState),
    source: 'synthetic_fixture_only',
  };
}
