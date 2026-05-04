/**
 * Phase 6B: PumpInstructionIntentBuilder interface.
 *
 * Defines the boundary for future mock/disabled builder implementations.
 * All methods return local planning models — no real instructions are built,
 * no Solana SDK is used, no RPC calls are made.
 */

import type {
  PumpInstructionBuilderRequest,
  PumpInstructionBuilderResult,
  Phase6BBuilderCapabilities,
} from './builder-types.js';

/**
 * The instruction intent builder interface.
 *
 * In Phase 6B all implementations are mock-only.
 * No implementation may:
 * - Build real Solana instructions
 * - Return AccountMeta objects
 * - Return binary instruction data
 * - Sign, send, or simulate transactions
 * - Access wallets or private keys
 * - Make live RPC calls
 */
export interface PumpInstructionIntentBuilder {
  /**
   * Build a buy instruction intent from a successful Phase 6A buy quote.
   * Returns a local model only — not an executable instruction.
   */
  buildBuyIntent(request: PumpInstructionBuilderRequest): PumpInstructionBuilderResult;

  /**
   * Build a sell instruction intent from a successful Phase 6A sell quote.
   * Returns a local model only — not an executable instruction.
   */
  buildSellIntent(request: PumpInstructionBuilderRequest): PumpInstructionBuilderResult;

  /**
   * Build a transaction plan placeholder from a successful Phase 6A quote.
   * Returns a local planning model only — not an executable transaction.
   */
  buildPlanFromQuote(request: PumpInstructionBuilderRequest): PumpInstructionBuilderResult;

  /**
   * Return the builder's safety capability flags.
   * All flags are permanently false in Phase 6B.
   */
  getCapabilities(): Phase6BBuilderCapabilities;
}
