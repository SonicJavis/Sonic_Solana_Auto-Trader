import type { LiveSmokeSafetyApiContract, LiveSmokeSafetyViewModel } from './types.js';

export function buildLiveSmokeSafetyApiContract(input: {
  fixtureId: string;
  viewModel: LiveSmokeSafetyViewModel;
  fixtureIds: readonly string[];
}): LiveSmokeSafetyApiContract {
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
        smokeStatus: input.viewModel.smokeStatus,
        gateStatus: input.viewModel.gateStatus,
        certificationStatus: input.viewModel.certificationStatus,
      },
    },
    errors: [
      {
        contractId: `${input.fixtureId}-contract-error-400`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'LIVE_SMOKE_SAFETY_INVALID_REQUEST',
        message: 'Invalid live-smoke safety certification request.',
      },
      {
        contractId: `${input.fixtureId}-contract-error-404`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'LIVE_SMOKE_SAFETY_NOT_FOUND',
        message: 'Live-smoke safety certification fixture not found.',
      },
    ],
  };
}
