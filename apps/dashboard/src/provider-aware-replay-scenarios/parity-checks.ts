import type {
  ProviderAwareReplayParityStatus,
  ProviderReplayParityCheck,
  ProviderReplayParityMismatch,
} from './types.js';

export function buildProviderReplayParityCheck(input: {
  fixtureId: string;
  scenarioId: string;
  replayFixtureName: ProviderReplayParityCheck['replayFixtureName'];
  expectedSnapshotIds: readonly string[];
  observedSnapshotIds: readonly string[];
  mismatches: readonly ProviderReplayParityMismatch[];
  parityStatus: ProviderAwareReplayParityStatus;
  failClosed: boolean;
}): ProviderReplayParityCheck {
  const mismatchIds = input.mismatches.map(mismatch => mismatch.mismatchId);
  return {
    parityCheckId: `${input.fixtureId}-parity-check`,
    scenarioId: input.scenarioId,
    replayFixtureName: input.replayFixtureName,
    expectedSnapshotIds: [...input.expectedSnapshotIds],
    observedSnapshotIds: [...input.observedSnapshotIds],
    parityStatus: input.parityStatus,
    mismatchIds,
    mismatches: [...input.mismatches],
    failClosed: input.failClosed,
    summary:
      input.mismatches.length === 0
        ? 'Replay parity passed with deterministic snapshot alignment.'
        : `Replay parity ${input.parityStatus} with ${input.mismatches.length} deterministic mismatch(es).`,
  };
}
