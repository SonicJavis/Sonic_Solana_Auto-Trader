/**
 * Phase 43 — Strategy Review Report Export Planning Fixtures v1: fixtures.
 *
 * 16 deterministic synthetic export-planning fixtures for Phase 42 serialization previews.
 */

import {
  buildStrategyReviewExportPlanFixture,
  EXPORT_PLAN_NAME_TO_KIND,
  EXPORT_PLAN_NAME_TO_PREVIEW,
  EXPORT_PLAN_NAME_TO_TARGET,
} from './builders.js';
import type {
  StrategyReviewExportPlanFixture,
  StrategyReviewExportPlanFixtureName,
} from './types.js';
import { STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES } from './types.js';

function buildFixtureOrThrow(name: StrategyReviewExportPlanFixtureName): StrategyReviewExportPlanFixture {
  const result = buildStrategyReviewExportPlanFixture({
    name,
    kind: EXPORT_PLAN_NAME_TO_KIND[name],
    targetFormat: EXPORT_PLAN_NAME_TO_TARGET[name],
    sourcePreviewFixtureName: EXPORT_PLAN_NAME_TO_PREVIEW[name],
  });
  if (!result.fixture) {
    throw new Error(`Failed to build Phase 43 export planning fixture: ${name}`);
  }
  return result.fixture;
}

export const JSON_EXPORT_PLAN_DISABLED_FIXTURE = buildFixtureOrThrow('json-export-plan-disabled');
export const MARKDOWN_EXPORT_PLAN_DISABLED_FIXTURE = buildFixtureOrThrow(
  'markdown-export-plan-disabled',
);
export const TEXT_EXPORT_PLAN_DISABLED_FIXTURE = buildFixtureOrThrow('text-export-plan-disabled');
export const METADATA_EXPORT_PLAN_DISABLED_FIXTURE = buildFixtureOrThrow(
  'metadata-export-plan-disabled',
);
export const DEFENSIVE_VS_AGGRESSIVE_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'defensive-vs-aggressive-export-plan',
);
export const CREATOR_LED_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow('creator-led-export-plan');
export const WALLET_LED_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow('wallet-led-export-plan');
export const MANIPULATION_AVOIDANCE_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'manipulation-avoidance-export-plan',
);
export const NO_ACTION_SAFETY_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'no-action-safety-export-plan',
);
export const INSUFFICIENT_DATA_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'insufficient-data-export-plan',
);
export const HIGH_SCORE_POSITIVE_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'high-score-positive-export-plan',
);
export const MIXED_SIGNAL_WATCHLIST_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'mixed-signal-watchlist-export-plan',
);
export const MALFORMED_INPUT_SAFE_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'malformed-input-safe-export-plan',
);
export const DASHBOARD_READY_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow('dashboard-ready-export-plan');
export const REPORT_READY_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow('report-ready-export-plan');
export const SAFETY_BOUNDARY_EXPORT_PLAN_FIXTURE = buildFixtureOrThrow(
  'safety-boundary-export-plan',
);

export const PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES: ReadonlyMap<
  StrategyReviewExportPlanFixtureName,
  StrategyReviewExportPlanFixture
> = new Map([
  ['json-export-plan-disabled', JSON_EXPORT_PLAN_DISABLED_FIXTURE],
  ['markdown-export-plan-disabled', MARKDOWN_EXPORT_PLAN_DISABLED_FIXTURE],
  ['text-export-plan-disabled', TEXT_EXPORT_PLAN_DISABLED_FIXTURE],
  ['metadata-export-plan-disabled', METADATA_EXPORT_PLAN_DISABLED_FIXTURE],
  ['defensive-vs-aggressive-export-plan', DEFENSIVE_VS_AGGRESSIVE_EXPORT_PLAN_FIXTURE],
  ['creator-led-export-plan', CREATOR_LED_EXPORT_PLAN_FIXTURE],
  ['wallet-led-export-plan', WALLET_LED_EXPORT_PLAN_FIXTURE],
  ['manipulation-avoidance-export-plan', MANIPULATION_AVOIDANCE_EXPORT_PLAN_FIXTURE],
  ['no-action-safety-export-plan', NO_ACTION_SAFETY_EXPORT_PLAN_FIXTURE],
  ['insufficient-data-export-plan', INSUFFICIENT_DATA_EXPORT_PLAN_FIXTURE],
  ['high-score-positive-export-plan', HIGH_SCORE_POSITIVE_EXPORT_PLAN_FIXTURE],
  ['mixed-signal-watchlist-export-plan', MIXED_SIGNAL_WATCHLIST_EXPORT_PLAN_FIXTURE],
  ['malformed-input-safe-export-plan', MALFORMED_INPUT_SAFE_EXPORT_PLAN_FIXTURE],
  ['dashboard-ready-export-plan', DASHBOARD_READY_EXPORT_PLAN_FIXTURE],
  ['report-ready-export-plan', REPORT_READY_EXPORT_PLAN_FIXTURE],
  ['safety-boundary-export-plan', SAFETY_BOUNDARY_EXPORT_PLAN_FIXTURE],
]);

export const PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST: readonly StrategyReviewExportPlanFixture[] =
  [...STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES].map(name => {
    const fixture = PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES.get(name);
    if (!fixture) {
      throw new Error(`Missing Phase 43 export planning fixture: ${name}`);
    }
    return fixture;
  });
