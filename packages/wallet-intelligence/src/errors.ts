/**
 * Phase 10 — Wallet Cluster Intelligence v1: Error codes and result types.
 *
 * All errors are safe to display — no raw secrets, no stack traces,
 * no raw thrown objects, no sensitive environment values, no wallet data,
 * no RPC URLs, no API keys, no provider details, no private keys.
 */

/**
 * Machine-readable error codes for the wallet intelligence package.
 * All codes are safe to log and display.
 */
export type WalletIntelligenceErrorCode =
  | 'INVALID_WALLET_PROFILE'
  | 'INVALID_WALLET_CLUSTER'
  | 'INVALID_WALLET_ID'
  | 'INVALID_WALLET_ADDRESS'
  | 'INVALID_CLUSTER_ID'
  | 'INVALID_CLUSTER_TYPE'
  | 'UNSAFE_WALLET_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'PROVIDER_DATA_FORBIDDEN'
  | 'PRIVATE_KEY_ACCESS_FORBIDDEN'
  | 'WALLET_SCORE_OUT_OF_RANGE'
  | 'WALLET_CONFIDENCE_OUT_OF_RANGE'
  | 'WALLET_INTELLIGENCE_FIXTURE_ONLY';

/**
 * A safe error from the wallet intelligence package.
 * Never contains raw secrets, private keys, stack traces, RPC URLs, API keys,
 * wallet data, or sensitive details.
 */
export interface WalletIntelligenceError {
  /** Machine-readable error code — safe to display */
  readonly code: WalletIntelligenceErrorCode;
  /** Human-readable message — safe to display */
  readonly message: string;
  /** Always true — this error is safe to display in logs or Telegram */
  readonly safeToDisplay: true;
}

/** Successful wallet intelligence result wrapper. */
export interface WalletIntelligenceOk<T> {
  readonly ok: true;
  readonly value: T;
}

/** Failed wallet intelligence result wrapper. */
export interface WalletIntelligenceErr {
  readonly ok: false;
  readonly error: WalletIntelligenceError;
}

/** Result type for wallet intelligence operations. */
export type WiResult<T> = WalletIntelligenceOk<T> | WalletIntelligenceErr;

/** Construct a successful wallet intelligence result. */
export function wiOk<T>(value: T): WalletIntelligenceOk<T> {
  return { ok: true, value };
}

/** Construct a failed wallet intelligence result. */
export function wiErr(
  code: WalletIntelligenceErrorCode,
  message: string,
): WalletIntelligenceErr {
  return {
    ok: false,
    error: { code, message, safeToDisplay: true },
  };
}

/** Type guard: returns true if result is ok. */
export function isWiOk<T>(result: WiResult<T>): result is WalletIntelligenceOk<T> {
  return result.ok;
}

/** Type guard: returns true if result is an error. */
export function isWiErr<T>(result: WiResult<T>): result is WalletIntelligenceErr {
  return !result.ok;
}
