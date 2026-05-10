/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: API contract fixtures.
 */

import {
  PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
  PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
  type SyntheticLaunchApiErrorContract,
  type SyntheticLaunchApiListContract,
  type SyntheticLaunchApiSummaryContract,
  type SyntheticLaunchApiDetailContract,
  type SyntheticLaunchIntelligenceApiContracts,
  type SyntheticLaunchIntelligenceFixture,
} from './types.js';

function buildListContract(fixture: SyntheticLaunchIntelligenceFixture): SyntheticLaunchApiListContract {
  return {
    contractId: `phase53-contract-list-${fixture.fixtureId}`,
    contractName: `synthetic-launch-list-${fixture.fixtureName}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
    source: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureIds: [fixture.fixtureId],
      totalCount: 1,
    },
  };
}

function buildDetailContract(fixture: SyntheticLaunchIntelligenceFixture): SyntheticLaunchApiDetailContract {
  return {
    contractId: `phase53-contract-detail-${fixture.fixtureId}`,
    contractName: `synthetic-launch-detail-${fixture.fixtureName}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
    source: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(fixture: SyntheticLaunchIntelligenceFixture): SyntheticLaunchApiSummaryContract {
  return {
    contractId: `phase53-contract-summary-${fixture.fixtureId}`,
    contractName: `synthetic-launch-summary-${fixture.fixtureName}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
    source: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      scenarioKind: fixture.fixtureKind,
      overallRiskSeverity: fixture.viewModel.overallRiskSeverity,
      rejection: fixture.riskReview.reviewStatus === 'rejected_for_fixture_display',
    },
  };
}

function buildErrorContracts(fixture: SyntheticLaunchIntelligenceFixture): [SyntheticLaunchApiErrorContract, SyntheticLaunchApiErrorContract] {
  return [
    {
      contractId: `phase53-contract-error-invalid-${fixture.fixtureId}`,
      contractName: `synthetic-launch-error-invalid-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
      source: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'SYNTHETIC_LAUNCH_INVALID_REQUEST',
      message: 'Invalid synthetic launch fixture request.',
    },
    {
      contractId: `phase53-contract-error-not-found-${fixture.fixtureId}`,
      contractName: `synthetic-launch-error-not-found-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 404,
      generatedAt: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_GENERATED_AT,
      source: PHASE_53_SYNTHETIC_LAUNCH_INTELLIGENCE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'SYNTHETIC_LAUNCH_NOT_FOUND',
      message: 'Synthetic launch fixture was not found.',
    },
  ];
}

export function buildSyntheticLaunchIntelligenceApiContract(
  fixture: SyntheticLaunchIntelligenceFixture,
): SyntheticLaunchIntelligenceApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
