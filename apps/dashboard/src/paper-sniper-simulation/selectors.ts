/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: selectors.
 */

import {
  PAPER_SNIPER_SIMULATION_FIXTURE_MAP,
  PAPER_SNIPER_SIMULATION_FIXTURES,
} from './fixtures.js';
import type {
  PaperSniperSimulationApiSummaryContract,
  PaperSniperSimulationFixture,
  PaperSniperSimulationOutcome,
  PaperSniperSimulationSelectorQuery,
  PaperSniperSimulationSelectorResult,
  PaperSniperSimulationViewModel,
} from './types.js';

export function selectPaperSniperSimulationFixture(
  query: PaperSniperSimulationSelectorQuery = {},
): PaperSniperSimulationSelectorResult {
  const fromId = query.fixtureId ? PAPER_SNIPER_SIMULATION_FIXTURE_MAP.get(query.fixtureId) ?? null : null;

  const fixture =
    fromId ??
    PAPER_SNIPER_SIMULATION_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (
        query.sourcePhase58FixtureName &&
        candidate.sourcePhase58FixtureName !== query.sourcePhase58FixtureName
      ) {
        return false;
      }
      if (
        query.sourcePhase59FixtureName &&
        candidate.sourcePhase59FixtureName !== query.sourcePhase59FixtureName
      ) {
        return false;
      }
      return true;
    }) ??
    PAPER_SNIPER_SIMULATION_FIXTURES[0];

  return {
    selectorId: `phase60-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase60-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'clean_launch_paper_sniper_simulation',
    matched:
      fixture !== undefined &&
      (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
      (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
      (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind),
    source: 'synthetic_fixture_only',
  };
}

export function selectPaperSniperSimulationOutcome(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationOutcome {
  return fixture.outcome;
}

export function selectPaperSniperSimulationViewModel(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationViewModel {
  return fixture.viewModel;
}

export function selectPaperSniperSimulationApiSummary(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationApiSummaryContract {
  return fixture.apiContracts.summary;
}
