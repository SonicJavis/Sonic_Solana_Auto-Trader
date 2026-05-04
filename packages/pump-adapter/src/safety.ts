/**
 * Safety capability guard for Phase 6A pump adapter.
 *
 * This object documents all prohibited capabilities.
 * Every field is permanently false in Phase 6A.
 *
 * Tests must verify all prohibited capabilities remain false.
 */

/**
 * Phase 6A pump adapter safety capability flags.
 * All capabilities that could cause harm are permanently false.
 */
export interface PumpAdapterCapabilities {
  /** Whether the adapter can sign transactions — always false in Phase 6A */
  readonly canSignTransactions: false;
  /** Whether the adapter can send transactions — always false in Phase 6A */
  readonly canSendTransactions: false;
  /** Whether the adapter can execute trades — always false in Phase 6A */
  readonly canExecuteTrades: false;
  /** Whether the adapter can access private keys — always false in Phase 6A */
  readonly canAccessPrivateKeys: false;
  /** Whether the adapter can use live RPC — always false in Phase 6A */
  readonly canUseLiveRpc: false;
  /** Whether the adapter can use Jito — always false in Phase 6A */
  readonly canUseJito: false;
  /** Whether the adapter can build transactions — always false in Phase 6A */
  readonly canBuildTransactions: false;
  /** Whether the adapter can build transaction instructions — always false in Phase 6A */
  readonly canBuildInstructions: false;
}

/**
 * The Phase 6A pump adapter safety capability guard.
 *
 * This is a static constant. All values are permanently false.
 * No code path in Phase 6A may set any of these to true.
 */
export const PUMP_ADAPTER_CAPABILITIES: PumpAdapterCapabilities = {
  canSignTransactions: false,
  canSendTransactions: false,
  canExecuteTrades: false,
  canAccessPrivateKeys: false,
  canUseLiveRpc: false,
  canUseJito: false,
  canBuildTransactions: false,
  canBuildInstructions: false,
} as const;

/**
 * Returns the Phase 6A safety capability guard.
 * All prohibited capabilities are false.
 */
export function getPumpAdapterCapabilities(): PumpAdapterCapabilities {
  return PUMP_ADAPTER_CAPABILITIES;
}
