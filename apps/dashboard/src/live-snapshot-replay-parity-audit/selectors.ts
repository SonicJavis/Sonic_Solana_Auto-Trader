import { LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES } from './fixtures.js';
import type {
  LiveSnapshotReplayParityAuditFixture,
  LiveSnapshotReplayParityAuditKind,
  LiveSnapshotReplayParityAuditSelector,
  LiveSnapshotReplayParityAuditSelectorQuery,
} from './types.js';

function matchesQuery(fixture: LiveSnapshotReplayParityAuditFixture, query: LiveSnapshotReplayParityAuditSelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectLiveSnapshotReplayParityAuditFixture(
  query: LiveSnapshotReplayParityAuditSelectorQuery,
): LiveSnapshotReplayParityAuditSelector {
  const selected = LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase79-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'snapshot_replay_parity_clean' as LiveSnapshotReplayParityAuditKind,
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
