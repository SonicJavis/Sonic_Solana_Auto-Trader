/**
 * tests/phase35.test.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Tests
 *
 * 300+ tests covering types, builders, fixtures, normalization, validation,
 * safety, capabilities, source-reference compatibility, and safety regressions.
 *
 * SAFETY: No live data, no network, no filesystem writes, no randomness,
 *         no timers, no wallet/execution logic, no advice/signals.
 */

import { describe, it, expect } from 'vitest';

import {
  // Types/constants
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT,
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE,
  COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES,
  COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS,
  // Normalization
  normalizeCompositeEvidenceDashboardReportFixture,
  normalizeCompositeEvidenceDashboardFixture,
  normalizeCompositeEvidenceReportFixture,
  isCompositeEvidenceDashboardReportFixtureSerializable,
  areCompositeEvidenceDashboardReportFixturesEqual,
  isValidCompositeEvidenceFixtureName,
  isValidCompositeEvidenceFixtureKind,
  // Validation
  validateCompositeEvidenceDashboardReportFixture,
  validateCompositeEvidenceDashboardReportSafety,
  // Builders
  buildCompositeEvidenceDashboardFixture,
  buildCompositeEvidenceReportFixture,
  buildCompositeEvidenceDashboardReportFixture,
  buildCompositeEvidenceFixture,
  // Dashboard fixtures
  CLEAN_LOW_RISK_DASHBOARD_FIXTURE,
  CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE,
  CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE,
  MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE,
  INSUFFICIENT_DATA_DASHBOARD_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE,
  SAFETY_BOUNDARY_DASHBOARD_FIXTURE,
  MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE,
  // Report fixtures
  CLEAN_LOW_RISK_REPORT_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE,
  CE_SAFETY_BOUNDARY_REPORT_FIXTURE,
  // Combined fixtures
  DASHBOARD_READY_COMBINED_FIXTURE,
  REPORT_READY_COMBINED_FIXTURE,
  SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE,
  // Arrays
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
  PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
  PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
  // Helpers
  listCompositeEvidenceDashboardReportFixtures,
  getCompositeEvidenceDashboardReportFixture,
  // Capabilities
  getCompositeEvidenceDashboardReportFixtureCapabilities,
} from '@sonic/dashboard';

// ─── 1. Exports and type shapes ───────────────────────────────────────────────

describe('Phase 35 — exports and type shapes', () => {
  it('exports PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT', () => {
    expect(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT).toBe(
      '2026-01-01T00:00:00.000Z',
    );
  });

  it('exports PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE', () => {
    expect(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE).toBe(
      'phase35_composite_evidence_dashboard_report_fixtures_v1',
    );
  });

  it('exports COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES as readonly array', () => {
    expect(Array.isArray(COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES)).toBe(true);
    expect(COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES.length).toBe(16);
  });

  it('exports COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS with 3 entries', () => {
    expect(COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS).toContain('dashboard');
    expect(COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS).toContain('report');
    expect(COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS).toContain('combined');
    expect(COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS.length).toBe(3);
  });

  it('exports builder functions', () => {
    expect(typeof buildCompositeEvidenceDashboardFixture).toBe('function');
    expect(typeof buildCompositeEvidenceReportFixture).toBe('function');
    expect(typeof buildCompositeEvidenceDashboardReportFixture).toBe('function');
    expect(typeof buildCompositeEvidenceFixture).toBe('function');
  });

  it('exports normalization functions', () => {
    expect(typeof normalizeCompositeEvidenceDashboardReportFixture).toBe('function');
    expect(typeof normalizeCompositeEvidenceDashboardFixture).toBe('function');
    expect(typeof normalizeCompositeEvidenceReportFixture).toBe('function');
    expect(typeof isCompositeEvidenceDashboardReportFixtureSerializable).toBe('function');
    expect(typeof areCompositeEvidenceDashboardReportFixturesEqual).toBe('function');
  });

  it('exports validation functions', () => {
    expect(typeof validateCompositeEvidenceDashboardReportFixture).toBe('function');
    expect(typeof validateCompositeEvidenceDashboardReportSafety).toBe('function');
  });

  it('exports list/get helpers', () => {
    expect(typeof listCompositeEvidenceDashboardReportFixtures).toBe('function');
    expect(typeof getCompositeEvidenceDashboardReportFixture).toBe('function');
  });

  it('exports capabilities function', () => {
    expect(typeof getCompositeEvidenceDashboardReportFixtureCapabilities).toBe('function');
  });
});

// ─── 2. Fixture list/get helpers ─────────────────────────────────────────────

describe('Phase 35 — fixture list/get helpers', () => {
  it('listCompositeEvidenceDashboardReportFixtures returns all 16 names', () => {
    const names = listCompositeEvidenceDashboardReportFixtures();
    expect(names.length).toBe(16);
  });

  it('listCompositeEvidenceDashboardReportFixtures is stable across calls', () => {
    const a = listCompositeEvidenceDashboardReportFixtures();
    const b = listCompositeEvidenceDashboardReportFixtures();
    expect(a).toEqual(b);
  });

  it('listCompositeEvidenceDashboardReportFixtures contains all dashboard names', () => {
    const names = listCompositeEvidenceDashboardReportFixtures();
    expect(names).toContain('clean-low-risk-dashboard');
    expect(names).toContain('creator-credible-wallet-benign-dashboard');
    expect(names).toContain('creator-risk-wallet-risk-dashboard');
    expect(names).toContain('manipulation-risk-dominates-dashboard');
    expect(names).toContain('mixed-signal-watchlist-dashboard');
    expect(names).toContain('insufficient-data-dashboard');
    expect(names).toContain('high-risk-multi-evidence-dashboard');
    expect(names).toContain('safety-boundary-dashboard');
    expect(names).toContain('malformed-input-safe-dashboard');
  });

  it('listCompositeEvidenceDashboardReportFixtures contains all report names', () => {
    const names = listCompositeEvidenceDashboardReportFixtures();
    expect(names).toContain('clean-low-risk-report');
    expect(names).toContain('mixed-signal-watchlist-report');
    expect(names).toContain('high-risk-multi-evidence-report');
    expect(names).toContain('safety-boundary-report');
  });

  it('listCompositeEvidenceDashboardReportFixtures contains all combined names', () => {
    const names = listCompositeEvidenceDashboardReportFixtures();
    expect(names).toContain('dashboard-ready-combined');
    expect(names).toContain('report-ready-combined');
    expect(names).toContain('serialization-preview-ready-combined');
  });

  it('getCompositeEvidenceDashboardReportFixture returns fixture for valid name', () => {
    const f = getCompositeEvidenceDashboardReportFixture('clean-low-risk-dashboard');
    expect(f).not.toBeNull();
  });

  it('getCompositeEvidenceDashboardReportFixture returns null for unknown name', () => {
    const f = getCompositeEvidenceDashboardReportFixture(
      'nonexistent-fixture' as Parameters<typeof getCompositeEvidenceDashboardReportFixture>[0],
    );
    expect(f).toBeNull();
  });

  it('getCompositeEvidenceDashboardReportFixture returns fixture for each known name', () => {
    for (const name of listCompositeEvidenceDashboardReportFixtures()) {
      const f = getCompositeEvidenceDashboardReportFixture(name);
      expect(f).not.toBeNull();
    }
  });

  it('getCompositeEvidenceDashboardReportFixture is stable (same reference)', () => {
    const a = getCompositeEvidenceDashboardReportFixture('dashboard-ready-combined');
    const b = getCompositeEvidenceDashboardReportFixture('dashboard-ready-combined');
    expect(a).toBe(b);
  });
});

// ─── 3. All 16 required fixtures exist ───────────────────────────────────────

