/**
 * Phase 39 — Strategy Comparison Matrix Fixtures v1: normalization helpers.
 */

import type {
  StrategyComparisonCandidateReference,
  StrategyComparisonCriterion,
  StrategyComparisonMatrixCell,
  StrategyComparisonMatrixFixture,
  StrategyComparisonMatrixRow,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function sortCells(cells: readonly StrategyComparisonMatrixCell[]): readonly StrategyComparisonMatrixCell[] {
  return [...cells].sort((a, b) => {
    const nameCompare = a.candidateFixtureName.localeCompare(b.candidateFixtureName);
    if (nameCompare !== 0) return nameCompare;
    return a.criterionCode.localeCompare(b.criterionCode);
  });
}

function sortRows(rows: readonly StrategyComparisonMatrixRow[]): readonly StrategyComparisonMatrixRow[] {
  return [...rows].sort((a, b) =>
    a.candidateReference.candidateFixtureName.localeCompare(b.candidateReference.candidateFixtureName),
  );
}

function sortCriteria(criteria: readonly StrategyComparisonCriterion[]): readonly StrategyComparisonCriterion[] {
  return [...criteria].sort((a, b) => a.code.localeCompare(b.code));
}

function normalizeCell(cell: StrategyComparisonMatrixCell): StrategyComparisonMatrixCell {
  return {
    candidateFixtureName: cell.candidateFixtureName,
    criterionCode: cell.criterionCode,
    syntheticScore: cell.syntheticScore,
    band: cell.band,
    rationale: (cell.rationale ?? '').trim(),
    fixtureOnly: true,
    syntheticOnly: true,
  };
}

function normalizeRow(row: StrategyComparisonMatrixRow): StrategyComparisonMatrixRow {
  return {
    candidateReference: normalizeCandidateReference(row.candidateReference),
    cells: sortCells(row.cells.map(normalizeCell)),
    rowSyntheticOverallScore: row.rowSyntheticOverallScore,
    rowOverallBand: row.rowOverallBand,
    rowNotes: sortStrings(row.rowNotes),
  };
}

function normalizeCandidateReference(
  ref: StrategyComparisonCandidateReference,
): StrategyComparisonCandidateReference {
  return {
    candidateFixtureName: ref.candidateFixtureName,
    candidateFixtureKind: ref.candidateFixtureKind,
    candidateId: (ref.candidateId ?? '').trim(),
    candidateTitle: (ref.candidateTitle ?? '').trim(),
    candidateFamily: ref.candidateFamily,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: sortStrings(ref.notes),
  };
}

export function normalizeStrategyComparisonMatrixFixture(
  fixture: StrategyComparisonMatrixFixture,
): StrategyComparisonMatrixFixture {
  return {
    name: fixture.name,
    kind: fixture.kind,
    title: (fixture.title ?? '').trim(),
    description: (fixture.description ?? '').trim(),
    candidateReferences: [...fixture.candidateReferences]
      .sort((a, b) => a.candidateFixtureName.localeCompare(b.candidateFixtureName))
      .map(normalizeCandidateReference),
    criteria: sortCriteria(fixture.criteria),
    rows: sortRows(fixture.rows.map(normalizeRow)),
    columns: [...fixture.columns].sort((a, b) => a.criterion.code.localeCompare(b.criterion.code)),
    summary: fixture.summary,
    safetyBoundary: fixture.safetyBoundary,
    safeNotes: sortStrings(fixture.safeNotes),
    meta: fixture.meta,
  };
}

export function serializeStrategyComparisonMatrixFixture(
  fixture: StrategyComparisonMatrixFixture,
): string {
  return JSON.stringify(fixture, null, 2);
}

export function areStrategyComparisonMatrixFixturesEqual(
  a: StrategyComparisonMatrixFixture,
  b: StrategyComparisonMatrixFixture,
): boolean {
  return serializeStrategyComparisonMatrixFixture(normalizeStrategyComparisonMatrixFixture(a)) ===
    serializeStrategyComparisonMatrixFixture(normalizeStrategyComparisonMatrixFixture(b));
}

export function isStrategyComparisonMatrixFixtureSerializable(
  fixture: unknown,
): boolean {
  if (fixture === null || typeof fixture !== 'object') return false;
  try {
    JSON.stringify(fixture);
    return true;
  } catch {
    return false;
  }
}
