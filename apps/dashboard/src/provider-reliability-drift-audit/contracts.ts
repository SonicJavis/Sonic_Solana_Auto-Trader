import type { ProviderReliabilityApiContract, ProviderReliabilityViewModel } from './types.js';

export function buildProviderReliabilityApiContract(input: {
  fixtureId: string;
  providerId: string;
  viewModel: ProviderReliabilityViewModel;
  fixtureIds: readonly string[];
}): ProviderReliabilityApiContract {
  return {
    list: {
      contractId: `${input.fixtureId}-contract-list`,
      contractKind: 'list',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: { fixtureIds: [...input.fixtureIds], totalCount: input.fixtureIds.length },
    },
    detail: {
      contractId: `${input.fixtureId}-contract-detail`,
      contractKind: 'detail',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: input.viewModel,
    },
    summary: {
      contractId: `${input.fixtureId}-contract-summary`,
      contractKind: 'summary',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: {
        fixtureId: input.fixtureId,
        providerId: input.providerId,
        scoreBand: input.viewModel.scoreBand,
        driftSeverity: input.viewModel.driftSeverity,
        stale: input.viewModel.stale,
      },
    },
    errors: [
      {
        contractId: `${input.fixtureId}-contract-error-400`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'PROVIDER_RELIABILITY_DRIFT_AUDIT_INVALID_REQUEST',
        message: 'Invalid provider reliability drift audit fixture request.',
      },
      {
        contractId: `${input.fixtureId}-contract-error-404`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'PROVIDER_RELIABILITY_DRIFT_AUDIT_NOT_FOUND',
        message: 'Provider reliability drift audit fixture not found.',
      },
    ],
  };
}
