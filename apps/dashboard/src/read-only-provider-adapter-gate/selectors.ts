import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURE_MAP,
  READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES,
} from './fixtures.js';
import type {
  ReadOnlyProviderAdapterGateSelectorQuery,
  ReadOnlyProviderAdapterGateSelectorResult,
} from './types.js';

export function selectReadOnlyProviderAdapterGateFixture(
  query: ReadOnlyProviderAdapterGateSelectorQuery = {},
): ReadOnlyProviderAdapterGateSelectorResult {
  const fromId = query.fixtureId
    ? READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURE_MAP.get(query.fixtureId) ?? null
    : null;

  const fixture =
    fromId ??
    READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (query.gateState && candidate.gateState.stateKind !== query.gateState) return false;
      if (query.allowed !== undefined && candidate.resolutionResult.allowed !== query.allowed) return false;
      return true;
    }) ??
    READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0];

  return {
    selectorId: `${fixture?.fixtureId ?? 'none'}-selector`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase63-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'safe_synthetic_mock_accepted_gate',
    selectedGateState: fixture?.gateState.stateKind ?? 'closed_by_default',
    matched:
      fixture !== undefined &&
      (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
      (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
      (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind) &&
      (!query.gateState || fixture.gateState.stateKind === query.gateState) &&
      (query.allowed === undefined || fixture.resolutionResult.allowed === query.allowed),
    source: 'synthetic_fixture_only',
  };
}
