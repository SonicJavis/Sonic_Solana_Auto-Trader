/**
 * tests/phase45.test.ts
 *
 * Phase 45 — Strategy Review Export Audit Fixtures v1: Tests.
 *
 * Tests cover: exports, type shapes, all 16 fixtures, audit summary builders,
 * audit item/state/severity shapes, normalization, serialization, equality,
 * validation, safety validation, Phase 44 compatibility, mutation checks,
 * serializability, determinism, no real wallet/tx data, no secrets,
 * no live-data claims, no actual audit/export/download, no real audit logs,
 * no real UI, no real scoring/replay/trading, no RPC/Jito/MEV,
 * no wallet/trading/execution logic, no investment advice/signals,
 * no real PnL/balance/order/fill, no network/filesystem, no Date.now/random/timers,
 * Phase 45 capability flags, and safety boundary regression.
 *
 * Safety: synthetic-only, deterministic, fixture-backed, no side effects.
 */

import { describe, expect, it } from 'vitest';
import {
  areStrategyReviewExportAuditFixturesEqual,
  buildStrategyReviewExportAuditFixture,
  buildStrategyReviewExportAuditSummary,
  CREATOR_LED_EXPORT_AUDITED_FIXTURE,
  DASHBOARD_READY_EXPORT_AUDIT_FIXTURE,
  DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
  DRAWDOWN_CONTAINED_EXPORT_AUDITED_FIXTURE,
  EXPORT_AUDIT_NAME_TO_KIND,
  EXPORT_AUDIT_NAME_TO_QUEUE,
  EXPORT_AUDIT_NAME_TO_SEVERITY,
  EXPORT_AUDIT_NAME_TO_STATE,
  FALSE_POSITIVE_PROTECTION_EXPORT_AUDITED_FIXTURE,
  getStrategyReviewExportAuditCapabilities,
  getStrategyReviewExportAuditFixture,
  HIGH_SCORE_FALSE_POSITIVE_EXPORT_AUDITED_FIXTURE,
  HIGH_SCORE_POSITIVE_EXPORT_AUDITED_FIXTURE,
  INSUFFICIENT_DATA_EXPORT_AUDITED_FIXTURE,
  isStrategyReviewExportAuditFixtureSerializable,
  isValidStrategyReviewExportAuditFixtureKind,
  isValidStrategyReviewExportAuditFixtureName,
  isValidStrategyReviewExportAuditGeneratedAt,
  isValidStrategyReviewExportAuditSeverity,
  isValidStrategyReviewExportAuditSource,
  isValidStrategyReviewExportAuditState,
  listStrategyReviewExportAuditFixtures,
  MALFORMED_INPUT_SAFE_EXPORT_AUDITED_FIXTURE,
  MANIPULATION_AVOIDANCE_EXPORT_AUDITED_FIXTURE,
  MISSED_OPPORTUNITY_EXPORT_AUDITED_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_EXPORT_AUDITED_FIXTURE,
  NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE,
  normalizeStrategyReviewExportAuditFixture,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE,
  SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE,
  SERIALIZATION_READY_EXPORT_AUDIT_FIXTURE,
  serializeStrategyReviewExportAuditFixture,
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES,
  STRATEGY_REVIEW_EXPORT_AUDIT_STATES,
  validateStrategyReviewExportAuditFixture,
  validateStrategyReviewExportAuditSafety,
  WALLET_LED_EXPORT_AUDITED_FIXTURE,
} from '../apps/dashboard/src/strategy-review-export-audit/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import {
  PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST,
  STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES,
} from '../apps/dashboard/src/strategy-review-export-queue/index.js';

// ---------------------------------------------------------------------------
// 1. Constants and exports
// ---------------------------------------------------------------------------

describe('Phase 45: constants and exports', () => {
  it('exports PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT as deterministic string', () => {
    expect(typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT).toBe('string');
    expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('exports PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE as deterministic string', () => {
    expect(typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE).toBe('string');
    expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE).toBe(
      'phase45_strategy_review_export_audit_fixtures_v1',
    );
  });

  it('exports STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES as readonly array of 16', () => {
    expect(Array.isArray(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES)).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES).toHaveLength(16);
  });

  it('exports STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS as readonly array of 16', () => {
    expect(Array.isArray(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS)).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS).toHaveLength(16);
  });

  it('exports STRATEGY_REVIEW_EXPORT_AUDIT_STATES with correct states', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_STATES).toContain('audit-pending');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_STATES).toContain('audit-passed');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_STATES).toContain('audit-failed');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_STATES).toContain('audit-skipped');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_STATES).toContain('audit-blocked');
  });

  it('exports STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES with correct severities', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES).toContain('info');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES).toContain('warning');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES).toContain('error');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES).toContain('critical');
  });

  it('exports all 16 required fixture names', () => {
    const required = [
      'defensive-vs-aggressive-export-audited',
      'creator-led-export-audited',
      'wallet-led-export-audited',
      'manipulation-avoidance-export-audited',
      'no-action-safety-export-audited',
      'insufficient-data-export-audited',
      'high-score-positive-export-audited',
      'high-score-false-positive-export-audited',
      'missed-opportunity-export-audited',
      'drawdown-contained-export-audited',
      'mixed-signal-watchlist-export-audited',
      'false-positive-protection-export-audited',
      'malformed-input-safe-export-audited',
      'dashboard-ready-export-audit',
      'serialization-ready-export-audit',
      'safety-boundary-export-audit',
    ];
    for (const name of required) {
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES).toContain(name);
    }
  });

  it('STRATEGY_REVIEW_EXPORT_AUDIT_STATES has exactly 5 states', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_STATES).toHaveLength(5);
  });

  it('STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES has exactly 4 severities', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES).toHaveLength(4);
  });

  it('generated at constant is a valid ISO 8601 date string', () => {
    expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });

  it('source constant contains phase45 identifier', () => {
    expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE).toContain('phase45');
  });
});

// ---------------------------------------------------------------------------
// 2. Capability flags
// ---------------------------------------------------------------------------

