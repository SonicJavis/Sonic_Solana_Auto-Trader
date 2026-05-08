import { buildStrategyReviewDashboardFixture, NAME_TO_KIND } from './builders.js';
import type {
  StrategyReviewDashboardFixture,
  StrategyReviewDashboardFixtureName,
} from './types.js';
import { STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES } from './types.js';

function buildFixtureOrThrow(name: StrategyReviewDashboardFixtureName): StrategyReviewDashboardFixture {
  const result = buildStrategyReviewDashboardFixture({ name, kind: NAME_TO_KIND[name] });
  if (!result.fixture) {
    throw new Error(`Failed to build Phase 40 fixture: ${name}`);
  }
  return result.fixture;
}

export const DEFENSIVE_VS_AGGRESSIVE_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'defensive-vs-aggressive-review-dashboard',
);
export const CREATOR_LED_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow('creator-led-review-dashboard');
export const WALLET_LED_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow('wallet-led-review-dashboard');
export const MANIPULATION_AVOIDANCE_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'manipulation-avoidance-review-dashboard',
);
export const NO_ACTION_SAFETY_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'no-action-safety-review-dashboard',
);
export const INSUFFICIENT_DATA_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'insufficient-data-review-dashboard',
);
export const HIGH_SCORE_POSITIVE_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'high-score-positive-review-dashboard',
);
export const HIGH_SCORE_FALSE_POSITIVE_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'high-score-false-positive-review-dashboard',
);
export const MISSED_OPPORTUNITY_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'missed-opportunity-review-dashboard',
);
export const DRAWDOWN_CONTAINED_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'drawdown-contained-review-dashboard',
);
export const MIXED_SIGNAL_WATCHLIST_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'mixed-signal-watchlist-review-dashboard',
);
export const FALSE_POSITIVE_PROTECTION_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'false-positive-protection-review-dashboard',
);
export const MALFORMED_INPUT_SAFE_REVIEW_DASHBOARD_FIXTURE = buildFixtureOrThrow(
  'malformed-input-safe-review-dashboard',
);
export const DASHBOARD_READY_STRATEGY_REVIEW_FIXTURE = buildFixtureOrThrow(
  'dashboard-ready-strategy-review',
);
export const REPORT_READY_STRATEGY_REVIEW_FIXTURE = buildFixtureOrThrow('report-ready-strategy-review');
export const SAFETY_BOUNDARY_STRATEGY_REVIEW_FIXTURE = buildFixtureOrThrow(
  'safety-boundary-strategy-review',
);

export const PHASE_40_STRATEGY_REVIEW_DASHBOARD_FIXTURES: ReadonlyMap<
  StrategyReviewDashboardFixtureName,
  StrategyReviewDashboardFixture
> = new Map([
  ['defensive-vs-aggressive-review-dashboard', DEFENSIVE_VS_AGGRESSIVE_REVIEW_DASHBOARD_FIXTURE],
  ['creator-led-review-dashboard', CREATOR_LED_REVIEW_DASHBOARD_FIXTURE],
  ['wallet-led-review-dashboard', WALLET_LED_REVIEW_DASHBOARD_FIXTURE],
  ['manipulation-avoidance-review-dashboard', MANIPULATION_AVOIDANCE_REVIEW_DASHBOARD_FIXTURE],
  ['no-action-safety-review-dashboard', NO_ACTION_SAFETY_REVIEW_DASHBOARD_FIXTURE],
  ['insufficient-data-review-dashboard', INSUFFICIENT_DATA_REVIEW_DASHBOARD_FIXTURE],
  ['high-score-positive-review-dashboard', HIGH_SCORE_POSITIVE_REVIEW_DASHBOARD_FIXTURE],
  ['high-score-false-positive-review-dashboard', HIGH_SCORE_FALSE_POSITIVE_REVIEW_DASHBOARD_FIXTURE],
  ['missed-opportunity-review-dashboard', MISSED_OPPORTUNITY_REVIEW_DASHBOARD_FIXTURE],
  ['drawdown-contained-review-dashboard', DRAWDOWN_CONTAINED_REVIEW_DASHBOARD_FIXTURE],
  ['mixed-signal-watchlist-review-dashboard', MIXED_SIGNAL_WATCHLIST_REVIEW_DASHBOARD_FIXTURE],
  [
    'false-positive-protection-review-dashboard',
    FALSE_POSITIVE_PROTECTION_REVIEW_DASHBOARD_FIXTURE,
  ],
  ['malformed-input-safe-review-dashboard', MALFORMED_INPUT_SAFE_REVIEW_DASHBOARD_FIXTURE],
  ['dashboard-ready-strategy-review', DASHBOARD_READY_STRATEGY_REVIEW_FIXTURE],
  ['report-ready-strategy-review', REPORT_READY_STRATEGY_REVIEW_FIXTURE],
  ['safety-boundary-strategy-review', SAFETY_BOUNDARY_STRATEGY_REVIEW_FIXTURE],
]);

export function listStrategyReviewDashboardFixtures(): readonly StrategyReviewDashboardFixtureName[] {
  return [...STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES];
}

export function getStrategyReviewDashboardFixture(
  name: StrategyReviewDashboardFixtureName,
): StrategyReviewDashboardFixture | undefined {
  return PHASE_40_STRATEGY_REVIEW_DASHBOARD_FIXTURES.get(name);
}
