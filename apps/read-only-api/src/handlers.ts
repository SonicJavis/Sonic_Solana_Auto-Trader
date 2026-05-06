/**
 * apps/read-only-api/src/handlers.ts
 *
 * Phase 21 — Local Read-Only API route handlers (extends Phase 20).
 *
 * All handlers return deterministic fixture/contract/read-model responses.
 * Phase 21 handlers accept optional query params for filter/sort/pagination.
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
import { parseReadOnlyApiQuery } from './query.js';
import { buildReadOnlyApiPagination, applyReadOnlyApiPagination } from './pagination.js';
import { applyReadOnlyApiFilters, buildAppliedFiltersMeta } from './filtering.js';
import { applyReadOnlyApiSorting, buildAppliedSortMeta } from './sorting.js';
import type { LroApiQueryMeta } from './types.js';

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
      phase: 'phase-21',
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

export function handleDashboard(rawQuery?: unknown) {
  const queryResult = parseReadOnlyApiQuery(rawQuery ?? {});
  if (!queryResult.ok) {
    return buildReadOnlyApiResponse({
      envelopeId: 'lro_dashboard_response',
      status: 'failed',
      data: null,
      errors: [{ code: queryResult.code, message: queryResult.message }],
    });
  }
  const q = queryResult.value;
  const pagination = buildReadOnlyApiPagination(q);
  const pag = pagination.ok ? pagination.value : { limit: q.limit, offset: q.offset, cursor: q.cursor };
  const { paginationMeta } = applyReadOnlyApiPagination([LRO_API_CONTRACTS_BUNDLE.dashboardContract], pag);
  const queryMeta: LroApiQueryMeta = {
    query: { limit: q.limit, offset: q.offset, cursor: q.cursor, sortBy: q.sortBy, sortDirection: q.sortDirection, severity: q.severity, panel: q.panel, sourceKind: q.sourceKind, classification: q.classification, status: q.status },
    appliedFilters: buildAppliedFiltersMeta(q),
    sort: buildAppliedSortMeta(q),
    pagination: paginationMeta,
    fixtureOnly: true, analysisOnly: true, nonExecutable: true, readOnly: true, localOnly: true,
  };
  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_response',
    status: 'ok',
    data: { dashboard: LRO_API_CONTRACTS_BUNDLE.dashboardContract, queryMeta },
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

export function handleDashboardEvidence(rawQuery?: unknown) {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const evidencePanel = fixture ? fixture.bundle.evidencePanel : null;

  const queryResult = parseReadOnlyApiQuery(rawQuery ?? {});
  if (!queryResult.ok) {
    return buildReadOnlyApiResponse({
      envelopeId: 'lro_dashboard_evidence_response',
      status: 'failed',
      data: null,
      errors: [{ code: queryResult.code, message: queryResult.message }],
    });
  }
  const q = queryResult.value;

  // Build items array from evidence entries if available
  type EvidenceEntry = { id?: string; severity?: string; sourceKind?: string; classification?: string; status?: string; panel?: string; label?: string; createdAt?: string };
  const evidencePanelAsUnknown = evidencePanel as unknown;
  const items: EvidenceEntry[] = evidencePanelAsUnknown
    ? (Array.isArray((evidencePanelAsUnknown as Record<string, unknown>)['entries'])
        ? ((evidencePanelAsUnknown as Record<string, unknown>)['entries'] as EvidenceEntry[])
        : [evidencePanelAsUnknown as EvidenceEntry])
    : [];

  const filtered = applyReadOnlyApiFilters(items, q);
  const sorted = applyReadOnlyApiSorting(filtered, q);
  const pagination = buildReadOnlyApiPagination(q);
  const pag = pagination.ok ? pagination.value : { limit: q.limit, offset: q.offset, cursor: q.cursor };
  const { data, paginationMeta } = applyReadOnlyApiPagination(sorted, pag);

  const queryMeta: LroApiQueryMeta = {
    query: { limit: q.limit, offset: q.offset, cursor: q.cursor, sortBy: q.sortBy, sortDirection: q.sortDirection, severity: q.severity, panel: q.panel, sourceKind: q.sourceKind, classification: q.classification, status: q.status },
    appliedFilters: buildAppliedFiltersMeta(q),
    sort: buildAppliedSortMeta(q),
    pagination: paginationMeta,
    fixtureOnly: true, analysisOnly: true, nonExecutable: true, readOnly: true, localOnly: true,
  };

  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_evidence_response',
    status: 'ok',
    data: { evidencePanel, entries: data, queryMeta },
    warnings: fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
  });
}

// ─── GET /dashboard/safety ────────────────────────────────────────────────────

export function handleDashboardSafety(rawQuery?: unknown) {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const safetyPanel = fixture ? fixture.bundle.safetyPanel : null;

  const queryResult = parseReadOnlyApiQuery(rawQuery ?? {});
  if (!queryResult.ok) {
    return buildReadOnlyApiResponse({
      envelopeId: 'lro_dashboard_safety_response',
      status: 'failed',
      data: null,
      errors: [{ code: queryResult.code, message: queryResult.message }],
    });
  }
  const q = queryResult.value;
  const pagination = buildReadOnlyApiPagination(q);
  const pag = pagination.ok ? pagination.value : { limit: q.limit, offset: q.offset, cursor: q.cursor };
  const { paginationMeta } = applyReadOnlyApiPagination(safetyPanel ? [safetyPanel] : [], pag);

  const queryMeta: LroApiQueryMeta = {
    query: { limit: q.limit, offset: q.offset, cursor: q.cursor, sortBy: q.sortBy, sortDirection: q.sortDirection, severity: q.severity, panel: q.panel, sourceKind: q.sourceKind, classification: q.classification, status: q.status },
    appliedFilters: buildAppliedFiltersMeta(q),
    sort: buildAppliedSortMeta(q),
    pagination: paginationMeta,
    fixtureOnly: true, analysisOnly: true, nonExecutable: true, readOnly: true, localOnly: true,
  };

  return buildReadOnlyApiResponse({
    envelopeId: 'lro_dashboard_safety_response',
    status: 'ok',
    data: { safetyPanel, queryMeta },
    warnings: fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
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
