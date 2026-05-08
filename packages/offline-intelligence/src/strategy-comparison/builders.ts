/**
 * Phase 39 — Strategy Comparison Matrix Fixtures v1: builders.
 */

import {
  PHASE_39_STRATEGY_COMPARISON_GENERATED_AT,
  PHASE_39_STRATEGY_COMPARISON_SOURCE,
  STRATEGY_COMPARISON_CRITERION_CODES,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES,
  type StrategyComparisonBuildInput,
  type StrategyComparisonBuildResult,
  type StrategyComparisonCandidateReference,
  type StrategyComparisonCriterion,
  type StrategyComparisonMatrixCell,
  type StrategyComparisonMatrixColumn,
  type StrategyComparisonMatrixFixture,
  type StrategyComparisonMatrixFixtureKind,
  type StrategyComparisonMatrixFixtureName,
  type StrategyComparisonMatrixRow,
  type StrategyComparisonMatrixSummary,
  type StrategyComparisonSafetyBoundary,
} from './types.js';
import { normalizeStrategyComparisonMatrixFixture } from './normalization.js';
import {
  validateStrategyComparisonMatrixFixture,
  validateStrategyComparisonMatrixSafety,
} from './validation.js';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function deriveBand(score: number): StrategyComparisonMatrixCell['band'] {
  if (score >= 75) return 'high';
  if (score >= 50) return 'moderate';
  if (score >= 25) return 'low';
  if (score > 0) return 'low';
  return 'unknown';
}

function deriveRowBand(score: number): StrategyComparisonMatrixRow['rowOverallBand'] {
  if (score >= 75) return 'high';
  if (score >= 50) return 'moderate';
  if (score >= 25) return 'low';
  if (score > 0) return 'low';
  return 'unknown';
}

function buildDefaultCriteria(): readonly StrategyComparisonCriterion[] {
  return STRATEGY_COMPARISON_CRITERION_CODES.map(code => ({
    code,
    label: code.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: `Synthetic ${code} criterion for offline comparison only.`,
    dimension: (() => {
      switch (code) {
        case 'synthetic-risk': return 'risk-control' as const;
        case 'quality': return 'quality-check' as const;
        case 'confidence': return 'confidence-check' as const;
        case 'evidence-coverage': return 'data-sufficiency' as const;
        case 'false-positive-protection': return 'safety-boundary' as const;
        case 'no-action-safety': return 'safety-boundary' as const;
        case 'overall-safety-posture': return 'safety-boundary' as const;
        default: return 'safety-boundary' as const;
      }
    })(),
    notes: ['Synthetic fixture criterion only. No real scoring or ranking.'],
  }));
}

function buildRowsAndColumns(
  candidateReferences: readonly StrategyComparisonCandidateReference[],
  criteria: readonly StrategyComparisonCriterion[],
  providedCells: readonly StrategyComparisonMatrixCell[],
): {
  rows: readonly StrategyComparisonMatrixRow[];
  columns: readonly StrategyComparisonMatrixColumn[];
} {
  // Build a lookup map from provided cells
  const cellMap = new Map<string, StrategyComparisonMatrixCell>();
  for (const cell of providedCells) {
    cellMap.set(`${cell.candidateFixtureName}:${cell.criterionCode}`, cell);
  }

  // Build rows
  const rows: StrategyComparisonMatrixRow[] = candidateReferences.map((ref, idx) => {
    const cells: StrategyComparisonMatrixCell[] = criteria.map((criterion, cIdx) => {
      const key = `${ref.candidateFixtureName}:${criterion.code}`;
      if (cellMap.has(key)) {
        return cellMap.get(key)!;
      }
      // Deterministic synthetic score based on position indices
      const score = clamp(50 + (idx * 7 + cIdx * 5) % 50, 0, 100);
      return {
        candidateFixtureName: ref.candidateFixtureName,
        criterionCode: criterion.code,
        syntheticScore: score,
        band: deriveBand(score),
        rationale: `Synthetic ${criterion.label} assessment for ${ref.candidateTitle}. Fixture only.`,
        fixtureOnly: true as const,
        syntheticOnly: true as const,
      };
    });
    const rowScore = cells.length > 0
      ? Math.round(cells.reduce((sum, c) => sum + c.syntheticScore, 0) / cells.length)
      : 0;
    return {
      candidateReference: ref,
      cells,
      rowSyntheticOverallScore: rowScore,
      rowOverallBand: deriveRowBand(rowScore),
      rowNotes: ['Synthetic row. No real scoring, ranking, or execution.'],
    };
  });

  // Build columns
  const columns: StrategyComparisonMatrixColumn[] = criteria.map(criterion => {
    const cells = rows.flatMap(row => row.cells.filter(c => c.criterionCode === criterion.code));
    return {
      criterion,
      cells,
      columnNotes: [`Synthetic ${criterion.label} column. No real scoring or ranking.`],
    };
  });

  return { rows, columns };
}

