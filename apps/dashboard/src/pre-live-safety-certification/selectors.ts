import { PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES } from './fixtures.js';
import type {
  PreLiveSafetyCertificationFixture,
  PreLiveSafetyCertificationKind,
  PreLiveSelector,
  PreLiveSelectorQuery,
} from './types.js';

function matchesQuery(fixture: PreLiveSafetyCertificationFixture, query: PreLiveSelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectPreLiveSafetyCertificationFixture(query: PreLiveSelectorQuery): PreLiveSelector {
  const selected = PRE_LIVE_SAFETY_CERTIFICATION_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase75-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'complete_read_only_certification_ready' as PreLiveSafetyCertificationKind,
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
