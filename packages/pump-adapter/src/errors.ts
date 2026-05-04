/**
 * Safe error codes and result types for Phase 6A pump adapter.
 *
 * All errors are safe to display — no raw secrets, no stack traces,
 * no raw thrown objects, no sensitive environment values.
 */

/**
 * Error codes for the pump adapter.
 * All codes are safe to log and display.
 */
export type PumpAdapterErrorCode =
  | 'ADAPTER_DISABLED'
  | 'ADAPTER_UNAVAILABLE'
  | 'UNSUPPORTED_VENUE'
  | 'INVALID_TOKEN_MINT'
  | 'INVALID_AMOUNT'
  | 'INVALID_SLIPPAGE'
  | 'QUOTE_UNAVAILABLE'
  | 'NETWORK_NOT_IMPLEMENTED'
  | 'EXECUTION_FORBIDDEN'
  | 'SIGNING_FORBIDDEN'
  | 'SENDING_FORBIDDEN'
  | 'WALLET_ACCESS_FORBIDDEN';

/**
 * A safe error result from the pump adapter.
 * Never contains raw secrets, private keys, stack traces, or sensitive details.
 */
export interface PumpAdapterError {
  /** Machine-readable error code, safe to display */
  readonly code: PumpAdapterErrorCode;
  /** Human-readable message, safe to display */
  readonly message: string;
  /** Whether this error is safe to display in Telegram or logs — always true */
  readonly safeToDisplay: true;
}

/**
 * A successful result from the pump adapter.
 */
export interface PumpAdapterOk<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * A failed result from the pump adapter.
 */
export interface PumpAdapterErr {
  readonly ok: false;
  readonly error: PumpAdapterError;
}

/**
 * A result type for pump adapter operations.
 * Adapter methods return this instead of throwing for normal errors.
 */
export type PumpAdapterResult<T> = PumpAdapterOk<T> | PumpAdapterErr;

/** Construct a successful pump adapter result. */
export function pumpOk<T>(value: T): PumpAdapterOk<T> {
  return { ok: true, value };
}

/** Construct a failed pump adapter result. */
export function pumpErr(
  code: PumpAdapterErrorCode,
  message: string,
): PumpAdapterErr {
  return {
    ok: false,
    error: { code, message, safeToDisplay: true },
  };
}

/** Type guard: returns true if result is ok. */
export function isPumpOk<T>(
  result: PumpAdapterResult<T>,
): result is PumpAdapterOk<T> {
  return result.ok;
}

/** Type guard: returns true if result is an error. */
export function isPumpErr<T>(
  result: PumpAdapterResult<T>,
): result is PumpAdapterErr {
  return !result.ok;
}