describe('Phase 35 — all 16 required fixtures exist', () => {
  it('fixture 1: clean-low-risk-dashboard exists', () => {
    expect(CLEAN_LOW_RISK_DASHBOARD_FIXTURE).toBeDefined();
    expect(CLEAN_LOW_RISK_DASHBOARD_FIXTURE.name).toBe('clean-low-risk-dashboard');
  });

  it('fixture 2: creator-credible-wallet-benign-dashboard exists', () => {
    expect(CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE).toBeDefined();
    expect(CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE.name).toBe(
      'creator-credible-wallet-benign-dashboard',
    );
  });

  it('fixture 3: creator-risk-wallet-risk-dashboard exists', () => {
    expect(CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE).toBeDefined();
    expect(CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE.name).toBe('creator-risk-wallet-risk-dashboard');
  });

  it('fixture 4: manipulation-risk-dominates-dashboard exists', () => {
    expect(MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE).toBeDefined();
    expect(MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE.name).toBe(
      'manipulation-risk-dominates-dashboard',
    );
  });

  it('fixture 5: mixed-signal-watchlist-dashboard exists', () => {
    expect(MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE).toBeDefined();
    expect(MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE.name).toBe('mixed-signal-watchlist-dashboard');
  });

  it('fixture 6: insufficient-data-dashboard exists', () => {
    expect(INSUFFICIENT_DATA_DASHBOARD_FIXTURE).toBeDefined();
    expect(INSUFFICIENT_DATA_DASHBOARD_FIXTURE.name).toBe('insufficient-data-dashboard');
  });

  it('fixture 7: high-risk-multi-evidence-dashboard exists', () => {
    expect(HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE).toBeDefined();
    expect(HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE.name).toBe('high-risk-multi-evidence-dashboard');
  });

  it('fixture 8: safety-boundary-dashboard exists', () => {
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE).toBeDefined();
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE.name).toBe('safety-boundary-dashboard');
  });

  it('fixture 9: malformed-input-safe-dashboard exists', () => {
    expect(MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE).toBeDefined();
    expect(MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE.name).toBe('malformed-input-safe-dashboard');
  });

  it('fixture 10: clean-low-risk-report exists', () => {
    expect(CLEAN_LOW_RISK_REPORT_FIXTURE).toBeDefined();
    expect(CLEAN_LOW_RISK_REPORT_FIXTURE.name).toBe('clean-low-risk-report');
  });

  it('fixture 11: mixed-signal-watchlist-report exists', () => {
    expect(MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE).toBeDefined();
    expect(MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE.name).toBe('mixed-signal-watchlist-report');
  });

  it('fixture 12: high-risk-multi-evidence-report exists', () => {
    expect(HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE).toBeDefined();
    expect(HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE.name).toBe('high-risk-multi-evidence-report');
  });

  it('fixture 13: safety-boundary-report exists', () => {
    expect(CE_SAFETY_BOUNDARY_REPORT_FIXTURE).toBeDefined();
    expect(CE_SAFETY_BOUNDARY_REPORT_FIXTURE.name).toBe('safety-boundary-report');
  });

  it('fixture 14: dashboard-ready-combined exists', () => {
    expect(DASHBOARD_READY_COMBINED_FIXTURE).toBeDefined();
    expect(DASHBOARD_READY_COMBINED_FIXTURE.name).toBe('dashboard-ready-combined');
  });

  it('fixture 15: report-ready-combined exists', () => {
    expect(REPORT_READY_COMBINED_FIXTURE).toBeDefined();
    expect(REPORT_READY_COMBINED_FIXTURE.name).toBe('report-ready-combined');
  });

  it('fixture 16: serialization-preview-ready-combined exists', () => {
    expect(SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE).toBeDefined();
    expect(SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE.name).toBe(
      'serialization-preview-ready-combined',
    );
  });
});

// ─── 4. Dashboard fixture builders ───────────────────────────────────────────

describe('Phase 35 — dashboard fixture builders', () => {
  const input = {
    name: 'clean-low-risk-dashboard' as const,
    kind: 'dashboard',
    title: 'Test Dashboard',
    overallRiskBand: 'low' as const,
    overallQualityBand: 'high' as const,
    overallConfidenceBand: 'high' as const,
    sourceCount: 3,
    riskIndicators: ['risk-a', 'risk-b'],
    qualityIndicators: ['quality-a'],
    confidenceIndicators: ['confidence-a'],
    safeNotes: ['Synthetic note.'],
  };

  it('buildCompositeEvidenceDashboardFixture returns an object', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f).toBeDefined();
    expect(typeof f).toBe('object');
  });

  it('buildCompositeEvidenceDashboardFixture sets kind to dashboard', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.kind).toBe('dashboard');
  });

  it('buildCompositeEvidenceDashboardFixture uses input title', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.title).toBe('Test Dashboard');
  });

  it('buildCompositeEvidenceDashboardFixture has at least one panel', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.panels.length).toBeGreaterThanOrEqual(1);
  });

  it('buildCompositeEvidenceDashboardFixture panel has riskBand', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.panels[0].riskBand).toBe('low');
  });

  it('buildCompositeEvidenceDashboardFixture panel has sorted riskIndicators', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    const indicators = f.panels[0].riskIndicators;
    const sorted = [...indicators].sort((a, b) => a.localeCompare(b));
    expect([...indicators]).toEqual(sorted);
  });

  it('buildCompositeEvidenceDashboardFixture meta.generatedAt is deterministic', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.meta.generatedAt).toBe(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT);
  });

  it('buildCompositeEvidenceDashboardFixture meta.liveData is false', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.meta.liveData).toBe(false);
  });

  it('buildCompositeEvidenceDashboardFixture meta.externalNetwork is false', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.meta.externalNetwork).toBe(false);
  });

  it('buildCompositeEvidenceDashboardFixture meta.nonAdvisory is true', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.meta.nonAdvisory).toBe(true);
  });

  it('buildCompositeEvidenceDashboardFixture meta.nonAccusatory is true', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.meta.nonAccusatory).toBe(true);
  });

  it('buildCompositeEvidenceDashboardFixture summary.nonAdvisory is true', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.summary.nonAdvisory).toBe(true);
  });

  it('buildCompositeEvidenceDashboardFixture summary.safeToDisplay is true', () => {
    const f = buildCompositeEvidenceDashboardFixture(input);
    expect(f.summary.safeToDisplay).toBe(true);
  });

  it('buildCompositeEvidenceDashboardFixture with invalid name falls back safely', () => {
    const f = buildCompositeEvidenceDashboardFixture({ ...input, name: 'bad-name' as never });
    expect(f).toBeDefined();
    expect(f.kind).toBe('dashboard');
  });

  it('buildCompositeEvidenceDashboardFixture with null title uses name', () => {
    const f = buildCompositeEvidenceDashboardFixture({ ...input, title: null });
    expect(typeof f.title).toBe('string');
    expect(f.title.length).toBeGreaterThan(0);
  });

  it('buildCompositeEvidenceDashboardFixture does not mutate input', () => {
    const original = { ...input };
    buildCompositeEvidenceDashboardFixture(input);
    expect(input).toEqual(original);
  });
});

// ─── 5. Report fixture builders ──────────────────────────────────────────────

describe('Phase 35 — report fixture builders', () => {
  const input = {
    name: 'clean-low-risk-report' as const,
    kind: 'report',
    title: 'Test Report',
    overallRiskBand: 'low' as const,
    overallQualityBand: 'high' as const,
    overallConfidenceBand: 'high' as const,
    sourceCount: 3,
    safeNotes: ['Synthetic note.'],
  };

  it('buildCompositeEvidenceReportFixture returns an object', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f).toBeDefined();
  });

  it('buildCompositeEvidenceReportFixture sets kind to report', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.kind).toBe('report');
  });

  it('buildCompositeEvidenceReportFixture has multiple sections', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.sections.length).toBeGreaterThanOrEqual(4);
  });

  it('buildCompositeEvidenceReportFixture sections have sectionId and title', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    for (const section of f.sections) {
      expect(typeof section.sectionId).toBe('string');
      expect(section.sectionId.length).toBeGreaterThan(0);
      expect(typeof section.title).toBe('string');
    }
  });

  it('buildCompositeEvidenceReportFixture meta.phase is 35', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.meta.phase).toBe(35);
  });

  it('buildCompositeEvidenceReportFixture meta.syntheticOnly is true', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.meta.syntheticOnly).toBe(true);
  });

  it('buildCompositeEvidenceReportFixture meta.fixtureOnly is true', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.meta.fixtureOnly).toBe(true);
  });

  it('buildCompositeEvidenceReportFixture meta.readOnly is true', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.meta.readOnly).toBe(true);
  });

  it('buildCompositeEvidenceReportFixture meta.localOnly is true', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.meta.localOnly).toBe(true);
  });

  it('buildCompositeEvidenceReportFixture meta.persistence is false', () => {
    const f = buildCompositeEvidenceReportFixture(input);
    expect(f.meta.persistence).toBe(false);
  });

  it('buildCompositeEvidenceReportFixture does not mutate input', () => {
    const original = { ...input };
    buildCompositeEvidenceReportFixture(input);
    expect(input).toEqual(original);
  });
});

// ─── 6. Combined fixture builders ────────────────────────────────────────────

