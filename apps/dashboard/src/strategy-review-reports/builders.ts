import {
  getStrategyReviewDashboardFixture,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES,
} from '../strategy-review-fixtures/index.js';
import type {
  StrategyReviewDashboardFixture,
  StrategyReviewDashboardFixtureName,
} from '../strategy-review-fixtures/types.js';
import {
  isValidStrategyReviewReportFixtureKind,
  isValidStrategyReviewReportFixtureName,
  normalizeStrategyReviewReportFixture,
} from './normalization.js';
import {
  validateStrategyReviewReportFixture,
  validateStrategyReviewReportSafety,
} from './validation.js';
import {
  PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT,
  PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE,
  STRATEGY_REVIEW_REPORT_FIXTURE_NAMES,
  type StrategyReviewDashboardReference,
  type StrategyReviewReportBuildInput,
  type StrategyReviewReportBuildResult,
  type StrategyReviewReportFixture,
  type StrategyReviewReportFixtureKind,
  type StrategyReviewReportFixtureName,
  type StrategyReviewReportSummaryFixture,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(v => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export const NAME_TO_KIND: Readonly<
  Record<StrategyReviewReportFixtureName, StrategyReviewReportFixtureKind>
> = {
  'defensive-vs-aggressive-review-report': 'defensive-vs-aggressive-review-report',
  'creator-led-review-report': 'creator-led-review-report',
  'wallet-led-review-report': 'wallet-led-review-report',
  'manipulation-avoidance-review-report': 'manipulation-avoidance-review-report',
  'no-action-safety-review-report': 'no-action-safety-review-report',
  'insufficient-data-review-report': 'insufficient-data-review-report',
  'high-score-positive-review-report': 'high-score-positive-review-report',
  'high-score-false-positive-review-report': 'high-score-false-positive-review-report',
  'missed-opportunity-review-report': 'missed-opportunity-review-report',
  'drawdown-contained-review-report': 'drawdown-contained-review-report',
  'mixed-signal-watchlist-review-report': 'mixed-signal-watchlist-review-report',
  'false-positive-protection-review-report': 'false-positive-protection-review-report',
  'malformed-input-safe-review-report': 'malformed-input-safe-review-report',
  'dashboard-ready-strategy-review-report': 'dashboard-ready-strategy-review-report',
  'serialization-ready-strategy-review-report': 'serialization-ready-strategy-review-report',
  'safety-boundary-strategy-review-report': 'safety-boundary-strategy-review-report',
};

export const NAME_TO_DASHBOARD: Readonly<
  Record<StrategyReviewReportFixtureName, StrategyReviewDashboardFixtureName>
> = {
  'defensive-vs-aggressive-review-report': 'defensive-vs-aggressive-review-dashboard',
  'creator-led-review-report': 'creator-led-review-dashboard',
  'wallet-led-review-report': 'wallet-led-review-dashboard',
  'manipulation-avoidance-review-report': 'manipulation-avoidance-review-dashboard',
  'no-action-safety-review-report': 'no-action-safety-review-dashboard',
  'insufficient-data-review-report': 'insufficient-data-review-dashboard',
  'high-score-positive-review-report': 'high-score-positive-review-dashboard',
  'high-score-false-positive-review-report': 'high-score-false-positive-review-dashboard',
  'missed-opportunity-review-report': 'missed-opportunity-review-dashboard',
  'drawdown-contained-review-report': 'drawdown-contained-review-dashboard',
  'mixed-signal-watchlist-review-report': 'mixed-signal-watchlist-review-dashboard',
  'false-positive-protection-review-report': 'false-positive-protection-review-dashboard',
  'malformed-input-safe-review-report': 'malformed-input-safe-review-dashboard',
  'dashboard-ready-strategy-review-report': 'dashboard-ready-strategy-review',
  'serialization-ready-strategy-review-report': 'report-ready-strategy-review',
  'safety-boundary-strategy-review-report': 'safety-boundary-strategy-review',
};

function buildDashboardReference(
  dashboard: StrategyReviewDashboardFixture,
): StrategyReviewDashboardReference {
  return {
    sourcePhase: 40,
    sourceDashboardFixtureName: dashboard.name,
    sourceDashboardFixtureKind: dashboard.kind,
    panelCount: dashboard.summary.panelCount,
    cardCount: dashboard.summary.cardCount,
    tableCount: dashboard.summary.tableCount,
    rowCount: dashboard.summary.rowCount,
    fixtureOnly: true,
    syntheticOnly: true,
    notes: ['Synthetic Phase 40 dashboard reference for strategy review report fixture.'],
  };
}

function buildSummary(fixture: StrategyReviewReportFixture): StrategyReviewReportSummaryFixture {
  const tableCount = fixture.sections.reduce((sum, section) => sum + section.tables.length, 0);
  const rowCount = fixture.sections.reduce(
    (sum, section) => sum + section.tables.reduce((inner, table) => inner + table.rows.length, 0),
    0,
  );
  const cardCount = fixture.sections.reduce((sum, section) => sum + section.cards.length, 0);
  const columnCount = fixture.sections.reduce(
    (sum, section) =>
      sum + section.tables.reduce((inner, table) => inner + table.columns.length, 0),
    0,
  );
  return {
    phase: 41,
    fixtureName: fixture.name,
    fixtureKind: fixture.kind,
    sectionCount: fixture.sections.length,
    cardCount,
    tableCount,
    rowCount,
    columnCount,
    dashboardReferenceCount: fixture.dashboardReferences.length,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    readOnly: true,
    serializable: true,
    nonAdvisory: true,
    generatedAt: PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT,
    notes: [
      'Synthetic strategy review report summary.',
      'No export or download behavior, and no scoring or execution behavior.',
    ],
  };
}

export function buildStrategyReviewReportSummary(
  fixture: StrategyReviewReportFixture,
): StrategyReviewReportSummaryFixture {
  return buildSummary(fixture);
}

function buildCoreFixture(
  name: StrategyReviewReportFixtureName,
  kind: StrategyReviewReportFixtureKind,
  dashboard: StrategyReviewDashboardFixture,
  input: StrategyReviewReportBuildInput,
): StrategyReviewReportFixture {
  const primaryTable = dashboard.panels[0]?.tables[0];
  const rows = primaryTable?.rows ?? [];
  const columns = primaryTable?.columns ?? [];

  const fixture: StrategyReviewReportFixture = {
    name,
    kind,
    title:
      typeof input.title === 'string' && input.title.trim() !== ''
        ? input.title.trim()
        : `${name.replace(/-/g, ' ')} strategy review report`.replace(/\b\w/g, ch => ch.toUpperCase()),
    description:
      typeof input.description === 'string' && input.description.trim() !== ''
        ? input.description.trim()
        : `Phase 41 synthetic strategy review report fixture for ${name}.`,
    dashboardReferences: [buildDashboardReference(dashboard)],
    sections: [
      {
        sectionId: 'strategy-review-report-overview',
        title: 'Strategy Review Report Overview',
        cards: [
          {
            cardId: 'source-dashboard',
            title: 'Source Dashboard Fixture',
            value: dashboard.name,
            tone: 'informational',
            notes: ['Synthetic linkage to Phase 40 dashboard fixture.'],
          },
          {
            cardId: 'report-section-count',
            title: 'Report Section Count',
            value: '2',
            tone: 'neutral',
            notes: ['Deterministic section count for fixture report shape.'],
          },
          {
            cardId: 'synthetic-row-count',
            title: 'Synthetic Comparison Rows',
            value: String(rows.length),
            tone: 'caution',
            notes: ['Synthetic row count from dashboard review table.'],
          },
        ],
        tables: [
          {
            tableId: 'strategy-review-report-table',
            title: 'Strategy Review Report Table',
            columns: columns.map(column => ({
              columnId: column.columnId,
              label: column.label,
              valueKind: column.valueKind,
            })),
            rows: rows.map((row, index) => ({
              rowId: `report-row-${String(index + 1).padStart(2, '0')}`,
              candidateFixtureName: row.candidateFixtureName,
              cells: {
                ...row.cells,
              },
              notes: ['Synthetic report table row derived from Phase 40 dashboard fixture rows.'],
            })),
            notes: ['Synthetic report table only. No export, download, or execution controls.'],
          },
        ],
        notes: ['Synthetic report overview section. Local-only and read-only.'],
      },
      {
        sectionId: 'strategy-review-report-safety-boundary',
        title: 'Strategy Review Report Safety Boundary',
        cards: [
          {
            cardId: 'no-export-support',
            title: 'No Export Support',
            value: 'true',
            tone: 'informational',
            notes: ['Actual file export and download support are disabled.'],
          },
          {
            cardId: 'no-execution-support',
            title: 'No Execution Support',
            value: 'true',
            tone: 'neutral',
            notes: ['Execution, paper workflows, and live workflows are disabled.'],
          },
          {
            cardId: 'synthetic-only-safety',
            title: 'Synthetic Only',
            value: 'true',
            tone: 'caution',
            notes: ['Fixture remains synthetic-only, local-only, and deterministic.'],
          },
        ],
        tables: [
          {
            tableId: 'strategy-review-report-safety-table',
            title: 'Strategy Review Report Safety Controls',
            columns: [
              { columnId: 'control', label: 'Control', valueKind: 'text' },
              { columnId: 'state', label: 'State', valueKind: 'text' },
              { columnId: 'scope', label: 'Scope', valueKind: 'text' },
            ],
            rows: [
              {
                rowId: 'safety-control-01',
                candidateFixtureName: 'phase41-safety-control',
                cells: {
                  control: 'actual-file-export',
                  state: 'disabled',
                  scope: 'phase41-report-fixtures',
                },
                notes: ['File export behavior remains disabled.'],
              },
              {
                rowId: 'safety-control-02',
                candidateFixtureName: 'phase41-safety-control',
                cells: {
                  control: 'download-support',
                  state: 'disabled',
                  scope: 'phase41-report-fixtures',
                },
                notes: ['Download behavior remains disabled.'],
              },
              {
                rowId: 'safety-control-03',
                candidateFixtureName: 'phase41-safety-control',
                cells: {
                  control: 'external-network',
                  state: 'disabled',
                  scope: 'phase41-report-fixtures',
                },
                notes: ['External-network behavior remains disabled.'],
              },
            ],
            notes: ['Safety table is synthetic and deterministic.'],
          },
        ],
        notes: ['Synthetic report safety section.'],
      },
    ],
    summary: {
      phase: 41,
      fixtureName: name,
      fixtureKind: kind,
      sectionCount: 0,
      cardCount: 0,
      tableCount: 0,
      rowCount: 0,
      columnCount: 0,
      dashboardReferenceCount: 0,
      fixtureOnly: true,
      syntheticOnly: true,
      localOnly: true,
      readOnly: true,
      serializable: true,
      nonAdvisory: true,
      generatedAt: PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT,
      notes: [],
    },
    safetyBoundary: {
      noActualFileExport: true,
      noDownloadSupport: true,
      noRealUiRendering: true,
      noRealScoring: true,
      noRealRanking: true,
      noRecommendations: true,
      noTradingSignals: true,
      noExecution: true,
      noPaperTrading: true,
      noLiveTrading: true,
      noSolanaRpc: true,
      noExternalNetwork: true,
      noPersistence: true,
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
      notes: ['Phase 41 safety boundary enforced for synthetic strategy review report fixtures.'],
    },
    safeNotes: sortStrings([
      ...(input.safeNotes ?? []),
      'Synthetic fixture only.',
      'Local-only read-only fixture data.',
      'No export or download behavior.',
      'No real scoring, ranking, or execution behavior.',
    ]),
    meta: {
      phase: 41,
      generatedAt: PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT,
      source: PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      localOnly: true,
      readOnly: true,
      inMemoryOnly: true,
      strategyReviewReportActualFileExport: false,
      strategyReviewReportDownloadSupport: false,
      strategyReviewReportRealUiRendering: false,
      strategyReviewReportRealScoring: false,
      strategyReviewReportRealRanking: false,
      strategyReviewReportRecommendations: false,
      strategyReviewReportTradingSignals: false,
      strategyReviewReportPaperTrading: false,
      strategyReviewReportLiveTrading: false,
      strategyReviewReportExecution: false,
      strategyReviewReportSolanaRpc: false,
      strategyReviewReportExternalNetwork: false,
      strategyReviewReportPersistence: false,
      strategyReviewReportInvestmentAdvice: false,
      nonAdvisory: true,
      nonAccusatory: true,
      notes: [
        'Phase 41 strategy review report fixture metadata.',
        'Synthetic-only and deterministic.',
      ],
    },
  };

  const withSummary: StrategyReviewReportFixture = {
    ...fixture,
    summary: buildSummary(fixture),
  };

  return normalizeStrategyReviewReportFixture(withSummary);
}

export function buildStrategyReviewReportFixture(input: StrategyReviewReportBuildInput): StrategyReviewReportBuildResult {
  const fallbackName = STRATEGY_REVIEW_REPORT_FIXTURE_NAMES[0];
  const name = isValidStrategyReviewReportFixtureName(input.name) ? input.name : fallbackName;
  const kind = isValidStrategyReviewReportFixtureKind(input.kind) ? input.kind : NAME_TO_KIND[name];
  const sourceDashboardFixtureName =
    input.sourceDashboardFixtureName &&
    STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES.includes(input.sourceDashboardFixtureName)
      ? input.sourceDashboardFixtureName
      : NAME_TO_DASHBOARD[name];

  const dashboard = getStrategyReviewDashboardFixture(sourceDashboardFixtureName);
  if (!dashboard) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'MISSING_SOURCE_DASHBOARD',
            field: 'sourceDashboardFixtureName',
            message: `Could not resolve source dashboard fixture: ${sourceDashboardFixtureName}.`,
            severity: 'error',
          },
        ],
      },
      safety: { safe: false, violations: ['Source dashboard fixture missing.'] },
    };
  }

  const fixture = buildCoreFixture(name, kind, dashboard, input);
  const validation = validateStrategyReviewReportFixture(fixture);
  const safety = validateStrategyReviewReportSafety(fixture);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid && safety.safe ? fixture : null,
    validation,
    safety,
  };
}
