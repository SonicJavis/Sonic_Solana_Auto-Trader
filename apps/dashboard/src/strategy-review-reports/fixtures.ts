import { buildStrategyReviewReportFixture, NAME_TO_KIND } from './builders.js';
import type {
  StrategyReviewReportFixture,
  StrategyReviewReportFixtureName,
} from './types.js';
import { STRATEGY_REVIEW_REPORT_FIXTURE_NAMES } from './types.js';

function buildFixtureOrThrow(name: StrategyReviewReportFixtureName): StrategyReviewReportFixture {
  const result = buildStrategyReviewReportFixture({ name, kind: NAME_TO_KIND[name] });
  if (!result.fixture) {
    throw new Error(`Failed to build Phase 41 fixture: ${name}`);
  }
  return result.fixture;
}

export const DEFENSIVE_VS_AGGRESSIVE_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'defensive-vs-aggressive-review-report',
);
export const CREATOR_LED_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow('creator-led-review-report');
export const WALLET_LED_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow('wallet-led-review-report');
export const MANIPULATION_AVOIDANCE_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'manipulation-avoidance-review-report',
);
export const NO_ACTION_SAFETY_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'no-action-safety-review-report',
);
export const INSUFFICIENT_DATA_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'insufficient-data-review-report',
);
export const HIGH_SCORE_POSITIVE_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'high-score-positive-review-report',
);
export const HIGH_SCORE_FALSE_POSITIVE_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'high-score-false-positive-review-report',
);
export const MISSED_OPPORTUNITY_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'missed-opportunity-review-report',
);
export const DRAWDOWN_CONTAINED_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'drawdown-contained-review-report',
);
export const MIXED_SIGNAL_WATCHLIST_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'mixed-signal-watchlist-review-report',
);
export const FALSE_POSITIVE_PROTECTION_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'false-positive-protection-review-report',
);
export const MALFORMED_INPUT_SAFE_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'malformed-input-safe-review-report',
);
export const DASHBOARD_READY_STRATEGY_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'dashboard-ready-strategy-review-report',
);
export const SERIALIZATION_READY_STRATEGY_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'serialization-ready-strategy-review-report',
);
export const SAFETY_BOUNDARY_STRATEGY_REVIEW_REPORT_FIXTURE = buildFixtureOrThrow(
  'safety-boundary-strategy-review-report',
);

export const PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES: ReadonlyMap<
  StrategyReviewReportFixtureName,
  StrategyReviewReportFixture
> = new Map([
  ['defensive-vs-aggressive-review-report', DEFENSIVE_VS_AGGRESSIVE_REVIEW_REPORT_FIXTURE],
  ['creator-led-review-report', CREATOR_LED_REVIEW_REPORT_FIXTURE],
  ['wallet-led-review-report', WALLET_LED_REVIEW_REPORT_FIXTURE],
  ['manipulation-avoidance-review-report', MANIPULATION_AVOIDANCE_REVIEW_REPORT_FIXTURE],
  ['no-action-safety-review-report', NO_ACTION_SAFETY_REVIEW_REPORT_FIXTURE],
  ['insufficient-data-review-report', INSUFFICIENT_DATA_REVIEW_REPORT_FIXTURE],
  ['high-score-positive-review-report', HIGH_SCORE_POSITIVE_REVIEW_REPORT_FIXTURE],
  ['high-score-false-positive-review-report', HIGH_SCORE_FALSE_POSITIVE_REVIEW_REPORT_FIXTURE],
  ['missed-opportunity-review-report', MISSED_OPPORTUNITY_REVIEW_REPORT_FIXTURE],
  ['drawdown-contained-review-report', DRAWDOWN_CONTAINED_REVIEW_REPORT_FIXTURE],
  ['mixed-signal-watchlist-review-report', MIXED_SIGNAL_WATCHLIST_REVIEW_REPORT_FIXTURE],
  ['false-positive-protection-review-report', FALSE_POSITIVE_PROTECTION_REVIEW_REPORT_FIXTURE],
  ['malformed-input-safe-review-report', MALFORMED_INPUT_SAFE_REVIEW_REPORT_FIXTURE],
  ['dashboard-ready-strategy-review-report', DASHBOARD_READY_STRATEGY_REVIEW_REPORT_FIXTURE],
  ['serialization-ready-strategy-review-report', SERIALIZATION_READY_STRATEGY_REVIEW_REPORT_FIXTURE],
  ['safety-boundary-strategy-review-report', SAFETY_BOUNDARY_STRATEGY_REVIEW_REPORT_FIXTURE],
]);

export function listStrategyReviewReportFixtures(): readonly StrategyReviewReportFixtureName[] {
  return [...STRATEGY_REVIEW_REPORT_FIXTURE_NAMES].sort((a, b) => a.localeCompare(b));
}

export function getStrategyReviewReportFixture(
  name: StrategyReviewReportFixtureName,
): StrategyReviewReportFixture | undefined {
  return PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES.get(name);
}
