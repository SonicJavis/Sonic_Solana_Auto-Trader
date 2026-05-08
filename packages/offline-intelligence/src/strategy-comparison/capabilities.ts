/**
 * Phase 39 — Strategy Comparison Matrix Fixtures v1: capabilities.
 */

import type { StrategyComparisonMatrixFixtureCapabilities } from './types.js';

export function getStrategyComparisonMatrixCapabilities(): StrategyComparisonMatrixFixtureCapabilities {
  return {
    strategyComparisonMatrixFixtures: true,
    syntheticStrategyComparisonMatrices: true,
    strategyComparisonMatrixBuilders: true,
    strategyComparisonMatrixSafetyValidation: true,
    strategyComparisonCandidateReferences: true,
    strategyComparisonRealScoring: false,
    strategyComparisonRealRanking: false,
    strategyComparisonRealBacktesting: false,
    strategyComparisonPaperTrading: false,
    strategyComparisonLiveTrading: false,
    strategyComparisonExecution: false,
    strategyComparisonSolanaRpc: false,
    strategyComparisonExternalNetwork: false,
    strategyComparisonPersistence: false,
    strategyComparisonFileExport: false,
    strategyComparisonInvestmentAdvice: false,
    strategyComparisonTradingSignals: false,
    strategyComparisonRecommendations: false,
  };
}
