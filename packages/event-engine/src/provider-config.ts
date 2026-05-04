/**
 * Phase 7D — Disabled provider configuration models and validation.
 *
 * Defines safe, fail-closed provider configuration types for future read-only
 * provider integration. All live/network/API-key permissions remain false.
 *
 * Safety invariants:
 *   - All live, network, RPC, WebSocket, polling, streaming, API-key fields are false.
 *   - Input attempts to enable unsafe permissions are captured (unsafeRequested + reasons).
 *   - Raw endpoint URLs and API key values are never stored or returned.
 *   - Only boolean presence/configured status is exposed where needed.
 *   - Provider config never triggers provider startup or network activity.
 *
 * No network, no Solana, no wallet, no SDK, no execution.
 */

/**
 * Safe machine-readable error codes for provider config validation.
 * All codes are safe to log and display — no secrets, no stack traces.
 */
export type ProviderConfigErrorCode =
  | 'PROVIDER_CONFIG_DISABLED'
  | 'PROVIDER_CONFIG_UNSAFE_REQUESTED'
  | 'PROVIDER_CONFIG_NETWORK_FORBIDDEN'
  | 'PROVIDER_CONFIG_SOLANA_RPC_FORBIDDEN'
  | 'PROVIDER_CONFIG_WEBSOCKET_FORBIDDEN'
  | 'PROVIDER_CONFIG_POLLING_FORBIDDEN'
  | 'PROVIDER_CONFIG_STREAMING_FORBIDDEN'
  | 'PROVIDER_CONFIG_LIVE_EVENTS_FORBIDDEN'
  | 'PROVIDER_CONFIG_API_KEY_FORBIDDEN';

export const PROVIDER_CONFIG_ERROR_CODES: readonly ProviderConfigErrorCode[] = [
  'PROVIDER_CONFIG_DISABLED',
  'PROVIDER_CONFIG_UNSAFE_REQUESTED',
  'PROVIDER_CONFIG_NETWORK_FORBIDDEN',
  'PROVIDER_CONFIG_SOLANA_RPC_FORBIDDEN',
  'PROVIDER_CONFIG_WEBSOCKET_FORBIDDEN',
  'PROVIDER_CONFIG_POLLING_FORBIDDEN',
  'PROVIDER_CONFIG_STREAMING_FORBIDDEN',
  'PROVIDER_CONFIG_LIVE_EVENTS_FORBIDDEN',
  'PROVIDER_CONFIG_API_KEY_FORBIDDEN',
] as const;

/**
 * Provider config operational mode.
 *
 *   disabled              — provider is fully disabled (Phase 7D default)
 *   mock_only             — provider can only replay local fixture events
 *   future_live_not_available — placeholder for future controlled read-only use
 */
export type ProviderConfigMode =
  | 'disabled'
  | 'mock_only'
  | 'future_live_not_available';

export const PROVIDER_CONFIG_MODES: readonly ProviderConfigMode[] = [
  'disabled',
  'mock_only',
  'future_live_not_available',
] as const;

/**
 * Raw provider configuration input.
 *
 * Captures all fields that a caller may attempt to set.
 * Unsafe fields (any live/network/API-key flag set true) are captured as
 * unsafeRequested rather than honoured.
 *
 * Raw URL and API key string values are intentionally not preserved.
 * Only boolean presence is accepted to avoid credential leakage.
 */
export interface ProviderConfigInput {
  /** Provider type identifier — used for labelling only */
  readonly providerType: string;
  /** Whether caller requested the provider to be enabled */
  readonly enabled?: boolean;
  /** Whether caller requested network access */
  readonly allowNetwork?: boolean;
  /** Whether caller requested Solana RPC access */
  readonly allowSolanaRpc?: boolean;
  /** Whether caller requested WebSocket access */
  readonly allowWebSocket?: boolean;
  /** Whether caller requested polling access */
  readonly allowPolling?: boolean;
  /** Whether caller requested streaming access */
  readonly allowStreaming?: boolean;
  /** Whether caller requested live event access */
  readonly allowLiveEvents?: boolean;
  /** Whether caller requested API key usage */
  readonly allowApiKeyUsage?: boolean;
  /** Whether an endpoint URL was provided (raw URL is not stored) */
  readonly endpointConfigured?: boolean;
  /** Whether an API key was provided (raw key is not stored) */
  readonly apiKeyConfigured?: boolean;
}

/**
 * Safe, validated provider configuration.
 *
 * All live/network/API-key permissions are always false regardless of input.
 * Unsafe input attempts are captured in unsafeRequested and unsafeReasons.
 * Raw URLs and API keys are never stored — only boolean presence is surfaced.
 */
export interface ProviderConfigSafe {
  /** Provider type identifier */
  readonly providerType: string;
  /** Operational mode — always 'disabled' or 'mock_only' in Phase 7D */
  readonly mode: ProviderConfigMode;
  /** Whether the provider is enabled. Always false in Phase 7D. */
  readonly enabled: false;
  /** Whether network access is permitted. Always false. */
  readonly allowNetwork: false;
  /** Whether Solana RPC access is permitted. Always false. */
  readonly allowSolanaRpc: false;
  /** Whether WebSocket access is permitted. Always false. */
  readonly allowWebSocket: false;
  /** Whether polling is permitted. Always false. */
  readonly allowPolling: false;
  /** Whether streaming is permitted. Always false. */
  readonly allowStreaming: false;
  /** Whether live event access is permitted. Always false. */
  readonly allowLiveEvents: false;
  /** Whether API key usage is permitted. Always false. */
  readonly allowApiKeyUsage: false;
  /** Whether an endpoint was configured (raw URL never stored). */
  readonly endpointConfigured: boolean;
  /** Whether an API key was configured (raw key never stored). */
  readonly apiKeyConfigured: boolean;
  /** Whether any unsafe permission was requested. */
  readonly unsafeRequested: boolean;
  /** Human-readable reasons for unsafe attempts. Safe to display. */
  readonly unsafeReasons: readonly string[];
}

