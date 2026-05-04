/**
 * Phase 7A — Event engine safe error codes and result types.
 *
 * All errors are safe to display — no raw secrets, no stack traces,
 * no raw thrown objects, no sensitive environment values.
 */

/**
 * Machine-readable error codes for the event engine.
 * All codes are safe to log and display.
 */
export type EventEngineErrorCode =
  | 'INVALID_EVENT_ID'
  | 'INVALID_EVENT_CATEGORY'
  | 'INVALID_EVENT_TYPE'
  | 'INVALID_EVENT_SOURCE'
  | 'INVALID_EVENT_SEVERITY'
  | 'INVALID_EVENT_TIMESTAMP'
  | 'UNSAFE_EVENT_PAYLOAD'
  | 'EVENT_PAYLOAD_TOO_LARGE'
  | 'EVENT_HISTORY_LIMIT_EXCEEDED'
  | 'EVENT_HANDLER_FAILED'
  | 'NETWORK_EVENTS_FORBIDDEN'
  | 'LIVE_PROVIDER_FORBIDDEN'
  | 'EXECUTION_TRIGGER_FORBIDDEN'
  | 'INVALID_DEDUPE_KEY'
  | 'INVALID_TTL'
  | 'INVALID_SUBSCRIPTION_ID'
  | 'INVALID_LIMIT'
  // Phase 7C — mock provider and fixture replay error codes
  | 'INVALID_FIXTURE_ID'
  | 'INVALID_FIXTURE_SEQUENCE'
  | 'INVALID_FIXTURE_EVENT'
  | 'FIXTURE_SEQUENCE_TOO_LARGE'
  | 'INVALID_REPLAY_OFFSET'
  | 'MOCK_PROVIDER_DISABLED'
  | 'MOCK_PROVIDER_NOT_LOADED'
  | 'MOCK_REPLAY_FAILED'
  | 'LIVE_EVENT_FORBIDDEN'
  | 'NETWORK_REPLAY_FORBIDDEN'
  | 'UNSAFE_FIXTURE_PAYLOAD';

/**
 * A safe error from the event engine.
 * Never contains raw secrets, private keys, stack traces, or sensitive details.
 */
export interface EventEngineError {
  /** Machine-readable error code — safe to display */
  readonly code: EventEngineErrorCode;
  /** Human-readable message — safe to display */
  readonly message: string;
  /** Always true — this error is safe to display in logs or Telegram */
  readonly safeToDisplay: true;
}

/**
 * A successful event engine result.
 */
export interface EventEngineOk<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * A failed event engine result.
 */
export interface EventEngineErr {
  readonly ok: false;
  readonly error: EventEngineError;
}

/**
 * Result type for event engine operations.
 * Methods return this instead of throwing for expected error conditions.
 */
export type EventEngineResult<T> = EventEngineOk<T> | EventEngineErr;

/** Construct a successful event engine result. */
export function engineOk<T>(value: T): EventEngineOk<T> {
  return { ok: true, value };
}

/** Construct a failed event engine result. */
export function engineErr(
  code: EventEngineErrorCode,
  message: string,
): EventEngineErr {
  return {
    ok: false,
    error: { code, message, safeToDisplay: true },
  };
}

/** Type guard: returns true if result is ok. */
export function isEngineOk<T>(result: EventEngineResult<T>): result is EventEngineOk<T> {
  return result.ok;
}

/** Type guard: returns true if result is an error. */
export function isEngineErr<T>(result: EventEngineResult<T>): result is EventEngineErr {
  return !result.ok;
}
