/**
 * Phase 7C — Fixture replay controller.
 *
 * Provides a standalone replay helper that:
 *   - accepts a FixtureSequence and an IEventBus
 *   - publishes fixture events to the bus synchronously
 *   - returns deterministic ReplayStats
 *   - supports an optional event limit cap
 *   - never connects to external systems
 *   - never emits live events
 *   - never triggers execution
 *
 * The replay controller is a stateless function that complements the
 * stateful ControlledMockProvider. It is the lowest-level replay primitive.
 *
 * Safety invariants:
 *   - Only publishes EventEnvelopes that are already in the FixtureSequence
 *   - No network calls, no I/O, no side effects beyond bus.publish()
 *   - Bounded by sequence length and optional limit
 *   - Safe errors on invalid input
 *
 * No network, no Solana, no wallet, no execution.
 */

import type { IEventBus } from './event-bus.js';
import type { EventEngineResult } from './errors.js';
import { engineOk, engineErr } from './errors.js';
import type { FixtureSequence } from './fixture-sequence.js';
import { validateFixtureSequence } from './fixture-sequence.js';
import type { ReplayStats, ReplayResult } from './replay-types.js';

/**
 * Options for a replay operation.
 */
export interface ReplayOptions {
  /**
   * Optional cap on the number of events to replay.
   * Defaults to the full sequence length (or sequence.maxReplayEvents if set).
   */
  readonly maxEvents?: number | undefined;
}

/**
 * Replay a FixtureSequence into an IEventBus synchronously.
 *
 * Events are published in offsetMs order (the sequence should already be sorted).
 * This function is deterministic — given the same inputs it produces the same
 * publish/reject counts and stats (aside from timestamps).
 *
 * Returns an error if the sequence is invalid or replay fails unexpectedly.
 *
 * @param sequence  The fixture sequence to replay.
 * @param bus       The in-memory event bus to publish events into.
 * @param options   Optional replay options.
 */
export function replayFixtureSequence(
  sequence: FixtureSequence,
  bus: IEventBus,
  options?: ReplayOptions,
): ReplayResult {
  // Validate the sequence first
  const validation = validateFixtureSequence(sequence);
  if (!validation.ok) {
    return engineErr(
      'INVALID_FIXTURE_SEQUENCE',
      `Cannot replay invalid fixture sequence: ${validation.error.message}`,
    );
  }

  const validSequence = validation.value;
  const startedAt = new Date().toISOString();

  // Determine event limit
  const sequenceLimit =
    validSequence.maxReplayEvents !== undefined
      ? Math.min(validSequence.maxReplayEvents, validSequence.events.length)
      : validSequence.events.length;

  const optionLimit = options?.maxEvents;
  const limit =
    optionLimit !== undefined
      ? Math.min(optionLimit, sequenceLimit)
      : sequenceLimit;

  if (limit < 0) {
    return engineErr('INVALID_FIXTURE_SEQUENCE', 'maxEvents must be non-negative');
  }

  const eventsToReplay = validSequence.events.slice(0, limit);

  let eventsPublished = 0;
  let eventsRejected = 0;

  try {
    for (const fixtureEvent of eventsToReplay) {
      const result = bus.publish(fixtureEvent.event);
      if (result.ok) {
        eventsPublished += 1;
      } else {
        eventsRejected += 1;
      }
    }

    const completedAt = new Date().toISOString();

    const stats: ReplayStats = {
      sequenceId: validSequence.sequenceId,
      eventsPlanned: eventsToReplay.length,
      eventsPublished,
      eventsRejected,
      startedAt,
      completedAt,
      status: 'completed',
    };

    return engineOk(stats);
  } catch {
    const stats: ReplayStats = {
      sequenceId: validSequence.sequenceId,
      eventsPlanned: eventsToReplay.length,
      eventsPublished,
      eventsRejected,
      startedAt,
      completedAt: new Date().toISOString(),
      status: 'failed',
    };

    // Return a failed stats result wrapped in engineErr
    // The stats are available separately if needed via the engineErr message
    void stats; // stats are tracked in lastStats on ControlledMockProvider
    return engineErr('MOCK_REPLAY_FAILED', 'Replay failed due to an unexpected error during event publishing');
  }
}

/**
 * Validate and replay a sequence, returning both the result and stats
 * in a combined form.
 *
 * Convenience wrapper that validates the sequence before replaying and
 * returns the full ReplayStats on success.
 */
export function replayAndCollect(
  sequence: FixtureSequence,
  bus: IEventBus,
  options?: ReplayOptions,
): EventEngineResult<ReplayStats> {
  return replayFixtureSequence(sequence, bus, options);
}
