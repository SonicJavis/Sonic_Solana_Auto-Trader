import {
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS,
  LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION,
  PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SOURCE,
  type LiveSnapshotFixturePromotionReviewFixture,
  type LiveSnapshotFixturePromotionReviewKind,
  type LiveSnapshotFixturePromotionReviewName,
} from './types.js';

export function stableDeterministicLiveSnapshotFixturePromotionReviewChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b, 'en-US'))
      .reduce<Record<string, unknown>>((acc, [key, nested]) => {
        acc[key] = sortKeysDeep(nested);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidLiveSnapshotFixturePromotionReviewName(
  value: unknown,
): value is LiveSnapshotFixturePromotionReviewName {
  return typeof value === 'string' && (LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_NAMES as readonly string[]).includes(value);
}

export function isValidLiveSnapshotFixturePromotionReviewKind(
  value: unknown,
): value is LiveSnapshotFixturePromotionReviewKind {
  return typeof value === 'string' && (LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_KINDS as readonly string[]).includes(value);
}

export function isValidLiveSnapshotFixturePromotionReviewGeneratedAt(
  value: unknown,
): value is typeof PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT {
  return value === PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_GENERATED_AT;
}

export function isValidLiveSnapshotFixturePromotionReviewSource(
  value: unknown,
): value is typeof PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SOURCE {
  return value === PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SOURCE;
}

export function isValidLiveSnapshotFixturePromotionReviewSchemaVersion(
  value: unknown,
): value is typeof PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION {
  return value === PHASE_80_LIVE_SNAPSHOT_FIXTURE_PROMOTION_REVIEW_SCHEMA_VERSION;
}

export function normalizeLiveSnapshotFixturePromotionReviewFixture(
  fixture: LiveSnapshotFixturePromotionReviewFixture,
): LiveSnapshotFixturePromotionReviewFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as LiveSnapshotFixturePromotionReviewFixture;
}

export function serializeLiveSnapshotFixturePromotionReviewFixture(
  fixture: LiveSnapshotFixturePromotionReviewFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function areLiveSnapshotFixturePromotionReviewFixturesEqual(
  a: LiveSnapshotFixturePromotionReviewFixture,
  b: LiveSnapshotFixturePromotionReviewFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
