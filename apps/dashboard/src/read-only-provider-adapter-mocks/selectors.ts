/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: selectors.
 */

import {
  READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURE_MAP,
} from './fixtures.js';
import type {
  ReadOnlyProviderAdapterMockFixture,
  ReadOnlyProviderAdapterMockSelectorQuery,
  ReadOnlyProviderAdapterMockSelectorResult,
} from './types.js';

export function selectReadOnlyProviderAdapterMockFixture(
  query: ReadOnlyProviderAdapterMockSelectorQuery = {},
): ReadOnlyProviderAdapterMockSelectorResult {
  const fromId = query.fixtureId
    ? (READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURE_MAP.get(query.fixtureId) ?? null)
    : null;

  const fixture: ReadOnlyProviderAdapterMockFixture | undefined =
    fromId ??
    READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) {
        return false;
      }
      if (query.adapterKind && candidate.fixtureKind !== query.adapterKind) {
        return false;
      }
      if (query.domain && candidate.adapterIdentity.adapterDomain !== query.domain) {
        return false;
      }
      return true;
    }) ??
    READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES[0];

  const matched =
    fixture !== undefined &&
    (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
    (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
    (!query.adapterKind || fixture.fixtureKind === query.adapterKind) &&
    (!query.domain || fixture.adapterIdentity.adapterDomain === query.domain);

  return {
    selectorId: `phase55-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase55-none',
    selectedAdapterKind: fixture?.fixtureKind ?? 'mock_solana_rpc_adapter',
    selectedDomain: fixture?.adapterIdentity.adapterDomain ?? 'mock_solana_rpc_adapter',
    matched,
    source: 'synthetic_fixture_only',
  };
}
