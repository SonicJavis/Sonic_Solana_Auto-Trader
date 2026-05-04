/**
 * Phase 6B: Validation helpers for instruction builder requests.
 *
 * All validation is local — no Solana library, no network call, no RPC query.
 * Checks cover: executable-instructions flag, quote presence/success,
 * venue support, numeric amounts, and slippage bounds.
 */

import type { Phase6BErrorCode, Phase6BErrorResult, PumpInstructionBuilderRequest } from './builder-types.js';
import type { PumpQuoteResult } from './quote-types.js';

/** Venue values accepted for intent building in Phase 6B. */
const SUPPORTED_VENUES = new Set<string>(['pump_curve', 'pumpswap']);

/** Maximum allowed slippage in basis points. */
const MAX_SLIPPAGE_BPS = 10_000;

/** Construct a safe Phase 6B error result (safeToDisplay is always true). */
export function phase6bError(
  code: Phase6BErrorCode,
  message: string,
): Phase6BErrorResult {
  return { code, message, safeToDisplay: true };
}

/**
 * Validate that allowExecutableInstructions is false.
 *
 * The TypeScript type already enforces the literal `false`, but this guard
 * provides an additional runtime safety net against unsafe callers.
 */
export function validateAllowExecutableInstructions(
  request: PumpInstructionBuilderRequest,
): Phase6BErrorResult | null {
  if ((request.allowExecutableInstructions as unknown) !== false) {
    return phase6bError(
      'EXECUTABLE_INSTRUCTIONS_FORBIDDEN',
      'allowExecutableInstructions must be false — executable instructions are forbidden in Phase 6B',
    );
  }
  return null;
}

/**
 * Validate that the quote field is a successful PumpAdapterOk<PumpQuoteResult>.
 *
 * Returns the inner PumpQuoteResult on success, or a Phase6BErrorResult on failure.
 */
export function validateBuilderQuote(
  quote: unknown,
): { quoteResult: PumpQuoteResult } | { error: Phase6BErrorResult } {
  if (quote === null || quote === undefined) {
    return { error: phase6bError('QUOTE_REQUIRED', 'A quote result is required to build an intent') };
  }

  const q = quote as Record<string, unknown>;

  if (q['ok'] !== true) {
    return {
      error: phase6bError(
        'UNSAFE_QUOTE_RESULT',
        'Quote result is not successful — cannot build an intent from a failed or missing quote',
      ),
    };
  }

  const value = q['value'];
  if (value === null || value === undefined || typeof value !== 'object') {
    return { error: phase6bError('QUOTE_REQUIRED', 'Quote result value is missing or invalid') };
  }

  return { quoteResult: value as PumpQuoteResult };
}

/**
 * Validate that the quote's venue is supported for intent building.
 */
export function validateBuilderVenue(venue: unknown): Phase6BErrorResult | null {
  if (typeof venue !== 'string' || !SUPPORTED_VENUES.has(venue)) {
    return phase6bError(
      'UNSUPPORTED_VENUE',
      `Venue "${String(venue)}" is not supported for instruction intent building in Phase 6B`,
    );
  }
  return null;
}

/**
 * Validate that a numeric amount is a positive finite number.
 *
 * Accepts either a number or a numeric string (as PumpQuoteResult.inputAmount
 * and .estimatedOutputAmount are strings in Phase 6A).
 */
export function validateNumericAmount(
  amount: unknown,
  fieldName: string,
): Phase6BErrorResult | null {
  const parsed = typeof amount === 'string' ? Number(amount) : amount;
  if (typeof parsed !== 'number' || !Number.isFinite(parsed) || parsed <= 0) {
    return phase6bError(
      'QUOTE_REQUIRED',
      `${fieldName} must be a positive finite number`,
    );
  }
  return null;
}

/**
 * Validate slippage in basis points (integer, 0–10 000).
 */
export function validateBuilderSlippage(slippageBps: unknown): Phase6BErrorResult | null {
  if (
    typeof slippageBps !== 'number' ||
    !Number.isInteger(slippageBps) ||
    slippageBps < 0 ||
    slippageBps > MAX_SLIPPAGE_BPS
  ) {
    return phase6bError(
      'QUOTE_REQUIRED',
      `maxSlippageBps must be an integer between 0 and ${MAX_SLIPPAGE_BPS}`,
    );
  }
  return null;
}

/**
 * Run all builder request validations in sequence.
 *
 * Returns the first error encountered, or returns the extracted PumpQuoteResult
 * when all validations pass.
 */
export function validateBuilderRequest(
  request: PumpInstructionBuilderRequest,
):
  | { error: Phase6BErrorResult; quoteResult?: never }
  | { error?: never; quoteResult: PumpQuoteResult } {
  const execError = validateAllowExecutableInstructions(request);
  if (execError) return { error: execError };

  const quoteValidation = validateBuilderQuote(request.quote);
  if ('error' in quoteValidation) return { error: quoteValidation.error };

  const { quoteResult } = quoteValidation;

  const venueError = validateBuilderVenue(quoteResult.venue);
  if (venueError) return { error: venueError };

  const inputError = validateNumericAmount(quoteResult.inputAmount, 'inputAmount');
  if (inputError) return { error: inputError };

  const outputError = validateNumericAmount(quoteResult.estimatedOutputAmount, 'estimatedOutputAmount');
  if (outputError) return { error: outputError };

  const slippageError = validateBuilderSlippage(quoteResult.slippageBps);
  if (slippageError) return { error: slippageError };

  return { quoteResult };
}