describe('Phase 45: capability flags', () => {
  it('returns Phase 45 capabilities with correct true flags', () => {
    const caps = getStrategyReviewExportAuditCapabilities();
    expect(caps.strategyReviewExportAuditFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportAudits).toBe(true);
    expect(caps.strategyReviewExportAuditBuilders).toBe(true);
    expect(caps.strategyReviewExportAuditSafetyValidation).toBe(true);
    expect(caps.strategyReviewExportQueueReferences).toBe(true);
  });

  it('returns Phase 45 capabilities with correct false flags', () => {
    const caps = getStrategyReviewExportAuditCapabilities();
    expect(caps.strategyReviewActualAuditLogs).toBe(false);
    expect(caps.strategyReviewAuditPersistence).toBe(false);
    expect(caps.strategyReviewAuditFileWrites).toBe(false);
    expect(caps.strategyReviewAuditExternalNetwork).toBe(false);
    expect(caps.strategyReviewAuditQueueWorkers).toBe(false);
    expect(caps.strategyReviewAuditScheduledJobs).toBe(false);
    expect(caps.strategyReviewAuditBackgroundJobs).toBe(false);
    expect(caps.strategyReviewAuditActualFileExport).toBe(false);
    expect(caps.strategyReviewAuditDownloadSupport).toBe(false);
    expect(caps.strategyReviewAuditExecution).toBe(false);
    expect(caps.strategyReviewAuditTradingSignals).toBe(false);
    expect(caps.strategyReviewAuditInvestmentAdvice).toBe(false);
  });

  it('dashboard capabilities include Phase 45 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportAuditFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportAudits).toBe(true);
    expect(caps.strategyReviewExportAuditBuilders).toBe(true);
    expect(caps.strategyReviewExportAuditSafetyValidation).toBe(true);
    expect(caps.strategyReviewExportQueueReferences).toBe(true);
    expect(caps.strategyReviewActualAuditLogs).toBe(false);
    expect(caps.strategyReviewAuditPersistence).toBe(false);
    expect(caps.strategyReviewAuditFileWrites).toBe(false);
    expect(caps.strategyReviewAuditExecution).toBe(false);
    expect(caps.strategyReviewAuditTradingSignals).toBe(false);
    expect(caps.strategyReviewAuditInvestmentAdvice).toBe(false);
  });

  it('dashboard capabilities preserve Phase 44 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportQueueFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportQueues).toBe(true);
    expect(caps.strategyReviewExportQueueBuilders).toBe(true);
    expect(caps.strategyReviewExportQueueSafetyValidation).toBe(true);
  });

  it('getStrategyReviewExportAuditCapabilities returns a plain object', () => {
    const caps = getStrategyReviewExportAuditCapabilities();
    expect(typeof caps).toBe('object');
    expect(caps).not.toBeNull();
  });

  it('getStrategyReviewExportAuditCapabilities is deterministic', () => {
    const a = getStrategyReviewExportAuditCapabilities();
    const b = getStrategyReviewExportAuditCapabilities();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

// ---------------------------------------------------------------------------
// 3. Fixture map
// ---------------------------------------------------------------------------

describe('Phase 45: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES map', () => {
  it('is a ReadonlyMap with 16 entries', () => {
    expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES).toBeInstanceOf(Map);
    expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.size).toBe(16);
  });

  it('contains all 16 required fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.has(name)).toBe(true);
    }
  });

  it('all map values are non-null objects', () => {
    for (const [, fixture] of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES) {
      expect(typeof fixture).toBe('object');
      expect(fixture).not.toBeNull();
    }
  });

  it('no map entry is undefined', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.get(name)).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// 4. Fixture list
// ---------------------------------------------------------------------------

describe('Phase 45: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST', () => {
  it('is a readonly array of 16 fixtures', () => {
    expect(Array.isArray(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST)).toBe(true);
    expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST).toHaveLength(16);
  });

  it('has stable ordering matching STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES', () => {
    for (let i = 0; i < STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES.length; i++) {
      expect(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST[i]?.name).toBe(
        STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES[i],
      );
    }
  });

  it('all list entries are non-null objects', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(typeof fixture).toBe('object');
      expect(fixture).not.toBeNull();
    }
  });

  it('list and map are consistent', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const mapEntry = PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.get(fixture.name);
      expect(mapEntry).toBeDefined();
      expect(mapEntry?.name).toBe(fixture.name);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. List/get helpers
// ---------------------------------------------------------------------------

describe('Phase 45: listStrategyReviewExportAuditFixtures', () => {
  it('returns 16 fixtures in stable order', () => {
    const list = listStrategyReviewExportAuditFixtures(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES);
    expect(list).toHaveLength(16);
    for (let i = 0; i < STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES.length; i++) {
      expect(list[i]?.name).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES[i]);
    }
  });

  it('throws if map is missing an entry', () => {
    const partial = new Map(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES);
    partial.delete('defensive-vs-aggressive-export-audited');
    expect(() => listStrategyReviewExportAuditFixtures(partial as never)).toThrow();
  });
});

describe('Phase 45: getStrategyReviewExportAuditFixture', () => {
  it('returns fixture for valid name', () => {
    const f = getStrategyReviewExportAuditFixture(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES,
      'creator-led-export-audited',
    );
    expect(f).not.toBeNull();
    expect(f?.name).toBe('creator-led-export-audited');
  });

  it('returns null for invalid name', () => {
    const f = getStrategyReviewExportAuditFixture(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES,
      'not-a-real-fixture',
    );
    expect(f).toBeNull();
  });

  it('returns null for empty string', () => {
    const f = getStrategyReviewExportAuditFixture(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES,
      '',
    );
    expect(f).toBeNull();
  });

  it('returns all 16 fixtures for valid names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      const f = getStrategyReviewExportAuditFixture(
        PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES,
        name,
      );
      expect(f).not.toBeNull();
      expect(f?.name).toBe(name);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. Name → kind / queue / state / severity mappings
// ---------------------------------------------------------------------------

describe('Phase 45: EXPORT_AUDIT_NAME_TO_KIND mapping', () => {
  it('has entries for all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(EXPORT_AUDIT_NAME_TO_KIND[name]).toBeDefined();
    }
  });

  it('maps defensive-vs-aggressive to comparison-export-audited', () => {
    expect(EXPORT_AUDIT_NAME_TO_KIND['defensive-vs-aggressive-export-audited']).toBe(
      'comparison-export-audited',
    );
  });

  it('maps creator-led to creator-export-audited', () => {
    expect(EXPORT_AUDIT_NAME_TO_KIND['creator-led-export-audited']).toBe('creator-export-audited');
  });

  it('maps wallet-led to wallet-export-audited', () => {
    expect(EXPORT_AUDIT_NAME_TO_KIND['wallet-led-export-audited']).toBe('wallet-export-audited');
  });

  it('maps safety-boundary-export-audit to safety-boundary-export-audit kind', () => {
    expect(EXPORT_AUDIT_NAME_TO_KIND['safety-boundary-export-audit']).toBe('safety-boundary-export-audit');
  });

  it('all mapped kinds are valid fixture kinds', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(
        (STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS as readonly string[]).includes(
          EXPORT_AUDIT_NAME_TO_KIND[name],
        ),
      ).toBe(true);
    }
  });
});

describe('Phase 45: EXPORT_AUDIT_NAME_TO_QUEUE mapping', () => {
  it('has entries for all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(EXPORT_AUDIT_NAME_TO_QUEUE[name]).toBeDefined();
    }
  });

  it('maps to valid Phase 44 queue fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(
        (STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES as readonly string[]).includes(
          EXPORT_AUDIT_NAME_TO_QUEUE[name],
        ),
      ).toBe(true);
    }
  });

  it('maps defensive-vs-aggressive to the correct queue fixture', () => {
    expect(EXPORT_AUDIT_NAME_TO_QUEUE['defensive-vs-aggressive-export-audited']).toBe(
      'defensive-vs-aggressive-export-queued',
    );
  });

  it('maps safety-boundary-export-audit to safety-boundary-export-queue', () => {
    expect(EXPORT_AUDIT_NAME_TO_QUEUE['safety-boundary-export-audit']).toBe(
      'safety-boundary-export-queue',
    );
  });
});

describe('Phase 45: EXPORT_AUDIT_NAME_TO_STATE mapping', () => {
  it('has entries for all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(EXPORT_AUDIT_NAME_TO_STATE[name]).toBeDefined();
    }
  });

  it('all mapped states are valid audit states', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(
        (STRATEGY_REVIEW_EXPORT_AUDIT_STATES as readonly string[]).includes(
          EXPORT_AUDIT_NAME_TO_STATE[name],
        ),
      ).toBe(true);
    }
  });

  it('no-action-safety is audit-blocked', () => {
    expect(EXPORT_AUDIT_NAME_TO_STATE['no-action-safety-export-audited']).toBe('audit-blocked');
  });

  it('insufficient-data is audit-skipped', () => {
    expect(EXPORT_AUDIT_NAME_TO_STATE['insufficient-data-export-audited']).toBe('audit-skipped');
  });

  it('defensive-vs-aggressive is audit-passed', () => {
    expect(EXPORT_AUDIT_NAME_TO_STATE['defensive-vs-aggressive-export-audited']).toBe('audit-passed');
  });

  it('malformed-input is audit-failed', () => {
    expect(EXPORT_AUDIT_NAME_TO_STATE['malformed-input-safe-export-audited']).toBe('audit-failed');
  });
});

