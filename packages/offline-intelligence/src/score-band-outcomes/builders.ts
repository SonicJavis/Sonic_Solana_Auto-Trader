/**
 * Phase 37 — Score Band Outcome Analysis Models v1: builders.
 */

import {
  PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT,
  PHASE_37_SCORE_BAND_OUTCOMES_SOURCE,
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS,
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES,
  type ScoreBandOutcomeAnalysisFixture,
  type ScoreBandOutcomeAnalysisFixtureKind,
  type ScoreBandOutcomeAnalysisFixtureName,
  type ScoreBandOutcomeBuildInput,
  type ScoreBandOutcomeBuildResult,
  type ScoreBandConfidenceIndicator,
  type ScoreBandOutcomeDistribution,
  type ScoreBandOutcomeSummary,
  type ScoreBandQualityIndicator,
  type ScoreBandRiskIndicator,
} from './types.js';
import { normalizeScoreBandOutcomeAnalysisFixture } from './normalization.js';
import {
  validateScoreBandOutcomeAnalysisFixture,
  validateScoreBandOutcomeSafety,
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
  riskIndicators: readonly ScoreBandRiskIndicator[],
): ScoreBandOutcomeSummary['overallRiskBand'] {
  if (riskIndicators.length === 0) return 'unknown';
  if (riskIndicators.some(r => r.level === 'critical')) return 'critical';
  if (riskIndicators.some(r => r.level === 'high')) return 'high';
  if (riskIndicators.some(r => r.level === 'moderate')) return 'elevated';
  return 'low';
}

function deriveOverallQualityBand(
  qualityIndicators: readonly ScoreBandQualityIndicator[],
): ScoreBandOutcomeSummary['overallQualityBand'] {
  if (qualityIndicators.length === 0) return 'unknown';
  if (qualityIndicators.some(q => q.level === 'high')) return 'high';
  if (qualityIndicators.some(q => q.level === 'moderate')) return 'moderate';
  return 'low';
}

function deriveOverallConfidenceBand(
  confidenceIndicators: readonly ScoreBandConfidenceIndicator[],
): ScoreBandOutcomeSummary['overallConfidenceBand'] {
  if (confidenceIndicators.length === 0) return 'none';
  if (confidenceIndicators.some(c => c.confidenceBand === 'high')) return 'high';
  if (confidenceIndicators.some(c => c.confidenceBand === 'moderate')) return 'moderate';
  if (confidenceIndicators.some(c => c.confidenceBand === 'low')) return 'low';
  return 'none';
}

function deriveDominantOutcomeCategory(
  distribution: ScoreBandOutcomeDistribution,
): ScoreBandOutcomeSummary['dominantOutcomeCategory'] {
  const counts: [ScoreBandOutcomeSummary['dominantOutcomeCategory'], number][] = [
    ['positive', distribution.positiveOutcomeCount],
    ['flat', distribution.flatOutcomeCount],
    ['risk-avoided', distribution.riskAvoidedCount],
    ['skipped', distribution.skippedCount],
    ['missed-opportunity', distribution.missedOpportunityCount],
    ['drawdown-contained', distribution.containedCount],
    ['safety-no-action', distribution.noActionCount],
  ];
  const max = Math.max(...counts.map(([, n]) => n));
  const dominant = counts.filter(([, n]) => n === max);
  return dominant.length === 1 && dominant[0] !== undefined ? dominant[0][0] : 'mixed';
}

function buildSummary(
  name: ScoreBandOutcomeAnalysisFixtureName,
  kind: ScoreBandOutcomeAnalysisFixtureKind,
  input: ScoreBandOutcomeBuildInput,
  riskIndicators: readonly ScoreBandRiskIndicator[],
  qualityIndicators: readonly ScoreBandQualityIndicator[],
  confidenceIndicators: readonly ScoreBandConfidenceIndicator[],
  distribution: ScoreBandOutcomeDistribution,
  safeNotes: readonly string[],
): ScoreBandOutcomeSummary {
  return {
    phase: 37,
    name,
    kind,
    scoreBandCategory: input.outcomeReference.scoreBandCategory,
    dominantOutcomeCategory: deriveDominantOutcomeCategory(distribution),
    overallRiskBand: deriveOverallRiskBand(riskIndicators),
    overallQualityBand: deriveOverallQualityBand(qualityIndicators),
    overallConfidenceBand: deriveOverallConfidenceBand(confidenceIndicators),
    riskCount: riskIndicators.length,
    qualityCount: qualityIndicators.length,
    confidenceCount: confidenceIndicators.length,
    topRiskCodes: topCodes(riskIndicators, 5),
    topQualityCodes: topCodes(qualityIndicators, 5),
    referencedReplayOutcomeFixtureName: input.outcomeReference.replayOutcomeFixtureName,
    fixtureOnly: true,
    syntheticOnly: true,
    localOnly: true,
    liveData: false,
    realScoring: false,
    realBacktesting: false,
    paperTrading: false,
    liveTrading: false,
    execution: false,
    nonAdvisory: true,
    nonAccusatory: true,
    safeToDisplay: true,
    generatedAt: PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT,
    notes: sortStrings(safeNotes),
  };
}

export function buildScoreBandOutcomeAnalysisFixture(
  input: ScoreBandOutcomeBuildInput,
): ScoreBandOutcomeBuildResult {
  const nameParsed = SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES.includes(
    input.name as ScoreBandOutcomeAnalysisFixtureName,
  );
  const kindParsed = SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS.includes(
    input.kind as ScoreBandOutcomeAnalysisFixtureKind,
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

  const name = input.name as ScoreBandOutcomeAnalysisFixtureName;
  const kind = input.kind as ScoreBandOutcomeAnalysisFixtureKind;
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

  const distribution: ScoreBandOutcomeDistribution = input.outcomeDistribution ?? {
    syntheticOutcomeCount: 1,
    positiveOutcomeCount: 0,
    flatOutcomeCount: 0,
    riskAvoidedCount: 0,
    skippedCount: 0,
    missedOpportunityCount: 0,
    containedCount: 0,
    noActionCount: 0,
    notes: [],
  };

  const summary = buildSummary(
    name,
    kind,
    input,
    riskIndicators,
    qualityIndicators,
    confidenceIndicators,
    distribution,
    safeNotes,
  );

  const fixture: ScoreBandOutcomeAnalysisFixture = {
    name,
    kind,
    scoreBandRange: {
      ...input.scoreBandRange,
      notes: sortStrings(input.scoreBandRange.notes),
    },
    outcomeReference: {
      ...input.outcomeReference,
      notes: sortStrings(input.outcomeReference.notes),
    },
    riskIndicators,
    qualityIndicators,
    confidenceIndicators,
    outcomeDistribution: {
      ...distribution,
      notes: sortStrings(distribution.notes),
    },
    summary,
    safeNotes,
    meta: {
      phase: 37,
      generatedAt: PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT,
      source: PHASE_37_SCORE_BAND_OUTCOMES_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      readOnly: true,
      localOnly: true,
      inMemoryOnly: true,
      liveData: false,
      realScoring: false,
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

  const normalized = normalizeScoreBandOutcomeAnalysisFixture(fixture);
  const safety = validateScoreBandOutcomeSafety(normalized);

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

  const validation = validateScoreBandOutcomeAnalysisFixture(normalized);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid ? normalized : null,
    validation,
    safety,
  };
}

export function buildScoreBandOutcomeSummary(
  fixture: ScoreBandOutcomeAnalysisFixture,
): ScoreBandOutcomeSummary {
  return fixture.summary;
}
