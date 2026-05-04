/**
 * Phase 7A — Event source status and capability models.
 *
 * Describes the operational state of an event source and the actions
 * it is permitted to perform.
 *
 * Safety invariants enforced here:
 *   - All network/execution/wallet capability flags are false in Phase 7A.
 *   - These flags must never be set to true without a future explicit phase unlock.
 *   - PHASE_7A_SOURCE_CAPABILITIES is the authoritative constant.
 */

/**
 * Operational status of an event source.
 */
export type EventSourceStatus =
  | 'disabled'
  | 'available'
  | 'degraded'
  | 'unhealthy'
  | 'unknown';

export const EVENT_SOURCE_STATUSES: readonly EventSourceStatus[] = [
  'disabled',
  'available',
  'degraded',
  'unhealthy',
  'unknown',
] as const;

/**
 * Capability flags for an event source.
 *
 * All live/network/execution flags must remain false in Phase 7A.
 * These are read-only structural assertions — no runtime code unlocks them.
 */
export interface EventSourceCapabilities {
  /** Whether this source may make network calls of any kind. Always false in Phase 7A. */
  readonly canUseNetwork: false;
  /** Whether this source may connect to a Solana RPC endpoint. Always false in Phase 7A. */
  readonly canUseSolanaRpc: false;
  /** Whether this source may emit live on-chain events. Always false in Phase 7A. */
  readonly canEmitLiveEvents: false;
  /** Whether this source may trigger trade execution. Always false in Phase 7A. */
  readonly canTriggerExecution: false;
  /** Whether this source may access wallet keys or credentials. Always false in Phase 7A. */
  readonly canAccessWallets: false;
}

/**
 * Phase 7A source capability constants.
 * All capabilities are false — no network, no RPC, no execution, no wallets.
 */
export const PHASE_7A_SOURCE_CAPABILITIES: EventSourceCapabilities = {
  canUseNetwork: false,
  canUseSolanaRpc: false,
  canEmitLiveEvents: false,
  canTriggerExecution: false,
  canAccessWallets: false,
} as const;

/**
 * Status and capabilities snapshot for a named event source.
 */
export interface EventSourceHealth {
  readonly sourceName: string;
  readonly status: EventSourceStatus;
  readonly capabilities: EventSourceCapabilities;
  readonly lastUpdated: string;
  readonly notes?: string | undefined;
}

/** Build a fully-disabled health record for a named source. */
export function buildDisabledSourceHealth(sourceName: string): EventSourceHealth {
  return {
    sourceName,
    status: 'disabled',
    capabilities: PHASE_7A_SOURCE_CAPABILITIES,
    lastUpdated: new Date().toISOString(),
    notes: 'Phase 7A: local event bus only — no live providers',
  };
}

/**
 * Event engine system-level status.
 * Reports what the event engine can and cannot do.
 * All live/network/execution fields report forbidden/disabled.
 */
export interface EventEngineSystemStatus {
  readonly coreEventBus: 'available' | 'disabled';
  readonly liveProviders: 'disabled';
  readonly networkEvents: 'forbidden';
  readonly executionTriggers: 'forbidden';
  readonly solanaRpc: 'forbidden';
  readonly phase: number;
  readonly generatedAt: string;
}

/** Build the Phase 7A event engine system status. */
export function buildEventEngineSystemStatus(): EventEngineSystemStatus {
  return {
    coreEventBus: 'available',
    liveProviders: 'disabled',
    networkEvents: 'forbidden',
    executionTriggers: 'forbidden',
    solanaRpc: 'forbidden',
    phase: 7,
    generatedAt: new Date().toISOString(),
  };
}