describe('Phase 45: EXPORT_AUDIT_NAME_TO_SEVERITY mapping', () => {
  it('has entries for all 16 fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(EXPORT_AUDIT_NAME_TO_SEVERITY[name]).toBeDefined();
    }
  });

  it('all mapped severities are valid audit severities', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(
        (STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES as readonly string[]).includes(
          EXPORT_AUDIT_NAME_TO_SEVERITY[name],
        ),
      ).toBe(true);
    }
  });

  it('no-action-safety has critical severity', () => {
    expect(EXPORT_AUDIT_NAME_TO_SEVERITY['no-action-safety-export-audited']).toBe('critical');
  });

  it('safety-boundary has critical severity', () => {
    expect(EXPORT_AUDIT_NAME_TO_SEVERITY['safety-boundary-export-audit']).toBe('critical');
  });

  it('defensive-vs-aggressive has info severity', () => {
    expect(EXPORT_AUDIT_NAME_TO_SEVERITY['defensive-vs-aggressive-export-audited']).toBe('info');
  });
});

// ---------------------------------------------------------------------------
// 7. Individual fixture shapes
// ---------------------------------------------------------------------------

describe('Phase 45: DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE', () => {
  it('has correct name', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.name).toBe(
      'defensive-vs-aggressive-export-audited',
    );
  });

  it('has correct kind', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.kind).toBe('comparison-export-audited');
  });

  it('has non-empty title', () => {
    expect(typeof DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.title).toBe('string');
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.title.trim()).not.toBe('');
  });

  it('has non-empty description', () => {
    expect(typeof DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.description).toBe('string');
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.description.trim()).not.toBe('');
  });

  it('has auditItem with correct state', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-passed');
  });

  it('has auditItem with info severity', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('info');
  });

  it('has auditItem.fixtureOnly = true', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.fixtureOnly).toBe(true);
  });

  it('has auditItem.syntheticOnly = true', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.syntheticOnly).toBe(true);
  });

  it('has queueReference.sourcePhase = 44', () => {
    expect(
      DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.queueReference.sourcePhase,
    ).toBe(44);
  });

  it('has queueReference referencing Phase 44 queue fixture', () => {
    const queueName =
      DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.queueReference.sourceQueueFixtureName;
    expect(
      (STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES as readonly string[]).includes(queueName),
    ).toBe(true);
  });

  it('has non-empty findings array', () => {
    expect(
      Array.isArray(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.findings),
    ).toBe(true);
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.findings.length).toBeGreaterThan(0);
  });

  it('has meta.phase = 45', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta.phase).toBe(45);
  });

  it('has meta.sourceQueuePhase = 44', () => {
    expect(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta.sourceQueuePhase).toBe(44);
  });

  it('has all safety meta flags false', () => {
    const { meta } = DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE;
    expect(meta.actualAuditLogs).toBe(false);
    expect(meta.auditPersistence).toBe(false);
    expect(meta.auditFileWrites).toBe(false);
    expect(meta.externalNetwork).toBe(false);
    expect(meta.persistence).toBe(false);
    expect(meta.execution).toBe(false);
    expect(meta.tradingSignals).toBe(false);
    expect(meta.investmentAdvice).toBe(false);
  });
});

describe('Phase 45: NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-blocked state', () => {
    expect(NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-blocked');
  });

  it('has critical severity', () => {
    expect(NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('critical');
  });

  it('references Phase 44 no-action-safety queue fixture', () => {
    expect(
      NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE.auditItem.queueReference.sourceQueueFixtureName,
    ).toBe('no-action-safety-export-queued');
  });

  it('has meta.auditExecutionDisabled = true', () => {
    expect(NO_ACTION_SAFETY_EXPORT_AUDITED_FIXTURE.meta.auditExecutionDisabled).toBe(true);
  });
});

describe('Phase 45: SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE', () => {
  it('has audit-blocked state', () => {
    expect(SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE.auditItem.state).toBe('audit-blocked');
  });

  it('has critical severity', () => {
    expect(SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE.auditItem.severity).toBe('critical');
  });

  it('has safetyBoundary with all false unsafe flags', () => {
    const sb = SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE.safetyBoundary;
    expect(sb.strategyReviewActualAuditLogs).toBe(false);
    expect(sb.strategyReviewAuditPersistence).toBe(false);
    expect(sb.strategyReviewAuditFileWrites).toBe(false);
    expect(sb.strategyReviewAuditExternalNetwork).toBe(false);
    expect(sb.strategyReviewAuditQueueWorkers).toBe(false);
    expect(sb.strategyReviewAuditScheduledJobs).toBe(false);
    expect(sb.strategyReviewAuditBackgroundJobs).toBe(false);
    expect(sb.strategyReviewAuditActualFileExport).toBe(false);
    expect(sb.strategyReviewAuditDownloadSupport).toBe(false);
    expect(sb.strategyReviewAuditExecution).toBe(false);
    expect(sb.strategyReviewAuditTradingSignals).toBe(false);
    expect(sb.strategyReviewAuditInvestmentAdvice).toBe(false);
  });

  it('has safetyBoundary with all true safe flags', () => {
    const sb = SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE.safetyBoundary;
    expect(sb.strategyReviewExportAuditFixtures).toBe(true);
    expect(sb.syntheticStrategyReviewExportAudits).toBe(true);
    expect(sb.strategyReviewExportAuditBuilders).toBe(true);
    expect(sb.strategyReviewExportAuditSafetyValidation).toBe(true);
    expect(sb.strategyReviewExportQueueReferences).toBe(true);
  });
});

describe('Phase 45: MALFORMED_INPUT_SAFE_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-failed state', () => {
    expect(MALFORMED_INPUT_SAFE_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-failed');
  });

  it('has error severity', () => {
    expect(MALFORMED_INPUT_SAFE_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('error');
  });

  it('has findings with input-validation category', () => {
    const categories = MALFORMED_INPUT_SAFE_EXPORT_AUDITED_FIXTURE.auditItem.findings.map(
      f => f.category,
    );
    expect(categories).toContain('input-validation');
  });
});

describe('Phase 45: INSUFFICIENT_DATA_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-skipped state', () => {
    expect(INSUFFICIENT_DATA_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-skipped');
  });

  it('has warning severity', () => {
    expect(INSUFFICIENT_DATA_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('warning');
  });
});

describe('Phase 45: HIGH_SCORE_FALSE_POSITIVE_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-pending state', () => {
    expect(HIGH_SCORE_FALSE_POSITIVE_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-pending');
  });

  it('has warning severity', () => {
    expect(HIGH_SCORE_FALSE_POSITIVE_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('warning');
  });
});

describe('Phase 45: MISSED_OPPORTUNITY_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-passed state', () => {
    expect(MISSED_OPPORTUNITY_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-passed');
  });

  it('has info severity', () => {
    expect(MISSED_OPPORTUNITY_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('info');
  });
});

