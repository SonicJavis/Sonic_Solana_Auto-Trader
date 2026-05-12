import type { PaperExecutionQualityMetricFixture } from '../paper-execution-quality-metrics/types.js';
import type {
  SyntheticStrategyScenarioCase,
  SyntheticStrategyScenarioMatrix,
  SyntheticStrategyVariant,
  SyntheticStrategyVariantId,
} from './types.js';

function buildVariantInputSnapshots(
  sharedInputs: SyntheticStrategyScenarioCase['sharedInputs'],
  variants: readonly SyntheticStrategyVariant[],
): Readonly<Record<SyntheticStrategyVariantId, SyntheticStrategyScenarioCase['sharedInputs']>> {
  return variants.reduce<Record<SyntheticStrategyVariantId, SyntheticStrategyScenarioCase['sharedInputs']>>(
    (acc, variant) => {
      acc[variant.variantId] = { ...sharedInputs };
      return acc;
    },
    {} as Record<SyntheticStrategyVariantId, SyntheticStrategyScenarioCase['sharedInputs']>,
  );
}

export function buildSyntheticStrategyScenarioMatrix(input: {
  readonly fixtureId: string;
  readonly fixtureName: string;
  readonly fixtureKind: SyntheticStrategyScenarioCase['scenarioKind'];
  readonly sourceMetricFixture: PaperExecutionQualityMetricFixture;
  readonly variants: readonly SyntheticStrategyVariant[];
}): SyntheticStrategyScenarioMatrix {
  const scenarioId = `${input.fixtureId}-scenario-${input.sourceMetricFixture.fixtureName}`;
  const sharedInputs = {
    sourceRiskBand: input.sourceMetricFixture.sourceRiskBand,
    sourceQualityBand: input.sourceMetricFixture.scorecard.aggregateQualityBand,
    latencyQualityLabel: input.sourceMetricFixture.latencyMetrics.latencyQualityLabel,
    fillStatus: input.sourceMetricFixture.fillQualityMetrics.hypotheticalFillStatus,
    slippageBucket: input.sourceMetricFixture.slippageMetrics.simulatedSlippageBucket,
    rejectionTaxonomyKind: input.sourceMetricFixture.rejectionMetrics.rejectionTaxonomyKind,
  };

  return {
    matrixId: `${input.fixtureId}-scenario-matrix`,
    matrixName: `${input.fixtureName}-scenario-matrix`,
    matrixKind: 'synthetic_strategy_scenario_matrix',
    scenarioCases: [
      {
        scenarioId,
        scenarioKind: input.fixtureKind,
        sourceMetricFixtureName: input.sourceMetricFixture.fixtureName,
        sourceSimulationFixtureName: input.sourceMetricFixture.sourceSimulationFixtureName,
        sourceEvidenceFixtureName: input.sourceMetricFixture.sourceEvidenceFixtureName,
        sourceRiskFixtureName: input.sourceMetricFixture.sourceRiskFixtureName,
        sourceReplayFixtureName: input.sourceMetricFixture.sourceReplayFixtureName,
        sourceLifecycleFixtureName: input.sourceMetricFixture.sourceLifecycleFixtureName,
        sharedInputs,
        variantInputSnapshots: buildVariantInputSnapshots(sharedInputs, input.variants),
      },
    ],
  };
}