function buildSummary(
  name: StrategyComparisonMatrixFixtureName,
  kind: StrategyComparisonMatrixFixtureKind,
  rows: readonly StrategyComparisonMatrixRow[],
  columns: readonly StrategyComparisonMatrixColumn[],
  candidateCount: number,
  criterionCount: number,
): StrategyComparisonMatrixSummary {
  const allCells = rows.flatMap(r => r.cells);
  const scores = allCells.map(c => c.syntheticScore);
  const min = scores.length > 0 ? Math.min(...scores) : 0;
  const max = scores.length > 0 ? Math.max(...scores) : 0;
  const mean = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const bandDist: Record<string, number> = { low: 0, moderate: 0, high: 0, critical: 0, unknown: 0 };
  for (const cell of allCells) {
    bandDist[cell.band] = (bandDist[cell.band] ?? 0) + 1;
  }

  return {
    phase: 39,
    name,
    kind,
    candidateCount,
    criterionCount,
    cellCount: allCells.length,
    rowCount: rows.length,
    columnCount: columns.length,
    syntheticMinScore: min,
    syntheticMaxScore: max,
    syntheticMeanScore: mean,
    bandDistribution: bandDist,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    liveData: false,
    realScoring: false,
    realRanking: false,
    realBacktesting: false,
    paperTrading: false,
    liveTrading: false,
    execution: false,
    nonAdvisory: true,
    nonAccusatory: true,
    safeToDisplay: true,
    generatedAt: PHASE_39_STRATEGY_COMPARISON_GENERATED_AT,
    notes: [
      'Synthetic comparison summary only.',
      'No real scoring, ranking, backtesting, or execution.',
      'Fixture-backed, deterministic, local-only.',
    ],
  };
}

function buildSafetyBoundary(): StrategyComparisonSafetyBoundary {
  return {
    noRealScoring: true,
    noRealRanking: true,
    noRealReplay: true,
    noRealBacktesting: true,
    noPaperTrading: true,
    noLiveTrading: true,
    noExecution: true,
    noSolanaRpc: true,
    noExternalNetwork: true,
    noPersistence: true,
    noFileExport: true,
    noWalletAccess: true,
    noPrivateKeys: true,
    noInvestmentAdvice: true,
    noTradingSignals: true,
    noRecommendations: true,
    noRealWalletAddresses: true,
    noRealTransactionHashes: true,
    noPersonalData: true,
    deterministic: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    inMemoryOnly: true,
    notes: ['All safety boundaries enforced. Fixture-only, synthetic, deterministic, local, read-only.'],
  };
}

export function buildStrategyComparisonMatrixSummary(
  fixture: StrategyComparisonMatrixFixture,
): StrategyComparisonMatrixSummary {
  return buildSummary(
    fixture.name,
    fixture.kind,
    fixture.rows,
    fixture.columns,
    fixture.candidateReferences.length,
    fixture.criteria.length,
  );
}

export function buildStrategyComparisonMatrixFixture(
  input: StrategyComparisonBuildInput,
): StrategyComparisonBuildResult {
  // Validate name
  if (
    !input.name ||
    !(STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES as readonly string[]).includes(input.name)
  ) {
    const validation = validateStrategyComparisonMatrixFixture(input);
    return {
      success: false,
      fixture: null,
      validation,
      safety: { safe: false, violations: ['Invalid fixture name.'] },
    };
  }

  // Validate kind
  if (
    !input.kind ||
    !(STRATEGY_COMPARISON_MATRIX_FIXTURE_KINDS as readonly string[]).includes(input.kind)
  ) {
    const validation = validateStrategyComparisonMatrixFixture(input);
    return {
      success: false,
      fixture: null,
      validation,
      safety: { safe: false, violations: ['Invalid fixture kind.'] },
    };
  }

  if (!input.candidateReferences || input.candidateReferences.length === 0) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'EMPTY_CANDIDATES',
            field: 'candidateReferences',
            message: 'candidateReferences must not be empty.',
            severity: 'error',
          },
        ],
      },
      safety: { safe: false, violations: ['No candidate references provided.'] },
    };
  }

  const name = input.name as StrategyComparisonMatrixFixtureName;
  const kind = input.kind as StrategyComparisonMatrixFixtureKind;
  const criteria =
    input.criteria && input.criteria.length > 0 ? input.criteria : buildDefaultCriteria();
  const cells = input.cells ?? [];

  const { rows, columns } = buildRowsAndColumns(input.candidateReferences, criteria, cells);

  const summary = buildSummary(
    name,
    kind,
    rows,
    columns,
    input.candidateReferences.length,
    criteria.length,
  );

  const fixture: StrategyComparisonMatrixFixture = {
    name,
    kind,
    title: (input.title ?? '').trim() || name,
    description: (input.description ?? '').trim() || `Synthetic strategy comparison matrix: ${name}.`,
    candidateReferences: input.candidateReferences,
    criteria,
    rows,
    columns,
    summary,
    safetyBoundary: buildSafetyBoundary(),
    safeNotes: [...(input.safeNotes ?? []), 'Synthetic fixture only. No real scoring, ranking, or execution.'],
    meta: {
      phase: 39,
      generatedAt: PHASE_39_STRATEGY_COMPARISON_GENERATED_AT,
      source: PHASE_39_STRATEGY_COMPARISON_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      readOnly: true,
      localOnly: true,
      inMemoryOnly: true,
      liveData: false,
      realScoring: false,
      realRanking: false,
      realBacktesting: false,
      paperTrading: false,
      liveTrading: false,
      execution: false,
      externalNetwork: false,
      persistence: false,
      fileExport: false,
      nonAdvisory: true,
      nonAccusatory: true,
      notes: ['Phase 39 strategy comparison matrix fixture. Deterministic, synthetic, local-only.'],
    },
  };

  const normalized = normalizeStrategyComparisonMatrixFixture(fixture);
  const validation = validateStrategyComparisonMatrixFixture(normalized);
  const safety = validateStrategyComparisonMatrixSafety(normalized);

  return {
    success: validation.valid && safety.safe,
    fixture: normalized,
    validation,
    safety,
  };
}
