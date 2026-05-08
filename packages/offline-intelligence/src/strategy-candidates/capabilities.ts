/**
 * Phase 38 — Strategy Candidate Evaluation Fixtures v1: capability helpers.
 */

import type { StrategyCandidateFixtureCapabilities } from './types.js';

export function getStrategyCandidateFixtureCapabilities(): StrategyCandidateFixtureCapabilities {
  return {
    strategyCandidateEvaluationFixtures: true,
    syntheticStrategyCandidates: true,
    strategyCandidateBuilders: true,
    strategyCandidateSafetyValidation: true,
    strategyCandidateScoreBandReferences: true,
    strategyCandidateRealScoring: false,
    strategyCandidateRealRanking: false,
    strategyCandidateRealBacktesting: false,
    strategyCandidatePaperTrading: false,
    strategyCandidateLiveTrading: false,
    strategyCandidateExecution: false,
    strategyCandidateSolanaRpc: false,
    strategyCandidateExternalNetwork: false,
    strategyCandidatePersistence: false,
    strategyCandidateFileExport: false,
    strategyCandidateInvestmentAdvice: false,
    strategyCandidateTradingSignals: false,
    strategyCandidateRecommendations: false,
  };
}
