/**
 * apps/dashboard/src/composite-evidence-fixtures/normalization.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Normalization
 *
 * Pure normalization helpers. No mutation, no side effects.
 */

import type {
  CompositeEvidenceDashboardFixture,
  CompositeEvidenceDashboardReportFixture,
  CompositeEvidenceFixtureMeta,
  CompositeEvidenceFixtureSummary,
  CompositeEvidencePanelFixture,
  CompositeEvidenceReportFixture,
  CompositeEvidenceReportSectionFixture,
} from './types.js';
import {
  COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS,
  COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES,
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT,
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function normalizeCompositeEvidenceFixtureMeta(
  meta: CompositeEvidenceFixtureMeta,
): CompositeEvidenceFixtureMeta {
  return {
    ...meta,
    notes: sortStrings(meta.notes),
  };
}

export function normalizeCompositeEvidenceFixtureSummary(
  summary: CompositeEvidenceFixtureSummary,
): CompositeEvidenceFixtureSummary {
  return {
    ...summary,
    notes: sortStrings(summary.notes),
  };
}

export function normalizeCompositeEvidencePanelFixture(
  panel: CompositeEvidencePanelFixture,
): CompositeEvidencePanelFixture {
  return {
    ...panel,
    riskIndicators: sortStrings(panel.riskIndicators),
    qualityIndicators: sortStrings(panel.qualityIndicators),
    confidenceIndicators: sortStrings(panel.confidenceIndicators),
    notes: sortStrings(panel.notes),
  };
}

export function normalizeCompositeEvidenceReportSectionFixture(
  section: CompositeEvidenceReportSectionFixture,
): CompositeEvidenceReportSectionFixture {
  return {
    ...section,
    notes: sortStrings(section.notes),
  };
}

export function normalizeCompositeEvidenceDashboardFixture(
  fixture: CompositeEvidenceDashboardFixture,
): CompositeEvidenceDashboardFixture {
  return {
    ...fixture,
    panels: [...fixture.panels].map(normalizeCompositeEvidencePanelFixture),
    summary: normalizeCompositeEvidenceFixtureSummary(fixture.summary),
    meta: normalizeCompositeEvidenceFixtureMeta(fixture.meta),
    safeNotes: sortStrings(fixture.safeNotes),
  };
}

export function normalizeCompositeEvidenceReportFixture(
  fixture: CompositeEvidenceReportFixture,
): CompositeEvidenceReportFixture {
  return {
    ...fixture,
    sections: [...fixture.sections].map(normalizeCompositeEvidenceReportSectionFixture),
    summary: normalizeCompositeEvidenceFixtureSummary(fixture.summary),
    meta: normalizeCompositeEvidenceFixtureMeta(fixture.meta),
    safeNotes: sortStrings(fixture.safeNotes),
  };
}

export function normalizeCompositeEvidenceDashboardReportFixture(
  fixture: CompositeEvidenceDashboardReportFixture,
): CompositeEvidenceDashboardReportFixture {
  return {
    ...fixture,
    dashboard:
      fixture.dashboard !== null
        ? normalizeCompositeEvidenceDashboardFixture(fixture.dashboard)
        : null,
    report:
      fixture.report !== null ? normalizeCompositeEvidenceReportFixture(fixture.report) : null,
    summary: normalizeCompositeEvidenceFixtureSummary(fixture.summary),
    meta: normalizeCompositeEvidenceFixtureMeta(fixture.meta),
    safeNotes: sortStrings(fixture.safeNotes),
  };
}

export function isCompositeEvidenceDashboardReportFixtureSerializable(
  fixture: CompositeEvidenceDashboardReportFixture,
): boolean {
  try {
    const json = JSON.stringify(fixture);
    const parsed: unknown = JSON.parse(json);
    return parsed !== null && typeof parsed === 'object';
  } catch {
    return false;
  }
}

export function areCompositeEvidenceDashboardReportFixturesEqual(
  a: CompositeEvidenceDashboardReportFixture,
  b: CompositeEvidenceDashboardReportFixture,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function isValidCompositeEvidenceFixtureName(name: unknown): boolean {
  return (
    typeof name === 'string' &&
    (COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES as readonly string[]).includes(name)
  );
}

export function isValidCompositeEvidenceFixtureKind(kind: unknown): boolean {
  return (
    typeof kind === 'string' &&
    (COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS as readonly string[]).includes(kind)
  );
}

export function isValidGeneratedAt(value: unknown): boolean {
  return value === PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT;
}

export function isValidSource(value: unknown): boolean {
  return value === PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE;
}
