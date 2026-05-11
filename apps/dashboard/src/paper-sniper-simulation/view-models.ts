/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: view models.
 */

import type { PaperSniperSimulationFixture, PaperSniperSimulationViewModel } from './types.js';

export function buildPaperSniperSimulationViewModel(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationViewModel {
  return {
    viewModelId: `phase60-view-${fixture.fixtureId}`,
    fixtureId: fixture.fixtureId,
    simulationKind: fixture.fixtureKind,
    sourcePhase58FixtureName: fixture.sourcePhase58FixtureName,
    sourceRiskBand: fixture.sourceRiskBand,
    projectedStatus: fixture.outcome.outcomeStatus,
    projectedFillPct: fixture.outcome.expectedFillPct,
    projectedSlippageBps: fixture.outcome.expectedSlippageBps,
    projectedLatencyMs: fixture.outcome.expectedLatencyMs,
    nonAdvisorySummary:
      'Paper sniper simulation output is fixture-only, deterministic, local-only, and non-executable.',
  };
}
