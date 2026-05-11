/**
 * Phase 61 — Paper Execution Quality Metrics v1: API contract fixtures.
 */

import type {
  PaperExecutionQualityMetricFixture,
  PaperExecutionQualityMetricsApiContracts,
  PaperExecutionQualityMetricsApiDetailContract,
  PaperExecutionQualityMetricsApiErrorContract,
  PaperExecutionQualityMetricsApiListContract,
  PaperExecutionQualityMetricsApiSummaryContract,
} from './types.js';
import {
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
  PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
} from './types.js';

function buildListContract(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsApiListContract {
  return {
    contractId: `phase61-contract-list-${fixture.fixtureId}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
    source: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureIds: [fixture.fixtureId],
      totalCount: 1,
    },
  };
}

function buildDetailContract(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsApiDetailContract {
  return {
    contractId: `phase61-contract-detail-${fixture.fixtureId}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
    source: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsApiSummaryContract {
  return {
    contractId: `phase61-contract-summary-${fixture.fixtureId}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
    source: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      aggregateQualityBand: fixture.scorecard.aggregateQualityBand,
      sourceSimulationFixtureName: fixture.sourceSimulationFixtureName,
    },
  };
}

function buildErrorContracts(
  fixture: PaperExecutionQualityMetricFixture,
): [PaperExecutionQualityMetricsApiErrorContract, PaperExecutionQualityMetricsApiErrorContract] {
  return [
    {
      contractId: `phase61-contract-error-invalid-${fixture.fixtureId}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
      source: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'PAPER_EXECUTION_QUALITY_METRICS_INVALID_REQUEST',
      message: 'Fixture-only: invalid paper execution quality metrics query.',
    },
    {
      contractId: `phase61-contract-error-notfound-${fixture.fixtureId}`,
      contractKind: 'error',
      statusCode: 404,
      generatedAt: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_GENERATED_AT,
      source: PHASE_61_PAPER_EXECUTION_QUALITY_METRICS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'PAPER_EXECUTION_QUALITY_METRICS_NOT_FOUND',
      message: 'Fixture-only: requested paper execution quality metrics fixture not found.',
    },
  ];
}

export function buildPaperExecutionQualityMetricsApiContract(
  fixture: PaperExecutionQualityMetricFixture,
): PaperExecutionQualityMetricsApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
