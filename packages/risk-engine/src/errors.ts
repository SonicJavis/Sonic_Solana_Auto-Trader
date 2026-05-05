/**
 * Phase 12 — Risk Engine v1: Error codes and result types.
 *
 * All errors are safe to display — no raw secrets, no stack traces,
 * no raw thrown objects, no sensitive environment values, no wallet data,
 * no RPC URLs, no API keys, no provider details, no private keys.
 */

export type RiskEngineErrorCode =
  | 'INVALID_RISK_INPUT'
  | 'INVALID_RISK_POLICY'
  | 'INVALID_RISK_SCORE'
  | 'INVALID_RISK_CONFIDENCE'
  | 'UNSAFE_RISK_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'PROVIDER_DATA_FORBIDDEN'
  | 'PRIVATE_KEY_ACCESS_FORBIDDEN'
  | 'TRADE_INTENTS_FORBIDDEN'
  | 'EXECUTION_FORBIDDEN'
  | 'ENFORCEMENT_FORBIDDEN'
  | 'RISK_ENGINE_FIXTURE_ONLY';

export interface RiskEngineError {
  readonly code: RiskEngineErrorCode;
  readonly message: string;
  readonly safeToDisplay: true;
}

export interface RiskEngineOk<T> {
  readonly ok: true;
  readonly value: T;
}

export interface RiskEngineErr {
  readonly ok: false;
  readonly error: RiskEngineError;
}

export type ReResult<T> = RiskEngineOk<T> | RiskEngineErr;

export function reOk<T>(value: T): RiskEngineOk<T> {
  return { ok: true, value };
}

export function reErr(code: RiskEngineErrorCode, message: string): RiskEngineErr {
  return { ok: false, error: { code, message, safeToDisplay: true } };
}

export function isReOk<T>(result: ReResult<T>): result is RiskEngineOk<T> {
  return result.ok;
}

export function isReErr<T>(result: ReResult<T>): result is RiskEngineErr {
  return !result.ok;
}
