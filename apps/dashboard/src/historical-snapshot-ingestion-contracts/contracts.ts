import type {
  HistoricalSnapshotIngestionContractApiContract,
  HistoricalSnapshotIngestionContractViewModel,
} from './types.js';

export function buildHistoricalSnapshotApiContract(input: {
  fixtureId: string;
  viewModel: HistoricalSnapshotIngestionContractViewModel;
  fixtureIds: readonly string[];
}): HistoricalSnapshotIngestionContractApiContract {
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
        snapshotId: input.viewModel.snapshotId,
        stale: input.viewModel.stale,
        rejected: input.viewModel.rejected,
      },
    },
    errors: [
      {
        contractId: `${input.fixtureId}-contract-error-400`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_INVALID_REQUEST',
        message: 'Invalid historical snapshot ingestion contract fixture request.',
      },
      {
        contractId: `${input.fixtureId}-contract-error-404`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'HISTORICAL_SNAPSHOT_INGESTION_CONTRACT_NOT_FOUND',
        message: 'Historical snapshot ingestion contract fixture not found.',
      },
    ],
  };
}
