import { PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES } from './fixtures.js';
import type {
  ProviderAwareReplayScenarioFixture,
  ProviderAwareReplayScenarioSelectorQuery,
  ProviderAwareReplayScenarioSelectorResult,
} from './types.js';

function matchesQuery(
  fixture: ProviderAwareReplayScenarioFixture,
  query: ProviderAwareReplayScenarioSelectorQuery,
): boolean {
  if (query.fixtureId && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind && fixture.fixtureKind !== query.fixtureKind) return false;
  if (query.sourceQualityFixtureName && fixture.generatedScenario.sourceQualityFixtureName !== query.sourceQualityFixtureName)
    return false;
  return true;
}

export function selectProviderAwareReplayScenarioFixture(
  query: ProviderAwareReplayScenarioSelectorQuery,
): ProviderAwareReplayScenarioSelectorResult {
  const selected = PROVIDER_AWARE_REPLAY_SCENARIO_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase68-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'high_confidence_provider_agreement_scenario',
      matched: false,
      source: 'synthetic_fixture_only',
    };
  }
  return {
    selectorId: `${selected.fixtureId}-selector`,
    selectedFixtureId: selected.fixtureId,
    selectedFixtureKind: selected.fixtureKind,
    matched: true,
    source: 'synthetic_fixture_only',
  };
}
