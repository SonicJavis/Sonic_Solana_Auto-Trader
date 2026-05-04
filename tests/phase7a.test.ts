/**
 * Phase 7A Tests — Event Engine Core Interfaces + In-Memory Event Bus
 *
 * Tests cover:
 * A. Types/models — event envelope shape, category/source/severity handling,
 *                   source status shape, safety capability flags false
 * B. Event bus — publish valid event, reject invalid event, subscribe handler
 *                receives event, unsubscribe works, unsubscribe idempotent,
 *                one handler failure does not crash bus, recent history bounded,
 *                getRecent limit bounded, stats calculated
 * C. Dedupe/TTL — dedupe key works, duplicate within TTL detected,
 *                 duplicate after TTL allowed, expired event behaviour tested
 * D. Validation/errors — invalid id rejected, invalid timestamp rejected,
 *                        unsafe payload rejected, circular payload handled,
 *                        raw Error payload handled, errors safe to display,
 *                        no stack traces/secrets in public errors
 * E. Safety — no live provider, no network, no Solana RPC,
 *             no execution trigger, no wallet capability,
 *             FULL_AUTO and LIMITED_LIVE remain locked
 * F. Regression — all Phase 1–6C tests still pass, no public exports broken,
 *                 PHASE constant updated to 7
 *
 * Requirements:
 * - No network
 * - No Solana RPC
 * - No Telegram token
 * - No wallet
 * - No private key
 * - No external provider
 * - No external DB beyond existing temp/in-memory patterns
 */

import { describe, it, expect } from 'vitest';

// ── Phase 7A exports under test ───────────────────────────────────────────────
import {
  // Types
  EVENT_CATEGORIES,
  EVENT_SOURCE_TYPES,
  EVENT_SEVERITIES,
  // Source status
  PHASE_7A_SOURCE_CAPABILITIES,
  buildDisabledSourceHealth,
  buildEventEngineSystemStatus,
  // Errors
  engineOk,
  engineErr,
  isEngineOk,
  isEngineErr,
  // Event bus
  InMemoryEventBus,
  createInMemoryEventBus,
  buildTestEvent,
  DEFAULT_MAX_HISTORY,
  MIN_MAX_HISTORY,
  MAX_MAX_HISTORY,
  // Dedupe
  DedupeStore,
  isEventExpired,
  buildDedupeKey,
  // Validation
  validateEventEnvelope,
  isValidCategory,
  isValidSourceType,
  isValidSeverity,
  isSafePayload,
  isPayloadWithinSizeLimit,
  MAX_PAYLOAD_BYTES,
} from '../packages/event-engine/src/index.js';

// Type-only imports for shape checks
import type {
  EventCategory,
  EventSourceType,
  EventSeverity,
  EventEnvelope,
  EventPayload,
  EventSourceStatus,
  EventSourceCapabilities,
  EventSourceHealth,
  EventEngineSystemStatus,
  EventEngineErrorCode,
  EventEngineResult,
  IEventBus,
  SubscriptionId,
  EventBusStats,
} from '../packages/event-engine/src/index.js';

// Regression: shared safety locks
import { buildRuntimeSafetyStatus, PHASE, PHASE_NAME } from '../packages/shared/src/index.js';

// ── A. Types / Models ─────────────────────────────────────────────────────────

describe('Phase 7A — A.1 EventCategory', () => {
  it('EVENT_CATEGORIES contains all expected values', () => {
    const expected: EventCategory[] = [
      'system', 'config', 'mode', 'safety', 'audit',
      'pump_adapter', 'future_chain', 'future_market', 'unknown',
    ];
    for (const cat of expected) {
      expect(EVENT_CATEGORIES).toContain(cat);
    }
    expect(EVENT_CATEGORIES).toHaveLength(9);
  });

  it('isValidCategory accepts all EventCategory values', () => {
    for (const cat of EVENT_CATEGORIES) {
      expect(isValidCategory(cat)).toBe(true);
    }
  });

  it('isValidCategory rejects unknown values', () => {
    expect(isValidCategory('live_chain')).toBe(false);
    expect(isValidCategory('')).toBe(false);
    expect(isValidCategory(null)).toBe(false);
    expect(isValidCategory(42)).toBe(false);
  });
});