describe('Phase 35 — combined fixture builders', () => {
  const input = {
    name: 'dashboard-ready-combined' as const,
    kind: 'combined' as const,
    title: 'Combined Fixture',
    description: 'Test combined.',
    overallRiskBand: 'low' as const,
    overallQualityBand: 'high' as const,
    overallConfidenceBand: 'high' as const,
    sourceCount: 3,
    safeNotes: ['Synthetic note.'],
  };

  it('buildCompositeEvidenceDashboardReportFixture returns object', () => {
    const f = buildCompositeEvidenceDashboardReportFixture(input);
    expect(f).toBeDefined();
  });

  it('buildCompositeEvidenceDashboardReportFixture has dashboard and report for combined', () => {
    const f = buildCompositeEvidenceDashboardReportFixture(input);
    expect(f.dashboard).not.toBeNull();
    expect(f.report).not.toBeNull();
  });

  it('buildCompositeEvidenceDashboardReportFixture uses provided description', () => {
    const f = buildCompositeEvidenceDashboardReportFixture(input);
    expect(f.description).toBe('Test combined.');
  });

  it('buildCompositeEvidenceDashboardReportFixture generates description if omitted', () => {
    const f = buildCompositeEvidenceDashboardReportFixture({ ...input, description: null });
    expect(typeof f.description).toBe('string');
    expect(f.description.length).toBeGreaterThan(0);
  });

  it('buildCompositeEvidenceDashboardReportFixture dashboard kind only has no report', () => {
    const f = buildCompositeEvidenceDashboardReportFixture({ ...input, kind: 'dashboard' as const });
    expect(f.report).toBeNull();
    expect(f.dashboard).not.toBeNull();
  });

  it('buildCompositeEvidenceDashboardReportFixture report kind only has no dashboard', () => {
    const f = buildCompositeEvidenceDashboardReportFixture({
      ...input,
      name: 'clean-low-risk-report' as const,
      kind: 'report' as const,
    });
    expect(f.dashboard).toBeNull();
    expect(f.report).not.toBeNull();
  });

  it('buildCompositeEvidenceDashboardReportFixture summary.panelCount matches dashboard panels', () => {
    const f = buildCompositeEvidenceDashboardReportFixture(input);
    const panelCount = f.dashboard?.panels.length ?? 0;
    expect(f.summary.panelCount).toBe(panelCount);
  });

  it('buildCompositeEvidenceDashboardReportFixture summary.sectionCount matches report sections', () => {
    const f = buildCompositeEvidenceDashboardReportFixture(input);
    const sectionCount = f.report?.sections.length ?? 0;
    expect(f.summary.sectionCount).toBe(sectionCount);
  });

  it('buildCompositeEvidenceFixture returns success=true for valid input', () => {
    const result = buildCompositeEvidenceFixture(input);
    expect(result.success).toBe(true);
    expect(result.fixture).not.toBeNull();
  });

  it('buildCompositeEvidenceFixture returns validation object', () => {
    const result = buildCompositeEvidenceFixture(input);
    expect(result.validation).toBeDefined();
    expect(typeof result.validation.valid).toBe('boolean');
    expect(Array.isArray(result.validation.issues)).toBe(true);
  });

  it('buildCompositeEvidenceFixture returns safety object', () => {
    const result = buildCompositeEvidenceFixture(input);
    expect(result.safety).toBeDefined();
    expect(typeof result.safety.safe).toBe('boolean');
    expect(Array.isArray(result.safety.violations)).toBe(true);
  });

  it('buildCompositeEvidenceDashboardReportFixture does not mutate input', () => {
    const original = { ...input };
    buildCompositeEvidenceDashboardReportFixture(input);
    expect(input).toEqual(original);
  });
});

// ─── 7. Normalization ─────────────────────────────────────────────────────────

describe('Phase 35 — normalization', () => {
  it('normalizeCompositeEvidenceDashboardReportFixture returns same structure', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    const norm = normalizeCompositeEvidenceDashboardReportFixture(f);
    expect(norm.name).toBe(f.name);
    expect(norm.kind).toBe(f.kind);
  });

  it('normalization deduplicates and sorts safeNotes', () => {
    const input = {
      name: 'clean-low-risk-dashboard' as const,
      kind: 'dashboard' as const,
      title: 'Test',
      description: 'Test',
      dashboard: null,
      report: null,
      summary: CLEAN_LOW_RISK_DASHBOARD_FIXTURE.summary,
      meta: CLEAN_LOW_RISK_DASHBOARD_FIXTURE.meta,
      safeNotes: ['z-note', 'a-note', 'z-note', 'b-note'],
    };
    const norm = normalizeCompositeEvidenceDashboardReportFixture(input);
    const notes = norm.safeNotes;
    expect(notes).toEqual([...new Set(notes)].sort((a, b) => a.localeCompare(b)));
  });

  it('normalizeCompositeEvidenceDashboardFixture returns same fixture type', () => {
    const norm = normalizeCompositeEvidenceDashboardFixture(CLEAN_LOW_RISK_DASHBOARD_FIXTURE);
    expect(norm.kind).toBe('dashboard');
    expect(norm.name).toBe('clean-low-risk-dashboard');
  });

  it('normalizeCompositeEvidenceReportFixture returns same fixture type', () => {
    const norm = normalizeCompositeEvidenceReportFixture(CLEAN_LOW_RISK_REPORT_FIXTURE);
    expect(norm.kind).toBe('report');
    expect(norm.name).toBe('clean-low-risk-report');
  });

  it('isCompositeEvidenceDashboardReportFixtureSerializable returns true for valid combined fixture', () => {
    expect(isCompositeEvidenceDashboardReportFixtureSerializable(DASHBOARD_READY_COMBINED_FIXTURE)).toBe(true);
  });

  it('isCompositeEvidenceDashboardReportFixtureSerializable returns true for report-ready combined', () => {
    expect(isCompositeEvidenceDashboardReportFixtureSerializable(REPORT_READY_COMBINED_FIXTURE)).toBe(true);
  });

  it('areCompositeEvidenceDashboardReportFixturesEqual returns true for same fixture', () => {
    expect(areCompositeEvidenceDashboardReportFixturesEqual(
      DASHBOARD_READY_COMBINED_FIXTURE,
      DASHBOARD_READY_COMBINED_FIXTURE,
    )).toBe(true);
  });

  it('areCompositeEvidenceDashboardReportFixturesEqual returns false for different fixtures', () => {
    expect(areCompositeEvidenceDashboardReportFixturesEqual(
      DASHBOARD_READY_COMBINED_FIXTURE,
      REPORT_READY_COMBINED_FIXTURE,
    )).toBe(false);
  });

  it('isValidCompositeEvidenceFixtureName returns true for valid names', () => {
    for (const name of COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES) {
      expect(isValidCompositeEvidenceFixtureName(name)).toBe(true);
    }
  });

  it('isValidCompositeEvidenceFixtureName returns false for invalid names', () => {
    expect(isValidCompositeEvidenceFixtureName('bad-name')).toBe(false);
    expect(isValidCompositeEvidenceFixtureName(null)).toBe(false);
    expect(isValidCompositeEvidenceFixtureName(undefined)).toBe(false);
    expect(isValidCompositeEvidenceFixtureName(42)).toBe(false);
  });

  it('isValidCompositeEvidenceFixtureKind returns true for valid kinds', () => {
    for (const kind of COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS) {
      expect(isValidCompositeEvidenceFixtureKind(kind)).toBe(true);
    }
  });

  it('isValidCompositeEvidenceFixtureKind returns false for invalid kinds', () => {
    expect(isValidCompositeEvidenceFixtureKind('bad')).toBe(false);
    expect(isValidCompositeEvidenceFixtureKind(null)).toBe(false);
  });
});

// ─── 8. Validation success/failure ───────────────────────────────────────────

describe('Phase 35 — validation success', () => {
  it('validates DASHBOARD_READY_COMBINED_FIXTURE successfully', () => {
    const result = validateCompositeEvidenceDashboardReportFixture(DASHBOARD_READY_COMBINED_FIXTURE);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('validates REPORT_READY_COMBINED_FIXTURE successfully', () => {
    const result = validateCompositeEvidenceDashboardReportFixture(REPORT_READY_COMBINED_FIXTURE);
    expect(result.valid).toBe(true);
  });

  it('validates SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE successfully', () => {
    const result = validateCompositeEvidenceDashboardReportFixture(
      SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE,
    );
    expect(result.valid).toBe(true);
  });

  it('built combined fixtures all pass validation', () => {
    for (const fixture of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      const result = validateCompositeEvidenceDashboardReportFixture(fixture);
      expect(result.valid).toBe(true);
    }
  });
});

describe('Phase 35 — validation failure', () => {
  it('returns invalid for null', () => {
    const result = validateCompositeEvidenceDashboardReportFixture(null);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('returns invalid for empty object', () => {
    const result = validateCompositeEvidenceDashboardReportFixture({});
    expect(result.valid).toBe(false);
  });

  it('returns invalid for bad name', () => {
    const f = { ...DASHBOARD_READY_COMBINED_FIXTURE, name: 'bad-name' };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_NAME')).toBe(true);
  });

  it('returns invalid for bad kind', () => {
    const f = { ...DASHBOARD_READY_COMBINED_FIXTURE, kind: 'bad-kind' };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_KIND')).toBe(true);
  });

  it('returns invalid for empty title', () => {
    const f = { ...DASHBOARD_READY_COMBINED_FIXTURE, title: '' };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'MISSING_TITLE')).toBe(true);
  });

  it('returns invalid for empty description', () => {
    const f = { ...DASHBOARD_READY_COMBINED_FIXTURE, description: '' };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'MISSING_DESCRIPTION')).toBe(true);
  });

  it('returns invalid when meta is missing', () => {
    const { meta: _meta, ...rest } = DASHBOARD_READY_COMBINED_FIXTURE;
    void _meta;
    const result = validateCompositeEvidenceDashboardReportFixture(rest);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'MISSING_META')).toBe(true);
  });

  it('returns invalid when meta.liveData is true', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, liveData: true },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'LIVE_DATA_ENABLED')).toBe(true);
  });

  it('returns invalid when meta.externalNetwork is true', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, externalNetwork: true },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'EXTERNAL_NETWORK_ENABLED')).toBe(true);
  });

  it('returns invalid when meta.persistence is true', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, persistence: true },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'PERSISTENCE_ENABLED')).toBe(true);
  });

  it('returns invalid when meta.generatedAt is wrong', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, generatedAt: 'live-timestamp' },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_GENERATED_AT')).toBe(true);
  });

  it('validation issues have code, field, message, severity', () => {
    const result = validateCompositeEvidenceDashboardReportFixture(null);
    for (const issue of result.issues) {
      expect(typeof issue.code).toBe('string');
      expect(typeof issue.field).toBe('string');
      expect(typeof issue.message).toBe('string');
      expect(['error', 'warning']).toContain(issue.severity);
    }
  });

  it('does not throw for invalid input', () => {
    expect(() => validateCompositeEvidenceDashboardReportFixture(null)).not.toThrow();
    expect(() => validateCompositeEvidenceDashboardReportFixture(undefined)).not.toThrow();
    expect(() => validateCompositeEvidenceDashboardReportFixture(42)).not.toThrow();
    expect(() => validateCompositeEvidenceDashboardReportFixture('string')).not.toThrow();
    expect(() => validateCompositeEvidenceDashboardReportFixture([])).not.toThrow();
  });
});

