import {
  getStrategyComparisonMatrixFixture,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES,
} from '@sonic/offline-intelligence';
import type {
  StrategyComparisonMatrixFixture,
  StrategyComparisonMatrixFixtureName,
} from '@sonic/offline-intelligence';
import {
  normalizeStrategyReviewDashboardFixture,
  isValidStrategyReviewDashboardFixtureKind,
  isValidStrategyReviewDashboardFixtureName,
} from './normalization.js';
import {
  validateStrategyReviewDashboardFixture,
  validateStrategyReviewDashboardSafety,
} from './validation.js';
import {
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT,
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES,
  type StrategyReviewBuildInput,
  type StrategyReviewBuildResult,
  type StrategyReviewDashboardFixture,
  type StrategyReviewDashboardFixtureKind,
  type StrategyReviewDashboardFixtureName,
  type StrategyReviewMatrixReference,
  type StrategyReviewSummaryFixture,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export const NAME_TO_KIND: Readonly<
  Record<StrategyReviewDashboardFixtureName, StrategyReviewDashboardFixtureKind>
> = {
  'defensive-vs-aggressive-review-dashboard': 'defensive-vs-aggressive-review',
  'creator-led-review-dashboard': 'creator-led-review',
  'wallet-led-review-dashboard': 'wallet-led-review',
  'manipulation-avoidance-review-dashboard': 'manipulation-avoidance-review',
  'no-action-safety-review-dashboard': 'no-action-safety-review',
  'insufficient-data-review-dashboard': 'insufficient-data-review',
  'high-score-positive-review-dashboard': 'high-score-positive-review',
  'high-score-false-positive-review-dashboard': 'high-score-false-positive-review',
  'missed-opportunity-review-dashboard': 'missed-opportunity-review',
  'drawdown-contained-review-dashboard': 'drawdown-contained-review',
  'mixed-signal-watchlist-review-dashboard': 'mixed-signal-watchlist-review',
  'false-positive-protection-review-dashboard': 'false-positive-protection-review',
  'malformed-input-safe-review-dashboard': 'malformed-input-safe-review',
  'dashboard-ready-strategy-review': 'dashboard-ready-strategy-review',
  'report-ready-strategy-review': 'report-ready-strategy-review',
  'safety-boundary-strategy-review': 'safety-boundary-strategy-review',
};

export const NAME_TO_MATRIX: Readonly<
  Record<StrategyReviewDashboardFixtureName, StrategyComparisonMatrixFixtureName>
> = {
  'defensive-vs-aggressive-review-dashboard': 'defensive-vs-aggressive-matrix',
  'creator-led-review-dashboard': 'creator-led-candidate-matrix',
  'wallet-led-review-dashboard': 'wallet-led-candidate-matrix',
  'manipulation-avoidance-review-dashboard': 'manipulation-avoidance-matrix',
  'no-action-safety-review-dashboard': 'no-action-safety-matrix',
  'insufficient-data-review-dashboard': 'insufficient-data-matrix',
  'high-score-positive-review-dashboard': 'high-score-positive-comparison-matrix',
  'high-score-false-positive-review-dashboard': 'high-score-false-positive-comparison-matrix',
  'missed-opportunity-review-dashboard': 'missed-opportunity-comparison-matrix',
  'drawdown-contained-review-dashboard': 'drawdown-contained-comparison-matrix',
  'mixed-signal-watchlist-review-dashboard': 'mixed-signal-watchlist-matrix',
  'false-positive-protection-review-dashboard': 'false-positive-protection-matrix',
  'malformed-input-safe-review-dashboard': 'malformed-input-safe-matrix',
  'dashboard-ready-strategy-review': 'dashboard-ready-comparison-matrix',
  'report-ready-strategy-review': 'report-ready-comparison-matrix',
  'safety-boundary-strategy-review': 'safety-boundary-comparison-matrix',
};

function buildMatrixReference(matrix: StrategyComparisonMatrixFixture): StrategyReviewMatrixReference {
  return {
    sourcePhase: 39,
    sourceMatrixFixtureName: matrix.name,
    sourceMatrixFixtureKind: matrix.kind,
    candidateCount: matrix.candidateReferences.length,
    criterionCount: matrix.criteria.length,
    rowCount: matrix.rows.length,
    columnCount: matrix.columns.length,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: ['Synthetic Phase 39 matrix reference for dashboard strategy review fixture.'],
  };
}

function buildSummary(fixture: StrategyReviewDashboardFixture): StrategyReviewSummaryFixture {
  const tableCount = fixture.panels.reduce((sum, panel) => sum + panel.tables.length, 0);
  const rowCount = fixture.panels.reduce(
    (sum, panel) => sum + panel.tables.reduce((inner, table) => inner + table.rows.length, 0),
    0,
  );
  const cardCount = fixture.panels.reduce((sum, panel) => sum + panel.cards.length, 0);
  const columnCount = fixture.panels.reduce(
    (sum, panel) => sum + panel.tables.reduce((inner, table) => inner + table.columns.length, 0),
    0,
  );
  return {
    phase: 40,
    fixtureName: fixture.name,
    fixtureKind: fixture.kind,
    panelCount: fixture.panels.length,
    cardCount,
    tableCount,
    rowCount,
    columnCount,
    matrixReferenceCount: fixture.matrixReferences.length,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    safeToDisplay: true,
    nonAdvisory: true,
    generatedAt: PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT,
    notes: [
      'Synthetic strategy review dashboard summary.',
      'No real UI rendering, scoring, ranking, or execution.',
    ],
  };
}

export function buildStrategyReviewSummary(
  fixture: StrategyReviewDashboardFixture,
): StrategyReviewSummaryFixture {
  return buildSummary(fixture);
}

function buildCoreFixture(
  name: StrategyReviewDashboardFixtureName,
  kind: StrategyReviewDashboardFixtureKind,
  matrix: StrategyComparisonMatrixFixture,
  input: StrategyReviewBuildInput,
): StrategyReviewDashboardFixture {
  const fixture: StrategyReviewDashboardFixture = {
    name,
    kind,
    title:
      typeof input.title === 'string' && input.title.trim() !== ''
        ? input.title.trim()
        : `${name.replace(/-/g, ' ')} strategy review`.replace(/\b\w/g, ch => ch.toUpperCase()),
    description:
      typeof input.description === 'string' && input.description.trim() !== ''
        ? input.description.trim()
        : `Phase 40 synthetic strategy review dashboard fixture for ${name}.`,
    matrixReferences: [buildMatrixReference(matrix)],
    panels: [
      {
        panelId: 'strategy-review-overview',
        title: 'Strategy Review Overview',
        cards: [
          {
            cardId: 'matrix-source',
            title: 'Source Matrix',
            value: matrix.name,
            tone: 'informational',
            notes: ['Synthetic Phase 39 matrix linkage.'],
          },
          {
            cardId: 'candidate-count',
            title: 'Candidate Count',
            value: String(matrix.candidateReferences.length),
            tone: 'neutral',
            notes: ['Synthetic candidate count from matrix reference.'],
          },
          {
            cardId: 'synthetic-mean-score',
            title: 'Synthetic Mean Score',
            value: String(matrix.summary.syntheticMeanScore),
            tone: 'caution',
            notes: ['Synthetic only. Not real scoring or ranking.'],
          },
        ],
        tables: [
          {
            tableId: 'strategy-review-comparison-table',
            title: 'Strategy Review Comparison Table',
            columns: [
              { columnId: 'candidate', label: 'Candidate', valueKind: 'text' },
              {
                columnId: 'synthetic-overall-score',
                label: 'Synthetic Overall Score',
                valueKind: 'number',
              },
              {
                columnId: 'synthetic-overall-band',
                label: 'Synthetic Overall Band',
                valueKind: 'band',
              },
            ],
            rows: matrix.rows.map((row, index) => ({
              rowId: `row-${String(index + 1).padStart(2, '0')}`,
              candidateFixtureName: row.candidateReference.candidateFixtureName,
              cells: {
                candidate: row.candidateReference.candidateTitle,
                'synthetic-overall-score': row.rowSyntheticOverallScore,
                'synthetic-overall-band': row.rowOverallBand,
              },
              notes: ['Synthetic table row derived from Phase 39 matrix row data.'],
            })),
            notes: ['Synthetic table only. No advisory outputs or execution decisions.'],
          },
        ],
        notes: ['Synthetic strategy review panel. Local-only and read-only.'],
      },
    ],
    summary: {
      phase: 40,
      fixtureName: name,
      fixtureKind: kind,
      panelCount: 0,
      cardCount: 0,
      tableCount: 0,
      rowCount: 0,
      columnCount: 0,
      matrixReferenceCount: 0,
      fixtureOnly: true,
      syntheticOnly: true,
      localOnly: true,
      readOnly: true,
      safeToDisplay: true,
      nonAdvisory: true,
      generatedAt: PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT,
      notes: [],
    },
    safetyBoundary: {
      noRealUiRendering: true,
      noRealScoring: true,
      noRealRanking: true,
      noRecommendations: true,
      noTradingSignals: true,
      noRealReplay: true,
      noRealBacktesting: true,
      noPaperTrading: true,
      noLiveTrading: true,
      noExecution: true,
      noSolanaRpc: true,
      noExternalNetwork: true,
      noPersistence: true,
      noFileExport: true,
      noInvestmentAdvice: true,
      noWalletAccess: true,
      noPrivateKeys: true,
      noRealWalletAddresses: true,
      noRealTransactionHashes: true,
      noPersonalData: true,
      deterministic: true,
      fixtureOnly: true,
      syntheticOnly: true,
      localOnly: true,
      readOnly: true,
      inMemoryOnly: true,
      notes: ['Phase 40 safety boundary enforced for synthetic strategy review dashboard fixtures.'],
    },
    safeNotes: sortStrings([
      ...(input.safeNotes ?? []),
      'Synthetic fixture only.',
      'Local-only read-only fixture data.',
      'No real UI rendering, scoring, ranking, advisory outputs, or execution.',
    ]),
    meta: {
      phase: 40,
      generatedAt: PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT,
      source: PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      localOnly: true,
      readOnly: true,
      inMemoryOnly: true,
      liveData: false,
      realUiRendering: false,
      realScoring: false,
      realRanking: false,
      recommendations: false,
      tradingSignals: false,
      paperTrading: false,
      liveTrading: false,
      execution: false,
      solanaRpc: false,
      externalNetwork: false,
      persistence: false,
      fileExport: false,
      investmentAdvice: false,
      nonAdvisory: true,
      nonAccusatory: true,
      notes: [
        'Phase 40 strategy review dashboard fixture metadata.',
        'Synthetic-only and deterministic.',
      ],
    },
  };

  const withSummary: StrategyReviewDashboardFixture = {
    ...fixture,
    summary: buildSummary(fixture),
  };
  return normalizeStrategyReviewDashboardFixture(withSummary);
}

export function buildStrategyReviewDashboardFixture(input: StrategyReviewBuildInput): StrategyReviewBuildResult {
  const fallbackName = STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES[0];
  const name = isValidStrategyReviewDashboardFixtureName(input.name) ? input.name : fallbackName;
  const kind = isValidStrategyReviewDashboardFixtureKind(input.kind) ? input.kind : NAME_TO_KIND[name];
  const sourceMatrixFixtureName =
    input.sourceMatrixFixtureName &&
    STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES.includes(input.sourceMatrixFixtureName)
      ? input.sourceMatrixFixtureName
      : NAME_TO_MATRIX[name];
  const matrix = getStrategyComparisonMatrixFixture(sourceMatrixFixtureName);

  if (!matrix) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'MISSING_SOURCE_MATRIX',
            field: 'sourceMatrixFixtureName',
            message: `Could not resolve source matrix fixture: ${sourceMatrixFixtureName}.`,
            severity: 'error',
          },
        ],
      },
      safety: { safe: false, violations: ['Source matrix fixture missing.'] },
    };
  }

  const fixture = buildCoreFixture(name, kind, matrix, input);
  const validation = validateStrategyReviewDashboardFixture(fixture);
  const safety = validateStrategyReviewDashboardSafety(fixture);
  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}