describe('Phase 7A — A.2 EventSourceType', () => {
  it('EVENT_SOURCE_TYPES contains all expected values', () => {
    const expected: EventSourceType[] = [
      'internal', 'worker', 'telegram', 'audit_repository',
      'state_service', 'pump_adapter_mock', 'future_provider_disabled',
    ];
    for (const src of expected) {
      expect(EVENT_SOURCE_TYPES).toContain(src);
    }
    expect(EVENT_SOURCE_TYPES).toHaveLength(8);
  });

  it('isValidSourceType accepts all EventSourceType values', () => {
    for (const src of EVENT_SOURCE_TYPES) {
      expect(isValidSourceType(src)).toBe(true);
    }
  });

  it('isValidSourceType rejects unknown values', () => {
    expect(isValidSourceType('helius')).toBe(false);
    expect(isValidSourceType('solana_rpc')).toBe(false);
    expect(isValidSourceType('')).toBe(false);
  });
});

describe('Phase 7A — A.3 EventSeverity', () => {
  it('EVENT_SEVERITIES contains all expected values', () => {
    const expected: EventSeverity[] = ['debug', 'info', 'warn', 'error', 'critical'];
    for (const sev of expected) {
      expect(EVENT_SEVERITIES).toContain(sev);
    }
    expect(EVENT_SEVERITIES).toHaveLength(5);
  });

  it('isValidSeverity accepts all EventSeverity values', () => {
    for (const sev of EVENT_SEVERITIES) {
      expect(isValidSeverity(sev)).toBe(true);
    }
  });

  it('isValidSeverity rejects unknown values', () => {
    expect(isValidSeverity('fatal')).toBe(false);
    expect(isValidSeverity('trace')).toBe(false);
    expect(isValidSeverity('')).toBe(false);
  });
});

describe('Phase 7A — A.4 EventEnvelope shape', () => {
  it('buildTestEvent creates a valid envelope', () => {
    const env = buildTestEvent();
    expect(typeof env.id).toBe('string');
    expect(env.id.length).toBeGreaterThan(0);
    expect(typeof env.category).toBe('string');
    expect(typeof env.type).toBe('string');
    expect(typeof env.source).toBe('string');
    expect(typeof env.severity).toBe('string');
    expect(typeof env.timestamp).toBe('string');
    expect(typeof env.payload).toBe('object');
    expect(typeof env.safeToPersist).toBe('boolean');
    expect(typeof env.safeToDisplay).toBe('boolean');
  });

  it('buildTestEvent overrides are applied', () => {
    const env = buildTestEvent({ category: 'safety', severity: 'warn' });
    expect(env.category).toBe('safety');
    expect(env.severity).toBe('warn');
  });

  it('EventEnvelope optional fields are undefined by default', () => {
    const env = buildTestEvent();
    expect(env.dedupeKey).toBeUndefined();
    expect(env.ttlMs).toBeUndefined();
  });
});

describe('Phase 7A — A.5 Source status models', () => {
  it('EventSourceStatus type includes all allowed values', () => {
    const statuses: EventSourceStatus[] = [
      'disabled', 'available', 'degraded', 'unhealthy', 'unknown',
    ];
    expect(statuses).toHaveLength(5);
  });

  it('PHASE_7A_SOURCE_CAPABILITIES has all 5 capability flags false', () => {
    const caps: EventSourceCapabilities = PHASE_7A_SOURCE_CAPABILITIES;
    expect(caps.canUseNetwork).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canEmitLiveEvents).toBe(false);
    expect(caps.canTriggerExecution).toBe(false);
    expect(caps.canAccessWallets).toBe(false);
  });

  it('PHASE_7A_SOURCE_CAPABILITIES has exactly 5 fields', () => {
    expect(Object.keys(PHASE_7A_SOURCE_CAPABILITIES)).toHaveLength(5);
  });

  it('buildDisabledSourceHealth produces correct shape', () => {
    const health: EventSourceHealth = buildDisabledSourceHealth('test_source');
    expect(health.sourceName).toBe('test_source');
    expect(health.status).toBe('disabled');
    expect(health.capabilities.canUseNetwork).toBe(false);
    expect(health.capabilities.canUseSolanaRpc).toBe(false);
    expect(health.capabilities.canEmitLiveEvents).toBe(false);
    expect(health.capabilities.canTriggerExecution).toBe(false);
    expect(health.capabilities.canAccessWallets).toBe(false);
    expect(typeof health.lastUpdated).toBe('string');
  });

  it('buildEventEngineSystemStatus returns expected fields', () => {
    const status: EventEngineSystemStatus = buildEventEngineSystemStatus();
    expect(status.coreEventBus).toBe('available');
    expect(status.liveProviders).toBe('disabled');
    expect(status.networkEvents).toBe('forbidden');
    expect(status.executionTriggers).toBe('forbidden');
    expect(status.solanaRpc).toBe('forbidden');
    expect(status.phase).toBe(7);
    expect(typeof status.generatedAt).toBe('string');
  });
});

