import { buildLiveSnapshotReplayParityAuditFixture } from './builders.js';
import {
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS,
  LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES,
  type LiveSnapshotReplayParityAuditFixture,
  type LiveSnapshotReplayParityAuditKind,
  type LiveSnapshotReplayParityAuditName,
} from './types.js';
import { validateLiveSnapshotReplayParityAuditFixtureTable } from './validation.js';

export const LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES = LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES.map(fixtureName =>
  buildLiveSnapshotReplayParityAuditFixture({ fixtureName }),
) satisfies readonly LiveSnapshotReplayParityAuditFixture[];

export const LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURE_MAP: ReadonlyMap<string, LiveSnapshotReplayParityAuditFixture> =
  new Map(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES.length < 8) {
  throw new Error(
    `Phase 79 fixture count mismatch: expected >= 8, received ${LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES.length}`,
  );
}
if (LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES.length !== LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS.length) {
  throw new Error('Phase 79 name/kind cardinality mismatch');
}

const tableValidation = validateLiveSnapshotReplayParityAuditFixtureTable(LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 79 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listLiveSnapshotReplayParityAuditFixtures(): readonly LiveSnapshotReplayParityAuditFixture[] {
  return LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURES;
}

export function getLiveSnapshotReplayParityAuditFixture(fixtureId: string): LiveSnapshotReplayParityAuditFixture | null {
  return LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_NAMES, LIVE_SNAPSHOT_REPLAY_PARITY_AUDIT_KINDS };
export type { LiveSnapshotReplayParityAuditName, LiveSnapshotReplayParityAuditKind };
