import type { StrategyReviewDashboardFixtureCapabilities } from './types.js';

export function getStrategyReviewDashboardFixtureCapabilities(): StrategyReviewDashboardFixtureCapabilities {
  return {
    strategyReviewDashboardFixtures: true,
    syntheticStrategyReviewDashboards: true,
    strategyReviewDashboardBuilders: true,
    strategyReviewDashboardSafetyValidation: true,
    strategyReviewMatrixReferences: true,
    strategyReviewRealUiRendering: false,
    strategyReviewRealScoring: false,
    strategyReviewRealRanking: false,
    strategyReviewRecommendations: false,
    strategyReviewTradingSignals: false,
    strategyReviewPaperTrading: false,
    strategyReviewLiveTrading: false,
    strategyReviewExecution: false,
    strategyReviewSolanaRpc: false,
    strategyReviewExternalNetwork: false,
    strategyReviewPersistence: false,
    strategyReviewFileExport: false,
    strategyReviewInvestmentAdvice: false,
  };
}
