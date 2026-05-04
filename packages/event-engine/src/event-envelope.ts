/**
 * Phase 7A — EventEnvelope: the standard container for all bus events.
 *
 * Safety requirements:
 *   - payload must be serializable (no functions, classes, circular refs, raw Errors)
 *   - no raw secrets, private keys, tokens, or credentials in any field
 *   - safeToPersist and safeToDisplay must be set explicitly by the producer
 *   - timestamp must be a valid ISO-8601 string
 */

import type { EventCategory, EventSourceType, EventSeverity } from './types.js';

/**
 * Allowed payload value types.
 * Functions, class instances, Symbols, and raw Error objects are not permitted.
 * Circular structures are not permitted.
 */
export type EventPayloadValue =
  | string
  | number
  | boolean
  | null
  | readonly EventPayloadValue[]
  | { readonly [key: string]: EventPayloadValue };

/**
 * A serializable record of event-specific data.
 * Must not contain raw secrets, private keys, stack traces,
 * wallet addresses beyond a safe display representation, or
 * any non-serializable values.
 */
export type EventPayload = Record<string, EventPayloadValue>;

/**
 * The canonical event container for the in-memory event bus.
 *
 * Fields:
 *   id            — unique event identifier (UUID or opaque string, non-empty)
 *   category      — domain classification
 *   type          — specific event name within the category (non-empty, no spaces)
 *   source        — origin system
 *   severity      — importance level
 *   timestamp     — ISO-8601 creation time
 *   dedupeKey     — optional key for deduplication within a TTL window
 *   ttlMs         — optional TTL in milliseconds; events older than this are expired
 *   payload       — serializable event-specific data (no secrets)
 *   safeToPersist — whether this event may be written to an audit store
 *   safeToDisplay — whether this event may be shown in logs or Telegram
 */
export interface EventEnvelope {
  readonly id: string;
  readonly category: EventCategory;
  readonly type: string;
  readonly source: EventSourceType;
  readonly severity: EventSeverity;
  readonly timestamp: string;
  readonly dedupeKey?: string | undefined;
  readonly ttlMs?: number | undefined;
  readonly payload: EventPayload;
  readonly safeToPersist: boolean;
  readonly safeToDisplay: boolean;
}
