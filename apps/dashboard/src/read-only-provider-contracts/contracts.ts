/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: API contract fixtures.
 */

import {
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
  type ReadOnlyProviderApiContracts,
  type ReadOnlyProviderApiDetailContract,
  type ReadOnlyProviderApiErrorContract,
  type ReadOnlyProviderApiListContract,
  type ReadOnlyProviderApiSummaryContract,
  type ReadOnlyProviderContractFixture,
} from './types.js';

function buildListContract(
  fixture: ReadOnlyProviderContractFixture,
): ReadOnlyProviderApiListContract {
  return {
    contractId: `phase54-contract-list-${fixture.fixtureId}`,
    contractName: `read-only-provider-list-${fixture.fixtureName}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
    source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
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
  fixture: ReadOnlyProviderContractFixture,
): ReadOnlyProviderApiDetailContract {
  return {
    contractId: `phase54-contract-detail-${fixture.fixtureId}`,
    contractName: `read-only-provider-detail-${fixture.fixtureName}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
    source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: ReadOnlyProviderContractFixture,
): ReadOnlyProviderApiSummaryContract {
  return {
    contractId: `phase54-contract-summary-${fixture.fixtureId}`,
    contractName: `read-only-provider-summary-${fixture.fixtureName}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
    source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      providerKind: fixture.fixtureKind,
      healthStatus: fixture.providerHealthContract.deterministicStatus,
      disabledByDefault: fixture.providerIdentity.disabledByDefault,
    },
  };
}

function buildErrorContracts(
  fixture: ReadOnlyProviderContractFixture,
): [ReadOnlyProviderApiErrorContract, ReadOnlyProviderApiErrorContract] {
  return [
    {
      contractId: `phase54-contract-error-disabled-${fixture.fixtureId}`,
      contractName: `read-only-provider-error-disabled-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 503,
      generatedAt: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
      source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'PROVIDER_DISABLED',
      message: 'Provider is disabled by default; no live adapter is active.',
    },
    {
      contractId: `phase54-contract-error-unsafe-${fixture.fixtureId}`,
      contractName: `read-only-provider-error-unsafe-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
      source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'UNSAFE_CAPABILITY_REQUESTED',
      message: 'Unsafe capability requested from fixture-only contract gate.',
    },
  ];
}

export function buildReadOnlyProviderApiContract(
  fixture: ReadOnlyProviderContractFixture,
): ReadOnlyProviderApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
