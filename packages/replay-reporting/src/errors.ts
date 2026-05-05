/**
 * packages/replay-reporting/src/errors.ts
 *
 * Safe result/error helpers for replay-reporting.
 */

import type { ReplayReportingErrorCode } from './types.js';

export interface ReplayReportingError {
  readonly ok: false;
  readonly code: ReplayReportingErrorCode;
  readonly message: string;
}

export type RrResult<T> = { readonly ok: true; readonly value: T } | ReplayReportingError;

export function rrOk<T>(value: T): RrResult<T> {
  return { ok: true, value };
}

export function rrErr(code: ReplayReportingErrorCode, message: string): ReplayReportingError {
  return { ok: false, code, message };
}
