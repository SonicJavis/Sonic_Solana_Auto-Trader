/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: API contract fixtures.
 */

import {
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
  PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
  type SyntheticEventStreamReplayHarnessApiContracts,
  type SyntheticEventStreamReplayHarnessApiDetailContract,
  type SyntheticEventStreamReplayHarnessApiErrorContract,
  type SyntheticEventStreamReplayHarnessApiListContract,
  type SyntheticEventStreamReplayHarnessApiSummaryContract,
  type SyntheticEventStreamReplayHarnessFixture,
} from './types.js';

function buildListContract(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessApiListContract {
  return {
    contractId: `phase57-contract-list-${fixture.fixtureId}`,
    contractName: `synthetic-event-stream-replay-harness-list-${fixture.fixtureName}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
    source: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
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
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessApiDetailContract {
  return {
    contractId: `phase57-contract-detail-${fixture.fixtureId}`,
    contractName: `synthetic-event-stream-replay-harness-detail-${fixture.fixtureName}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
    source: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessApiSummaryContract {
  return {
    contractId: `phase57-contract-summary-${fixture.fixtureId}`,
    contractName: `synthetic-event-stream-replay-harness-summary-${fixture.fixtureName}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
    source: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      replayStatus: fixture.actualReport.replayStatus,
      mismatchCount: fixture.actualReport.mismatchCount,
      sourceLifecycleFixtureName: fixture.sourceLifecycleFixtureName,
    },
  };
}

function buildErrorContracts(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): [SyntheticEventStreamReplayHarnessApiErrorContract, SyntheticEventStreamReplayHarnessApiErrorContract] {
  return [
    {
      contractId: `phase57-contract-error-invalid-${fixture.fixtureId}`,
      contractName: `synthetic-event-stream-replay-harness-error-invalid-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
      source: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'SYNTHETIC_EVENT_STREAM_REPLAY_INVALID_REQUEST',
      message: 'Synthetic replay harness request is invalid in fixture-only mode.',
    },
    {
      contractId: `phase57-contract-error-not-found-${fixture.fixtureId}`,
      contractName: `synthetic-event-stream-replay-harness-error-not-found-${fixture.fixtureName}`,
      contractKind: 'error',
      statusCode: 404,
      generatedAt: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_GENERATED_AT,
      source: PHASE_57_SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'SYNTHETIC_EVENT_STREAM_REPLAY_NOT_FOUND',
      message: 'Synthetic replay harness fixture was not found.',
    },
  ];
}

export function buildSyntheticEventStreamReplayHarnessApiContract(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
