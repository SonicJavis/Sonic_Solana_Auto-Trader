/**
 * Phase 7B — Provider factory.
 *
 * Creates disabled event provider boundaries by type.
 * Always returns a disabled provider regardless of input.
 * Unsafe enable or live-mode attempts are coerced to disabled (fail-closed).
 *
 * Safety invariants:
 *   - No provider SDK is loaded.
 *   - No network calls are made.
 *   - No RPC URLs or API keys are accepted for live use.
 *   - All returned providers are permanently disabled.
 */

import type { EventProviderType } from './provider-types.js';
import type { EventProviderBoundary } from './disabled-provider.js';
import { DisabledEventProvider } from './disabled-provider.js';

/**
 * Optional input accepted by the provider factory.
 * All live/network/provider config fields are ignored and coerced to disabled.
 */
export interface EventProviderFactoryInput {
  /** Provider type classification. Defaults to 'unknown_disabled'. */
  type?: EventProviderType | undefined;
  /**
   * Any attempt to pass `enabled: true` is coerced to disabled (fail-closed).
   * This field is accepted only to allow safe call sites to pass their config
   * without a type error.
   */
  enabled?: unknown;
  /**
   * Any attempt to pass `allowNetwork: true` is coerced to disabled (fail-closed).
   */
  allowNetwork?: unknown;
  /**
   * Any attempt to pass `allowSolanaRpc: true` is coerced to disabled (fail-closed).
   */
  allowSolanaRpc?: unknown;
  /**
   * Any attempt to pass `allowWebSocket: true` is coerced to disabled (fail-closed).
   */
  allowWebSocket?: unknown;
  /**
   * Any attempt to pass `allowLiveEvents: true` is coerced to disabled (fail-closed).
   */
  allowLiveEvents?: unknown;
  /**
   * Any attempt to pass `allowPolling: true` is coerced to disabled (fail-closed).
   */
  allowPolling?: unknown;
  /**
   * Any attempt to pass `allowStreaming: true` is coerced to disabled (fail-closed).
   */
  allowStreaming?: unknown;
  /**
   * Any attempt to pass `allowExecutionTriggers: true` is coerced to disabled (fail-closed).
   */
  allowExecutionTriggers?: unknown;
  /** Additional unknown fields are ignored. */
  [key: string]: unknown;
}

/**
 * Create a disabled event provider of the given type.
 *
 * Always returns a disabled provider.
 * The `input` parameter is accepted but all live/network/provider fields are ignored.
 * No provider SDK is loaded. No network calls are made.
 *
 * @param type - The provider type. Defaults to 'unknown_disabled'.
 * @param _input - Optional factory input (all live config ignored).
 */
export function createDisabledEventProvider(
  type: EventProviderType = 'unknown_disabled',
  _input?: EventProviderFactoryInput,
): EventProviderBoundary {
  // All input fields are ignored — provider is always returned as disabled.
  return new DisabledEventProvider(type);
}

/**
 * Create a disabled Helius provider boundary.
 * No Helius SDK is loaded. No RPC endpoint is used. No live events are emitted.
 */
export function createDisabledHeliusProvider(): EventProviderBoundary {
  return new DisabledEventProvider('helius_disabled');
}

/**
 * Create a disabled WebSocket provider boundary.
 * No WebSocket client is loaded. No connection is attempted. No live events are emitted.
 */
export function createDisabledWebSocketProvider(): EventProviderBoundary {
  return new DisabledEventProvider('websocket_disabled');
}

/**
 * Create a disabled Yellowstone/Geyser provider boundary.
 * No Yellowstone or Geyser package is loaded. No gRPC connection is opened.
 * No live events are emitted.
 */
export function createDisabledYellowstoneProvider(): EventProviderBoundary {
  return new DisabledEventProvider('yellowstone_disabled');
}

/**
 * Create a disabled polling provider boundary.
 * No polling loop is started. No external endpoints are polled.
 * No live event ingestion occurs.
 */
export function createDisabledPollingProvider(): EventProviderBoundary {
  return new DisabledEventProvider('polling_disabled');
}
