/**
 * Phase 36 — Replay Outcome Fixture Models v1: normalization helpers.
 */

import type {
  ReplayOutcomeFixture,
  ReplayOutcomeQualityIndicator,
  ReplayOutcomeRiskIndicator,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function sortRiskIndicators(
  values: readonly ReplayOutcomeRiskIndicator[],
): readonly ReplayOutcomeRiskIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortQualityIndicators(
  values: readonly ReplayOutcomeQualityIndicator[],
): readonly ReplayOutcomeQualityIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

export function normalizeReplayOutcomeFixture(
  fixture: ReplayOutcomeFixture,
): ReplayOutcomeFixture {
  return {
    ...fixture,
    scenarioReference: {
      ...fixture.scenarioReference,
      notes: sortStrings(fixture.scenarioReference.notes),
    },
    observation: {
      ...fixture.observation,
      entry: {
        ...fixture.observation.entry,
        notes: sortStrings(fixture.observation.entry.notes),
      },
      exit: {
        ...fixture.observation.exit,
        notes: sortStrings(fixture.observation.exit.notes),
      },
      notes: sortStrings(fixture.observation.notes),
    },
    riskIndicators: sortRiskIndicators(fixture.riskIndicators),
    qualityIndicators: sortQualityIndicators(fixture.qualityIndicators),
    summary: {
      ...fixture.summary,
      topRiskCodes: sortStrings(fixture.summary.topRiskCodes),
      topQualityCodes: sortStrings(fixture.summary.topQualityCodes),
      notes: sortStrings(fixture.summary.notes),
    },
    safeNotes: sortStrings(fixture.safeNotes),
    meta: {
      ...fixture.meta,
      notes: sortStrings(fixture.meta.notes),
    },
  };
}

export function serializeReplayOutcomeFixture(
  fixture: ReplayOutcomeFixture,
): string {
  return JSON.stringify(normalizeReplayOutcomeFixture(fixture));
}

export function isReplayOutcomeFixtureSerializable(value: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function areReplayOutcomeFixturesEqual(
  left: ReplayOutcomeFixture,
  right: ReplayOutcomeFixture,
): boolean {
  return serializeReplayOutcomeFixture(left) === serializeReplayOutcomeFixture(right);
}
