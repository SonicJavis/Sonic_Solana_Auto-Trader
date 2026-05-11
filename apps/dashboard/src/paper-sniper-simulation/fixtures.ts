/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: fixtures.
 */

import { buildPaperSniperSimulationFixture } from './builders.js';
import {
  PAPER_SNIPER_SIMULATION_KINDS,
  PAPER_SNIPER_SIMULATION_NAMES,
  type PaperSniperSimulationFixture,
  type PaperSniperSimulationKind,
  type PaperSniperSimulationName,
} from './types.js';

export const PAPER_SNIPER_SIMULATION_FIXTURES = PAPER_SNIPER_SIMULATION_NAMES.map(fixtureName =>
  buildPaperSniperSimulationFixture({ fixtureName }),
) satisfies readonly PaperSniperSimulationFixture[];

export const PAPER_SNIPER_SIMULATION_FIXTURE_MAP: ReadonlyMap<string, PaperSniperSimulationFixture> =
  new Map(PAPER_SNIPER_SIMULATION_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (PAPER_SNIPER_SIMULATION_FIXTURES.length < 8) {
  throw new Error(
    `Phase 60 fixture count mismatch: expected >= 8, received ${PAPER_SNIPER_SIMULATION_FIXTURES.length}`,
  );
}

if (PAPER_SNIPER_SIMULATION_NAMES.length !== PAPER_SNIPER_SIMULATION_KINDS.length) {
  throw new Error('Phase 60 simulation name/kind cardinality mismatch');
}

export function listPaperSniperSimulationFixtures(): readonly PaperSniperSimulationFixture[] {
  return PAPER_SNIPER_SIMULATION_FIXTURES;
}

export function getPaperSniperSimulationFixture(
  fixtureId: string,
): PaperSniperSimulationFixture | null {
  return PAPER_SNIPER_SIMULATION_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { PAPER_SNIPER_SIMULATION_NAMES, PAPER_SNIPER_SIMULATION_KINDS };

export type { PaperSniperSimulationName, PaperSniperSimulationKind };