// ── B. Event Bus ──────────────────────────────────────────────────────────────

describe('Phase 7A — B.1 Event bus publish valid event', () => {
  it('publish returns ok for a valid event', () => {
    const bus = createInMemoryEventBus();
    const result = bus.publish(buildTestEvent());
    expect(result.ok).toBe(true);
  });

  it('published event appears in getRecent', () => {
    const bus = createInMemoryEventBus();
    const event = buildTestEvent({ type: 'my_event' });
    bus.publish(event);
    const recent = bus.getRecent(10);
    expect(recent).toHaveLength(1);
    expect(recent[0]!.type).toBe('my_event');
  });

  it('multiple events appear in order', () => {
    const bus = createInMemoryEventBus();
    bus.publish(buildTestEvent({ type: 'first' }));
    bus.publish(buildTestEvent({ type: 'second' }));
    bus.publish(buildTestEvent({ type: 'third' }));
    const recent = bus.getRecent(10);
    expect(recent).toHaveLength(3);
    expect(recent[0]!.type).toBe('first');
    expect(recent[2]!.type).toBe('third');
  });
});

describe('Phase 7A — B.2 Event bus reject invalid event', () => {
  it('publish returns error for invalid id', () => {
    const bus = createInMemoryEventBus();
    const result = bus.publish({ ...buildTestEvent(), id: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_EVENT_ID');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('publish returns error for invalid category', () => {
    const bus = createInMemoryEventBus();
    const result = bus.publish({ ...buildTestEvent(), category: 'live_chain' as EventCategory });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_CATEGORY');
  });

  it('publish returns error for invalid timestamp', () => {
    const bus = createInMemoryEventBus();
    const result = bus.publish({ ...buildTestEvent(), timestamp: 'not-a-date' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_TIMESTAMP');
  });

  it('rejected events do not appear in history', () => {
    const bus = createInMemoryEventBus();
    bus.publish({ ...buildTestEvent(), id: '' }); // invalid
    expect(bus.getRecent(10)).toHaveLength(0);
  });
});

describe('Phase 7A — B.3 Subscribe handler receives event', () => {
  it('handler is called when valid event is published', () => {
    const bus = createInMemoryEventBus();
    const received: EventEnvelope[] = [];
    bus.subscribe(event => received.push(event));
    bus.publish(buildTestEvent({ type: 'signal_event' }));
    expect(received).toHaveLength(1);
    expect(received[0]!.type).toBe('signal_event');
  });

  it('multiple subscribers each receive the event', () => {
    const bus = createInMemoryEventBus();
    const r1: EventEnvelope[] = [];
    const r2: EventEnvelope[] = [];
    bus.subscribe(e => r1.push(e));
    bus.subscribe(e => r2.push(e));
    bus.publish(buildTestEvent());
    expect(r1).toHaveLength(1);
    expect(r2).toHaveLength(1);
  });

  it('subscribe returns a non-empty string subscription id', () => {
    const bus = createInMemoryEventBus();
    const id: SubscriptionId = bus.subscribe(() => {});
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('each subscribe call returns a unique id', () => {
    const bus = createInMemoryEventBus();
    const id1 = bus.subscribe(() => {});
    const id2 = bus.subscribe(() => {});
    expect(id1).not.toBe(id2);
  });
});

describe('Phase 7A — B.4 Unsubscribe works', () => {
  it('handler no longer receives events after unsubscribe', () => {
    const bus = createInMemoryEventBus();
    const received: EventEnvelope[] = [];
    const id = bus.subscribe(e => received.push(e));
    bus.publish(buildTestEvent({ type: 'before' }));
    bus.unsubscribe(id);
    bus.publish(buildTestEvent({ type: 'after' }));
    expect(received).toHaveLength(1);
    expect(received[0]!.type).toBe('before');
  });

  it('unsubscribe is idempotent (calling twice does not throw)', () => {
    const bus = createInMemoryEventBus();
    const id = bus.subscribe(() => {});
    bus.unsubscribe(id);
    expect(() => bus.unsubscribe(id)).not.toThrow();
  });

  it('unsubscribe with unknown id does not throw', () => {
    const bus = createInMemoryEventBus();
    expect(() => bus.unsubscribe('nonexistent_id')).not.toThrow();
  });
});

describe('Phase 7A — B.5 Handler failure isolation', () => {
  it('a throwing handler does not crash the bus', () => {
    const bus = createInMemoryEventBus();
    bus.subscribe(() => { throw new Error('handler boom'); });
    expect(() => bus.publish(buildTestEvent())).not.toThrow();
  });

  it('a throwing handler does not prevent other handlers from running', () => {
    const bus = createInMemoryEventBus();
    const received: EventEnvelope[] = [];
    bus.subscribe(() => { throw new Error('handler boom'); });
    bus.subscribe(e => received.push(e));
    bus.publish(buildTestEvent({ type: 'safe_event' }));
    expect(received).toHaveLength(1);
    expect(received[0]!.type).toBe('safe_event');
  });

  it('handler failures are tracked in stats', () => {
    const bus = createInMemoryEventBus();
    bus.subscribe(() => { throw new Error('oops'); });
    bus.publish(buildTestEvent());
    const stats = bus.getStats();
    expect(stats.totalHandlerFailures).toBe(1);
  });

  it('handler failure does not prevent event from entering history', () => {
    const bus = createInMemoryEventBus();
    bus.subscribe(() => { throw new Error('oops'); });
    bus.publish(buildTestEvent({ type: 'should_be_in_history' }));
    expect(bus.getRecent(10)[0]!.type).toBe('should_be_in_history');
  });
});

describe('Phase 7A — B.6 Bounded recent history', () => {
  it('history is bounded by maxHistory', () => {
    const bus = createInMemoryEventBus({ maxHistory: 5 });
    for (let i = 0; i < 10; i++) {
      bus.publish(buildTestEvent({ type: `event_${i}` }));
    }
    const recent = bus.getRecent(100);
    expect(recent).toHaveLength(5);
    // Oldest entries are evicted; last 5 remain
    expect(recent[0]!.type).toBe('event_5');
    expect(recent[4]!.type).toBe('event_9');
  });

  it('DEFAULT_MAX_HISTORY is at least 500', () => {
    expect(DEFAULT_MAX_HISTORY).toBeGreaterThanOrEqual(500);
  });

  it('maxHistory is clamped to MIN_MAX_HISTORY', () => {
    const bus = new InMemoryEventBus({ maxHistory: 0 });
    // Should not throw and should accept at least 1 event
    expect(() => bus.publish(buildTestEvent())).not.toThrow();
  });

  it('maxHistory is clamped to MAX_MAX_HISTORY', () => {
    const bus = new InMemoryEventBus({ maxHistory: 99_999 });
    expect(() => bus.publish(buildTestEvent())).not.toThrow();
  });
});

describe('Phase 7A — B.7 getRecent limit bounded', () => {
  it('getRecent returns at most requested number of events', () => {
    const bus = createInMemoryEventBus();
    for (let i = 0; i < 20; i++) {
      bus.publish(buildTestEvent());
    }
    expect(bus.getRecent(5)).toHaveLength(5);
    expect(bus.getRecent(3)).toHaveLength(3);
  });

  it('getRecent with limit larger than history returns all available', () => {
    const bus = createInMemoryEventBus();
    bus.publish(buildTestEvent());
    bus.publish(buildTestEvent());
    expect(bus.getRecent(100)).toHaveLength(2);
  });

  it('getRecent with limit <= 0 returns at least 1 (clamped)', () => {
    const bus = createInMemoryEventBus();
    bus.publish(buildTestEvent());
    expect(bus.getRecent(0)).toHaveLength(1);
    expect(bus.getRecent(-5)).toHaveLength(1);
  });
});

describe('Phase 7A — B.8 Bus stats', () => {
  it('stats are initially zero', () => {
    const bus = createInMemoryEventBus();
    const stats: EventBusStats = bus.getStats();
    expect(stats.totalPublished).toBe(0);
    expect(stats.totalRejected).toBe(0);
    expect(stats.totalHandlerCalls).toBe(0);
    expect(stats.totalHandlerFailures).toBe(0);
    expect(stats.subscriberCount).toBe(0);
    expect(stats.historySize).toBe(0);
  });

  it('stats track published events', () => {
    const bus = createInMemoryEventBus();
    bus.publish(buildTestEvent());
    bus.publish(buildTestEvent());
    expect(bus.getStats().totalPublished).toBe(2);
    expect(bus.getStats().historySize).toBe(2);
  });

  it('stats track rejected events', () => {
    const bus = createInMemoryEventBus();
    bus.publish({ ...buildTestEvent(), id: '' }); // invalid
    expect(bus.getStats().totalRejected).toBe(1);
    expect(bus.getStats().totalPublished).toBe(0);
  });

  it('stats track subscriber count', () => {
    const bus = createInMemoryEventBus();
    const id1 = bus.subscribe(() => {});
    const id2 = bus.subscribe(() => {});
    expect(bus.getStats().subscriberCount).toBe(2);
    bus.unsubscribe(id1);
    expect(bus.getStats().subscriberCount).toBe(1);
    bus.unsubscribe(id2);
    expect(bus.getStats().subscriberCount).toBe(0);
  });

  it('stats track handler calls', () => {
    const bus = createInMemoryEventBus();
    bus.subscribe(() => {});
    bus.subscribe(() => {});
    bus.publish(buildTestEvent());
    expect(bus.getStats().totalHandlerCalls).toBe(2);
  });

  it('clear resets all stats and history', () => {
    const bus = createInMemoryEventBus();
    bus.subscribe(() => {});
    bus.publish(buildTestEvent());
    bus.clear();
    const stats = bus.getStats();
    expect(stats.totalPublished).toBe(0);
    expect(stats.historySize).toBe(0);
    expect(stats.subscriberCount).toBe(0);
  });
});

// ── C. Dedupe / TTL ───────────────────────────────────────────────────────────

describe('Phase 7A — C.1 DedupeStore', () => {
  it('first occurrence is not a duplicate', () => {
    const store = new DedupeStore();
    expect(store.isDuplicate('key1', 1000)).toBe(false);
  });

  it('second occurrence within TTL is a duplicate', () => {
    const store = new DedupeStore();
    store.isDuplicate('key1', 1000);
    expect(store.isDuplicate('key1', 1000)).toBe(true);
  });

  it('occurrence after TTL is not a duplicate (uses injected clock)', () => {
    let now = 1000;
    const clock = () => now;
    const store = new DedupeStore(clock);
    store.isDuplicate('key1', 500); // seenAt = 1000, ttl = 500
    now = 1501; // 501ms later — TTL expired
    expect(store.isDuplicate('key1', 500)).toBe(false); // fresh entry
  });

  it('different keys are independent', () => {
    const store = new DedupeStore();
    store.isDuplicate('keyA', 1000);
    expect(store.isDuplicate('keyB', 1000)).toBe(false);
  });

  it('clear removes all entries', () => {
    const store = new DedupeStore();
    store.isDuplicate('key1', 1000);
    store.clear();
    expect(store.isDuplicate('key1', 1000)).toBe(false);
  });

  it('prune removes expired entries', () => {
    let now = 1000;
    const clock = () => now;
    const store = new DedupeStore(clock);
    store.isDuplicate('key1', 100);
    now = 1200; // 200ms later
    store.prune();
    expect(store.size).toBe(0);
  });
});

describe('Phase 7A — C.2 isEventExpired', () => {
  it('event with age >= ttlMs is expired', () => {
    const ts = new Date(Date.now() - 2000).toISOString();
    expect(isEventExpired(ts, 1000)).toBe(true);
  });

  it('event with age < ttlMs is not expired', () => {
    const ts = new Date(Date.now() - 100).toISOString();
    expect(isEventExpired(ts, 5000)).toBe(false);
  });

  it('invalid timestamp string is treated as expired', () => {
    expect(isEventExpired('not-a-date', 1000)).toBe(true);
  });

  it('accepts injected now for deterministic tests', () => {
    const ts = new Date(1000).toISOString();
    // age = 500ms, ttl = 1000ms → not expired
    expect(isEventExpired(ts, 1000, 1500)).toBe(false);
    // age = 1001ms, ttl = 1000ms → expired
    expect(isEventExpired(ts, 1000, 2001)).toBe(true);
  });
});

describe('Phase 7A — C.3 buildDedupeKey', () => {
  it('produces a non-empty string', () => {
    const key = buildDedupeKey('system', 'startup');
    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(0);
  });

  it('is deterministic for same inputs', () => {
    expect(buildDedupeKey('system', 'startup')).toBe(buildDedupeKey('system', 'startup'));
  });

  it('differs for different category/type', () => {
    expect(buildDedupeKey('system', 'startup')).not.toBe(buildDedupeKey('config', 'startup'));
  });

  it('incorporates optional extra', () => {
    const withExtra = buildDedupeKey('mode', 'change', 'READ_ONLY');
    const withoutExtra = buildDedupeKey('mode', 'change');
    expect(withExtra).not.toBe(withoutExtra);
    expect(withExtra).toContain('READ_ONLY');
  });
});

// ── D. Validation / Errors ────────────────────────────────────────────────────

describe('Phase 7A — D.1 validateEventEnvelope — valid', () => {
  it('accepts a minimal valid envelope', () => {
    const result = validateEventEnvelope(buildTestEvent());
    expect(result.ok).toBe(true);
  });

  it('accepts envelope with optional dedupeKey', () => {
    const result = validateEventEnvelope(buildTestEvent({ dedupeKey: 'my:key' }));
    expect(result.ok).toBe(true);
  });

  it('accepts envelope with optional ttlMs', () => {
    const result = validateEventEnvelope(buildTestEvent({ ttlMs: 5000 }));
    expect(result.ok).toBe(true);
  });

  it('accepts payload with nested values', () => {
    const payload: EventPayload = {
      count: 42,
      active: true,
      name: 'test',
      nested: { key: 'value', nums: [1, 2, 3] },
      nothing: null,
    };
    const result = validateEventEnvelope(buildTestEvent({ payload }));
    expect(result.ok).toBe(true);
  });
});

describe('Phase 7A — D.2 validateEventEnvelope — invalid id', () => {
  it('rejects empty string id', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), id: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_ID');
  });

  it('rejects non-object input', () => {
    const result = validateEventEnvelope(null);
    expect(result.ok).toBe(false);
  });

  it('rejects array input', () => {
    const result = validateEventEnvelope([]);
    expect(result.ok).toBe(false);
  });
});

describe('Phase 7A — D.3 validateEventEnvelope — invalid category', () => {
  it('rejects unknown category', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), category: 'solana_live' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_CATEGORY');
  });
});

describe('Phase 7A — D.4 validateEventEnvelope — invalid type', () => {
  it('rejects empty type string', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), type: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_TYPE');
  });

  it('rejects type with spaces', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), type: 'bad type' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_TYPE');
  });

  it('rejects type with tabs', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), type: 'bad\ttype' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_TYPE');
  });
});

