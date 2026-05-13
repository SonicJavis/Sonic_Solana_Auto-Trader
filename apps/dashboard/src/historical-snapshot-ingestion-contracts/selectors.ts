import { HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES } from './fixtures.js';
import type {
  HistoricalSnapshotIngestionContractFixture,
  HistoricalSnapshotIngestionContractSelectorQuery,
  HistoricalSnapshotIngestionContractSelectorResult,
} from './types.js';

function matchesQuery(
  fixture: HistoricalSnapshotIngestionContractFixture,
  query: HistoricalSnapshotIngestionContractSelectorQuery,
): boolean {
  if (query.fixtureId && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind && fixture.fixtureKind !== query.fixtureKind) return false;
  if (query.snapshotId && fixture.manifest.snapshotId !== query.snapshotId) return false;
  if (query.sourceProviderId && fixture.manifest.sourceProviderId !== query.sourceProviderId) return false;
  return true;
}

export function selectHistoricalSnapshotIngestionContractFixture(
  query: HistoricalSnapshotIngestionContractSelectorQuery,
): HistoricalSnapshotIngestionContractSelectorResult {
  const selected = HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase71-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'healthy_provider_snapshot_contract',
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
