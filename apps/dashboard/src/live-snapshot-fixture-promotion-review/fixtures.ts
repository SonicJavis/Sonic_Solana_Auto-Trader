import { buildLiveSnapshotFixturePromotionReviewFixture } from './builders.js';
import {
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS,
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES,
  type LiveSnapshotFixturePromotionReviewFixture,
  type LiveSnapshotFixturePromotionReviewKind,
  type LiveSnapshotFixturePromotionReviewName,
} from './types.js';
import { validateLiveSnapshotFixturePromotionReviewFixtureTable } from './validation.js';

export const LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES = LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES.map(
  fixtureName => buildLiveSnapshotFixturePromotionReviewFixture({ fixtureName }),
) satisfies readonly LiveSnapshotFixturePromotionReviewFixture[];

export const LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURE_MAP: ReadonlyMap<
  string,
  LiveSnapshotFixturePromotionReviewFixture
> = new Map(LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES.length < 8) {
  throw new Error(
    `Phase 80 fixture count mismatch: expected >= 8, received ${LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES.length}`,
  );
}
if (LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES.length !== LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS.length) {
  throw new Error('Phase 80 name/kind cardinality mismatch');
}

const tableValidation = validateLiveSnapshotFixturePromotionReviewFixtureTable(
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(`Phase 80 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listLiveSnapshotFixturePromotionReviewFixtures(): readonly LiveSnapshotFixturePromotionReviewFixture[] {
  return LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURES;
}

export function getLiveSnapshotFixturePromotionReviewFixture(
  fixtureId: string,
): LiveSnapshotFixturePromotionReviewFixture | null {
  return LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES, LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS };
export type { LiveSnapshotFixturePromotionReviewName, LiveSnapshotFixturePromotionReviewKind };
