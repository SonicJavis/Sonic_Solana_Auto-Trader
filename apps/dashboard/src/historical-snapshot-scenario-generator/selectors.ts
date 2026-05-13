import { HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES } from './fixtures.js';
import type {
  HistoricalSnapshotScenarioGeneratorFixture,
  HistoricalSnapshotScenarioGeneratorSelectorQuery,
  HistoricalSnapshotScenarioGeneratorSelectorResult,
} from './types.js';

function matchesQuery(
  fixture: HistoricalSnapshotScenarioGeneratorFixture,
  query: HistoricalSnapshotScenarioGeneratorSelectorQuery,
): boolean {
  if (query.fixtureId && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind && fixture.fixtureKind !== query.fixtureKind) return false;
  if (query.scenarioId && fixture.scenarioDescriptor.scenarioId !== query.scenarioId) return false;
  if (query.sourceSnapshotFixtureName && fixture.generationPlan.sourceSnapshotFixtureName !== query.sourceSnapshotFixtureName) {
    return false;
  }
  return true;
}

export function selectHistoricalSnapshotScenarioGeneratorFixture(
  query: HistoricalSnapshotScenarioGeneratorSelectorQuery,
): HistoricalSnapshotScenarioGeneratorSelectorResult {
  const selected = HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase72-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'healthy_snapshot_generates_clean_scenario',
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
