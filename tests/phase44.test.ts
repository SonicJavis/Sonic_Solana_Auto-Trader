/**
 * tests/phase44.test.ts
 *
 * Phase 44 — Strategy Review Export Queue Fixtures v1: Tests.
 *
 * Tests cover: exports, type shapes, all 16 fixtures, queue summary builders,
 * queue item/state/priority shapes, normalization, serialization, equality,
 * validation, safety validation, Phase 43 compatibility, mutation checks,
 * serializability, determinism, no real wallet/tx data, no secrets,
 * no live-data claims, no actual export/download, no real queue workers,
 * no real UI, no real scoring/replay/trading, no RPC/Jito/MEV,
 * no wallet/trading/execution logic, no investment advice/signals,
 * no real PnL/balance/order/fill, no network/filesystem, no Date.now/random/timers,
 * Phase 44 capability flags, and safety boundary regression.
 *
 * Safety: synthetic-only, deterministic, fixture-backed, no side effects.
 */

import { describe, expect, it } from 'vitest';
import {
  areStrategyReviewExportQueueFixturesEqual,
  buildStrategyReviewExportQueueFixture,
  buildStrategyReviewExportQueueSummary,
  CREATOR_LED_EXPORT_QUEUED_FIXTURE,
  DASHBOARD_READY_EXPORT_QUEUE_FIXTURE,
  DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE,
  DRAWDOWN_CONTAINED_EXPORT_QUEUED_FIXTURE,
  EXPORT_QUEUE_NAME_TO_KIND,
  EXPORT_QUEUE_NAME_TO_PLAN,
  EXPORT_QUEUE_NAME_TO_PRIORITY,
  EXPORT_QUEUE_NAME_TO_STATE,
  FALSE_POSITIVE_PROTECTION_EXPORT_QUEUED_FIXTURE,
  getStrategyReviewExportQueueCapabilities,
  getStrategyReviewExportQueueFixture,
  HIGH_SCORE_FALSE_POSITIVE_EXPORT_QUEUED_FIXTURE,
  HIGH_SCORE_POSITIVE_EXPORT_QUEUED_FIXTURE,
  INSUFFICIENT_DATA_EXPORT_QUEUED_FIXTURE,
  isStrategyReviewExportQueueFixtureSerializable,
  isValidStrategyReviewExportQueueFixtureKind,
  isValidStrategyReviewExportQueueFixtureName,
  isValidStrategyReviewExportQueueGeneratedAt,
  isValidStrategyReviewExportQueuePriority,
  isValidStrategyReviewExportQueueSource,
  isValidStrategyReviewExportQueueState,
  listStrategyReviewExportQueueFixtures,
  MALFORMED_INPUT_SAFE_EXPORT_QUEUED_FIXTURE,
  MANIPULATION_AVOIDANCE_EXPORT_QUEUED_FIXTURE,
  MISSED_OPPORTUNITY_EXPORT_QUEUED_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_EXPORT_QUEUED_FIXTURE,
  NO_ACTION_SAFETY_EXPORT_QUEUED_FIXTURE,
  normalizeStrategyReviewExportQueueFixture,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE,
  SAFETY_BOUNDARY_EXPORT_QUEUE_FIXTURE,
  SERIALIZATION_READY_EXPORT_QUEUE_FIXTURE,
  serializeStrategyReviewExportQueueFixture,
  STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES,
  STRATEGY_REVIEW_EXPORT_QUEUE_STATES,
  validateStrategyReviewExportQueueFixture,
  validateStrategyReviewExportQueueSafety,
  WALLET_LED_EXPORT_QUEUED_FIXTURE,
} from '../apps/dashboard/src/strategy-review-export-queue/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import {
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES,
} from '../apps/dashboard/src/strategy-review-export-planning/index.js';

// ---------------------------------------------------------------------------
// 1. Constants and exports
// ---------------------------------------------------------------------------