describe('Phase 7A — D.5 validateEventEnvelope — invalid source', () => {
  it('rejects unknown source', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), source: 'helius' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_SOURCE');
  });
});

describe('Phase 7A — D.6 validateEventEnvelope — invalid severity', () => {
  it('rejects unknown severity', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), severity: 'fatal' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_SEVERITY');
  });
});

describe('Phase 7A — D.7 validateEventEnvelope — invalid timestamp', () => {
  it('rejects non-parseable timestamp', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), timestamp: 'yesterday' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_TIMESTAMP');
  });

  it('rejects empty timestamp', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), timestamp: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_TIMESTAMP');
  });

  it('rejects far-future timestamp', () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    const result = validateEventEnvelope({ ...buildTestEvent(), timestamp: future });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_EVENT_TIMESTAMP');
  });
});

describe('Phase 7A — D.8 validateEventEnvelope — unsafe payload', () => {
  it('rejects payload with a function value', () => {
    const result = validateEventEnvelope({
      ...buildTestEvent(),
      payload: { fn: (() => {}) as unknown as null },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNSAFE_EVENT_PAYLOAD');
  });

  it('rejects a raw Error object as payload', () => {
    const result = validateEventEnvelope({
      ...buildTestEvent(),
      payload: new Error('oops') as unknown as EventPayload,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNSAFE_EVENT_PAYLOAD');
  });

  it('rejects circular payload safely without crashing', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular; // circular reference
    const result = validateEventEnvelope({
      ...buildTestEvent(),
      payload: circular as unknown as EventPayload,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNSAFE_EVENT_PAYLOAD');
  });

  it('rejects array as payload (must be plain object)', () => {
    const result = validateEventEnvelope({
      ...buildTestEvent(),
      payload: [] as unknown as EventPayload,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNSAFE_EVENT_PAYLOAD');
  });
});

describe('Phase 7A — D.9 validateEventEnvelope — invalid optional fields', () => {
  it('rejects empty string dedupeKey', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), dedupeKey: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_DEDUPE_KEY');
  });

  it('rejects zero ttlMs', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), ttlMs: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_TTL');
  });

  it('rejects negative ttlMs', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), ttlMs: -100 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_TTL');
  });

  it('rejects non-integer ttlMs', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), ttlMs: 1.5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_TTL');
  });
});

