/**
 * Phase 6B: Builder request/result types and error model.
 *
 * All types are local planning models only — no Solana SDK, no RPC,
 * no execution, no signing, no sending.
 */

import type { PumpAdapterResult } from './errors.js';
import type { PumpTransactionPlan } from './transaction-plan-types.js';

// Re-export PumpAdapterResult so consumers don't need to import errors separately.
export type { PumpAdapterResult };

/**
 * Warning codes included in every builder result.
 * These remind callers that the output is a local model only.
 */
export type Phase6BWarningCode =
  | 'MODEL_ONLY'
  | 'EXECUTION_FORBIDDEN'
  | 'SIGNING_FORBIDDEN'
  | 'SENDING_FORBIDDEN'
  | 'LIVE_RPC_FORBIDDEN'
  | 'REAL_INSTRUCTIONS_FORBIDDEN';

/**
 * Error codes specific to the Phase 6B instruction builder.
 * All codes are safe to display in logs, Telegram, or UI.
 */
export type Phase6BErrorCode =
  | 'INSTRUCTION_BUILDING_FORBIDDEN'
  | 'EXECUTABLE_INSTRUCTIONS_FORBIDDEN'
  | 'TRANSACTION_BUILDING_FORBIDDEN'
  | 'SIMULATION_FORBIDDEN'
  | 'QUOTE_REQUIRED'
  | 'UNSAFE_QUOTE_RESULT'
  | 'UNSUPPORTED_INTENT'
  | 'UNSUPPORTED_VENUE'
  | 'ACCOUNT_METAS_FORBIDDEN'
  | 'BINARY_DATA_FORBIDDEN'
  | 'LIVE_RPC_FORBIDDEN'
  | 'WALLET_ACCESS_FORBIDDEN';

/**
 * A safe Phase 6B error result.
 * Never contains raw secrets, private keys, stack traces, or sensitive details.
 */
export interface Phase6BErrorResult {
  /** Machine-readable error code, safe to display */
  readonly code: Phase6BErrorCode;
  /** Human-readable message, safe to display */
  readonly message: string;
  /** Always true — errors never contain raw secrets or stack traces */
  readonly safeToDisplay: true;
}

/**
 * Safety capability flags for the Phase 6B instruction builder.
 * All prohibited capabilities are permanently false.
 */
export interface Phase6BBuilderCapabilities {
  /** Always false — signing transactions is forbidden in Phase 6B */
  readonly canSignTransactions: false;
  /** Always false — sending transactions is forbidden in Phase 6B */
  readonly canSendTransactions: false;
  /** Always false — executing trades is forbidden in Phase 6B */
  readonly canExecuteTrades: false;
  /** Always false — private key access is forbidden in Phase 6B */
  readonly canAccessPrivateKeys: false;
  /** Always false — live RPC access is forbidden in Phase 6B */
  readonly canUseLiveRpc: false;
  /** Always false — Jito is not supported in Phase 6B */
  readonly canUseJito: false;
  /** Always false — transaction building is forbidden in Phase 6B */
  readonly canBuildTransactions: false;
  /** Always false — instruction building is forbidden in Phase 6B */
  readonly canBuildInstructions: false;
  /** Always false — executable instruction building is forbidden in Phase 6B */
  readonly canBuildExecutableInstructions: false;
  /** Always false — transaction simulation is forbidden in Phase 6B */
  readonly canSimulateTransactions: false;
  /** Always false — returning account metas is forbidden in Phase 6B */
  readonly canReturnAccountMetas: false;
  /** Always false — returning binary instruction data is forbidden in Phase 6B */
  readonly canReturnBinaryInstructionData: false;
}

/**
 * A request to build an instruction intent or transaction plan.
 *
 * The quote field must be a successful PumpAdapterResult<PumpQuoteResult>
 * from Phase 6A.  The allowExecutableInstructions field must always be false.
 */
export interface PumpInstructionBuilderRequest {
  /**
   * The Phase 6A quote result to derive the intent from.
   * Must be a PumpAdapterOk<PumpQuoteResult> — failed results are rejected.
   */
  readonly quote: unknown;
  /** ISO 8601 timestamp of when this request was created */
  readonly requestedAt: string;
  /**
   * Must always be false.
   * Executable instructions are forbidden in Phase 6B.
   * Passing true will cause the builder to return an error.
   */
  readonly allowExecutableInstructions: false;
}

/**
 * The result of a builder operation.
 *
 * On success, plan is non-null and error is absent.
 * On failure, plan is null and error is set.
 * Warnings are always present regardless of success/failure.
 */
export interface PumpInstructionBuilderResult {
  /** The transaction plan placeholder, or null if the build failed */
  readonly plan: PumpTransactionPlan | null;
  /** Standard safety warnings reminding callers this is a local model */
  readonly warnings: readonly Phase6BWarningCode[];
  /** Snapshot of builder capability flags (all false) */
  readonly safety: Phase6BBuilderCapabilities;
  /** Error detail if the build failed — absent on success */
  readonly error?: Phase6BErrorResult;
}