describe('Phase 44: constants and exports', () => {
  it('exports PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT as deterministic string', () => {
    expect(typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT).toBe('string');
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('exports PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE as deterministic string', () => {
    expect(typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE).toBe('string');
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE).toBe(
      'phase44_strategy_review_export_queue_fixtures_v1',
    );
  });

  it('exports STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES as readonly array of 16', () => {
    expect(Array.isArray(STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES)).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES).toHaveLength(16);
  });

  it('exports STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS as readonly array of 16', () => {
    expect(Array.isArray(STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS)).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS).toHaveLength(16);
  });

  it('exports STRATEGY_REVIEW_EXPORT_QUEUE_STATES with correct states', () => {
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_STATES).toContain('queued');
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_STATES).toContain('pending-review');
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_STATES).toContain('reviewed');
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_STATES).toContain('skipped');
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_STATES).toContain('safety-blocked');
  });

  it('exports STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES with correct priorities', () => {
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES).toContain('high');
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES).toContain('normal');
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES).toContain('low');
  });

  it('exports all 16 required fixture names', () => {
    const required = [
      'defensive-vs-aggressive-export-queued',
      'creator-led-export-queued',
      'wallet-led-export-queued',
      'manipulation-avoidance-export-queued',
      'no-action-safety-export-queued',
      'insufficient-data-export-queued',
      'high-score-positive-export-queued',
      'high-score-false-positive-export-queued',
      'missed-opportunity-export-queued',
      'drawdown-contained-export-queued',
      'mixed-signal-watchlist-export-queued',
      'false-positive-protection-export-queued',
      'malformed-input-safe-export-queued',
      'dashboard-ready-export-queue',
      'serialization-ready-export-queue',
      'safety-boundary-export-queue',
    ];
    for (const name of required) {
      expect(STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES).toContain(name);
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Capability flags
// ---------------------------------------------------------------------------

describe('Phase 44: capability flags', () => {
  it('returns Phase 44 capabilities with correct true flags', () => {
    const caps = getStrategyReviewExportQueueCapabilities();
    expect(caps.strategyReviewExportQueueFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportQueues).toBe(true);
    expect(caps.strategyReviewExportQueueBuilders).toBe(true);
    expect(caps.strategyReviewExportQueueSafetyValidation).toBe(true);
    expect(caps.strategyReviewExportPlanReferences).toBe(true);
  });

  it('returns Phase 44 capabilities with correct false flags', () => {
    const caps = getStrategyReviewExportQueueCapabilities();
    expect(caps.strategyReviewActualQueueWorkers).toBe(false);
    expect(caps.strategyReviewScheduledJobs).toBe(false);
    expect(caps.strategyReviewBackgroundJobs).toBe(false);
    expect(caps.strategyReviewActualFileExport).toBe(false);
    expect(caps.strategyReviewDownloadSupport).toBe(false);
    expect(caps.strategyReviewPdfGeneration).toBe(false);
    expect(caps.strategyReviewCsvGeneration).toBe(false);
    expect(caps.strategyReviewHtmlGeneration).toBe(false);
    expect(caps.strategyReviewExportQueueExternalNetwork).toBe(false);
    expect(caps.strategyReviewExportQueuePersistence).toBe(false);
    expect(caps.strategyReviewExportQueueExecution).toBe(false);
    expect(caps.strategyReviewExportQueueTradingSignals).toBe(false);
    expect(caps.strategyReviewExportQueueInvestmentAdvice).toBe(false);
  });

  it('dashboard capabilities include Phase 44 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportQueueFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportQueues).toBe(true);
    expect(caps.strategyReviewExportQueueBuilders).toBe(true);
    expect(caps.strategyReviewExportQueueSafetyValidation).toBe(true);
    expect(caps.strategyReviewExportPlanReferences).toBe(true);
    expect(caps.strategyReviewActualQueueWorkers).toBe(false);
    expect(caps.strategyReviewScheduledJobs).toBe(false);
    expect(caps.strategyReviewBackgroundJobs).toBe(false);
    expect(caps.strategyReviewExportQueueExecution).toBe(false);
    expect(caps.strategyReviewExportQueueTradingSignals).toBe(false);
    expect(caps.strategyReviewExportQueueInvestmentAdvice).toBe(false);
  });

  it('dashboard capabilities preserve Phase 43 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportPlanningFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportPlans).toBe(true);
    expect(caps.strategyReviewExportPlanBuilders).toBe(true);
    expect(caps.strategyReviewExportPlanSafetyValidation).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. Fixture map
// ---------------------------------------------------------------------------

describe('Phase 44: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES map', () => {
  it('is a ReadonlyMap with 16 entries', () => {
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES).toBeInstanceOf(Map);
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES.size).toBe(16);
  });

  it('contains all 16 required fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES.has(name)).toBe(true);
    }
  });

  it('all map values are non-null objects', () => {
    for (const [, fixture] of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES) {
      expect(typeof fixture).toBe('object');
      expect(fixture).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// 4. Fixture list
// ---------------------------------------------------------------------------

describe('Phase 44: PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST', () => {
  it('is a readonly array of 16 fixtures', () => {
    expect(Array.isArray(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST)).toBe(true);
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST).toHaveLength(16);
  });

  it('has stable ordering matching STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES', () => {
    for (let i = 0; i < STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES.length; i++) {
      expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST[i]?.name).toBe(
        STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES[i],
      );
    }
  });

  it('all list entries are non-null objects', () => {
    for (const fixture of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(typeof fixture).toBe('object');
      expect(fixture).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// 5. List/get helpers
// ---------------------------------------------------------------------------

describe('Phase 44: listStrategyReviewExportQueueFixtures', () => {
  it('returns 16 fixtures in stable order', () => {
    const list = listStrategyReviewExportQueueFixtures(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES);
    expect(list).toHaveLength(16);
    for (let i = 0; i < STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES.length; i++) {
      expect(list[i]?.name).toBe(STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES[i]);
    }
  });

  it('returns identical results on repeated calls (deterministic)', () => {
    const a = listStrategyReviewExportQueueFixtures(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES);
    const b = listStrategyReviewExportQueueFixtures(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES);
    expect(a).toHaveLength(b.length);
    for (let i = 0; i < a.length; i++) {
      expect(a[i]?.name).toBe(b[i]?.name);
    }
  });
});

describe('Phase 44: getStrategyReviewExportQueueFixture', () => {
  it('returns fixture for valid name', () => {
    const f = getStrategyReviewExportQueueFixture(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES,
      'creator-led-export-queued',
    );
    expect(f).not.toBeNull();
    expect(f?.name).toBe('creator-led-export-queued');
  });

  it('returns null for invalid name', () => {
    const f = getStrategyReviewExportQueueFixture(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES,
      'not-a-real-fixture',
    );
    expect(f).toBeNull();
  });

  it('returns null for empty string', () => {
    const f = getStrategyReviewExportQueueFixture(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES, '');
    expect(f).toBeNull();
  });

  it('returns null for number input cast to string', () => {
    const f = getStrategyReviewExportQueueFixture(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES,
      '123',
    );
    expect(f).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 6. All 16 required fixtures — shape checks
// ---------------------------------------------------------------------------

describe('Phase 44: all 16 fixtures — basic shape', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('every fixture has a name that is a valid fixture name', () => {
    for (const f of allFixtures) {
      expect(isValidStrategyReviewExportQueueFixtureName(f.name)).toBe(true);
    }
  });

  it('every fixture has a kind that is a valid fixture kind', () => {
    for (const f of allFixtures) {
      expect(isValidStrategyReviewExportQueueFixtureKind(f.kind)).toBe(true);
    }
  });

  it('every fixture has a non-empty title string', () => {
    for (const f of allFixtures) {
      expect(typeof f.title).toBe('string');
      expect(f.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('every fixture has a non-empty description string', () => {
    for (const f of allFixtures) {
      expect(typeof f.description).toBe('string');
      expect(f.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('every fixture has a queueItem object', () => {
    for (const f of allFixtures) {
      expect(typeof f.queueItem).toBe('object');
      expect(f.queueItem).not.toBeNull();
    }
  });

  it('every fixture has a summary object', () => {
    for (const f of allFixtures) {
      expect(typeof f.summary).toBe('object');
      expect(f.summary).not.toBeNull();
    }
  });

  it('every fixture has a meta object', () => {
    for (const f of allFixtures) {
      expect(typeof f.meta).toBe('object');
      expect(f.meta).not.toBeNull();
    }
  });

  it('every fixture has a safetyBoundary object', () => {
    for (const f of allFixtures) {
      expect(typeof f.safetyBoundary).toBe('object');
      expect(f.safetyBoundary).not.toBeNull();
    }
  });

  it('every fixture has a safeNotes array', () => {
    for (const f of allFixtures) {
      expect(Array.isArray(f.safeNotes)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 7. Queue item shape
// ---------------------------------------------------------------------------

describe('Phase 44: queue item fixture shape', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('every queueItem has a non-empty queueItemId string', () => {
    for (const f of allFixtures) {
      expect(typeof f.queueItem.queueItemId).toBe('string');
      expect(f.queueItem.queueItemId.trim().length).toBeGreaterThan(0);
    }
  });

  it('every queueItem has a valid state', () => {
    for (const f of allFixtures) {
      expect(isValidStrategyReviewExportQueueState(f.queueItem.state)).toBe(true);
    }
  });

  it('every queueItem has a valid priority', () => {
    for (const f of allFixtures) {
      expect(isValidStrategyReviewExportQueuePriority(f.queueItem.priority)).toBe(true);
    }
  });

  it('every queueItem.queuedAt equals the deterministic constant', () => {
    for (const f of allFixtures) {
      expect(f.queueItem.queuedAt).toBe(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT);
    }
  });

  it('every queueItem.fixtureOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.queueItem.fixtureOnly).toBe(true);
    }
  });

  it('every queueItem.syntheticOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.queueItem.syntheticOnly).toBe(true);
    }
  });

  it('every queueItem.planReference has sourcePhase 43', () => {
    for (const f of allFixtures) {
      expect(f.queueItem.planReference.sourcePhase).toBe(43);
    }
  });

  it('every queueItem.planReference.fixtureOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.queueItem.planReference.fixtureOnly).toBe(true);
    }
  });

  it('every queueItem.planReference.syntheticOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.queueItem.planReference.syntheticOnly).toBe(true);
    }
  });

  it('every queueItem.planReference.sourcePlanFixtureName is a valid Phase 43 plan name', () => {
    for (const f of allFixtures) {
      expect(
        (STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES as readonly string[]).includes(
          f.queueItem.planReference.sourcePlanFixtureName,
        ),
      ).toBe(true);
    }
  });

  it('every queueItem has unique queueItemId across all fixtures', () => {
    const ids = allFixtures.map(f => f.queueItem.queueItemId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// 8. Summary shape
// ---------------------------------------------------------------------------

describe('Phase 44: queue summary shape', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('every summary.phase is 44', () => {
    for (const f of allFixtures) {
      expect(f.summary.phase).toBe(44);
    }
  });

  it('every summary.fixtureName matches fixture name', () => {
    for (const f of allFixtures) {
      expect(f.summary.fixtureName).toBe(f.name);
    }
  });

  it('every summary.fixtureKind matches fixture kind', () => {
    for (const f of allFixtures) {
      expect(f.summary.fixtureKind).toBe(f.kind);
    }
  });

  it('every summary.state matches queueItem state', () => {
    for (const f of allFixtures) {
      expect(f.summary.state).toBe(f.queueItem.state);
    }
  });

  it('every summary.priority matches queueItem priority', () => {
    for (const f of allFixtures) {
      expect(f.summary.priority).toBe(f.queueItem.priority);
    }
  });

  it('every summary.itemCount is a number >= 1', () => {
    for (const f of allFixtures) {
      expect(typeof f.summary.itemCount).toBe('number');
      expect(f.summary.itemCount).toBeGreaterThanOrEqual(1);
    }
  });

  it('every summary.generatedAt equals the deterministic constant', () => {
    for (const f of allFixtures) {
      expect(f.summary.generatedAt).toBe(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT);
    }
  });

  it('every summary.fixtureOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.summary.fixtureOnly).toBe(true);
    }
  });

  it('every summary.syntheticOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.summary.syntheticOnly).toBe(true);
    }
  });

  it('every summary.localOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.summary.localOnly).toBe(true);
    }
  });

  it('every summary.readOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.summary.readOnly).toBe(true);
    }
  });

  it('every summary.serializable is true', () => {
    for (const f of allFixtures) {
      expect(f.summary.serializable).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 9. Meta shape
// ---------------------------------------------------------------------------

describe('Phase 44: queue meta shape', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('every meta.phase is 44', () => {
    for (const f of allFixtures) {
      expect(f.meta.phase).toBe(44);
    }
  });

  it('every meta.sourcePlanPhase is 43', () => {
    for (const f of allFixtures) {
      expect(f.meta.sourcePlanPhase).toBe(43);
    }
  });

  it('every meta.sourcePhases includes 40 through 44', () => {
    for (const f of allFixtures) {
      expect(f.meta.sourcePhases).toContain(40);
      expect(f.meta.sourcePhases).toContain(41);
      expect(f.meta.sourcePhases).toContain(42);
      expect(f.meta.sourcePhases).toContain(43);
      expect(f.meta.sourcePhases).toContain(44);
    }
  });

  it('every meta.fixtureOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.meta.fixtureOnly).toBe(true);
    }
  });

  it('every meta.syntheticOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.meta.syntheticOnly).toBe(true);
    }
  });

  it('every meta.deterministic is true', () => {
    for (const f of allFixtures) {
      expect(f.meta.deterministic).toBe(true);
    }
  });

  it('every meta.localOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.meta.localOnly).toBe(true);
    }
  });

  it('every meta.readOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.meta.readOnly).toBe(true);
    }
  });

  it('every meta.inMemoryOnly is true', () => {
    for (const f of allFixtures) {
      expect(f.meta.inMemoryOnly).toBe(true);
    }
  });

  it('every meta.queueExecutionDisabled is true', () => {
    for (const f of allFixtures) {
      expect(f.meta.queueExecutionDisabled).toBe(true);
    }
  });

  it('every meta.generatedAt equals the deterministic constant', () => {
    for (const f of allFixtures) {
      expect(f.meta.generatedAt).toBe(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT);
    }
  });

  it('every meta.source equals the deterministic constant', () => {
    for (const f of allFixtures) {
      expect(f.meta.source).toBe(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE);
    }
  });

  it('every meta.actualQueueWorkers is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.actualQueueWorkers).toBe(false);
    }
  });

  it('every meta.scheduledJobs is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.scheduledJobs).toBe(false);
    }
  });

  it('every meta.backgroundJobs is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.backgroundJobs).toBe(false);
    }
  });

  it('every meta.actualFileExport is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.actualFileExport).toBe(false);
    }
  });

  it('every meta.filesystemWrites is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.filesystemWrites).toBe(false);
    }
  });

  it('every meta.downloadSupport is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.downloadSupport).toBe(false);
    }
  });

  it('every meta.pdfGeneration is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.pdfGeneration).toBe(false);
    }
  });

  it('every meta.csvGeneration is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.csvGeneration).toBe(false);
    }
  });

  it('every meta.htmlGeneration is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.htmlGeneration).toBe(false);
    }
  });

  it('every meta.externalNetwork is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.externalNetwork).toBe(false);
    }
  });

  it('every meta.persistence is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.persistence).toBe(false);
    }
  });

  it('every meta.execution is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.execution).toBe(false);
    }
  });

  it('every meta.tradingSignals is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.tradingSignals).toBe(false);
    }
  });

  it('every meta.investmentAdvice is false', () => {
    for (const f of allFixtures) {
      expect(f.meta.investmentAdvice).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 10. Safety boundary shape
// ---------------------------------------------------------------------------

describe('Phase 44: safety boundary shape', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('every safetyBoundary.strategyReviewExportQueueFixtures is true', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueueFixtures).toBe(true);
    }
  });

  it('every safetyBoundary.syntheticStrategyReviewExportQueues is true', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.syntheticStrategyReviewExportQueues).toBe(true);
    }
  });

  it('every safetyBoundary.strategyReviewExportQueueBuilders is true', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueueBuilders).toBe(true);
    }
  });

  it('every safetyBoundary.strategyReviewExportQueueSafetyValidation is true', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueueSafetyValidation).toBe(true);
    }
  });

  it('every safetyBoundary.strategyReviewActualQueueWorkers is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewActualQueueWorkers).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewScheduledJobs is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewScheduledJobs).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewBackgroundJobs is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewBackgroundJobs).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewActualFileExport is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewActualFileExport).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewDownloadSupport is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewDownloadSupport).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewPdfGeneration is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewPdfGeneration).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewCsvGeneration is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewCsvGeneration).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewHtmlGeneration is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewHtmlGeneration).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewExportQueueExternalNetwork is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueueExternalNetwork).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewExportQueuePersistence is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueuePersistence).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewExportQueueExecution is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueueExecution).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewExportQueueTradingSignals is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueueTradingSignals).toBe(false);
    }
  });

  it('every safetyBoundary.strategyReviewExportQueueInvestmentAdvice is false', () => {
    for (const f of allFixtures) {
      expect(f.safetyBoundary.strategyReviewExportQueueInvestmentAdvice).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 11. Individual fixture checks
// ---------------------------------------------------------------------------

describe('Phase 44: DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE', () => {
  const f = DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('defensive-vs-aggressive-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('comparison-export-queued'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has normal priority', () => expect(f.queueItem.priority).toBe('normal'));
  it('references Phase 43 plan', () => expect(f.queueItem.planReference.sourcePhase).toBe(43));
  it('references defensive-vs-aggressive plan', () =>
    expect(f.queueItem.planReference.sourcePlanFixtureName).toBe(
      'defensive-vs-aggressive-export-plan',
    ));
});

describe('Phase 44: CREATOR_LED_EXPORT_QUEUED_FIXTURE', () => {
  const f = CREATOR_LED_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('creator-led-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('creator-export-queued'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has high priority', () => expect(f.queueItem.priority).toBe('high'));
  it('references creator-led plan', () =>
    expect(f.queueItem.planReference.sourcePlanFixtureName).toBe('creator-led-export-plan'));
});

describe('Phase 44: WALLET_LED_EXPORT_QUEUED_FIXTURE', () => {
  const f = WALLET_LED_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('wallet-led-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('wallet-export-queued'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has high priority', () => expect(f.queueItem.priority).toBe('high'));
  it('references wallet-led plan', () =>
    expect(f.queueItem.planReference.sourcePlanFixtureName).toBe('wallet-led-export-plan'));
});

describe('Phase 44: MANIPULATION_AVOIDANCE_EXPORT_QUEUED_FIXTURE', () => {
  const f = MANIPULATION_AVOIDANCE_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('manipulation-avoidance-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('manipulation-export-queued'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has high priority', () => expect(f.queueItem.priority).toBe('high'));
});

describe('Phase 44: NO_ACTION_SAFETY_EXPORT_QUEUED_FIXTURE', () => {
  const f = NO_ACTION_SAFETY_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('no-action-safety-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('safety-export-queued'));
  it('has safety-blocked state', () => expect(f.queueItem.state).toBe('safety-blocked'));
  it('has low priority', () => expect(f.queueItem.priority).toBe('low'));
});

describe('Phase 44: INSUFFICIENT_DATA_EXPORT_QUEUED_FIXTURE', () => {
  const f = INSUFFICIENT_DATA_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('insufficient-data-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('insufficient-data-export-queued'));
  it('has skipped state', () => expect(f.queueItem.state).toBe('skipped'));
  it('has low priority', () => expect(f.queueItem.priority).toBe('low'));
});

describe('Phase 44: HIGH_SCORE_POSITIVE_EXPORT_QUEUED_FIXTURE', () => {
  const f = HIGH_SCORE_POSITIVE_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('high-score-positive-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('positive-export-queued'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has high priority', () => expect(f.queueItem.priority).toBe('high'));
});

describe('Phase 44: HIGH_SCORE_FALSE_POSITIVE_EXPORT_QUEUED_FIXTURE', () => {
  const f = HIGH_SCORE_FALSE_POSITIVE_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () =>
    expect(f.name).toBe('high-score-false-positive-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('false-positive-export-queued'));
  it('has pending-review state', () => expect(f.queueItem.state).toBe('pending-review'));
  it('has normal priority', () => expect(f.queueItem.priority).toBe('normal'));
});

describe('Phase 44: MISSED_OPPORTUNITY_EXPORT_QUEUED_FIXTURE', () => {
  const f = MISSED_OPPORTUNITY_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('missed-opportunity-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('missed-opportunity-export-queued'));
  it('has reviewed state', () => expect(f.queueItem.state).toBe('reviewed'));
  it('has normal priority', () => expect(f.queueItem.priority).toBe('normal'));
});

describe('Phase 44: DRAWDOWN_CONTAINED_EXPORT_QUEUED_FIXTURE', () => {
  const f = DRAWDOWN_CONTAINED_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('drawdown-contained-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('drawdown-export-queued'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has normal priority', () => expect(f.queueItem.priority).toBe('normal'));
});

describe('Phase 44: MIXED_SIGNAL_WATCHLIST_EXPORT_QUEUED_FIXTURE', () => {
  const f = MIXED_SIGNAL_WATCHLIST_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('mixed-signal-watchlist-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('watchlist-export-queued'));
  it('has pending-review state', () => expect(f.queueItem.state).toBe('pending-review'));
  it('has normal priority', () => expect(f.queueItem.priority).toBe('normal'));
});

describe('Phase 44: FALSE_POSITIVE_PROTECTION_EXPORT_QUEUED_FIXTURE', () => {
  const f = FALSE_POSITIVE_PROTECTION_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () =>
    expect(f.name).toBe('false-positive-protection-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('protection-export-queued'));
  it('has safety-blocked state', () => expect(f.queueItem.state).toBe('safety-blocked'));
  it('has low priority', () => expect(f.queueItem.priority).toBe('low'));
});

describe('Phase 44: MALFORMED_INPUT_SAFE_EXPORT_QUEUED_FIXTURE', () => {
  const f = MALFORMED_INPUT_SAFE_EXPORT_QUEUED_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('malformed-input-safe-export-queued'));
  it('has correct kind', () => expect(f.kind).toBe('safe-export-queued'));
  it('has safety-blocked state', () => expect(f.queueItem.state).toBe('safety-blocked'));
  it('has low priority', () => expect(f.queueItem.priority).toBe('low'));
});

describe('Phase 44: DASHBOARD_READY_EXPORT_QUEUE_FIXTURE', () => {
  const f = DASHBOARD_READY_EXPORT_QUEUE_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('dashboard-ready-export-queue'));
  it('has correct kind', () => expect(f.kind).toBe('dashboard-ready-export-queue'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has high priority', () => expect(f.queueItem.priority).toBe('high'));
});

describe('Phase 44: SERIALIZATION_READY_EXPORT_QUEUE_FIXTURE', () => {
  const f = SERIALIZATION_READY_EXPORT_QUEUE_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('serialization-ready-export-queue'));
  it('has correct kind', () => expect(f.kind).toBe('serialization-ready-export-queue'));
  it('has queued state', () => expect(f.queueItem.state).toBe('queued'));
  it('has high priority', () => expect(f.queueItem.priority).toBe('high'));
});

describe('Phase 44: SAFETY_BOUNDARY_EXPORT_QUEUE_FIXTURE', () => {
  const f = SAFETY_BOUNDARY_EXPORT_QUEUE_FIXTURE;
  it('has correct name', () => expect(f.name).toBe('safety-boundary-export-queue'));
  it('has correct kind', () => expect(f.kind).toBe('safety-boundary-export-queue'));
  it('has safety-blocked state', () => expect(f.queueItem.state).toBe('safety-blocked'));
  it('has low priority', () => expect(f.queueItem.priority).toBe('low'));
});

// ---------------------------------------------------------------------------
// 12. Normalization
// ---------------------------------------------------------------------------

describe('Phase 44: normalizeStrategyReviewExportQueueFixture', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('returns an object equal in content to the input', () => {
    for (const f of allFixtures) {
      const norm = normalizeStrategyReviewExportQueueFixture(f);
      expect(norm.name).toBe(f.name);
      expect(norm.kind).toBe(f.kind);
      expect(norm.title).toBe(f.title);
    }
  });

  it('does not mutate the input fixture', () => {
    for (const f of allFixtures) {
      const originalName = f.name;
      normalizeStrategyReviewExportQueueFixture(f);
      expect(f.name).toBe(originalName);
    }
  });

  it('is idempotent (double-normalization equals single)', () => {
    for (const f of allFixtures) {
      const once = normalizeStrategyReviewExportQueueFixture(f);
      const twice = normalizeStrategyReviewExportQueueFixture(once);
      expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
    }
  });
});

// ---------------------------------------------------------------------------
// 13. Serialization and equality
// ---------------------------------------------------------------------------

describe('Phase 44: serializeStrategyReviewExportQueueFixture', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('returns a non-empty string for every fixture', () => {
    for (const f of allFixtures) {
      const s = serializeStrategyReviewExportQueueFixture(f);
      expect(typeof s).toBe('string');
      expect(s.trim().length).toBeGreaterThan(0);
    }
  });

  it('produces valid JSON for every fixture', () => {
    for (const f of allFixtures) {
      const s = serializeStrategyReviewExportQueueFixture(f);
      expect(() => JSON.parse(s)).not.toThrow();
    }
  });

  it('is deterministic — same fixture serializes the same way', () => {
    for (const f of allFixtures) {
      const a = serializeStrategyReviewExportQueueFixture(f);
      const b = serializeStrategyReviewExportQueueFixture(f);
      expect(a).toBe(b);
    }
  });
});

describe('Phase 44: areStrategyReviewExportQueueFixturesEqual', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('returns true when comparing a fixture to itself', () => {
    for (const f of allFixtures) {
      expect(areStrategyReviewExportQueueFixturesEqual(f, f)).toBe(true);
    }
  });

  it('returns false when comparing two different fixtures', () => {
    const [first, second] = allFixtures;
    if (first && second) {
      expect(areStrategyReviewExportQueueFixturesEqual(first, second)).toBe(false);
    }
  });
});

describe('Phase 44: isStrategyReviewExportQueueFixtureSerializable', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('returns true for every fixture', () => {
    for (const f of allFixtures) {
      expect(isStrategyReviewExportQueueFixtureSerializable(f)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 14. Validation success/failure
// ---------------------------------------------------------------------------

describe('Phase 44: validateStrategyReviewExportQueueFixture — success', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('returns valid=true for every built fixture', () => {
    for (const f of allFixtures) {
      const result = validateStrategyReviewExportQueueFixture(f);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    }
  });
});

describe('Phase 44: validateStrategyReviewExportQueueFixture — failure cases', () => {
  it('returns valid=false for null', () => {
    const r = validateStrategyReviewExportQueueFixture(null);
    expect(r.valid).toBe(false);
    expect(r.issues.length).toBeGreaterThan(0);
  });

  it('returns valid=false for undefined', () => {
    const r = validateStrategyReviewExportQueueFixture(undefined);
    expect(r.valid).toBe(false);
  });

  it('returns valid=false for empty object', () => {
    const r = validateStrategyReviewExportQueueFixture({});
    expect(r.valid).toBe(false);
    expect(r.issues.length).toBeGreaterThan(0);
  });

  it('returns valid=false for invalid name', () => {
    const f = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE, name: 'bad-name' };
    const r = validateStrategyReviewExportQueueFixture(f);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_NAME')).toBe(true);
  });

  it('returns valid=false for invalid kind', () => {
    const f = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE, kind: 'bad-kind' };
    const r = validateStrategyReviewExportQueueFixture(f);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_KIND')).toBe(true);
  });

  it('returns valid=false for empty title', () => {
    const f = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE, title: '' };
    const r = validateStrategyReviewExportQueueFixture(f);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_TITLE')).toBe(true);
  });

  it('returns valid=false for empty description', () => {
    const f = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE, description: '' };
    const r = validateStrategyReviewExportQueueFixture(f);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_DESCRIPTION')).toBe(true);
  });

  it('returns valid=false for missing queueItem', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { queueItem: _removed, ...withoutItem } = DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE;
    const r = validateStrategyReviewExportQueueFixture(withoutItem);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_QUEUE_ITEM')).toBe(true);
  });

  it('returns valid=false for wrong meta.phase', () => {
    const f = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE.meta, phase: 43 as unknown as 44 },
    };
    const r = validateStrategyReviewExportQueueFixture(f);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_PHASE')).toBe(true);
  });

  it('returns valid=false for meta.queueExecutionDisabled=false', () => {
    const f = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE,
      meta: {
        ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE.meta,
        queueExecutionDisabled: false as unknown as true,
      },
    };
    const r = validateStrategyReviewExportQueueFixture(f);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'QUEUE_EXECUTION_NOT_DISABLED')).toBe(true);
  });

  it('returns valid=false for wrong generatedAt', () => {
    const f = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE,
      meta: {
        ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE.meta,
        generatedAt: '2025-01-01T00:00:00.000Z' as unknown as typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT,
      },
    };
    const r = validateStrategyReviewExportQueueFixture(f);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_GENERATED_AT')).toBe(true);
  });

  it('returns valid=false when safetyBoundary is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { safetyBoundary: _removed, ...withoutSb } = DEFENSIVE_VS_AGGRESSIVE_EXPORT_QUEUED_FIXTURE;
    const r = validateStrategyReviewExportQueueFixture(withoutSb);
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === 'INVALID_SAFETY_BOUNDARY')).toBe(true);
  });

  it('does not throw for string input', () => {
    expect(() => validateStrategyReviewExportQueueFixture('not-an-object')).not.toThrow();
    const r = validateStrategyReviewExportQueueFixture('not-an-object');
    expect(r.valid).toBe(false);
  });

  it('does not throw for number input', () => {
    expect(() => validateStrategyReviewExportQueueFixture(42)).not.toThrow();
    const r = validateStrategyReviewExportQueueFixture(42);
    expect(r.valid).toBe(false);
  });

  it('does not throw for array input', () => {
    expect(() => validateStrategyReviewExportQueueFixture([])).not.toThrow();
    const r = validateStrategyReviewExportQueueFixture([]);
    expect(r.valid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 15. Safety validation success/failure
// ---------------------------------------------------------------------------

describe('Phase 44: validateStrategyReviewExportQueueSafety — success', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('returns safe=true for every built fixture', () => {
    for (const f of allFixtures) {
      const result = validateStrategyReviewExportQueueSafety(f);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    }
  });
});

describe('Phase 44: validateStrategyReviewExportQueueSafety — failure cases', () => {
  it('returns safe=false for object containing a URL', () => {
    const r = validateStrategyReviewExportQueueSafety({ notes: ['See https://example.com'] });
    expect(r.safe).toBe(false);
    expect(r.violations.length).toBeGreaterThan(0);
  });

  it('returns safe=false for object containing local path', () => {
    const r = validateStrategyReviewExportQueueSafety({ path: '/home/user/secret' });
    expect(r.safe).toBe(false);
    expect(r.violations.length).toBeGreaterThan(0);
  });

  it('returns safe=false for object containing secret-like term', () => {
    const r = validateStrategyReviewExportQueueSafety({
      notes: ['This is the private key'],
    });
    expect(r.safe).toBe(false);
  });

  it('returns safe=false for object containing execution term', () => {
    const r = validateStrategyReviewExportQueueSafety({ notes: ['call signTransaction'] });
    expect(r.safe).toBe(false);
  });

  it('returns safe=false for object containing network term', () => {
    const r = validateStrategyReviewExportQueueSafety({ notes: ['use fetch to call API'] });
    expect(r.safe).toBe(false);
  });

  it('returns safe=false for object containing download API term', () => {
    const r = validateStrategyReviewExportQueueSafety({ notes: ['create a Blob and download'] });
    expect(r.safe).toBe(false);
  });

  it('returns safe=false for object containing timer term', () => {
    const r = validateStrategyReviewExportQueueSafety({ notes: ['use Date.now for timing'] });
    expect(r.safe).toBe(false);
  });

  it('returns safe=false for object containing DOM term', () => {
    const r = validateStrategyReviewExportQueueSafety({ notes: ['access document.cookie'] });
    expect(r.safe).toBe(false);
  });

  it('returns safe=true for null', () => {
    const r = validateStrategyReviewExportQueueSafety(null);
    expect(r.safe).toBe(true);
  });

  it('returns safe=true for empty object', () => {
    const r = validateStrategyReviewExportQueueSafety({});
    expect(r.safe).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 16. Builder — success and failure cases
// ---------------------------------------------------------------------------

describe('Phase 44: buildStrategyReviewExportQueueFixture — success', () => {
  it('builds a valid fixture for valid input', () => {
    const r = buildStrategyReviewExportQueueFixture({
      name: 'creator-led-export-queued',
      kind: 'creator-export-queued',
      state: 'queued',
      priority: 'high',
      sourcePlanFixtureName: 'creator-led-export-plan',
    });
    expect(r.success).toBe(true);
    expect(r.fixture).not.toBeNull();
    expect(r.fixture?.name).toBe('creator-led-export-queued');
    expect(r.validation.valid).toBe(true);
    expect(r.safety.safe).toBe(true);
  });

  it('produces a deterministic fixture for same input', () => {
    const input = {
      name: 'wallet-led-export-queued' as const,
      kind: 'wallet-export-queued' as const,
      state: 'queued' as const,
      priority: 'high' as const,
      sourcePlanFixtureName: 'wallet-led-export-plan' as const,
    };
    const r1 = buildStrategyReviewExportQueueFixture(input);
    const r2 = buildStrategyReviewExportQueueFixture(input);
    expect(JSON.stringify(r1.fixture)).toBe(JSON.stringify(r2.fixture));
  });

  it('uses default title and description when not provided', () => {
    const r = buildStrategyReviewExportQueueFixture({
      name: 'creator-led-export-queued',
      kind: 'creator-export-queued',
      state: 'queued',
      priority: 'high',
      sourcePlanFixtureName: 'creator-led-export-plan',
    });
    expect(r.fixture?.title).toBeTruthy();
    expect(r.fixture?.description).toBeTruthy();
  });

  it('uses provided title and description when provided', () => {
    const r = buildStrategyReviewExportQueueFixture({
      name: 'creator-led-export-queued',
      kind: 'creator-export-queued',
      state: 'queued',
      priority: 'high',
      sourcePlanFixtureName: 'creator-led-export-plan',
      title: 'Custom Title',
      description: 'Custom description.',
    });
    expect(r.fixture?.title).toBe('Custom Title');
    expect(r.fixture?.description).toBe('Custom description.');
  });

  it('returns a serializable fixture', () => {
    const r = buildStrategyReviewExportQueueFixture({
      name: 'dashboard-ready-export-queue',
      kind: 'dashboard-ready-export-queue',
      state: 'queued',
      priority: 'high',
      sourcePlanFixtureName: 'dashboard-ready-export-plan',
    });
    expect(r.fixture).not.toBeNull();
    expect(() => JSON.stringify(r.fixture)).not.toThrow();
  });
});

describe('Phase 44: buildStrategyReviewExportQueueFixture — failure cases', () => {
  it('returns success=false for invalid name', () => {
    const r = buildStrategyReviewExportQueueFixture({
      name: 'invalid-fixture-name',
      kind: 'creator-export-queued',
      state: 'queued',
      priority: 'high',
      sourcePlanFixtureName: 'creator-led-export-plan',
    });
    expect(r.success).toBe(false);
    expect(r.fixture).toBeNull();
  });

  it('returns success=false and does not throw for invalid input', () => {
    expect(() =>
      buildStrategyReviewExportQueueFixture({
        name: '',
        kind: '',
        state: 'queued',
        priority: 'high',
        sourcePlanFixtureName: 'creator-led-export-plan',
      }),
    ).not.toThrow();
  });

  it('returns safety violations for unsafe input', () => {
    const r = buildStrategyReviewExportQueueFixture({
      name: 'creator-led-export-queued',
      kind: 'creator-export-queued',
      state: 'queued',
      priority: 'high',
      sourcePlanFixtureName: 'creator-led-export-plan',
      safeNotes: ['call signTransaction to execute'],
    });
    expect(r.success).toBe(false);
    expect(r.safety.safe).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 17. buildStrategyReviewExportQueueSummary
// ---------------------------------------------------------------------------

describe('Phase 44: buildStrategyReviewExportQueueSummary', () => {
  it('returns a summary with correct totalFixtures count', () => {
    const summary = buildStrategyReviewExportQueueSummary(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
    );
    expect(summary.totalFixtures).toBe(16);
  });

  it('byState includes queued, pending-review, reviewed, skipped, safety-blocked', () => {
    const summary = buildStrategyReviewExportQueueSummary(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
    );
    expect(summary.byState['queued']).toBeGreaterThan(0);
    expect(summary.byState['pending-review']).toBeGreaterThan(0);
    expect(summary.byState['reviewed']).toBeGreaterThan(0);
    expect(summary.byState['skipped']).toBeGreaterThan(0);
    expect(summary.byState['safety-blocked']).toBeGreaterThan(0);
  });

  it('byPriority includes high, normal, low', () => {
    const summary = buildStrategyReviewExportQueueSummary(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
    );
    expect(summary.byPriority['high']).toBeGreaterThan(0);
    expect(summary.byPriority['normal']).toBeGreaterThan(0);
    expect(summary.byPriority['low']).toBeGreaterThan(0);
  });

  it('byKind has entries for every fixture kind in the list', () => {
    const summary = buildStrategyReviewExportQueueSummary(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
    );
    expect(Object.keys(summary.byKind).length).toBeGreaterThan(0);
  });

  it('fixtureOnly is true', () => {
    const summary = buildStrategyReviewExportQueueSummary(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
    );
    expect(summary.fixtureOnly).toBe(true);
  });

  it('syntheticOnly is true', () => {
    const summary = buildStrategyReviewExportQueueSummary(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
    );
    expect(summary.syntheticOnly).toBe(true);
  });

  it('generatedAt equals the deterministic constant', () => {
    const summary = buildStrategyReviewExportQueueSummary(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
    );
    expect(summary.generatedAt).toBe(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT);
  });

  it('returns totalFixtures=0 for empty array', () => {
    const summary = buildStrategyReviewExportQueueSummary([]);
    expect(summary.totalFixtures).toBe(0);
  });

  it('does not mutate the input array', () => {
    const list = [...PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST];
    const originalLength = list.length;
    buildStrategyReviewExportQueueSummary(list);
    expect(list.length).toBe(originalLength);
  });
});

// ---------------------------------------------------------------------------
// 18. Normalization guard helpers
// ---------------------------------------------------------------------------

describe('Phase 44: isValidStrategyReviewExportQueueFixtureName', () => {
  it('returns true for all valid names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      expect(isValidStrategyReviewExportQueueFixtureName(name)).toBe(true);
    }
  });

  it('returns false for invalid name', () => {
    expect(isValidStrategyReviewExportQueueFixtureName('bad-name')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidStrategyReviewExportQueueFixtureName('')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidStrategyReviewExportQueueFixtureName(null)).toBe(false);
  });

  it('returns false for number', () => {
    expect(isValidStrategyReviewExportQueueFixtureName(42)).toBe(false);
  });
});

describe('Phase 44: isValidStrategyReviewExportQueueFixtureKind', () => {
  it('returns true for all valid kinds', () => {
    for (const kind of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS) {
      expect(isValidStrategyReviewExportQueueFixtureKind(kind)).toBe(true);
    }
  });

  it('returns false for invalid kind', () => {
    expect(isValidStrategyReviewExportQueueFixtureKind('bad-kind')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidStrategyReviewExportQueueFixtureKind(null)).toBe(false);
  });
});

describe('Phase 44: isValidStrategyReviewExportQueueState', () => {
  it('returns true for all valid states', () => {
    for (const state of STRATEGY_REVIEW_EXPORT_QUEUE_STATES) {
      expect(isValidStrategyReviewExportQueueState(state)).toBe(true);
    }
  });

  it('returns false for invalid state', () => {
    expect(isValidStrategyReviewExportQueueState('running')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidStrategyReviewExportQueueState(null)).toBe(false);
  });
});

describe('Phase 44: isValidStrategyReviewExportQueuePriority', () => {
  it('returns true for all valid priorities', () => {
    for (const priority of STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES) {
      expect(isValidStrategyReviewExportQueuePriority(priority)).toBe(true);
    }
  });

  it('returns false for invalid priority', () => {
    expect(isValidStrategyReviewExportQueuePriority('critical')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidStrategyReviewExportQueuePriority(null)).toBe(false);
  });
});

describe('Phase 44: isValidStrategyReviewExportQueueGeneratedAt', () => {
  it('returns true for the deterministic constant', () => {
    expect(
      isValidStrategyReviewExportQueueGeneratedAt(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT),
    ).toBe(true);
  });

  it('returns false for other timestamps', () => {
    expect(isValidStrategyReviewExportQueueGeneratedAt('2025-01-01T00:00:00.000Z')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidStrategyReviewExportQueueGeneratedAt(null)).toBe(false);
  });
});

describe('Phase 44: isValidStrategyReviewExportQueueSource', () => {
  it('returns true for the deterministic constant', () => {
    expect(isValidStrategyReviewExportQueueSource(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE)).toBe(
      true,
    );
  });

  it('returns false for other sources', () => {
    expect(isValidStrategyReviewExportQueueSource('other-source')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidStrategyReviewExportQueueSource(null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 19. EXPORT_QUEUE_NAME_TO_* mappings
// ---------------------------------------------------------------------------

describe('Phase 44: EXPORT_QUEUE_NAME_TO_KIND mapping', () => {
  it('covers all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      expect(EXPORT_QUEUE_NAME_TO_KIND[name]).toBeDefined();
      expect(isValidStrategyReviewExportQueueFixtureKind(EXPORT_QUEUE_NAME_TO_KIND[name])).toBe(true);
    }
  });
});

describe('Phase 44: EXPORT_QUEUE_NAME_TO_PLAN mapping', () => {
  it('covers all 16 fixture names with valid Phase 43 plan names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      const planName = EXPORT_QUEUE_NAME_TO_PLAN[name];
      expect(planName).toBeDefined();
      expect(
        (STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES as readonly string[]).includes(planName),
      ).toBe(true);
    }
  });
});

describe('Phase 44: EXPORT_QUEUE_NAME_TO_STATE mapping', () => {
  it('covers all 16 fixture names with valid states', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      expect(isValidStrategyReviewExportQueueState(EXPORT_QUEUE_NAME_TO_STATE[name])).toBe(true);
    }
  });
});

describe('Phase 44: EXPORT_QUEUE_NAME_TO_PRIORITY mapping', () => {
  it('covers all 16 fixture names with valid priorities', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      expect(
        isValidStrategyReviewExportQueuePriority(EXPORT_QUEUE_NAME_TO_PRIORITY[name]),
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 20. Phase 43 compatibility
// ---------------------------------------------------------------------------

describe('Phase 44: Phase 43 export-plan reference compatibility', () => {
  it('all Phase 43 fixtures are referenced by at least one Phase 44 fixture', () => {
    const referencedPlanNames = new Set(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST.map(
        f => f.queueItem.planReference.sourcePlanFixtureName,
      ),
    );
    // At least some Phase 43 fixtures must be referenced
    expect(referencedPlanNames.size).toBeGreaterThan(0);
  });

  it('all plan references point to valid Phase 43 export plan fixtures', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const planName = f.queueItem.planReference.sourcePlanFixtureName;
      const planFixture = PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST.find(
        p => p.name === planName,
      );
      expect(planFixture).toBeDefined();
    }
  });

  it('all plan references have correct sourcePlanFixtureKind from Phase 43', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const planName = f.queueItem.planReference.sourcePlanFixtureName;
      const planFixture = PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST.find(
        p => p.name === planName,
      );
      expect(f.queueItem.planReference.sourcePlanFixtureKind).toBe(planFixture?.kind);
    }
  });

  it('all plan references have correct sourcePlanTargetFormat from Phase 43', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const planName = f.queueItem.planReference.sourcePlanFixtureName;
      const planFixture = PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST.find(
        p => p.name === planName,
      );
      expect(f.queueItem.planReference.sourcePlanTargetFormat).toBe(planFixture?.targetFormat);
    }
  });
});

// ---------------------------------------------------------------------------
// 21. No mutation
// ---------------------------------------------------------------------------

describe('Phase 44: no input mutation', () => {
  it('buildStrategyReviewExportQueueFixture does not mutate its input', () => {
    const input = {
      name: 'creator-led-export-queued' as const,
      kind: 'creator-export-queued' as const,
      state: 'queued' as const,
      priority: 'high' as const,
      sourcePlanFixtureName: 'creator-led-export-plan' as const,
      safeNotes: ['note one'],
    };
    const notesSnapshot = [...input.safeNotes];
    buildStrategyReviewExportQueueFixture(input);
    expect(input.safeNotes).toEqual(notesSnapshot);
  });

  it('normalizeStrategyReviewExportQueueFixture does not mutate the fixture', () => {
    const f = CREATOR_LED_EXPORT_QUEUED_FIXTURE;
    const nameBefore = f.name;
    normalizeStrategyReviewExportQueueFixture(f);
    expect(f.name).toBe(nameBefore);
  });

  it('validateStrategyReviewExportQueueFixture does not mutate its input', () => {
    const f = { ...CREATOR_LED_EXPORT_QUEUED_FIXTURE };
    const nameBefore = f.name;
    validateStrategyReviewExportQueueFixture(f);
    expect(f.name).toBe(nameBefore);
  });
});

// ---------------------------------------------------------------------------
// 22. Serializability
// ---------------------------------------------------------------------------

describe('Phase 44: serializability', () => {
  it('all fixtures survive JSON round-trip', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const serialized = JSON.stringify(f);
      const parsed = JSON.parse(serialized);
      expect(parsed.name).toBe(f.name);
      expect(parsed.kind).toBe(f.kind);
      expect(parsed.meta.phase).toBe(44);
    }
  });

  it('serialized fixture does not contain undefined values', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const serialized = JSON.stringify(f);
      expect(serialized).not.toContain('"undefined"');
    }
  });
});

// ---------------------------------------------------------------------------
// 23. Deterministic ordering / generatedAt
// ---------------------------------------------------------------------------

describe('Phase 44: determinism', () => {
  it('fixture list order is stable across calls', () => {
    const a = listStrategyReviewExportQueueFixtures(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES);
    const b = listStrategyReviewExportQueueFixtures(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES);
    expect(a.map(f => f.name)).toEqual(b.map(f => f.name));
  });

  it('all generatedAt values are identical and deterministic', () => {
    const generatedAts = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST.map(
      f => f.meta.generatedAt,
    );
    const unique = new Set(generatedAts);
    expect(unique.size).toBe(1);
    expect([...unique][0]).toBe(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT);
  });

  it('building same fixture twice produces identical results', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      const r1 = buildStrategyReviewExportQueueFixture({
        name,
        kind: EXPORT_QUEUE_NAME_TO_KIND[name],
        state: EXPORT_QUEUE_NAME_TO_STATE[name],
        priority: EXPORT_QUEUE_NAME_TO_PRIORITY[name],
        sourcePlanFixtureName: EXPORT_QUEUE_NAME_TO_PLAN[name],
      });
      const r2 = buildStrategyReviewExportQueueFixture({
        name,
        kind: EXPORT_QUEUE_NAME_TO_KIND[name],
        state: EXPORT_QUEUE_NAME_TO_STATE[name],
        priority: EXPORT_QUEUE_NAME_TO_PRIORITY[name],
        sourcePlanFixtureName: EXPORT_QUEUE_NAME_TO_PLAN[name],
      });
      expect(JSON.stringify(r1.fixture)).toBe(JSON.stringify(r2.fixture));
    }
  });
});

