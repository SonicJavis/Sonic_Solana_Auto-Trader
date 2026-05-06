/**
 * apps/read-only-api/src/query.ts
 *
 * Phase 21 — Local Read-Only API safe query parser.
 *
 * Parses, validates, and normalises raw query parameters into a typed
 * ReadOnlyApiQuery model.  All fields are optional with deterministic defaults.
 *
 * Safety rules:
 *   - Only explicit enum-safe filter fields are accepted.
 *   - Unknown fields are ignored (never executed).
 *   - Unsafe text (URLs, secrets, action terms) is rejected.
 *   - No live lookups, no network calls, no SQL, no eval.
 */

import { lroApiOk, lroApiErr } from './errors.js';
import type { LroApiResult } from './errors.js';
import { containsUnsafeActionText, containsSecretPattern, containsUrlPattern } from './safety.js';

// ─── Allowed enum values ──────────────────────────────────────────────────────

export const ALLOWED_SEVERITY_VALUES = ['info', 'low', 'medium', 'high', 'critical'] as const;
export type AllowedSeverity = (typeof ALLOWED_SEVERITY_VALUES)[number];

export const ALLOWED_PANEL_VALUES = [
  'overview',
  'replay',
  'strategy',
  'evaluation',
  'evidence',
  'safety',
] as const;
export type AllowedPanel = (typeof ALLOWED_PANEL_VALUES)[number];

export const ALLOWED_SOURCE_KIND_VALUES = [
  'replay',
  'strategy',
  'evaluation',
  'evidence',
  'safety',
  'fixture',
  'contract',
] as const;
export type AllowedSourceKind = (typeof ALLOWED_SOURCE_KIND_VALUES)[number];

export const ALLOWED_CLASSIFICATION_VALUES = [
  'safe',
  'caution',
  'warning',
  'unsafe',
  'unknown',
  'fixture_only',
  'analysis_only',
] as const;
export type AllowedClassification = (typeof ALLOWED_CLASSIFICATION_VALUES)[number];

export const ALLOWED_STATUS_VALUES = [
  'ok',
  'degraded',
  'failed',
  'inconclusive',
  'pending',
  'fixture',
] as const;
export type AllowedStatus = (typeof ALLOWED_STATUS_VALUES)[number];

export const ALLOWED_SORT_FIELDS = [
  'id',
  'severity',
  'sourceKind',
  'classification',
  'createdAt',
  'label',
  'status',
  'panel',
] as const;
export type AllowedSortField = (typeof ALLOWED_SORT_FIELDS)[number];

export const ALLOWED_SORT_DIRECTIONS = ['asc', 'desc'] as const;
export type AllowedSortDirection = (typeof ALLOWED_SORT_DIRECTIONS)[number];

// ─── Query model ──────────────────────────────────────────────────────────────

/** Typed safe query model. All fields are optional with deterministic defaults. */
export interface ReadOnlyApiQuery {
  readonly limit: number;
  readonly offset: number;
  readonly cursor: string | undefined;
  readonly severity: AllowedSeverity | undefined;
  readonly panel: AllowedPanel | undefined;
  readonly sourceKind: AllowedSourceKind | undefined;
  readonly classification: AllowedClassification | undefined;
  readonly status: AllowedStatus | undefined;
  readonly sortBy: AllowedSortField;
  readonly sortDirection: AllowedSortDirection;
}

export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;
export const DEFAULT_SORT_BY: AllowedSortField = 'id';
export const DEFAULT_SORT_DIRECTION: AllowedSortDirection = 'asc';

// ─── Unsafe string detector ───────────────────────────────────────────────────

const UNSAFE_QUERY_PATTERNS: readonly string[] = [
  'select ',
  'insert ',
  'update ',
  'delete ',
  'drop ',
  'create ',
  'alter ',
  'truncate ',
  'exec(',
  'eval(',
  'new function',
  '../',
  './',
  '\\',
  '%2e%2e',
  'script',
  '<',
  '>',
  '|',
  ';',
  '`',
];

function isUnsafeQueryString(value: string): boolean {
  const lower = value.toLowerCase();
  if (containsUnsafeActionText(value)) return true;
  if (containsSecretPattern(value)) return true;
  if (containsUrlPattern(value)) return true;
  return UNSAFE_QUERY_PATTERNS.some(p => lower.includes(p));
}

