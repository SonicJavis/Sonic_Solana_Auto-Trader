/**
 * @sonic/pump-adapter — Phase 6A Pump Adapter Quote Models
 *
 * Safe TypeScript interfaces, models, result types, validation helpers,
 * and a mock adapter for future Pump.fun/PumpSwap quote support.
 *
 * SAFETY NOTICE:
 * This package is inert in Phase 6A — it performs no network calls,
 * makes no Solana RPC queries, builds no transactions, signs nothing,
 * sends nothing, and cannot execute trades.
 *
 * FULL_AUTO and LIMITED_LIVE remain locked.
 * No Pump.fun buying/selling. No PumpSwap buying/selling. No Jito.
 */

// Types
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
