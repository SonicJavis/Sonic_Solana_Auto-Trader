/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: API contract fixtures.
 */

import {
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
  type SyntheticEventStreamLifecycleApiContracts,
  type SyntheticEventStreamLifecycleApiDetailContract,
  type SyntheticEventStreamLifecycleApiErrorContract,
  type SyntheticEventStreamLifecycleApiListContract,
  type SyntheticEventStreamLifecycleApiSummaryContract,
  type SyntheticEventStreamLifecycleFixture,
} from './types.js';

function buildListContract(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleApiListContract {
  return {
    contractId: `phase56-contract-list-${fixture.fixtureId}`,
    contractName: `synthetic-event-stream-lifecycle-list-${fixture.fixtureName}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
    source: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureIds: [fixture.fixtureId],
      totalCount: 1,
    },
  };
}

function buildDetailContract(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleApiDetailContract {
  return {
    contractId: `phase56-contract-detail-${fixture.fixtureId}`,
    contractName: `synthetic-event-stream-lifecycle-detail-${fixture.fixtureName}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
    source: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleApiSummaryContract {
  return {
    contractId: `phase56-contract-summary-${fixture.fixtureId}`,
    contractName: `synthetic-event-stream-lifecycle-summary-${fixture.fixtureName}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
    source: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      streamKind: fixture.fixtureKind,
      lifecycleStatus: fixture.derivedLifecycleState.lifecycleStatus,
      safetyStatus: fixture.derivedLifecycleState.safetyState.status,
    },
  };
}

function buildErrorContracts(
  fixture: SyntheticEventStreamLifecycleFixture,
): [SyntheticEventStreamLifecycleApiErrorContract, SyntheticEventStreamLifecycleApiErrorContract] {
  return [
    {
      contractId: `phase56-contract-error-invalid-${fixture.fixtureId}`,
      contractName: `synthetic-event-stream-lifecycle-error-invalid-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
      source: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'SYNTHETIC_EVENT_STREAM_INVALID_REQUEST',
      message: 'Synthetic event stream lifecycle request is invalid for fixture-only mode.',
    },
    {
      contractId: `phase56-contract-error-not-found-${fixture.fixtureId}`,
      contractName: `synthetic-event-stream-lifecycle-error-not-found-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 404,
      generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
      source: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'SYNTHETIC_EVENT_STREAM_NOT_FOUND',
      message: 'Synthetic event stream lifecycle fixture not found.',
    },
  ];
}

export function buildSyntheticEventStreamLifecycleApiContract(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
