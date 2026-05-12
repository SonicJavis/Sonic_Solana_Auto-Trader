/**
 * Phase 61 — Paper Execution Quality Metrics v1: fixtures.
 */

import { aggregatePaperExecutionQualityMetrics } from './aggregators.js';
import { buildPaperExecutionQualityMetricFixture } from './builders.js';
import {
  PAPER_EXECUTION_QUALITY_METRIC_KINDS,
  PAPER_EXECUTION_QUALITY_METRIC_NAMES,
  type PaperExecutionQualityMetricFixture,
  type PaperExecutionQualityMetricKind,
  type PaperExecutionQualityMetricName,
} from './types.js';

const BASE_FIXTURES = PAPER_EXECUTION_QUALITY_METRIC_NAMES.map(fixtureName =>
  buildPaperExecutionQualityMetricFixture({ fixtureName }),
);

const AGGREGATE_SUMMARY = aggregatePaperExecutionQualityMetrics(BASE_FIXTURES);

export const PAPER_EXECUTION_QUALITY_METRIC_FIXTURES = BASE_FIXTURES.map(fixture => ({
  ...fixture,
  aggregateSummary: AGGREGATE_SUMMARY,
})) satisfies readonly PaperExecutionQualityMetricFixture[];

export const PAPER_EXECUTION_QUALITY_METRIC_FIXTURE_MAP: ReadonlyMap<
  string,
  PaperExecutionQualityMetricFixture
> = new Map(PAPER_EXECUTION_QUALITY_METRIC_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (PAPER_EXECUTION_QUALITY_METRIC_FIXTURES.length < 8) {
  throw new Error(
    `Phase 61 fixture count mismatch: expected >= 8, received ${PAPER_EXECUTION_QUALITY_METRIC_FIXTURES.length}`,
  );
}

if (PAPER_EXECUTION_QUALITY_METRIC_NAMES.length !== PAPER_EXECUTION_QUALITY_METRIC_KINDS.length) {
  throw new Error('Phase 61 metric name/kind cardinality mismatch');
}

export function listPaperExecutionQualityMetricFixtures(): readonly PaperExecutionQualityMetricFixture[] {
  return PAPER_EXECUTION_QUALITY_METRIC_FIXTURES;
}

export function getPaperExecutionQualityMetricFixture(
  fixtureId: string,
): PaperExecutionQualityMetricFixture | null {
  return PAPER_EXECUTION_QUALITY_METRIC_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { PAPER_EXECUTION_QUALITY_METRIC_NAMES, PAPER_EXECUTION_QUALITY_METRIC_KINDS };

export type { PaperExecutionQualityMetricName, PaperExecutionQualityMetricKind };
