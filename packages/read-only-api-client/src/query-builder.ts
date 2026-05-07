/**
 * packages/read-only-api-client/src/query-builder.ts
 *
 * Phase 23 — Typed query builders for Phase 21/22 query params.
 *
 * Convenience helpers for building typed, validated query objects to use with
 * local read-only API endpoint requests. These are client-side convenience
 * helpers only — API-side validation remains authoritative.
 *
 * Safety:
 *   - No network calls.
 *   - No live data.
 *   - No mutation.
 *   - Rejects invalid input with deterministic error messages.
 *   - Never throws raw exceptions from unknown input.
 */

import {
  ALLOWED_SEVERITY_VALUES,
  ALLOWED_PANEL_VALUES,
  ALLOWED_SOURCE_KIND_VALUES,
  ALLOWED_CLASSIFICATION_VALUES,
  ALLOWED_STATUS_VALUES,
  ALLOWED_SORT_FIELDS,
  ALLOWED_SORT_DIRECTIONS,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '@sonic/read-only-api';
import type { ReadOnlyApiClientQueryParams } from './types.js';

// ─── Query builder result ─────────────────────────────────────────────────────

/** Result from a query builder helper. */
export type QueryBuilderResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string };

// ─── Individual field builders ────────────────────────────────────────────────

/**
 * Validates and returns a safe limit value.
 * Clamps to [1, MAX_LIMIT]. Returns DEFAULT_LIMIT for undefined.
 */
export function buildLimitParam(value?: number): QueryBuilderResult<number> {
  if (value === undefined) return { ok: true, value: DEFAULT_LIMIT };
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { ok: false, error: `limit must be a finite integer, got: ${String(value)}` };
  }
  if (value < 1) return { ok: false, error: `limit must be >= 1, got: ${String(value)}` };
  if (value > MAX_LIMIT) {
    return { ok: false, error: `limit must be <= ${String(MAX_LIMIT)}, got: ${String(value)}` };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe offset value.
 * Must be >= 0. Returns 0 for undefined.
 */
export function buildOffsetParam(value?: number): QueryBuilderResult<number> {
  if (value === undefined) return { ok: true, value: 0 };
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { ok: false, error: `offset must be a finite integer, got: ${String(value)}` };
  }
  if (value < 0) return { ok: false, error: `offset must be >= 0, got: ${String(value)}` };
  return { ok: true, value };
}

/**
 * Validates and returns a safe cursor string.
 * Returns undefined for undefined/empty input.
 * Rejects cursors containing unsafe patterns.
 */
