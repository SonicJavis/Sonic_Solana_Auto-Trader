/**
 * Phase 6C: Disabled Pump SDK Wrapper — types and interfaces.
 *
 * This module defines the type boundary for a future Pump SDK integration.
 * Everything in Phase 6C is disabled by default. No Pump SDK runtime is
 * installed. No Solana SDK is used. No live RPC, signing, sending, execution,
 * wallet access, or instruction building exists.
 *
 * SAFETY NOTICE:
 * - All wrapper capabilities are permanently false in Phase 6C.
 * - All live/executable config fields are permanently false.
 * - The wrapper cannot sign, send, execute, simulate, build instructions,
 *   return account metas, return binary instruction data, or access wallets.
 * - FULL_AUTO and LIMITED_LIVE remain locked.
 */

import type { PumpAdapterResult } from './errors.js';

// ── Wrapper mode ──────────────────────────────────────────────────────────────

/**
 * Describes the operating mode of the Pump SDK wrapper.
 *
 * - `disabled`               — wrapper is disabled; all capabilities false (Phase 6C default)
 * - `mock`                   — mock mode for tests; all capabilities false
 * - `future_live_not_available` — placeholder for future live mode; not yet implemented
 *
 * Only `disabled` is available in Phase 6C.
 */
export type PumpSdkWrapperMode =
  | 'disabled'
  | 'mock'
  | 'future_live_not_available';

// ── Wrapper status ─────────────────────────────────────────────────────────────

/**
 * The current status of the Pump SDK wrapper.
 *
 * - `disabled`     — wrapper is disabled (Phase 6C default)
 * - `unavailable`  — wrapper could not be initialised
 * - `unsupported`  — wrapper mode is not supported in this phase
 * - `mock_only`    — wrapper is in mock mode (no live capability)
 */
export type PumpSdkWrapperStatus =
  | 'disabled'
  | 'unavailable'
  | 'unsupported'
  | 'mock_only';

// ── Wrapper config ─────────────────────────────────────────────────────────────

/**
 * Configuration for the Pump SDK wrapper.
 *
 * All live/executable permission fields are permanently false in Phase 6C.
 * Unsafe config values are coerced to disabled by the factory.
 */
export interface PumpSdkWrapperConfig {
  /** Whether the wrapper is enabled — always false in Phase 6C */
  readonly enabled: false;
  /** Whether live RPC access is allowed — always false in Phase 6C */
  readonly allowLiveRpc: false;
  /** Whether instruction building is allowed — always false in Phase 6C */
  readonly allowInstructionBuilding: false;
  /** Whether executable instructions may be returned — always false in Phase 6C */
  readonly allowExecutableInstructions: false;
  /** Whether signing transactions is allowed — always false in Phase 6C */
  readonly allowSigning: false;
  /** Whether sending transactions is allowed — always false in Phase 6C */
  readonly allowSending: false;
  /** Whether wallet access is allowed — always false in Phase 6C */
  readonly allowWalletAccess: false;
}

/**
 * The safe disabled config used by all Phase 6C wrapper instances.
 */
export const DISABLED_WRAPPER_CONFIG: PumpSdkWrapperConfig = {
  enabled: false,
  allowLiveRpc: false,
  allowInstructionBuilding: false,
  allowExecutableInstructions: false,
  allowSigning: false,
  allowSending: false,
  allowWalletAccess: false,
} as const;

// ── Wrapper capabilities ──────────────────────────────────────────────────────

/**
 * Safety capability flags for the Pump SDK wrapper.
 *
 * All fields are permanently false in Phase 6C.
 * Tests must verify no capability becomes true.
 */
export interface PumpSdkWrapperCapabilities {
  /** Whether the Pump SDK runtime is installed — always false in Phase 6C */
  readonly hasPumpSdkRuntime: false;
  /** Whether the Solana SDK runtime is installed — always false in Phase 6C */
  readonly hasSolanaSdkRuntime: false;
  /** Whether live RPC can be used — always false in Phase 6C */
  readonly canUseLiveRpc: false;
  /** Whether real instructions can be built — always false in Phase 6C */
  readonly canBuildRealInstructions: false;
  /** Whether account metas can be returned — always false in Phase 6C */
  readonly canReturnAccountMetas: false;
  /** Whether binary instruction data can be returned — always false in Phase 6C */
  readonly canReturnBinaryInstructionData: false;
  /** Whether transactions can be simulated — always false in Phase 6C */
  readonly canSimulateTransactions: false;
  /** Whether transactions can be signed — always false in Phase 6C */
  readonly canSignTransactions: false;
  /** Whether transactions can be sent — always false in Phase 6C */
  readonly canSendTransactions: false;
  /** Whether trades can be executed — always false in Phase 6C */
  readonly canExecuteTrades: false;
  /** Whether wallet access is available — always false in Phase 6C */
  readonly canAccessWallets: false;
  /** Whether private key access is available — always false in Phase 6C */
  readonly canAccessPrivateKeys: false;
}

