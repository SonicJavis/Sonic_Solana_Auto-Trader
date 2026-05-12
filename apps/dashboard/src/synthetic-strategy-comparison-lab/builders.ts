import {
  PAPER_EXECUTION_QUALITY_METRIC_FIXTURES,
  type PaperExecutionQualityMetricFixture,
} from '../paper-execution-quality-metrics/index.js';
import { buildSyntheticStrategyComparisonAggregate } from './aggregators.js';
import { getSyntheticStrategyComparisonLabCapabilities } from './capabilities.js';
import { buildSyntheticStrategyComparisonRun } from './comparison-runs.js';
import { buildSyntheticStrategyComparisonLabApiContract } from './contracts.js';
import { stableDeterministicSyntheticStrategyComparisonLabChecksum } from './normalization.js';
import { buildSyntheticStrategyScenarioMatrix } from './scenario-matrix.js';
import { buildSyntheticStrategyComparisonScorecard } from './scorecards.js';
import { buildSyntheticStrategyVariants } from './strategy-variants.js';
import type {
  BuildSyntheticStrategyComparisonLabFixtureInput,
  SyntheticStrategyComparisonLabFixture,
  SyntheticStrategyComparisonLabKind,
  SyntheticStrategyComparisonLabName,
} from './types.js';
import {
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_VERSION,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE,
} from './types.js';
import { buildSyntheticStrategyComparisonLabViewModel } from './view-models.js';

interface ScenarioDefinition {
  readonly fixtureKind: SyntheticStrategyComparisonLabKind;
  readonly sourceMetricFixtureName: PaperExecutionQualityMetricFixture['fixtureName'];
}

const SCENARIOS: Readonly<Record<SyntheticStrategyComparisonLabName, ScenarioDefinition>> = {
  'clean-launch-synthetic-strategy-comparison-lab': {
    fixtureKind: 'clean_launch_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'clean-launch-paper-execution-quality-metrics',
  },
  'thin-liquidity-synthetic-strategy-comparison-lab': {
    fixtureKind: 'thin_liquidity_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'thin-liquidity-paper-execution-quality-metrics',
  },
  'concentrated-holders-synthetic-strategy-comparison-lab': {
    fixtureKind: 'concentrated_holders_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'concentrated-holders-paper-execution-quality-metrics',
  },
  'suspicious-creator-synthetic-strategy-comparison-lab': {
    fixtureKind: 'suspicious_creator_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'suspicious-creator-paper-execution-quality-metrics',
  },
  'possible-bundle-cluster-synthetic-strategy-comparison-lab': {
    fixtureKind: 'possible_bundle_cluster_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'possible-bundle-cluster-paper-execution-quality-metrics',
  },
  'metadata-incomplete-synthetic-strategy-comparison-lab': {
    fixtureKind: 'metadata_incomplete_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'metadata-incomplete-paper-execution-quality-metrics',
  },
  'high-early-volume-synthetic-strategy-comparison-lab': {
    fixtureKind: 'high_early_volume_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'high-early-volume-paper-execution-quality-metrics',
  },
  'safety-rejected-synthetic-strategy-comparison-lab': {
    fixtureKind: 'safety_rejected_synthetic_strategy_comparison_lab',
    sourceMetricFixtureName: 'safety-rejected-paper-execution-quality-metrics',
  },
} as const;

function getSourceMetricFixture(name: PaperExecutionQualityMetricFixture['fixtureName']): PaperExecutionQualityMetricFixture {
  const fixture = PAPER_EXECUTION_QUALITY_METRIC_FIXTURES.find(candidate => candidate.fixtureName === name);
  if (!fixture) throw new Error(`Phase 62 source Phase 61 fixture not found: ${name}`);
  return fixture;
}

