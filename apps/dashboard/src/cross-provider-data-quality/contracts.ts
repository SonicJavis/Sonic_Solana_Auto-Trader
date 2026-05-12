import type { CrossProviderDataQualityApiContract, CrossProviderDataQualityFixture } from './types.js';

export function buildCrossProviderDataQualityApiContract(
  fixture: Pick<CrossProviderDataQualityFixture, 'fixtureId' | 'viewModel' | 'reconciliationResult'>,
): CrossProviderDataQualityApiContract {
  return {
    list: {
      contractId: `${fixture.fixtureId}-contract-list`,
      contractKind: 'list',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: { fixtureIds: [fixture.fixtureId], totalCount: 1 },
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
        selectedProviderId: fixture.reconciliationResult.selectedProviderId,
        confidenceLabel: fixture.viewModel.confidenceLabel,
        failClosed: fixture.reconciliationResult.failClosed,
      },
    },
    errors: [
      {
        contractId: `${fixture.fixtureId}-contract-error-400`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'CROSS_PROVIDER_DATA_QUALITY_INVALID_REQUEST',
        message: 'Invalid cross-provider data-quality fixture request.',
      },
      {
        contractId: `${fixture.fixtureId}-contract-error-404`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'CROSS_PROVIDER_DATA_QUALITY_NOT_FOUND',
        message: 'Cross-provider data-quality fixture not found.',
      },
    ],
  };
}
