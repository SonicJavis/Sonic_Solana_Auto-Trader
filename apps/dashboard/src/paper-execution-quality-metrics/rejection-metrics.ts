/**
 * Phase 61 — Paper Execution Quality Metrics v1: rejection metrics.
 */

import type {
  BuildPaperRejectionMetricsInput,
  PaperExecutionMissedEntryClassification,
  PaperExecutionRejectionTaxonomyKind,
  PaperRejectionMetrics,
} from './types.js';

function mapRejectionTaxonomyKind(
  input: BuildPaperRejectionMetricsInput,
): PaperExecutionRejectionTaxonomyKind {
  if (input.sourceOutcomeStatus !== 'simulated_reject') return 'quality_no_rejection';
  if (input.sourceFailureReason === 'stale_quote') return 'quality_rejected_latency';
  if (input.sourceFailureReason === 'route_mismatch') return 'quality_rejected_replay_mismatch';
  if (input.sourceFailureReason === 'liquidity_failure') return 'quality_rejected_liquidity';
  if (input.sourceRiskBand === 'rejected') return 'quality_rejected_safety';
  if (input.sourceRiskBand === 'high' || input.sourceFailureBucket === 'critical') {
    return 'quality_rejected_risk';
  }
  return 'quality_rejected_insufficient_evidence';
}

function mapMissedEntryReason(
  kind: PaperExecutionRejectionTaxonomyKind,
): PaperExecutionMissedEntryClassification {
  if (kind === 'quality_no_rejection') return 'none';
  if (kind === 'quality_rejected_latency') return 'missed_due_to_latency';
  if (kind === 'quality_rejected_liquidity') return 'missed_due_to_liquidity';
  if (kind === 'quality_rejected_safety') return 'missed_due_to_safety';
  return 'missed_due_to_insufficient_evidence';
}

export function buildPaperRejectionMetrics(
  input: BuildPaperRejectionMetricsInput,
): PaperRejectionMetrics {
  const rejectionTaxonomyKind = mapRejectionTaxonomyKind(input);

  return {
    metricsId: `phase61-rejection-${input.fixtureId}`,
    rejectionTaxonomyKind,
    rejectionQualityLabel:
      rejectionTaxonomyKind === 'quality_no_rejection' ? 'quality_clear' : 'quality_blocked',
    missedEntryReason: mapMissedEntryReason(rejectionTaxonomyKind),
    qualityNotes: [
      'Rejection taxonomy is hypothetical and fixture-derived.',
      'Any rejection output is non-actionable and requires review.',
    ],
  };
}
