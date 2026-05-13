import type {
  HistoricalSnapshotScenarioGeneratorApiContract,
  HistoricalSnapshotScenarioGeneratorViewModel,
} from './types.js';

export function buildSnapshotScenarioApiContract(input: {
  fixtureId: string;
  viewModel: HistoricalSnapshotScenarioGeneratorViewModel;
  fixtureIds: readonly string[];
}): HistoricalSnapshotScenarioGeneratorApiContract {
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
        scenarioId: input.viewModel.scenarioId,
        blocked: input.viewModel.blocked,
        quarantined: input.viewModel.quarantined,
        replayReady: input.viewModel.replayReady,
      },
    },
    errors: [
      {
        contractId: `${input.fixtureId}-contract-error-400`,
        contractKind: 'error',
        statusCode: 400,
        errorCode: 'HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_INVALID_REQUEST',
        message: 'Invalid historical snapshot scenario generator fixture request.',
      },
      {
        contractId: `${input.fixtureId}-contract-error-404`,
        contractKind: 'error',
        statusCode: 404,
        errorCode: 'HISTORICAL_SNAPSHOT_SCENARIO_GENERATOR_NOT_FOUND',
        message: 'Historical snapshot scenario generator fixture not found.',
      },
    ],
  };
}
