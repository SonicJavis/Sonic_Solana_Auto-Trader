/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: view models.
 */

import type {
  SyntheticEventStreamReplayHarnessFixture,
  SyntheticEventStreamReplayHarnessViewModel,
} from './types.js';

export function buildSyntheticEventStreamReplayHarnessViewModel(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessViewModel {
  return {
    viewModelId: `phase57-view-${fixture.fixtureId}`,
    replayName: fixture.fixtureName,
    replayKind: fixture.fixtureKind,
    replayStatus: fixture.actualReport.replayStatus,
    totalSteps: fixture.actualReport.totalSteps,
    mismatchCount: fixture.actualReport.mismatchCount,
    finalLifecycleStatus:
      fixture.expectedSnapshots.at(-1)?.selectedStateSummary.lifecycleStatus ?? 'replayed',
    safetyLabel:
      fixture.actualReport.replayStatus === 'passed'
        ? 'fixture-only matched'
        : fixture.actualReport.replayStatus === 'rejected'
          ? 'fixture-only rejected'
          : 'fixture-only mismatch',
    nonAdvisorySummary: 'Replay summary is fixture-only, non-actionable, deterministic report, and not a signal.',
  };
}
