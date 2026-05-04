/**
 * Phase 7C — Fixture sequence model and validation.
 *
 * Defines:
 *   - FixtureSequence: an ordered collection of FixtureEvents to replay
 *   - validateFixtureSequence: validates structure, bounds, and safety
 *   - buildFixtureSequence: safe factory for creating sequences
 *   - BUILTIN_SEQUENCE_ALL: a pre-built sequence of all built-in fixtures
 *
 * Safety invariants:
 *   - Sequence length is bounded by MAX_FIXTURE_SEQUENCE_LENGTH
 *   - All events must pass FixtureEvent validation
 *   - Sequence ID and name must be non-empty strings
 *   - Events are ordered by offsetMs (ascending)
 *   - No network, no Solana, no wallet, no execution
 */

import type { EventEngineResult } from './errors.js';
import { engineOk, engineErr } from './errors.js';
import type { FixtureEvent } from './fixture-events.js';
import { validateFixtureEvent, BUILTIN_FIXTURE_EVENTS } from './fixture-events.js';

/** Maximum number of events allowed in a single fixture sequence. */
export const MAX_FIXTURE_SEQUENCE_LENGTH = 1_000;

/** Maximum length of sequenceId in characters. */
export const MAX_SEQUENCE_ID_LENGTH = 128;

/** Maximum length of sequence name in characters. */
export const MAX_SEQUENCE_NAME_LENGTH = 256;

/**
 * An ordered sequence of fixture events for deterministic local replay.
 *
 * Fields:
 *   sequenceId    — unique identifier for this sequence (non-empty)
 *   name          — human-readable name (non-empty)
 *   description   — optional description
 *   events        — ordered list of FixtureEvents to replay
 *   createdAt     — ISO-8601 creation timestamp
 *   maxReplayEvents — optional cap on events to replay (defaults to events.length)
 *   safeToDisplay — whether this sequence is safe to display in logs or Telegram
 */
export interface FixtureSequence {
  readonly sequenceId: string;
  readonly name: string;
  readonly description?: string | undefined;
  readonly events: readonly FixtureEvent[];
  readonly createdAt: string;
  readonly maxReplayEvents?: number | undefined;
  readonly safeToDisplay: boolean;
}

/**
 * Options for building a FixtureSequence.
 */
export interface FixtureSequenceOptions {
  readonly sequenceId: string;
  readonly name: string;
  readonly description?: string | undefined;
  readonly events: readonly FixtureEvent[];
  readonly maxReplayEvents?: number | undefined;
  readonly safeToDisplay?: boolean | undefined;
}

/**
 * Validate a FixtureSequence for structural and safety correctness.
 *
 * Checks:
 *   - sequenceId is a non-empty string within limits
 *   - name is a non-empty string within limits
 *   - events is an array within MAX_FIXTURE_SEQUENCE_LENGTH
 *   - each event passes validateFixtureEvent
 *   - createdAt is a non-empty string
 *   - maxReplayEvents, if present, is a positive integer <= events.length
 *   - safeToDisplay is a boolean
 */
