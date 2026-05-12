import type {
  SyntheticStrategyComparisonLabFixture,
  SyntheticStrategyComparisonLabViewModel,
} from './types.js';

export function buildSyntheticStrategyComparisonLabViewModel(
  fixture: SyntheticStrategyComparisonLabFixture,
): SyntheticStrategyComparisonLabViewModel {
  const topScore = fixture.scorecards.reduce(
    (max, scorecard) => Math.max(max, scorecard.aggregateFixtureScore),
    0,
  );

  return {
    viewModelId: `${fixture.fixtureId}-view-model`,
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    scenarioCount: fixture.scenarioMatrix.scenarioCases.length,
    variantCount: fixture.strategyVariants.length,
    topFixtureScore: topScore,
    highestFixtureScoreLabel: 'highest fixture score under this synthetic fixture set',
    sensitivityWarningCount: fixture.scorecards.reduce(
      (sum, scorecard) => sum + scorecard.sensitivityWarnings.length,
      0,
    ),
    nonAdvisorySummary:
      'Synthetic strategy-comparison view for fixture-derived analysis only; non-actionable and requires review.',
  };
}
