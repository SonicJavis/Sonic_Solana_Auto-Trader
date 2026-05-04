/**
 * Phase 7A — InMemoryEventBus: local in-memory implementation of IEventBus.
 *
 * Features:
 *   - validates every event before dispatch
 *   - bounded recent-event history (default: 1000 entries)
 *   - handler failure isolation: one failing handler does not crash others
 *   - idempotent unsubscribe
 *   - no network, no Solana, no wallet, no execution
 *
 * Thread safety: JavaScript is single-threaded; no locks required.
 */

import type { EventEnvelope } from './event-envelope.js';
import { validateEventEnvelope } from './validation.js';
import { engineOk } from './errors.js';
import type { EventEngineResult } from './errors.js';
import type {
  IEventBus,
  EventHandler,
  SubscriptionId,
  EventBusStats,
  EventSubscription,
} from './event-bus.js';

/** Default maximum number of events retained in the history buffer. */
export const DEFAULT_MAX_HISTORY = 1_000;

/** Minimum allowed history limit. */
export const MIN_MAX_HISTORY = 1;

/** Maximum allowed history limit. */
export const MAX_MAX_HISTORY = 10_000;

/** Minimum allowed getRecent limit. */
export const MIN_RECENT_LIMIT = 1;

let _subscriptionCounter = 0;

function nextSubscriptionId(): SubscriptionId {
  _subscriptionCounter += 1;
  return `sub_${_subscriptionCounter}`;
}

export interface InMemoryEventBusOptions {
  /** Maximum number of events to retain in history. Clamped to [1, 10000]. */
  readonly maxHistory?: number | undefined;
}

/**
 * In-memory event bus.
 *
 * Usage:
 *   const bus = new InMemoryEventBus();
 *   const subId = bus.subscribe(event => { ... });
 *   bus.publish(envelope);
 *   bus.unsubscribe(subId);
 */
export class InMemoryEventBus implements IEventBus {
  private readonly maxHistory: number;
  private readonly history: EventEnvelope[] = [];
  private readonly subscribers = new Map<SubscriptionId, EventSubscription>();

  private _totalPublished = 0;
  private _totalRejected = 0;
  private _totalHandlerCalls = 0;
  private _totalHandlerFailures = 0;

  constructor(options?: InMemoryEventBusOptions) {
    const requested = options?.maxHistory ?? DEFAULT_MAX_HISTORY;
    this.maxHistory = Math.max(MIN_MAX_HISTORY, Math.min(MAX_MAX_HISTORY, requested));
  }

  publish(event: EventEnvelope): EventEngineResult<void> {
    const validation = validateEventEnvelope(event);
    if (!validation.ok) {
      this._totalRejected += 1;
      return validation;
    }

    const validated = validation.value;

    // Add to history, evict oldest if over limit
    this.history.push(validated);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this._totalPublished += 1;

    // Dispatch to all handlers; isolate failures
    for (const subscription of this.subscribers.values()) {
      this._totalHandlerCalls += 1;
      try {
        subscription.handler(validated);
      } catch {
        // One handler failure must not crash the bus or other handlers
        this._totalHandlerFailures += 1;
      }
    }

    return engineOk(undefined);
  }

  subscribe(handler: EventHandler): SubscriptionId {
    const id = nextSubscriptionId();
    const subscription: EventSubscription = {
      id,
      handler,
      registeredAt: new Date().toISOString(),
    };
    this.subscribers.set(id, subscription);
    return id;
  }

  unsubscribe(id: SubscriptionId): void {
    // Idempotent — silently ignore unknown ids
    this.subscribers.delete(id);
  }

  getRecent(limit: number): readonly EventEnvelope[] {
    const clamped = Math.max(MIN_RECENT_LIMIT, Math.min(this.maxHistory, Math.floor(limit)));
    return this.history.slice(-clamped);
  }

  getStats(): EventBusStats {
    return {
      totalPublished: this._totalPublished,
      totalRejected: this._totalRejected,
      totalHandlerCalls: this._totalHandlerCalls,
      totalHandlerFailures: this._totalHandlerFailures,
      subscriberCount: this.subscribers.size,
      historySize: this.history.length,
    };
  }

  clear(): void {
    this.history.length = 0;
    this.subscribers.clear();
    this._totalPublished = 0;
    this._totalRejected = 0;
    this._totalHandlerCalls = 0;
    this._totalHandlerFailures = 0;
  }
}

/**
 * Create a new InMemoryEventBus with default settings.
 * Convenience factory for consistent creation.
 */
export function createInMemoryEventBus(
  options?: InMemoryEventBusOptions,
): InMemoryEventBus {
  return new InMemoryEventBus(options);
}

/**
 * Convenience: build a minimal valid EventEnvelope for testing.
 * All fields are set to safe, local-only values.
 */
export function buildTestEvent(overrides?: Partial<EventEnvelope>): EventEnvelope {
  const base: EventEnvelope = {
    id: `test_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    category: 'system',
    type: 'test_event',
    source: 'internal',
    severity: 'info',
    timestamp: new Date().toISOString(),
    payload: {},
    safeToPersist: true,
    safeToDisplay: true,
  };
  if (overrides === undefined) return base;
  return { ...base, ...overrides };
}
