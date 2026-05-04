/**
 * Phase 7B — Disabled provider error types, boundary interface, and base implementation.
 *
 * All provider implementations are permanently disabled.
 * No SDK is loaded, no network calls are made, no WebSocket connections are opened,
 * no Solana RPC is used, no live events are emitted, no execution is triggered.
 *
 * Safety invariants:
 *   - DisabledEventProvider never connects, streams, polls, or emits live events.
 *   - All optional lifecycle methods return safe disabled/forbidden results.
 *   - No raw secrets, private keys, stack traces, or RPC URLs appear in errors.
 */

import type { EventProviderType, EventProviderStatus } from './provider-types.js';
import type { EventProviderCapabilities, EventProviderConfig } from './provider-capabilities.js';
import { DISABLED_PROVIDER_CAPABILITIES, DISABLED_PROVIDER_CONFIG } from './provider-capabilities.js';

/**
 * Machine-readable error codes for provider boundary operations.
 * All codes are safe to log and display.
 */
export type ProviderErrorCode =
  | 'PROVIDER_DISABLED'
  | 'PROVIDER_RUNTIME_NOT_INSTALLED'
  | 'PROVIDER_NETWORK_FORBIDDEN'
  | 'SOLANA_RPC_FORBIDDEN'
  | 'WEBSOCKET_FORBIDDEN'
  | 'YELLOWSTONE_FORBIDDEN'
  | 'GEYSER_FORBIDDEN'
  | 'LIVE_EVENTS_FORBIDDEN'
  | 'POLLING_FORBIDDEN'
  | 'STREAMING_FORBIDDEN'
  | 'EXECUTION_TRIGGER_FORBIDDEN'
  | 'WALLET_ACCESS_FORBIDDEN'
  | 'API_KEY_USAGE_FORBIDDEN';

/**
 * A safe error from a provider boundary operation.
 * Never contains raw secrets, private keys, stack traces, RPC URLs, or API keys.
 */
export interface ProviderError {
  /** Machine-readable error code — safe to display */
  readonly code: ProviderErrorCode;
  /** Human-readable message — safe to display */
  readonly message: string;
  /** Always true — this error is safe to display in logs or Telegram */
  readonly safeToDisplay: true;
}

/**
 * A successful provider result.
 */
export interface ProviderOk<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * A failed provider result.
 */
export interface ProviderErr {
  readonly ok: false;
  readonly error: ProviderError;
}

/**
 * Result type for provider boundary operations.
 * Methods return this instead of throwing for expected disabled/forbidden conditions.
 */
export type ProviderResult<T> = ProviderOk<T> | ProviderErr;

/** Construct a successful provider result. */
export function providerOk<T>(value: T): ProviderOk<T> {
  return { ok: true, value };
}

/** Construct a failed provider result. */
export function providerErr(code: ProviderErrorCode, message: string): ProviderErr {
  return { ok: false, error: { code, message, safeToDisplay: true } };
}

/** Type guard: returns true if the result is successful. */
export function isProviderOk<T>(result: ProviderResult<T>): result is ProviderOk<T> {
  return result.ok;
}

/** Type guard: returns true if the result is an error. */
export function isProviderErr<T>(result: ProviderResult<T>): result is ProviderErr {
  return !result.ok;
}

/**
 * Boundary interface for a read-only event provider.
 *
 * Defines what a provider boundary exposes — type, status, capabilities, config,
 * and human-readable explanation of why it is disabled.
 *
 * All Phase 7B implementations are permanently disabled.
 * Optional lifecycle methods, if present, always return disabled/forbidden results.
 * They must never connect, stream, poll, emit live events, or trigger execution.
 */
export interface EventProviderBoundary {
  /** Returns the provider type classification. */
  getType(): EventProviderType;
  /** Returns the operational status. Always 'disabled' in Phase 7B. */
  getStatus(): EventProviderStatus;
  /** Returns all capability flags. All false in Phase 7B. */
  getCapabilities(): EventProviderCapabilities;
  /** Returns provider config. All permissions false in Phase 7B. */
  getConfig(): EventProviderConfig;
  /** Returns a human-readable explanation of why this provider is disabled. Safe to display. */
  explainDisabledReason(): string;
  /**
   * Asserts the provider is disabled. Always a no-op — provider is always disabled.
   * Does not throw.
   */
  assertDisabled(): void;

