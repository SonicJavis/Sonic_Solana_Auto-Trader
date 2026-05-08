/**
 * Phase 38 — Strategy Candidate Evaluation Fixtures v1: builders.
 */

import {
  PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT,
  PHASE_38_STRATEGY_CANDIDATES_SOURCE,
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS,
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES,
  type StrategyCandidateBuildInput,
  type StrategyCandidateBuildResult,
  type StrategyCandidateConfidenceIndicator,
  type StrategyCandidateEvaluationCriterion,
  type StrategyCandidateEvaluationFixture,
  type StrategyCandidateEvaluationFixtureKind,
  type StrategyCandidateEvaluationFixtureName,
  type StrategyCandidateEvaluationSummary,
  type StrategyCandidateQualityIndicator,
  type StrategyCandidateRiskIndicator,
} from './types.js';
import { normalizeStrategyCandidateEvaluationFixture } from './normalization.js';
import {
  validateStrategyCandidateEvaluationFixture,
  validateStrategyCandidateSafety,
} from './validation.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort(
    (left, right) => left.localeCompare(right),
  );
}

function topCodes<T extends { readonly code: string }>(
  values: readonly T[],
  limit: number,
): readonly string[] {
  return values
    .map(value => value.code)
    .sort((left, right) => left.localeCompare(right))
    .slice(0, limit);
}

function deriveOverallRiskBand(
  riskIndicators: readonly StrategyCandidateRiskIndicator[],
): StrategyCandidateEvaluationSummary['overallRiskBand'] {
  if (riskIndicators.length === 0) return 'unknown';
  if (riskIndicators.some(r => r.level === 'critical')) return 'critical';
  if (riskIndicators.some(r => r.level === 'high')) return 'high';
  if (riskIndicators.some(r => r.level === 'moderate')) return 'elevated';
  return 'low';
}

function deriveOverallQualityBand(
  qualityIndicators: readonly StrategyCandidateQualityIndicator[],
): StrategyCandidateEvaluationSummary['overallQualityBand'] {
  if (qualityIndicators.length === 0) return 'unknown';
  if (qualityIndicators.some(q => q.level === 'high')) return 'high';
  if (qualityIndicators.some(q => q.level === 'moderate')) return 'moderate';
  return 'low';
}

function deriveOverallConfidenceBand(
  confidenceIndicators: readonly StrategyCandidateConfidenceIndicator[],
): StrategyCandidateEvaluationSummary['overallConfidenceBand'] {
  if (confidenceIndicators.length === 0) return 'none';
  if (confidenceIndicators.some(c => c.confidenceBand === 'high')) return 'high';
  if (confidenceIndicators.some(c => c.confidenceBand === 'moderate')) return 'moderate';
  if (confidenceIndicators.some(c => c.confidenceBand === 'low')) return 'low';
  return 'none';
}

function buildSummary(
  name: StrategyCandidateEvaluationFixtureName,
  kind: StrategyCandidateEvaluationFixtureKind,
  input: StrategyCandidateBuildInput,
  criteria: readonly StrategyCandidateEvaluationCriterion[],
  riskIndicators: readonly StrategyCandidateRiskIndicator[],
  qualityIndicators: readonly StrategyCandidateQualityIndicator[],
  confidenceIndicators: readonly StrategyCandidateConfidenceIndicator[],
  safeNotes: readonly string[],
): StrategyCandidateEvaluationSummary {
  const metCriteriaCount = criteria.filter(c => c.status === 'met').length;
  const partialCriteriaCount = criteria.filter(c => c.status === 'partial').length;
  const unmetCriteriaCount = criteria.filter(c => c.status === 'unmet').length;
  const unknownCriteriaCount = criteria.filter(c => c.status === 'unknown').length;

  return {
    phase: 38,
    name,
    kind,
    profileId: input.profile.candidateId,
    scoreBandCategory: input.scoreBandReference.scoreBandCategory,
    criteriaCount: criteria.length,
    metCriteriaCount,
    partialCriteriaCount,
    unmetCriteriaCount,
    unknownCriteriaCount,
    overallRiskBand: deriveOverallRiskBand(riskIndicators),
    overallQualityBand: deriveOverallQualityBand(qualityIndicators),
    overallConfidenceBand: deriveOverallConfidenceBand(confidenceIndicators),
    riskCount: riskIndicators.length,
    qualityCount: qualityIndicators.length,
    confidenceCount: confidenceIndicators.length,
    topRiskCodes: topCodes(riskIndicators, 5),
    topQualityCodes: topCodes(qualityIndicators, 5),
    referencedScoreBandOutcomeFixtureName: input.scoreBandReference.scoreBandOutcomeFixtureName,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    liveData: false,
    realScoring: false,
    realRanking: false,
    realBacktesting: false,
    paperTrading: false,
    liveTrading: false,
    execution: false,
    nonAdvisory: true,
    nonAccusatory: true,
    safeToDisplay: true,
    generatedAt: PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT,
    notes: sortStrings(safeNotes),
  };
}

