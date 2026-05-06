/**
 * apps/read-only-api/src/pagination.ts
 *
 * Phase 21 — Local Read-Only API safe pagination helpers.
 *
 * Validates limit/offset/cursor, enforces max/default limits, and applies
 * deterministic in-memory slice operations on fixture-only data.
 *
 * Safety rules:
 *   - Max limit: 100.  Default limit: 25.
 *   - Negative values, NaN, Infinity, and huge values are rejected.
 *   - Cursor values are opaque encoded offsets — no external lookups.
 *   - Does not mutate input arrays.
 *   - No network calls, no live data, no database queries.
 */

import { lroApiOk, lroApiErr } from './errors.js';
import type { LroApiResult } from './errors.js';
import type { ReadOnlyApiQuery } from './query.js';
import { DEFAULT_LIMIT, MAX_LIMIT } from './query.js';

// ─── Pagination model ─────────────────────────────────────────────────────────

export interface ReadOnlyApiPagination {
  readonly limit: number;
  readonly offset: number;
  readonly cursor: string | undefined;
}

export interface ReadOnlyApiPaginationMeta {
  readonly limit: number;
  readonly offset: number;
  readonly totalCount: number;
  readonly resultCount: number;
  readonly hasMore: boolean;
  readonly nextCursor: string | undefined;
  readonly fixtureOnly: true;
}

// ─── buildReadOnlyApiPagination ───────────────────────────────────────────────

/**
 * Validates and normalises limit/offset/cursor into a ReadOnlyApiPagination.
 * Enforces bounded maximum limit (100) and default limit (25).
 * Rejects negative values, NaN, Infinity, huge values, and unsafe cursors.
 */
export function buildReadOnlyApiPagination(
  input: Partial<ReadOnlyApiQuery>,
): LroApiResult<ReadOnlyApiPagination> {
  let limit = input.limit ?? DEFAULT_LIMIT;

  // Clamp and validate limit
  if (!Number.isFinite(limit) || limit < 0) {
    return lroApiErr('INVALID_LRO_API_INPUT', 'limit must be a non-negative finite number');
  }
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = input.offset ?? 0;
  if (!Number.isFinite(offset) || offset < 0) {
    return lroApiErr('INVALID_LRO_API_INPUT', 'offset must be a non-negative finite number');
  }

  // Cursor validation — decode as base64-encoded numeric offset
  let cursor: string | undefined;
  if (input.cursor !== undefined) {
    const decoded = decodeCursor(input.cursor);
    if (decoded === null) {
      return lroApiErr('INVALID_LRO_API_INPUT', 'cursor is invalid or unsafe');
    }
    cursor = input.cursor;
  }

  return lroApiOk({ limit, offset, cursor });
}

// ─── Cursor encoding/decoding ─────────────────────────────────────────────────

/**
 * Encodes a numeric offset as a safe opaque cursor string.
 * Format: base64url of "offset:<n>"
 */
export function encodeCursor(offset: number): string {
  return Buffer.from(`offset:${offset}`, 'utf8').toString('base64url');
}

/**
 * Decodes a cursor back to a numeric offset.
 * Returns null if the cursor is invalid/unsafe.
 */
export function decodeCursor(cursor: string): number | null {
  if (!cursor || cursor.length > 256) return null;
  // Only allow base64url characters
  if (!/^[A-Za-z0-9_-]+=*$/.test(cursor)) return null;
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    if (!decoded.startsWith('offset:')) return null;
    const n = parseInt(decoded.slice(7), 10);
    if (!Number.isFinite(n) || n < 0 || n > 1_000_000) return null;
    return n;
  } catch {
    return null;
  }
}

// ─── applyReadOnlyApiPagination ───────────────────────────────────────────────

/**
 * Applies safe limit/offset/cursor shaping to an array of items.
 * Does not mutate the input array.
 * Returns sliced data and pagination metadata.
 *
 * If cursor is provided, it overrides offset.
 */
export function applyReadOnlyApiPagination<T>(
  items: readonly T[],
  pagination: ReadOnlyApiPagination,
): { readonly data: readonly T[]; readonly paginationMeta: ReadOnlyApiPaginationMeta } {
  const totalCount = items.length;

  // Cursor overrides offset if present
  let effectiveOffset = pagination.offset;
  if (pagination.cursor !== undefined) {
    const decoded = decodeCursor(pagination.cursor);
    if (decoded !== null) effectiveOffset = decoded;
  }

  const safeOffset = Math.min(effectiveOffset, totalCount);
  const data = items.slice(safeOffset, safeOffset + pagination.limit);
  const resultCount = data.length;
  const nextOffset = safeOffset + pagination.limit;
  const hasMore = nextOffset < totalCount;
  const nextCursor = hasMore ? encodeCursor(nextOffset) : undefined;

  return {
    data,
    paginationMeta: {
      limit: pagination.limit,
      offset: safeOffset,
      totalCount,
      resultCount,
      hasMore,
      nextCursor,
      fixtureOnly: true,
    },
  };
}
