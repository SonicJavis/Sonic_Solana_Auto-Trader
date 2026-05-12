/**
 * Phase 61 — Paper Execution Quality Metrics v1: scorecards.
 */

import type {
  BuildPaperExecutionQualityScorecardInput,
  PaperExecutionQualityBand,
  PaperExecutionQualityScorecard,
} from './types.js';
import {
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
} from './types.js';

function deriveAggregateQualityBand(
  input: BuildPaperExecutionQualityScorecardInput,
): PaperExecutionQualityBand {
  if (input.rejectionMetrics.rejectionTaxonomyKind !== 'quality_no_rejection') {
    return 'quality_rejected';
  }

  const degradedCount = [
    input.latencyMetrics.latencyQualityLabel === 'quality_degraded',
    input.fillQualityMetrics.simulatedFillQualityLabel === 'quality_rejected' ||
      input.fillQualityMetrics.simulatedFillQualityLabel === 'quality_limited',
    input.slippageMetrics.slippageQualityLabel === 'quality_degraded' ||
      input.slippageMetrics.slippageQualityLabel === 'quality_limited',
  ].filter(Boolean).length;

  if (degradedCount >= 2) return 'quality_weak';
  if (degradedCount === 1) return 'quality_moderate';
  return 'quality_strong';
}

export function buildPaperExecutionQualityScorecard(
  input: BuildPaperExecutionQualityScorecardInput,
): PaperExecutionQualityScorecard {
  const aggregateQualityBand = deriveAggregateQualityBand(input);
  const qualityWarnings = [
    ...input.latencyMetrics.qualityNotes,
    ...input.fillQualityMetrics.qualityNotes,
    ...input.slippageMetrics.qualityNotes,
    ...input.rejectionMetrics.qualityNotes,
  ].filter(note => note.toLowerCase().includes('review') || note.toLowerCase().includes('non-actionable'));

  return {
    scorecardId: `phase61-scorecard-${input.fixtureId}`,
    scorecardKind: 'paper_execution_quality_scorecard',
    sourceSimulationFixtureName: input.sourceSimulationFixtureName,
    latencyQuality: input.latencyMetrics.latencyQualityLabel,
    fillQuality: input.fillQualityMetrics.simulatedFillQualityLabel,
    slippageQuality: input.slippageMetrics.slippageQualityLabel,
    rejectionQuality: input.rejectionMetrics.rejectionQualityLabel,
    aggregateQualityBand,
    qualityWarnings,
    limitationNotes: [
      'Hypothetical paper-only quality metric summary.',
      'Fixture-derived output only; non-actionable.',
    ],
    nonAdvisorySummary:
      'Paper-only execution quality summary generated from deterministic fixtures; non-actionable and fixture-derived.',
    sourceOutcomeId: input.fillQualityMetrics.sourceOutcomeId,
    sourceEvidenceReferenceIds: [...input.fillQualityMetrics.sourceOutcomeReferences],
    safetySummary: 'No live data, no signing path, no sending path, and no advisory output.',
    validationSummary:
      'Deterministic fixture-derived scorecard with safety-first quality taxonomy checks.',
    meta: {
      generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
      source: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
    },
  };
}
