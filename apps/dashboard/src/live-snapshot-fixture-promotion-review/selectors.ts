import { LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES } from './fixtures.js';
import type {
  FixturePromotionSelector,
  FixturePromotionSelectorQuery,
  LiveSnapshotFixturePromotionReviewFixture,
  LiveSnapshotFixturePromotionReviewKind,
} from './types.js';

function matchesQuery(fixture: LiveSnapshotFixturePromotionReviewFixture, query: FixturePromotionSelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectLiveSnapshotFixturePromotionReviewFixture(query: FixturePromotionSelectorQuery): FixturePromotionSelector {
  const selected = LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase80-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'fixture_promotion_review_ready' as LiveSnapshotFixturePromotionReviewKind,
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
