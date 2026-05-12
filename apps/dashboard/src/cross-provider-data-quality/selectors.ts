import { CROSS_PROVIDER_DATA_QUALITY_FIXTURES } from './fixtures.js';
import type {
  CrossProviderDataQualityFixture,
  CrossProviderDataQualitySelectorQuery,
  CrossProviderDataQualitySelectorResult,
} from './types.js';

function matchesQuery(fixture: CrossProviderDataQualityFixture, query: CrossProviderDataQualitySelectorQuery): boolean {
  if (query.fixtureId && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind && fixture.fixtureKind !== query.fixtureKind) return false;
  if (query.selectedProviderId && fixture.reconciliationResult.selectedProviderId !== query.selectedProviderId)
    return false;
  return true;
}

export function selectCrossProviderDataQualityFixture(
  query: CrossProviderDataQualitySelectorQuery,
): CrossProviderDataQualitySelectorResult {
  const selected = CROSS_PROVIDER_DATA_QUALITY_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase67-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'all_providers_agree_high_confidence',
      selectedProviderId: 'none',
      matched: false,
      source: 'synthetic_fixture_only',
    };
  }
  return {
    selectorId: `${selected.fixtureId}-selector`,
    selectedFixtureId: selected.fixtureId,
    selectedFixtureKind: selected.fixtureKind,
    selectedProviderId: selected.reconciliationResult.selectedProviderId,
    matched: true,
    source: 'synthetic_fixture_only',
  };
}
