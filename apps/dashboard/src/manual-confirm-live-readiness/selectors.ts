import { MANUAL_CONFIRM_LIVE_READINESS_FIXTURES } from './fixtures.js';
import type {
  ManualConfirmLiveReadinessFixture,
  ManualConfirmLiveReadinessKind,
  ManualConfirmSelector,
  ManualConfirmSelectorQuery,
} from './types.js';

function matchesQuery(fixture: ManualConfirmLiveReadinessFixture, query: ManualConfirmSelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectManualConfirmLiveReadinessFixture(query: ManualConfirmSelectorQuery): ManualConfirmSelector {
  const selected = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase76-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'manual_confirm_readiness_complete' as ManualConfirmLiveReadinessKind,
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
