/**
 * Phase 42 — Strategy Review Serialization Preview Fixtures v1: fixtures.
 *
 * 16 deterministic synthetic preview fixtures for Phase 41 strategy review reports.
 */

import {
  buildStrategyReviewSerializationPreviewFixture,
  SERIALIZATION_NAME_TO_FORMAT,
  SERIALIZATION_NAME_TO_KIND,
  SERIALIZATION_NAME_TO_REPORT,
} from './builders.js';
import type {
  StrategyReviewSerializationPreviewFixture,
  StrategyReviewSerializationPreviewFixtureName,
} from './types.js';
import { STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES } from './types.js';

function buildFixtureOrThrow(
  name: StrategyReviewSerializationPreviewFixtureName,
): StrategyReviewSerializationPreviewFixture {
  const result = buildStrategyReviewSerializationPreviewFixture({
    name,
    kind: SERIALIZATION_NAME_TO_KIND[name],
    format: SERIALIZATION_NAME_TO_FORMAT[name],
    sourceReportFixtureName: SERIALIZATION_NAME_TO_REPORT[name],
  });
  if (!result.fixture) {
    throw new Error(`Failed to build Phase 42 serialization preview fixture: ${name}`);
  }
  return result.fixture;
}

export const DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'defensive-vs-aggressive-json-preview',
);
export const CREATOR_LED_MARKDOWN_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'creator-led-markdown-preview',
);
export const WALLET_LED_TEXT_PREVIEW_FIXTURE = buildFixtureOrThrow('wallet-led-text-preview');
export const MANIPULATION_AVOIDANCE_METADATA_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'manipulation-avoidance-metadata-preview',
);
export const NO_ACTION_SAFETY_JSON_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'no-action-safety-json-preview',
);
export const INSUFFICIENT_DATA_MARKDOWN_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'insufficient-data-markdown-preview',
);
export const HIGH_SCORE_POSITIVE_TEXT_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'high-score-positive-text-preview',
);
export const HIGH_SCORE_FALSE_POSITIVE_METADATA_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'high-score-false-positive-metadata-preview',
);
export const MISSED_OPPORTUNITY_JSON_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'missed-opportunity-json-preview',
);
export const DRAWDOWN_CONTAINED_MARKDOWN_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'drawdown-contained-markdown-preview',
);
export const MIXED_SIGNAL_WATCHLIST_TEXT_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'mixed-signal-watchlist-text-preview',
);
export const FALSE_POSITIVE_PROTECTION_METADATA_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'false-positive-protection-metadata-preview',
);
export const MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'malformed-input-safe-preview',
);
export const DASHBOARD_READY_SERIALIZATION_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'dashboard-ready-serialization-preview',
);
export const REPORT_READY_SERIALIZATION_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'report-ready-serialization-preview',
);
export const SAFETY_BOUNDARY_SERIALIZATION_PREVIEW_FIXTURE = buildFixtureOrThrow(
  'safety-boundary-serialization-preview',
);

export const PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES: ReadonlyMap<
  StrategyReviewSerializationPreviewFixtureName,
  StrategyReviewSerializationPreviewFixture
> = new Map([
  ['defensive-vs-aggressive-json-preview', DEFENSIVE_VS_AGGRESSIVE_JSON_PREVIEW_FIXTURE],
  ['creator-led-markdown-preview', CREATOR_LED_MARKDOWN_PREVIEW_FIXTURE],
  ['wallet-led-text-preview', WALLET_LED_TEXT_PREVIEW_FIXTURE],
  ['manipulation-avoidance-metadata-preview', MANIPULATION_AVOIDANCE_METADATA_PREVIEW_FIXTURE],
  ['no-action-safety-json-preview', NO_ACTION_SAFETY_JSON_PREVIEW_FIXTURE],
  ['insufficient-data-markdown-preview', INSUFFICIENT_DATA_MARKDOWN_PREVIEW_FIXTURE],
  ['high-score-positive-text-preview', HIGH_SCORE_POSITIVE_TEXT_PREVIEW_FIXTURE],
  [
    'high-score-false-positive-metadata-preview',
    HIGH_SCORE_FALSE_POSITIVE_METADATA_PREVIEW_FIXTURE,
  ],
  ['missed-opportunity-json-preview', MISSED_OPPORTUNITY_JSON_PREVIEW_FIXTURE],
  ['drawdown-contained-markdown-preview', DRAWDOWN_CONTAINED_MARKDOWN_PREVIEW_FIXTURE],
  ['mixed-signal-watchlist-text-preview', MIXED_SIGNAL_WATCHLIST_TEXT_PREVIEW_FIXTURE],
  [
    'false-positive-protection-metadata-preview',
    FALSE_POSITIVE_PROTECTION_METADATA_PREVIEW_FIXTURE,
  ],
  ['malformed-input-safe-preview', MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE],
  ['dashboard-ready-serialization-preview', DASHBOARD_READY_SERIALIZATION_PREVIEW_FIXTURE],
  ['report-ready-serialization-preview', REPORT_READY_SERIALIZATION_PREVIEW_FIXTURE],
  ['safety-boundary-serialization-preview', SAFETY_BOUNDARY_SERIALIZATION_PREVIEW_FIXTURE],
]);

export const PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_LIST: readonly StrategyReviewSerializationPreviewFixture[] =
  [...STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES].map(name => {
    const fixture = PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES.get(name);
    if (!fixture) throw new Error(`Missing Phase 42 serialization preview fixture: ${name}`);
    return fixture;
  });
