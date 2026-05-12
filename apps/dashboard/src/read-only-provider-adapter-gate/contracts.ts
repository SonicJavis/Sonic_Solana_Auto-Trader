import type {
  ReadOnlyProviderAdapterGateApiContracts,
  ReadOnlyProviderAdapterGateFixture,
} from './types.js';
import {
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
} from './types.js';

export function buildReadOnlyProviderAdapterGateApiContract(
  fixture: ReadOnlyProviderAdapterGateFixture,
): ReadOnlyProviderAdapterGateApiContracts {
  return {
    list: {
      contractId: `${fixture.fixtureId}-contract-list`,
      contractKind: 'list',
      statusCode: 200,
      generatedAt: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
      source: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
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
      generatedAt: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
      source: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: fixture.viewModel,
    },
    summary: {
      contractId: `${fixture.fixtureId}-contract-summary`,
      contractKind: 'summary',
      statusCode: 200,
      generatedAt: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
      source: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      data: {
        fixtureId: fixture.fixtureId,
        gateState: fixture.gateState.stateKind,
        allowed: fixture.resolutionResult.allowed,
        failClosed: true,
      },
    },
    errors: [
      {
        contractId: `${fixture.fixtureId}-contract-error-invalid`,
        contractKind: 'error',
        statusCode: 400,
        generatedAt: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
        source: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
        fixtureOnly: true,
        readOnly: true,
        localOnly: true,
        errorCode: 'READ_ONLY_PROVIDER_ADAPTER_GATE_INVALID_REQUEST',
        message: 'Invalid read-only provider adapter gate fixture query.',
      },
      {
        contractId: `${fixture.fixtureId}-contract-error-not-found`,
        contractKind: 'error',
        statusCode: 404,
        generatedAt: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
        source: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
        fixtureOnly: true,
        readOnly: true,
        localOnly: true,
        errorCode: 'READ_ONLY_PROVIDER_ADAPTER_GATE_NOT_FOUND',
        message: 'Requested read-only provider adapter gate fixture was not found.',
      },
    ],
  };
}
