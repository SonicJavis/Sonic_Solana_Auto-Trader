import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURE_MAP,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES,
} from './fixtures.js';
import type {
  ReadOnlySolanaProviderBoundarySelectorQuery,
  ReadOnlySolanaProviderBoundarySelectorResult,
} from './types.js';

export function selectReadOnlySolanaProviderBoundaryFixture(
  query: ReadOnlySolanaProviderBoundarySelectorQuery = {},
): ReadOnlySolanaProviderBoundarySelectorResult {
  const fromId = query.fixtureId
    ? READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURE_MAP.get(query.fixtureId) ?? null
    : null;
  const fixture =
    fromId ??
    READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (query.boundaryState && candidate.boundaryState.stateKind !== query.boundaryState) return false;
      return true;
    }) ??
    READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0];

  return {
    selectorId: `${fixture?.fixtureId ?? 'none'}-selector`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase64-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'account_info_boundary_ready',
    selectedBoundaryState: fixture?.boundaryState.stateKind ?? 'boundary_not_live',
    matched:
      fixture !== undefined &&
      (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
      (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
      (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind) &&
      (!query.boundaryState || fixture.boundaryState.stateKind === query.boundaryState),
    source: 'synthetic_fixture_only',
  };
}

