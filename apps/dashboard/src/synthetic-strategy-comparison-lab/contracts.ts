import type {
  SyntheticStrategyComparisonLabApiContracts,
  SyntheticStrategyComparisonLabFixture,
} from './types.js';
import {
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
  PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
} from './types.js';

export function buildSyntheticStrategyComparisonLabApiContract(
  fixture: SyntheticStrategyComparisonLabFixture,
): SyntheticStrategyComparisonLabApiContracts {
  return {
    list: {
      contractId: `${fixture.fixtureId}-contract-list`,
      contractKind: 'list',
      statusCode: 200,
      generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
      source: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: { fixtureIds: [fixture.fixtureId], totalCount: 1 },
    },
    detail: {
      contractId: `${fixture.fixtureId}-contract-detail`,
      contractKind: 'detail',
      statusCode: 200,
      generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
      source: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: fixture.viewModel,
    },
    summary: {
      contractId: `${fixture.fixtureId}-contract-summary`,
      contractKind: 'summary',
      statusCode: 200,
      generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
      source: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: {
        fixtureId: fixture.fixtureId,
        highestFixtureScoreLabel: fixture.viewModel.highestFixtureScoreLabel,
        sourceMetricFixtureName: fixture.sourceMetricFixtureName,
      },
    },
    errors: [
      {
        contractId: `${fixture.fixtureId}-contract-error-invalid`,
        contractKind: 'error',
        statusCode: 400,
        generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
        source: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
        fixtureOnly: true,
        readOnly: true,
        localOnly: true,
        errorCode: 'SYNTHETIC_STRATEGY_COMPARISON_LAB_INVALID_REQUEST',
        message: 'Fixture-only synthetic strategy comparison lab request is invalid.',
      },
      {
        contractId: `${fixture.fixtureId}-contract-error-not-found`,
        contractKind: 'error',
        statusCode: 404,
        generatedAt: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_GENERATED_AT,
        source: PHASE_62_SYNTHETIC_STRATEGY_COMPARISON_LAB_SOURCE,
        fixtureOnly: true,
        readOnly: true,
        localOnly: true,
        errorCode: 'SYNTHETIC_STRATEGY_COMPARISON_LAB_NOT_FOUND',
        message: 'Fixture-only synthetic strategy comparison lab fixture was not found.',
      },
    ],
  };
}
