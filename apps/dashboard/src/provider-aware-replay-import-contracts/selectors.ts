import { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES } from './fixtures.js';
import type {
  ProviderAwareReplayImportContractFixture,
  ProviderAwareReplayImportContractSelectorQuery,
  ProviderAwareReplayImportContractSelectorResult,
} from './types.js';

function matchesQuery(
  fixture: ProviderAwareReplayImportContractFixture,
  query: ProviderAwareReplayImportContractSelectorQuery,
): boolean {
  if (query.fixtureId && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind && fixture.fixtureKind !== query.fixtureKind) return false;
  if (query.candidateId && fixture.importCandidate.candidateId !== query.candidateId) return false;
  return true;
}

export function selectProviderAwareReplayImportContractFixture(
  query: ProviderAwareReplayImportContractSelectorQuery,
): ProviderAwareReplayImportContractSelectorResult {
  const selected = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase73-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'clean_scenario_import_contract',
      matched: false,
      source: 'deterministic_fixture_only',
    };
  }
  return {
    selectorId: `${selected.fixtureId}-selector`,
    selectedFixtureId: selected.fixtureId,
    selectedFixtureKind: selected.fixtureKind,
    matched: true,
    source: 'deterministic_fixture_only',
  };
}