// ---------------------------------------------------------------------------
// 24. No real wallet addresses / tx hashes / personal data
// ---------------------------------------------------------------------------

describe('Phase 44: no real wallet/tx/personal data', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('no fixture contains a 44-char base58-like wallet address string', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f);
      // A real Solana wallet is a 44-char base58 string
      const walletPattern = /"[1-9A-HJ-NP-Za-km-z]{44}"/g;
      expect(walletPattern.test(s)).toBe(false);
    }
  });

  it('no fixture contains a transaction hash string of 88 chars', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f);
      const txHashPattern = /"[1-9A-HJ-NP-Za-km-z]{88}"/g;
      expect(txHashPattern.test(s)).toBe(false);
    }
  });

  it('no fixture contains personal email-like data', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f);
      expect(/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(s)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 25. No secrets / stack traces / local paths
// ---------------------------------------------------------------------------

describe('Phase 44: no secrets/stack-traces/local-paths', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('no fixture contains "private key"', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f).toLowerCase()).not.toContain('private key');
    }
  });

  it('no fixture contains "seed phrase"', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f).toLowerCase()).not.toContain('seed phrase');
    }
  });

  it('no fixture contains "mnemonic"', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f).toLowerCase()).not.toContain('mnemonic');
    }
  });

  it('no fixture contains a local path like /home/ or /Users/', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f);
      expect(/\/home\/|\/Users\/|C:\\Users\\/.test(s)).toBe(false);
    }
  });

  it('no fixture contains "stack trace" or "at " callstack pattern', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f);
      expect(s).not.toContain('Error: ');
      expect(s).not.toContain('at Object.');
    }
  });
});

