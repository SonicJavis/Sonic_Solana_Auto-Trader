import {
  SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURE_MAP,
  SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES,
} from './fixtures.js';
import type {
  SyntheticStrategyComparisonAggregate,
  SyntheticStrategyComparisonLabFixture,
  SyntheticStrategyComparisonLabSelectorQuery,
  SyntheticStrategyComparisonLabSelectorResult,
  SyntheticStrategyComparisonLabViewModel,
} from './types.js';

export function selectSyntheticStrategyComparisonLabFixture(
  query: SyntheticStrategyComparisonLabSelectorQuery = {},
): SyntheticStrategyComparisonLabSelectorResult {
  const fromId = query.fixtureId
    ? SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURE_MAP.get(query.fixtureId) ?? null
    : null;

  const fixture =
    fromId ??
    SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (
        query.sourceMetricFixtureName &&
        candidate.sourceMetricFixtureName !== query.sourceMetricFixtureName
      ) {
        return false;
      }
      return true;
    }) ??
    SYNTHETIC_STRATEGY_COMPARISON_LAB_FIXTURES[0];

  return {
    selectorId: `${fixture?.fixtureId ?? 'none'}-selector`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase62-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'clean_launch_synthetic_strategy_comparison_lab',
    matched:
      fixture !== undefined &&
      (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
      (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
      (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind),
    source: 'synthetic_fixture_only',
  };
}

export function selectSyntheticStrategyComparisonLabViewModel(
  fixture: SyntheticStrategyComparisonLabFixture,
): SyntheticStrategyComparisonLabViewModel {
  return fixture.viewModel;
}

export function selectSyntheticStrategyComparisonLabAggregate(
  fixture: SyntheticStrategyComparisonLabFixture,
): SyntheticStrategyComparisonAggregate {
  return fixture.aggregateSummary;
}

export function selectSyntheticStrategyComparisonLabApiSummary(
  fixture: SyntheticStrategyComparisonLabFixture,
) {
  return fixture.apiContracts.summary;
}