// ─── Safe coerce helpers ──────────────────────────────────────────────────────

function coerceToString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return undefined;
}

function coerceToPositiveInt(v: unknown, defaultVal: number): number {
  const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? v : NaN;
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000) return defaultVal;
  return Math.floor(n);
}

// ─── parseReadOnlyApiQuery ────────────────────────────────────────────────────

/**
 * Parses raw (unknown) query parameters into a typed ReadOnlyApiQuery.
 * Applies deterministic defaults.
 * Rejects unsafe strings, unknown sort fields, and unsafe values.
 *
 * @param input - Raw query object from request (unknown).
 * @returns LroApiResult<ReadOnlyApiQuery>
 */
export function parseReadOnlyApiQuery(input: unknown): LroApiResult<ReadOnlyApiQuery> {
  const raw: Record<string, unknown> =
    input !== null && typeof input === 'object' && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};

  // ── limit ──
  let rawLimit = coerceToPositiveInt(raw['limit'], DEFAULT_LIMIT);
  if (rawLimit > MAX_LIMIT) rawLimit = MAX_LIMIT;
  if (rawLimit < 0 || !Number.isFinite(rawLimit)) rawLimit = DEFAULT_LIMIT;

  // ── offset ──
  const rawOffsetInput = raw['offset'];
  // Explicitly reject negative numeric input
  const rawOffsetNum = typeof rawOffsetInput === 'string' ? parseInt(rawOffsetInput, 10) : typeof rawOffsetInput === 'number' ? rawOffsetInput : 0;
  if (typeof rawOffsetInput !== 'undefined' && rawOffsetInput !== null && rawOffsetNum < 0) {
    return lroApiErr('INVALID_LRO_API_INPUT', 'offset must be >= 0');
  }
  const rawOffset = coerceToPositiveInt(rawOffsetInput, 0);

  // ── cursor ──
  let cursor: string | undefined;
  const rawCursor = coerceToString(raw['cursor']);
  if (rawCursor !== undefined) {
    if (rawCursor.length > 256) {
      return lroApiErr('INVALID_LRO_API_INPUT', 'cursor exceeds max length (256)');
    }
    if (isUnsafeQueryString(rawCursor)) {
      return lroApiErr('UNSAFE_CONTENT_DETECTED', 'cursor contains unsafe content');
    }
    cursor = rawCursor;
  }

  // ── severity ──
  let severity: AllowedSeverity | undefined;
  const rawSeverity = coerceToString(raw['severity']);
  if (rawSeverity !== undefined) {
    if (!(ALLOWED_SEVERITY_VALUES as readonly string[]).includes(rawSeverity)) {
      return lroApiErr(
        'INVALID_LRO_API_INPUT',
        `severity must be one of: ${ALLOWED_SEVERITY_VALUES.join(', ')}`,
      );
    }
    severity = rawSeverity as AllowedSeverity;
  }

  // ── panel ──
  let panel: AllowedPanel | undefined;
  const rawPanel = coerceToString(raw['panel']);
  if (rawPanel !== undefined) {
    if (!(ALLOWED_PANEL_VALUES as readonly string[]).includes(rawPanel)) {
      return lroApiErr(
        'INVALID_LRO_API_INPUT',
        `panel must be one of: ${ALLOWED_PANEL_VALUES.join(', ')}`,
      );
    }
    panel = rawPanel as AllowedPanel;
  }

  // ── sourceKind ──
  let sourceKind: AllowedSourceKind | undefined;
  const rawSourceKind = coerceToString(raw['sourceKind']);
  if (rawSourceKind !== undefined) {
    if (!(ALLOWED_SOURCE_KIND_VALUES as readonly string[]).includes(rawSourceKind)) {
      return lroApiErr(
        'INVALID_LRO_API_INPUT',
        `sourceKind must be one of: ${ALLOWED_SOURCE_KIND_VALUES.join(', ')}`,
      );
    }
    sourceKind = rawSourceKind as AllowedSourceKind;
  }

  // ── classification ──
  let classification: AllowedClassification | undefined;
  const rawClassification = coerceToString(raw['classification']);
  if (rawClassification !== undefined) {
    if (!(ALLOWED_CLASSIFICATION_VALUES as readonly string[]).includes(rawClassification)) {
      return lroApiErr(
        'INVALID_LRO_API_INPUT',
        `classification must be one of: ${ALLOWED_CLASSIFICATION_VALUES.join(', ')}`,
      );
    }
    classification = rawClassification as AllowedClassification;
  }

  // ── status ──
  let status: AllowedStatus | undefined;
  const rawStatus = coerceToString(raw['status']);
  if (rawStatus !== undefined) {
    if (!(ALLOWED_STATUS_VALUES as readonly string[]).includes(rawStatus)) {
      return lroApiErr(
        'INVALID_LRO_API_INPUT',
        `status must be one of: ${ALLOWED_STATUS_VALUES.join(', ')}`,
      );
    }
    status = rawStatus as AllowedStatus;
  }

  // ── sortBy ──
  let sortBy: AllowedSortField = DEFAULT_SORT_BY;
  const rawSortBy = coerceToString(raw['sortBy']);
  if (rawSortBy !== undefined) {
    if (!(ALLOWED_SORT_FIELDS as readonly string[]).includes(rawSortBy)) {
      return lroApiErr(
        'INVALID_LRO_API_INPUT',
        `sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`,
      );
    }
    sortBy = rawSortBy as AllowedSortField;
  }

  // ── sortDirection ──
  let sortDirection: AllowedSortDirection = DEFAULT_SORT_DIRECTION;
  const rawSortDirection = coerceToString(raw['sortDirection']);
  if (rawSortDirection !== undefined) {
    if (!(ALLOWED_SORT_DIRECTIONS as readonly string[]).includes(rawSortDirection)) {
      return lroApiErr('INVALID_LRO_API_INPUT', `sortDirection must be 'asc' or 'desc'`);
    }
    sortDirection = rawSortDirection as AllowedSortDirection;
  }

  return lroApiOk({
    limit: rawLimit,
    offset: rawOffset,
    cursor,
    severity,
    panel,
    sourceKind,
    classification,
    status,
    sortBy,
    sortDirection,
  });
}