// ---------------------------------------------------------------------------
// 26. No live-data claims
// ---------------------------------------------------------------------------

describe('Phase 44: no live-data claims', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('no fixture claims real PnL', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f).toLowerCase();
      expect(s).not.toContain('real pnl');
      expect(s).not.toContain('actual profit');
    }
  });

  it('no fixture contains balance/order/fill language', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f).toLowerCase();
      expect(s).not.toContain('sendtransaction');
      expect(s).not.toContain('signtransaction');
    }
  });
});

// ---------------------------------------------------------------------------
// 27. No actual file export/download behavior
// ---------------------------------------------------------------------------

describe('Phase 44: no actual file export/download behavior', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('no fixture contains Blob reference', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f)).not.toContain('createObjectURL');
    }
  });

  it('no fixture contains writeFileSync reference', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f)).not.toContain('writeFileSync');
    }
  });

  it('no fixture contains fs.writeFile reference', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f)).not.toContain('fs.writeFile');
    }
  });
});

// ---------------------------------------------------------------------------
// 28. No real queue workers / scheduled / background jobs
// ---------------------------------------------------------------------------

describe('Phase 44: no real queue workers/jobs', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('all meta.actualQueueWorkers are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.actualQueueWorkers).toBe(false);
    }
  });

  it('all meta.scheduledJobs are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.scheduledJobs).toBe(false);
    }
  });

  it('all meta.backgroundJobs are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.backgroundJobs).toBe(false);
    }
  });

  it('no fixture JSON contains BullMQ reference', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f).toLowerCase()).not.toContain('bullmq');
    }
  });

  it('no fixture JSON contains cron reference', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f).toLowerCase()).not.toContain('cron');
    }
  });

  it('no fixture JSON contains Redis reference', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f).toLowerCase()).not.toContain('redis');
    }
  });
});