/**
 * The Phase 6C safety capability guard.
 * All prohibited capabilities are permanently false.
 */
export const PUMP_SDK_WRAPPER_CAPABILITIES: PumpSdkWrapperCapabilities = {
  hasPumpSdkRuntime: false,
  hasSolanaSdkRuntime: false,
  canUseLiveRpc: false,
  canBuildRealInstructions: false,
  canReturnAccountMetas: false,
  canReturnBinaryInstructionData: false,
  canSimulateTransactions: false,
  canSignTransactions: false,
  canSendTransactions: false,
  canExecuteTrades: false,
  canAccessWallets: false,
  canAccessPrivateKeys: false,
} as const;

// ── Wrapper error codes ───────────────────────────────────────────────────────

/**
 * Error codes for Pump SDK wrapper operations.
 * All codes are safe to log and display.
 */
export type PumpSdkWrapperErrorCode =
  | 'SDK_WRAPPER_DISABLED'
  | 'SDK_RUNTIME_NOT_INSTALLED'
  | 'SOLANA_SDK_FORBIDDEN'
  | 'LIVE_RPC_FORBIDDEN'
  | 'REAL_INSTRUCTION_BUILDING_FORBIDDEN'
  | 'ACCOUNT_METAS_FORBIDDEN'
  | 'BINARY_DATA_FORBIDDEN'
  | 'WALLET_ACCESS_FORBIDDEN'
  | 'SIGNING_FORBIDDEN'
  | 'SENDING_FORBIDDEN'
  | 'EXECUTION_FORBIDDEN';

// ── Wrapper disabled result ───────────────────────────────────────────────────

/**
 * A safe disabled/forbidden result returned by wrapper methods that cannot
 * operate in Phase 6C.
 *
 * Never contains raw secrets, private keys, stack traces, RPC URLs, or
 * sensitive environment values.
 */
export interface PumpSdkWrapperDisabledResult {
  /** Always false — the operation is forbidden/disabled */
  readonly ok: false;
  /** Machine-readable error code, safe to display */
  readonly code: PumpSdkWrapperErrorCode;
  /** Human-readable message, safe to display */
  readonly message: string;
  /** Always true — result never contains raw secrets or stack traces */
  readonly safeToDisplay: true;
  /** The mode that caused this result */
  readonly wrapperMode: PumpSdkWrapperMode;
}

// ── Wrapper interface ─────────────────────────────────────────────────────────

/**
 * Interface for the Pump SDK wrapper.
 *
 * Phase 6C only provides a disabled implementation.
 * All methods either return static disabled/forbidden results or
 * throw if an unsafe operation is attempted.
 *
 * Optional live methods (getLiveQuote, getLiveBondingCurveState,
 * buildRealInstruction) are included only to define the boundary; they
 * always return disabled/forbidden results in Phase 6C.
 */
export interface PumpSdkWrapper {
  /** Returns the current wrapper status */
  getStatus(): PumpSdkWrapperStatus;

  /** Returns all capability flags (all false in Phase 6C) */
  getCapabilities(): PumpSdkWrapperCapabilities;

  /** Returns the wrapper config (all live/executable permissions false) */
  getConfig(): PumpSdkWrapperConfig;

  /**
   * Asserts the wrapper is disabled.
   * Returns a disabled result object (never throws in Phase 6C).
   */
  assertDisabled(): PumpSdkWrapperDisabledResult;

  /**
   * Returns a human-readable explanation of why the wrapper is disabled.
   * Safe to display in logs, Telegram, or system status.
   */
  explainDisabledReason(): string;

  /**
   * Boundary placeholder: would fetch a live quote in a future phase.
   * In Phase 6C, always returns a LIVE_RPC_FORBIDDEN disabled result.
   *
   * SAFETY: Never uses live RPC. Never returns executable data.
   */
  getLiveQuote(
    tokenMint: string,
    side: string,
  ): PumpAdapterResult<PumpSdkWrapperDisabledResult>;

  /**
   * Boundary placeholder: would fetch live bonding curve state.
   * In Phase 6C, always returns a LIVE_RPC_FORBIDDEN disabled result.
   *
   * SAFETY: Never uses live RPC. Never returns executable data.
   */
  getLiveBondingCurveState(
    tokenMint: string,
  ): PumpAdapterResult<PumpSdkWrapperDisabledResult>;

  /**
   * Boundary placeholder: would build a real Solana instruction.
   * In Phase 6C, always returns a REAL_INSTRUCTION_BUILDING_FORBIDDEN result.
   *
   * SAFETY: Never builds real instructions. Never returns account metas
   * or binary instruction data.
   */
  buildRealInstruction(
    intentType: string,
  ): PumpAdapterResult<PumpSdkWrapperDisabledResult>;
}
