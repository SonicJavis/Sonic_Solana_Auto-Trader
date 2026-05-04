/**
 * Phase 6B: Local transaction plan placeholder models.
 *
 * These are descriptive planning types only — a PumpTransactionPlan is NOT
 * a Solana Transaction, NOT a VersionedTransaction, and cannot be submitted.
 *
 * Every PumpTransactionPlan carries:
 *   executionForbidden: true
 *   isExecutable: false
 *   requiresWallet: false
 *   requiresSignature: false
 *   requiresRpc: false
 *
 * Fields intentionally absent:
 * - No blockhash
 * - No fee payer
 * - No signatures array
 * - No transaction bytes / serialised buffer
 * - No Solana AccountMeta
 * - No binary instruction data
 */

import type { PumpVenueType } from './venue-types.js';
import type { PumpInstructionIntent } from './instruction-intent-types.js';

/**
 * The kind of plan described by a PumpTransactionPlan.
 * Planning labels only — not a Solana transaction type.
 */
export type PumpTransactionPlanType = 'buy_plan' | 'sell_plan' | 'unknown_plan';

/**
 * A local transaction plan placeholder.
 *
 * Groups one or more PumpInstructionIntents into a descriptive plan shape.
 * This is NOT a transaction — it is a planning model for future phases.
 */
export interface PumpTransactionPlan {
  /** Unique identifier for this plan instance */
  readonly planId: string;
  /** The kind of plan described */
  readonly planType: PumpTransactionPlanType;
  /** Ordered list of instruction intents in this plan */
  readonly intents: readonly PumpInstructionIntent[];
  /** Token mint address this plan targets */
  readonly tokenMint: string;
  /** Venue this plan was derived for */
  readonly venue: PumpVenueType;
  /** ISO 8601 timestamp of when this plan was created */
  readonly createdAt: string;
  /** Always true — execution is forbidden in Phase 6B */
  readonly executionForbidden: true;
  /** Always false — this is a placeholder, not an executable transaction */
  readonly isExecutable: false;
  /** Always false — no wallet is required or present in Phase 6B */
  readonly requiresWallet: false;
  /** Always false — no signature is required or present in Phase 6B */
  readonly requiresSignature: false;
  /** Always false — no RPC is required or used in Phase 6B */
  readonly requiresRpc: false;
  /** Optional human-readable note about this plan */
  readonly notes?: string;
}
