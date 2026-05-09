/**
 * Phase 44 — Strategy Review Export Queue Fixtures v1: fixtures.
 *
 * 16 deterministic synthetic export-queue fixtures based on Phase 43 export plans.
 */

import {
  buildStrategyReviewExportQueueFixture,
  EXPORT_QUEUE_NAME_TO_KIND,
  EXPORT_QUEUE_NAME_TO_PLAN,
  EXPORT_QUEUE_NAME_TO_PRIORITY,
  EXPORT_QUEUE_NAME_TO_STATE,
} from './builders.js';
import type {
  StrategyReviewExportQueueFixture,
  StrategyReviewExportQueueFixtureName,
} from './types.js';
import { STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES } from './types.js';

function buildFixtureOrThrow(name: StrategyReviewExportQueueFixtureName): StrategyReviewExportQueueFixture {
  const result = buildStrategyReviewExportQueueFixture({
    name,
    kind: EXPORT_QUEUE_NAME_TO_KIND[name],
    state: EXPORT_QUEUE_NAME_TO_STATE[name],
    priority: EXPORT_QUEUE_NAME_TO_PRIORITY[name],
    sourcePlanFixtureName: EXPORT_QUEUE_NAME_TO_PLAN[name],
  });
  if (!result.fixture) {
    throw new Error(`Failed to build Phase 44 export queue fixture: ${name}`);
  }
  return result.fixture;
}

export const DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'defensive-vs-aggressive-export-queued',
);
export const CREATOR_LED_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow('creator-led-export-queued');
export const WALLET_LED_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow('wallet-led-export-queued');
export const MANIPULATION_AVOIDANCE_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'manipulation-avoidance-export-queued',
);
export const NO_ACTION_SAFETY_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'no-action-safety-export-queued',
);
export const INSUFFICIENT_DATA_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'insufficient-data-export-queued',
);
export const HIGH_SCORE_POSITIVE_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'high-score-positive-export-queued',
);
export const HIGH_SCORE_FALSE_POSITIVE_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'high-score-false-positive-export-queued',
);
export const MISSED_OPPORTUNITY_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'missed-opportunity-export-queued',
);
export const DRAWDOWN_CONTAINED_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'drawdown-contained-export-queued',
);
export const MIXED_SIGNAL_WATCHLIST_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'mixed-signal-watchlist-export-queued',
);
export const FALSE_POSITIVE_PROTECTION_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'false-positive-protection-export-queued',
);
export const MALFORMED_INPUT_SAFE_EXPORT_QUEUED_FIXTURE = buildFixtureOrThrow(
  'malformed-input-safe-export-queued',
);
export const DASHBOARD_READY_EXPORT_QUEUE_FIXTURE = buildFixtureOrThrow('dashboard-ready-export-queue');
export const SERIALIZATION_READY_EXPORT_QUEUE_FIXTURE = buildFixtureOrThrow(
  'serialization-ready-export-queue',
);
export const SAFETY_BOUNDARY_EXPORT_QUEUE_FIXTURE = buildFixtureOrThrow('safety-boundary-export-queue');

export const PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES: ReadonlyMap<
  StrategyReviewExportQueueFixtureName,
  StrategyReviewExportQueueFixture
> = new Map([
  ['defensive-vs-aggressive-export-queued', DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE],
  ['creator-led-export-queued', CREATOR_LED_EXPORT_QUEUED_FIXTURE],
  ['wallet-led-export-queued', WALLET_LED_EXPORT_QUEUED_FIXTURE],
  ['manipulation-avoidance-export-queued', MANIPULATION_AVOIDANCE_EXPORT_QUEUED_FIXTURE],
  ['no-action-safety-export-queued', NO_ACTION_SAFETY_EXPORT_QUEUED_FIXTURE],
  ['insufficient-data-export-queued', INSUFFICIENT_DATA_EXPORT_QUEUED_FIXTURE],
  ['high-score-positive-export-queued', HIGH_SCORE_POSITIVE_EXPORT_QUEUED_FIXTURE],
  ['high-score-false-positive-export-queued', HIGH_SCORE_FALSE_POSITIVE_EXPORT_QUEUED_FIXTURE],
  ['missed-opportunity-export-queued', MISSED_OPPORTUNITY_EXPORT_QUEUED_FIXTURE],
  ['drawdown-contained-export-queued', DRAWDOWN_CONTAINED_EXPORT_QUEUED_FIXTURE],
  ['mixed-signal-watchlist-export-queued', MIXED_SIGNAL_WATCHLIST_EXPORT_QUEUED_FIXTURE],
  ['false-positive-protection-export-queued', FALSE_POSITIVE_PROTECTION_EXPORT_QUEUED_FIXTURE],
  ['malformed-input-safe-export-queued', MALFORMED_INPUT_SAFE_EXPORT_QUEUED_FIXTURE],
  ['dashboard-ready-export-queue', DASHBOARD_READY_EXPORT_QUEUE_FIXTURE],
  ['serialization-ready-export-queue', SERIALIZATION_READY_EXPORT_QUEUE_FIXTURE],
  ['safety-boundary-export-queue', SAFETY_BOUNDARY_EXPORT_QUEUE_FIXTURE],
]);

export const PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST: readonly StrategyReviewExportQueueFixture[] =
  [...STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES].map(name => {
    const fixture = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES.get(name);
    if (!fixture) {
      throw new Error(`Missing Phase 44 export queue fixture: ${name}`);
    }
    return fixture;
  });
