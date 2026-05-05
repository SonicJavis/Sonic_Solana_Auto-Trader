/**
 * Phase 11 — Bundle / Manipulation Detector v1: Error codes and result types.
 *
 * All errors are safe to display — no raw secrets, no stack traces,
 * no raw thrown objects, no sensitive environment values, no wallet data,
 * no RPC URLs, no API keys, no provider details, no private keys.
 */

/**
 * Machine-readable error codes for the manipulation detector package.
 * All codes are safe to log and display.
 */
export type ManipulationDetectorErrorCode =
  | 'INVALID_BUNDLE_SIGNAL'
  | 'INVALID_MANIPULATION_PATTERN'
  | 'INVALID_COORDINATED_ACTIVITY'
  | 'INVALID_SIGNAL_ID'
  | 'INVALID_PATTERN_ID'
  | 'INVALID_TOKEN_MINT'
  | 'UNSAFE_MANIPULATION_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'PROVIDER_DATA_FORBIDDEN'
  | 'PRIVATE_KEY_ACCESS_FORBIDDEN'
  | 'MANIPULATION_SCORE_OUT_OF_RANGE'
  | 'MANIPULATION_CONFIDENCE_OUT_OF_RANGE'
  | 'MANIPULATION_DETECTOR_FIXTURE_ONLY';

/**
 * A safe error from the manipulation detector package.
 * Never contains raw secrets, private keys, stack traces, RPC URLs, API keys,
 * wallet data, or sensitive details.
 */
export interface ManipulationDetectorError {
  /** Machine-readable error code — safe to display */
  readonly code: ManipulationDetectorErrorCode;
  /** Human-readable message — safe to display */
  readonly message: string;
  /** Always true — this error is safe to display in logs or Telegram */
  readonly safeToDisplay: true;
}

/** Successful manipulation detector result wrapper. */
export interface ManipulationDetectorOk<T> {
  readonly ok: true;
  readonly value: T;
}

/** Failed manipulation detector result wrapper. */
export interface ManipulationDetectorErr {
  readonly ok: false;
  readonly error: ManipulationDetectorError;
}

/** Result type for manipulation detector operations. */
export type MdResult<T> = ManipulationDetectorOk<T> | ManipulationDetectorErr;

/** Construct a successful manipulation detector result. */
export function mdOk<T>(value: T): ManipulationDetectorOk<T> {
  return { ok: true, value };
}

/** Construct a failed manipulation detector result. */
export function mdErr(
  code: ManipulationDetectorErrorCode,
  message: string,
): ManipulationDetectorErr {
  return {
    ok: false,
    error: { code, message, safeToDisplay: true },
  };
}

/** Type guard: returns true if result is ok. */
export function isMdOk<T>(result: MdResult<T>): result is ManipulationDetectorOk<T> {
  return result.ok;
}

/** Type guard: returns true if result is an error. */
export function isMdErr<T>(result: MdResult<T>): result is ManipulationDetectorErr {
  return !result.ok;
}
