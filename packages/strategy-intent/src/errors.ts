/**
 * packages/strategy-intent/src/errors.ts
 *
 * Safe result/error helpers for strategy-intent.
 */

import type { StrategyIntentErrorCode } from './types.js';

export interface StrategyIntentError {
  readonly ok: false;
  readonly code: StrategyIntentErrorCode;
  readonly message: string;
}

export type SiResult<T> = { readonly ok: true; readonly value: T } | StrategyIntentError;

export function siOk<T>(value: T): SiResult<T> {
  return { ok: true, value };
}

export function siErr(code: StrategyIntentErrorCode, message: string): StrategyIntentError {
  return { ok: false, code, message };
}
