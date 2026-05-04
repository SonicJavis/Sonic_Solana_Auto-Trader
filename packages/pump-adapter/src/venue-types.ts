/**
 * Venue and adapter status types for Phase 6A pump adapter.
 *
 * These are pure TypeScript models — no Solana RPC, no network calls,
 * no transaction building, no signing, no sending.
 */

/**
 * The trading venue associated with a token.
 *
 * - pump_curve: token still on Pump.fun bonding curve
 * - pumpswap: token has graduated to PumpSwap AMM
 * - unknown: venue could not be determined
 * - unsupported: venue is known but not supported in the current phase
 */
export type PumpVenueType = 'pump_curve' | 'pumpswap' | 'unknown' | 'unsupported';

/**
 * Operational status of the pump adapter.
 *
 * In Phase 6A the adapter is always disabled/mock-only — no live RPC,
 * no transaction execution, no trading capability.
 *
 * - available: adapter is operational (reserved for future phases — NOT Phase 6A)
 * - unavailable: adapter is not reachable or not configured
 * - disabled: adapter is explicitly disabled (Phase 6A default)
 * - unsupported: adapter capability is not implemented in this phase
 */
export type PumpAdapterStatus = 'available' | 'unavailable' | 'disabled' | 'unsupported';

/**
 * Detailed status report for the pump adapter.
 * Safe for display in Telegram or control-plane UI.
 * Never contains raw secrets, private keys, or credentials.
 */
export interface PumpAdapterStatusReport {
  /** Current operational status */
  readonly status: PumpAdapterStatus;
  /** Whether the adapter can execute live trades — always false in Phase 6A */
  readonly isLiveCapable: false;
  /** Whether the adapter can make real RPC calls — always false in Phase 6A */
  readonly hasLiveRpc: false;
  /** Whether execution is forbidden — always true in Phase 6A */
  readonly executionForbidden: true;
  /** Human-readable status message safe to display */
  readonly message: string;
  /** Phase in which this adapter operates */
  readonly phase: number;
  /** ISO timestamp of status check */
  readonly checkedAt: string;
}