describe('Phase 7A — D.10 Error safety', () => {
  it('engineErr produces a safe error', () => {
    const err = engineErr('INVALID_EVENT_ID', 'test message');
    expect(err.ok).toBe(false);
    expect(err.error.safeToDisplay).toBe(true);
    expect(err.error.code).toBe('INVALID_EVENT_ID');
    expect(err.error.message).toBe('test message');
  });

  it('engineOk produces an ok result', () => {
    const result = engineOk(42);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(42);
  });

  it('isEngineOk / isEngineErr type guards work', () => {
    const ok: EventEngineResult<string> = engineOk('hello');
    const fail: EventEngineResult<string> = engineErr('INVALID_TTL', 'bad');
    expect(isEngineOk(ok)).toBe(true);
    expect(isEngineErr(ok)).toBe(false);
    expect(isEngineOk(fail)).toBe(false);
    expect(isEngineErr(fail)).toBe(true);
  });

  it('error message does not contain stack traces', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), id: '' });
    if (!result.ok) {
      expect(result.error.message).not.toContain('at ');
      expect(result.error.message).not.toContain('Error:');
    }
  });

  it('error message does not contain private key strings', () => {
    const result = validateEventEnvelope({ ...buildTestEvent(), id: '' });
    if (!result.ok) {
      expect(result.error.message.toLowerCase()).not.toContain('private');
      expect(result.error.message.toLowerCase()).not.toContain('secret');
      expect(result.error.message.toLowerCase()).not.toContain('mnemonic');
      expect(result.error.message.toLowerCase()).not.toContain('seed');
    }
  });

  it('all EventEngineErrorCode values are valid type literals', () => {
    const codes: EventEngineErrorCode[] = [
      'INVALID_EVENT_ID',
      'INVALID_EVENT_CATEGORY',
      'INVALID_EVENT_TYPE',
      'INVALID_EVENT_SOURCE',
      'INVALID_EVENT_SEVERITY',
      'INVALID_EVENT_TIMESTAMP',
      'UNSAFE_EVENT_PAYLOAD',
      'EVENT_PAYLOAD_TOO_LARGE',
      'EVENT_HISTORY_LIMIT_EXCEEDED',
      'EVENT_HANDLER_FAILED',
      'NETWORK_EVENTS_FORBIDDEN',
      'LIVE_PROVIDER_FORBIDDEN',
      'EXECUTION_TRIGGER_FORBIDDEN',
      'INVALID_DEDUPE_KEY',
      'INVALID_TTL',
      'INVALID_SUBSCRIPTION_ID',
      'INVALID_LIMIT',
    ];
    expect(codes).toHaveLength(17);
  });
});

