/**
 * Phase 59 — Risk Explanation and Evidence Models v1: API contract fixtures.
 */

import {
  PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
  type RiskExplanationEvidenceApiContracts,
  type RiskExplanationEvidenceApiDetailContract,
  type RiskExplanationEvidenceApiErrorContract,
  type RiskExplanationEvidenceApiListContract,
  type RiskExplanationEvidenceApiSummaryContract,
  type RiskExplanationEvidenceFixture,
} from './types.js';

function buildListContract(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceApiListContract {
  return {
    contractId: `phase59-contract-list-${fixture.fixtureId}`,
    contractName: `risk-explanation-evidence-list-${fixture.fixtureName}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
    source: PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
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
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceApiDetailContract {
  return {
    contractId: `phase59-contract-detail-${fixture.fixtureId}`,
    contractName: `risk-explanation-evidence-detail-${fixture.fixtureName}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
    source: PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceApiSummaryContract {
  return {
    contractId: `phase59-contract-summary-${fixture.fixtureId}`,
    contractName: `risk-explanation-evidence-summary-${fixture.fixtureName}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
    source: PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      explanationKind: fixture.fixtureKind,
      sourceRiskFixtureName: fixture.sourceRiskFixtureName,
      riskBand: fixture.viewModel.riskBand,
    },
  };
}

function buildErrorContracts(
  fixture: RiskExplanationEvidenceFixture,
): [RiskExplanationEvidenceApiErrorContract, RiskExplanationEvidenceApiErrorContract] {
  return [
    {
      contractId: `phase59-contract-error-invalid-${fixture.fixtureId}`,
      contractName: `risk-explanation-evidence-error-invalid-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
      source: PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'RISK_EXPLANATION_EVIDENCE_INVALID_REQUEST',
      message: 'Fixture-only: invalid risk explanation evidence query.',
    },
    {
      contractId: `phase59-contract-error-notfound-${fixture.fixtureId}`,
      contractName: `risk-explanation-evidence-error-notfound-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 404,
      generatedAt: PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
      source: PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'RISK_EXPLANATION_EVIDENCE_NOT_FOUND',
      message: 'Fixture-only: requested risk explanation evidence fixture not found.',
    },
  ];
}

export function buildRiskExplanationEvidenceApiContract(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
