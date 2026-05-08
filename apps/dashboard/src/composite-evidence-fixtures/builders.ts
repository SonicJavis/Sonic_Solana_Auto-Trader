/**
 * apps/dashboard/src/composite-evidence-fixtures/builders.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Builders
 *
 * Pure builder helpers. No mutation, no randomness, no timers, no network,
 * no filesystem, no browser APIs.
 */

import type {
  CompositeEvidenceDashboardFixture,
  CompositeEvidenceDashboardReportFixture,
  CompositeEvidenceDashboardReportFixtureKind,
  CompositeEvidenceDashboardReportFixtureName,
  CompositeEvidenceFixtureBuildInput,
  CompositeEvidenceFixtureBuildResult,
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
import type {
  OfflineCompositeEvidenceFixtureKind,
  OfflineCompositeEvidenceFixtureName,
} from '@sonic/offline-intelligence';
import type {
  OfflineIntelligenceReportFixtureName,
  OfflineIntelligenceReportKind,
} from '@sonic/offline-intelligence';
import {
  normalizeCompositeEvidenceDashboardFixture,
  normalizeCompositeEvidenceDashboardReportFixture,
  normalizeCompositeEvidenceReportFixture,
} from './normalization.js';
import {
  validateCompositeEvidenceDashboardReportFixture,
  validateCompositeEvidenceDashboardReportSafety,
} from './validation.js';

// ─── Internal helpers ─────────────────────────────────────────────────────────

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function validName(name: unknown): CompositeEvidenceDashboardReportFixtureName | null {
  if (
    typeof name === 'string' &&
    (COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES as readonly string[]).includes(name)
  ) {
    return name as CompositeEvidenceDashboardReportFixtureName;
  }
  return null;
}

function validKind(kind: unknown): CompositeEvidenceDashboardReportFixtureKind | null {
  if (
    typeof kind === 'string' &&
    (COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS as readonly string[]).includes(kind)
  ) {
    return kind as CompositeEvidenceDashboardReportFixtureKind;
  }
  return null;
}

function validRiskBand(
  band: unknown,
): CompositeEvidenceFixtureSummary['overallRiskBand'] {
  const VALID = ['low', 'moderate', 'elevated', 'high', 'critical', 'unknown'] as const;
  return VALID.includes(band as (typeof VALID)[number])
    ? (band as CompositeEvidenceFixtureSummary['overallRiskBand'])
    : 'unknown';
}

function validQualityBand(
  band: unknown,
): CompositeEvidenceFixtureSummary['overallQualityBand'] {
  const VALID = ['low', 'moderate', 'high', 'unknown'] as const;
  return VALID.includes(band as (typeof VALID)[number])
    ? (band as CompositeEvidenceFixtureSummary['overallQualityBand'])
    : 'unknown';
}

function validConfidenceBand(
  band: unknown,
): CompositeEvidenceFixtureSummary['overallConfidenceBand'] {
  const VALID = ['none', 'low', 'moderate', 'high'] as const;
  return VALID.includes(band as (typeof VALID)[number])
    ? (band as CompositeEvidenceFixtureSummary['overallConfidenceBand'])
    : 'none';
}

function buildMeta(
  input: CompositeEvidenceFixtureBuildInput,
  safeNotes: readonly string[],
): CompositeEvidenceFixtureMeta {
  return {
    phase: 35,
    generatedAt: PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT,
    source: PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE,
    sourceCompositeFixtureName:
      (input.sourceCompositeFixtureName as OfflineCompositeEvidenceFixtureName | null) ?? null,
    sourceCompositeFixtureKind:
      (input.sourceCompositeFixtureKind as OfflineCompositeEvidenceFixtureKind | null) ?? null,
    sourceReportFixtureName:
      (input.sourceReportFixtureName as OfflineIntelligenceReportFixtureName | null) ?? null,
    sourceReportFixtureKind:
      (input.sourceReportFixtureKind as OfflineIntelligenceReportKind | null) ?? null,
    fixtureOnly: true,
    syntheticOnly: true,
    deterministic: true,
    readOnly: true,
    localOnly: true,
    liveData: false,
    externalNetwork: false,
    persistence: false,
    nonAdvisory: true,
    nonAccusatory: true,
    notes: sortStrings(safeNotes),
  };
}

function buildSummary(
  name: CompositeEvidenceDashboardReportFixtureName,
  kind: CompositeEvidenceDashboardReportFixtureKind,
  input: CompositeEvidenceFixtureBuildInput,
  panelCount: number,
  sectionCount: number,
): CompositeEvidenceFixtureSummary {
  return {
    fixtureName: name,
    fixtureKind: kind,
    overallRiskBand: validRiskBand(input.overallRiskBand),
    overallQualityBand: validQualityBand(input.overallQualityBand),
    overallConfidenceBand: validConfidenceBand(input.overallConfidenceBand),
    sourceCount: typeof input.sourceCount === 'number' && input.sourceCount >= 0 ? input.sourceCount : 0,
    panelCount,
    sectionCount,
    nonAdvisory: true,
    nonActionable: true,
    safeToDisplay: true,
    generatedAt: PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT,
    notes: sortStrings(input.safeNotes),
  };
}

function buildPanel(input: CompositeEvidenceFixtureBuildInput): CompositeEvidencePanelFixture {
  const name = typeof input.name === 'string' ? input.name : 'unknown';
  return {
    panelId: `panel-${name}`,
    title: typeof input.title === 'string' && input.title.trim() !== '' ? input.title : name,
    kind: typeof input.kind === 'string' ? input.kind : 'combined',
    riskBand: validRiskBand(input.overallRiskBand),
    qualityBand: validQualityBand(input.overallQualityBand),
    confidenceBand: validConfidenceBand(input.overallConfidenceBand),
    sourceCount:
      typeof input.sourceCount === 'number' && input.sourceCount >= 0 ? input.sourceCount : 0,
    riskIndicators: sortStrings(input.riskIndicators),
    qualityIndicators: sortStrings(input.qualityIndicators),
    confidenceIndicators: sortStrings(input.confidenceIndicators),
    notes: sortStrings(input.safeNotes),
  };
}

function buildSection(
  input: CompositeEvidenceFixtureBuildInput,
  kind: string,
  title: string,
): CompositeEvidenceReportSectionFixture {
  const riskBand = validRiskBand(input.overallRiskBand);
  const qualityBand = validQualityBand(input.overallQualityBand);
  const confidenceBand = validConfidenceBand(input.overallConfidenceBand);
  return {
    sectionId: `section-${kind}`,
    title,
    kind,
    summary: `Synthetic ${riskBand} risk / ${qualityBand} quality / ${confidenceBand} confidence.`,
    notes: sortStrings(input.safeNotes),
  };
}

// ─── Public builders ──────────────────────────────────────────────────────────

export function buildCompositeEvidenceDashboardFixture(
  input: CompositeEvidenceFixtureBuildInput,
): CompositeEvidenceDashboardFixture {
  const name = validName(input.name) ?? ('clean-low-risk-dashboard' as const);
  const kind = 'dashboard' as const;
  const title =
    typeof input.title === 'string' && input.title.trim() !== '' ? input.title : name;
  const safeNotes = sortStrings(input.safeNotes);
  const panel = buildPanel(input);
  const summary = buildSummary(name, kind, input, 1, 0);
  const meta = buildMeta(input, safeNotes);

  return normalizeCompositeEvidenceDashboardFixture({
    name,
    kind,
    title,
    panels: [panel],
    summary,
    meta,
    safeNotes,
  });
}

export function buildCompositeEvidenceReportFixture(
  input: CompositeEvidenceFixtureBuildInput,
): CompositeEvidenceReportFixture {
  const name = validName(input.name) ?? ('clean-low-risk-report' as const);
  const kind = 'report' as const;
  const title =
    typeof input.title === 'string' && input.title.trim() !== '' ? input.title : name;
  const safeNotes = sortStrings(input.safeNotes);
  const sections: CompositeEvidenceReportSectionFixture[] = [
    buildSection(input, 'summary', 'Composite Summary'),
    buildSection(input, 'risk', 'Risk Summary'),
    buildSection(input, 'quality', 'Quality Summary'),
    buildSection(input, 'confidence', 'Confidence Summary'),
    buildSection(input, 'safety-boundary', 'Safety Boundary'),
  ];
  const summary = buildSummary(name, kind, input, 0, sections.length);
  const meta = buildMeta(input, safeNotes);

  return normalizeCompositeEvidenceReportFixture({
    name,
    kind,
    title,
    sections,
    summary,
    meta,
    safeNotes,
  });
}

export function buildCompositeEvidenceDashboardReportFixture(
  input: CompositeEvidenceFixtureBuildInput,
): CompositeEvidenceDashboardReportFixture {
  const name = validName(input.name) ?? ('dashboard-ready-combined' as const);
  const kind: CompositeEvidenceDashboardReportFixtureKind =
    validKind(input.kind) ?? 'combined';
  const title =
    typeof input.title === 'string' && input.title.trim() !== '' ? input.title : name;
  const description =
    typeof input.description === 'string' && input.description.trim() !== ''
      ? input.description
      : `Phase 35 composite evidence fixture: ${name}`;
  const safeNotes = sortStrings(input.safeNotes);

  const dashboard =
    kind === 'dashboard' || kind === 'combined'
      ? buildCompositeEvidenceDashboardFixture({ ...input, name, kind: 'dashboard' })
      : null;

  const report =
    kind === 'report' || kind === 'combined'
      ? buildCompositeEvidenceReportFixture({ ...input, name, kind: 'report' })
      : null;

  const panelCount = dashboard ? dashboard.panels.length : 0;
  const sectionCount = report ? report.sections.length : 0;
  const summary = buildSummary(name, kind, input, panelCount, sectionCount);
  const meta = buildMeta(input, safeNotes);

  return normalizeCompositeEvidenceDashboardReportFixture({
    name,
    kind,
    title,
    description,
    dashboard,
    report,
    summary,
    meta,
    safeNotes,
  });
}

// ─── Safe build with validation ───────────────────────────────────────────────

export function buildCompositeEvidenceFixture(
  input: CompositeEvidenceFixtureBuildInput,
): CompositeEvidenceFixtureBuildResult {
  const fixture = buildCompositeEvidenceDashboardReportFixture(input);
  const validation = validateCompositeEvidenceDashboardReportFixture(fixture);
  const safety = validateCompositeEvidenceDashboardReportSafety(fixture);
  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}
