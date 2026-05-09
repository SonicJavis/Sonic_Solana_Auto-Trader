/**
 * Phase 41 — Strategy Review Report Fixtures v1: types.
 */

import type {
  StrategyReviewDashboardFixtureKind,
  StrategyReviewDashboardFixtureName,
} from '../strategy-review-fixtures/types.js';

export const PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE = 'phase41_strategy_review_report_fixtures_v1';

export const STRATEGY_REVIEW_REPORT_FIXTURE_NAMES = [
  'defensive-vs-aggressive-review-report',
  'creator-led-review-report',
  'wallet-led-review-report',
  'manipulation-avoidance-review-report',
  'no-action-safety-review-report',
  'insufficient-data-review-report',
  'high-score-positive-review-report',
  'high-score-false-positive-review-report',
  'missed-opportunity-review-report',
  'drawdown-contained-review-report',
  'mixed-signal-watchlist-review-report',
  'false-positive-protection-review-report',
  'malformed-input-safe-review-report',
  'dashboard-ready-strategy-review-report',
  'serialization-ready-strategy-review-report',
  'safety-boundary-strategy-review-report',
] as const;

export type StrategyReviewReportFixtureName = (typeof STRATEGY_REVIEW_REPORT_FIXTURE_NAMES)[number];

export const STRATEGY_REVIEW_REPORT_FIXTURE_KINDS = [
  'defensive-vs-aggressive-review-report',
  'creator-led-review-report',
  'wallet-led-review-report',
  'manipulation-avoidance-review-report',
  'no-action-safety-review-report',
  'insufficient-data-review-report',
  'high-score-positive-review-report',
  'high-score-false-positive-review-report',
  'missed-opportunity-review-report',
  'drawdown-contained-review-report',
  'mixed-signal-watchlist-review-report',
  'false-positive-protection-review-report',
  'malformed-input-safe-review-report',
  'dashboard-ready-strategy-review-report',
  'serialization-ready-strategy-review-report',
  'safety-boundary-strategy-review-report',
] as const;

export type StrategyReviewReportFixtureKind = (typeof STRATEGY_REVIEW_REPORT_FIXTURE_KINDS)[number];

