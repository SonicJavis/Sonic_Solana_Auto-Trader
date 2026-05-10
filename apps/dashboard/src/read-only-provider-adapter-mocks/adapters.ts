/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: adapter run surface.
 */

import { READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES } from './fixtures.js';
import { selectReadOnlyProviderAdapterMockFixture } from './selectors.js';
import type {
  ReadOnlyProviderAdapterMockErrorCode,
  ReadOnlyProviderAdapterMockFixture,
  ReadOnlyProviderAdapterMockResult,
  ReadOnlyProviderAdapterMockRunInput,
} from './types.js';

function buildErrorResult(
  fixture: ReadOnlyProviderAdapterMockFixture,
  errorCode: ReadOnlyProviderAdapterMockErrorCode,
  message: string,
  statusCode: number,
): ReadOnlyProviderAdapterMockResult {
  return {
    ...fixture.mockResult,
    resultId: `phase55-result-error-${fixture.fixtureId}-${errorCode.toLowerCase()}`,
    statusCode,
    success: false,
    matched: false,
    data: null,
    error: {
      errorCode,
      message,
      recoverable: false,
    },
  };
}

export function runReadOnlyProviderAdapterMock(
  input: ReadOnlyProviderAdapterMockRunInput = {},
): ReadOnlyProviderAdapterMockResult {
  const selected = selectReadOnlyProviderAdapterMockFixture({
    fixtureId: input.fixtureId,
    adapterKind: input.adapterKind,
    domain: input.domain,
  });

  const fixture = READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.find(
    candidate => candidate.fixtureId === selected.selectedFixtureId,
  );

  if (!fixture || !selected.matched) {
    const fallback = READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES[0];
    if (!fallback) {
      throw new Error('Phase 55 fixture table is empty');
    }
    return buildErrorResult(
      fallback,
      'INVALID_DETERMINISTIC_MOCK_QUERY',
      'Invalid deterministic mock query. No fixture matched input.',
      404,
    );
  }

  if (input.unsafeLiveRequested === true) {
    return buildErrorResult(
      fixture,
      'UNSAFE_CAPABILITY_REQUESTED',
      'Unsafe live capability requested. Mock adapters are fixture-only and local-only.',
      400,
    );
  }

  if (fixture.fixtureKind === 'mock_disabled_unsafe_adapter') {
    return buildErrorResult(
      fixture,
      'PROVIDER_DISABLED',
      'Provider adapter mock is disabled for unsafe domains.',
      503,
    );
  }

  if (
    input.requestedResponseKind &&
    input.requestedResponseKind !== fixture.mockResult.resultKind
  ) {
    return buildErrorResult(
      fixture,
      'UNSUPPORTED_SYNTHETIC_DOMAIN',
      'Requested response kind is unsupported for selected synthetic domain.',
      422,
    );
  }

  if (
    input.sourceSyntheticLaunchFixtureName &&
    input.sourceSyntheticLaunchFixtureName !== fixture.mockRequest.sourceSyntheticLaunchFixtureName
  ) {
    return buildErrorResult(
      fixture,
      'INVALID_DETERMINISTIC_MOCK_QUERY',
      'Synthetic launch fixture reference does not match selected adapter mock fixture.',
      404,
    );
  }

  return {
    ...fixture.mockResult,
    matched: true,
  };
}
