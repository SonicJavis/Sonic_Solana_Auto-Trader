/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: API contract fixtures.
 */

import {
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
  type ReadOnlyProviderAdapterMockApiContracts,
  type ReadOnlyProviderAdapterMockApiDetailContract,
  type ReadOnlyProviderAdapterMockApiErrorContract,
  type ReadOnlyProviderAdapterMockApiListContract,
  type ReadOnlyProviderAdapterMockApiSummaryContract,
  type ReadOnlyProviderAdapterMockFixture,
} from './types.js';

function buildListContract(
  fixture: ReadOnlyProviderAdapterMockFixture,
): ReadOnlyProviderAdapterMockApiListContract {
  return {
    contractId: `phase55-contract-list-${fixture.fixtureId}`,
    contractName: `read-only-provider-adapter-mock-list-${fixture.fixtureName}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
    source: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
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
  fixture: ReadOnlyProviderAdapterMockFixture,
): ReadOnlyProviderAdapterMockApiDetailContract {
  return {
    contractId: `phase55-contract-detail-${fixture.fixtureId}`,
    contractName: `read-only-provider-adapter-mock-detail-${fixture.fixtureName}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
    source: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: ReadOnlyProviderAdapterMockFixture,
): ReadOnlyProviderAdapterMockApiSummaryContract {
  return {
    contractId: `phase55-contract-summary-${fixture.fixtureId}`,
    contractName: `read-only-provider-adapter-mock-summary-${fixture.fixtureName}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
    source: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      adapterKind: fixture.fixtureKind,
      domain: fixture.adapterIdentity.adapterDomain,
      sourceProviderContractName: fixture.sourceProviderContractName,
      healthLabel: fixture.adapterHealthProfile.healthLabel,
    },
  };
}

function buildErrorContracts(
  fixture: ReadOnlyProviderAdapterMockFixture,
): [ReadOnlyProviderAdapterMockApiErrorContract, ReadOnlyProviderAdapterMockApiErrorContract] {
  return [
    {
      contractId: `phase55-contract-error-disabled-${fixture.fixtureId}`,
      contractName: `read-only-provider-adapter-mock-error-disabled-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 503,
      generatedAt: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
      source: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'PROVIDER_DISABLED',
      message: 'Provider adapter mock is disabled for live access and returns fixture-only responses.',
    },
    {
      contractId: `phase55-contract-error-unsafe-${fixture.fixtureId}`,
      contractName: `read-only-provider-adapter-mock-error-unsafe-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
      source: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'UNSAFE_CAPABILITY_REQUESTED',
      message: 'Unsafe capability requested from read-only mock adapter.',
    },
  ];
}

export function buildReadOnlyProviderAdapterMockApiContract(
  fixture: ReadOnlyProviderAdapterMockFixture,
): ReadOnlyProviderAdapterMockApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