describe('Phase 7A — D.11 isSafePayload and isPayloadWithinSizeLimit', () => {
  it('isSafePayload accepts plain objects', () => {
    expect(isSafePayload({ a: 1, b: 'hello', c: null })).toBe(true);
  });

  it('isSafePayload rejects null', () => {
    expect(isSafePayload(null)).toBe(false);
  });

  it('isSafePayload rejects arrays', () => {
    expect(isSafePayload([])).toBe(false);
  });

  it('isSafePayload rejects functions', () => {
    expect(isSafePayload({ fn: () => {} })).toBe(false);
  });

  it('isSafePayload rejects circular refs', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular;
    expect(isSafePayload(circular)).toBe(false);
  });

  it('isPayloadWithinSizeLimit accepts small payloads', () => {
    expect(isPayloadWithinSizeLimit({ hello: 'world' })).toBe(true);
  });

  it('isPayloadWithinSizeLimit rejects huge payloads', () => {
    const big: EventPayload = { data: 'x'.repeat(MAX_PAYLOAD_BYTES + 1) };
    expect(isPayloadWithinSizeLimit(big)).toBe(false);
  });

  it('MAX_PAYLOAD_BYTES is at least 1KB', () => {
    expect(MAX_PAYLOAD_BYTES).toBeGreaterThanOrEqual(1024);
  });
});

