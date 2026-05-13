import type { SmokeApiContract } from './types.js';
import type { SmokeReadinessViewModel } from './types.js';

export function buildSmokeApiContract(input: {
  fixtureId: string;
  viewModel: SmokeReadinessViewModel;
  fixtureIds: readonly string[];
}): SmokeApiContract {
  return {
    list: {
      contractId: `${input.fixtureId}-list-contract`,
      contractKind: 'list',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: { fixtureIds: [...input.fixtureIds], totalCount: input.fixtureIds.length },
    },
    get: {
      contractId: `${input.fixtureId}-get-contract`,
      contractKind: 'get',
      statusCode: 200,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: { fixtureId: input.fixtureId },
    },
  };
}
