import type {
  StrategyReviewDashboardFixture,
  StrategyReviewDashboardFixtureKind,
  StrategyReviewDashboardFixtureName,
  StrategyReviewMatrixReference,
  StrategyReviewPanelFixture,
  StrategyReviewTableFixture,
} from './types.js';
import {
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT,
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function normalizeReference(reference: StrategyReviewMatrixReference): StrategyReviewMatrixReference {
  return { ...reference, notes: sortStrings(reference.notes) };
}

function normalizeTable(table: StrategyReviewTableFixture): StrategyReviewTableFixture {
  return {
    ...table,
    columns: [...table.columns].sort((a, b) => a.columnId.localeCompare(b.columnId)),
    rows: [...table.rows]
      .map(row => ({
        ...row,
        notes: sortStrings(row.notes),
        cells: Object.fromEntries(
          Object.entries(row.cells).sort(([a], [b]) => a.localeCompare(b)),
        ) as Readonly<Record<string, string | number>>,
      }))
      .sort((a, b) => a.rowId.localeCompare(b.rowId)),
    notes: sortStrings(table.notes),
  };
}

function normalizePanel(panel: StrategyReviewPanelFixture): StrategyReviewPanelFixture {
  return {
    ...panel,
    cards: [...panel.cards]
      .map(card => ({ ...card, notes: sortStrings(card.notes) }))
      .sort((a, b) => a.cardId.localeCompare(b.cardId)),
    tables: [...panel.tables].map(normalizeTable).sort((a, b) => a.tableId.localeCompare(b.tableId)),
    notes: sortStrings(panel.notes),
  };
}

export function normalizeStrategyReviewDashboardFixture(
  fixture: StrategyReviewDashboardFixture,
): StrategyReviewDashboardFixture {
  return {
    ...fixture,
    title: fixture.title.trim(),
    description: fixture.description.trim(),
    matrixReferences: [...fixture.matrixReferences]
      .map(normalizeReference)
      .sort((a, b) => a.sourceMatrixFixtureName.localeCompare(b.sourceMatrixFixtureName)),
    panels: [...fixture.panels].map(normalizePanel).sort((a, b) => a.panelId.localeCompare(b.panelId)),
    summary: {
      ...fixture.summary,
      notes: sortStrings(fixture.summary.notes),
    },
    safetyBoundary: {
      ...fixture.safetyBoundary,
      notes: sortStrings(fixture.safetyBoundary.notes),
    },
    safeNotes: sortStrings(fixture.safeNotes),
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
  };
}

export function serializeStrategyReviewDashboardFixture(
  fixture: StrategyReviewDashboardFixture,
): string {
  return JSON.stringify(normalizeStrategyReviewDashboardFixture(fixture), null, 2);
}

export function areStrategyReviewDashboardFixturesEqual(
  a: StrategyReviewDashboardFixture,
  b: StrategyReviewDashboardFixture,
): boolean {
  return serializeStrategyReviewDashboardFixture(a) === serializeStrategyReviewDashboardFixture(b);
}

export function isStrategyReviewDashboardFixtureSerializable(fixture: unknown): boolean {
  if (fixture === null || typeof fixture !== 'object') return false;
  try {
    JSON.stringify(fixture);
    return true;
  } catch {
    return false;
  }
}

export function isValidStrategyReviewDashboardFixtureName(
  name: unknown,
): name is StrategyReviewDashboardFixtureName {
  return (
    typeof name === 'string' &&
    (STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES as readonly string[]).includes(name)
  );
}

export function isValidStrategyReviewDashboardFixtureKind(
  kind: unknown,
): kind is StrategyReviewDashboardFixtureKind {
  return (
    typeof kind === 'string' &&
    (STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS as readonly string[]).includes(kind)
  );
}

export function isValidStrategyReviewGeneratedAt(value: unknown): boolean {
  return value === PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT;
}

export function isValidStrategyReviewSource(value: unknown): boolean {
  return value === PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE;
}