export function buildStrategyCandidateEvaluationFixture(
  input: StrategyCandidateBuildInput,
): StrategyCandidateBuildResult {
  const nameParsed = STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES.includes(
    input.name as StrategyCandidateEvaluationFixtureName,
  );
  const kindParsed = STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS.includes(
    input.kind as StrategyCandidateEvaluationFixtureKind,
  );

  if (!nameParsed || !kindParsed) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          ...(!nameParsed
            ? [
                {
                  code: 'INVALID_NAME',
                  field: 'name',
                  message: `Unsupported fixture name: ${input.name}`,
                  severity: 'error' as const,
                },
              ]
            : []),
          ...(!kindParsed
            ? [
                {
                  code: 'INVALID_KIND',
                  field: 'kind',
                  message: `Unsupported fixture kind: ${input.kind}`,
                  severity: 'error' as const,
                },
              ]
            : []),
        ],
      },
      safety: { safe: true, violations: [] },
    };
  }

  const name = input.name as StrategyCandidateEvaluationFixtureName;
  const kind = input.kind as StrategyCandidateEvaluationFixtureKind;
  const criteria = [...(input.evaluationCriteria ?? [])].sort((left, right) =>
    left.code.localeCompare(right.code),
  );
  const riskIndicators = [...(input.riskIndicators ?? [])].sort((left, right) =>
    left.code.localeCompare(right.code),
  );
  const qualityIndicators = [...(input.qualityIndicators ?? [])].sort((left, right) =>
    left.code.localeCompare(right.code),
  );
  const confidenceIndicators = [...(input.confidenceIndicators ?? [])].sort((left, right) =>
    left.code.localeCompare(right.code),
  );
  const safeNotes = sortStrings(input.safeNotes);

  const summary = buildSummary(
    name,
    kind,
    input,
    criteria,
    riskIndicators,
    qualityIndicators,
    confidenceIndicators,
    safeNotes,
  );

  const fixture: StrategyCandidateEvaluationFixture = {
    name,
    kind,
    profile: {
      ...input.profile,
      notes: sortStrings(input.profile.notes),
    },
    scoreBandReference: {
      ...input.scoreBandReference,
      notes: sortStrings(input.scoreBandReference.notes),
    },
    evaluationCriteria: criteria.map(item => ({
      ...item,
      notes: sortStrings(item.notes),
    })),
    riskIndicators,
    qualityIndicators,
    confidenceIndicators,
    summary,
    safeNotes,
    meta: {
      phase: 38,
      generatedAt: PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT,
      source: PHASE_38_STRATEGY_CANDIDATES_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      readOnly: true,
      localOnly: true,
      inMemoryOnly: true,
      liveData: false,
      realScoring: false,
      realRanking: false,
      realBacktesting: false,
      paperTrading: false,
      liveTrading: false,
      execution: false,
      externalNetwork: false,
      persistence: false,
      fileExport: false,
      nonAdvisory: true,
      nonAccusatory: true,
      notes: sortStrings(safeNotes),
    },
  };

  const normalized = normalizeStrategyCandidateEvaluationFixture(fixture);
  const safety = validateStrategyCandidateSafety(normalized);

  if (!safety.safe) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          {
            code: 'SAFETY_VIOLATION',
            field: 'root',
            message: 'Fixture failed safety validation.',
            severity: 'error',
          },
        ],
      },
      safety,
    };
  }

  const validation = validateStrategyCandidateEvaluationFixture(normalized);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid ? normalized : null,
    validation,
    safety,
  };
}

export function buildStrategyCandidateEvaluationSummary(
  fixture: StrategyCandidateEvaluationFixture,
): StrategyCandidateEvaluationSummary {
  return fixture.summary;
}
