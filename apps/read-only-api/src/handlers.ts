/**
 * apps/read-only-api/src/handlers.ts
 *
 * Phase 22 — Local Read-Only API route handlers (extends Phase 21).
 *
 * Phase 22 changes:
 *   - All handlers return Phase 22 ReadOnlyApiSuccessEnvelope / ReadOnlyApiErrorEnvelope
 *   - Envelopes include: ok, status, endpoint, method, data, error, meta, generatedAt
 *   - meta includes all Phase 21 safety fields for backward compat + Phase 22 contract fields
 *   - Error envelopes use structured ReadOnlyApiError with field-level details
 *   - All handlers remain pure, deterministic, fixture-only, non-mutating
 *
 * All handlers return deterministic fixture/contract/read-model responses.
 * Phase 21 handlers accept optional query params for filter/sort/pagination.
 * Phase 22 handlers accept optional endpoint param (defaults to correct route path).
 * No network calls, no live data, no mutations of any kind.
 */

import {
  buildReadOnlyApiSuccessEnvelope,
  buildReadOnlyApiErrorEnvelope,
  buildQueryErrorFromLroError,
} from './response-envelope.js';
import {
  buildReadOnlyApiContractMeta,
  buildReadOnlyApiQueryContractMeta,
} from './contract.js';
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

export function handleHealth(endpoint: string = '/health') {
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_health_response',
    {
      status: 'fixture_only',
      message:
        'Local Read-Only API Shell is running. ' +
        'This is a fixture-only, read-only, local-only, analysis-only, non-executable API shell. ' +
        'No live data. No trading. No execution. No providers. No wallet access.',
      phase: 'phase-22',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
      analysisOnly: true,
      nonExecutable: true,
      readOnly: true,
      localOnly: true,
    },
    meta,
  );
}

// ─── GET /capabilities ────────────────────────────────────────────────────────

export function handleCapabilities(endpoint: string = '/capabilities') {
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(endpoint, 'lro_capabilities_response', LRO_API_CAPABILITIES, meta);
}

// ─── GET /contracts ───────────────────────────────────────────────────────────

export function handleContracts(endpoint: string = '/contracts') {
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(endpoint, 'lro_contracts_response', LRO_API_CONTRACTS_JSON, meta);
}

// ─── GET /contracts/openapi-shape ────────────────────────────────────────────

export function handleContractsOpenApiShape(endpoint: string = '/contracts/openapi-shape') {
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(endpoint, 'lro_contracts_openapi_shape_response', LRO_API_CONTRACTS_OPENAPI_SHAPE, meta);
}

// ─── GET /dashboard ───────────────────────────────────────────────────────────

export function handleDashboard(rawQuery?: unknown, endpoint: string = '/dashboard') {
  const queryResult = parseReadOnlyApiQuery(rawQuery ?? {});
  if (!queryResult.ok) {
    const raw: Record<string, unknown> =
      rawQuery !== null && typeof rawQuery === 'object' && !Array.isArray(rawQuery)
        ? (rawQuery as Record<string, unknown>)
        : {};
    const error = buildQueryErrorFromLroError(queryResult.code, queryResult.message, raw);
    const meta = buildReadOnlyApiContractMeta();
    return buildReadOnlyApiErrorEnvelope(endpoint, 'lro_dashboard_response', error, meta);
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
  const meta = buildReadOnlyApiQueryContractMeta(queryMeta);
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_dashboard_response',
    { dashboard: LRO_API_CONTRACTS_BUNDLE.dashboardContract, queryMeta },
    meta,
  );
}

// ─── GET /dashboard/overview ─────────────────────────────────────────────────

export function handleDashboardOverview(endpoint: string = '/dashboard/overview') {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_dashboard_overview_response',
    fixture ? fixture.bundle.overview : null,
    meta,
    fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
  );
}

// ─── GET /dashboard/replay ────────────────────────────────────────────────────

export function handleDashboardReplay(endpoint: string = '/dashboard/replay') {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_dashboard_replay_response',
    fixture ? fixture.bundle.replayPanel : null,
    meta,
    fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
  );
}

// ─── GET /dashboard/strategy ──────────────────────────────────────────────────

export function handleDashboardStrategy(endpoint: string = '/dashboard/strategy') {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_dashboard_strategy_response',
    fixture ? fixture.bundle.strategyPanel : null,
    meta,
    fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
  );
}

// ─── GET /dashboard/evaluation ────────────────────────────────────────────────

export function handleDashboardEvaluation(endpoint: string = '/dashboard/evaluation') {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const meta = buildReadOnlyApiContractMeta();
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_dashboard_evaluation_response',
    fixture ? fixture.bundle.evaluationPanel : null,
    meta,
    fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
  );
}

// ─── GET /dashboard/evidence ──────────────────────────────────────────────────

export function handleDashboardEvidence(rawQuery?: unknown, endpoint: string = '/dashboard/evidence') {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const evidencePanel = fixture ? fixture.bundle.evidencePanel : null;

  const queryResult = parseReadOnlyApiQuery(rawQuery ?? {});
  if (!queryResult.ok) {
    const raw: Record<string, unknown> =
      rawQuery !== null && typeof rawQuery === 'object' && !Array.isArray(rawQuery)
        ? (rawQuery as Record<string, unknown>)
        : {};
    const error = buildQueryErrorFromLroError(queryResult.code, queryResult.message, raw);
    const meta = buildReadOnlyApiContractMeta();
    return buildReadOnlyApiErrorEnvelope(endpoint, 'lro_dashboard_evidence_response', error, meta);
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

  const meta = buildReadOnlyApiQueryContractMeta(queryMeta);
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_dashboard_evidence_response',
    { evidencePanel, entries: data, queryMeta },
    meta,
    fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
  );
}

// ─── GET /dashboard/safety ────────────────────────────────────────────────────

export function handleDashboardSafety(rawQuery?: unknown, endpoint: string = '/dashboard/safety') {
  const fixture = LRO_API_PRIMARY_DASHBOARD_FIXTURE;
  const safetyPanel = fixture ? fixture.bundle.safetyPanel : null;

  const queryResult = parseReadOnlyApiQuery(rawQuery ?? {});
  if (!queryResult.ok) {
    const raw: Record<string, unknown> =
      rawQuery !== null && typeof rawQuery === 'object' && !Array.isArray(rawQuery)
        ? (rawQuery as Record<string, unknown>)
        : {};
    const error = buildQueryErrorFromLroError(queryResult.code, queryResult.message, raw);
    const meta = buildReadOnlyApiContractMeta();
    return buildReadOnlyApiErrorEnvelope(endpoint, 'lro_dashboard_safety_response', error, meta);
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

  const meta = buildReadOnlyApiQueryContractMeta(queryMeta);
  return buildReadOnlyApiSuccessEnvelope(
    endpoint,
    'lro_dashboard_safety_response',
    { safetyPanel, queryMeta },
    meta,
    fixture ? [] : ['No primary dashboard fixture available. Returning null data.'],
  );
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
