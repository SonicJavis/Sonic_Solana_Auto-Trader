/**
 * @sonic/pump-adapter — Phase 6A/6B Pump Adapter Quote + Intent Models
 *
 * Safe TypeScript interfaces, models, result types, validation helpers,
 * and mock implementations for future Pump.fun/PumpSwap support.
 *
 * SAFETY NOTICE:
 * This package is inert in Phases 6A/6B — it performs no network calls,
 * makes no Solana RPC queries, builds no transactions, signs nothing,
 * sends nothing, and cannot execute trades.
 *
 * Phase 6A: quote models, bonding-curve models, mock adapter
 * Phase 6B: instruction intent models, transaction plan placeholders,
 *           mock instruction builder (all model-only, no real instructions)
 *
 * FULL_AUTO and LIMITED_LIVE remain locked.
 * No Pump.fun buying/selling. No PumpSwap buying/selling. No Jito.
 */

// ── Phase 6A types ────────────────────────────────────────────────────────────
export type {
  PumpVenueType,
  PumpAdapterStatus,
  PumpAdapterStatusReport,
  PumpQuoteSide,
  PumpQuoteInputUnit,
  PumpQuoteRequest,
  PumpBuyQuoteRequest,
  PumpSellQuoteRequest,
  PumpQuoteResult,
  BondingCurveState,
  PumpAdapterErrorCode,
  PumpAdapterError,
  PumpAdapterOk,
  PumpAdapterErr,
  PumpAdapterResult,
  PumpAdapter,
  PumpAdapterCapabilities,
  MockPumpAdapterConfig,
} from './types.js';

// Phase 6B types
export type {
  PumpInstructionIntentType,
  PumpTradeSide,
  PumpInstructionIntent,
  PumpTransactionPlanType,
  PumpTransactionPlan,
  Phase6BWarningCode,
  Phase6BErrorCode,
  Phase6BErrorResult,
  Phase6BBuilderCapabilities,
  PumpInstructionBuilderRequest,
  PumpInstructionBuilderResult,
  PumpInstructionIntentBuilder,
} from './types.js';

// ── Phase 6A runtime helpers ──────────────────────────────────────────────────

// Error helpers
export { pumpOk, pumpErr, isPumpOk, isPumpErr } from './errors.js';

// Safety guard
export { PUMP_ADAPTER_CAPABILITIES, getPumpAdapterCapabilities } from './safety.js';

// Validation helpers
export {
  validateTokenMint,
  validateInputAmount,
  validateSlippageBps,
  validateRequestedAt,
  validateQuoteRequest,
} from './validation.js';

// Mock adapter
export {
  MockPumpAdapter,
  createDisabledMockAdapter,
  createAvailableMockAdapter,
} from './mock-adapter.js';

// ── Phase 6B runtime helpers ──────────────────────────────────────────────────

// Builder capability guard
export {
  PHASE_6B_BUILDER_CAPABILITIES,
  getPhase6BBuilderCapabilities,
} from './mock-instruction-builder.js';

// Instruction validation helpers
export {
  phase6bError,
  validateAllowExecutableInstructions,
  validateBuilderQuote,
  validateBuilderVenue,
  validateNumericAmount,
  validateBuilderSlippage,
  validateBuilderRequest,
} from './instruction-validation.js';

// Mock instruction builder
export {
  MockInstructionBuilder,
  createMockInstructionBuilder,
} from './mock-instruction-builder.js';