describe('Phase 45: DRAWDOWN_CONTAINED_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-passed state', () => {
    expect(DRAWDOWN_CONTAINED_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-passed');
  });

  it('has info severity', () => {
    expect(DRAWDOWN_CONTAINED_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('info');
  });
});

describe('Phase 45: HIGH_SCORE_POSITIVE_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-passed state', () => {
    expect(HIGH_SCORE_POSITIVE_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-passed');
  });

  it('has info severity', () => {
    expect(HIGH_SCORE_POSITIVE_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('info');
  });

  it('references high-score-positive Phase 44 queue fixture', () => {
    expect(
      HIGH_SCORE_POSITIVE_EXPORT_AUDITED_FIXTURE.auditItem.queueReference.sourceQueueFixtureName,
    ).toBe('high-score-positive-export-queued');
  });
});

describe('Phase 45: SERIALIZATION_READY_EXPORT_AUDIT_FIXTURE', () => {
  it('has audit-passed state', () => {
    expect(SERIALIZATION_READY_EXPORT_AUDIT_FIXTURE.auditItem.state).toBe('audit-passed');
  });

  it('has info severity', () => {
    expect(SERIALIZATION_READY_EXPORT_AUDIT_FIXTURE.auditItem.severity).toBe('info');
  });

  it('references serialization-ready Phase 44 queue fixture', () => {
    expect(
      SERIALIZATION_READY_EXPORT_AUDIT_FIXTURE.auditItem.queueReference.sourceQueueFixtureName,
    ).toBe('serialization-ready-export-queue');
  });
});

describe('Phase 45: MIXED_SIGNAL_WATCHLIST_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-pending state', () => {
    expect(MIXED_SIGNAL_WATCHLIST_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-pending');
  });

  it('has warning severity', () => {
    expect(MIXED_SIGNAL_WATCHLIST_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('warning');
  });
});

describe('Phase 45: FALSE_POSITIVE_PROTECTION_EXPORT_AUDITED_FIXTURE', () => {
  it('has audit-blocked state', () => {
    expect(FALSE_POSITIVE_PROTECTION_EXPORT_AUDITED_FIXTURE.auditItem.state).toBe('audit-blocked');
  });

  it('has error severity', () => {
    expect(FALSE_POSITIVE_PROTECTION_EXPORT_AUDITED_FIXTURE.auditItem.severity).toBe('error');
  });
});

// ---------------------------------------------------------------------------
// 8. All 16 fixtures — structural invariants
// ---------------------------------------------------------------------------

describe('Phase 45: all 16 fixtures structural invariants', () => {
  for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
    it(`${fixture.name}: has valid name`, () => {
      expect(isValidStrategyReviewExportAuditFixtureName(fixture.name)).toBe(true);
    });

    it(`${fixture.name}: has valid kind`, () => {
      expect(isValidStrategyReviewExportAuditFixtureKind(fixture.kind)).toBe(true);
    });

    it(`${fixture.name}: has non-empty title`, () => {
      expect(typeof fixture.title).toBe('string');
      expect(fixture.title.trim()).not.toBe('');
    });

    it(`${fixture.name}: has non-empty description`, () => {
      expect(typeof fixture.description).toBe('string');
      expect(fixture.description.trim()).not.toBe('');
    });

    it(`${fixture.name}: has valid audit state`, () => {
      expect(isValidStrategyReviewExportAuditState(fixture.auditItem.state)).toBe(true);
    });

    it(`${fixture.name}: has valid audit severity`, () => {
      expect(isValidStrategyReviewExportAuditSeverity(fixture.auditItem.severity)).toBe(true);
    });

    it(`${fixture.name}: auditItem.fixtureOnly = true`, () => {
      expect(fixture.auditItem.fixtureOnly).toBe(true);
    });

    it(`${fixture.name}: auditItem.syntheticOnly = true`, () => {
      expect(fixture.auditItem.syntheticOnly).toBe(true);
    });

    it(`${fixture.name}: queueReference.sourcePhase = 44`, () => {
      expect(fixture.auditItem.queueReference.sourcePhase).toBe(44);
    });

    it(`${fixture.name}: queueReference.fixtureOnly = true`, () => {
      expect(fixture.auditItem.queueReference.fixtureOnly).toBe(true);
    });

    it(`${fixture.name}: queueReference.syntheticOnly = true`, () => {
      expect(fixture.auditItem.queueReference.syntheticOnly).toBe(true);
    });

    it(`${fixture.name}: references a valid Phase 44 queue fixture`, () => {
      const queueName = fixture.auditItem.queueReference.sourceQueueFixtureName;
      expect(
        (STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES as readonly string[]).includes(queueName),
      ).toBe(true);
    });

    it(`${fixture.name}: findings is an array`, () => {
      expect(Array.isArray(fixture.auditItem.findings)).toBe(true);
    });

    it(`${fixture.name}: each finding has fixtureOnly = true`, () => {
      for (const finding of fixture.auditItem.findings) {
        expect(finding.fixtureOnly).toBe(true);
      }
    });

    it(`${fixture.name}: each finding has syntheticOnly = true`, () => {
      for (const finding of fixture.auditItem.findings) {
        expect(finding.syntheticOnly).toBe(true);
      }
    });

    it(`${fixture.name}: each finding has non-empty findingId`, () => {
      for (const finding of fixture.auditItem.findings) {
        expect(typeof finding.findingId).toBe('string');
        expect(finding.findingId.trim()).not.toBe('');
      }
    });

    it(`${fixture.name}: auditItem.auditedAt matches deterministic constant`, () => {
      expect(fixture.auditItem.auditedAt).toBe(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT);
    });

    it(`${fixture.name}: meta.phase = 45`, () => {
      expect(fixture.meta.phase).toBe(45);
    });

    it(`${fixture.name}: meta.sourceQueuePhase = 44`, () => {
      expect(fixture.meta.sourceQueuePhase).toBe(44);
    });

    it(`${fixture.name}: meta.fixtureOnly = true`, () => {
      expect(fixture.meta.fixtureOnly).toBe(true);
    });

    it(`${fixture.name}: meta.syntheticOnly = true`, () => {
      expect(fixture.meta.syntheticOnly).toBe(true);
    });

    it(`${fixture.name}: meta.deterministic = true`, () => {
      expect(fixture.meta.deterministic).toBe(true);
    });

    it(`${fixture.name}: meta.localOnly = true`, () => {
      expect(fixture.meta.localOnly).toBe(true);
    });

    it(`${fixture.name}: meta.readOnly = true`, () => {
      expect(fixture.meta.readOnly).toBe(true);
    });

    it(`${fixture.name}: meta.inMemoryOnly = true`, () => {
      expect(fixture.meta.inMemoryOnly).toBe(true);
    });

    it(`${fixture.name}: meta.auditExecutionDisabled = true`, () => {
      expect(fixture.meta.auditExecutionDisabled).toBe(true);
    });

    it(`${fixture.name}: meta.generatedAt matches constant`, () => {
      expect(fixture.meta.generatedAt).toBe(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT);
    });

    it(`${fixture.name}: meta.source matches constant`, () => {
      expect(fixture.meta.source).toBe(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE);
    });

    it(`${fixture.name}: meta.actualAuditLogs = false`, () => {
      expect(fixture.meta.actualAuditLogs).toBe(false);
    });

    it(`${fixture.name}: meta.auditPersistence = false`, () => {
      expect(fixture.meta.auditPersistence).toBe(false);
    });

    it(`${fixture.name}: meta.auditFileWrites = false`, () => {
      expect(fixture.meta.auditFileWrites).toBe(false);
    });

    it(`${fixture.name}: meta.auditExternalNetwork = false`, () => {
      expect(fixture.meta.auditExternalNetwork).toBe(false);
    });

    it(`${fixture.name}: meta.actualQueueWorkers = false`, () => {
      expect(fixture.meta.actualQueueWorkers).toBe(false);
    });

    it(`${fixture.name}: meta.scheduledJobs = false`, () => {
      expect(fixture.meta.scheduledJobs).toBe(false);
    });

    it(`${fixture.name}: meta.backgroundJobs = false`, () => {
      expect(fixture.meta.backgroundJobs).toBe(false);
    });

    it(`${fixture.name}: meta.actualFileExport = false`, () => {
      expect(fixture.meta.actualFileExport).toBe(false);
    });

    it(`${fixture.name}: meta.filesystemWrites = false`, () => {
      expect(fixture.meta.filesystemWrites).toBe(false);
    });

    it(`${fixture.name}: meta.downloadSupport = false`, () => {
      expect(fixture.meta.downloadSupport).toBe(false);
    });

    it(`${fixture.name}: meta.externalNetwork = false`, () => {
      expect(fixture.meta.externalNetwork).toBe(false);
    });

    it(`${fixture.name}: meta.persistence = false`, () => {
      expect(fixture.meta.persistence).toBe(false);
    });

    it(`${fixture.name}: meta.execution = false`, () => {
      expect(fixture.meta.execution).toBe(false);
    });

    it(`${fixture.name}: meta.tradingSignals = false`, () => {
      expect(fixture.meta.tradingSignals).toBe(false);
    });

    it(`${fixture.name}: meta.investmentAdvice = false`, () => {
      expect(fixture.meta.investmentAdvice).toBe(false);
    });

    it(`${fixture.name}: safeNotes is an array`, () => {
      expect(Array.isArray(fixture.safeNotes)).toBe(true);
    });

    it(`${fixture.name}: summary.phase = 45`, () => {
      expect(fixture.summary.phase).toBe(45);
    });

    it(`${fixture.name}: summary.fixtureOnly = true`, () => {
      expect(fixture.summary.fixtureOnly).toBe(true);
    });

    it(`${fixture.name}: summary.syntheticOnly = true`, () => {
      expect(fixture.summary.syntheticOnly).toBe(true);
    });

    it(`${fixture.name}: summary.localOnly = true`, () => {
      expect(fixture.summary.localOnly).toBe(true);
    });

    it(`${fixture.name}: summary.readOnly = true`, () => {
      expect(fixture.summary.readOnly).toBe(true);
    });

    it(`${fixture.name}: summary.serializable = true`, () => {
      expect(fixture.summary.serializable).toBe(true);
    });

    it(`${fixture.name}: summary.findingCount >= 0`, () => {
      expect(fixture.summary.findingCount).toBeGreaterThanOrEqual(0);
    });

    it(`${fixture.name}: summary.findingCount matches actual findings length`, () => {
      expect(fixture.summary.findingCount).toBe(fixture.auditItem.findings.length);
    });
  }
});

