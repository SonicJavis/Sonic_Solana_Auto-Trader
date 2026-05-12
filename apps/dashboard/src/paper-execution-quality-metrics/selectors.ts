/**
 * Phase 61 — Paper Execution Quality Metrics v1: selectors.
 */

import {
  PAPER_EXECUTION_QUALITY_METRIC_FIXTURE_MAP,
  PAPER_EXECUTION_QUALITY_METRIC_FIXTURES,
} from './fixtures.js';
import type {
  PaperExecutionQualityMetricFixture,
  PaperExecutionQualityMetricSelectorQuery,
  PaperExecutionQualityMetricSelectorResult,
  PaperExecutionQualityMetricsApiSummaryContract,
  PaperExecutionQualityScorecard,
  PaperExecutionQualityAggregateSummary,
  PaperExecutionQualityMetricsViewModel,
} from './types.js';

export function selectPaperExecutionQualityMetricFixture(
  query: PaperExecutionQualityMetricSelectorQuery = {},
): PaperExecutionQualityMetricSelectorResult {
  const fromId = query.fixtureId
    ? PAPER_EXECUTION_QUALITY_METRIC_FIXTURE_MAP.get(query.fixtureId) ?? null
    : null;

  const fixture =
    fromId ??
    PAPER_EXECUTION_QUALITY_METRIC_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) return false;
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) return false;
      if (
        query.sourceSimulationFixtureName &&
        candidate.sourceSimulationFixtureName !== query.sourceSimulationFixtureName
      ) {
        return false;
      }
      return true;
    }) ??
    PAPER_EXECUTION_QUALITY_METRIC_FIXTURES[0];

  return {
    selectorId: `phase61-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase61-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'clean_launch_paper_execution_quality_metrics',
    matched:
      fixture !== undefined &&
      (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
      (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
      (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind),
    source: 'synthetic_fixture_only',
  };
}

export function selectPaperExecutionQualityScorecard(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityScorecard {
  return fixture.scorecard;
}

export function selectPaperExecutionQualityAggregateSummary(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityAggregateSummary {
  return fixture.aggregateSummary;
}

export function selectPaperExecutionQualityMetricsViewModel(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsViewModel {
  return fixture.viewModel;
}

export function selectPaperExecutionQualityMetricsApiSummary(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsApiSummaryContract {
  return fixture.apiContracts.summary;
}
