/**
 * Phase 61 — Paper Execution Quality Metrics v1: fill quality metrics.
 */

import type {
  BuildPaperFillQualityMetricsInput,
  PaperExecutionFillQualityLabel,
  PaperExecutionFillStatus,
  PaperExecutionMissedEntryClassification,
  PaperExecutionRejectionTaxonomyKind,
  PaperFillQualityMetrics,
} from './types.js';

function mapFillStatus(
  sourceStatus: BuildPaperFillQualityMetricsInput['sourceOutcomeStatus'],
): PaperExecutionFillStatus {
  if (sourceStatus === 'simulated_fill') return 'hypothetical_fill_complete';
  if (sourceStatus === 'simulated_partial_fill') return 'hypothetical_fill_partial';
  return 'hypothetical_rejected';
}

function mapMissedEntryClassification(
  sourceFailureReason: BuildPaperFillQualityMetricsInput['sourceFailureReason'],
  status: PaperExecutionFillStatus,
): PaperExecutionMissedEntryClassification {
  if (status !== 'hypothetical_rejected') return 'none';
  if (sourceFailureReason === 'stale_quote') return 'missed_due_to_latency';
  if (sourceFailureReason === 'liquidity_failure') return 'missed_due_to_liquidity';
  if (sourceFailureReason === 'route_mismatch') return 'missed_due_to_insufficient_evidence';
  return 'missed_due_to_safety';
}

function mapRejectionReason(
  sourceFailureReason: BuildPaperFillQualityMetricsInput['sourceFailureReason'],
): PaperExecutionRejectionTaxonomyKind {
  if (sourceFailureReason === 'none') return 'quality_no_rejection';
  if (sourceFailureReason === 'stale_quote') return 'quality_rejected_latency';
  if (sourceFailureReason === 'route_mismatch') return 'quality_rejected_replay_mismatch';
  if (sourceFailureReason === 'liquidity_failure') return 'quality_rejected_liquidity';
  return 'quality_rejected_safety';
}

function mapFillQualityLabel(status: PaperExecutionFillStatus): PaperExecutionFillQualityLabel {
  if (status === 'hypothetical_fill_complete') return 'quality_high';
  if (status === 'hypothetical_fill_partial') return 'quality_moderate';
  if (status === 'hypothetical_missed_entry') return 'quality_limited';
  return 'quality_rejected';
}

export function buildPaperFillQualityMetrics(
  input: BuildPaperFillQualityMetricsInput,
): PaperFillQualityMetrics {
  const hypotheticalFillStatus = mapFillStatus(input.sourceOutcomeStatus);
  const simulatedMissedEntryClassification = mapMissedEntryClassification(
    input.sourceFailureReason,
    hypotheticalFillStatus,
  );
  const simulatedRejectionReason = mapRejectionReason(input.sourceFailureReason);

  return {
    metricsId: `phase61-fill-quality-${input.fixtureId}`,
    hypotheticalFillStatus,
    simulatedFillQualityLabel: mapFillQualityLabel(hypotheticalFillStatus),
    simulatedMissedEntryClassification,
    simulatedRejectionReason,
    sourceOutcomeId: input.sourceOutcomeId,
    sourceOutcomeReferences: [
      `source-outcome:${input.sourceOutcomeId}`,
      `source-failure:${input.sourceFailureReason}`,
    ],
    qualityNotes: [
      'Fill quality is hypothetical and non-actionable.',
      'No real orders or real fills are represented.',
    ],
  };
}