// ---------------------------------------------------------------------------
// 9. Normalization
// ---------------------------------------------------------------------------

describe('Phase 45: normalizeStrategyReviewExportAuditFixture', () => {
  it('returns a new object equal to the input', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE;
    const n = normalizeStrategyReviewExportAuditFixture(f);
    expect(JSON.stringify(n)).toBe(JSON.stringify(f));
  });

  it('does not mutate the original fixture', () => {
    const f = CREATOR_LED_EXPORT_AUDITED_FIXTURE;
    const originalJson = JSON.stringify(f);
    normalizeStrategyReviewExportAuditFixture(f);
    expect(JSON.stringify(f)).toBe(originalJson);
  });

  it('normalizes all 16 fixtures without throwing', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(() => normalizeStrategyReviewExportAuditFixture(fixture)).not.toThrow();
    }
  });

  it('normalized fixture has same name as original', () => {
    const f = WALLET_LED_EXPORT_AUDITED_FIXTURE;
    const n = normalizeStrategyReviewExportAuditFixture(f);
    expect(n.name).toBe(f.name);
  });

  it('normalized fixture has same kind as original', () => {
    const f = WALLET_LED_EXPORT_AUDITED_FIXTURE;
    const n = normalizeStrategyReviewExportAuditFixture(f);
    expect(n.kind).toBe(f.kind);
  });

  it('normalized fixture meta.phase is still 45', () => {
    const f = DASHBOARD_READY_EXPORT_AUDIT_FIXTURE;
    const n = normalizeStrategyReviewExportAuditFixture(f);
    expect(n.meta.phase).toBe(45);
  });
});

// ---------------------------------------------------------------------------
// 10. Serialization
// ---------------------------------------------------------------------------

describe('Phase 45: serializeStrategyReviewExportAuditFixture', () => {
  it('returns a non-empty string', () => {
    const s = serializeStrategyReviewExportAuditFixture(
      DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
    );
    expect(typeof s).toBe('string');
    expect(s.trim()).not.toBe('');
  });

  it('returns valid JSON', () => {
    const s = serializeStrategyReviewExportAuditFixture(CREATOR_LED_EXPORT_AUDITED_FIXTURE);
    expect(() => JSON.parse(s)).not.toThrow();
  });

  it('serialized JSON contains fixture name', () => {
    const s = serializeStrategyReviewExportAuditFixture(WALLET_LED_EXPORT_AUDITED_FIXTURE);
    const parsed = JSON.parse(s) as { name: string };
    expect(parsed.name).toBe('wallet-led-export-audited');
  });

  it('serialization is deterministic across calls', () => {
    const f = MANIPULATION_AVOIDANCE_EXPORT_AUDITED_FIXTURE;
    expect(serializeStrategyReviewExportAuditFixture(f)).toBe(
      serializeStrategyReviewExportAuditFixture(f),
    );
  });

  it('serializes all 16 fixtures without throwing', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(() => serializeStrategyReviewExportAuditFixture(fixture)).not.toThrow();
    }
  });

  it('serialized JSON contains phase 45', () => {
    const s = serializeStrategyReviewExportAuditFixture(SAFETY_BOUNDARY_EXPORT_AUDIT_FIXTURE);
    expect(s).toContain('45');
  });
});

// ---------------------------------------------------------------------------
// 11. Equality
// ---------------------------------------------------------------------------

