import type {
  BuildSyntheticStrategyComparisonScorecardInput,
  SyntheticStrategyComparisonQualityBand,
  SyntheticStrategyComparisonScorecard,
  SyntheticStrategyScoreComponents,
  SyntheticStrategyVariantId,
} from './types.js';
import {
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
} from './types.js';
import { deriveSyntheticStrategySensitivityWarnings } from './sensitivity.js';

const VARIANT_BIAS: Readonly<Record<SyntheticStrategyVariantId, number>> = {
  conservative_safety_first: 2,
  liquidity_sensitive: 1,
  latency_sensitive: 1,
  evidence_weighted: 2,
};

function qualityBandToScore(sourceQualityBand: BuildSyntheticStrategyComparisonScorecardInput['sourceQualityBand']): number {
  switch (sourceQualityBand) {
    case 'quality_strong':
      return 78;
    case 'quality_moderate':
      return 62;
    case 'quality_weak':
      return 44;
    case 'quality_rejected':
      return 20;
    default:
      return 35;
  }
}

function riskBandToAdjustment(sourceRiskBand: BuildSyntheticStrategyComparisonScorecardInput['sourceRiskBand']): number {
  switch (sourceRiskBand) {
    case 'low':
      return 4;
    case 'moderate':
      return 1;
    case 'elevated':
      return -4;
    case 'high':
      return -8;
    case 'rejected':
      return -12;
    default:
      return -2;
  }
}

function deriveQualityBand(score: number): SyntheticStrategyComparisonQualityBand {
  if (score >= 70) return 'relative_strong';
  if (score >= 55) return 'relative_moderate';
  if (score >= 35) return 'relative_limited';
  return 'relative_rejected';
}

export function buildSyntheticStrategyComparisonScorecard(
  input: BuildSyntheticStrategyComparisonScorecardInput,
): SyntheticStrategyComparisonScorecard {
  const base = qualityBandToScore(input.sourceQualityBand);
  const riskAdjustment = riskBandToAdjustment(input.sourceRiskBand);
  const safetyAdjustment =
    input.sourceQualityBand === 'quality_rejected' || input.sourceRiskBand === 'rejected' ? -6 : 0;

  const scoreComponents: SyntheticStrategyScoreComponents = {
    latencyComponent:
      input.scenario.sharedInputs.latencyQualityLabel === 'quality_degraded' ? 10 : 17,
    fillComponent: input.scenario.sharedInputs.fillStatus === 'hypothetical_fill_complete' ? 18 : 12,
    slippageComponent:
      input.scenario.sharedInputs.slippageBucket === 'extreme'
        ? 6
        : input.scenario.sharedInputs.slippageBucket === 'high'
          ? 9
          : 14,
    rejectionComponent: input.scenario.sharedInputs.rejectionTaxonomyKind === 'quality_no_rejection' ? 16 : 8,
    evidenceComponent: input.variantId === 'evidence_weighted' ? 16 : 13,
  };

  const weightedComponentTotal =
    scoreComponents.latencyComponent +
    scoreComponents.fillComponent +
    scoreComponents.slippageComponent +
    scoreComponents.rejectionComponent +
    scoreComponents.evidenceComponent;

  const aggregateFixtureScore = Math.max(
    0,
    Math.min(100, base + riskAdjustment + safetyAdjustment + VARIANT_BIAS[input.variantId] + weightedComponentTotal / 10),
  );

  return {
    scorecardId: `${input.scenario.scenarioId}-${input.variantId}-scorecard`,
    variantId: input.variantId,
    scenarioId: input.scenario.scenarioId,
    sourceMetricFixtureName: input.sourceMetricFixtureName,
    scoreComponents,
    aggregateFixtureScore,
    riskAdjustment,
    safetyAdjustment,
    relativeRank: 0,
    qualityBand: deriveQualityBand(aggregateFixtureScore),
    sensitivityWarnings: deriveSyntheticStrategySensitivityWarnings(input.variantId, input.scenario),
    limitationNotes: [
      'Hypothetical fixture-score comparison only.',
      'Not a signal, not live predictive, and requires review.',
    ],
    nonAdvisorySummary:
      'Hypothetical synthetic comparison score under fixture constraints; non-actionable and not live predictive.',
    safetySummary: 'No live data, no execution path, no wallet path, and no advisory output.',
    validationSummary:
      'Deterministic scorecard derived from fixture inputs with sensitivity and overfit warning taxonomy checks.',
    meta: {
      generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
      source: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
    },
  };
}
