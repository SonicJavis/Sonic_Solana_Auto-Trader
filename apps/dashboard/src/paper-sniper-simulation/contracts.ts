/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: API contract fixtures.
 */

import {
  PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
  PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
  type PaperSniperSimulationApiContracts,
  type PaperSniperSimulationApiDetailContract,
  type PaperSniperSimulationApiErrorContract,
  type PaperSniperSimulationApiListContract,
  type PaperSniperSimulationApiSummaryContract,
  type PaperSniperSimulationFixture,
} from './types.js';

function buildListContract(fixture: PaperSniperSimulationFixture): PaperSniperSimulationApiListContract {
  return {
    contractId: `phase60-contract-list-${fixture.fixtureId}`,
    contractKind: 'list',
    statusCode: 200,
    generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
    source: PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
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
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationApiDetailContract {
  return {
    contractId: `phase60-contract-detail-${fixture.fixtureId}`,
    contractKind: 'detail',
    statusCode: 200,
    generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
    source: PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: fixture.viewModel,
  };
}

function buildSummaryContract(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationApiSummaryContract {
  return {
    contractId: `phase60-contract-summary-${fixture.fixtureId}`,
    contractKind: 'summary',
    statusCode: 200,
    generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
    source: PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
    data: {
      fixtureId: fixture.fixtureId,
      simulationKind: fixture.fixtureKind,
      projectedStatus: fixture.outcome.outcomeStatus,
      sourcePhase58FixtureName: fixture.sourcePhase58FixtureName,
    },
  };
}

function buildErrorContracts(
  fixture: PaperSniperSimulationFixture,
): [PaperSniperSimulationApiErrorContract, PaperSniperSimulationApiErrorContract] {
  return [
    {
      contractId: `phase60-contract-error-invalid-${fixture.fixtureId}`,
      contractKind: 'error',
      statusCode: 400,
      generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
      source: PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'PAPER_SNIPER_SIMULATION_INVALID_REQUEST',
      message: 'Fixture-only: invalid paper sniper simulation query.',
    },
    {
      contractId: `phase60-contract-error-notfound-${fixture.fixtureId}`,
      contractKind: 'error',
      statusCode: 404,
      generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
      source: PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      errorCode: 'PAPER_SNIPER_SIMULATION_NOT_FOUND',
      message: 'Fixture-only: requested paper sniper simulation fixture not found.',
    },
  ];
}

export function buildPaperSniperSimulationApiContract(
  fixture: PaperSniperSimulationFixture,
): PaperSniperSimulationApiContracts {
  return {
    list: buildListContract(fixture),
    detail: buildDetailContract(fixture),
    summary: buildSummaryContract(fixture),
    errors: buildErrorContracts(fixture),
  };
}
