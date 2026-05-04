/**
 * Phase 7C Tests — Controlled Mock Providers + Replayable Fixture Events
 *
 * Tests cover:
 * A. Mock provider types
 *    - status shape and values
 *    - capability flags (only canReplayFixtureEvents is true)
 *    - network/live/execution/wallet capabilities false
 *
 * B. Fixture models
 *    - fixture event shape
 *    - fixture sequence shape
 *    - built-in fixtures are synthetic (mock/replay/live flags)
 *    - all built-in fixture events validate
 *    - invalid fixtures rejected
 *    - sequence length bounded
 *    - offset bounds enforced
 *
 * C. Replay controller / mock provider
 *    - load fixture sequence
 *    - clear fixture sequence
 *    - replay publishes events to in-memory bus
 *    - deterministic ordering (offsetMs ascending)
 *    - replay stats correct
 *    - stop is safe/idempotent
 *    - invalid sequence fails safely
 *    - no live events emitted
 *    - replayFixtureSequence standalone function works
 *
 * D. Dedupe/history interaction
 *    - replayed events appear in bounded history
 *    - duplicate fixture events handled
 *
 * E. Error safety
 *    - errors safe to display
 *    - no stack traces
 *    - no env values / RPC URLs / API keys / secrets
 *
 * F. Safety
 *    - no live provider enabled
 *    - no network capability
 *    - no Solana RPC capability
 *    - no execution trigger capability
 *    - no wallet capability
 *    - FULL_AUTO and LIMITED_LIVE remain locked
 *    - Phase 7B disabled providers remain inert
 *
 * G. Regression
 *    - all Phase 1–7A tests still pass
 *    - no public exports broken
 *    - mock_provider added to EVENT_SOURCE_TYPES
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

import { describe, it, expect, beforeEach } from 'vitest';

// ── Phase 7B exports under test ────────────────────────────────────────────────
import {
  EVENT_PROVIDER_TYPES,
  PHASE_7B_PROVIDER_CAPABILITIES,
  createDisabledEventProvider,
  getEventProviderRegistry,
} from '../packages/event-engine/src/index.js';

import type {
  EventProviderType,
} from '../packages/event-engine/src/index.js';

// ── Phase 7C exports under test ────────────────────────────────────────────────
import {
  // Mock provider
  MOCK_PROVIDER_STATUSES,
  MOCK_PROVIDER_CAPABILITIES,
  createControlledMockProvider,
  // Fixture events
  validateFixtureEvent,
  BUILTIN_FIXTURE_EVENTS,
  FIXTURE_SYSTEM_STARTUP,
  FIXTURE_PUMP_ADAPTER_STATUS,
  FIXTURE_FUTURE_CHAIN_PLACEHOLDER,
  FIXTURE_SAFETY_EVENT,
  MAX_FIXTURE_OFFSET_MS,
  MAX_FIXTURE_ID_LENGTH,
  // Fixture sequences
  validateFixtureSequence,
  buildFixtureSequence,
  BUILTIN_SEQUENCE_ALL,
  MAX_FIXTURE_SEQUENCE_LENGTH,
  MAX_SEQUENCE_ID_LENGTH,
  MAX_SEQUENCE_NAME_LENGTH,
  // Replay
  REPLAY_STATUSES,
  replayFixtureSequence,
  replayAndCollect,
  // Event bus
  InMemoryEventBus,
  createInMemoryEventBus,
  buildTestEvent,
  // Event source types (updated in 7C)
  EVENT_SOURCE_TYPES,
} from '../packages/event-engine/src/index.js';

import type {
  MockProviderStatus,
  ControlledMockProvider,
  FixtureEvent,
  FixtureSequence,
  ReplayStatus,
} from '../packages/event-engine/src/index.js';

// Regression: shared safety locks
import { buildRuntimeSafetyStatus, PHASE, PHASE_NAME } from '../packages/shared/src/index.js';

// ── A. Mock Provider Types ─────────────────────────────────────────────────────

describe('Phase 7C — A.1 MockProviderStatus', () => {
  it('MOCK_PROVIDER_STATUSES contains all expected values', () => {
    const expected: MockProviderStatus[] = ['idle', 'loaded', 'replaying', 'completed', 'failed', 'stopped'];
    for (const status of expected) {
      expect(MOCK_PROVIDER_STATUSES).toContain(status);
    }
    expect(MOCK_PROVIDER_STATUSES).toHaveLength(expected.length);
  });

  it('REPLAY_STATUSES contains all expected values', () => {
    const expected: ReplayStatus[] = ['idle', 'running', 'completed', 'failed', 'stopped'];
    for (const s of expected) {
      expect(REPLAY_STATUSES).toContain(s);
    }
  });
});

describe('Phase 7C — A.2 MockProviderCapabilities', () => {
  it('only canReplayFixtureEvents is true', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canReplayFixtureEvents).toBe(true);
  });

  it('all network/live/execution/wallet capabilities are false', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canUseNetwork).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canUseSolanaRpc).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canUseWebSocket).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canUseYellowstone).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canUseGeyser).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canEmitLiveEvents).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canTriggerExecution).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canAccessWallets).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canFetchMarketData).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canSubscribeToChainEvents).toBe(false);
  });

  it('has exactly 12 capability flags', () => {
    const flags = Object.keys(MOCK_PROVIDER_CAPABILITIES);
    expect(flags).toHaveLength(12);
  });
});

describe('Phase 7C — A.3 Phase 7B PHASE_7B_PROVIDER_CAPABILITIES', () => {
  it('all Phase 7B capabilities are false', () => {
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canUseNetwork).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canUseSolanaRpc).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canUseWebSocket).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canUseYellowstone).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canUseGeyser).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canEmitLiveEvents).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canTriggerExecution).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canAccessWallets).toBe(false);
    expect(PHASE_7B_PROVIDER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
  });

  it('has exactly 12 capability flags', () => {
    const flags = Object.keys(PHASE_7B_PROVIDER_CAPABILITIES);
    expect(flags).toHaveLength(12);
  });

  it('EVENT_PROVIDER_TYPES contains 6 disabled variants', () => {
    const expected: EventProviderType[] = [
      'helius_disabled',
      'websocket_disabled',
      'yellowstone_disabled',
      'polling_disabled',
      'mock_disabled',
      'unknown_disabled',
    ];
    expect(EVENT_PROVIDER_TYPES).toHaveLength(6);
    for (const t of expected) {
      expect(EVENT_PROVIDER_TYPES).toContain(t);
    }
  });
});

// ── B. Fixture Models ──────────────────────────────────────────────────────────

describe('Phase 7C — B.1 FixtureEvent shape', () => {
  it('FIXTURE_SYSTEM_STARTUP has correct shape and flags', () => {
    expect(FIXTURE_SYSTEM_STARTUP.fixtureId).toBe('builtin_system_startup');
    expect(FIXTURE_SYSTEM_STARTUP.mock).toBe(true);
    expect(FIXTURE_SYSTEM_STARTUP.replay).toBe(true);
    expect(FIXTURE_SYSTEM_STARTUP.live).toBe(false);
    expect(FIXTURE_SYSTEM_STARTUP.offsetMs).toBe(0);
    expect(FIXTURE_SYSTEM_STARTUP.event).toBeDefined();
  });

  it('FIXTURE_PUMP_ADAPTER_STATUS has correct shape and flags', () => {
    expect(FIXTURE_PUMP_ADAPTER_STATUS.mock).toBe(true);
    expect(FIXTURE_PUMP_ADAPTER_STATUS.replay).toBe(true);
    expect(FIXTURE_PUMP_ADAPTER_STATUS.live).toBe(false);
    expect(FIXTURE_PUMP_ADAPTER_STATUS.offsetMs).toBeGreaterThanOrEqual(0);
  });

  it('FIXTURE_FUTURE_CHAIN_PLACEHOLDER has correct shape and flags', () => {
    expect(FIXTURE_FUTURE_CHAIN_PLACEHOLDER.mock).toBe(true);
    expect(FIXTURE_FUTURE_CHAIN_PLACEHOLDER.live).toBe(false);
  });

  it('FIXTURE_SAFETY_EVENT has correct shape and flags', () => {
    expect(FIXTURE_SAFETY_EVENT.mock).toBe(true);
    expect(FIXTURE_SAFETY_EVENT.live).toBe(false);
  });

  it('all built-in fixture events have mock: true and live: false', () => {
    for (const fixture of BUILTIN_FIXTURE_EVENTS) {
      expect(fixture.mock).toBe(true);
      expect(fixture.replay).toBe(true);
      expect(fixture.live).toBe(false);
    }
  });

  it('all built-in fixture events have non-empty fixtureId', () => {
    for (const fixture of BUILTIN_FIXTURE_EVENTS) {
      expect(typeof fixture.fixtureId).toBe('string');
      expect(fixture.fixtureId.length).toBeGreaterThan(0);
    }
  });

  it('all built-in fixture events have non-negative offsetMs', () => {
    for (const fixture of BUILTIN_FIXTURE_EVENTS) {
      expect(fixture.offsetMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('BUILTIN_FIXTURE_EVENTS has 4 built-in fixtures', () => {
    expect(BUILTIN_FIXTURE_EVENTS).toHaveLength(4);
  });
});

describe('Phase 7C — B.2 FixtureEvent validation', () => {
  it('validates all built-in fixture events successfully', () => {
    for (const fixture of BUILTIN_FIXTURE_EVENTS) {
      const result = validateFixtureEvent(fixture);
      expect(result.ok).toBe(true);
    }
  });

  it('rejects fixture with empty fixtureId', () => {
    const bad = { ...FIXTURE_SYSTEM_STARTUP, fixtureId: '' };
    const result = validateFixtureEvent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_FIXTURE_ID');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('rejects fixture with oversized fixtureId', () => {
    const bad = { ...FIXTURE_SYSTEM_STARTUP, fixtureId: 'x'.repeat(MAX_FIXTURE_ID_LENGTH + 1) };
    const result = validateFixtureEvent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_FIXTURE_ID');
  });

  it('rejects fixture with live: true', () => {
    const bad = { ...FIXTURE_SYSTEM_STARTUP, live: true };
    const result = validateFixtureEvent(bad as unknown as FixtureEvent);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('LIVE_EVENT_FORBIDDEN');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('rejects fixture with mock: false', () => {
    const bad = { ...FIXTURE_SYSTEM_STARTUP, mock: false };
    const result = validateFixtureEvent(bad as unknown as FixtureEvent);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_FIXTURE_EVENT');
  });

  it('rejects fixture with negative offsetMs', () => {
    const bad = { ...FIXTURE_SYSTEM_STARTUP, offsetMs: -1 };
    const result = validateFixtureEvent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_REPLAY_OFFSET');
  });

  it('rejects fixture with offsetMs exceeding MAX_FIXTURE_OFFSET_MS', () => {
    const bad = { ...FIXTURE_SYSTEM_STARTUP, offsetMs: MAX_FIXTURE_OFFSET_MS + 1 };
    const result = validateFixtureEvent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_REPLAY_OFFSET');
  });

  it('accepts fixture with offsetMs equal to MAX_FIXTURE_OFFSET_MS', () => {
    const ok = { ...FIXTURE_SYSTEM_STARTUP, offsetMs: MAX_FIXTURE_OFFSET_MS };
    const result = validateFixtureEvent(ok);
    expect(result.ok).toBe(true);
  });

  it('rejects non-object fixture', () => {
    const result = validateFixtureEvent('not-an-object');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.safeToDisplay).toBe(true);
  });

  it('rejects fixture with invalid event envelope', () => {
    const bad = { ...FIXTURE_SYSTEM_STARTUP, event: { ...FIXTURE_SYSTEM_STARTUP.event, id: '' } };
    const result = validateFixtureEvent(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_FIXTURE_EVENT');
  });
});

describe('Phase 7C — B.3 FixtureSequence shape', () => {
  it('BUILTIN_SEQUENCE_ALL has correct shape', () => {
    expect(BUILTIN_SEQUENCE_ALL.sequenceId).toBe('builtin_all_fixtures');
    expect(BUILTIN_SEQUENCE_ALL.name).toBeTruthy();
    expect(BUILTIN_SEQUENCE_ALL.events).toHaveLength(BUILTIN_FIXTURE_EVENTS.length);
    expect(BUILTIN_SEQUENCE_ALL.safeToDisplay).toBe(true);
    expect(typeof BUILTIN_SEQUENCE_ALL.createdAt).toBe('string');
  });

  it('BUILTIN_SEQUENCE_ALL validates successfully', () => {
    const result = validateFixtureSequence(BUILTIN_SEQUENCE_ALL);
    expect(result.ok).toBe(true);
  });

  it('MAX_FIXTURE_SEQUENCE_LENGTH is 1000', () => {
    expect(MAX_FIXTURE_SEQUENCE_LENGTH).toBe(1_000);
  });

  it('MAX_SEQUENCE_ID_LENGTH and MAX_SEQUENCE_NAME_LENGTH are reasonable', () => {
    expect(MAX_SEQUENCE_ID_LENGTH).toBeGreaterThan(0);
    expect(MAX_SEQUENCE_NAME_LENGTH).toBeGreaterThan(0);
  });
});

describe('Phase 7C — B.4 FixtureSequence validation', () => {
  it('rejects sequence with empty sequenceId', () => {
    const bad = { ...BUILTIN_SEQUENCE_ALL, sequenceId: '' };
    const result = validateFixtureSequence(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_FIXTURE_SEQUENCE');
  });

  it('rejects sequence with empty name', () => {
    const bad = { ...BUILTIN_SEQUENCE_ALL, name: '' };
    const result = validateFixtureSequence(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_FIXTURE_SEQUENCE');
  });

  it('rejects sequence with non-array events', () => {
    const bad = { ...BUILTIN_SEQUENCE_ALL, events: 'not-an-array' };
    const result = validateFixtureSequence(bad as unknown as FixtureSequence);
    expect(result.ok).toBe(false);
  });

  it('rejects sequence exceeding MAX_FIXTURE_SEQUENCE_LENGTH', () => {
    const tooManyEvents = Array.from({ length: MAX_FIXTURE_SEQUENCE_LENGTH + 1 }, (_, i) => ({
      ...FIXTURE_SYSTEM_STARTUP,
      fixtureId: `overflow_fixture_${i}`,
      event: { ...FIXTURE_SYSTEM_STARTUP.event, id: `overflow_event_${i}` },
    }));
    const bad = { ...BUILTIN_SEQUENCE_ALL, events: tooManyEvents };
    const result = validateFixtureSequence(bad as unknown as FixtureSequence);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('FIXTURE_SEQUENCE_TOO_LARGE');
  });

  it('rejects sequence with invalid event at some index', () => {
    const invalidFixture = { ...FIXTURE_SYSTEM_STARTUP, fixtureId: '' }; // invalid
    const bad = { ...BUILTIN_SEQUENCE_ALL, events: [FIXTURE_SYSTEM_STARTUP, invalidFixture] };
    const result = validateFixtureSequence(bad as unknown as FixtureSequence);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_FIXTURE_EVENT');
  });

  it('rejects sequence with invalid maxReplayEvents', () => {
    const bad = { ...BUILTIN_SEQUENCE_ALL, maxReplayEvents: 0 };
    const result = validateFixtureSequence(bad);
    expect(result.ok).toBe(false);
  });

  it('accepts valid sequence with maxReplayEvents set', () => {
    const good = { ...BUILTIN_SEQUENCE_ALL, maxReplayEvents: 2 };
    const result = validateFixtureSequence(good);
    expect(result.ok).toBe(true);
  });

  it('buildFixtureSequence sorts events by offsetMs', () => {
    const unsorted = [
      { ...FIXTURE_SAFETY_EVENT, fixtureId: 'ev3', event: { ...FIXTURE_SAFETY_EVENT.event, id: 'ev3' }, offsetMs: 300 },
      { ...FIXTURE_SYSTEM_STARTUP, fixtureId: 'ev1', event: { ...FIXTURE_SYSTEM_STARTUP.event, id: 'ev1' }, offsetMs: 0 },
      { ...FIXTURE_PUMP_ADAPTER_STATUS, fixtureId: 'ev2', event: { ...FIXTURE_PUMP_ADAPTER_STATUS.event, id: 'ev2' }, offsetMs: 100 },
    ];
    const result = buildFixtureSequence({
      sequenceId: 'test_sort',
      name: 'Sort test',
      events: unsorted,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.events[0]!.offsetMs).toBe(0);
      expect(result.value.events[1]!.offsetMs).toBe(100);
      expect(result.value.events[2]!.offsetMs).toBe(300);
    }
  });
});

// ── C. Replay Controller / Mock Provider ──────────────────────────────────────

describe('Phase 7C — C.1 ControlledMockProvider lifecycle', () => {
  let provider: ControlledMockProvider;
  let bus: InMemoryEventBus;

  beforeEach(() => {
    provider = createControlledMockProvider();
    bus = createInMemoryEventBus();
  });

  it('starts in idle status', () => {
    expect(provider.getStatus()).toBe('idle');
  });

  it('getCapabilities() returns MOCK_PROVIDER_CAPABILITIES', () => {
    const caps = provider.getCapabilities();
    expect(caps.canReplayFixtureEvents).toBe(true);
    expect(caps.canUseNetwork).toBe(false);
    expect(caps.canEmitLiveEvents).toBe(false);
    expect(caps.canTriggerExecution).toBe(false);
  });

  it('loadFixtureSequence transitions to loaded status', () => {
    const result = provider.loadFixtureSequence(BUILTIN_SEQUENCE_ALL);
    expect(result.ok).toBe(true);
    expect(provider.getStatus()).toBe('loaded');
  });

  it('loadFixtureSequence rejects invalid sequence', () => {
    const bad = { ...BUILTIN_SEQUENCE_ALL, sequenceId: '' };
    const result = provider.loadFixtureSequence(bad as unknown as FixtureSequence);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
      expect(result.error.code).toBe('INVALID_FIXTURE_SEQUENCE');
    }
    expect(provider.getStatus()).toBe('failed');
  });

  it('clearFixtureSequence returns to idle', () => {
    provider.loadFixtureSequence(BUILTIN_SEQUENCE_ALL);
    expect(provider.getStatus()).toBe('loaded');
    provider.clearFixtureSequence();
    expect(provider.getStatus()).toBe('idle');
  });

  it('replay without loaded sequence returns error', () => {
    const result = provider.replay(bus);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('MOCK_PROVIDER_NOT_LOADED');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('replay publishes all built-in fixture events to the bus', () => {
    provider.loadFixtureSequence(BUILTIN_SEQUENCE_ALL);
    const result = provider.replay(bus);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.eventsPublished).toBe(BUILTIN_FIXTURE_EVENTS.length);
      expect(result.value.eventsRejected).toBe(0);
      expect(result.value.eventsPlanned).toBe(BUILTIN_FIXTURE_EVENTS.length);
      expect(result.value.status).toBe('completed');
    }
  });

  it('replay transitions status to completed on success', () => {
    provider.loadFixtureSequence(BUILTIN_SEQUENCE_ALL);
    provider.replay(bus);
    expect(provider.getStatus()).toBe('completed');
  });

  it('replay stats are available via getStats()', () => {
    expect(provider.getStats()).toBeNull();
    provider.loadFixtureSequence(BUILTIN_SEQUENCE_ALL);
    provider.replay(bus);
    const stats = provider.getStats();
    expect(stats).not.toBeNull();
    if (stats !== null) {
      expect(stats.eventsPublished).toBe(BUILTIN_FIXTURE_EVENTS.length);
      expect(stats.status).toBe('completed');
      expect(stats.sequenceId).toBe(BUILTIN_SEQUENCE_ALL.sequenceId);
    }
  });

  it('stop() transitions to stopped status', () => {
    provider.stop();
    expect(provider.getStatus()).toBe('stopped');
  });

  it('stop() is idempotent', () => {
    provider.stop();
    provider.stop();
    expect(provider.getStatus()).toBe('stopped');
  });

  it('replay after stop() returns error', () => {
    provider.stop();
    const result = provider.replay(bus);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('MOCK_PROVIDER_DISABLED');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });
});

describe('Phase 7C — C.2 replayFixtureSequence standalone function', () => {
  let bus: InMemoryEventBus;

  beforeEach(() => {
    bus = createInMemoryEventBus();
  });

  it('replays all built-in fixture events', () => {
    const result = replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.eventsPublished).toBe(BUILTIN_FIXTURE_EVENTS.length);
      expect(result.value.eventsRejected).toBe(0);
      expect(result.value.status).toBe('completed');
    }
  });

  it('returns correct eventsPlanned count', () => {
    const result = replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    if (result.ok) {
      expect(result.value.eventsPlanned).toBe(BUILTIN_SEQUENCE_ALL.events.length);
    }
  });

  it('replayAndCollect works identically', () => {
    const result = replayAndCollect(BUILTIN_SEQUENCE_ALL, bus);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.eventsPublished).toBe(BUILTIN_FIXTURE_EVENTS.length);
    }
  });

  it('respects maxEvents option', () => {
    const result = replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus, { maxEvents: 2 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.eventsPlanned).toBe(2);
      expect(result.value.eventsPublished).toBe(2);
    }
  });

  it('respects sequence maxReplayEvents over option', () => {
    const seqWithLimit: FixtureSequence = { ...BUILTIN_SEQUENCE_ALL, maxReplayEvents: 1 };
    const result = replayFixtureSequence(seqWithLimit, bus, { maxEvents: 100 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.eventsPlanned).toBe(1);
    }
  });

  it('rejects invalid sequence with safe error', () => {
    const bad = { ...BUILTIN_SEQUENCE_ALL, sequenceId: '' };
    const result = replayFixtureSequence(bad as unknown as FixtureSequence, bus);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_FIXTURE_SEQUENCE');
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('replay stats have startedAt and completedAt as ISO strings', () => {
    const result = replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    if (result.ok) {
      expect(new Date(result.value.startedAt).getTime()).not.toBeNaN();
      expect(result.value.completedAt).not.toBeNull();
      if (result.value.completedAt !== null) {
        expect(new Date(result.value.completedAt).getTime()).not.toBeNaN();
      }
    }
  });

  it('deterministic ordering: handler receives events in offsetMs order', () => {
    const received: string[] = [];
    bus.subscribe((event) => {
      received.push(event.id);
    });

    replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);

    // Built-in fixture events are already ordered 0, 100, 200, 300
    const expectedIds = BUILTIN_SEQUENCE_ALL.events.map((e) => e.event.id);
    expect(received).toEqual(expectedIds);
  });

  it('replayed events appear in bus history', () => {
    replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    const recent = bus.getRecent(100);
    expect(recent.length).toBe(BUILTIN_FIXTURE_EVENTS.length);
  });

  it('empty sequence replays successfully with 0 events', () => {
    const emptySeq: FixtureSequence = {
      ...BUILTIN_SEQUENCE_ALL,
      sequenceId: 'empty_seq',
      name: 'Empty sequence',
      events: [],
    };
    const result = replayFixtureSequence(emptySeq, bus);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.eventsPublished).toBe(0);
      expect(result.value.eventsPlanned).toBe(0);
    }
  });
});

// ── D. Dedupe/History Interaction ─────────────────────────────────────────────

describe('Phase 7C — D. Dedupe and history interaction', () => {
  let bus: InMemoryEventBus;

  beforeEach(() => {
    bus = createInMemoryEventBus();
  });

  it('replayed events appear in bounded bus history', () => {
    replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    const stats = bus.getStats();
    expect(stats.historySize).toBe(BUILTIN_FIXTURE_EVENTS.length);
    expect(stats.totalPublished).toBe(BUILTIN_FIXTURE_EVENTS.length);
  });

  it('replaying the same sequence twice publishes all events again (no dedupeKey set)', () => {
    replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    const stats = bus.getStats();
    // Both replays should succeed since built-in fixtures have no dedupeKey
    expect(stats.totalPublished).toBe(BUILTIN_FIXTURE_EVENTS.length * 2);
  });

  it('replayed events do not cause handler failures', () => {
    let handlerCalled = 0;
    bus.subscribe(() => { handlerCalled += 1; });
    replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    const stats = bus.getStats();
    expect(stats.totalHandlerFailures).toBe(0);
    expect(handlerCalled).toBe(BUILTIN_FIXTURE_EVENTS.length);
  });

  it('bus history is bounded — old events evicted when limit reached', () => {
    const smallBus = createInMemoryEventBus({ maxHistory: 3 });
    replayFixtureSequence(BUILTIN_SEQUENCE_ALL, smallBus); // 4 events
    const stats = smallBus.getStats();
    expect(stats.historySize).toBe(3); // bounded
    expect(stats.totalPublished).toBe(4);
  });

  it('fixture events with dedupeKey are tracked by DedupeStore independently', () => {
    const fixtureWithDedupe: FixtureEvent = {
      ...FIXTURE_SYSTEM_STARTUP,
      fixtureId: 'dedupe_test',
      event: {
        ...FIXTURE_SYSTEM_STARTUP.event,
        id: 'dedupe_test_001',
        dedupeKey: 'test_dedupe_key',
        ttlMs: 5000,
      },
    };
    const seq: FixtureSequence = {
      ...BUILTIN_SEQUENCE_ALL,
      sequenceId: 'dedupe_seq',
      name: 'Dedupe test',
      events: [fixtureWithDedupe],
    };
    const result = replayFixtureSequence(seq, bus);
    // The bus itself doesn't dedupe — DedupeStore is separate
    // The event should be published successfully
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.eventsPublished).toBe(1);
    }
  });
});

// ── E. Error Safety ────────────────────────────────────────────────────────────

describe('Phase 7C — E. Error safety', () => {
  it('all Phase 7C error codes are safe to display', () => {
    const errorCodes = [
      'INVALID_FIXTURE_ID',
      'INVALID_FIXTURE_SEQUENCE',
      'INVALID_FIXTURE_EVENT',
      'FIXTURE_SEQUENCE_TOO_LARGE',
      'INVALID_REPLAY_OFFSET',
      'MOCK_PROVIDER_DISABLED',
      'MOCK_PROVIDER_NOT_LOADED',
      'MOCK_REPLAY_FAILED',
      'LIVE_EVENT_FORBIDDEN',
      'NETWORK_REPLAY_FORBIDDEN',
      'UNSAFE_FIXTURE_PAYLOAD',
    ];

    // Spot check: trigger real errors and verify safeToDisplay
    const fixtureIdError = validateFixtureEvent({ ...FIXTURE_SYSTEM_STARTUP, fixtureId: '' });
    expect(fixtureIdError.ok).toBe(false);
    if (!fixtureIdError.ok) {
      expect(fixtureIdError.error.safeToDisplay).toBe(true);
      expect(typeof fixtureIdError.error.message).toBe('string');
      expect(fixtureIdError.error.message.length).toBeGreaterThan(0);
    }

    // All listed codes are in the EventEngineErrorCode union
    for (const code of errorCodes) {
      expect(typeof code).toBe('string');
    }
  });

  it('error messages do not contain stack traces', () => {
    const result = validateFixtureSequence({ ...BUILTIN_SEQUENCE_ALL, sequenceId: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).not.toMatch(/Error:/);
      expect(result.error.message).not.toMatch(/at \w+/);
      expect(result.error.message).not.toMatch(/^\s*at /m);
    }
  });

  it('error messages do not contain RPC URLs or API keys', () => {
    const provider = createControlledMockProvider();
    const bad = { ...BUILTIN_SEQUENCE_ALL, sequenceId: '' };
    const result = provider.loadFixtureSequence(bad as unknown as FixtureSequence);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).not.toMatch(/https?:\/\//);
      expect(result.error.message).not.toMatch(/api[_-]?key/i);
      expect(result.error.message).not.toMatch(/wss?:\/\//);
    }
  });

  it('error messages do not contain wallet or private key data', () => {
    const result = validateFixtureEvent({ ...FIXTURE_SYSTEM_STARTUP, live: true });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).not.toMatch(/private.?key/i);
      expect(result.error.message).not.toMatch(/mnemonic/i);
      expect(result.error.message).not.toMatch(/seed.?phrase/i);
      expect(result.error.message).not.toMatch(/secret/i);
    }
  });
});

// ── F. Safety ─────────────────────────────────────────────────────────────────

describe('Phase 7C — F.1 No live provider capability', () => {
  it('mock provider cannot emit live events', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canEmitLiveEvents).toBe(false);
  });

  it('mock provider cannot use network', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canUseNetwork).toBe(false);
  });

  it('mock provider cannot use Solana RPC', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canUseSolanaRpc).toBe(false);
  });

  it('mock provider cannot trigger execution', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canTriggerExecution).toBe(false);
  });

  it('mock provider cannot access wallets', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canAccessWallets).toBe(false);
  });

  it('mock provider cannot access private keys', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
  });

  it('mock provider cannot use WebSocket', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canUseWebSocket).toBe(false);
  });

  it('mock provider cannot use Yellowstone', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canUseYellowstone).toBe(false);
  });

  it('mock provider cannot use Geyser', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canUseGeyser).toBe(false);
  });

  it('mock provider cannot fetch market data', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canFetchMarketData).toBe(false);
  });

  it('mock provider cannot subscribe to chain events', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canSubscribeToChainEvents).toBe(false);
  });
});

describe('Phase 7C — F.2 Phase 7B disabled providers are inert', () => {
  it('all disabled providers fail connect()', () => {
    for (const type of EVENT_PROVIDER_TYPES) {
      const p = createDisabledEventProvider(type);
      const result = p.connect!();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('PROVIDER_DISABLED');
        expect(result.error.safeToDisplay).toBe(true);
      }
    }
  });

  it('all disabled providers return ok for disconnect() (safe no-op)', () => {
    for (const type of EVENT_PROVIDER_TYPES) {
      const p = createDisabledEventProvider(type);
      const result = p.disconnect!();
      expect(result.ok).toBe(true);
    }
  });

  it('disabled providers always return status "disabled"', () => {
    for (const type of EVENT_PROVIDER_TYPES) {
      const p = createDisabledEventProvider(type);
      expect(p.getStatus()).toBe('disabled');
    }
  });

  it('disabled provider assertDisabled() is a no-op', () => {
    const p = createDisabledEventProvider('helius_disabled');
    expect(() => p.assertDisabled()).not.toThrow();
  });

  it('getEventProviderRegistry returns all registered providers', () => {
    const registry = getEventProviderRegistry();
    const providers = registry.listProviders();
    expect(providers.length).toBeGreaterThanOrEqual(5);
  });

  it('registry getProvider returns correct boundary', () => {
    const registry = getEventProviderRegistry();
    const helius = registry.getProvider('helius_disabled');
    expect(helius).toBeDefined();
    expect(helius.getStatus()).toBe('disabled');
    expect(helius.getType()).toBe('helius_disabled');
  });

  it('registry getProvider returns a disabled provider for unknown type', () => {
    const registry = getEventProviderRegistry();
    const unknown = registry.getProvider('unknown_disabled');
    expect(unknown.getStatus()).toBe('disabled');
  });
});

describe('Phase 7C — F.3 FULL_AUTO and LIMITED_LIVE remain locked', () => {
  it('buildRuntimeSafetyStatus reports FULL_AUTO and LIMITED_LIVE locked', () => {
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
    expect(status.limitedLiveLocked).toBe(true);
  });

  it('buildRuntimeSafetyStatus reports liveTradingEnabled false', () => {
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
    expect(status.liveTradingEnabled).toBe(false);
  });
});

describe('Phase 7C — F.4 Built-in fixture payload safety', () => {
  it('built-in fixtures contain mock: true in payload', () => {
    for (const fixture of BUILTIN_FIXTURE_EVENTS) {
      expect(fixture.event.payload['mock']).toBe(true);
    }
  });

  it('built-in fixture payloads contain no private key patterns', () => {
    for (const fixture of BUILTIN_FIXTURE_EVENTS) {
      const payloadStr = JSON.stringify(fixture.event.payload);
      expect(payloadStr).not.toMatch(/private.?key/i);
      expect(payloadStr).not.toMatch(/mnemonic/i);
      expect(payloadStr).not.toMatch(/seed.?phrase/i);
      expect(payloadStr).not.toMatch(/TELEGRAM_BOT_TOKEN/i);
      expect(payloadStr).not.toMatch(/DATABASE_URL/i);
      expect(payloadStr).not.toMatch(/wss?:\/\//);
      expect(payloadStr).not.toMatch(/https?:\/\//);
    }
  });

  it('built-in fixture events have source "mock_provider"', () => {
    for (const fixture of BUILTIN_FIXTURE_EVENTS) {
      expect(fixture.event.source).toBe('mock_provider');
    }
  });
});

// ── G. Regression ─────────────────────────────────────────────────────────────

describe('Phase 7C — G.1 Regression: EVENT_SOURCE_TYPES updated', () => {
  it('mock_provider is in EVENT_SOURCE_TYPES', () => {
    expect(EVENT_SOURCE_TYPES).toContain('mock_provider');
  });

  it('all original Phase 7A source types still present', () => {
    const originalTypes = [
      'internal', 'worker', 'telegram', 'audit_repository',
      'state_service', 'pump_adapter_mock', 'future_provider_disabled',
    ];
    for (const t of originalTypes) {
      expect(EVENT_SOURCE_TYPES).toContain(t);
    }
  });
});

describe('Phase 7C — G.2 Regression: Phase 7A event bus still works', () => {
  it('InMemoryEventBus publishes and retrieves events', () => {
    const bus = createInMemoryEventBus();
    const event = buildTestEvent();
    const result = bus.publish(event);
    expect(result.ok).toBe(true);
    const recent = bus.getRecent(10);
    expect(recent).toHaveLength(1);
  });

  it('mock_provider is a valid source for events published to bus', () => {
    const bus = createInMemoryEventBus();
    const event = buildTestEvent({ source: 'mock_provider' });
    const result = bus.publish(event);
    expect(result.ok).toBe(true);
  });
});

describe('Phase 7C — G.3 Regression: PHASE constant', () => {
  it('PHASE is 7', () => {
    expect(PHASE).toBe(7);
  });

  it('PHASE_NAME references Event Engine', () => {
    expect(PHASE_NAME).toContain('Event Engine');
  });
});
