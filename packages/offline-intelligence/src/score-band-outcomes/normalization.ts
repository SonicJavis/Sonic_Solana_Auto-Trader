/**
 * Phase 37 — Score Band Outcome Analysis Models v1: normalization helpers.
 */

import type {
  ScoreBandConfidenceIndicator,
  ScoreBandOutcomeAnalysisFixture,
  ScoreBandQualityIndicator,
  ScoreBandRiskIndicator,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function sortRiskIndicators(
  values: readonly ScoreBandRiskIndicator[],
): readonly ScoreBandRiskIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortQualityIndicators(
  values: readonly ScoreBandQualityIndicator[],
): readonly ScoreBandQualityIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortConfidenceIndicators(
  values: readonly ScoreBandConfidenceIndicator[],
): readonly ScoreBandConfidenceIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

export function normalizeScoreBandOutcomeAnalysisFixture(
  fixture: ScoreBandOutcomeAnalysisFixture,
): ScoreBandOutcomeAnalysisFixture {
  return {
    ...fixture,
    scoreBandRange: {
      ...fixture.scoreBandRange,
      notes: sortStrings(fixture.scoreBandRange.notes),
    },
    outcomeReference: {
      ...fixture.outcomeReference,
      notes: sortStrings(fixture.outcomeReference.notes),
    },
    riskIndicators: sortRiskIndicators(fixture.riskIndicators),
    qualityIndicators: sortQualityIndicators(fixture.qualityIndicators),
    confidenceIndicators: sortConfidenceIndicators(fixture.confidenceIndicators),
    outcomeDistribution: {
      ...fixture.outcomeDistribution,
      notes: sortStrings(fixture.outcomeDistribution.notes),
    },
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

export function serializeScoreBandOutcomeAnalysisFixture(
  fixture: ScoreBandOutcomeAnalysisFixture,
): string {
  return JSON.stringify(normalizeScoreBandOutcomeAnalysisFixture(fixture));
}

export function isScoreBandOutcomeAnalysisFixtureSerializable(value: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function areScoreBandOutcomeAnalysisFixturesEqual(
  left: ScoreBandOutcomeAnalysisFixture,
  right: ScoreBandOutcomeAnalysisFixture,
): boolean {
  return (
    serializeScoreBandOutcomeAnalysisFixture(left) ===
    serializeScoreBandOutcomeAnalysisFixture(right)
  );
}
