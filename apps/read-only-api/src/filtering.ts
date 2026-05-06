/**
 * apps/read-only-api/src/filtering.ts
 *
 * Phase 21 — Local Read-Only API safe in-memory filter helpers.
 *
 * Applies enum-safe filters to fixture-only in-memory data arrays.
 * Does not mutate input arrays.
 * No network calls, no live data, no SQL, no eval.
 *
 * Safety rules:
 *   - Only explicit, bounded enum fields are filterable.
 *   - Unknown fields are not supported and will not be evaluated.
 *   - All operations are purely in-memory and deterministic.
 */

import type { ReadOnlyApiQuery } from './query.js';

// ─── Filterable item shape ────────────────────────────────────────────────────

/**
 * Minimum shape required to apply read-only API filters.
 * All fields are optional — missing fields simply won't be matched.
 */
export interface FilterableItem {
  readonly id?: string;
  readonly severity?: string;
  readonly panel?: string;
  readonly sourceKind?: string;
  readonly classification?: string;
  readonly status?: string;
  readonly label?: string;
  readonly createdAt?: string;
}

// ─── applyReadOnlyApiFilters ──────────────────────────────────────────────────

/**
 * Applies enum-safe filters from the parsed query to an array of items.
 * Does not mutate the input array.
 * Returns a new filtered array.
 *
 * Only the following filter fields are applied:
 *   severity, panel, sourceKind, classification, status
 */
export function applyReadOnlyApiFilters<T extends FilterableItem>(
  items: readonly T[],
  query: Pick<ReadOnlyApiQuery, 'severity' | 'panel' | 'sourceKind' | 'classification' | 'status'>,
): readonly T[] {
  // Early return if no filters active
  const hasFilters =
    query.severity !== undefined ||
    query.panel !== undefined ||
    query.sourceKind !== undefined ||
    query.classification !== undefined ||
    query.status !== undefined;

  if (!hasFilters) return items;

  return items.filter(item => {
    if (query.severity !== undefined && item.severity !== query.severity) return false;
    if (query.panel !== undefined && item.panel !== query.panel) return false;
    if (query.sourceKind !== undefined && item.sourceKind !== query.sourceKind) return false;
    if (query.classification !== undefined && item.classification !== query.classification)
      return false;
    if (query.status !== undefined && item.status !== query.status) return false;
    return true;
  });
}

// ─── Applied filters metadata ─────────────────────────────────────────────────

export interface AppliedFiltersMeta {
  readonly severity: string | undefined;
  readonly panel: string | undefined;
  readonly sourceKind: string | undefined;
  readonly classification: string | undefined;
  readonly status: string | undefined;
  readonly filtersActive: boolean;
  readonly fixtureOnly: true;
}

/**
 * Builds metadata describing which filters were applied.
 */
export function buildAppliedFiltersMeta(
  query: Pick<ReadOnlyApiQuery, 'severity' | 'panel' | 'sourceKind' | 'classification' | 'status'>,
): AppliedFiltersMeta {
  const filtersActive =
    query.severity !== undefined ||
    query.panel !== undefined ||
    query.sourceKind !== undefined ||
    query.classification !== undefined ||
    query.status !== undefined;

  return {
    severity: query.severity,
    panel: query.panel,
    sourceKind: query.sourceKind,
    classification: query.classification,
    status: query.status,
    filtersActive,
    fixtureOnly: true,
  };
}
