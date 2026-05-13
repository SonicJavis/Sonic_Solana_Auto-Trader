import type {
  ProviderAwareReplayImportContractViewModel,
} from './types.js';

export function buildReplayImportViewModel(input: {
  fixtureId: string;
  fixtureName: ProviderAwareReplayImportContractViewModel['fixtureName'];
  candidateId: string;
  compatibilityStatus: ProviderAwareReplayImportContractViewModel['compatibilityStatus'];
  blocked: boolean;
  warning: boolean;
}): ProviderAwareReplayImportContractViewModel {
  return {
    viewModelId: `${input.fixtureId}-view-model`,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    candidateId: input.candidateId,
    compatibilityStatus: input.compatibilityStatus,
    blocked: input.blocked,
    warning: input.warning,
    summary: `${input.fixtureName} => ${input.compatibilityStatus}`,
  };
}

export const buildHistoricalSnapshotViewModel = buildReplayImportViewModel;

export function buildReplayImportApiContract(input: {
  fixtureId: string;
  viewModel: ProviderAwareReplayImportContractViewModel;
  fixtureIds: readonly string[];
}) {
  return {
    list: {
      contractId: `${input.fixtureId}-list-contract`,
      contractKind: 'list' as const,
      statusCode: 200 as const,
      fixtureOnly: true as const,
      readOnly: true as const,
      localOnly: true as const,
      data: { fixtureIds: [...input.fixtureIds], totalCount: input.fixtureIds.length },
    },
    detail: {
      contractId: `${input.fixtureId}-detail-contract`,
      contractKind: 'detail' as const,
      statusCode: 200 as const,
      fixtureOnly: true as const,
      readOnly: true as const,
      localOnly: true as const,
      data: input.viewModel,
    },
    summary: {
      contractId: `${input.fixtureId}-summary-contract`,
      contractKind: 'summary' as const,
      statusCode: 200 as const,
      fixtureOnly: true as const,
      readOnly: true as const,
      localOnly: true as const,
      data: {
        fixtureId: input.viewModel.fixtureId,
        candidateId: input.viewModel.candidateId,
        blocked: input.viewModel.blocked,
        warning: input.viewModel.warning,
      },
    },
    errors: [
      {
        contractId: `${input.fixtureId}-error-invalid`,
        contractKind: 'error' as const,
        statusCode: 400 as const,
        errorCode: 'PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_INVALID_REQUEST' as const,
        message: 'Invalid provider-aware replay import contract request.',
      },
      {
        contractId: `${input.fixtureId}-error-not-found`,
        contractKind: 'error' as const,
        statusCode: 404 as const,
        errorCode: 'PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NOT_FOUND' as const,
        message: 'Provider-aware replay import contract fixture not found.',
      },
    ] as const,
  };
}