/**
 * Default disabled provider config constant.
 * All permissions are false. No unsafe requests.
 */
export const DEFAULT_PROVIDER_CONFIG_SAFE: ProviderConfigSafe = {
  providerType: 'unknown',
  mode: 'disabled',
  enabled: false,
  allowNetwork: false,
  allowSolanaRpc: false,
  allowWebSocket: false,
  allowPolling: false,
  allowStreaming: false,
  allowLiveEvents: false,
  allowApiKeyUsage: false,
  endpointConfigured: false,
  apiKeyConfigured: false,
  unsafeRequested: false,
  unsafeReasons: [],
} as const;

/**
 * A safe provider config validation error.
 * Never contains secrets, stack traces, raw URLs, or API keys.
 */
export interface ProviderConfigError {
  readonly code: ProviderConfigErrorCode;
  readonly message: string;
  readonly safeToDisplay: true;
}

/**
 * Result of provider config validation.
 */
export type ProviderConfigResult =
  | { readonly ok: true; readonly config: ProviderConfigSafe }
  | { readonly ok: false; readonly error: ProviderConfigError };

/**
 * Build a safe ProviderConfigError.
 */
function configErr(code: ProviderConfigErrorCode, message: string): ProviderConfigError {
  return { code, message, safeToDisplay: true };
}

/**
 * Validate and sanitise a ProviderConfigInput into a ProviderConfigSafe.
 *
 * Rules:
 *   - providerType must be a non-empty string.
 *   - Any unsafe flag (network/RPC/WebSocket/polling/streaming/live/API-key) set
 *     true is captured as unsafeRequested with a human-readable reason.
 *   - All permission fields in the output are always false.
 *   - Raw URL and API key values are never stored.
 *   - endpointConfigured/apiKeyConfigured are passed through as booleans.
 *   - Mode is 'disabled' if enabled is false (or absent); 'mock_only' if only
 *     mock-safe flags are requested; 'future_live_not_available' if any live
 *     flag was requested.
 */
export function validateProviderConfig(input: ProviderConfigInput): ProviderConfigResult {
  if (!input.providerType || typeof input.providerType !== 'string' || input.providerType.trim() === '') {
    return {
      ok: false,
      error: configErr(
        'PROVIDER_CONFIG_DISABLED',
        'providerType must be a non-empty string. Provider config rejected.',
      ),
    };
  }

  const unsafeReasons: string[] = [];

  if (input.enabled === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_UNSAFE_REQUESTED: enabled=true is not permitted. All providers remain disabled.',
    );
  }
  if (input.allowNetwork === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_NETWORK_FORBIDDEN: allowNetwork=true is forbidden. No network access permitted.',
    );
  }
  if (input.allowSolanaRpc === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_SOLANA_RPC_FORBIDDEN: allowSolanaRpc=true is forbidden. No Solana RPC permitted.',
    );
  }
  if (input.allowWebSocket === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_WEBSOCKET_FORBIDDEN: allowWebSocket=true is forbidden. No WebSocket permitted.',
    );
  }
  if (input.allowPolling === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_POLLING_FORBIDDEN: allowPolling=true is forbidden. No polling permitted.',
    );
  }
  if (input.allowStreaming === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_STREAMING_FORBIDDEN: allowStreaming=true is forbidden. No streaming permitted.',
    );
  }
  if (input.allowLiveEvents === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_LIVE_EVENTS_FORBIDDEN: allowLiveEvents=true is forbidden. No live events permitted.',
    );
  }
  if (input.allowApiKeyUsage === true) {
    unsafeReasons.push(
      'PROVIDER_CONFIG_API_KEY_FORBIDDEN: allowApiKeyUsage=true is forbidden. No API key usage permitted.',
    );
  }

  const unsafeRequested = unsafeReasons.length > 0;

  // Determine mode
  let mode: ProviderConfigMode;
  if (unsafeRequested) {
    mode = 'future_live_not_available';
  } else {
    mode = 'disabled';
  }

  const config: ProviderConfigSafe = {
    providerType: input.providerType.trim(),
    mode,
    enabled: false,
    allowNetwork: false,
    allowSolanaRpc: false,
    allowWebSocket: false,
    allowPolling: false,
    allowStreaming: false,
    allowLiveEvents: false,
    allowApiKeyUsage: false,
    endpointConfigured: input.endpointConfigured === true,
    apiKeyConfigured: input.apiKeyConfigured === true,
    unsafeRequested,
    unsafeReasons,
  };

  return { ok: true, config };
}

/**
 * Create a default disabled safe config for a named provider.
 * No input validation needed — output is always safe and disabled.
 */
export function createDisabledProviderConfig(providerType: string): ProviderConfigSafe {
  return {
    ...DEFAULT_PROVIDER_CONFIG_SAFE,
    providerType: providerType || 'unknown',
  };
}

/**
 * Return all known provider type names for Phase 7D.
 * These correspond to the EventProviderType variants from Phase 7B.
 */
export const PHASE_7D_PROVIDER_TYPES: readonly string[] = [
  'helius_disabled',
  'websocket_disabled',
  'yellowstone_disabled',
  'polling_disabled',
  'mock_disabled',
  'unknown_disabled',
] as const;
