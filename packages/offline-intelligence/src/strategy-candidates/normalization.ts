/**
 * Phase 38 — Strategy Candidate Evaluation Fixtures v1: normalization helpers.
 */

import type {
  StrategyCandidateConfidenceIndicator,
  StrategyCandidateEvaluationCriterion,
  StrategyCandidateEvaluationFixture,
  StrategyCandidateQualityIndicator,
  StrategyCandidateRiskIndicator,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function sortCriteria(
  values: readonly StrategyCandidateEvaluationCriterion[],
): readonly StrategyCandidateEvaluationCriterion[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortRiskIndicators(
  values: readonly StrategyCandidateRiskIndicator[],
): readonly StrategyCandidateRiskIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortQualityIndicators(
  values: readonly StrategyCandidateQualityIndicator[],
): readonly StrategyCandidateQualityIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

function sortConfidenceIndicators(
  values: readonly StrategyCandidateConfidenceIndicator[],
): readonly StrategyCandidateConfidenceIndicator[] {
  return [...values].sort((left, right) => left.code.localeCompare(right.code));
}

export function normalizeStrategyCandidateEvaluationFixture(
  fixture: StrategyCandidateEvaluationFixture,
): StrategyCandidateEvaluationFixture {
  return {
    ...fixture,
    profile: {
      ...fixture.profile,
      notes: sortStrings(fixture.profile.notes),
    },
    scoreBandReference: {
      ...fixture.scoreBandReference,
      notes: sortStrings(fixture.scoreBandReference.notes),
    },
    evaluationCriteria: sortCriteria(fixture.evaluationCriteria).map(item => ({
      ...item,
      notes: sortStrings(item.notes),
    })),
    riskIndicators: sortRiskIndicators(fixture.riskIndicators),
    qualityIndicators: sortQualityIndicators(fixture.qualityIndicators),
    confidenceIndicators: sortConfidenceIndicators(fixture.confidenceIndicators),
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

export function serializeStrategyCandidateEvaluationFixture(
  fixture: StrategyCandidateEvaluationFixture,
): string {
  return JSON.stringify(normalizeStrategyCandidateEvaluationFixture(fixture));
}

export function isStrategyCandidateEvaluationFixtureSerializable(value: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function areStrategyCandidateEvaluationFixturesEqual(
  left: StrategyCandidateEvaluationFixture,
  right: StrategyCandidateEvaluationFixture,
): boolean {
  return (
    serializeStrategyCandidateEvaluationFixture(left) ===
    serializeStrategyCandidateEvaluationFixture(right)
  );
}
