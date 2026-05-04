/**
 * PumpAdapter interface — Phase 6A pump adapter boundary.
 *
 * All methods are inert in Phase 6A:
 * - No Solana RPC calls
 * - No transaction building, signing, or sending
 * - No wallet or private key access
 * - No live trading
 * - No Jito, Jupiter, Raydium, or other swap protocols
 *
 * Implementations return safe mock/disabled results only.
 */

import type { PumpAdapterStatusReport, PumpVenueType } from './venue-types.js';
import type {
  PumpBuyQuoteRequest,
  PumpSellQuoteRequest,
  PumpQuoteResult,
} from './quote-types.js';
import type { BondingCurveState } from './bonding-curve-types.js';
import type { PumpAdapterResult } from './errors.js';

/**
 * The pump adapter interface.
 *
 * In Phase 6A all implementations are inert (mock-only, disabled-only).
 * No implementation may perform network calls, RPC queries, transaction
 * building, signing, sending, or any form of trade execution.
 */
export interface PumpAdapter {
  /**
   * Returns the current operational status of this adapter.
   * In Phase 6A this must always report disabled/non-live/execution-forbidden.
   */
  getStatus(): PumpAdapterStatusReport;

  /**
   * Detect the trading venue for a token mint address.
   *
   * In Phase 6A this returns a mock/configured venue — no RPC call is made.
   *
   * @param tokenMint - Solana token mint address (base58)
   */
  detectVenue(tokenMint: string): PumpAdapterResult<PumpVenueType>;

  /**
   * Return a modelled (mock) bonding curve state for a token mint.
   *
   * In Phase 6A this returns a mock state — no RPC call is made.
   * The returned state is always marked isMockState: true.
   *
   * @param tokenMint - Solana token mint address (base58)
   */
  getBondingCurveState(tokenMint: string): PumpAdapterResult<BondingCurveState>;

  /**
   * Return a modelled (mock) buy quote.
   *
   * In Phase 6A this returns a mock quote — no RPC call is made,
   * no transaction is built, and no trade is executed.
   * The returned result is always marked isMockResult: true.
   *
   * @param request - Validated buy quote request
   */
  getBuyQuote(request: PumpBuyQuoteRequest): PumpAdapterResult<PumpQuoteResult>;

  /**
   * Return a modelled (mock) sell quote.
   *
   * In Phase 6A this returns a mock quote — no RPC call is made,
   * no transaction is built, and no trade is executed.
   * The returned result is always marked isMockResult: true.
   *
   * @param request - Validated sell quote request
   */
  getSellQuote(request: PumpSellQuoteRequest): PumpAdapterResult<PumpQuoteResult>;
}
