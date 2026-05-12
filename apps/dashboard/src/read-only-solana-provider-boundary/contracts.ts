import type {
  ReadOnlySolanaProviderBoundaryApiContracts,
  ReadOnlySolanaProviderBoundaryFixture,
} from './types.js';
import {
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
} from './types.js';

export function buildReadOnlySolanaProviderBoundaryApiContract(
  fixture: ReadOnlySolanaProviderBoundaryFixture,
): ReadOnlySolanaProviderBoundaryApiContracts {
  return {
    list: {
      contractId: `${fixture.fixtureId}-contract-list`,
      contractKind: 'list',
      statusCode: 200,
      generatedAt: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
      source: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
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
      generatedAt: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
      source: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: fixture.viewModel,
    },
    summary: {
      contractId: `${fixture.fixtureId}-contract-summary`,
      contractKind: 'summary',
      statusCode: 200,
      generatedAt: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
      source: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: {
        fixtureId: fixture.fixtureId,
        boundaryState: fixture.boundaryState.stateKind,
        mappingStatus: fixture.mockToRealMapping.mappingStatus,
        gateBlocked: fixture.boundaryState.stateKind === 'future_real_provider_blocked_by_gate',
      },
    },
    errors: [
      {
        contractId: `${fixture.fixtureId}-contract-error-invalid`,
        contractKind: 'error',
        statusCode: 400,
        generatedAt: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
        source: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
        fixtureOnly: true,
        readOnly: true,
        localOnly: true,
        errorCode: 'READ_ONLY_SOLANA_PROVIDER_BOUNDARY_INVALID_REQUEST',
        message: 'Invalid read-only Solana provider boundary fixture query.',
      },
      {
        contractId: `${fixture.fixtureId}-contract-error-not-found`,
        contractKind: 'error',
        statusCode: 404,
        generatedAt: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
        source: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
        fixtureOnly: true,
        readOnly: true,
        localOnly: true,
        errorCode: 'READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NOT_FOUND',
        message: 'Requested read-only Solana provider boundary fixture was not found.',
      },
    ],
  };
}

