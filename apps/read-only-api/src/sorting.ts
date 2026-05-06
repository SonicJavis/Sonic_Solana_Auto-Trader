/**
 * apps/read-only-api/src/sorting.ts
 *
 * Phase 21 — Local Read-Only API safe in-memory sort helpers.
 *
 * Sorts fixture-only in-memory data arrays by explicit, bounded sort fields.
 * Does not mutate input arrays.
 * No network calls, no live data, no SQL, no eval.
 *
 * Safety rules:
 *   - Only explicit allow-listed sort fields are accepted.
 *   - Arbitrary field paths are rejected at parse time.
 *   - Sorting is always deterministic (stable secondary sort by id).
 *   - Does not mutate input arrays.
 */

import type { ReadOnlyApiQuery, AllowedSortField, AllowedSortDirection } from './query.js';
import type { FilterableItem } from './filtering.js';

// ─── applyReadOnlyApiSorting ──────────────────────────────────────────────────

/**
 * Sorts an array of items by the specified sort field and direction.
 * Does not mutate the input array.
 * Sorting is deterministic — a stable secondary sort by 'id' is always applied.
 *
 * Only allowed sort fields (from ALLOWED_SORT_FIELDS) are accepted.
 * Arbitrary field paths are never used.
 */
export function applyReadOnlyApiSorting<T extends FilterableItem>(
  items: readonly T[],
  query: Pick<ReadOnlyApiQuery, 'sortBy' | 'sortDirection'>,
): readonly T[] {
  const { sortBy, sortDirection } = query;

  // Build a shallow copy — do not mutate the original
  const copy = [...items];

  copy.sort((a, b) => {
    const primary = compareField(a, b, sortBy, sortDirection);
    if (primary !== 0) return primary;
    // Stable secondary sort by id
    return compareField(a, b, 'id', 'asc');
  });

  return copy;
}

// ─── Field comparator ─────────────────────────────────────────────────────────

function compareField<T extends FilterableItem>(
  a: T,
  b: T,
  field: AllowedSortField,
  direction: AllowedSortDirection,
): number {
  const av = getFieldValue(a, field);
  const bv = getFieldValue(b, field);

  let cmp: number;

  if (av === undefined && bv === undefined) {
    cmp = 0;
  } else if (av === undefined) {
    cmp = 1; // undefined goes last
  } else if (bv === undefined) {
    cmp = -1;
  } else {
    cmp = String(av).localeCompare(String(bv), 'en', { sensitivity: 'base' });
  }

  return direction === 'desc' ? -cmp : cmp;
}

function getFieldValue(item: FilterableItem, field: AllowedSortField): string | undefined {
  switch (field) {
    case 'id':
      return item.id;
    case 'severity':
      return item.severity;
    case 'sourceKind':
      return item.sourceKind;
    case 'classification':
      return item.classification;
    case 'createdAt':
      return item.createdAt;
    case 'label':
      return item.label;
    case 'status':
      return item.status;
    case 'panel':
      return item.panel;
    default: {
      // Exhaustive check — should never reach here if ALLOWED_SORT_FIELDS is correct
      const _never: never = field;
      void _never;
      return undefined;
    }
  }
}

// ─── Sort metadata ────────────────────────────────────────────────────────────

export interface AppliedSortMeta {
  readonly sortBy: AllowedSortField;
  readonly sortDirection: AllowedSortDirection;
  readonly fixtureOnly: true;
}

/**
 * Builds metadata describing the applied sort.
 */
export function buildAppliedSortMeta(
  query: Pick<ReadOnlyApiQuery, 'sortBy' | 'sortDirection'>,
): AppliedSortMeta {
  return {
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
    fixtureOnly: true,
  };
}
