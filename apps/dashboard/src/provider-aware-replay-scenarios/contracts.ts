import type {
  ProviderAwareReplayScenarioApiContract,
  ProviderAwareReplayScenarioFixture,
  ProviderAwareReplayScenarioViewModel,
} from './types.js';

export function buildProviderAwareReplayApiContract(input: {
  fixtureId: string;
  viewModel: ProviderAwareReplayScenarioViewModel;
  fixtureIds: readonly string[];
}): ProviderAwareReplayScenarioApiContract {
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
        parityStatus: input.viewModel.parityStatus,
        mismatchCount: input.viewModel.mismatchCount,
        failClosed: input.viewModel.failClosed,
      },
    },
    errors: [
      {
        contractId: `${input.fixtureId}-contract-error-400`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'PROVIDER_AWARE_REPLAY_INVALID_REQUEST',
        message: 'Invalid provider-aware replay scenario fixture request.',
      },
      {
        contractId: `${input.fixtureId}-contract-error-404`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'PROVIDER_AWARE_REPLAY_NOT_FOUND',
        message: 'Provider-aware replay scenario fixture not found.',
      },
    ],
  };
}

export function selectProviderAwareReplayScenarioApiSummary(
  fixture: Pick<ProviderAwareReplayScenarioFixture, 'apiContract'>,
): ProviderAwareReplayScenarioApiContract['summary'] {
  return fixture.apiContract.summary;
}
