import { READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES } from './fixtures.js';
import type {
  LiveSnapshotCaptureSelector,
  LiveSnapshotCaptureSelectorQuery,
  ReadOnlyLiveSnapshotCaptureFixture,
  ReadOnlyLiveSnapshotCaptureKind,
} from './types.js';

function matchesQuery(fixture: ReadOnlyLiveSnapshotCaptureFixture, query: LiveSnapshotCaptureSelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectReadOnlyLiveSnapshotCaptureFixture(query: LiveSnapshotCaptureSelectorQuery): LiveSnapshotCaptureSelector {
  const selected = READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase78-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'read_only_snapshot_capture_ready' as ReadOnlyLiveSnapshotCaptureKind,
      matched: false,
      source: 'deterministic_fixture_only',
    };
  }
  return {
    selectorId: `${selected.fixtureId}-selector`,
    selectedFixtureId: selected.fixtureId,
    selectedFixtureKind: selected.fixtureKind,
    matched: true,
    source: 'deterministic_fixture_only',
  };
}
