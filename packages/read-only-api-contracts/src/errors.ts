/**
 * packages/read-only-api-contracts/src/errors.ts
 *
 * Safe result/error helpers for read-only-api-contracts.
 */

import type { ReadOnlyApiContractErrorCode } from './types.js';

export interface ReadOnlyApiContractError {
  readonly ok: false;
  readonly code: ReadOnlyApiContractErrorCode;
  readonly message: string;
}

export type RoacResult<T> = { readonly ok: true; readonly value: T } | ReadOnlyApiContractError;

export function roacOk<T>(value: T): RoacResult<T> {
  return { ok: true, value };
}

export function roacErr(
  code: ReadOnlyApiContractErrorCode,
  message: string,
): ReadOnlyApiContractError {
  return { ok: false, code, message };
}
