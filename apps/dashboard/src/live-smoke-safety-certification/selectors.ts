import { LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES } from './fixtures.js';
import type {
  LiveSmokeSafetyCertificationFixture,
  LiveSmokeSafetySelectorQuery,
  LiveSmokeSafetySelectorResult,
} from './types.js';

function matchesQuery(fixture: LiveSmokeSafetyCertificationFixture, query: LiveSmokeSafetySelectorQuery): boolean {
  if (query.fixtureId && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind && fixture.fixtureKind !== query.fixtureKind) return false;
  if (query.smokeStatus && fixture.smokeResult.status !== query.smokeStatus) return false;
  return true;
}

export function selectLiveSmokeSafetyCertificationFixture(
  query: LiveSmokeSafetySelectorQuery,
): LiveSmokeSafetySelectorResult {
  const selected = LIVE_SMOKE_SAFETY_CERTIFICATION_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase69-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'standard_ci_smoke_skipped',
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
