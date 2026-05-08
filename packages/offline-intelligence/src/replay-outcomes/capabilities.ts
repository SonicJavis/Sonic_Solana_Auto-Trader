/**
 * Phase 36 — Replay Outcome Fixture Models v1: capability helpers.
 */

import type { ReplayOutcomeFixtureCapabilities } from './types.js';

export function getReplayOutcomeFixtureCapabilities(): ReplayOutcomeFixtureCapabilities {
  return {
    replayOutcomeFixtures: true,
    syntheticReplayOutcomes: true,
    replayOutcomeBuilders: true,
    replayOutcomeSafetyValidation: true,
    replayOutcomeCompositeEvidenceReferences: true,
    replayOutcomeReportReferences: true,
    replayOutcomeDashboardReferences: true,
    replayOutcomeLiveData: false,
    replayOutcomeRealBacktesting: false,
    replayOutcomePaperTrading: false,
    replayOutcomeLiveTrading: false,
    replayOutcomeExecution: false,
    replayOutcomeSolanaRpc: false,
    replayOutcomeExternalNetwork: false,
    replayOutcomePersistence: false,
    replayOutcomeFileExport: false,
    replayOutcomeInvestmentAdvice: false,
    replayOutcomeTradingSignals: false,
  };
}