export function buildCursorParam(value?: string): QueryBuilderResult<string | undefined> {
  if (value === undefined || value === '') return { ok: true, value: undefined };
  if (value.length > 512) return { ok: false, error: 'cursor is too long (max 512 chars)' };
  const lower = value.toLowerCase();
  const forbidden = [
    'private_key', 'seed_phrase', 'mnemonic', 'apikey', 'api_key',
    'password', 'secret', 'http://', 'https://', 'wss://', 'ws://',
  ];
  if (forbidden.some(p => lower.includes(p))) {
    return { ok: false, error: 'cursor contains unsafe content' };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe severity filter value.
 * Returns undefined for undefined input. Rejects unknown values.
 */
export function buildSeverityParam(
  value?: string,
): QueryBuilderResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined };
  if (!(ALLOWED_SEVERITY_VALUES as readonly string[]).includes(value)) {
    return {
      ok: false,
      error: `severity must be one of: ${ALLOWED_SEVERITY_VALUES.join(', ')}, got: ${value}`,
    };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe panel filter value.
 * Returns undefined for undefined input. Rejects unknown values.
 */
export function buildPanelParam(value?: string): QueryBuilderResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined };
  if (!(ALLOWED_PANEL_VALUES as readonly string[]).includes(value)) {
    return {
      ok: false,
      error: `panel must be one of: ${ALLOWED_PANEL_VALUES.join(', ')}, got: ${value}`,
    };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe sourceKind filter value.
 * Returns undefined for undefined input. Rejects unknown values.
 */
export function buildSourceKindParam(value?: string): QueryBuilderResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined };
  if (!(ALLOWED_SOURCE_KIND_VALUES as readonly string[]).includes(value)) {
    return {
      ok: false,
      error: `sourceKind must be one of: ${ALLOWED_SOURCE_KIND_VALUES.join(', ')}, got: ${value}`,
    };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe classification filter value.
 * Returns undefined for undefined input. Rejects unknown values.
 */
export function buildClassificationParam(value?: string): QueryBuilderResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined };
  if (!(ALLOWED_CLASSIFICATION_VALUES as readonly string[]).includes(value)) {
    return {
      ok: false,
      error: `classification must be one of: ${ALLOWED_CLASSIFICATION_VALUES.join(', ')}, got: ${value}`,
    };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe status filter value.
 * Returns undefined for undefined input. Rejects unknown values.
 */
export function buildStatusParam(value?: string): QueryBuilderResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined };
  if (!(ALLOWED_STATUS_VALUES as readonly string[]).includes(value)) {
    return {
      ok: false,
      error: `status must be one of: ${ALLOWED_STATUS_VALUES.join(', ')}, got: ${value}`,
    };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe sortBy value.
 * Returns 'id' for undefined input. Rejects unknown values.
 */
export function buildSortByParam(value?: string): QueryBuilderResult<string> {
  if (value === undefined) return { ok: true, value: 'id' };
  if (!(ALLOWED_SORT_FIELDS as readonly string[]).includes(value)) {
    return {
      ok: false,
      error: `sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}, got: ${value}`,
    };
  }
  return { ok: true, value };
}

/**
 * Validates and returns a safe sortDirection value.
 * Returns 'asc' for undefined input. Rejects unknown values.
 */
export function buildSortDirectionParam(value?: string): QueryBuilderResult<string> {
  if (value === undefined) return { ok: true, value: 'asc' };
  if (!(ALLOWED_SORT_DIRECTIONS as readonly string[]).includes(value)) {
    return {
      ok: false,
      error: `sortDirection must be 'asc' or 'desc', got: ${value}`,
    };
  }
  return { ok: true, value };
}

// ─── Composite query builder ──────────────────────────────────────────────────

/** Input to the composite query builder. All fields are optional. */
export interface BuildQueryInput {
  readonly limit?: number;
  readonly offset?: number;
  readonly cursor?: string;
  readonly severity?: string;
  readonly panel?: string;
  readonly sourceKind?: string;
  readonly classification?: string;
  readonly status?: string;
  readonly sortBy?: string;
  readonly sortDirection?: string;
}

/** Result from buildReadOnlyApiQuery. */
export type BuildQueryResult =
  | { readonly ok: true; readonly query: ReadOnlyApiClientQueryParams }
  | { readonly ok: false; readonly errors: readonly string[] };

/**
 * Builds a validated ReadOnlyApiClientQueryParams from raw input.
 * Collects all validation errors without throwing.
 * Returns the first error-free validated query or all errors.
 * Pure, deterministic, safe.
 */
export function buildReadOnlyApiQuery(input: BuildQueryInput): BuildQueryResult {
  const errors: string[] = [];

  const limitResult = buildLimitParam(input.limit);
  const offsetResult = buildOffsetParam(input.offset);
  const cursorResult = buildCursorParam(input.cursor);
  const severityResult = buildSeverityParam(input.severity);
  const panelResult = buildPanelParam(input.panel);
  const sourceKindResult = buildSourceKindParam(input.sourceKind);
  const classificationResult = buildClassificationParam(input.classification);
  const statusResult = buildStatusParam(input.status);
  const sortByResult = buildSortByParam(input.sortBy);
  const sortDirectionResult = buildSortDirectionParam(input.sortDirection);

  if (!limitResult.ok) errors.push(limitResult.error);
  if (!offsetResult.ok) errors.push(offsetResult.error);
  if (!cursorResult.ok) errors.push(cursorResult.error);
  if (!severityResult.ok) errors.push(severityResult.error);
  if (!panelResult.ok) errors.push(panelResult.error);
  if (!sourceKindResult.ok) errors.push(sourceKindResult.error);
  if (!classificationResult.ok) errors.push(classificationResult.error);
  if (!statusResult.ok) errors.push(statusResult.error);
  if (!sortByResult.ok) errors.push(sortByResult.error);
  if (!sortDirectionResult.ok) errors.push(sortDirectionResult.error);

  if (errors.length > 0) return { ok: false, errors };

  // All results are ok at this point
  const limit = limitResult.ok ? limitResult.value : DEFAULT_LIMIT;
  const offset = offsetResult.ok ? offsetResult.value : 0;
  const cursor = cursorResult.ok ? cursorResult.value : undefined;
  const severity = severityResult.ok ? severityResult.value : undefined;
  const panel = panelResult.ok ? panelResult.value : undefined;
  const sourceKind = sourceKindResult.ok ? sourceKindResult.value : undefined;
  const classification = classificationResult.ok ? classificationResult.value : undefined;
  const status = statusResult.ok ? statusResult.value : undefined;
  const sortBy = sortByResult.ok ? sortByResult.value : 'id';
  const sortDirection = sortDirectionResult.ok ? sortDirectionResult.value : 'asc';

  const query: ReadOnlyApiClientQueryParams = {
    limit,
    offset,
    ...(cursor !== undefined ? { cursor } : {}),
    ...(severity !== undefined ? { severity } : {}),
    ...(panel !== undefined ? { panel } : {}),
    ...(sourceKind !== undefined ? { sourceKind } : {}),
    ...(classification !== undefined ? { classification } : {}),
    ...(status !== undefined ? { status } : {}),
    sortBy,
    sortDirection,
  };

  return { ok: true, query };
}

/**
 * Converts a ReadOnlyApiClientQueryParams to a stable URL query string.
 * Omits undefined/null values.
 * Returns an empty string when no params are defined.
 * Pure. Deterministic.
 */
export function buildQueryString(params: ReadOnlyApiClientQueryParams): string {
  const parts: string[] = [];
  if (params.limit !== undefined) parts.push(`limit=${String(params.limit)}`);
  if (params.offset !== undefined) parts.push(`offset=${String(params.offset)}`);
  if (params.cursor !== undefined) parts.push(`cursor=${encodeURIComponent(params.cursor)}`);
  if (params.severity !== undefined) parts.push(`severity=${encodeURIComponent(params.severity)}`);
  if (params.panel !== undefined) parts.push(`panel=${encodeURIComponent(params.panel)}`);
  if (params.sourceKind !== undefined) parts.push(`sourceKind=${encodeURIComponent(params.sourceKind)}`);
  if (params.classification !== undefined) parts.push(`classification=${encodeURIComponent(params.classification)}`);
  if (params.status !== undefined) parts.push(`status=${encodeURIComponent(params.status)}`);
  if (params.sortBy !== undefined) parts.push(`sortBy=${encodeURIComponent(params.sortBy)}`);
  if (params.sortDirection !== undefined) parts.push(`sortDirection=${encodeURIComponent(params.sortDirection)}`);
  return parts.join('&');
}
