import type {
  SyntheticStrategyComparisonAggregate,
  SyntheticStrategyComparisonLabKind,
  SyntheticStrategyComparisonLabName,
  SyntheticStrategyComparisonQualityBand,
  SyntheticStrategyComparisonRow,
  SyntheticStrategyComparisonScorecard,
  SyntheticStrategySensitivityWarningKind,
  SyntheticStrategyVariantId,
} from './types.js';
import {
  SYNTHETIC_STRATEGY_COMPARISON_QUALITY_BANDS,
  SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS,
  SYNTHETIC_STRATEGY_VARIANT_IDS,
} from './types.js';

function makeCountMap<T extends string>(values: readonly T[]): Record<T, number> {
  return values.reduce<Record<T, number>>((acc, value) => {
    acc[value] = 0;
    return acc;
  }, {} as Record<T, number>);
}

export function buildSyntheticStrategyComparisonAggregate(input: {
  readonly fixtureId: string;
  readonly fixtureName: SyntheticStrategyComparisonLabName;
  readonly fixtureKind: SyntheticStrategyComparisonLabKind;
  readonly scorecards: readonly SyntheticStrategyComparisonScorecard[];
  readonly rows: readonly SyntheticStrategyComparisonRow[];
}): SyntheticStrategyComparisonAggregate {
  const countByVariant = makeCountMap(
    SYNTHETIC_STRATEGY_VARIANT_IDS,
  ) as Record<SyntheticStrategyVariantId, number>;
  const countByScenarioKind = { [input.fixtureKind]: input.rows.length } as Record<
    SyntheticStrategyComparisonLabKind,
    number
  >;
  const aggregateFixtureScoreDistribution = makeCountMap(
    SYNTHETIC_STRATEGY_COMPARISON_QUALITY_BANDS,
  ) as Record<SyntheticStrategyComparisonQualityBand, number>;
  const sensitivityWarningCounts = makeCountMap(
    SYNTHETIC_STRATEGY_SENSITIVITY_WARNING_KINDS,
  ) as Record<SyntheticStrategySensitivityWarningKind, number>;

  for (const scorecard of input.scorecards) {
    countByVariant[scorecard.variantId] += 1;
    aggregateFixtureScoreDistribution[scorecard.qualityBand] += 1;
    for (const warning of scorecard.sensitivityWarnings) {
      sensitivityWarningCounts[warning] += 1;
    }
  }

  return {
    aggregateId: `${input.fixtureId}-aggregate`,
    fixtureCount: input.scorecards.length,
    countByVariant,
    countByScenarioKind,
    aggregateFixtureScoreDistribution,
    sensitivityWarningCounts,
    nonAdvisorySummary:
      'Highest fixture score label indicates relative fixture scoring only under this synthetic fixture set; non-actionable and not live predictive.',
  };
}
