/**
 * Phase 7B — Disabled event provider boundaries.
 *
 * Defines structural boundaries for external event providers that are
 * explicitly disabled. These providers exist as type-level and structural
 * placeholders only — no network connections, no RPC calls, no live data
 * ingestion, no WebSocket connections.
 *
 * All capability flags are false.
 * createDisabledEventProvider() is fail-closed — all operations return errors.
 *
 * Safety invariants:
 *   - No network calls may be made
 *   - No WebSocket connections may be opened
 *   - No Solana RPC calls may be made
 *   - No live events may be emitted
 *   - No execution may be triggered
 *   - No wallet access may occur
 *   - No private keys may be accessed
 */

import type { EventEngineResult } from './errors.js';
import { engineErr } from './errors.js';

/**
 * Provider type identifiers — all are disabled in Phase 7B.
 * These represent future live providers that are structurally present
 * but functionally inert.
 */
export type EventProviderType =
  | 'helius_disabled'
  | 'websocket_disabled'
  | 'yellowstone_disabled'
  | 'quicknode_disabled'
  | 'triton_disabled'
  | 'alchemy_disabled';

export const EVENT_PROVIDER_TYPES: readonly EventProviderType[] = [
  'helius_disabled',
  'websocket_disabled',
  'yellowstone_disabled',
  'quicknode_disabled',
  'triton_disabled',
  'alchemy_disabled',
] as const;

/**
 * Capability flags for an event provider.
 *
 * All flags are false in Phase 7B — no live, network, WebSocket, Yellowstone,
 * Geyser, market data, chain subscription, execution, wallet, or private key
 * access is permitted.
 *
 * These are read-only structural assertions — no runtime code unlocks them.
 */
export interface EventProviderCapabilities {
  /** Network calls of any kind. Always false — disabled. */
  readonly canUseNetwork: false;
  /** Solana RPC connections. Always false — disabled. */
  readonly canUseSolanaRpc: false;
  /** WebSocket connections. Always false — disabled. */
  readonly canUseWebSocket: false;
  /** Yellowstone gRPC connections. Always false — disabled. */
  readonly canUseYellowstone: false;
  /** Geyser plugin connections. Always false — disabled. */
  readonly canUseGeyser: false;
  /** Live on-chain event emission. Always false — disabled. */
  readonly canEmitLiveEvents: false;
  /** Fixture event replay. Always false for disabled providers. */
  readonly canReplayFixtureEvents: false;
  /** Trade execution triggers. Always false — disabled. */
  readonly canTriggerExecution: false;
  /** Wallet/keypair access. Always false — disabled. */
  readonly canAccessWallets: false;
  /** Private key access. Always false — disabled. */
  readonly canAccessPrivateKeys: false;
  /** Live market data ingestion. Always false — disabled. */
  readonly canFetchMarketData: false;
  /** On-chain event subscription. Always false — disabled. */
  readonly canSubscribeToChainEvents: false;
}

/**
 * Phase 7B provider capabilities — all false.
 * Authoritative constant for all disabled provider boundaries.
 */
export const PHASE_7B_PROVIDER_CAPABILITIES: EventProviderCapabilities = {
  canUseNetwork: false,
  canUseSolanaRpc: false,
  canUseWebSocket: false,
  canUseYellowstone: false,
  canUseGeyser: false,
  canEmitLiveEvents: false,
  canReplayFixtureEvents: false,
  canTriggerExecution: false,
  canAccessWallets: false,
  canAccessPrivateKeys: false,
  canFetchMarketData: false,
  canSubscribeToChainEvents: false,
} as const;

/**
 * A disabled event provider — structurally present, functionally inert.
 * All operations fail safely with a disabled error.
 * No network calls, no live data ingestion, no execution.
 */
export interface DisabledEventProvider {
  readonly providerType: EventProviderType;
  readonly capabilities: EventProviderCapabilities;
  readonly disabled: true;
  /** Always returns an error — provider is disabled. */
  connect(): EventEngineResult<never>;
  /** Always returns an error — provider is disabled. */
  disconnect(): EventEngineResult<never>;
  /** Always returns 'disabled'. */
  getStatus(): 'disabled';
}

/**
 * A boundary record representing a single disabled provider.
 */
export interface EventProviderBoundary {
  readonly providerType: EventProviderType;
  readonly capabilities: EventProviderCapabilities;
  readonly disabled: true;
  readonly reason: string;
}

/**
 * Registry of disabled event providers.
 * All registered providers are inert — no network, no live data.
 */
export interface EventProviderRegistry {
  readonly providers: ReadonlyMap<EventProviderType, EventProviderBoundary>;
  getProvider(type: EventProviderType): EventProviderBoundary | undefined;
  getAllProviders(): readonly EventProviderBoundary[];
}

/**
 * Create a disabled event provider (fail-closed).
 *
 * Returns a provider that always rejects connect/disconnect with
 * LIVE_PROVIDER_FORBIDDEN errors. Status is always 'disabled'.
 * Safe to instantiate — no side effects, no network, no I/O.
 */
export function createDisabledEventProvider(
  providerType: EventProviderType,
): DisabledEventProvider {
  return {
    providerType,
    capabilities: PHASE_7B_PROVIDER_CAPABILITIES,
    disabled: true,
    connect(): EventEngineResult<never> {
      return engineErr(
        'LIVE_PROVIDER_FORBIDDEN',
        `Provider "${providerType}" is disabled — no live providers in Phase 7B`,
      );
    },
    disconnect(): EventEngineResult<never> {
      return engineErr(
        'LIVE_PROVIDER_FORBIDDEN',
        `Provider "${providerType}" is disabled — no live providers in Phase 7B`,
      );
    },
    getStatus(): 'disabled' {
      return 'disabled';
    },
  };
}

/**
 * Build the Phase 7B disabled provider registry.
 * Registers all known provider types as disabled boundaries.
 * Safe to call — no network, no I/O, no side effects.
 */
export function buildDisabledProviderRegistry(): EventProviderRegistry {
  const boundaries: EventProviderBoundary[] = EVENT_PROVIDER_TYPES.map((type) => ({
    providerType: type,
    capabilities: PHASE_7B_PROVIDER_CAPABILITIES,
    disabled: true as const,
    reason: `Phase 7B: "${type}" is a disabled provider boundary — not connected, not live`,
  }));

  const map = new Map<EventProviderType, EventProviderBoundary>(
    boundaries.map((b) => [b.providerType, b]),
  );

  return {
    providers: map,
    getProvider(type: EventProviderType): EventProviderBoundary | undefined {
      return map.get(type);
    },
    getAllProviders(): readonly EventProviderBoundary[] {
      return boundaries;
    },
  };
}
