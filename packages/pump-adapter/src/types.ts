/**
 * Re-exported convenience types for the pump adapter package.
 * All types are local models only — no Solana library, no RPC, no execution.
 */

export type { PumpVenueType, PumpAdapterStatus, PumpAdapterStatusReport } from './venue-types.js';
export type {
  PumpQuoteSide,
  PumpQuoteInputUnit,
  PumpQuoteRequest,
  PumpBuyQuoteRequest,
  PumpSellQuoteRequest,
  PumpQuoteResult,
} from './quote-types.js';
export type { BondingCurveState } from './bonding-curve-types.js';
export type {
  PumpAdapterErrorCode,
  PumpAdapterError,
  PumpAdapterOk,
  PumpAdapterErr,
  PumpAdapterResult,
} from './errors.js';
export type { PumpAdapter } from './adapter.js';
export type { PumpAdapterCapabilities } from './safety.js';
export type { MockPumpAdapterConfig } from './mock-adapter.js';

// Phase 6B — instruction intent and transaction plan placeholder types
export type { PumpInstructionIntentType, PumpTradeSide, PumpInstructionIntent } from './instruction-intent-types.js';
export type { PumpTransactionPlanType, PumpTransactionPlan } from './transaction-plan-types.js';
export type {
  Phase6BWarningCode,
  Phase6BErrorCode,
  Phase6BErrorResult,
  Phase6BBuilderCapabilities,
  PumpInstructionBuilderRequest,
  PumpInstructionBuilderResult,
} from './builder-types.js';
export type { PumpInstructionIntentBuilder } from './instruction-builder.js';

// Phase 6C — disabled Pump SDK wrapper boundary types
export type {
  PumpSdkWrapperMode,
  PumpSdkWrapperStatus,
  PumpSdkWrapperConfig,
  PumpSdkWrapperCapabilities,
  PumpSdkWrapperErrorCode,
  PumpSdkWrapperDisabledResult,
  PumpSdkWrapper,
} from './sdk-wrapper-types.js';
export type { PumpSdkWrapperFactoryInput } from './sdk-wrapper-factory.js';