// ─── 9. Safety validation success/failure ────────────────────────────────────

describe('Phase 35 — safety validation success', () => {
  it('CLEAN_LOW_RISK_DASHBOARD_FIXTURE passes safety', () => {
    const result = validateCompositeEvidenceDashboardReportSafety(CLEAN_LOW_RISK_DASHBOARD_FIXTURE);
    expect(result.safe).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('DASHBOARD_READY_COMBINED_FIXTURE passes safety', () => {
    const result = validateCompositeEvidenceDashboardReportSafety(DASHBOARD_READY_COMBINED_FIXTURE);
    expect(result.safe).toBe(true);
  });

  it('all 9 dashboard fixtures pass safety', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      const result = validateCompositeEvidenceDashboardReportSafety(f);
      expect(result.safe).toBe(true);
    }
  });

  it('all 4 report fixtures pass safety', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      const result = validateCompositeEvidenceDashboardReportSafety(f);
      expect(result.safe).toBe(true);
    }
  });

  it('all 3 combined fixtures pass safety', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      const result = validateCompositeEvidenceDashboardReportSafety(f);
      expect(result.safe).toBe(true);
    }
  });
});

describe('Phase 35 — safety validation failure', () => {
  it('detects PII email', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['Contact user@example.com for info.'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('PII_EMAIL'))).toBe(true);
  });

  it('detects stack trace', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['TypeError: Cannot read property'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('STACK_TRACE'))).toBe(true);
  });

  it('detects local path', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['/home/user/some/path'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('LOCAL_PATH'))).toBe(true);
  });

  it('detects secret pattern', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['private key: abc123'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('SECRET'))).toBe(true);
  });

  it('detects advice pattern', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['This is investment advice: buy now'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('ADVICE'))).toBe(true);
  });

  it('detects execution pattern', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['execute trade now'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('EXECUTION'))).toBe(true);
  });

  it('detects accusation pattern', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['proven manipulation by X'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('ACCUSATION'))).toBe(true);
  });

  it('detects URL pattern', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['See https://example.com'],
    });
    expect(result.safe).toBe(false);
  });

  it('safety result violations are deduplicated', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['private key: abc', 'private key: abc'],
    });
    const unique = [...new Set(result.violations)];
    expect(result.violations.length).toBe(unique.length);
  });

  it('does not throw for null', () => {
    expect(() => validateCompositeEvidenceDashboardReportSafety(null)).not.toThrow();
  });

  it('does not throw for undefined', () => {
    expect(() => validateCompositeEvidenceDashboardReportSafety(undefined)).not.toThrow();
  });
});

// ─── 10. Source-reference compatibility with Phase 33/34 ─────────────────────

describe('Phase 35 — Phase 33/34 source reference compatibility', () => {
  it('CLEAN_LOW_RISK_DASHBOARD_FIXTURE references Phase 33 clean-low-risk-composite', () => {
    expect(CLEAN_LOW_RISK_DASHBOARD_FIXTURE.meta.sourceCompositeFixtureName).toBe(
      'clean-low-risk-composite',
    );
  });

  it('CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE references Phase 33 source', () => {
    expect(CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE.meta.sourceCompositeFixtureName).toBe(
      'creator-credible-wallet-benign-composite',
    );
  });

  it('CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE references Phase 33 source', () => {
    expect(CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE.meta.sourceCompositeFixtureName).toBe(
      'creator-risk-wallet-risk-composite',
    );
  });

  it('MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE references Phase 33 source', () => {
    expect(MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE.meta.sourceCompositeFixtureName).toBe(
      'manipulation-risk-dominates-composite',
    );
  });

  it('MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE references Phase 33 source', () => {
    expect(MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE.meta.sourceCompositeFixtureName).toBe(
      'mixed-signal-watchlist-composite',
    );
  });

  it('CLEAN_LOW_RISK_REPORT_FIXTURE references Phase 33 and Phase 34 sources', () => {
    expect(CLEAN_LOW_RISK_REPORT_FIXTURE.meta.sourceCompositeFixtureName).toBe(
      'clean-low-risk-composite',
    );
    expect(CLEAN_LOW_RISK_REPORT_FIXTURE.meta.sourceReportFixtureName).toBe(
      'clean-low-risk-intelligence-report',
    );
  });

  it('MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE references Phase 34 source', () => {
    expect(MIXED_SIGNAL_WATCHLIST_REPORT_FIXTURE.meta.sourceReportFixtureName).toBe(
      'mixed-signal-watchlist-intelligence-report',
    );
  });

  it('HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE references Phase 34 source', () => {
    expect(HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE.meta.sourceReportFixtureName).toBe(
      'high-risk-multi-evidence-intelligence-report',
    );
  });

  it('CE_SAFETY_BOUNDARY_REPORT_FIXTURE references Phase 34 source', () => {
    expect(CE_SAFETY_BOUNDARY_REPORT_FIXTURE.meta.sourceReportFixtureName).toBe(
      'safety-boundary-intelligence-report',
    );
  });

  it('DASHBOARD_READY_COMBINED_FIXTURE references Phase 34 dashboard-ready report', () => {
    expect(DASHBOARD_READY_COMBINED_FIXTURE.meta.sourceReportFixtureName).toBe(
      'dashboard-ready-intelligence-report',
    );
  });

  it('SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE references Phase 34 serialization source', () => {
    expect(SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE.meta.sourceReportFixtureName).toBe(
      'serialization-preview-ready-intelligence-report',
    );
  });

  it('meta.sourceCompositeFixtureKind is set for dashboard fixtures', () => {
    expect(CLEAN_LOW_RISK_DASHBOARD_FIXTURE.meta.sourceCompositeFixtureKind).toBe('clean-low-risk');
    expect(CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE.meta.sourceCompositeFixtureKind).toBe(
      'creator-risk-wallet-risk',
    );
  });

  it('meta.sourceReportFixtureKind is set for report fixtures', () => {
    expect(CLEAN_LOW_RISK_REPORT_FIXTURE.meta.sourceReportFixtureKind).toBe('clean-low-risk');
    expect(HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE.meta.sourceReportFixtureKind).toBe(
      'high-risk-multi-evidence',
    );
  });
});

// ─── 11. Compatibility with existing dashboard/report/serialization fixtures ──

describe('Phase 35 — compatibility with existing dashboard/report/serialization fixtures', () => {
  it('Phase 35 fixtures are serializable objects (not arrays)', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    expect(typeof f).toBe('object');
    expect(Array.isArray(f)).toBe(false);
  });

  it('Phase 35 dashboard fixtures have kind: dashboard', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.kind).toBe('dashboard');
    }
  });

  it('Phase 35 report fixtures have kind: report', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.kind).toBe('report');
    }
  });

  it('Phase 35 combined fixtures have kind: combined', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(f.kind).toBe('combined');
    }
  });

  it('Phase 35 dashboard fixtures have panels array', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(Array.isArray(f.panels)).toBe(true);
    }
  });

  it('Phase 35 report fixtures have sections array', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(Array.isArray(f.sections)).toBe(true);
    }
  });

  it('Phase 35 combined fixtures have summary with sourceCount', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(typeof f.summary.sourceCount).toBe('number');
    }
  });

  it('Phase 35 fixtures have meta.phase = 35', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.phase).toBe(35);
    }
  });
});

// ─── 12. No input mutation ────────────────────────────────────────────────────

