/**
 * Phase 40 — Strategy Review Dashboard Fixtures v1: types.
 */

import type {
  StrategyComparisonMatrixFixtureKind,
  StrategyComparisonMatrixFixtureName,
} from '@sonic/offline-intelligence';

export const PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE =
  'phase40_strategy_review_dashboard_fixtures_v1';

export const STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES = [
  'defensive-vs-aggressive-review-dashboard',
  'creator-led-review-dashboard',
  'wallet-led-review-dashboard',
  'manipulation-avoidance-review-dashboard',
  'no-action-safety-review-dashboard',
  'insufficient-data-review-dashboard',
  'high-score-positive-review-dashboard',
  'high-score-false-positive-review-dashboard',
  'missed-opportunity-review-dashboard',
  'drawdown-contained-review-dashboard',
  'mixed-signal-watchlist-review-dashboard',
  'false-positive-protection-review-dashboard',
  'malformed-input-safe-review-dashboard',
  'dashboard-ready-strategy-review',
  'report-ready-strategy-review',
  'safety-boundary-strategy-review',
] as const;

export type StrategyReviewDashboardFixtureName =
  (typeof STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES)[number];

export const STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS = [
  'defensive-vs-aggressive-review',
  'creator-led-review',
  'wallet-led-review',
  'manipulation-avoidance-review',
  'no-action-safety-review',
  'insufficient-data-review',
  'high-score-positive-review',
  'high-score-false-positive-review',
  'missed-opportunity-review',
  'drawdown-contained-review',
  'mixed-signal-watchlist-review',
  'false-positive-protection-review',
  'malformed-input-safe-review',
  'dashboard-ready-strategy-review',
  'report-ready-strategy-review',
  'safety-boundary-strategy-review',
] as const;

export type StrategyReviewDashboardFixtureKind =
  (typeof STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS)[number];

export interface StrategyReviewMatrixReference {
  readonly sourcePhase: 39;
  readonly sourceMatrixFixtureName: StrategyComparisonMatrixFixtureName;
  readonly sourceMatrixFixtureKind: StrategyComparisonMatrixFixtureKind;
  readonly candidateCount: number;
  readonly criterionCount: number;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

export interface StrategyReviewCardFixture {
  readonly cardId: string;
  readonly title: string;
  readonly value: string;
  readonly tone: 'informational' | 'neutral' | 'caution';
  readonly notes: readonly string[];
}

export interface StrategyReviewTableColumnFixture {
  readonly columnId: string;
  readonly label: string;
  readonly valueKind: 'text' | 'number' | 'band';
}

export interface StrategyReviewTableRowFixture {
  readonly rowId: string;
  readonly candidateFixtureName: string;
  readonly cells: Readonly<Record<string, string | number>>;
  readonly notes: readonly string[];
}

export interface StrategyReviewTableFixture {
  readonly tableId: string;
  readonly title: string;
  readonly columns: readonly StrategyReviewTableColumnFixture[];
  readonly rows: readonly StrategyReviewTableRowFixture[];
  readonly notes: readonly string[];
}

export interface StrategyReviewPanelFixture {
  readonly panelId: string;
  readonly title: string;
  readonly cards: readonly StrategyReviewCardFixture[];
  readonly tables: readonly StrategyReviewTableFixture[];
  readonly notes: readonly string[];
}

export interface StrategyReviewSummaryFixture {
  readonly phase: 40;
  readonly fixtureName: StrategyReviewDashboardFixtureName;
  readonly fixtureKind: StrategyReviewDashboardFixtureKind;
  readonly panelCount: number;
  readonly cardCount: number;
  readonly tableCount: number;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly matrixReferenceCount: number;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly safeToDisplay: true;
  readonly nonAdvisory: true;
  readonly generatedAt: typeof PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT;
  readonly notes: readonly string[];
}

export interface StrategyReviewSafetyBoundary {
  readonly noRealUiRendering: true;
  readonly noRealScoring: true;
  readonly noRealRanking: true;
  readonly noRecommendations: true;
  readonly noTradingSignals: true;
  readonly noRealReplay: true;
  readonly noRealBacktesting: true;
  readonly noPaperTrading: true;
  readonly noLiveTrading: true;
  readonly noExecution: true;
  readonly noSolanaRpc: true;
  readonly noExternalNetwork: true;
  readonly noPersistence: true;
  readonly noFileExport: true;
  readonly noInvestmentAdvice: true;
  readonly noWalletAccess: true;
  readonly noPrivateKeys: true;
  readonly noRealWalletAddresses: true;
  readonly noRealTransactionHashes: true;
  readonly noPersonalData: true;
  readonly deterministic: true;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly notes: readonly string[];
}

export interface StrategyReviewDashboardFixtureMeta {
  readonly phase: 40;
  readonly generatedAt: typeof PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT;
  readonly source: typeof PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly liveData: false;
  readonly realUiRendering: false;
  readonly realScoring: false;
  readonly realRanking: false;
  readonly recommendations: false;
  readonly tradingSignals: false;
  readonly paperTrading: false;
  readonly liveTrading: false;
  readonly execution: false;
  readonly solanaRpc: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly fileExport: false;
  readonly investmentAdvice: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly notes: readonly string[];
}

export interface StrategyReviewDashboardFixture {
  readonly name: StrategyReviewDashboardFixtureName;
  readonly kind: StrategyReviewDashboardFixtureKind;
  readonly title: string;
  readonly description: string;
  readonly matrixReferences: readonly StrategyReviewMatrixReference[];
  readonly panels: readonly StrategyReviewPanelFixture[];
  readonly summary: StrategyReviewSummaryFixture;
  readonly safetyBoundary: StrategyReviewSafetyBoundary;
  readonly safeNotes: readonly string[];
  readonly meta: StrategyReviewDashboardFixtureMeta;
}

export interface StrategyReviewValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewValidationIssue[];
}

export interface StrategyReviewSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface StrategyReviewBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly sourceMatrixFixtureName?: StrategyComparisonMatrixFixtureName | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface StrategyReviewBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyReviewDashboardFixture | null;
  readonly validation: StrategyReviewValidationResult;
  readonly safety: StrategyReviewSafetyResult;
}

export interface StrategyReviewDashboardFixtureCapabilities {
  readonly strategyReviewDashboardFixtures: true;
  readonly syntheticStrategyReviewDashboards: true;
  readonly strategyReviewDashboardBuilders: true;
  readonly strategyReviewDashboardSafetyValidation: true;
  readonly strategyReviewMatrixReferences: true;
  readonly strategyReviewRealUiRendering: false;
  readonly strategyReviewRealScoring: false;
  readonly strategyReviewRealRanking: false;
  readonly strategyReviewRecommendations: false;
  readonly strategyReviewTradingSignals: false;
  readonly strategyReviewPaperTrading: false;
  readonly strategyReviewLiveTrading: false;
  readonly strategyReviewExecution: false;
  readonly strategyReviewSolanaRpc: false;
  readonly strategyReviewExternalNetwork: false;
  readonly strategyReviewPersistence: false;
  readonly strategyReviewFileExport: false;
  readonly strategyReviewInvestmentAdvice: false;
}
