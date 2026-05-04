/**
 * Phase 7A — Event bus interface and subscription types.
 *
 * Defines the IEventBus contract for the in-memory event bus.
 * No network, no Solana, no wallet, no execution.
 */

import type { EventEnvelope } from './event-envelope.js';
import type { EventEngineResult } from './errors.js';

/**
 * A unique identifier for an event handler subscription.
 */
export type SubscriptionId = string;

/**
 * An event handler function.
 * Receives a validated EventEnvelope.
 * Must not throw — errors are caught and isolated by the bus.
 * Must not perform network, RPC, signing, sending, or execution.
 */
export type EventHandler = (event: EventEnvelope) => void;

/**
 * Registration record for a subscriber.
 */
export interface EventSubscription {
  readonly id: SubscriptionId;
  readonly handler: EventHandler;
  readonly registeredAt: string;
}

/**
 * Runtime statistics for the event bus.
 */
export interface EventBusStats {
  /** Total events successfully published since bus creation or last clear. */
  readonly totalPublished: number;
  /** Total events rejected (validation failure). */
  readonly totalRejected: number;
  /** Total handler invocations (across all subscribers). */
  readonly totalHandlerCalls: number;
  /** Total handler failures caught and isolated. */
  readonly totalHandlerFailures: number;
  /** Number of currently registered subscribers. */
  readonly subscriberCount: number;
  /** Number of events currently in the recent history buffer. */
  readonly historySize: number;
}

/**
 * The event bus interface.
 *
 * Responsibilities:
 *   - accept and validate published events
 *   - dispatch events to registered handlers
 *   - maintain a bounded recent-event history
 *   - provide stats and query utilities
 *
 * Safety invariants:
 *   - one handler failure must not crash the bus or other handlers
 *   - history is bounded by maxHistory
 *   - no network calls
 *   - no execution triggers
 */
export interface IEventBus {
  /**
   * Publish an event to the bus.
   * Validates the envelope first; returns an error if invalid.
   * On success, dispatches to all registered handlers and adds to history.
   */
  publish(event: EventEnvelope): EventEngineResult<void>;

  /**
   * Register a handler to receive all future events.
   * Returns a SubscriptionId for later unsubscription.
   */
  subscribe(handler: EventHandler): SubscriptionId;

  /**
   * Remove a previously registered handler.
   * Idempotent — calling with an unknown id does nothing.
   */
  unsubscribe(id: SubscriptionId): void;

  /**
   * Return the most recent events from the history buffer.
   * @param limit Maximum number of events to return (clamped to [1, maxHistory]).
   */
  getRecent(limit: number): readonly EventEnvelope[];

  /**
   * Return current bus statistics.
   */
  getStats(): EventBusStats;

  /**
   * Clear all history, subscribers, and stats.
   * Intended for test use or controlled reset only.
   */
  clear(): void;
}