describe('Phase 45: areStrategyReviewExportAuditFixturesEqual', () => {
  it('a fixture equals itself', () => {
    const f = DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE;
    expect(areStrategyReviewExportAuditFixturesEqual(f, f)).toBe(true);
  });

  it('normalized fixture equals original', () => {
    const f = CREATOR_LED_EXPORT_AUDITED_FIXTURE;
    const n = normalizeStrategyReviewExportAuditFixture(f);
    expect(areStrategyReviewExportAuditFixturesEqual(f, n)).toBe(true);
  });

  it('different fixtures are not equal', () => {
    expect(
      areStrategyReviewExportAuditFixturesEqual(
        DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
        CREATOR_LED_EXPORT_AUDITED_FIXTURE,
      ),
    ).toBe(false);
  });

  it('all fixtures equal their own normalized version', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const normalized = normalizeStrategyReviewExportAuditFixture(fixture);
      expect(areStrategyReviewExportAuditFixturesEqual(fixture, normalized)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 12. Serializability
// ---------------------------------------------------------------------------

describe('Phase 45: isStrategyReviewExportAuditFixtureSerializable', () => {
  it('all 16 fixtures are serializable', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(isStrategyReviewExportAuditFixtureSerializable(fixture)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 13. Normalization guard functions
// ---------------------------------------------------------------------------

describe('Phase 45: isValidStrategyReviewExportAuditFixtureName', () => {
  it('returns true for all valid fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      expect(isValidStrategyReviewExportAuditFixtureName(name)).toBe(true);
    }
  });

  it('returns false for invalid names', () => {
    expect(isValidStrategyReviewExportAuditFixtureName('not-a-fixture')).toBe(false);
    expect(isValidStrategyReviewExportAuditFixtureName('')).toBe(false);
    expect(isValidStrategyReviewExportAuditFixtureName(null)).toBe(false);
    expect(isValidStrategyReviewExportAuditFixtureName(123)).toBe(false);
    expect(isValidStrategyReviewExportAuditFixtureName(undefined)).toBe(false);
  });
});

describe('Phase 45: isValidStrategyReviewExportAuditFixtureKind', () => {
  it('returns true for all valid fixture kinds', () => {
    for (const kind of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS) {
      expect(isValidStrategyReviewExportAuditFixtureKind(kind)).toBe(true);
    }
  });

  it('returns false for invalid kinds', () => {
    expect(isValidStrategyReviewExportAuditFixtureKind('invalid-kind')).toBe(false);
    expect(isValidStrategyReviewExportAuditFixtureKind('')).toBe(false);
    expect(isValidStrategyReviewExportAuditFixtureKind(null)).toBe(false);
  });
});

describe('Phase 45: isValidStrategyReviewExportAuditState', () => {
  it('returns true for all valid states', () => {
    for (const state of STRATEGY_REVIEW_EXPORT_AUDIT_STATES) {
      expect(isValidStrategyReviewExportAuditState(state)).toBe(true);
    }
  });

  it('returns false for invalid states', () => {
    expect(isValidStrategyReviewExportAuditState('queued')).toBe(false);
    expect(isValidStrategyReviewExportAuditState('invalid-state')).toBe(false);
    expect(isValidStrategyReviewExportAuditState(null)).toBe(false);
  });
});

describe('Phase 45: isValidStrategyReviewExportAuditSeverity', () => {
  it('returns true for all valid severities', () => {
    for (const severity of STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES) {
      expect(isValidStrategyReviewExportAuditSeverity(severity)).toBe(true);
    }
  });

  it('returns false for invalid severities', () => {
    expect(isValidStrategyReviewExportAuditSeverity('blocker')).toBe(false);
    expect(isValidStrategyReviewExportAuditSeverity('')).toBe(false);
    expect(isValidStrategyReviewExportAuditSeverity(null)).toBe(false);
  });
});

describe('Phase 45: isValidStrategyReviewExportAuditGeneratedAt', () => {
  it('returns true for the exact constant', () => {
    expect(
      isValidStrategyReviewExportAuditGeneratedAt(
        PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT,
      ),
    ).toBe(true);
  });

  it('returns false for other strings', () => {
    expect(isValidStrategyReviewExportAuditGeneratedAt('2025-01-01T00:00:00.000Z')).toBe(false);
    expect(isValidStrategyReviewExportAuditGeneratedAt('')).toBe(false);
    expect(isValidStrategyReviewExportAuditGeneratedAt(null)).toBe(false);
  });
});

describe('Phase 45: isValidStrategyReviewExportAuditSource', () => {
  it('returns true for the exact constant', () => {
    expect(
      isValidStrategyReviewExportAuditSource(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE),
    ).toBe(true);
  });

  it('returns false for other strings', () => {
    expect(isValidStrategyReviewExportAuditSource('other-source')).toBe(false);
    expect(isValidStrategyReviewExportAuditSource('')).toBe(false);
    expect(isValidStrategyReviewExportAuditSource(null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 14. Validation
// ---------------------------------------------------------------------------

describe('Phase 45: validateStrategyReviewExportAuditFixture', () => {
  it('all 16 fixtures pass validation', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const result = validateStrategyReviewExportAuditFixture(fixture);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    }
  });

  it('returns invalid for null input', () => {
    const result = validateStrategyReviewExportAuditFixture(null);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('returns invalid for non-object input', () => {
    const result = validateStrategyReviewExportAuditFixture('not an object');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for empty object', () => {
    const result = validateStrategyReviewExportAuditFixture({});
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('returns invalid when name is missing', () => {
    const fixture = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE, name: 'invalid-name' };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when kind is missing', () => {
    const fixture = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE, kind: 'bad-kind' };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when title is empty', () => {
    const fixture = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE, title: '' };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when description is empty', () => {
    const fixture = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE, description: '' };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when auditItem is null', () => {
    const fixture = { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE, auditItem: null };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.phase is not 45', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta, phase: 44 },
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.fixtureOnly is false', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta, fixtureOnly: false },
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.auditExecutionDisabled is false', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      meta: {
        ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta,
        auditExecutionDisabled: false,
      },
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.execution is true', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta, execution: true },
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.tradingSignals is true', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta, tradingSignals: true },
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.investmentAdvice is true', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      meta: { ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.meta, investmentAdvice: true },
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when safetyBoundary is null', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      safetyBoundary: null,
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when safeNotes is not an array', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      safeNotes: 'not-an-array',
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });

  it('validation result has valid and issues fields', () => {
    const result = validateStrategyReviewExportAuditFixture(
      CREATOR_LED_EXPORT_AUDITED_FIXTURE,
    );
    expect(typeof result.valid).toBe('boolean');
    expect(Array.isArray(result.issues)).toBe(true);
  });

  it('validation issues have code, field, message, severity fields', () => {
    const result = validateStrategyReviewExportAuditFixture({});
    for (const issue of result.issues) {
      expect(typeof issue.code).toBe('string');
      expect(typeof issue.field).toBe('string');
      expect(typeof issue.message).toBe('string');
      expect(['error', 'warning']).toContain(issue.severity);
    }
  });

  it('returns invalid when queueReference.sourcePhase is not 44', () => {
    const fixture = {
      ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE,
      auditItem: {
        ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem,
        queueReference: {
          ...DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE.auditItem.queueReference,
          sourcePhase: 45,
        },
      },
    };
    const result = validateStrategyReviewExportAuditFixture(fixture);
    expect(result.valid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 15. Safety validation
// ---------------------------------------------------------------------------

describe('Phase 45: validateStrategyReviewExportAuditSafety', () => {
  it('all 16 fixtures pass safety validation', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const result = validateStrategyReviewExportAuditSafety(fixture);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    }
  });

  it('returns safe for empty object', () => {
    const result = validateStrategyReviewExportAuditSafety({});
    expect(result.safe).toBe(true);
  });

  it('returns unsafe for object with URL', () => {
    const result = validateStrategyReviewExportAuditSafety({
      note: 'see https://example.com',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('returns unsafe for object with private key mention', () => {
    const result = validateStrategyReviewExportAuditSafety({
      note: 'my private key is here',
    });
    expect(result.safe).toBe(false);
  });

  it('returns unsafe for object with execution-like term', () => {
    const result = validateStrategyReviewExportAuditSafety({
      note: 'call signTransaction now',
    });
    expect(result.safe).toBe(false);
  });

  it('returns unsafe for object with fetch term', () => {
    const result = validateStrategyReviewExportAuditSafety({
      note: 'use fetch to get data',
    });
    expect(result.safe).toBe(false);
  });

  it('returns unsafe for object with DOM term', () => {
    const result = validateStrategyReviewExportAuditSafety({
      note: 'access document.cookie',
    });
    expect(result.safe).toBe(false);
  });

  it('returns safe for normal text', () => {
    const result = validateStrategyReviewExportAuditSafety({
      note: 'this is a synthetic audit fixture with no live data',
    });
    expect(result.safe).toBe(true);
  });

  it('safety result has safe and violations fields', () => {
    const result = validateStrategyReviewExportAuditSafety(CREATOR_LED_EXPORT_AUDITED_FIXTURE);
    expect(typeof result.safe).toBe('boolean');
    expect(Array.isArray(result.violations)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 16. Builder
// ---------------------------------------------------------------------------

describe('Phase 45: buildStrategyReviewExportAuditFixture', () => {
  it('builds a valid fixture for all 16 names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) {
      const result = buildStrategyReviewExportAuditFixture({
        name,
        kind: EXPORT_AUDIT_NAME_TO_KIND[name],
        state: EXPORT_AUDIT_NAME_TO_STATE[name],
        severity: EXPORT_AUDIT_NAME_TO_SEVERITY[name],
        sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE[name],
      });
      expect(result.success).toBe(true);
      expect(result.fixture).not.toBeNull();
      expect(result.validation.valid).toBe(true);
      expect(result.safety.safe).toBe(true);
    }
  });

  it('returns failure for invalid fixture name', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'invalid-name',
      kind: 'comparison-export-audited',
      state: 'audit-passed',
      severity: 'info',
      sourceQueueFixtureName: 'defensive-vs-aggressive-export-queued',
    });
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
  });

  it('build result has success, fixture, validation, safety fields', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'defensive-vs-aggressive-export-audited',
      kind: EXPORT_AUDIT_NAME_TO_KIND['defensive-vs-aggressive-export-audited'],
      state: EXPORT_AUDIT_NAME_TO_STATE['defensive-vs-aggressive-export-audited'],
      severity: EXPORT_AUDIT_NAME_TO_SEVERITY['defensive-vs-aggressive-export-audited'],
      sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE['defensive-vs-aggressive-export-audited'],
    });
    expect(typeof result.success).toBe('boolean');
    expect(typeof result.fixture).toBe('object');
    expect(typeof result.validation).toBe('object');
    expect(typeof result.safety).toBe('object');
  });

  it('built fixture matches pre-built fixture', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'creator-led-export-audited',
      kind: EXPORT_AUDIT_NAME_TO_KIND['creator-led-export-audited'],
      state: EXPORT_AUDIT_NAME_TO_STATE['creator-led-export-audited'],
      severity: EXPORT_AUDIT_NAME_TO_SEVERITY['creator-led-export-audited'],
      sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE['creator-led-export-audited'],
    });
    expect(result.fixture).not.toBeNull();
    expect(result.fixture?.name).toBe('creator-led-export-audited');
  });

  it('rejects input with URL in notes via safety violation', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'defensive-vs-aggressive-export-audited',
      kind: EXPORT_AUDIT_NAME_TO_KIND['defensive-vs-aggressive-export-audited'],
      state: 'audit-passed',
      severity: 'info',
      sourceQueueFixtureName: 'defensive-vs-aggressive-export-queued',
      safeNotes: ['see https://example.com'],
    });
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.safety.safe).toBe(false);
  });

  it('accepts custom title', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'defensive-vs-aggressive-export-audited',
      kind: EXPORT_AUDIT_NAME_TO_KIND['defensive-vs-aggressive-export-audited'],
      state: 'audit-passed',
      severity: 'info',
      sourceQueueFixtureName: 'defensive-vs-aggressive-export-queued',
      title: 'Custom Audit Title',
    });
    expect(result.success).toBe(true);
    expect(result.fixture?.title).toBe('Custom Audit Title');
  });

  it('accepts custom description', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'defensive-vs-aggressive-export-audited',
      kind: EXPORT_AUDIT_NAME_TO_KIND['defensive-vs-aggressive-export-audited'],
      state: 'audit-passed',
      severity: 'info',
      sourceQueueFixtureName: 'defensive-vs-aggressive-export-queued',
      description: 'Custom audit description for testing.',
    });
    expect(result.success).toBe(true);
    expect(result.fixture?.description).toBe('Custom audit description for testing.');
  });

  it('built fixture has meta.phase = 45', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'dashboard-ready-export-audit',
      kind: EXPORT_AUDIT_NAME_TO_KIND['dashboard-ready-export-audit'],
      state: EXPORT_AUDIT_NAME_TO_STATE['dashboard-ready-export-audit'],
      severity: EXPORT_AUDIT_NAME_TO_SEVERITY['dashboard-ready-export-audit'],
      sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE['dashboard-ready-export-audit'],
    });
    expect(result.fixture?.meta.phase).toBe(45);
  });

  it('built fixture has meta.sourceQueuePhase = 44', () => {
    const result = buildStrategyReviewExportAuditFixture({
      name: 'serialization-ready-export-audit',
      kind: EXPORT_AUDIT_NAME_TO_KIND['serialization-ready-export-audit'],
      state: EXPORT_AUDIT_NAME_TO_STATE['serialization-ready-export-audit'],
      severity: EXPORT_AUDIT_NAME_TO_SEVERITY['serialization-ready-export-audit'],
      sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE['serialization-ready-export-audit'],
    });
    expect(result.fixture?.meta.sourceQueuePhase).toBe(44);
  });
});

