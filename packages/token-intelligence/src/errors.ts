/**
 * Phase 8 — Token Intelligence v1: Error codes and result types.
 *
 * All errors are safe to display — no raw secrets, no stack traces,
 * no raw thrown objects, no sensitive environment values, no wallet data,
 * no RPC URLs, no API keys, no provider details.
 */

/**
 * Machine-readable error codes for the token intelligence package.
 * All codes are safe to log and display.
 */
export type TokenIntelligenceErrorCode =
  | 'INVALID_TOKEN_PROFILE'
  | 'INVALID_TOKEN_METRICS'
  | 'INVALID_TOKEN_MINT'
  | 'UNSAFE_TOKEN_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'PROVIDER_DATA_FORBIDDEN'
  | 'TOKEN_SCORE_OUT_OF_RANGE'
  | 'TOKEN_CONFIDENCE_OUT_OF_RANGE'
  | 'TOKEN_INTELLIGENCE_FIXTURE_ONLY';

/**
 * A safe error from the token intelligence package.
 * Never contains raw secrets, private keys, stack traces, RPC URLs, API keys,
 * wallet data, or sensitive details.
 */
export interface TokenIntelligenceError {
  /** Machine-readable error code — safe to display */
  readonly code: TokenIntelligenceErrorCode;
  /** Human-readable message — safe to display */
  readonly message: string;
  /** Always true — this error is safe to display in logs or Telegram */
  readonly safeToDisplay: true;
}

/** Successful token intelligence result wrapper. */
export interface TokenIntelligenceOk<T> {
  readonly ok: true;
  readonly value: T;
}

/** Failed token intelligence result wrapper. */
export interface TokenIntelligenceErr {
  readonly ok: false;
  readonly error: TokenIntelligenceError;
}

/** Result type for token intelligence operations. */
export type TiResult<T> = TokenIntelligenceOk<T> | TokenIntelligenceErr;

/** Construct a successful token intelligence result. */
export function tiOk<T>(value: T): TokenIntelligenceOk<T> {
  return { ok: true, value };
}

/** Construct a failed token intelligence result. */
export function tiErr(
  code: TokenIntelligenceErrorCode,
  message: string,
): TokenIntelligenceErr {
  return {
    ok: false,
    error: { code, message, safeToDisplay: true },
  };
}

/** Type guard: returns true if result is ok. */
export function isTiOk<T>(result: TiResult<T>): result is TokenIntelligenceOk<T> {
  return result.ok;
}

/** Type guard: returns true if result is an error. */
export function isTiErr<T>(
  result: TiResult<T>,
): result is TokenIntelligenceErr {
  return !result.ok;
}
