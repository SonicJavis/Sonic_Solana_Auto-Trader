/**
 * Phase 7C — Replay result and status types.
 *
 * Defines types for the fixture replay controller:
 *   - ReplayStatus: lifecycle state of a replay operation
 *   - ReplayStats: statistics from a replay run
 *   - ReplayResult: typed result of a replay operation
 *
 * No network, no Solana, no wallet, no execution.
 * All types are safe to display.
 */

import type { EventEngineResult } from './errors.js';

/**
 * Lifecycle status of a replay operation.
 */
export type ReplayStatus =
  | 'idle'
  | 'running'
  | 'completed'
  | 'failed'
  | 'stopped';

export const REPLAY_STATUSES: readonly ReplayStatus[] = [
  'idle',
  'running',
  'completed',
  'failed',
  'stopped',
] as const;

/**
 * Statistics from a completed or stopped replay operation.
 * All fields are safe to display.
 */
export interface ReplayStats {
  /** The sequence ID that was replayed. */
  readonly sequenceId: string;
  /** Total events planned for replay. */
  readonly eventsPlanned: number;
  /** Events successfully published to the bus. */
  readonly eventsPublished: number;
  /** Events rejected (validation failure or safety check). */
  readonly eventsRejected: number;
  /** ISO-8601 timestamp when replay started. */
  readonly startedAt: string;
  /** ISO-8601 timestamp when replay ended, or null if still running/not started. */
  readonly completedAt: string | null;
  /** Final status of the replay. */
  readonly status: ReplayStatus;
}

/**
 * Result of a replay operation.
 * Uses the standard EventEngineResult shape for consistency.
 */
export type ReplayResult = EventEngineResult<ReplayStats>;