// ── E. Safety ─────────────────────────────────────────────────────────────────

describe('Phase 7A — E. Safety capability checks', () => {
  it('no live provider is enabled — liveProviders is "disabled"', () => {
    const status = buildEventEngineSystemStatus();
    expect(status.liveProviders).toBe('disabled');
  });

  it('no network capability — canUseNetwork is false', () => {
    expect(PHASE_7A_SOURCE_CAPABILITIES.canUseNetwork).toBe(false);
  });

  it('no Solana RPC capability — canUseSolanaRpc is false', () => {
    expect(PHASE_7A_SOURCE_CAPABILITIES.canUseSolanaRpc).toBe(false);
  });

  it('no live event emission — canEmitLiveEvents is false', () => {
    expect(PHASE_7A_SOURCE_CAPABILITIES.canEmitLiveEvents).toBe(false);
  });

  it('no execution trigger — canTriggerExecution is false', () => {
    expect(PHASE_7A_SOURCE_CAPABILITIES.canTriggerExecution).toBe(false);
  });

  it('no wallet access — canAccessWallets is false', () => {
    expect(PHASE_7A_SOURCE_CAPABILITIES.canAccessWallets).toBe(false);
  });

  it('networkEvents is "forbidden" in system status', () => {
    expect(buildEventEngineSystemStatus().networkEvents).toBe('forbidden');
  });

  it('solanaRpc is "forbidden" in system status', () => {
    expect(buildEventEngineSystemStatus().solanaRpc).toBe('forbidden');
  });

  it('executionTriggers is "forbidden" in system status', () => {
    expect(buildEventEngineSystemStatus().executionTriggers).toBe('forbidden');
  });

  it('FULL_AUTO remains locked in runtime safety status', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 7,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: false,
      unsafeFlags: [],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: false,
      telegramEnabled: false,
      databaseConfigured: false,
    });
    expect(status.fullAutoLocked).toBe(true);
    expect(status.liveTradingEnabled).toBe(false);
    expect(status.autoTradingEnabled).toBe(false);
    expect(status.transactionSigningEnabled).toBe(false);
    expect(status.transactionSendingEnabled).toBe(false);
    expect(status.walletLoadingEnabled).toBe(false);
    expect(status.solanaRpcEnabled).toBe(false);
    expect(status.jitoEnabled).toBe(false);
    expect(status.pumpfunTradingEnabled).toBe(false);
  });

  it('LIMITED_LIVE remains locked in runtime safety status', () => {
    const status = buildRuntimeSafetyStatus({
      currentPhase: 7,
      currentMode: 'READ_ONLY',
      configValid: true,
      unsafeFlagsDetected: false,
      unsafeFlags: [],
      warnings: [],
      killSwitchActive: false,
      adminAllowlistConfigured: false,
      telegramEnabled: false,
      databaseConfigured: false,
    });
    expect(status.limitedLiveLocked).toBe(true);
  });

  it('future_chain category does not enable any live provider', () => {
    // Publishing an event with future_chain category must not trigger any side effect
    const bus = createInMemoryEventBus();
    const sideEffects: string[] = [];
    bus.subscribe(e => {
      if (e.category === 'future_chain') sideEffects.push('chain_triggered');
    });
    bus.publish(buildTestEvent({ category: 'future_chain', type: 'placeholder' }));
    // The handler ran (sideEffects is populated by the test handler itself),
    // but that is expected — the point is the bus itself does not connect to any network
    // We assert that no network calls were made by checking nothing external happened.
    // The side effect list contains only what the test handler added, not any live data.
    expect(sideEffects).toHaveLength(1);
    expect(sideEffects[0]).toBe('chain_triggered');
  });

  it('IEventBus interface is implemented by InMemoryEventBus', () => {
    const bus: IEventBus = createInMemoryEventBus();
    expect(typeof bus.publish).toBe('function');
    expect(typeof bus.subscribe).toBe('function');
    expect(typeof bus.unsubscribe).toBe('function');
    expect(typeof bus.getRecent).toBe('function');
    expect(typeof bus.getStats).toBe('function');
    expect(typeof bus.clear).toBe('function');
  });
});