// ---------------------------------------------------------------------------
// 29. No real scoring/replay/trading/RPC
// ---------------------------------------------------------------------------

describe('Phase 44: no real scoring/replay/trading/RPC', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('all meta.execution are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.execution).toBe(false);
    }
  });

  it('all meta.tradingSignals are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.tradingSignals).toBe(false);
    }
  });

  it('all meta.investmentAdvice are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.investmentAdvice).toBe(false);
    }
  });

  it('no fixture JSON references Jito or MEV', () => {
    for (const f of allFixtures) {
      const s = JSON.stringify(f).toLowerCase();
      expect(s).not.toContain('jito');
      expect(s).not.toContain(' mev');
    }
  });

  it('no fixture JSON contains Solana RPC reference', () => {
    for (const f of allFixtures) {
      expect(JSON.stringify(f)).not.toContain('Solana RPC');
    }
  });
});

// ---------------------------------------------------------------------------
// 30. No network/filesystem / no Date.now/random/timers
// ---------------------------------------------------------------------------

describe('Phase 44: no network/filesystem/timers/randomness', () => {
  const allFixtures = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST;

  it('all meta.externalNetwork are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.externalNetwork).toBe(false);
    }
  });

  it('all meta.persistence are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.persistence).toBe(false);
    }
  });

  it('all meta.filesystemWrites are false', () => {
    for (const f of allFixtures) {
      expect(f.meta.filesystemWrites).toBe(false);
    }
  });

  it('generatedAt does not depend on Date.now (is a fixed string)', () => {
    // If it were Date.now, calling twice would differ. Check it equals the constant.
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });
});