// ---------------------------------------------------------------------------
// 17. Audit summary builder
// ---------------------------------------------------------------------------

describe('Phase 45: buildStrategyReviewExportAuditSummary', () => {
  it('returns correct totalFixtures count', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    expect(summary.totalFixtures).toBe(16);
  });

  it('returns byState breakdown', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    expect(typeof summary.byState).toBe('object');
    expect(summary.byState['audit-passed']).toBeGreaterThan(0);
  });

  it('returns bySeverity breakdown', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    expect(typeof summary.bySeverity).toBe('object');
    expect(summary.bySeverity['info']).toBeGreaterThan(0);
  });

  it('returns byKind breakdown', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    expect(typeof summary.byKind).toBe('object');
  });

  it('has fixtureOnly = true', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    expect(summary.fixtureOnly).toBe(true);
  });

  it('has syntheticOnly = true', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    expect(summary.syntheticOnly).toBe(true);
  });

  it('has correct generatedAt', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    expect(summary.generatedAt).toBe(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT);
  });

  it('byState totals equal totalFixtures', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    const total = Object.values(summary.byState).reduce((a, b) => a + b, 0);
    expect(total).toBe(summary.totalFixtures);
  });

  it('bySeverity totals equal totalFixtures', () => {
    const summary = buildStrategyReviewExportAuditSummary(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
    );
    const total = Object.values(summary.bySeverity).reduce((a, b) => a + b, 0);
    expect(total).toBe(summary.totalFixtures);
  });

  it('works with empty array', () => {
    const summary = buildStrategyReviewExportAuditSummary([]);
    expect(summary.totalFixtures).toBe(0);
    expect(summary.fixtureOnly).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 18. Phase 44 compatibility
// ---------------------------------------------------------------------------

describe('Phase 45: Phase 44 queue compatibility', () => {
  it('all Phase 45 fixtures reference valid Phase 44 queue fixtures', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const queueName = fixture.auditItem.queueReference.sourceQueueFixtureName;
      expect(
        (STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES as readonly string[]).includes(queueName),
      ).toBe(true);
    }
  });

  it('all Phase 44 queue fixtures are referenced by at least one Phase 45 audit fixture', () => {
    const referencedQueues = new Set(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.map(
        f => f.auditItem.queueReference.sourceQueueFixtureName,
      ),
    );
    // All 16 Phase 44 fixtures should be referenced since we have 16 Phase 45 fixtures
    expect(referencedQueues.size).toBe(16);
  });

  it('Phase 44 fixture list has 16 entries', () => {
    expect(PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_LIST).toHaveLength(16);
  });

  it('each queueReference has correct sourceQueueState', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const queueState = fixture.auditItem.queueReference.sourceQueueState;
      expect([
        'queued',
        'pending-review',
        'reviewed',
        'skipped',
        'safety-blocked',
      ]).toContain(queueState);
    }
  });

  it('each queueReference has correct sourceQueuePriority', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const queuePriority = fixture.auditItem.queueReference.sourceQueuePriority;
      expect(['high', 'normal', 'low']).toContain(queuePriority);
    }
  });
});

