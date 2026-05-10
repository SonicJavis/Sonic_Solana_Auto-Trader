/**
 * Phase 45 — Strategy Review Export Audit Fixtures v1: fixtures.
 *
 * 16 deterministic synthetic export-audit fixtures based on Phase 44 export queues.
 */

import {
  buildStrategyReviewExportAuditFixture,
  EXPORT_AUDIT_NAME_TO_KIND,
  EXPORT_AUDIT_NAME_TO_QUEUE,
  EXPORT_AUDIT_NAME_TO_SEVERITY,
  EXPORT_AUDIT_NAME_TO_STATE,
} from './builders.js';
import type {
  StrategyReviewExportAuditFixture,
  StrategyReviewExportAuditFixtureName,
} from './types.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES } from './types.js';

function buildFixtureOrThrow(name: StrategyReviewExportAuditFixtureName): StrategyReviewExportAuditFixture {
  const result = buildStrategyReviewExportAuditFixture({
    name,
    kind: EXPORT_AUDIT_NAME_TO_KIND[name],
    state: EXPORT_AUDIT_NAME_TO_STATE[name],
    severity: EXPORT_AUDIT_NAME_TO_SEVERITY[name],
    sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE[name],
  });
  if (!result.fixture) {
    throw new Error(`Failed to build Phase 45 export audit fixture: ${name}`);
  }
  return result.fixture;
}

export const DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'defensive-vs-aggressive-export-audited',
);
export const CREATOR_LED_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow('creator-led-export-audited');
export const WALLET_LED_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow('wallet-led-export-audited');
export const MANIPULATION_AVOIDANCE_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'manipulation-avoidance-export-audited',
);
export const NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'no-action-safety-export-audited',
);
export const INSUFFICIENT_DATA_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'insufficient-data-export-audited',
);
export const HIGH_SCORE_POSITIVE_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'high-score-positive-export-audited',
);
export const HIGH_SCORE_FALSE_POSITIVE_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'high-score-false-positive-export-audited',
);
export const MISSED_OPPORTUNITY_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'missed-opportunity-export-audited',
);
export const DRAWDOWN_CONTAINED_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'drawdown-contained-export-audited',
);
export const MIXED_SIGNAL_WATCHLIST_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'mixed-signal-watchlist-export-audited',
);
export const FALSE_POSITIVE_PROTECTION_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'false-positive-protection-export-audited',
);
export const MALFORMED_INPUT_SAFE_EXPORT_AUDITED_FIXTURE = buildFixtureOrThrow(
  'malformed-input-safe-export-audited',
);
export const DASHBOARD_READY_EXPORT_AUDIT_FIXTURE = buildFixtureOrThrow(
  'dashboard-ready-export-audit',
);
export const SERIALIZATION_READY_EXPORT_AUDIT_FIXTURE = buildFixtureOrThrow(
  'serialization-ready-export-audit',
);
export const SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE = buildFixtureOrThrow(
  'safety-boundary-export-audit',
);

export const PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES: ReadonlyMap<
  StrategyReviewExportAuditFixtureName,
  StrategyReviewExportAuditFixture
> = new Map([
  ['defensive-vs-aggressive-export-audited', DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE],
  ['creator-led-export-audited', CREATOR_LED_EXPORT_AUDITED_FIXTURE],
  ['wallet-led-export-audited', WALLET_LED_EXPORT_AUDITED_FIXTURE],
  ['manipulation-avoidance-export-audited', MANIPULATION_AVOIDANCE_EXPORT_AUDITED_FIXTURE],
  ['no-action-safety-export-audited', NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE],
  ['insufficient-data-export-audited', INSUFFICIENT_DATA_EXPORT_AUDITED_FIXTURE],
  ['high-score-positive-export-audited', HIGH_SCORE_POSITIVE_EXPORT_AUDITED_FIXTURE],
  ['high-score-false-positive-export-audited', HIGH_SCORE_FALSE_POSITIVE_EXPORT_AUDITED_FIXTURE],
  ['missed-opportunity-export-audited', MISSED_OPPORTUNITY_EXPORT_AUDITED_FIXTURE],
  ['drawdown-contained-export-audited', DRAWDOWN_CONTAINED_EXPORT_AUDITED_FIXTURE],
  ['mixed-signal-watchlist-export-audited', MIXED_SIGNAL_WATCHLIST_EXPORT_AUDITED_FIXTURE],
  ['false-positive-protection-export-audited', FALSE_POSITIVE_PROTECTION_EXPORT_AUDITED_FIXTURE],
  ['malformed-input-safe-export-audited', MALFORMED_INPUT_SAFE_EXPORT_AUDITED_FIXTURE],
  ['dashboard-ready-export-audit', DASHBOARD_READY_EXPORT_AUDIT_FIXTURE],
  ['serialization-ready-export-audit', SERIALIZATION_READY_EXPORT_AUDIT_FIXTURE],
  ['safety-boundary-export-audit', SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE],
]);

export const PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST: readonly StrategyReviewExportAuditFixture[] =
  [...STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES].map(name => {
    const fixture = PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.get(name);
    if (!fixture) {
      throw new Error(`Missing Phase 45 export audit fixture in list: ${name}`);
    }
    return fixture;
  });
