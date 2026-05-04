/**
 * Phase 7C — Controlled mock event provider.
 *
 * Defines:
 *   - MockProviderStatus: lifecycle states
 *   - MockProviderCapabilities: capability flags (only canReplayFixtureEvents: true)
 *   - ControlledMockProvider: interface for the mock provider
 *   - createControlledMockProvider: factory function
 *
 * Safety invariants:
 *   - canUseNetwork, canUseSolanaRpc, canUseWebSocket, canUseYellowstone,
 *     canUseGeyser, canEmitLiveEvents, canTriggerExecution, canAccessWallets,
 *     canAccessPrivateKeys, canFetchMarketData, canSubscribeToChainEvents
 *     are ALL false
 *   - Only canReplayFixtureEvents is true
 *   - No network calls, no Solana RPC, no WebSocket, no live data
 *   - Replay only publishes synthetic fixture events to the in-memory bus
 *   - Bounded sequence length enforced
 *   - Stop is safe and idempotent
 *
 * No network, no Solana, no wallet, no execution.
 */

import type { IEventBus } from './event-bus.js';
import type { EventEngineResult } from './errors.js';
import { engineOk, engineErr } from './errors.js';
import type { FixtureSequence } from './fixture-sequence.js';
import { validateFixtureSequence } from './fixture-sequence.js';
import type { ReplayStats } from './replay-types.js';

/**
 * Lifecycle status of the controlled mock provider.
 */
export type MockProviderStatus =
  | 'idle'
  | 'loaded'
  | 'replaying'
  | 'completed'
  | 'failed'
  | 'stopped';

export const MOCK_PROVIDER_STATUSES: readonly MockProviderStatus[] = [
  'idle',
  'loaded',
  'replaying',
  'completed',
  'failed',
  'stopped',
] as const;

/**
 * Capability flags for the controlled mock provider.
 *
 * Only canReplayFixtureEvents is true — all live/network/execution/wallet
 * capabilities remain false.
 */
export interface MockProviderCapabilities {
  /** Network calls. Always false — mock provider cannot use network. */
  readonly canUseNetwork: false;
  /** Solana RPC connections. Always false. */
  readonly canUseSolanaRpc: false;
  /** WebSocket connections. Always false. */
  readonly canUseWebSocket: false;
  /** Yellowstone gRPC connections. Always false. */
  readonly canUseYellowstone: false;
  /** Geyser plugin connections. Always false. */
  readonly canUseGeyser: false;
  /** Live on-chain event emission. Always false. */
  readonly canEmitLiveEvents: false;
  /** Fixture event replay. TRUE — this is the mock provider's purpose. */
  readonly canReplayFixtureEvents: true;
  /** Trade execution triggers. Always false. */
  readonly canTriggerExecution: false;
  /** Wallet/keypair access. Always false. */
  readonly canAccessWallets: false;
  /** Private key access. Always false. */
  readonly canAccessPrivateKeys: false;
  /** Live market data ingestion. Always false. */
  readonly canFetchMarketData: false;
  /** On-chain event subscription. Always false. */
  readonly canSubscribeToChainEvents: false;
}

/**
 * Mock provider capabilities constant.
 * Only canReplayFixtureEvents is true.
 */
export const MOCK_PROVIDER_CAPABILITIES: MockProviderCapabilities = {
  canUseNetwork: false,
  canUseSolanaRpc: false,
  canUseWebSocket: false,
  canUseYellowstone: false,
  canUseGeyser: false,
  canEmitLiveEvents: false,
  canReplayFixtureEvents: true,
  canTriggerExecution: false,
  canAccessWallets: false,
  canAccessPrivateKeys: false,
  canFetchMarketData: false,
  canSubscribeToChainEvents: false,
} as const;

/**
 * Interface for the controlled mock event provider.
 *
 * The mock provider replays fixture events into the in-memory event bus.
 * It does not connect to any external system, emit live events, or
 * trigger execution.
 */
export interface ControlledMockProvider {
  /** Current lifecycle status. */
  getStatus(): MockProviderStatus;

  /** Capability flags — only fixture replay is true. */
  getCapabilities(): MockProviderCapabilities;

