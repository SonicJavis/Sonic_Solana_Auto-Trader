/**
 * Phase 6B: Local instruction intent models.
 *
 * These are descriptive planning types only — no Solana library, no RPC,
 * no account metas, no binary instruction data, no transaction building,
 * no signing, no sending, no execution.
 *
 * Every PumpInstructionIntent carries:
 *   executionForbidden: true
 *   isExecutable: false
 */

import type { PumpVenueType } from './venue-types.js';

/**
 * The kind of intent being described.
 *
 * These are planning labels only — no instruction is built or executed.
 * - buy_intent: describes a potential buy interaction
 * - sell_intent: describes a potential sell interaction
 * - approve_intent: describes a potential token-approval interaction
 * - close_intent: describes a potential account-close interaction
 * - unknown_intent: intent could not be determined from the source quote
 */
export type PumpInstructionIntentType =
  | 'buy_intent'
  | 'sell_intent'
  | 'approve_intent'
  | 'close_intent'
  | 'unknown_intent';

/**
 * The trade side described by an intent.
 * Model-only — no actual buy or sell can be performed in Phase 6B.
 */
export type PumpTradeSide = 'buy' | 'sell';

/**
 * A descriptive instruction intent model.
 *
 * This is a local planning type — it is NOT a Solana TransactionInstruction,
 * NOT an AccountMeta, and NOT executable binary data.
 *
 * It describes what a future real instruction *would* do, if one were built
 * in a later phase after all safety gates have been satisfied.
 *
 * Fields intentionally absent:
 * - No programId / pubkey
 * - No AccountMeta / keys array
 * - No data buffer / binary instruction data
 * - No fee payer
 * - No signer fields
 * - No wallet fields
 * - No blockhash
 */
export interface PumpInstructionIntent {
  /** Unique identifier for this intent instance */
  readonly intentId: string;
  /** The kind of operation this intent describes */
  readonly intentType: PumpInstructionIntentType;
  /** Token mint address this intent targets */
  readonly tokenMint: string;
  /** Whether this intent describes a buy or sell side */
  readonly side: PumpTradeSide;
  /** Input amount as a positive decimal number */
  readonly inputAmount: number;
  /** Estimated output amount (modelled, not executed) */
  readonly estimatedOutputAmount: number;
  /** Slippage tolerance in basis points (0–10 000) */
  readonly maxSlippageBps: number;
  /** Venue this intent was derived from */
  readonly venue: PumpVenueType;
  /** ISO 8601 timestamp of when this intent was created */
  readonly createdAt: string;
  /** Source quote ID, if this intent was derived from a Phase 6A quote */
  readonly sourceQuoteId?: string;
  /** Whether this model is safe to display in logs or UI — always true */
  readonly safeToDisplay: true;
  /** Always true — execution is forbidden in Phase 6B */
  readonly executionForbidden: true;
  /** Always false — this is a local model, not an executable instruction */
  readonly isExecutable: false;
  /** Optional human-readable note about this intent */
  readonly notes?: string;
}