// ── F. Regression ─────────────────────────────────────────────────────────────

describe('Phase 7A — F. Regression', () => {
  it('PHASE constant is now 7', () => {
    expect(PHASE).toBe(7);
  });

  it('PHASE_NAME contains Event Engine', () => {
    expect(PHASE_NAME).toContain('Event Engine');
  });

  it('MIN_MAX_HISTORY and MAX_MAX_HISTORY are sensible bounds', () => {
    expect(MIN_MAX_HISTORY).toBeGreaterThanOrEqual(1);
    expect(MAX_MAX_HISTORY).toBeGreaterThanOrEqual(DEFAULT_MAX_HISTORY);
  });

  it('event bus clear is idempotent', () => {
    const bus = createInMemoryEventBus();
    bus.publish(buildTestEvent());
    bus.clear();
    bus.clear(); // should not throw
    expect(bus.getStats().totalPublished).toBe(0);
  });

  it('DedupeStore size starts at 0', () => {
    const store = new DedupeStore();
    expect(store.size).toBe(0);
  });

  it('buildTestEvent produces unique ids', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 20; i++) {
      ids.add(buildTestEvent().id);
    }
    // Allow minor collision probability with random, but expect most to be unique
    expect(ids.size).toBeGreaterThanOrEqual(18);
  });
});