  /**
   * Load a fixture sequence for replay.
   * Validates the sequence before accepting it.
   * Returns an error if the sequence is invalid.
   * Transitions status to 'loaded'.
   */
  loadFixtureSequence(sequence: FixtureSequence): EventEngineResult<void>;

  /**
   * Clear the currently loaded sequence (if any).
   * Transitions status to 'idle'.
   * Safe and idempotent.
   */
  clearFixtureSequence(): void;

  /**
   * Replay the loaded fixture sequence into the provided bus.
   * Events are published synchronously in offsetMs order.
   * Returns replay stats on completion.
   * Returns an error if no sequence is loaded or if replay fails.
   * Transitions status to 'replaying', then 'completed' or 'failed'.
   */
  replay(bus: IEventBus): EventEngineResult<ReplayStats>;

  /**
   * Stop a replay in progress (or any active state).
   * Transitions status to 'stopped'.
   * Safe and idempotent.
   */
  stop(): void;

  /**
   * Return stats from the most recent replay, or null if no replay has run.
   */
  getStats(): ReplayStats | null;
}

/**
 * Create a new controlled mock provider instance.
 *
 * The provider starts in 'idle' status and requires a fixture sequence
 * to be loaded before replay can occur.
 *
 * Safe to create — no side effects, no network, no I/O.
 */
export function createControlledMockProvider(): ControlledMockProvider {
  let status: MockProviderStatus = 'idle';
  let loadedSequence: FixtureSequence | null = null;
  let lastStats: ReplayStats | null = null;

  return {
    getStatus(): MockProviderStatus {
      return status;
    },

    getCapabilities(): MockProviderCapabilities {
      return MOCK_PROVIDER_CAPABILITIES;
    },

    loadFixtureSequence(sequence: FixtureSequence): EventEngineResult<void> {
      if (status === 'replaying') {
        return engineErr(
          'MOCK_PROVIDER_NOT_LOADED',
          'Cannot load a new sequence while replay is in progress',
        );
      }

      const validation = validateFixtureSequence(sequence);
      if (!validation.ok) {
        status = 'failed';
        return engineErr(
          'INVALID_FIXTURE_SEQUENCE',
          `Fixture sequence validation failed: ${validation.error.message}`,
        );
      }

      loadedSequence = validation.value;
      status = 'loaded';
      return engineOk(undefined);
    },

    clearFixtureSequence(): void {
      loadedSequence = null;
      if (status !== 'stopped') {
        status = 'idle';
      }
    },

    replay(bus: IEventBus): EventEngineResult<ReplayStats> {
      if (status === 'stopped') {
        return engineErr(
          'MOCK_PROVIDER_DISABLED',
          'Mock provider has been stopped — create a new provider instance to replay',
        );
      }

      if (loadedSequence === null) {
        return engineErr(
          'MOCK_PROVIDER_NOT_LOADED',
          'No fixture sequence loaded — call loadFixtureSequence() before replay()',
        );
      }

      const sequence = loadedSequence;
      const startedAt = new Date().toISOString();
      status = 'replaying';

      let eventsPublished = 0;
      let eventsRejected = 0;

      const limit =
        sequence.maxReplayEvents !== undefined
          ? Math.min(sequence.maxReplayEvents, sequence.events.length)
          : sequence.events.length;

      const eventsToReplay = sequence.events.slice(0, limit);

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
        status = 'completed';

        const stats: ReplayStats = {
          sequenceId: sequence.sequenceId,
          eventsPlanned: eventsToReplay.length,
          eventsPublished,
          eventsRejected,
          startedAt,
          completedAt,
          status: 'completed',
        };

        lastStats = stats;
        return engineOk(stats);
      } catch {
        status = 'failed';

        const failedStats: ReplayStats = {
          sequenceId: sequence.sequenceId,
          eventsPlanned: eventsToReplay.length,
          eventsPublished,
          eventsRejected,
          startedAt,
          completedAt: new Date().toISOString(),
          status: 'failed',
        };

        lastStats = failedStats;
        return engineErr('MOCK_REPLAY_FAILED', 'Replay failed due to an unexpected error');
      }
    },

    stop(): void {
      status = 'stopped';
    },

    getStats(): ReplayStats | null {
      return lastStats;
    },
  };
}
