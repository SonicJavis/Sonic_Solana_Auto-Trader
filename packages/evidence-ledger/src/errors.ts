/**
 * packages/evidence-ledger/src/errors.ts
 *
 * Safe result/error helpers for evidence-ledger.
 */

import type { EvidenceLedgerErrorCode } from './types.js';

export interface EvidenceLedgerError {
  readonly ok: false;
  readonly code: EvidenceLedgerErrorCode;
  readonly message: string;
}

export type ElResult<T> = { readonly ok: true; readonly value: T } | EvidenceLedgerError;

export function elOk<T>(value: T): ElResult<T> {
  return { ok: true, value };
}

export function elErr(code: EvidenceLedgerErrorCode, message: string): EvidenceLedgerError {
  return { ok: false, code, message };
}
