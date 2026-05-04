/**
 * Phase 7A — Event Engine core type definitions.
 *
 * Defines:
 *   - EventCategory: classification of events by domain area
 *   - EventSourceType: origin of events (internal systems only)
 *   - EventSeverity: importance/urgency level
 *
 * Safety notes:
 *   - future_chain and future_market are model-only placeholders.
 *     They must NOT trigger any provider, RPC, or network logic.
 *   - future_provider_disabled is a model-only placeholder for providers
 *     that will be structurally present but fully disabled.
 *   - No Solana, wallet, signing, sending, or execution types here.
 */

/**
 * Domain classification of an event.
 *
 * future_chain and future_market are placeholder values only.
 * They carry no network behaviour in Phase 7A.
 */
export type EventCategory =
  | 'system'
  | 'config'
  | 'mode'
  | 'safety'
  | 'audit'
  | 'pump_adapter'
  | 'future_chain'
  | 'future_market'
  | 'unknown';

export const EVENT_CATEGORIES: readonly EventCategory[] = [
  'system',
  'config',
  'mode',
  'safety',
  'audit',
  'pump_adapter',
  'future_chain',
  'future_market',
  'unknown',
] as const;

/**
 * Origin of an event — all internal/local in Phase 7A.
 *
 * future_provider_disabled is a placeholder for a future disabled provider
 * boundary. It must not imply any live network capability.
 */
export type EventSourceType =
  | 'internal'
  | 'worker'
  | 'telegram'
  | 'audit_repository'
  | 'state_service'
  | 'pump_adapter_mock'
  | 'future_provider_disabled';

export const EVENT_SOURCE_TYPES: readonly EventSourceType[] = [
  'internal',
  'worker',
  'telegram',
  'audit_repository',
  'state_service',
  'pump_adapter_mock',
  'future_provider_disabled',
] as const;

/**
 * Severity/importance of an event.
 */
export type EventSeverity = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export const EVENT_SEVERITIES: readonly EventSeverity[] = [
  'debug',
  'info',
  'warn',
  'error',
  'critical',
] as const;
