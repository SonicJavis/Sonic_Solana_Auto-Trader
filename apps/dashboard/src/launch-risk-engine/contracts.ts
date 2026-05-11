/**
 * Phase 58 — Launch Risk Engine v1: API contract fixtures.
 *
 * Fixture-only contract shapes. No endpoints/handlers/routes.
 * Non-advisory, synthetic, local-only.
 */

import {
  PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
  PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
  type LaunchRiskEngineApiContracts,
  type LaunchRiskEngineApiDetailContract,
  type LaunchRiskEngineApiErrorContract,
  type LaunchRiskEngineApiListContract,
  type LaunchRiskEngineApiSummaryContract,
  type LaunchRiskEngineFixture,
} from './types.js';

function buildListContract(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineApiListContract {
  return {
    contractId: `phase58-contract-list-${fixture.fixtureId}`,
    contractName: `launch-risk-engine-list-${fixture.fixtureName}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
    source: PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
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
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineApiDetailContract {
  return {
    contractId: `phase58-contract-detail-${fixture.fixtureId}`,
    contractName: `launch-risk-engine-detail-${fixture.fixtureName}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
    source: PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineApiSummaryContract {
  return {
    contractId: `phase58-contract-summary-${fixture.fixtureId}`,
    contractName: `launch-risk-engine-summary-${fixture.fixtureName}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
    source: PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      riskBand: fixture.assessment.riskBand,
      totalRiskScore: fixture.assessment.totalRiskScore,
      assessmentStatus: fixture.assessment.assessmentStatus,
      sourceLifecycleFixtureName: fixture.sourceLifecycleFixtureName,
      sourceReplayFixtureName: fixture.sourceReplayFixtureName,
    },
  };
}

function buildErrorContracts(
  fixture: LaunchRiskEngineFixture,
): [LaunchRiskEngineApiErrorContract, LaunchRiskEngineApiErrorContract] {
  return [
    {
      contractId: `phase58-contract-error-invalid-${fixture.fixtureId}`,
      contractName: `launch-risk-engine-error-invalid-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
      source: PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'LAUNCH_RISK_ENGINE_INVALID_REQUEST',
      message: 'Fixture-only: invalid request shape for launch risk engine query.',
    },
    {
      contractId: `phase58-contract-error-notfound-${fixture.fixtureId}`,
      contractName: `launch-risk-engine-error-notfound-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 404,
      generatedAt: PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
      source: PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'LAUNCH_RISK_ENGINE_NOT_FOUND',
      message: 'Fixture-only: requested launch risk fixture not found.',
    },
  ];
}

export function buildLaunchRiskEngineApiContract(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