  // Optional lifecycle methods — always return disabled/forbidden results if present.
  // Must never connect, stream, poll, emit live events, or trigger execution.

  /** Attempt to connect — always returns PROVIDER_DISABLED error. */
  connect?(): ProviderResult<never>;
  /** Attempt to disconnect — always returns ok (no-op; was never connected). */
  disconnect?(): ProviderResult<void>;
  /** Attempt to poll — always returns POLLING_FORBIDDEN error. */
  poll?(): ProviderResult<never>;
  /** Attempt to subscribe — always returns LIVE_EVENTS_FORBIDDEN error. */
  subscribe?(): ProviderResult<never>;
  /** Attempt to start — always returns PROVIDER_DISABLED error. */
  start?(): ProviderResult<never>;
  /** Attempt to stop — always returns ok (no-op; was never started). */
  stop?(): ProviderResult<void>;
}

/**
 * Human-readable disabled reasons for each provider type.
 * Safe to display in logs and Telegram.
 */
const PROVIDER_DISABLED_REASONS: Record<EventProviderType, string> = {
  helius_disabled:
    'Helius provider boundary: disabled. No Helius SDK installed. ' +
    'No RPC endpoint configured. No live event streaming. Phase 7B only.',
  websocket_disabled:
    'WebSocket provider boundary: disabled. No WebSocket client installed. ' +
    'No connection attempted. No live event streaming. Phase 7B only.',
  yellowstone_disabled:
    'Yellowstone/Geyser provider boundary: disabled. No Yellowstone or Geyser ' +
    'packages installed. No gRPC connection. No live event streaming. Phase 7B only.',
  polling_disabled:
    'Polling provider boundary: disabled. No polling loop. ' +
    'No external endpoints polled. No live event ingestion. Phase 7B only.',
  mock_disabled:
    'Mock provider boundary: disabled. No mock events emitted. ' +
    'No network simulation. Phase 7B only.',
  unknown_disabled:
    'Unknown provider boundary: disabled. Provider type unrecognised. Phase 7B only.',
};

/**
 * A fully-disabled event provider boundary.
 *
 * Safe to instantiate and inspect. Never connects, never streams, never polls,
 * never emits live events, never triggers execution, and loads no SDK.
 *
 * All lifecycle methods return safe disabled/forbidden result objects.
 */
export class DisabledEventProvider implements EventProviderBoundary {
  private readonly _type: EventProviderType;

  constructor(type: EventProviderType = 'unknown_disabled') {
    this._type = type;
  }

  getType(): EventProviderType {
    return this._type;
  }

  getStatus(): EventProviderStatus {
    return 'disabled';
  }

  getCapabilities(): EventProviderCapabilities {
    return DISABLED_PROVIDER_CAPABILITIES;
  }

  getConfig(): EventProviderConfig {
    return DISABLED_PROVIDER_CONFIG;
  }

  explainDisabledReason(): string {
    return PROVIDER_DISABLED_REASONS[this._type];
  }

  assertDisabled(): void {
    // Provider is always disabled — this assertion always passes silently.
  }

  connect(): ProviderResult<never> {
    return providerErr(
      'PROVIDER_DISABLED',
      `connect() forbidden: ${this.explainDisabledReason()}`,
    );
  }

  disconnect(): ProviderResult<void> {
    // No-op: provider was never started; disconnect is always safe.
    return providerOk(undefined);
  }

  poll(): ProviderResult<never> {
    return providerErr(
      'POLLING_FORBIDDEN',
      'poll() forbidden: polling is disabled. No external endpoints polled. Phase 7B only.',
    );
  }

  subscribe(): ProviderResult<never> {
    return providerErr(
      'LIVE_EVENTS_FORBIDDEN',
      'subscribe() forbidden: live event subscription is disabled. No streaming. Phase 7B only.',
    );
  }

  start(): ProviderResult<never> {
    return providerErr(
      'PROVIDER_DISABLED',
      `start() forbidden: ${this.explainDisabledReason()}`,
    );
  }

  stop(): ProviderResult<void> {
    // No-op: provider was never started; stop is always safe.
    return providerOk(undefined);
  }
}
