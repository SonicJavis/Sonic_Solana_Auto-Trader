/**
 * apps/read-only-api/src/errors.ts
 *
 * Phase 20 — Safe result/error helpers for the Local Read-Only API shell.
 * Never throws for normal validation failures.
 */

import type { LocalReadOnlyApiErrorCode } from './types.js';

export interface LocalReadOnlyApiError {
  readonly ok: false;
  readonly code: LocalReadOnlyApiErrorCode;
  readonly message: string;
}

export type LroApiResult<T> = { readonly ok: true; readonly value: T } | LocalReadOnlyApiError;

export function lroApiOk<T>(value: T): LroApiResult<T> {
  return { ok: true, value };
}

export function lroApiErr(
  code: LocalReadOnlyApiErrorCode,
  message: string,
): LocalReadOnlyApiError {
  return { ok: false, code, message };
}
