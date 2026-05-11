/**
 * Phase 61 — Paper Execution Quality Metrics v1: builders.
 */

import {
  PAPER_SNIPER_SIMULATION_FIXTURES,
  type PaperSniperSimulationFixture,
} from '../paper-sniper-simulation/index.js';
import { getPaperExecutionQualityMetricsCapabilities } from './capabilities.js';
import { buildPaperExecutionQualityMetricsApiContract } from './contracts.js';
import { buildPaperFillQualityMetrics } from './fill-quality-metrics.js';
import { buildPaperLatencyMetrics } from './latency-metrics.js';
import { stableDeterministicPaperExecutionQualityMetricsChecksum } from './normalization.js';
import { buildPaperRejectionMetrics } from './rejection-metrics.js';
import { buildPaperExecutionQualityScorecard } from './scorecards.js';
import { buildPaperSlippageMetrics } from './slippage-metrics.js';
import type {
  BuildPaperExecutionQualityMetricFixtureInput,
  PaperExecutionQualityMetricFixture,
  PaperExecutionQualityMetricKind,
  PaperExecutionQualityMetricName,
} from './types.js';
import {
  PAPER_EXECUTION_QUALITY_METRICS_PHASE,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_VERSION,
} from './types.js';
import { buildPaperExecutionQualityMetricsViewModel } from './view-models.js';

interface ScenarioDefinition {
  readonly fixtureKind: PaperExecutionQualityMetricKind;
  readonly sourceSimulationFixtureName: PaperSniperSimulationFixture['fixtureName'];
}

const SCENARIOS: Readonly<Record<PaperExecutionQualityMetricName, ScenarioDefinition>> = {
  'clean-launch-paper-execution-quality-metrics': {
    fixtureKind: 'clean_launch_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'clean-launch-paper-sniper-simulation',
  },
  'thin-liquidity-paper-execution-quality-metrics': {
    fixtureKind: 'thin_liquidity_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'thin-liquidity-paper-sniper-simulation',
  },
  'concentrated-holders-paper-execution-quality-metrics': {
    fixtureKind: 'concentrated_holders_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'concentrated-holders-paper-sniper-simulation',
  },
  'suspicious-creator-paper-execution-quality-metrics': {
    fixtureKind: 'suspicious_creator_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'suspicious-creator-paper-sniper-simulation',
  },
  'possible-bundle-cluster-paper-execution-quality-metrics': {
    fixtureKind: 'possible_bundle_cluster_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'possible-bundle-cluster-paper-sniper-simulation',
  },
  'metadata-incomplete-paper-execution-quality-metrics': {
    fixtureKind: 'metadata_incomplete_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'metadata-incomplete-paper-sniper-simulation',
  },
  'high-early-volume-paper-execution-quality-metrics': {
    fixtureKind: 'high_early_volume_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'high-early-volume-paper-sniper-simulation',
  },
  'safety-rejected-paper-execution-quality-metrics': {
    fixtureKind: 'safety_rejected_paper_execution_quality_metrics',
    sourceSimulationFixtureName: 'safety-rejected-paper-sniper-simulation',
  },
} as const;

function getSourceSimulationFixture(
  fixtureName: PaperSniperSimulationFixture['fixtureName'],
): PaperSniperSimulationFixture {
  const fixture = PAPER_SNIPER_SIMULATION_FIXTURES.find(candidate => candidate.fixtureName === fixtureName);
  if (!fixture) {
    throw new Error(`Phase 61 source Phase 60 fixture not found: ${fixtureName}`);
  }
  return fixture;
}

