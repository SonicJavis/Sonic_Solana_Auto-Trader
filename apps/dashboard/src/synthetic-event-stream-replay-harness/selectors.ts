/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: selectors.
 */

import {
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURE_MAP,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES,
} from './fixtures.js';
import type {
  SyntheticEventStreamReplayHarnessApiSummaryContract,
  SyntheticEventStreamReplayHarnessFixture,
  SyntheticEventStreamReplayHarnessSelectorQuery,
  SyntheticEventStreamReplayHarnessSelectorResult,
  SyntheticEventStreamReplayHarnessViewModel,
  SyntheticEventStreamReplaySnapshot,
  SyntheticEventStreamReplayReport,
} from './types.js';

export function selectSyntheticEventStreamReplayHarnessFixture(
  query: SyntheticEventStreamReplayHarnessSelectorQuery = {},
): SyntheticEventStreamReplayHarnessSelectorResult {
  const fromId = query.fixtureId
    ? (SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURE_MAP.get(query.fixtureId) ?? null)
    : null;

  const fixture =
    fromId ??
    SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) {
        return false;
      }
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) {
        return false;
      }
      if (query.replayStatus && candidate.actualReport.replayStatus !== query.replayStatus) {
        return false;
      }
      return true;
    }) ??
    SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_FIXTURES[0];

  const matched =
    fixture !== undefined &&
    (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
    (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
    (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind) &&
    (!query.replayStatus || fixture.actualReport.replayStatus === query.replayStatus);

  return {
    selectorId: `phase57-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase57-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'clean_launch_replay',
    matched,
    source: 'synthetic_fixture_only',
  };
}

export function selectSyntheticEventStreamReplayHarnessSnapshots(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): readonly SyntheticEventStreamReplaySnapshot[] {
  return fixture.expectedSnapshots;
}

export function selectSyntheticEventStreamReplayHarnessReport(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayReport {
  return fixture.actualReport;
}

export function selectSyntheticEventStreamReplayHarnessViewModel(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessViewModel {
  return fixture.viewModel;
}

export function selectSyntheticEventStreamReplayHarnessApiSummary(
  fixture: SyntheticEventStreamReplayHarnessFixture,
): SyntheticEventStreamReplayHarnessApiSummaryContract {
  return fixture.apiContracts.summary;
}