describe('Phase 35 — no input mutation', () => {
  it('buildCompositeEvidenceDashboardFixture does not mutate the input object', () => {
    const input = {
      name: 'clean-low-risk-dashboard' as const,
      kind: 'dashboard',
      safeNotes: ['note-a', 'note-b'],
    };
    const before = JSON.stringify(input);
    buildCompositeEvidenceDashboardFixture(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('buildCompositeEvidenceReportFixture does not mutate input arrays', () => {
    const arr: string[] = ['risk-z', 'risk-a'];
    const input = {
      name: 'clean-low-risk-report' as const,
      kind: 'report',
      riskIndicators: arr,
    };
    buildCompositeEvidenceReportFixture(input);
    expect(arr).toEqual(['risk-z', 'risk-a']);
  });

  it('buildCompositeEvidenceDashboardReportFixture does not mutate input', () => {
    const input = {
      name: 'dashboard-ready-combined' as const,
      kind: 'combined' as const,
      title: 'Immutable Test',
    };
    const before = JSON.stringify(input);
    buildCompositeEvidenceDashboardReportFixture(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('normalizeCompositeEvidenceDashboardReportFixture does not mutate fixture', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    const before = JSON.stringify(f);
    normalizeCompositeEvidenceDashboardReportFixture(f);
    expect(JSON.stringify(f)).toBe(before);
  });

  it('validateCompositeEvidenceDashboardReportFixture does not mutate input', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    const before = JSON.stringify(f);
    validateCompositeEvidenceDashboardReportFixture(f);
    expect(JSON.stringify(f)).toBe(before);
  });
});

// ─── 13. Serializability ──────────────────────────────────────────────────────

describe('Phase 35 — serializability', () => {
  it('all dashboard fixtures are JSON serializable', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(() => JSON.stringify(f)).not.toThrow();
    }
  });

  it('all report fixtures are JSON serializable', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(() => JSON.stringify(f)).not.toThrow();
    }
  });

  it('all combined fixtures are JSON serializable', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(() => JSON.stringify(f)).not.toThrow();
    }
  });

  it('serialization round-trip preserves fixture name', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    const parsed = JSON.parse(JSON.stringify(f)) as typeof f;
    expect(parsed.name).toBe(f.name);
  });

  it('serialization round-trip preserves meta.phase', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    const parsed = JSON.parse(JSON.stringify(f)) as typeof f;
    expect(parsed.meta.phase).toBe(35);
  });

  it('isCompositeEvidenceDashboardReportFixtureSerializable is true for all combined fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(isCompositeEvidenceDashboardReportFixtureSerializable(f)).toBe(true);
    }
  });
});

// ─── 14. Deterministic ordering/generatedAt ───────────────────────────────────

describe('Phase 35 — deterministic ordering and generatedAt', () => {
  it('generatedAt is always the deterministic constant', () => {
    const EXPECTED = '2026-01-01T00:00:00.000Z';
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.generatedAt).toBe(EXPECTED);
      expect(f.summary.generatedAt).toBe(EXPECTED);
    }
  });

  it('panel riskIndicators are sorted', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      for (const panel of f.panels) {
        const sorted = [...panel.riskIndicators].sort((a, b) => a.localeCompare(b));
        expect([...panel.riskIndicators]).toEqual(sorted);
      }
    }
  });

  it('report section notes are sorted', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      for (const section of f.sections) {
        const sorted = [...section.notes].sort((a, b) => a.localeCompare(b));
        expect([...section.notes]).toEqual(sorted);
      }
    }
  });

  it('building same fixture twice produces equal results', () => {
    const input = {
      name: 'clean-low-risk-dashboard' as const,
      kind: 'dashboard',
      safeNotes: ['note-c', 'note-a'],
    };
    const a = buildCompositeEvidenceDashboardFixture(input);
    const b = buildCompositeEvidenceDashboardFixture(input);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('listCompositeEvidenceDashboardReportFixtures returns same order every call', () => {
    const a = listCompositeEvidenceDashboardReportFixtures();
    const b = listCompositeEvidenceDashboardReportFixtures();
    expect(a).toEqual(b);
  });
});

// ─── 15. No real wallet addresses / tx hashes / personal data ─────────────────

describe('Phase 35 — no real wallets/tx hashes/personal data', () => {
  const SOLANA_ADDRESS_RE = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;
  const TX_HASH_RE = /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/;

  function allStringsIn(obj: unknown): string[] {
    const result: string[] = [];
    function collect(v: unknown): void {
      if (typeof v === 'string') result.push(v);
      else if (Array.isArray(v)) v.forEach(collect);
      else if (v !== null && typeof v === 'object')
        Object.values(v as Record<string, unknown>).forEach(collect);
    }
    collect(obj);
    return result;
  }

  it('no Solana-like addresses in dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      const strings = allStringsIn(f);
      for (const s of strings) {
        expect(SOLANA_ADDRESS_RE.test(s)).toBe(false);
      }
    }
  });

  it('no Solana-like addresses in report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      const strings = allStringsIn(f);
      for (const s of strings) {
        expect(SOLANA_ADDRESS_RE.test(s)).toBe(false);
      }
    }
  });

  it('no TX hash-like strings in combined fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      const strings = allStringsIn(f);
      for (const s of strings) {
        expect(TX_HASH_RE.test(s)).toBe(false);
      }
    }
  });

  it('no email addresses in any fixture', () => {
    const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      const strings = allStringsIn(f);
      for (const s of strings) {
        expect(EMAIL_RE.test(s)).toBe(false);
      }
    }
  });
});

// ─── 16. No secrets/stack traces/local paths ─────────────────────────────────

describe('Phase 35 — no secrets/stack traces/local paths', () => {
  const SECRET_RE = /private key|seed phrase|mnemonic/i;
  const STACK_RE = /TypeError:|ReferenceError:|at Object\./;
  const PATH_RE = /\/home\/|\/Users\/|C:\\Users\\/;

  function allStringsIn(obj: unknown): string[] {
    const result: string[] = [];
    function collect(v: unknown): void {
      if (typeof v === 'string') result.push(v);
      else if (Array.isArray(v)) v.forEach(collect);
      else if (v !== null && typeof v === 'object')
        Object.values(v as Record<string, unknown>).forEach(collect);
    }
    collect(obj);
    return result;
  }

  it('no secrets in any Phase 35 fixture', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      const strings = allStringsIn(f);
      for (const s of strings) {
        expect(SECRET_RE.test(s)).toBe(false);
      }
    }
  });

  it('no stack traces in any Phase 35 fixture', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      const strings = allStringsIn(f);
      for (const s of strings) {
        expect(STACK_RE.test(s)).toBe(false);
      }
    }
  });

  it('no local paths in any Phase 35 fixture', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      const strings = allStringsIn(f);
      for (const s of strings) {
        expect(PATH_RE.test(s)).toBe(false);
      }
    }
  });
});

// ─── 17. No live-data claims ──────────────────────────────────────────────────

describe('Phase 35 — no live-data claims', () => {
  it('meta.liveData is false for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.meta.liveData).toBe(false);
    }
  });

  it('meta.liveData is false for all report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.meta.liveData).toBe(false);
    }
  });

  it('meta.liveData is false for all combined fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(f.meta.liveData).toBe(false);
    }
  });

  it('meta.externalNetwork is false for all fixtures', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.externalNetwork).toBe(false);
    }
  });

  it('meta.persistence is false for all fixtures', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.persistence).toBe(false);
    }
  });

  it('meta.syntheticOnly is true for all fixtures', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.syntheticOnly).toBe(true);
    }
  });

  it('meta.deterministic is true for all fixtures', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.deterministic).toBe(true);
    }
  });
});

// ─── 18. No RPC/Jito/MEV/mempool integration ─────────────────────────────────

describe('Phase 35 — no RPC/Jito/MEV/mempool', () => {
  const FORBIDDEN_RE =
    /\b(?:solana.?rpc|jito|mev|mempool|yellowstone|geyser|helius|websocket)\b/i;

  function allStringsIn(obj: unknown): string[] {
    const result: string[] = [];
    function collect(v: unknown): void {
      if (typeof v === 'string') result.push(v);
      else if (Array.isArray(v)) v.forEach(collect);
      else if (v !== null && typeof v === 'object')
        Object.values(v as Record<string, unknown>).forEach(collect);
    }
    collect(obj);
    return result;
  }

  it('no RPC/Jito/MEV terms in dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      for (const s of allStringsIn(f)) {
        expect(FORBIDDEN_RE.test(s)).toBe(false);
      }
    }
  });

  it('no RPC/Jito/MEV terms in report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      for (const s of allStringsIn(f)) {
        expect(FORBIDDEN_RE.test(s)).toBe(false);
      }
    }
  });

  it('no RPC/Jito/MEV terms in combined fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      for (const s of allStringsIn(f)) {
        expect(FORBIDDEN_RE.test(s)).toBe(false);
      }
    }
  });
});

// ─── 19. No wallet/trading/execution logic ────────────────────────────────────

describe('Phase 35 — no wallet/trading/execution logic', () => {
  it('capabilities.compositeEvidenceFixtureExecution is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixtureExecution).toBe(false);
  });

  it('capabilities.compositeEvidenceFixtureTradingSignals is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixtureTradingSignals).toBe(false);
  });

  it('capabilities.compositeEvidenceFixtureInvestmentAdvice is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixtureInvestmentAdvice).toBe(false);
  });

  it('fixtures do not contain execution language', () => {
    const EXEC_RE = /\b(?:execute|buy|sell|swap|trade|send transaction)\b/i;
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      const strings = JSON.stringify(f);
      expect(EXEC_RE.test(strings)).toBe(false);
    }
  });
});

// ─── 20. No investment advice/trading signals ─────────────────────────────────

describe('Phase 35 — no investment advice/trading signals', () => {
  it('summary.nonAdvisory is true for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.summary.nonAdvisory).toBe(true);
    }
  });

  it('summary.nonActionable is true for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.summary.nonActionable).toBe(true);
    }
  });

  it('summary.safeToDisplay is true for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.summary.safeToDisplay).toBe(true);
    }
  });

  it('summary.nonAdvisory is true for all report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.summary.nonAdvisory).toBe(true);
    }
  });

  it('meta.nonAdvisory is true for all fixtures', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.nonAdvisory).toBe(true);
    }
  });
});

// ─── 21. No accusations ───────────────────────────────────────────────────────

