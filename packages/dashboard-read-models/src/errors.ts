/**
 * packages/dashboard-read-models/src/errors.ts
 *
 * Safe result/error helpers for dashboard-read-models.
 */

import type { DashboardReadModelErrorCode } from './types.js';

export interface DashboardReadModelError {
  readonly ok: false;
  readonly code: DashboardReadModelErrorCode;
  readonly message: string;
}

export type DrmResult<T> = { readonly ok: true; readonly value: T } | DashboardReadModelError;

export function drmOk<T>(value: T): DrmResult<T> {
  return { ok: true, value };
}

export function drmErr(code: DashboardReadModelErrorCode, message: string): DashboardReadModelError {
  return { ok: false, code, message };
}