// ─── buildReadOnlyApiQueryResult ──────────────────────────────────────────────

import { buildReadOnlyApiPagination, applyReadOnlyApiPagination } from './pagination.js';
import { applyReadOnlyApiFilters, buildAppliedFiltersMeta } from './filtering.js';
import { applyReadOnlyApiSorting, buildAppliedSortMeta } from './sorting.js';
import type { FilterableItem } from './filtering.js';
import type { LroApiQueryMeta } from './types.js';

export interface ReadOnlyApiQueryResult<T> {
  readonly data: readonly T[];
  readonly queryMeta: LroApiQueryMeta;
}

/**
 * Applies filter → sort → pagination to items using the given query.
 * Returns shaped result with data, query metadata, pagination metadata, and safety metadata.
 * Does not mutate input arrays.
 */
export function buildReadOnlyApiQueryResult<T extends FilterableItem>(
  items: readonly T[],
  query: ReadOnlyApiQuery,
): ReadOnlyApiQueryResult<T> {
  // 1. Filter
  const filtered = applyReadOnlyApiFilters(items, query);

  // 2. Sort
  const sorted = applyReadOnlyApiSorting(filtered, query);

  // 3. Pagination
  const paginationResult = buildReadOnlyApiPagination(query);
  const pagination = paginationResult.ok
    ? paginationResult.value
    : { limit: query.limit, offset: query.offset, cursor: query.cursor };

  const { data, paginationMeta } = applyReadOnlyApiPagination(sorted, pagination);

  // 4. Metadata
  const appliedFilters = buildAppliedFiltersMeta(query);
  const sort = buildAppliedSortMeta(query);

  const queryMeta: LroApiQueryMeta = {
    query: {
      limit: query.limit,
      offset: query.offset,
      cursor: query.cursor,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      severity: query.severity,
      panel: query.panel,
      sourceKind: query.sourceKind,
      classification: query.classification,
      status: query.status,
    },
    appliedFilters,
    sort,
    pagination: paginationMeta,
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    localOnly: true,
  };

  return { data, queryMeta };
}
