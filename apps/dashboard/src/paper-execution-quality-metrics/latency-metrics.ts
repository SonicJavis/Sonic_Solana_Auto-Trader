/**
 * Phase 61 — Paper Execution Quality Metrics v1: latency metrics.
 */

import type {
  BuildPaperLatencyMetricsInput,
  PaperExecutionConfirmationDelayBucket,
  PaperExecutionLatencyBucket,
  PaperExecutionLatencyQualityLabel,
  PaperExecutionObservationDelayBucket,
  PaperExecutionSubmissionDelayBucket,
  PaperLatencyMetrics,
} from './types.js';

function mapLatencyBucket(
  sourceLatencyBucket: BuildPaperLatencyMetricsInput['sourceLatencyBucket'],
): PaperExecutionLatencyBucket {
  if (sourceLatencyBucket === 'fast') return 'ultra_low';
  if (sourceLatencyBucket === 'standard') return 'low';
  if (sourceLatencyBucket === 'slow') return 'high';
  return 'critical';
}

function mapDelayBucket(
  latencyBucket: PaperExecutionLatencyBucket,
): {
  observationDelayBucket: PaperExecutionObservationDelayBucket;
  simulatedSubmissionDelayBucket: PaperExecutionSubmissionDelayBucket;
  simulatedConfirmationDelayBucket: PaperExecutionConfirmationDelayBucket;
} {
  if (latencyBucket === 'ultra_low') {
    return {
      observationDelayBucket: 'minimal',
      simulatedSubmissionDelayBucket: 'minimal',
      simulatedConfirmationDelayBucket: 'light',
    };
  }
  if (latencyBucket === 'low') {
    return {
      observationDelayBucket: 'light',
      simulatedSubmissionDelayBucket: 'light',
      simulatedConfirmationDelayBucket: 'elevated',
    };
  }
  if (latencyBucket === 'moderate' || latencyBucket === 'high') {
    return {
      observationDelayBucket: 'elevated',
      simulatedSubmissionDelayBucket: 'elevated',
      simulatedConfirmationDelayBucket: 'severe',
    };
  }
  return {
    observationDelayBucket: 'severe',
    simulatedSubmissionDelayBucket: 'severe',
    simulatedConfirmationDelayBucket: 'severe',
  };
}

function mapLatencyQualityLabel(
  latencyBucket: PaperExecutionLatencyBucket,
): PaperExecutionLatencyQualityLabel {
  if (latencyBucket === 'ultra_low' || latencyBucket === 'low') return 'quality_excellent';
  if (latencyBucket === 'moderate') return 'quality_good';
  return 'quality_degraded';
}

export function buildPaperLatencyMetrics(input: BuildPaperLatencyMetricsInput): PaperLatencyMetrics {
  const latencyBucket = mapLatencyBucket(input.sourceLatencyBucket);
  const delays = mapDelayBucket(latencyBucket);

  return {
    metricsId: `phase61-latency-${input.fixtureId}`,
    latencyBucket,
    observationDelayBucket: delays.observationDelayBucket,
    simulatedSubmissionDelayBucket: delays.simulatedSubmissionDelayBucket,
    simulatedConfirmationDelayBucket: delays.simulatedConfirmationDelayBucket,
    latencyQualityLabel: mapLatencyQualityLabel(latencyBucket),
    qualityNotes: [
      'Latency metrics are hypothetical and fixture-derived only.',
      'No timers or runtime clocks are used.',
    ],
  };
}
