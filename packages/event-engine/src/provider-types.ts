/**
 * Phase 7B — Disabled read-only event provider type and status models.
 *
 * All provider types are disabled in Phase 7B.
 * No provider connects to Solana, uses WebSockets, polls external endpoints,
 * or emits live chain events.
 */

/**
 * Classification of an event provider boundary.
 *
 * All variants are disabled in Phase 7B.
 * These are model-only placeholders — no runtime SDKs are loaded.
 */
export type EventProviderType =
  | 'helius_disabled'
  | 'websocket_disabled'
  | 'yellowstone_disabled'
  | 'polling_disabled'
  | 'mock_disabled'
  | 'unknown_disabled';

export const EVENT_PROVIDER_TYPES: readonly EventProviderType[] = [
  'helius_disabled',
  'websocket_disabled',
  'yellowstone_disabled',
  'polling_disabled',
  'mock_disabled',
  'unknown_disabled',
] as const;

/**
 * Operational status of an event provider boundary.
 *
 * All providers are disabled in Phase 7B.
 */
export type EventProviderStatus =
  | 'disabled'
  | 'unavailable'
  | 'unsupported'
  | 'mock_only'
  | 'future_not_available';

export const EVENT_PROVIDER_STATUSES: readonly EventProviderStatus[] = [
  'disabled',
  'unavailable',
  'unsupported',
  'mock_only',
  'future_not_available',
] as const;