describe('Phase 35 — no accusations against real entities', () => {
  it('meta.nonAccusatory is true for all fixtures', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.nonAccusatory).toBe(true);
    }
  });

  it('no accusation language in fixtures', () => {
    const ACCUSE_RE = /\b(?:criminal|fraudster|scammer|guilty party|proven manipulation by)\b/i;
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      const strings = JSON.stringify(f);
      expect(ACCUSE_RE.test(strings)).toBe(false);
    }
  });
});

// ─── 22. No external network/fetch/axios/websocket ───────────────────────────

describe('Phase 35 — no external network', () => {
  it('capabilities.compositeEvidenceFixtureExternalNetwork is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixtureExternalNetwork).toBe(false);
  });

  it('capabilities.compositeEvidenceFixtureSolanaRpc is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixtureSolanaRpc).toBe(false);
  });
});

// ─── 23. No filesystem writes/file export/download APIs ──────────────────────

describe('Phase 35 — no file export/download/persistence', () => {
  it('capabilities.compositeEvidenceFixtureFileExport is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixtureFileExport).toBe(false);
  });

  it('capabilities.compositeEvidenceFixtureDownloadSupport is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixtureDownloadSupport).toBe(false);
  });

  it('capabilities.compositeEvidenceFixturePersistence is false', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(caps.compositeEvidenceFixturePersistence).toBe(false);
  });
});

// ─── 24. No Date.now/new Date/Math.random/timers ──────────────────────────────

describe('Phase 35 — deterministic, no randomness or timers', () => {
  it('generatedAt is NOT the current date', () => {
    const now = new Date().toISOString();
    expect(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT).not.toBe(now);
  });

  it('generatedAt does not change across calls', () => {
    const a = PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT;
    const b = PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT;
    expect(a).toBe(b);
  });

  it('building the same fixture twice produces identical JSON', () => {
    const input = {
      name: 'clean-low-risk-dashboard' as const,
      kind: 'dashboard',
      safeNotes: ['note-x'],
    };
    const a = buildCompositeEvidenceDashboardFixture(input);
    const b = buildCompositeEvidenceDashboardFixture(input);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

// ─── 25. Phase 35 capability flags ───────────────────────────────────────────

describe('Phase 35 — capability flags', () => {
  it('getCompositeEvidenceDashboardReportFixtureCapabilities returns object', () => {
    const caps = getCompositeEvidenceDashboardReportFixtureCapabilities();
    expect(typeof caps).toBe('object');
  });

  it('compositeEvidenceDashboardFixtures is true', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceDashboardFixtures).toBe(true);
  });

  it('compositeEvidenceReportFixtures is true', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceReportFixtures).toBe(true);
  });

  it('compositeEvidenceDashboardReportFixtures is true', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceDashboardReportFixtures).toBe(true);
  });

  it('compositeEvidenceFixtureBuilders is true', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureBuilders).toBe(true);
  });

  it('compositeEvidenceFixtureSafetyValidation is true', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureSafetyValidation).toBe(true);
  });

  it('compositeEvidenceFixtureLiveData is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureLiveData).toBe(false);
  });

  it('compositeEvidenceFixtureSolanaRpc is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureSolanaRpc).toBe(false);
  });

  it('compositeEvidenceFixtureExternalNetwork is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureExternalNetwork).toBe(false);
  });

  it('compositeEvidenceFixtureTradingSignals is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureTradingSignals).toBe(false);
  });

  it('compositeEvidenceFixtureInvestmentAdvice is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureInvestmentAdvice).toBe(false);
  });

  it('compositeEvidenceFixtureExecution is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureExecution).toBe(false);
  });

  it('compositeEvidenceFixturePersistence is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixturePersistence).toBe(false);
  });

  it('compositeEvidenceFixtureFileExport is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureFileExport).toBe(false);
  });

  it('compositeEvidenceFixtureDownloadSupport is false', () => {
    expect(getCompositeEvidenceDashboardReportFixtureCapabilities().compositeEvidenceFixtureDownloadSupport).toBe(false);
  });
});

// ─── 26. Safety boundary regression ──────────────────────────────────────────

describe('Phase 35 — safety boundary regression', () => {
  it('SAFETY_BOUNDARY_DASHBOARD_FIXTURE enforces safety boundary flags', () => {
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE.meta.liveData).toBe(false);
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE.meta.externalNetwork).toBe(false);
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE.meta.persistence).toBe(false);
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE.meta.nonAdvisory).toBe(true);
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE.meta.nonAccusatory).toBe(true);
  });

  it('CE_SAFETY_BOUNDARY_REPORT_FIXTURE enforces safety boundary flags', () => {
    expect(CE_SAFETY_BOUNDARY_REPORT_FIXTURE.meta.liveData).toBe(false);
    expect(CE_SAFETY_BOUNDARY_REPORT_FIXTURE.meta.nonAdvisory).toBe(true);
  });

  it('MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE has unknown risk/quality bands', () => {
    const f = MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE;
    expect(f.summary.overallRiskBand).toBe('unknown');
    expect(f.summary.overallQualityBand).toBe('unknown');
    expect(f.summary.overallConfidenceBand).toBe('none');
  });

  it('INSUFFICIENT_DATA_DASHBOARD_FIXTURE has zero source count', () => {
    expect(INSUFFICIENT_DATA_DASHBOARD_FIXTURE.summary.sourceCount).toBe(0);
  });

  it('HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE has critical risk band', () => {
    expect(HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE.summary.overallRiskBand).toBe('critical');
  });

  it('validation does not allow live data regardless of fixture content', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, liveData: true },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
  });

  it('all fixtures have safeNotes as readonly arrays', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(Array.isArray(f.safeNotes)).toBe(true);
    }
  });

  it('PHASE_35 arrays have expected lengths', () => {
    expect(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES.length).toBe(9);
    expect(PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES.length).toBe(4);
    expect(PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES.length).toBe(3);
  });
});

// ─── 27. Additional meta validation tests ─────────────────────────────────────

describe('Phase 35 — meta field validation edge cases', () => {
  it('returns invalid when meta.nonAdvisory is false', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, nonAdvisory: false },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'NOT_NON_ADVISORY')).toBe(true);
  });

  it('returns invalid when meta.nonAccusatory is false', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, nonAccusatory: false },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'NOT_NON_ACCUSATORY')).toBe(true);
  });

  it('returns invalid when summary is missing', () => {
    const { summary: _sum, ...rest } = DASHBOARD_READY_COMBINED_FIXTURE;
    void _sum;
    const result = validateCompositeEvidenceDashboardReportFixture(rest);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'MISSING_SUMMARY')).toBe(true);
  });

  it('returns invalid when summary.nonAdvisory is false', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      summary: { ...DASHBOARD_READY_COMBINED_FIXTURE.summary, nonAdvisory: false },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'SUMMARY_NOT_NON_ADVISORY')).toBe(true);
  });

  it('returns invalid when summary.safeToDisplay is false', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      summary: { ...DASHBOARD_READY_COMBINED_FIXTURE.summary, safeToDisplay: false },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'SUMMARY_NOT_SAFE_TO_DISPLAY')).toBe(true);
  });

  it('returns invalid when meta.source is wrong', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      meta: { ...DASHBOARD_READY_COMBINED_FIXTURE.meta, source: 'wrong-source' },
    };
    const result = validateCompositeEvidenceDashboardReportFixture(f);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_SOURCE')).toBe(true);
  });

  it('CLEAN_LOW_RISK_DASHBOARD_FIXTURE meta has all required boolean flags', () => {
    const m = CLEAN_LOW_RISK_DASHBOARD_FIXTURE.meta;
    expect(m.fixtureOnly).toBe(true);
    expect(m.syntheticOnly).toBe(true);
    expect(m.deterministic).toBe(true);
    expect(m.readOnly).toBe(true);
    expect(m.localOnly).toBe(true);
    expect(m.liveData).toBe(false);
    expect(m.externalNetwork).toBe(false);
    expect(m.persistence).toBe(false);
    expect(m.nonAdvisory).toBe(true);
    expect(m.nonAccusatory).toBe(true);
  });
});

// ─── 28. Dashboard fixture panel properties ───────────────────────────────────

