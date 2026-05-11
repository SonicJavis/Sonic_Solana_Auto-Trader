/**
 * Phase 61 — Paper Execution Quality Metrics v1: view models.
 */

import type {
  PaperExecutionQualityMetricFixture,
  PaperExecutionQualityMetricsViewModel,
} from './types.js';

export function buildPaperExecutionQualityMetricsViewModel(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsViewModel {
  return {
    viewModelId: `phase61-view-model-${fixture.fixtureId}`,
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    sourceSimulationFixtureName: fixture.sourceSimulationFixtureName,
    latencyQualityLabel: fixture.latencyMetrics.latencyQualityLabel,
    fillStatus: fixture.fillQualityMetrics.hypotheticalFillStatus,
    slippageBucket: fixture.slippageMetrics.simulatedSlippageBucket,
    rejectionTaxonomyKind: fixture.rejectionMetrics.rejectionTaxonomyKind,
    aggregateQualityBand: fixture.scorecard.aggregateQualityBand,
    nonAdvisorySummary:
      'Hypothetical paper execution quality view; fixture-derived and not a signal.',
  };
}
