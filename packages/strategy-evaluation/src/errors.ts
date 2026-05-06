/**
 * packages/strategy-evaluation/src/errors.ts
 *
 * Safe result/error helpers for strategy-evaluation.
 */

import type { StrategyEvaluationErrorCode } from './types.js';

export interface StrategyEvaluationError {
  readonly ok: false;
  readonly code: StrategyEvaluationErrorCode;
  readonly message: string;
}

export type SeResult<T> = { readonly ok: true; readonly value: T } | StrategyEvaluationError;

export function seOk<T>(value: T): SeResult<T> {
  return { ok: true, value };
}

export function seErr(code: StrategyEvaluationErrorCode, message: string): StrategyEvaluationError {
  return { ok: false, code, message };
}