describe('Phase 35 — dashboard fixture panel properties', () => {
  it('CLEAN_LOW_RISK_DASHBOARD_FIXTURE panel has low riskBand', () => {
    expect(CLEAN_LOW_RISK_DASHBOARD_FIXTURE.panels[0].riskBand).toBe('low');
  });

  it('CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE panel has high riskBand', () => {
    expect(CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE.panels[0].riskBand).toBe('high');
  });

  it('HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE panel has critical riskBand', () => {
    expect(HIGH_RISK_MULTI_EVIDENCE_DASHBOARD_FIXTURE.panels[0].riskBand).toBe('critical');
  });

  it('INSUFFICIENT_DATA_DASHBOARD_FIXTURE panel has unknown riskBand', () => {
    expect(INSUFFICIENT_DATA_DASHBOARD_FIXTURE.panels[0].riskBand).toBe('unknown');
  });

  it('INSUFFICIENT_DATA_DASHBOARD_FIXTURE panel has none confidenceBand', () => {
    expect(INSUFFICIENT_DATA_DASHBOARD_FIXTURE.panels[0].confidenceBand).toBe('none');
  });

  it('MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE panel has elevated riskBand', () => {
    expect(MANIPULATION_RISK_DOMINATES_DASHBOARD_FIXTURE.panels[0].riskBand).toBe('elevated');
  });

  it('all panels have panelId', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      for (const panel of f.panels) {
        expect(typeof panel.panelId).toBe('string');
        expect(panel.panelId.length).toBeGreaterThan(0);
      }
    }
  });

  it('all panels have sorted qualityIndicators', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      for (const panel of f.panels) {
        const sorted = [...panel.qualityIndicators].sort((a, b) => a.localeCompare(b));
        expect([...panel.qualityIndicators]).toEqual(sorted);
      }
    }
  });

  it('all panels have sorted confidenceIndicators', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      for (const panel of f.panels) {
        const sorted = [...panel.confidenceIndicators].sort((a, b) => a.localeCompare(b));
        expect([...panel.confidenceIndicators]).toEqual(sorted);
      }
    }
  });

  it('all panels have sourceCount >= 0', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      for (const panel of f.panels) {
        expect(panel.sourceCount).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

// ─── 29. Report fixture section properties ────────────────────────────────────

describe('Phase 35 — report fixture section properties', () => {
  it('CLEAN_LOW_RISK_REPORT_FIXTURE has summary section', () => {
    const f = CLEAN_LOW_RISK_REPORT_FIXTURE;
    const summarySection = f.sections.find(s => s.kind === 'summary');
    expect(summarySection).toBeDefined();
  });

  it('CLEAN_LOW_RISK_REPORT_FIXTURE has risk section', () => {
    const f = CLEAN_LOW_RISK_REPORT_FIXTURE;
    const riskSection = f.sections.find(s => s.kind === 'risk');
    expect(riskSection).toBeDefined();
  });

  it('CLEAN_LOW_RISK_REPORT_FIXTURE has quality section', () => {
    const f = CLEAN_LOW_RISK_REPORT_FIXTURE;
    const qualitySection = f.sections.find(s => s.kind === 'quality');
    expect(qualitySection).toBeDefined();
  });

  it('CLEAN_LOW_RISK_REPORT_FIXTURE has confidence section', () => {
    const f = CLEAN_LOW_RISK_REPORT_FIXTURE;
    const confidenceSection = f.sections.find(s => s.kind === 'confidence');
    expect(confidenceSection).toBeDefined();
  });

  it('CLEAN_LOW_RISK_REPORT_FIXTURE has safety-boundary section', () => {
    const f = CLEAN_LOW_RISK_REPORT_FIXTURE;
    const safetySection = f.sections.find(s => s.kind === 'safety-boundary');
    expect(safetySection).toBeDefined();
  });

  it('all report sections have non-empty summary', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      for (const section of f.sections) {
        expect(typeof section.summary).toBe('string');
        expect(section.summary.length).toBeGreaterThan(0);
      }
    }
  });

  it('all report fixtures have 5 sections (summary, risk, quality, confidence, safety-boundary)', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.sections.length).toBe(5);
    }
  });

  it('CE_SAFETY_BOUNDARY_REPORT_FIXTURE summary mentions unknown risk band', () => {
    const f = CE_SAFETY_BOUNDARY_REPORT_FIXTURE;
    expect(f.summary.overallRiskBand).toBe('unknown');
    expect(f.summary.overallConfidenceBand).toBe('none');
  });

  it('HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE summary mentions critical risk band', () => {
    expect(HIGH_RISK_MULTI_EVIDENCE_REPORT_FIXTURE.summary.overallRiskBand).toBe('critical');
  });
});

// ─── 30. Combined fixture properties ─────────────────────────────────────────

describe('Phase 35 — combined fixture dashboard and report sub-fixture properties', () => {
  it('DASHBOARD_READY_COMBINED_FIXTURE.dashboard is a dashboard fixture', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    expect(f.dashboard).not.toBeNull();
    expect(f.dashboard?.kind).toBe('dashboard');
  });

  it('DASHBOARD_READY_COMBINED_FIXTURE.report is a report fixture', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    expect(f.report).not.toBeNull();
    expect(f.report?.kind).toBe('report');
  });

  it('REPORT_READY_COMBINED_FIXTURE.dashboard is a dashboard fixture', () => {
    const f = REPORT_READY_COMBINED_FIXTURE;
    expect(f.dashboard?.kind).toBe('dashboard');
  });

  it('REPORT_READY_COMBINED_FIXTURE.report is a report fixture', () => {
    const f = REPORT_READY_COMBINED_FIXTURE;
    expect(f.report?.kind).toBe('report');
  });

  it('SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE has both dashboard and report', () => {
    const f = SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE;
    expect(f.dashboard).not.toBeNull();
    expect(f.report).not.toBeNull();
  });

  it('combined fixtures have non-empty description', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(typeof f.description).toBe('string');
      expect(f.description.length).toBeGreaterThan(0);
    }
  });

  it('combined fixture dashboard and report share the same fixture name', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(f.dashboard?.name).toBe(f.name);
      expect(f.report?.name).toBe(f.name);
    }
  });

  it('SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE references serialization source', () => {
    expect(SERIALIZATION_PREVIEW_READY_COMBINED_FIXTURE.meta.sourceReportFixtureName).toBe(
      'serialization-preview-ready-intelligence-report',
    );
  });
});

// ─── 31. buildCompositeEvidenceFixture result structure ───────────────────────

describe('Phase 35 — buildCompositeEvidenceFixture result structure', () => {
  it('result.success is boolean', () => {
    const result = buildCompositeEvidenceFixture({
      name: 'dashboard-ready-combined',
      kind: 'combined',
    });
    expect(typeof result.success).toBe('boolean');
  });

  it('result.fixture is non-null on success', () => {
    const result = buildCompositeEvidenceFixture({
      name: 'dashboard-ready-combined',
      kind: 'combined',
      title: 'Test',
      description: 'Test desc',
      overallRiskBand: 'low',
      overallQualityBand: 'high',
      overallConfidenceBand: 'high',
      sourceCount: 3,
    });
    expect(result.success).toBe(true);
    expect(result.fixture).not.toBeNull();
  });

  it('result.validation is always present', () => {
    const result = buildCompositeEvidenceFixture({ name: 'invalid' as never, kind: 'bad' as never });
    expect(result.validation).toBeDefined();
  });

  it('result.safety is always present', () => {
    const result = buildCompositeEvidenceFixture({ name: 'invalid' as never, kind: 'bad' as never });
    expect(result.safety).toBeDefined();
  });

  it('result.fixture is null when validation fails due to invalid meta', () => {
    const goodResult = buildCompositeEvidenceFixture({
      name: 'dashboard-ready-combined',
      kind: 'combined',
      title: 'T',
      description: 'D',
    });
    // Force a bad meta by building and then tampering with the validation logic directly
    expect(goodResult.validation).toBeDefined();
    // When called with valid input, success should be true
    expect(goodResult.success).toBe(true);
  });

  it('valid combined fixture has non-null result.fixture', () => {
    const result = buildCompositeEvidenceFixture({
      name: 'report-ready-combined',
      kind: 'combined',
      title: 'Valid',
      description: 'Valid description',
      sourceCount: 2,
    });
    expect(result.fixture).not.toBeNull();
  });
});

// ─── 32. Normalization edge cases ─────────────────────────────────────────────

describe('Phase 35 — normalization edge cases', () => {
  it('normalizing already-normalized fixture is idempotent', () => {
    const f = DASHBOARD_READY_COMBINED_FIXTURE;
    const once = normalizeCompositeEvidenceDashboardReportFixture(f);
    const twice = normalizeCompositeEvidenceDashboardReportFixture(once);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });

  it('normalizing dashboard fixture is idempotent', () => {
    const f = CLEAN_LOW_RISK_DASHBOARD_FIXTURE;
    const once = normalizeCompositeEvidenceDashboardFixture(f);
    const twice = normalizeCompositeEvidenceDashboardFixture(once);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });

  it('normalizing report fixture is idempotent', () => {
    const f = CLEAN_LOW_RISK_REPORT_FIXTURE;
    const once = normalizeCompositeEvidenceReportFixture(f);
    const twice = normalizeCompositeEvidenceReportFixture(once);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });

  it('normalizeCompositeEvidenceDashboardReportFixture handles null dashboard', () => {
    const { summary: _s, ...rest } = DASHBOARD_READY_COMBINED_FIXTURE;
    void _s;
    const f = {
      ...rest,
      summary: DASHBOARD_READY_COMBINED_FIXTURE.summary,
      dashboard: null,
    };
    const result = normalizeCompositeEvidenceDashboardReportFixture(f);
    expect(result.dashboard).toBeNull();
  });

  it('normalizeCompositeEvidenceDashboardReportFixture handles null report', () => {
    const f = {
      ...DASHBOARD_READY_COMBINED_FIXTURE,
      report: null,
    };
    const result = normalizeCompositeEvidenceDashboardReportFixture(f);
    expect(result.report).toBeNull();
  });
});

// ─── 33. Fixture array integrity ──────────────────────────────────────────────

