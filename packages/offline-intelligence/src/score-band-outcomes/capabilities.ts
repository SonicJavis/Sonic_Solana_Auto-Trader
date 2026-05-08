/**
 * Phase 37 — Score Band Outcome Analysis Models v1: capability helpers.
 */

import type { ScoreBandOutcomeFixtureCapabilities } from './types.js';

export function getScoreBandOutcomeFixtureCapabilities(): ScoreBandOutcomeFixtureCapabilities {
  return {
    scoreBandOutcomeAnalysisFixtures: true,
    syntheticScoreBandOutcomes: true,
    scoreBandOutcomeBuilders: true,
    scoreBandOutcomeSafetyValidation: true,
    scoreBandReplayOutcomeReferences: true,
    scoreBandRealScoring: false,
    scoreBandRealBacktesting: false,
    scoreBandPaperTrading: false,
    scoreBandLiveTrading: false,
    scoreBandExecution: false,
    scoreBandSolanaRpc: false,
    scoreBandExternalNetwork: false,
    scoreBandPersistence: false,
    scoreBandFileExport: false,
    scoreBandInvestmentAdvice: false,
    scoreBandTradingSignals: false,
  };
}