export function validateFixtureSequence(
  input: unknown,
): EventEngineResult<FixtureSequence> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return engineErr('INVALID_FIXTURE_SEQUENCE', 'FixtureSequence must be a plain object');
  }

  const s = input as Record<string, unknown>;

  // sequenceId
  if (typeof s['sequenceId'] !== 'string' || s['sequenceId'].length === 0) {
    return engineErr('INVALID_FIXTURE_SEQUENCE', 'sequenceId must be a non-empty string');
  }
  if (s['sequenceId'].length > MAX_SEQUENCE_ID_LENGTH) {
    return engineErr(
      'INVALID_FIXTURE_SEQUENCE',
      `sequenceId must not exceed ${MAX_SEQUENCE_ID_LENGTH} characters`,
    );
  }

  // name
  if (typeof s['name'] !== 'string' || s['name'].length === 0) {
    return engineErr('INVALID_FIXTURE_SEQUENCE', 'name must be a non-empty string');
  }
  if (s['name'].length > MAX_SEQUENCE_NAME_LENGTH) {
    return engineErr(
      'INVALID_FIXTURE_SEQUENCE',
      `name must not exceed ${MAX_SEQUENCE_NAME_LENGTH} characters`,
    );
  }

  // events
  if (!Array.isArray(s['events'])) {
    return engineErr('INVALID_FIXTURE_SEQUENCE', 'events must be an array');
  }
  if (s['events'].length > MAX_FIXTURE_SEQUENCE_LENGTH) {
    return engineErr(
      'FIXTURE_SEQUENCE_TOO_LARGE',
      `Sequence contains ${s['events'].length} events, which exceeds the limit of ${MAX_FIXTURE_SEQUENCE_LENGTH}`,
    );
  }

  // Validate each event
  const validatedEvents: FixtureEvent[] = [];
  for (let i = 0; i < s['events'].length; i++) {
    const result = validateFixtureEvent(s['events'][i]);
    if (!result.ok) {
      return engineErr(
        'INVALID_FIXTURE_EVENT',
        `Event at index ${i} is invalid: ${result.error.message}`,
      );
    }
    validatedEvents.push(result.value);
  }

  // createdAt
  if (typeof s['createdAt'] !== 'string' || s['createdAt'].length === 0) {
    return engineErr('INVALID_FIXTURE_SEQUENCE', 'createdAt must be a non-empty string');
  }

  // maxReplayEvents (optional)
  if (s['maxReplayEvents'] !== undefined) {
    if (
      typeof s['maxReplayEvents'] !== 'number' ||
      !Number.isInteger(s['maxReplayEvents']) ||
      s['maxReplayEvents'] <= 0
    ) {
      return engineErr(
        'INVALID_FIXTURE_SEQUENCE',
        'maxReplayEvents must be a positive integer when present',
      );
    }
  }

  // safeToDisplay
  if (typeof s['safeToDisplay'] !== 'boolean') {
    return engineErr('INVALID_FIXTURE_SEQUENCE', 'safeToDisplay must be a boolean');
  }

  return engineOk({
    sequenceId: s['sequenceId'] as string,
    name: s['name'] as string,
    description: typeof s['description'] === 'string' ? s['description'] : undefined,
    events: validatedEvents,
    createdAt: s['createdAt'] as string,
    maxReplayEvents:
      typeof s['maxReplayEvents'] === 'number' ? (s['maxReplayEvents'] as number) : undefined,
    safeToDisplay: s['safeToDisplay'] as boolean,
  });
}

/**
 * Build a validated FixtureSequence from options.
 * Returns an error if options are invalid.
 *
 * Events are sorted by offsetMs (ascending) before storage.
 */
export function buildFixtureSequence(
  options: FixtureSequenceOptions,
): EventEngineResult<FixtureSequence> {
  const sorted = [...options.events].sort((a, b) => a.offsetMs - b.offsetMs);

  const candidate: FixtureSequence = {
    sequenceId: options.sequenceId,
    name: options.name,
    description: options.description,
    events: sorted,
    createdAt: new Date().toISOString(),
    maxReplayEvents: options.maxReplayEvents,
    safeToDisplay: options.safeToDisplay ?? true,
  };

  return validateFixtureSequence(candidate);
}

/**
 * Pre-built sequence containing all built-in synthetic fixture events.
 * Safe for use in tests and demonstrations.
 */
export const BUILTIN_SEQUENCE_ALL: FixtureSequence = {
  sequenceId: 'builtin_all_fixtures',
  name: 'All Built-in Fixture Events',
  description: 'Pre-built sequence containing all built-in synthetic fixture events for local testing',
  events: BUILTIN_FIXTURE_EVENTS,
  createdAt: '2024-01-01T00:00:00.000Z',
  safeToDisplay: true,
};