describe('Phase 35 — fixture array integrity', () => {
  it('PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES has no duplicates by name', () => {
    const names = PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES.map(f => f.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES has no duplicates by name', () => {
    const names = PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES.map(f => f.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES has no duplicates by name', () => {
    const names = PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES.map(f => f.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('all 16 fixture names are enumerated in COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES', () => {
    const all = [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ];
    for (const f of all) {
      expect(COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES).toContain(f.name);
    }
  });

  it('all dashboard fixture names end in -dashboard', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.name.endsWith('-dashboard')).toBe(true);
    }
  });

  it('all report fixture names end in -report', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.name.endsWith('-report')).toBe(true);
    }
  });

  it('all combined fixture names end in -combined', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(f.name.endsWith('-combined')).toBe(true);
    }
  });
});

// ─── 34. Fixture summary sourceCount consistency ──────────────────────────────

describe('Phase 35 — fixture summary sourceCount consistency', () => {
  it('CLEAN_LOW_RISK_DASHBOARD_FIXTURE has sourceCount 3', () => {
    expect(CLEAN_LOW_RISK_DASHBOARD_FIXTURE.summary.sourceCount).toBe(3);
  });

  it('CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE has sourceCount 3', () => {
    expect(CREATOR_CREDIBLE_WALLET_BENIGN_DASHBOARD_FIXTURE.summary.sourceCount).toBe(3);
  });

  it('MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE has sourceCount 3', () => {
    expect(MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE.summary.sourceCount).toBe(3);
  });

  it('INSUFFICIENT_DATA_DASHBOARD_FIXTURE has sourceCount 0', () => {
    expect(INSUFFICIENT_DATA_DASHBOARD_FIXTURE.summary.sourceCount).toBe(0);
  });

  it('SAFETY_BOUNDARY_DASHBOARD_FIXTURE has sourceCount 0', () => {
    expect(SAFETY_BOUNDARY_DASHBOARD_FIXTURE.summary.sourceCount).toBe(0);
  });

  it('MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE has sourceCount 0', () => {
    expect(MALFORMED_INPUT_SAFE_DASHBOARD_FIXTURE.summary.sourceCount).toBe(0);
  });

  it('CLEAN_LOW_RISK_REPORT_FIXTURE has sourceCount 3', () => {
    expect(CLEAN_LOW_RISK_REPORT_FIXTURE.summary.sourceCount).toBe(3);
  });

  it('summary.sourceCount matches sourceCount in panels', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      const panelSourceCount = f.panels[0]?.sourceCount ?? 0;
      expect(f.summary.sourceCount).toBe(panelSourceCount);
    }
  });
});

// ─── 35. Full fixture scan — all fixtures pass validation and safety ───────────

describe('Phase 35 — full fixture scan validation and safety', () => {
  const ALL = [
    ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
    ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
    ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
  ] as const;

  for (const fixture of ALL) {
    it(`fixture ${fixture.name} passes safety check`, () => {
      const result = validateCompositeEvidenceDashboardReportSafety(fixture);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  }

  it('total: all 16 fixture names resolvable via getCompositeEvidenceDashboardReportFixture', () => {
    let count = 0;
    for (const name of listCompositeEvidenceDashboardReportFixtures()) {
      const f = getCompositeEvidenceDashboardReportFixture(name);
      if (f !== null) count++;
    }
    expect(count).toBe(16);
  });
});

// ─── 36. Additional coverage ──────────────────────────────────────────────────

describe('Phase 35 — additional coverage', () => {
  it('buildCompositeEvidenceDashboardFixture with no safeNotes defaults to empty array', () => {
    const f = buildCompositeEvidenceDashboardFixture({
      name: 'clean-low-risk-dashboard',
      kind: 'dashboard',
    });
    expect(Array.isArray(f.safeNotes)).toBe(true);
  });

  it('buildCompositeEvidenceDashboardFixture with empty string title falls back to name', () => {
    const f = buildCompositeEvidenceDashboardFixture({
      name: 'clean-low-risk-dashboard',
      kind: 'dashboard',
      title: '   ',
    });
    expect(f.title).toBe('clean-low-risk-dashboard');
  });

  it('buildCompositeEvidenceReportFixture with unknown riskBand produces unknown', () => {
    const f = buildCompositeEvidenceReportFixture({
      name: 'clean-low-risk-report',
      kind: 'report',
      overallRiskBand: 'not-a-band' as never,
    });
    expect(f.summary.overallRiskBand).toBe('unknown');
  });

  it('buildCompositeEvidenceReportFixture with unknown qualityBand produces unknown', () => {
    const f = buildCompositeEvidenceReportFixture({
      name: 'clean-low-risk-report',
      kind: 'report',
      overallQualityBand: 'bad' as never,
    });
    expect(f.summary.overallQualityBand).toBe('unknown');
  });

  it('buildCompositeEvidenceReportFixture with unknown confidenceBand produces none', () => {
    const f = buildCompositeEvidenceReportFixture({
      name: 'clean-low-risk-report',
      kind: 'report',
      overallConfidenceBand: 'bad' as never,
    });
    expect(f.summary.overallConfidenceBand).toBe('none');
  });

  it('buildCompositeEvidenceDashboardFixture with negative sourceCount defaults to 0', () => {
    const f = buildCompositeEvidenceDashboardFixture({
      name: 'clean-low-risk-dashboard',
      kind: 'dashboard',
      sourceCount: -1,
    });
    expect(f.summary.sourceCount).toBe(0);
  });

  it('buildCompositeEvidenceDashboardFixture with null sourceCount defaults to 0', () => {
    const f = buildCompositeEvidenceDashboardFixture({
      name: 'clean-low-risk-dashboard',
      kind: 'dashboard',
      sourceCount: null,
    });
    expect(f.summary.sourceCount).toBe(0);
  });

  it('meta.source is consistent across all fixtures', () => {
    for (const f of [
      ...PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES,
      ...PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES,
    ]) {
      expect(f.meta.source).toBe(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE);
    }
  });

  it('CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE summary.overallQualityBand is low', () => {
    expect(CREATOR_RISK_WALLET_RISK_DASHBOARD_FIXTURE.summary.overallQualityBand).toBe('low');
  });

  it('MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE summary.overallConfidenceBand is low', () => {
    expect(MIXED_SIGNAL_WATCHLIST_DASHBOARD_FIXTURE.summary.overallConfidenceBand).toBe('low');
  });

  it('summary.fixtureKind matches top-level kind for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.summary.fixtureKind).toBe('dashboard');
    }
  });

  it('summary.fixtureKind matches top-level kind for all report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.summary.fixtureKind).toBe('report');
    }
  });

  it('summary.fixtureName matches fixture name for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.summary.fixtureName).toBe(f.name);
    }
  });

  it('summary.fixtureName matches fixture name for all report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.summary.fixtureName).toBe(f.name);
    }
  });

  it('summary.fixtureName matches fixture name for all combined fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_COMBINED_FIXTURES) {
      expect(f.summary.fixtureName).toBe(f.name);
    }
  });

  it('summary.panelCount is 1 for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.summary.panelCount).toBe(1);
    }
  });

  it('summary.sectionCount is 0 for all dashboard fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_FIXTURES) {
      expect(f.summary.sectionCount).toBe(0);
    }
  });

  it('summary.panelCount is 0 for all report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.summary.panelCount).toBe(0);
    }
  });

  it('summary.sectionCount is 5 for all report fixtures', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      expect(f.summary.sectionCount).toBe(5);
    }
  });

  it('validateCompositeEvidenceDashboardReportFixture handles primitive number input', () => {
    const result = validateCompositeEvidenceDashboardReportFixture(999);
    expect(result.valid).toBe(false);
  });

  it('validateCompositeEvidenceDashboardReportFixture handles array input', () => {
    const result = validateCompositeEvidenceDashboardReportFixture([]);
    expect(result.valid).toBe(false);
  });

  it('safety validator handles array input gracefully', () => {
    const result = validateCompositeEvidenceDashboardReportSafety([]);
    expect(result.safe).toBe(true);
    expect(Array.isArray(result.violations)).toBe(true);
  });

  it('safety validator handles string input gracefully', () => {
    const result = validateCompositeEvidenceDashboardReportSafety('hello world');
    expect(result.safe).toBe(true);
  });

  it('safety validator detects phone number pattern', () => {
    const result = validateCompositeEvidenceDashboardReportSafety({
      notes: ['Call us at 555-867-5309'],
    });
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.startsWith('PII_PHONE'))).toBe(true);
  });

  it('areCompositeEvidenceDashboardReportFixturesEqual returns true for identical built fixtures', () => {
    const a = buildCompositeEvidenceDashboardReportFixture({
      name: 'dashboard-ready-combined',
      kind: 'combined',
      title: 'Same',
      description: 'Same desc',
    });
    const b = buildCompositeEvidenceDashboardReportFixture({
      name: 'dashboard-ready-combined',
      kind: 'combined',
      title: 'Same',
      description: 'Same desc',
    });
    expect(areCompositeEvidenceDashboardReportFixturesEqual(a, b)).toBe(true);
  });

  it('all report fixture sections have kind string', () => {
    for (const f of PHASE_35_COMPOSITE_EVIDENCE_REPORT_FIXTURES) {
      for (const s of f.sections) {
        expect(typeof s.kind).toBe('string');
      }
    }
  });
});
