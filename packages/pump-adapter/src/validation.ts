/**
 * Input validation helpers for Phase 6A pump adapter.
 *
 * These helpers validate request shapes locally — no Solana library,
 * no network call, no RPC query.
 *
 * Validation is structural only: mint format, amount positivity,
 * slippage bounds, and timestamp safety.
 */

import type { PumpAdapterResult } from './errors.js';
import { pumpOk, pumpErr } from './errors.js';
import type { PumpQuoteRequest } from './quote-types.js';

/**
 * Minimum length for a base58-encoded Solana token mint address.
 * Solana public keys are 32 bytes; base58-encoded they are 32–44 chars.
 */
const MIN_MINT_LENGTH = 32;
const MAX_MINT_LENGTH = 44;

/**
 * Base58 character set used for structural token mint validation.
 * Does not require any Solana library.
 */
const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;

/**
 * Maximum allowed slippage in basis points (100% = 10_000 bps).
 */
const MAX_SLIPPAGE_BPS = 10_000;

/**
 * Validate a token mint address structurally.
 *
 * Checks:
 * - Non-empty string
 * - Length within 32–44 characters
 * - Only base58 characters (no Solana library required)
 *
 * Does NOT verify the mint exists on-chain (no RPC in Phase 6A).
 */
export function validateTokenMint(
  tokenMint: unknown,
): PumpAdapterResult<string> {
  if (typeof tokenMint !== 'string' || tokenMint.length === 0) {
    return pumpErr('INVALID_TOKEN_MINT', 'Token mint must be a non-empty string');
  }
  if (tokenMint.length < MIN_MINT_LENGTH || tokenMint.length > MAX_MINT_LENGTH) {
    return pumpErr(
      'INVALID_TOKEN_MINT',
      `Token mint length must be between ${MIN_MINT_LENGTH} and ${MAX_MINT_LENGTH} characters`,
    );
  }
  if (!BASE58_REGEX.test(tokenMint)) {
    return pumpErr(
      'INVALID_TOKEN_MINT',
      'Token mint contains invalid characters (expected base58)',
    );
  }
  return pumpOk(tokenMint);
}

/**
 * Validate an input amount string.
 *
 * Checks:
 * - Non-empty string
 * - Parseable as a positive finite number
 * - Not zero
 */
export function validateInputAmount(
  inputAmount: unknown,
): PumpAdapterResult<string> {
  if (typeof inputAmount !== 'string' || inputAmount.length === 0) {
    return pumpErr('INVALID_AMOUNT', 'Input amount must be a non-empty string');
  }
  const parsed = Number(inputAmount);
  if (!Number.isFinite(parsed)) {
    return pumpErr('INVALID_AMOUNT', 'Input amount must be a finite number');
  }
  if (parsed <= 0) {
    return pumpErr('INVALID_AMOUNT', 'Input amount must be positive');
  }
  return pumpOk(inputAmount);
}

/**
 * Validate slippage in basis points.
 *
 * Checks:
 * - Is a safe integer
 * - Is between 0 and 10_000 (inclusive)
 */
export function validateSlippageBps(
  slippageBps: unknown,
): PumpAdapterResult<number> {
  if (typeof slippageBps !== 'number' || !Number.isInteger(slippageBps)) {
    return pumpErr('INVALID_SLIPPAGE', 'Slippage must be an integer number of basis points');
  }
  if (slippageBps < 0 || slippageBps > MAX_SLIPPAGE_BPS) {
    return pumpErr(
      'INVALID_SLIPPAGE',
      `Slippage must be between 0 and ${MAX_SLIPPAGE_BPS} basis points`,
    );
  }
  return pumpOk(slippageBps);
}

/**
 * Validate a requestedAt ISO 8601 timestamp string.
 *
 * Checks:
 * - Is a string
 * - Is parseable as a valid Date
 * - Is not in the future by more than 60 seconds (clock drift tolerance)
 */
export function validateRequestedAt(
  requestedAt: unknown,
): PumpAdapterResult<string> {
  if (typeof requestedAt !== 'string' || requestedAt.length === 0) {
    return pumpErr('QUOTE_UNAVAILABLE', 'requestedAt must be a non-empty ISO 8601 string');
  }
  const date = new Date(requestedAt);
  if (isNaN(date.getTime())) {
    return pumpErr('QUOTE_UNAVAILABLE', 'requestedAt is not a valid ISO 8601 timestamp');
  }
  const skewMs = date.getTime() - Date.now();
  if (skewMs > 60_000) {
    return pumpErr('QUOTE_UNAVAILABLE', 'requestedAt is too far in the future');
  }
  return pumpOk(requestedAt);
}

/**
 * Validate a full quote request shape.
 *
 * Runs all field validators in order and returns the first error encountered.
 * Returns the validated request on success.
 */
export function validateQuoteRequest(
  request: PumpQuoteRequest,
): PumpAdapterResult<PumpQuoteRequest> {
  const mintResult = validateTokenMint(request.tokenMint);
  if (!mintResult.ok) return mintResult;

  const amountResult = validateInputAmount(request.inputAmount);
  if (!amountResult.ok) return amountResult;

  const slippageResult = validateSlippageBps(request.maxSlippageBps);
  if (!slippageResult.ok) return slippageResult;

  const timestampResult = validateRequestedAt(request.requestedAt);
  if (!timestampResult.ok) return timestampResult;

  return pumpOk(request);
}