export interface StrategyReviewDashboardReference {
  readonly sourcePhase: 40;
  readonly sourceDashboardFixtureName: StrategyReviewDashboardFixtureName;
  readonly sourceDashboardFixtureKind: StrategyReviewDashboardFixtureKind;
  readonly panelCount: number;
  readonly cardCount: number;
  readonly tableCount: number;
  readonly rowCount: number;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

export interface StrategyReviewReportCardFixture {
  readonly cardId: string;
  readonly title: string;
  readonly value: string;
  readonly tone: 'informational' | 'neutral' | 'caution';
  readonly notes: readonly string[];
}

export interface StrategyReviewReportTableColumnFixture {
  readonly columnId: string;
  readonly label: string;
  readonly valueKind: 'text' | 'number' | 'band';
}

export interface StrategyReviewReportTableRowFixture {
  readonly rowId: string;
  readonly candidateFixtureName: string;
  readonly cells: Readonly<Record<string, string | number>>;
  readonly notes: readonly string[];
}

export interface StrategyReviewReportTableFixture {
  readonly tableId: string;
  readonly title: string;
  readonly columns: readonly StrategyReviewReportTableColumnFixture[];
  readonly rows: readonly StrategyReviewReportTableRowFixture[];
  readonly notes: readonly string[];
}

export interface StrategyReviewReportSectionFixture {
  readonly sectionId: string;
  readonly title: string;
  readonly cards: readonly StrategyReviewReportCardFixture[];
  readonly tables: readonly StrategyReviewReportTableFixture[];
  readonly notes: readonly string[];
}

export interface StrategyReviewReportSummaryFixture {
  readonly phase: 41;
  readonly fixtureName: StrategyReviewReportFixtureName;
  readonly fixtureKind: StrategyReviewReportFixtureKind;
  readonly sectionCount: number;
  readonly cardCount: number;
  readonly tableCount: number;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly dashboardReferenceCount: number;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly serializable: true;
  readonly nonAdvisory: true;
  readonly generatedAt: typeof PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT;
  readonly notes: readonly string[];
}

export interface StrategyReviewReportSafetyBoundary {
  readonly noActualFileExport: true;
  readonly noDownloadSupport: true;
  readonly noRealUiRendering: true;
  readonly noRealScoring: true;
  readonly noRealRanking: true;
  readonly noRecommendations: true;
  readonly noTradingSignals: true;
  readonly noExecution: true;
  readonly noPaperTrading: true;
  readonly noLiveTrading: true;
  readonly noSolanaRpc: true;
  readonly noExternalNetwork: true;
  readonly noPersistence: true;
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

export interface StrategyReviewReportFixtureMeta {
  readonly phase: 41;
  readonly generatedAt: typeof PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT;
  readonly source: typeof PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly strategyReviewReportActualFileExport: false;
  readonly strategyReviewReportDownloadSupport: false;
  readonly strategyReviewReportRealUiRendering: false;
  readonly strategyReviewReportRealScoring: false;
  readonly strategyReviewReportRealRanking: false;
  readonly strategyReviewReportRecommendations: false;
  readonly strategyReviewReportTradingSignals: false;
  readonly strategyReviewReportPaperTrading: false;
  readonly strategyReviewReportLiveTrading: false;
  readonly strategyReviewReportExecution: false;
  readonly strategyReviewReportSolanaRpc: false;
  readonly strategyReviewReportExternalNetwork: false;
  readonly strategyReviewReportPersistence: false;
  readonly strategyReviewReportInvestmentAdvice: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly notes: readonly string[];
}

export interface StrategyReviewReportFixture {
  readonly name: StrategyReviewReportFixtureName;
  readonly kind: StrategyReviewReportFixtureKind;
  readonly title: string;
  readonly description: string;
  readonly dashboardReferences: readonly StrategyReviewDashboardReference[];
  readonly sections: readonly StrategyReviewReportSectionFixture[];
  readonly summary: StrategyReviewReportSummaryFixture;
  readonly safetyBoundary: StrategyReviewReportSafetyBoundary;
  readonly safeNotes: readonly string[];
  readonly meta: StrategyReviewReportFixtureMeta;
}

export interface StrategyReviewReportValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewReportValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewReportValidationIssue[];
}

export interface StrategyReviewReportSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface StrategyReviewReportBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly sourceDashboardFixtureName?: StrategyReviewDashboardFixtureName | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface StrategyReviewReportBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyReviewReportFixture | null;
  readonly validation: StrategyReviewReportValidationResult;
  readonly safety: StrategyReviewReportSafetyResult;
}

export interface StrategyReviewReportFixtureCapabilities {
  readonly strategyReviewReportFixtures: true;
  readonly syntheticStrategyReviewReports: true;
  readonly strategyReviewReportBuilders: true;
  readonly strategyReviewReportSafetyValidation: true;
  readonly strategyReviewDashboardReferences: true;
  readonly strategyReviewReportActualFileExport: false;
  readonly strategyReviewReportDownloadSupport: false;
  readonly strategyReviewReportRealUiRendering: false;
  readonly strategyReviewReportRealScoring: false;
  readonly strategyReviewReportRealRanking: false;
  readonly strategyReviewReportRecommendations: false;
  readonly strategyReviewReportTradingSignals: false;
  readonly strategyReviewReportPaperTrading: false;
  readonly strategyReviewReportLiveTrading: false;
  readonly strategyReviewReportExecution: false;
  readonly strategyReviewReportSolanaRpc: false;
  readonly strategyReviewReportExternalNetwork: false;
  readonly strategyReviewReportPersistence: false;
  readonly strategyReviewReportInvestmentAdvice: false;
}
