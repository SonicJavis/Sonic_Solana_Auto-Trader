/**
 * Phase 9 — Creator Intelligence v1: Error codes and result types.
 *
 * All errors are safe to display — no raw secrets, no stack traces,
 * no raw thrown objects, no sensitive environment values, no wallet data,
 * no RPC URLs, no API keys, no provider details.
 */

/**
 * Machine-readable error codes for the creator intelligence package.
 * All codes are safe to log and display.
 */
export type CreatorIntelligenceErrorCode =
  | 'INVALID_CREATOR_PROFILE'
  | 'INVALID_CREATOR_HISTORY'
  | 'INVALID_CREATOR_ID'
  | 'INVALID_CREATOR_ADDRESS'
  | 'UNSAFE_CREATOR_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'PROVIDER_DATA_FORBIDDEN'
  | 'WALLET_DATA_FORBIDDEN'
  | 'CREATOR_SCORE_OUT_OF_RANGE'
  | 'CREATOR_CONFIDENCE_OUT_OF_RANGE'
  | 'CREATOR_INTELLIGENCE_FIXTURE_ONLY';

/**
 * A safe error from the creator intelligence package.
 * Never contains raw secrets, private keys, stack traces, RPC URLs, API keys,
 * wallet data, or sensitive details.
 */
export interface CreatorIntelligenceError {
  /** Machine-readable error code — safe to display */
  readonly code: CreatorIntelligenceErrorCode;
  /** Human-readable message — safe to display */
  readonly message: string;
  /** Always true — this error is safe to display in logs or Telegram */
  readonly safeToDisplay: true;
}

/** Successful creator intelligence result wrapper. */
export interface CreatorIntelligenceOk<T> {
  readonly ok: true;
  readonly value: T;
}

/** Failed creator intelligence result wrapper. */
export interface CreatorIntelligenceErr {
  readonly ok: false;
  readonly error: CreatorIntelligenceError;
}

/** Result type for creator intelligence operations. */
export type CiResult<T> = CreatorIntelligenceOk<T> | CreatorIntelligenceErr;

/** Construct a successful creator intelligence result. */
export function ciOk<T>(value: T): CreatorIntelligenceOk<T> {
  return { ok: true, value };
}

/** Construct a failed creator intelligence result. */
export function ciErr(
  code: CreatorIntelligenceErrorCode,
  message: string,
): CreatorIntelligenceErr {
  return {
    ok: false,
    error: { code, message, safeToDisplay: true },
  };
}

/** Type guard: returns true if result is ok. */
export function isCiOk<T>(result: CiResult<T>): result is CreatorIntelligenceOk<T> {
  return result.ok;
}

/** Type guard: returns true if result is an error. */
export function isCiErr<T>(result: CiResult<T>): result is CreatorIntelligenceErr {
  return !result.ok;
}
