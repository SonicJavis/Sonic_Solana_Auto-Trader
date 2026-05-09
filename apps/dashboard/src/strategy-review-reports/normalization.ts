import type {
  StrategyReviewDashboardReference,
  StrategyReviewReportFixture,
  StrategyReviewReportFixtureKind,
  StrategyReviewReportFixtureName,
  StrategyReviewReportSectionFixture,
  StrategyReviewReportTableFixture,
} from './types.js';
import {
  PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT,
  PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE,
  STRATEGY_REVIEW_REPORT_FIXTURE_KINDS,
  STRATEGY_REVIEW_REPORT_FIXTURE_NAMES,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function normalizeDashboardReference(
  reference: StrategyReviewDashboardReference,
): StrategyReviewDashboardReference {
  return { ...reference, notes: sortStrings(reference.notes) };
}

function normalizeTable(table: StrategyReviewReportTableFixture): StrategyReviewReportTableFixture {
  return {
    ...table,
    columns: [...table.columns].sort((a, b) => a.columnId.localeCompare(b.columnId)),
    rows: [...table.rows]
      .map(row => ({
        ...row,
        notes: sortStrings(row.notes),
        cells: Object.fromEntries(Object.entries(row.cells).sort(([a], [b]) => a.localeCompare(b))) as Readonly<
          Record<string, string | number>
        >,
      }))
      .sort((a, b) => a.rowId.localeCompare(b.rowId)),
    notes: sortStrings(table.notes),
  };
}

function normalizeSection(section: StrategyReviewReportSectionFixture): StrategyReviewReportSectionFixture {
  return {
    ...section,
    cards: [...section.cards]
      .map(card => ({ ...card, notes: sortStrings(card.notes) }))
      .sort((a, b) => a.cardId.localeCompare(b.cardId)),
    tables: [...section.tables].map(normalizeTable).sort((a, b) => a.tableId.localeCompare(b.tableId)),
    notes: sortStrings(section.notes),
  };
}

export function normalizeStrategyReviewReportFixture(
  fixture: StrategyReviewReportFixture,
): StrategyReviewReportFixture {
  return {
    ...fixture,
    title: fixture.title.trim(),
    description: fixture.description.trim(),
    dashboardReferences: [...fixture.dashboardReferences]
      .map(normalizeDashboardReference)
      .sort((a, b) => a.sourceDashboardFixtureName.localeCompare(b.sourceDashboardFixtureName)),
    sections: [...fixture.sections].map(normalizeSection).sort((a, b) => a.sectionId.localeCompare(b.sectionId)),
    summary: { ...fixture.summary, notes: sortStrings(fixture.summary.notes) },
    safetyBoundary: { ...fixture.safetyBoundary, notes: sortStrings(fixture.safetyBoundary.notes) },
    safeNotes: sortStrings(fixture.safeNotes),
    meta: { ...fixture.meta, notes: sortStrings(fixture.meta.notes) },
  };
}

export function serializeStrategyReviewReportFixture(fixture: StrategyReviewReportFixture): string {
  return JSON.stringify(normalizeStrategyReviewReportFixture(fixture), null, 2);
}

export function areStrategyReviewReportFixturesEqual(
  a: StrategyReviewReportFixture,
  b: StrategyReviewReportFixture,
): boolean {
  return serializeStrategyReviewReportFixture(a) === serializeStrategyReviewReportFixture(b);
}

export function isStrategyReviewReportFixtureSerializable(fixture: unknown): boolean {
  if (fixture === null || typeof fixture !== 'object') return false;
  try {
    JSON.stringify(fixture);
    return true;
  } catch {
    return false;
  }
}

export function isValidStrategyReviewReportFixtureName(
  name: unknown,
): name is StrategyReviewReportFixtureName {
  return (
    typeof name === 'string' && (STRATEGY_REVIEW_REPORT_FIXTURE_NAMES as readonly string[]).includes(name)
  );
}

export function isValidStrategyReviewReportFixtureKind(
  kind: unknown,
): kind is StrategyReviewReportFixtureKind {
  return (
    typeof kind === 'string' && (STRATEGY_REVIEW_REPORT_FIXTURE_KINDS as readonly string[]).includes(kind)
  );
}

export function isValidStrategyReviewReportGeneratedAt(value: unknown): boolean {
  return value === PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT;
}

export function isValidStrategyReviewReportSource(value: unknown): boolean {
  return value === PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE;
}
