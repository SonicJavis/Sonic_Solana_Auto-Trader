import type {
  MultiProviderReadOnlyFoundationApiContract,
} from './types.js';

export function buildMultiProviderApiContract(
  fixture: {
    readonly fixtureId: string;
    readonly viewModel: MultiProviderReadOnlyFoundationApiContract['detail']['data'];
    readonly providerSelection: { readonly selectedProviderId: string };
    readonly staleDataChecks: readonly { readonly stale: boolean }[];
  },
): MultiProviderReadOnlyFoundationApiContract {
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
        selectedProviderId: fixture.providerSelection.selectedProviderId,
        staleProviderCount: fixture.staleDataChecks.filter(check => check.stale).length,
        failClosed: true,
      },
    },
    errors: [
      {
        contractId: `${fixture.fixtureId}-contract-error-invalid`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'MULTI_PROVIDER_READ_ONLY_FOUNDATION_INVALID_REQUEST',
        message: 'Invalid multi-provider read-only foundation fixture query.',
      },
      {
        contractId: `${fixture.fixtureId}-contract-error-not-found`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'MULTI_PROVIDER_READ_ONLY_FOUNDATION_NOT_FOUND',
        message: 'Requested multi-provider read-only foundation fixture was not found.',
      },
    ],
  };
}