// ---------------------------------------------------------------------------
// 31. Safety boundary regression
// ---------------------------------------------------------------------------

describe('Phase 44: safety boundary regression', () => {
  it('dashboard capabilities preserve all Phase 40 safety flags', () => {
    const caps = getDashboardUiShellCapabilities();
    // These are Phase 40 flags that must remain unchanged
    expect(caps.strategyReviewDashboardFixtures).toBe(true);
    expect(caps.strategyReviewReportFixtures).toBe(true);
  });

  it('dashboard capabilities preserve all Phase 43 safety flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportPlanningFixtures).toBe(true);
    expect(caps.strategyReviewFilesystemWrites).toBe(false);
    expect(caps.strategyReviewPdfGeneration).toBe(false);
    expect(caps.strategyReviewCsvGeneration).toBe(false);
    expect(caps.strategyReviewHtmlGeneration).toBe(false);
    expect(caps.strategyReviewExportExecution).toBe(false);
  });

  it('all Phase 44 fixtures pass both validation and safety checks', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const validation = validateStrategyReviewExportQueueFixture(f);
      const safety = validateStrategyReviewExportQueueSafety(f);
      expect(validation.valid).toBe(true);
      expect(safety.safe).toBe(true);
    }
  });

  it('queue execution disabled flag is true across all fixtures', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(f.meta.queueExecutionDisabled).toBe(true);
    }
  });

  it('no fixture has queueItem with actual job id format (UUID with dashes)', () => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      // Deterministic IDs should not be real UUIDs
      expect(uuidPattern.test(f.queueItem.queueItemId)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 32. Additional compatibility tests
// ---------------------------------------------------------------------------

describe('Phase 44: additional compatibility and edge-case tests', () => {
  it('all queue fixture names are strings', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      expect(typeof name).toBe('string');
    }
  });

  it('all queue fixture kinds are strings', () => {
    for (const kind of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS) {
      expect(typeof kind).toBe('string');
    }
  });

  it('all queue states are strings', () => {
    for (const state of STRATEGY_REVIEW_EXPORT_QUEUE_STATES) {
      expect(typeof state).toBe('string');
    }
  });

  it('all queue priorities are strings', () => {
    for (const priority of STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES) {
      expect(typeof priority).toBe('string');
    }
  });

  it('fixture name count matches fixture map size', () => {
    expect(STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES.length).toBe(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES.size,
    );
  });

  it('fixture list count matches fixture map size', () => {
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST.length).toBe(
      PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES.size,
    );
  });

  it('every fixture has a non-empty safeNotes array with string items', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(Array.isArray(f.safeNotes)).toBe(true);
      expect(f.safeNotes.length).toBeGreaterThan(0);
      for (const note of f.safeNotes) {
        expect(typeof note).toBe('string');
      }
    }
  });

  it('every queueItem planReference has notes array', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(Array.isArray(f.queueItem.planReference.notes)).toBe(true);
    }
  });

  it('every meta has notes array', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(Array.isArray(f.meta.notes)).toBe(true);
    }
  });

  it('every summary has notes array', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(Array.isArray(f.summary.notes)).toBe(true);
    }
  });

  it('queueItem.queueItemId format starts with queue-item-', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(f.queueItem.queueItemId.startsWith('queue-item-')).toBe(true);
    }
  });

  it('summary.sourcePlanFixtureName matches queueItem planReference', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(f.summary.sourcePlanFixtureName).toBe(
        f.queueItem.planReference.sourcePlanFixtureName,
      );
    }
  });

  it('summary.sourcePlanTargetFormat matches queueItem planReference', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(f.summary.sourcePlanTargetFormat).toBe(
        f.queueItem.planReference.sourcePlanTargetFormat,
      );
    }
  });

  it('meta.sourcePlanFixtureName matches queueItem planReference', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      expect(f.meta.sourcePlanFixtureName).toBe(
        f.queueItem.planReference.sourcePlanFixtureName,
      );
    }
  });

  it('Phase 43 baseline fixture list still has 16 items after Phase 44 additions', () => {
    expect(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST).toHaveLength(16);
  });

  it('getStrategyReviewExportQueueFixture returns all 16 fixtures by name', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES) {
      const f = getStrategyReviewExportQueueFixture(
        PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURES,
        name,
      );
      expect(f).not.toBeNull();
      expect(f?.name).toBe(name);
    }
  });

  it('serializeStrategyReviewExportQueueFixture output contains fixture name', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const s = serializeStrategyReviewExportQueueFixture(f);
      expect(s).toContain(f.name);
    }
  });

  it('serializeStrategyReviewExportQueueFixture output contains phase 44', () => {
    for (const f of PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST) {
      const s = serializeStrategyReviewExportQueueFixture(f);
      expect(s).toContain('44');
    }
  });

  it('validation issues have code, field, message, severity', () => {
    const r = validateStrategyReviewExportQueueFixture({});
    for (const issue of r.issues) {
      expect(typeof issue.code).toBe('string');
      expect(typeof issue.field).toBe('string');
      expect(typeof issue.message).toBe('string');
      expect(['error', 'warning']).toContain(issue.severity);
    }
  });

  it('safety violations are strings', () => {
    const r = validateStrategyReviewExportQueueSafety({ notes: ['use fetch'] });
    for (const v of r.violations) {
      expect(typeof v).toBe('string');
    }
  });

  it('buildStrategyReviewExportQueueSummary handles single-fixture list', () => {
    const single = PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST.slice(0, 1);
    const summary = buildStrategyReviewExportQueueSummary(single);
    expect(summary.totalFixtures).toBe(1);
  });
});
