/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: normalization.
 */

import {
  PAPER_SNIPER_SIMULATION_KINDS,
  PAPER_SNIPER_SIMULATION_NAMES,
  PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
  PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION,
  PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
  type PaperSniperSimulationFixture,
  type PaperSniperSimulationKind,
  type PaperSniperSimulationName,
} from './types.js';

export function stableDeterministicPaperSniperSimulationChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b, 'en-US'))
      .reduce<Record<string, unknown>>((acc, [key, nextValue]) => {
        acc[key] = sortKeysDeep(nextValue);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidPaperSniperSimulationName(value: unknown): value is PaperSniperSimulationName {
  return typeof value === 'string' && (PAPER_SNIPER_SIMULATION_NAMES as readonly string[]).includes(value);
}

export function isValidPaperSniperSimulationKind(value: unknown): value is PaperSniperSimulationKind {
  return typeof value === 'string' && (PAPER_SNIPER_SIMULATION_KINDS as readonly string[]).includes(value);
}

export function isValidPaperSniperSimulationGeneratedAt(
  value: unknown,
): value is typeof PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT {
  return value === PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT;
}

export function isValidPaperSniperSimulationSource(
  value: unknown,
): value is typeof PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE {
  return value === PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE;
}

export function isValidPaperSniperSimulationSchemaVersion(
  value: unknown,
): value is typeof PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION {
  return value === PHASE_60_PAPER_SNIPER_SIMULATION_SCHEMA_VERSION;
}

export function normalizePaperSniperSimulationFixture(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationFixture {
  return {
    ...fixture,
    outcome: {
      ...fixture.outcome,
      steps: [...fixture.outcome.steps].sort((a, b) => a.stepSequence - b.stepSequence),
    },
    selectorExamples: [...fixture.selectorExamples].sort((a, b) =>
      a.selectorId.localeCompare(b.selectorId, 'en-US'),
    ),
  };
}

export function serializePaperSniperSimulationFixture(
  fixture: PaperSniperSimulationFixture,
): string {
  return stablePrettyJsonStringify(normalizePaperSniperSimulationFixture(fixture));
}

export function arePaperSniperSimulationFixturesEqual(
  left: PaperSniperSimulationFixture,
  right: PaperSniperSimulationFixture,
): boolean {
  return (
    stableDeterministicPaperSniperSimulationChecksum(serializePaperSniperSimulationFixture(left)) ===
    stableDeterministicPaperSniperSimulationChecksum(serializePaperSniperSimulationFixture(right))
  );
}
