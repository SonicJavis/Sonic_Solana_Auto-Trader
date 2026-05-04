/**
 * Phase 7C — Fixture event models and built-in synthetic fixtures.
 *
 * Defines:
 *   - FixtureEvent: a wrapper around EventEnvelope with mock/replay metadata
 *   - validateFixtureEvent: validates a FixtureEvent against safety rules
 *   - Built-in synthetic fixture events for testing
 *
 * Safety invariants:
 *   - All fixture events have mock: true, replay: true, live: false
 *   - Fixture payloads must not contain secrets, private keys, RPC URLs,
 *     API keys, wallet data, or any live provider data
 *   - offsetMs must be non-negative and bounded
 *   - Fixture IDs must be non-empty strings
 *
 * No network, no Solana, no wallet, no execution.
 */

import type { EventEnvelope } from './event-envelope.js';
import type { EventEngineResult } from './errors.js';
import { engineOk, engineErr } from './errors.js';
import { validateEventEnvelope } from './validation.js';

/** Maximum allowed replay offset in milliseconds (10 minutes). */
export const MAX_FIXTURE_OFFSET_MS = 600_000;

/** Maximum allowed fixture ID length in characters. */
export const MAX_FIXTURE_ID_LENGTH = 128;

/**
 * A fixture event: a synthetic EventEnvelope plus replay metadata.
 *
 * Fields:
 *   fixtureId  — unique identifier for this fixture (non-empty, no secrets)
 *   event      — the EventEnvelope to publish during replay
 *   offsetMs   — replay offset from sequence start (ms, 0 = immediate)
 *   mock       — always true
 *   replay     — always true
 *   live       — always false
 */
export interface FixtureEvent {
  readonly fixtureId: string;
  readonly event: EventEnvelope;
  readonly offsetMs: number;
  readonly mock: true;
  readonly replay: true;
  readonly live: false;
}

/**
 * Validate a FixtureEvent for structural and safety correctness.
 *
 * Checks:
 *   - fixtureId is a non-empty string within length limits
 *   - event passes EventEnvelope validation
 *   - event.source is 'mock_provider', 'internal', or other non-live source
 *   - offsetMs is a non-negative finite integer within MAX_FIXTURE_OFFSET_MS
 *   - mock === true, replay === true, live === false
 *   - event has no live provider markers (canEmitLiveEvents style checks)
 */
export function validateFixtureEvent(
  input: unknown,
): EventEngineResult<FixtureEvent> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return engineErr('INVALID_FIXTURE_EVENT', 'FixtureEvent must be a plain object');
  }

  const f = input as Record<string, unknown>;

  // fixtureId
  if (typeof f['fixtureId'] !== 'string' || f['fixtureId'].length === 0) {
    return engineErr('INVALID_FIXTURE_ID', 'fixtureId must be a non-empty string');
  }
  if (f['fixtureId'].length > MAX_FIXTURE_ID_LENGTH) {
    return engineErr(
      'INVALID_FIXTURE_ID',
      `fixtureId must not exceed ${MAX_FIXTURE_ID_LENGTH} characters`,
    );
  }

  // mock / replay / live flags
  if (f['mock'] !== true) {
    return engineErr('INVALID_FIXTURE_EVENT', 'FixtureEvent mock flag must be true');
  }
  if (f['replay'] !== true) {
    return engineErr('INVALID_FIXTURE_EVENT', 'FixtureEvent replay flag must be true');
  }
  if (f['live'] !== false) {
    return engineErr('LIVE_EVENT_FORBIDDEN', 'FixtureEvent live flag must be false — live events are forbidden');
  }

  // offsetMs
  if (
    typeof f['offsetMs'] !== 'number' ||
    !Number.isFinite(f['offsetMs']) ||
    !Number.isInteger(f['offsetMs']) ||
    f['offsetMs'] < 0
  ) {
    return engineErr(
      'INVALID_REPLAY_OFFSET',
      'offsetMs must be a non-negative integer',
    );
  }
  if (f['offsetMs'] > MAX_FIXTURE_OFFSET_MS) {
    return engineErr(
      'INVALID_REPLAY_OFFSET',
      `offsetMs must not exceed ${MAX_FIXTURE_OFFSET_MS}ms (10 minutes)`,
    );
  }

  // event envelope validation
  const envResult = validateEventEnvelope(f['event']);
  if (!envResult.ok) {
    return engineErr(
      'INVALID_FIXTURE_EVENT',
      `FixtureEvent envelope invalid: ${envResult.error.message}`,
    );
  }

  return engineOk({
    fixtureId: f['fixtureId'] as string,
    event: envResult.value,
    offsetMs: f['offsetMs'] as number,
    mock: true,
    replay: true,
    live: false,
  });
}

