import type {
  BuildSyntheticStrategyComparisonRunInput,
  SyntheticStrategyComparisonRow,
  SyntheticStrategyComparisonRun,
  SyntheticStrategyComparisonScorecard,
} from './types.js';

function withDeterministicRanks(
  scorecards: readonly SyntheticStrategyComparisonScorecard[],
): readonly SyntheticStrategyComparisonScorecard[] {
  const grouped = new Map<string, SyntheticStrategyComparisonScorecard[]>();
  for (const scorecard of scorecards) {
    const existing = grouped.get(scorecard.scenarioId) ?? [];
    existing.push(scorecard);
    grouped.set(scorecard.scenarioId, existing);
  }

  const ranked: SyntheticStrategyComparisonScorecard[] = [];
  for (const [, group] of grouped) {
    const sorted = [...group].sort((left, right) => {
      if (right.aggregateFixtureScore !== left.aggregateFixtureScore) {
        return right.aggregateFixtureScore - left.aggregateFixtureScore;
      }
      return left.variantId.localeCompare(right.variantId, 'en-US');
    });
    sorted.forEach((scorecard, index) => ranked.push({ ...scorecard, relativeRank: index + 1 }));
  }

  return ranked;
}

function buildRows(scorecards: readonly SyntheticStrategyComparisonScorecard[]): readonly SyntheticStrategyComparisonRow[] {
  return scorecards.map(scorecard => ({
    rowId: `${scorecard.scorecardId}-row`,
    variantId: scorecard.variantId,
    scenarioId: scorecard.scenarioId,
    aggregateQualityBand: scorecard.qualityBand,
    relativeFixtureScore: scorecard.aggregateFixtureScore,
    deterministicRankWithinScenario: scorecard.relativeRank,
    explanationReferences: [
      `scorecard:${scorecard.scorecardId}`,
      `scenario:${scorecard.scenarioId}`,
      `variant:${scorecard.variantId}`,
    ],
    warningReferences: scorecard.sensitivityWarnings,
    nonAdvisorySummary:
      'Relative fixture-score row for hypothetical synthetic comparison; non-actionable and requires review.',
  }));
}

export function buildSyntheticStrategyComparisonRun(
  input: BuildSyntheticStrategyComparisonRunInput,
): { readonly run: SyntheticStrategyComparisonRun; readonly rankedScorecards: readonly SyntheticStrategyComparisonScorecard[] } {
  const rankedScorecards = withDeterministicRanks(input.scorecards);
  const rows = buildRows(rankedScorecards);

  return {
    rankedScorecards,
    run: {
      runId: `${input.fixtureId}-comparison-run`,
      runName: `${input.fixtureId}-comparison-run`,
      runKind: 'synthetic_strategy_comparison_run',
      strategyVariantIds: input.variants.map(variant => variant.variantId),
      scenarioCaseIds: input.scenarioMatrix.scenarioCases.map(scenario => scenario.scenarioId),
      comparisonRows: rows,
      runSummary: {
        totalRows: rows.length,
        rankedRows: rows.filter(row => row.deterministicRankWithinScenario > 0).length,
        deterministic: true,
        nonAdvisorySummary:
          'Deterministic hypothetical comparison-run summary under fixture constraints; non-actionable.',
      },
    },
  };
}
