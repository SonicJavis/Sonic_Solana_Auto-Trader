/**
 * Phase 7B — Event provider config and capability models.
 *
 * All capability and config fields are permanently false/disabled in Phase 7B.
 * These are read-only structural assertions — no runtime code may unlock them.
 *
 * Safety invariants:
 *   - All network, Solana, WebSocket, streaming, execution, and wallet flags are false.
 *   - DISABLED_PROVIDER_CONFIG and DISABLED_PROVIDER_CAPABILITIES are authoritative constants.
 *   - PHASE_7B_PROVIDER_CAPABILITIES is the canonical Phase 7B capability guard.
 */

/**
 * Configuration for an event provider boundary.
 *
 * All live, network, and execution permission fields are permanently false.
 * Unsafe config attempts are coerced to disabled at the factory level.
 */
export interface EventProviderConfig {
  /** Whether the provider is enabled. Always false in Phase 7B. */
  readonly enabled: false;
  /** Whether the provider may make network calls. Always false in Phase 7B. */
  readonly allowNetwork: false;
  /** Whether the provider may use a Solana RPC endpoint. Always false in Phase 7B. */
  readonly allowSolanaRpc: false;
  /** Whether the provider may use WebSockets. Always false in Phase 7B. */
  readonly allowWebSocket: false;
  /** Whether the provider may receive live events. Always false in Phase 7B. */
  readonly allowLiveEvents: false;
  /** Whether the provider may poll external endpoints. Always false in Phase 7B. */
  readonly allowPolling: false;
  /** Whether the provider may stream data. Always false in Phase 7B. */
  readonly allowStreaming: false;
  /** Whether the provider may trigger execution logic. Always false in Phase 7B. */
  readonly allowExecutionTriggers: false;
}

/**
 * Phase 7B disabled provider config constant.
 * All live, network, and execution permissions are false.
 */
export const DISABLED_PROVIDER_CONFIG: EventProviderConfig = {
  enabled: false,
  allowNetwork: false,
  allowSolanaRpc: false,
  allowWebSocket: false,
  allowLiveEvents: false,
  allowPolling: false,
  allowStreaming: false,
  allowExecutionTriggers: false,
} as const;

/**
 * Runtime capability flags for an event provider boundary.
 *
 * All capability flags must remain false in Phase 7B.
 * These flags are read-only structural assertions — no runtime code unlocks them.
 */
export interface EventProviderCapabilities {
  /** Whether the provider has a runtime SDK dependency loaded. Always false in Phase 7B. */
  readonly hasRuntimeDependency: false;
  /** Whether the provider may make network calls. Always false in Phase 7B. */
  readonly canUseNetwork: false;
  /** Whether the provider may connect to a Solana RPC endpoint. Always false in Phase 7B. */
  readonly canUseSolanaRpc: false;
  /** Whether the provider may use a WebSocket connection. Always false in Phase 7B. */
  readonly canUseWebSocket: false;
  /** Whether the provider may use Yellowstone gRPC. Always false in Phase 7B. */
  readonly canUseYellowstone: false;
  /** Whether the provider may use Geyser. Always false in Phase 7B. */
  readonly canUseGeyser: false;
  /** Whether the provider may poll external endpoints. Always false in Phase 7B. */
  readonly canPoll: false;
  /** Whether the provider may stream data. Always false in Phase 7B. */
  readonly canStream: false;
  /** Whether the provider may emit live chain events. Always false in Phase 7B. */
  readonly canEmitLiveEvents: false;
  /** Whether the provider may trigger trade or execution logic. Always false in Phase 7B. */
  readonly canTriggerExecution: false;
  /** Whether the provider may access wallet keys or credentials. Always false in Phase 7B. */
  readonly canAccessWallets: false;
  /** Whether the provider may access private keys. Always false in Phase 7B. */
  readonly canAccessPrivateKeys: false;
}

/**
 * Phase 7B disabled provider capabilities constant.
 * All capability flags are false — no network, no RPC, no WebSocket,
 * no Yellowstone, no Geyser, no streaming, no execution, no wallets.
 */
export const DISABLED_PROVIDER_CAPABILITIES: EventProviderCapabilities = {
  hasRuntimeDependency: false,
  canUseNetwork: false,
  canUseSolanaRpc: false,
  canUseWebSocket: false,
  canUseYellowstone: false,
  canUseGeyser: false,
  canPoll: false,
  canStream: false,
  canEmitLiveEvents: false,
  canTriggerExecution: false,
  canAccessWallets: false,
  canAccessPrivateKeys: false,
} as const;

/**
 * Phase 7B canonical provider capability guard.
 * Alias for DISABLED_PROVIDER_CAPABILITIES — all 12 flags are false.
 */
export const PHASE_7B_PROVIDER_CAPABILITIES: EventProviderCapabilities =
  DISABLED_PROVIDER_CAPABILITIES;
