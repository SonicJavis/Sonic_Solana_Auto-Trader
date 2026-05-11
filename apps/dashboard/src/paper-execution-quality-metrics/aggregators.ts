/**
 * Phase 61 — Paper Execution Quality Metrics v1: aggregate summaries.
 */

import type {
  PaperExecutionFillStatus,
  PaperExecutionLatencyBucket,
  PaperExecutionQualityAggregateSummary,
  PaperExecutionQualityBand,
  PaperExecutionRejectionTaxonomyKind,
  PaperExecutionSlippageBucket,
  PaperExecutionQualityMetricFixture,
} from './types.js';
import {
  PAPER_EXECUTION_FILL_STATUSES,
  PAPER_EXECUTION_LATENCY_BUCKETS,
  PAPER_EXECUTION_QUALITY_BANDS,
  PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS,
  PAPER_EXECUTION_SLIPPAGE_BUCKETS,
} from './types.js';

function buildCountMap<T extends string>(values: readonly T[]): Record<T, number> {
  return values.reduce<Record<T, number>>((acc, value) => {
    acc[value] = 0;
    return acc;
  }, {} as Record<T, number>);
}

export function aggregatePaperExecutionQualityMetrics(
  fixtures: readonly PaperExecutionQualityMetricFixture[],
): PaperExecutionQualityAggregateSummary {
  const countByLatencyBucket = buildCountMap(
    PAPER_EXECUTION_LATENCY_BUCKETS,
  ) as Record<PaperExecutionLatencyBucket, number>;
  const countBySlippageBucket = buildCountMap(
    PAPER_EXECUTION_SLIPPAGE_BUCKETS,
  ) as Record<PaperExecutionSlippageBucket, number>;
  const countByFillStatus = buildCountMap(
    PAPER_EXECUTION_FILL_STATUSES,
  ) as Record<PaperExecutionFillStatus, number>;
  const countByRejectionReason = buildCountMap(
    PAPER_EXECUTION_REJECTION_TAXONOMY_KINDS,
  ) as Record<PaperExecutionRejectionTaxonomyKind, number>;
  const aggregateQualityDistribution = buildCountMap(
    PAPER_EXECUTION_QUALITY_BANDS,
  ) as Record<PaperExecutionQualityBand, number>;

  for (const fixture of fixtures) {
    countByLatencyBucket[fixture.latencyMetrics.latencyBucket] += 1;
    countBySlippageBucket[fixture.slippageMetrics.simulatedSlippageBucket] += 1;
    countByFillStatus[fixture.fillQualityMetrics.hypotheticalFillStatus] += 1;
    countByRejectionReason[fixture.rejectionMetrics.rejectionTaxonomyKind] += 1;
    aggregateQualityDistribution[fixture.scorecard.aggregateQualityBand] += 1;
  }

  return {
    aggregateId: 'phase61-paper-execution-quality-aggregate',
    fixtureCount: fixtures.length,
    countByLatencyBucket,
    countBySlippageBucket,
    countByFillStatus,
    countByRejectionReason,
    aggregateQualityDistribution,
    nonAdvisorySummary:
      'Aggregate quality distribution is hypothetical, paper-only, fixture-derived, and non-actionable.',
  };
}