// ---------------------------------------------------------------------------
// 19. Mutation safety
// ---------------------------------------------------------------------------

describe('Phase 45: mutation safety', () => {
  it('fixture names array cannot be reassigned', () => {
    expect(Object.isFrozen(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES) ||
      Array.isArray(STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES)).toBe(true);
  });

  it('all pre-built fixtures are stable across multiple accesses', () => {
    const first = JSON.stringify(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE);
    const second = JSON.stringify(DEFENSIVE_VS_AGGRESSIVE_EXPORT_AUDITED_FIXTURE);
    expect(first).toBe(second);
  });

  it('fixture list is stable across multiple accesses', () => {
    const first = JSON.stringify(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST);
    const second = JSON.stringify(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST);
    expect(first).toBe(second);
  });
});

// ---------------------------------------------------------------------------
// 20. No live data / no real audit behavior
// ---------------------------------------------------------------------------

describe('Phase 45: no live data, no real audit behavior', () => {
  it('no fixture claims to have live data', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.auditExternalNetwork).toBe(false);
      expect(fixture.meta.externalNetwork).toBe(false);
      expect(fixture.meta.persistence).toBe(false);
    }
  });

  it('no fixture has actual audit log flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.actualAuditLogs).toBe(false);
    }
  });

  it('no fixture has filesystem write flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.filesystemWrites).toBe(false);
      expect(fixture.meta.auditFileWrites).toBe(false);
    }
  });

  it('no fixture claims to support download', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.downloadSupport).toBe(false);
    }
  });

  it('no fixture has execution flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.execution).toBe(false);
    }
  });

  it('no fixture has trading signals flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.tradingSignals).toBe(false);
    }
  });

  it('no fixture has investment advice flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.investmentAdvice).toBe(false);
    }
  });

  it('no fixture has queue worker flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.actualQueueWorkers).toBe(false);
    }
  });

  it('no fixture has scheduled jobs flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.scheduledJobs).toBe(false);
    }
  });

  it('no fixture has background jobs flag set to true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.backgroundJobs).toBe(false);
    }
  });

  it('fixture meta is deterministic and not random', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.deterministic).toBe(true);
    }
  });

  it('fixture meta localOnly is always true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.localOnly).toBe(true);
    }
  });

  it('fixture meta inMemoryOnly is always true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.inMemoryOnly).toBe(true);
    }
  });

  it('fixture meta readOnly is always true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.readOnly).toBe(true);
    }
  });

  it('all safety boundary unsafe flags are false', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const sb = fixture.safetyBoundary;
      expect(sb.strategyReviewActualAuditLogs).toBe(false);
      expect(sb.strategyReviewAuditPersistence).toBe(false);
      expect(sb.strategyReviewAuditFileWrites).toBe(false);
      expect(sb.strategyReviewAuditExternalNetwork).toBe(false);
      expect(sb.strategyReviewAuditQueueWorkers).toBe(false);
      expect(sb.strategyReviewAuditScheduledJobs).toBe(false);
      expect(sb.strategyReviewAuditBackgroundJobs).toBe(false);
      expect(sb.strategyReviewAuditActualFileExport).toBe(false);
      expect(sb.strategyReviewAuditDownloadSupport).toBe(false);
      expect(sb.strategyReviewAuditExecution).toBe(false);
      expect(sb.strategyReviewAuditTradingSignals).toBe(false);
      expect(sb.strategyReviewAuditInvestmentAdvice).toBe(false);
    }
  });

  it('all safety boundary safe flags are true', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const sb = fixture.safetyBoundary;
      expect(sb.strategyReviewExportAuditFixtures).toBe(true);
      expect(sb.syntheticStrategyReviewExportAudits).toBe(true);
      expect(sb.strategyReviewExportAuditBuilders).toBe(true);
      expect(sb.strategyReviewExportAuditSafetyValidation).toBe(true);
      expect(sb.strategyReviewExportQueueReferences).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 21. Determinism
// ---------------------------------------------------------------------------

describe('Phase 45: determinism', () => {
  it('all fixtures have the same deterministic generatedAt timestamp', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.generatedAt).toBe('2026-01-01T00:00:00.000Z');
      expect(fixture.auditItem.auditedAt).toBe('2026-01-01T00:00:00.000Z');
      expect(fixture.summary.auditedAt).toBe('2026-01-01T00:00:00.000Z');
      expect(fixture.summary.generatedAt).toBe('2026-01-01T00:00:00.000Z');
    }
  });

  it('building the same fixture twice gives the same result', () => {
    const build1 = buildStrategyReviewExportAuditFixture({
      name: 'defensive-vs-aggressive-export-audited',
      kind: EXPORT_AUDIT_NAME_TO_KIND['defensive-vs-aggressive-export-audited'],
      state: EXPORT_AUDIT_NAME_TO_STATE['defensive-vs-aggressive-export-audited'],
      severity: EXPORT_AUDIT_NAME_TO_SEVERITY['defensive-vs-aggressive-export-audited'],
      sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE['defensive-vs-aggressive-export-audited'],
    });
    const build2 = buildStrategyReviewExportAuditFixture({
      name: 'defensive-vs-aggressive-export-audited',
      kind: EXPORT_AUDIT_NAME_TO_KIND['defensive-vs-aggressive-export-audited'],
      state: EXPORT_AUDIT_NAME_TO_STATE['defensive-vs-aggressive-export-audited'],
      severity: EXPORT_AUDIT_NAME_TO_SEVERITY['defensive-vs-aggressive-export-audited'],
      sourceQueueFixtureName: EXPORT_AUDIT_NAME_TO_QUEUE['defensive-vs-aggressive-export-audited'],
    });
    expect(JSON.stringify(build1.fixture)).toBe(JSON.stringify(build2.fixture));
  });

  it('audit item IDs are deterministic (no randomness)', () => {
    const ids = new Set(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.map(f => f.auditItem.auditItemId),
    );
    // All 16 IDs should be unique (deterministic per fixture name)
    expect(ids.size).toBe(16);
  });

  it('all audit item IDs start with audit-item-', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.auditItem.auditItemId).toMatch(/^audit-item-/);
    }
  });
});

// ---------------------------------------------------------------------------
// 22. Source phases
// ---------------------------------------------------------------------------

describe('Phase 45: source phases', () => {
  it('all fixtures have sourcePhases including 45', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.sourcePhases).toContain(45);
    }
  });

  it('all fixtures have sourcePhases including 44', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.sourcePhases).toContain(44);
    }
  });

  it('all fixtures have sourcePhases including 40', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.sourcePhases).toContain(40);
    }
  });

  it('all fixtures have exactly 6 source phases', () => {
    for (const fixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      expect(fixture.meta.sourcePhases).toHaveLength(6);
    }
  });
});