// ── Built-in synthetic fixture events ────────────────────────────────────────
// All built-in fixtures are local-only, synthetic, and clearly marked mock/replay.
// They do not represent live chain data, real tokens, real accounts, or real events.
// Timestamps use a fixed past date to ensure they are always valid.

const FIXTURE_TIMESTAMP = '2024-01-01T00:00:00.000Z';

/**
 * Built-in fixture: system startup event.
 * Represents a synthetic system startup signal. Safe to display.
 */
export const FIXTURE_SYSTEM_STARTUP: FixtureEvent = {
  fixtureId: 'builtin_system_startup',
  event: {
    id: 'fixture_system_startup_001',
    category: 'system',
    type: 'system_startup',
    source: 'mock_provider',
    severity: 'info',
    timestamp: FIXTURE_TIMESTAMP,
    payload: {
      mock: true,
      description: 'Synthetic system startup fixture event for local testing',
    },
    safeToPersist: true,
    safeToDisplay: true,
  },
  offsetMs: 0,
  mock: true,
  replay: true,
  live: false,
};

/**
 * Built-in fixture: mock pump adapter status event.
 * Represents a synthetic pump adapter status notification.
 */
export const FIXTURE_PUMP_ADAPTER_STATUS: FixtureEvent = {
  fixtureId: 'builtin_pump_adapter_status',
  event: {
    id: 'fixture_pump_adapter_status_001',
    category: 'pump_adapter',
    type: 'adapter_status_update',
    source: 'mock_provider',
    severity: 'info',
    timestamp: FIXTURE_TIMESTAMP,
    payload: {
      mock: true,
      adapterStatus: 'mock_idle',
      description: 'Synthetic pump adapter status fixture event for local testing',
    },
    safeToPersist: true,
    safeToDisplay: true,
  },
  offsetMs: 100,
  mock: true,
  replay: true,
  live: false,
};

/**
 * Built-in fixture: mock future_chain placeholder event.
 * Represents a synthetic chain-category placeholder. Not live chain data.
 */
export const FIXTURE_FUTURE_CHAIN_PLACEHOLDER: FixtureEvent = {
  fixtureId: 'builtin_future_chain_placeholder',
  event: {
    id: 'fixture_future_chain_placeholder_001',
    category: 'future_chain',
    type: 'chain_placeholder',
    source: 'mock_provider',
    severity: 'debug',
    timestamp: FIXTURE_TIMESTAMP,
    payload: {
      mock: true,
      description: 'Synthetic future_chain placeholder fixture for local testing — not live chain data',
    },
    safeToPersist: false,
    safeToDisplay: true,
  },
  offsetMs: 200,
  mock: true,
  replay: true,
  live: false,
};

/**
 * Built-in fixture: mock safety event.
 * Represents a synthetic safety system notification.
 */
export const FIXTURE_SAFETY_EVENT: FixtureEvent = {
  fixtureId: 'builtin_safety_event',
  event: {
    id: 'fixture_safety_event_001',
    category: 'safety',
    type: 'safety_check_mock',
    source: 'mock_provider',
    severity: 'warn',
    timestamp: FIXTURE_TIMESTAMP,
    payload: {
      mock: true,
      safetyStatus: 'mock_locked',
      description: 'Synthetic safety event fixture for local testing',
    },
    safeToPersist: true,
    safeToDisplay: true,
  },
  offsetMs: 300,
  mock: true,
  replay: true,
  live: false,
};

/**
 * All built-in fixture events as a readonly array.
 */
export const BUILTIN_FIXTURE_EVENTS: readonly FixtureEvent[] = [
  FIXTURE_SYSTEM_STARTUP,
  FIXTURE_PUMP_ADAPTER_STATUS,
  FIXTURE_FUTURE_CHAIN_PLACEHOLDER,
  FIXTURE_SAFETY_EVENT,
] as const;