export function buildSyntheticStrategyComparisonLabFixture(
  input: BuildSyntheticStrategyComparisonLabFixtureInput,
): SyntheticStrategyComparisonLabFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const sourceMetricFixture = getSourceMetricFixture(scenario.sourceMetricFixtureName);

  const fixtureId = `phase62-fixture-${input.fixtureName}`;
  const deterministicSeed = stableDeterministicSyntheticStrategyComparisonLabChecksum(
    `phase62-${input.fixtureName}-seed`,
  );

  const strategyVariants = buildSyntheticStrategyVariants();
  const scenarioMatrix = buildSyntheticStrategyScenarioMatrix({
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    sourceMetricFixture,
    variants: strategyVariants,
  });

  const scorecards = strategyVariants.map(variant =>
    buildSyntheticStrategyComparisonScorecard({
      fixtureId,
      variantId: variant.variantId,
      scenario: scenarioMatrix.scenarioCases[0]!,
      sourceMetricFixtureName: sourceMetricFixture.fixtureName,
      sourceRiskBand: sourceMetricFixture.sourceRiskBand,
      sourceQualityBand: sourceMetricFixture.scorecard.aggregateQualityBand,
    }),
  );

  const runResult = buildSyntheticStrategyComparisonRun({
    fixtureId,
    variants: strategyVariants,
    scenarioMatrix,
    scorecards,
  });

  const aggregateSummary = buildSyntheticStrategyComparisonAggregate({
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    scorecards: runResult.rankedScorecards,
    rows: runResult.run.comparisonRows,
  });

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE,
    schemaVersion: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION,
    sourceMetricFixtureName: sourceMetricFixture.fixtureName,
    sourceSimulationFixtureName: sourceMetricFixture.sourceSimulationFixtureName,
    sourceEvidenceFixtureName: sourceMetricFixture.sourceEvidenceFixtureName,
    sourceRiskFixtureName: sourceMetricFixture.sourceRiskFixtureName,
    sourceReplayFixtureName: sourceMetricFixture.sourceReplayFixtureName,
    sourceLifecycleFixtureName: sourceMetricFixture.sourceLifecycleFixtureName,
    comparisonIdentity: {
      labId: `phase62-lab-${input.fixtureName}`,
      labName: input.fixtureName,
      labKind: scenario.fixtureKind,
      sourceMetricFixtureName: sourceMetricFixture.fixtureName,
      sourceSimulationFixtureName: sourceMetricFixture.sourceSimulationFixtureName,
      sourceEvidenceFixtureName: sourceMetricFixture.sourceEvidenceFixtureName,
      sourceRiskFixtureName: sourceMetricFixture.sourceRiskFixtureName,
      sourceReplayFixtureName: sourceMetricFixture.sourceReplayFixtureName,
      sourceLifecycleFixtureName: sourceMetricFixture.sourceLifecycleFixtureName,
      schemaVersion: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SCHEMA_VERSION,
      deterministicSeed,
      generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
    },
    strategyVariants,
    scenarioMatrix,
    comparisonRun: runResult.run,
    scorecards: runResult.rankedScorecards,
    aggregateSummary,
    viewModel: undefined as unknown as SyntheticStrategyComparisonLabFixture['viewModel'],
    apiContracts: undefined as unknown as SyntheticStrategyComparisonLabFixture['apiContracts'],
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: scenario.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only' as const,
      },
    ],
    capabilityFlags: getSyntheticStrategyComparisonLabCapabilities(),
    meta: {
      generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
      source: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
      version: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_VERSION,
      phase: SYNTHETIC_STRATEGY_COMPARISON_LAB_PHASE,
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

  const viewModel = buildSyntheticStrategyComparisonLabViewModel(
    partialFixture as unknown as SyntheticStrategyComparisonLabFixture,
  );
  const fixture = { ...partialFixture, viewModel } as SyntheticStrategyComparisonLabFixture;
  return { ...fixture, apiContracts: buildSyntheticStrategyComparisonLabApiContract(fixture) };
}
