import type {
  FirstReadOnlyProviderAdapterApiContracts,
  FirstReadOnlyProviderAdapterFixture,
} from './types.js';

export function buildFirstReadOnlyProviderAdapterApiContract(
  fixture: FirstReadOnlyProviderAdapterFixture,
): FirstReadOnlyProviderAdapterApiContracts {
  return {
    list: {
      contractId: `${fixture.fixtureId}-contract-list`,
      contractKind: 'list',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: {
        fixtureIds: [fixture.fixtureId],
        totalCount: 1,
      },
    },
    detail: {
      contractId: `${fixture.fixtureId}-contract-detail`,
      contractKind: 'detail',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: fixture.viewModel,
    },
    summary: {
      contractId: `${fixture.fixtureId}-contract-summary`,
      contractKind: 'summary',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: {
        fixtureId: fixture.fixtureId,
        configState: fixture.providerConfig.mode,
        healthState: fixture.health.healthState,
      },
    },
    errors: [
      {
        contractId: `${fixture.fixtureId}-contract-error-invalid`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'FIRST_READ_ONLY_PROVIDER_ADAPTER_INVALID_REQUEST',
        message: 'Invalid first read-only provider adapter fixture query.',
      },
      {
        contractId: `${fixture.fixtureId}-contract-error-not-found`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'FIRST_READ_ONLY_PROVIDER_ADAPTER_NOT_FOUND',
        message: 'Requested first read-only provider adapter fixture was not found.',
      },
    ],
  };
}
