/**
 * Quote request and result types for Phase 6A pump adapter.
 *
 * These are pure data models only — no Solana RPC, no network calls,
 * no transaction building, no signing, no sending.
 *
 * All result fields use estimated/mock language, never executed/filled.
 */

import type { PumpVenueType } from './venue-types.js';

/**
 * Whether a quote is for a buy or sell operation.
 * These are model values only — no actual buy/sell can occur in Phase 6A.
 */
export type PumpQuoteSide = 'buy' | 'sell';

/**
 * The unit of the inputAmount in a quote request.
 * - sol: amount denominated in SOL (as a decimal string)
 * - token: amount denominated in token units (as a decimal string)
 * - lamports: amount denominated in lamports (integer string)
 */
export type PumpQuoteInputUnit = 'sol' | 'token' | 'lamports';

/**
 * A request for a buy or sell quote.
 *
 * This is a local data model — no network call is made.
 * The adapter validates this shape and returns a safe mock or disabled result.
 */
export interface PumpQuoteRequest {
  /** Solana token mint address (base58, structurally validated — no Solana library required) */
  readonly tokenMint: string;
  /** Amount to input, as a non-negative decimal string */
  readonly inputAmount: string;
  /** Unit of the inputAmount */
  readonly inputUnit: PumpQuoteInputUnit;
  /** Which side of the trade is being quoted */
  readonly side: PumpQuoteSide;
  /** Maximum acceptable slippage in basis points (0–10000) */
  readonly maxSlippageBps: number;
  /** ISO 8601 timestamp of when the request was created */
  readonly requestedAt: string;
}

/**
 * A buy quote request — inputAmount is denominated in SOL or lamports.
 */
export interface PumpBuyQuoteRequest extends PumpQuoteRequest {
  readonly side: 'buy';
}

/**
 * A sell quote request — inputAmount is denominated in token units.
 */
export interface PumpSellQuoteRequest extends PumpQuoteRequest {
  readonly side: 'sell';
}

/**
 * An estimated (mock/modelled) quote result.
 *
 * All amounts are estimates only — no trade was executed, no transaction was built.
 * Language is deliberately estimating, never confirming execution.
 */
export interface PumpQuoteResult {
  /** Whether this is a buy or sell quote */
  readonly side: PumpQuoteSide;
  /** Token mint address for this quote */
  readonly tokenMint: string;
  /** Input amount as provided in the request */
  readonly inputAmount: string;
  /** Unit of the input amount */
  readonly inputUnit: PumpQuoteInputUnit;
  /** Estimated output amount (modelled, not executed) */
  readonly estimatedOutputAmount: string;
  /** Estimated price per token in SOL (modelled) */
  readonly estimatedPrice: string;
  /** Estimated fees in SOL (modelled) */
  readonly estimatedFees: string;
  /** Slippage tolerance in basis points used for this estimate */
  readonly slippageBps: number;
  /** Venue this quote was modelled for */
  readonly venue: PumpVenueType;
  /** Bonding curve progress as a fraction 0.0–1.0, or null if not applicable */
  readonly curveProgress: number | null;
  /** Whether this result is safe to display (never contains raw secrets) */
  readonly safeToDisplay: true;
  /** Whether this is a mock/estimated result (always true in Phase 6A) */
  readonly isMockResult: true;
  /** ISO timestamp of when this result was generated */
  readonly generatedAt: string;
}
