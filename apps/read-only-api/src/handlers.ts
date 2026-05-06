/**
 * apps/read-only-api/src/handlers.ts
 *
 * Phase 20 — Local Read-Only API route handlers.
 *
 * All handlers return deterministic fixture/contract/read-model responses.
 * No network calls, no live data, no mutations of any kind.
 * All responses include full safety metadata.
 */

import { buildReadOnlyApiResponse } from './response.js';
import {
  LRO_API_CAPABILITIES,
  LRO_API_CONTRACTS_BUNDLE,
  LRO_API_CONTRACTS_JSON,
  LRO_API_CONTRACTS_OPENAPI_SHAPE,
  LRO_API_PRIMARY_DASHBOARD_FIXTURE,
  LRO_API_DASHBOARD_FIXTURES,
} from './fixtures.js';

// ─── GET /health ──────────────────────────────────────────────────────────────

export function handleHealth() {
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_health_response',
    status: 'ok',
    data: {
      status: 'fixture_only',
      message:
        'Local Read-Only API Shell is running. ' +
        'This is a fixture-only, read-only, local-only, analysis-only, non-executable API shell. ' +
        'No live data. No trading. No execution. No providers. No wallet access.',
      phase: 'phase-20',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
      analysisOnly: true,
      nonExecutable: true,
      readOnly: true,
      localOnly: true,
    },
  });
}

// ─── GET /capabilities ────────────────────────────────────────────────────────

export function handleCapabilities() {
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_capabilities_response',
    status: 'ok',
    data: LRO_API_CAPABILITIES,
  });
}

// ─── GET /contracts ───────────────────────────────────────────────────────────

export function handleContracts() {
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_contracts_response',
    status: 'ok',
    data: LRO_API_CONTRACTS_JSON,
  });
}

// ─── GET /contracts/openapi-shape ────────────────────────────────────────────

export function handleContractsOpenApiShape() {
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_contracts_openapi_shape_response',
    status: 'ok',
    data: LRO_API_CONTRACTS_OPENAPI_SHAPE,
  });
}

// ─── GET /dashboard ───────────────────────────────────────────────────────────

export function handleDashboard() {
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_response',
    status: 'ok',
    data: LRO_API_CONTRACTS_BUNDLE.dashboardContract,
  });
}

// ─── GET /dashboard/overview ─────────────────────────────────────────────────

export function handleDashboardOverview() {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_overview_response',
    status: 'ok',
    data: fixture ? fixture.bundle.overview : null,
    warnings: fixture
      ? []
      : ['No primary dashboard fixture available. Returning null data.'],
  });
}

// ─── GET /dashboard/replay ────────────────────────────────────────────────────

export function handleDashboardReplay() {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_replay_response',
    status: 'ok',
    data: fixture ? fixture.bundle.replayPanel : null,
    warnings: fixture
      ? []
      : ['No primary dashboard fixture available. Returning null data.'],
  });
}

// ─── GET /dashboard/strategy ──────────────────────────────────────────────────

export function handleDashboardStrategy() {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_strategy_response',
    status: 'ok',
    data: fixture ? fixture.bundle.strategyPanel : null,
    warnings: fixture
      ? []
      : ['No primary dashboard fixture available. Returning null data.'],
  });
}

// ─── GET /dashboard/evaluation ────────────────────────────────────────────────

export function handleDashboardEvaluation() {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_evaluation_response',
    status: 'ok',
    data: fixture ? fixture.bundle.evaluationPanel : null,
    warnings: fixture
      ? []
      : ['No primary dashboard fixture available. Returning null data.'],
  });
}

// ─── GET /dashboard/evidence ──────────────────────────────────────────────────

export function handleDashboardEvidence() {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_evidence_response',
    status: 'ok',
    data: fixture ? fixture.bundle.evidencePanel : null,
    warnings: fixture
      ? []
      : ['No primary dashboard fixture available. Returning null data.'],
  });
}

// ─── GET /dashboard/safety ────────────────────────────────────────────────────

export function handleDashboardSafety() {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_safety_response',
    status: 'ok',
    data: fixture ? fixture.bundle.safetyPanel : null,
    warnings: fixture
      ? []
      : ['No primary dashboard fixture available. Returning null data.'],
  });
}

// ─── All handlers export ──────────────────────────────────────────────────────

export const LRO_API_HANDLERS = {
  handleHealth,
  handleCapabilities,
  handleContracts,
  handleContractsOpenApiShape,
  handleDashboard,
  handleDashboardOverview,
  handleDashboardReplay,
  handleDashboardStrategy,
  handleDashboardEvaluation,
  handleDashboardEvidence,
  handleDashboardSafety,
  /** Suppress unused warning — included for test inspection. */
  _fixtureCount: LRO_API_DASHBOARD_FIXTURES.length,
};
