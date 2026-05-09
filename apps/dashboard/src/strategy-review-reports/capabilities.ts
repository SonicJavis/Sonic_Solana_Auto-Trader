import type { StrategyReviewReportFixtureCapabilities } from './types.js';

export function getStrategyReviewReportFixtureCapabilities(): StrategyReviewReportFixtureCapabilities {
  return {
    strategyReviewReportFixtures: true,
    syntheticStrategyReviewReports: true,
    strategyReviewReportBuilders: true,
    strategyReviewReportSafetyValidation: true,
    strategyReviewDashboardReferences: true,
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
  };
}