export function buildPaperExecutionQualityMetricFixture(
  input: BuildPaperExecutionQualityMetricFixtureInput,
): PaperExecutionQualityMetricFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const sourceSimulationFixture = getSourceSimulationFixture(scenario.sourceSimulationFixtureName);
  const fixtureId = `phase61-fixture-${input.fixtureName}`;
  const metricSetId = `phase61-metric-set-${input.fixtureName}`;
  const deterministicSeed = stableDeterministicPaperExecutionQualityMetricsChecksum(
    `phase61-${input.fixtureName}-seed`,
  );

  const latencyMetrics = buildPaperLatencyMetrics({
    fixtureId,
    sourceLatencyBucket: sourceSimulationFixture.latencyModel.latencyBucket,
  });

  const lastStep = sourceSimulationFixture.outcome.steps.at(-1) ?? sourceSimulationFixture.outcome.steps[0];
  if (!lastStep) {
    throw new Error(`Phase 61 missing deterministic source simulation steps: ${sourceSimulationFixture.fixtureName}`);
  }

  const fillQualityMetrics = buildPaperFillQualityMetrics({
    fixtureId,
    sourceOutcomeStatus: sourceSimulationFixture.outcome.outcomeStatus,
    sourceFailureReason: lastStep.failureReason,
    sourceOutcomeId: sourceSimulationFixture.outcome.outcomeId,
  });

  const slippageMetrics = buildPaperSlippageMetrics({
    fixtureId,
    sourceSlippageBucket: sourceSimulationFixture.slippageModel.slippageBucket,
    sourceLiquidityBucket: sourceSimulationFixture.marketModel.liquidityBucket,
  });

  const rejectionMetrics = buildPaperRejectionMetrics({
    fixtureId,
    sourceRiskBand: sourceSimulationFixture.sourceRiskBand,
    sourceFailureBucket: sourceSimulationFixture.failureModel.failureBucket,
    sourceOutcomeStatus: sourceSimulationFixture.outcome.outcomeStatus,
    sourceFailureReason: lastStep.failureReason,
  });

  const scorecard = buildPaperExecutionQualityScorecard({
    fixtureId,
    sourceSimulationFixtureName: sourceSimulationFixture.fixtureName,
    latencyMetrics,
    fillQualityMetrics,
    slippageMetrics,
    rejectionMetrics,
  });

  const selectorExamples = [
    {
      selectorId: `phase61-selector-${fixtureId}`,
      selectedFixtureId: fixtureId,
      selectedFixtureKind: scenario.fixtureKind,
      matched: true,
      source: 'synthetic_fixture_only' as const,
    },
  ] as const;

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: PAPER_EXECUTION_QUALITY_METRICS_PHASE,
    schemaVersion: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION,
    sourceSimulationFixtureName: sourceSimulationFixture.fixtureName,
    sourceEvidenceFixtureName: sourceSimulationFixture.sourcePhase59FixtureName,
    sourceRiskFixtureName: sourceSimulationFixture.sourcePhase58FixtureName,
    sourceReplayFixtureName: sourceSimulationFixture.sourcePhase57FixtureName,
    sourceLifecycleFixtureName: sourceSimulationFixture.sourcePhase56FixtureName,
    sourceRiskBand: sourceSimulationFixture.sourceRiskBand,
    metricsIdentity: {
      metricSetId,
      metricSetName: input.fixtureName,
      metricSetKind: scenario.fixtureKind,
      sourceSimulationFixtureName: sourceSimulationFixture.fixtureName,
      sourceEvidenceFixtureName: sourceSimulationFixture.sourcePhase59FixtureName,
      sourceRiskFixtureName: sourceSimulationFixture.sourcePhase58FixtureName,
      sourceReplayFixtureName: sourceSimulationFixture.sourcePhase57FixtureName,
      sourceLifecycleFixtureName: sourceSimulationFixture.sourcePhase56FixtureName,
      schemaVersion: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SCHEMA_VERSION,
      deterministicSeed,
      generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
    },
    latencyMetrics,
    fillQualityMetrics,
    slippageMetrics,
    rejectionMetrics,
    scorecard,
    aggregateSummary: undefined as unknown as PaperExecutionQualityMetricFixture['aggregateSummary'],
    viewModel: undefined as unknown as PaperExecutionQualityMetricFixture['viewModel'],
    apiContracts: undefined as unknown as PaperExecutionQualityMetricFixture['apiContracts'],
    selectorExamples,
    capabilityFlags: getPaperExecutionQualityMetricsCapabilities(),
    meta: {
      generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
      source: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
      version: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_VERSION,
      phase: PAPER_EXECUTION_QUALITY_METRICS_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true as const,
      localOnly: true as const,
      readOnly: true as const,
      noLiveData: true as const,
      noNetworkAccess: true as const,
      hypotheticalOnly: true as const,
      nonAdvisory: true as const,
      notASignal: true as const,
    },
  };

  const viewModel = buildPaperExecutionQualityMetricsViewModel(
    partialFixture as unknown as PaperExecutionQualityMetricFixture,
  );

  const withViewModel = {
    ...partialFixture,
    viewModel,
  } as PaperExecutionQualityMetricFixture;

  return {
    ...withViewModel,
    apiContracts: buildPaperExecutionQualityMetricsApiContract(withViewModel),
  };
}
