import { buildReadOnlyLiveSnapshotCaptureFixture } from './builders.js';
import {
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS,
  READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES,
  type ReadOnlyLiveSnapshotCaptureFixture,
  type ReadOnlyLiveSnapshotCaptureKind,
  type ReadOnlyLiveSnapshotCaptureName,
} from './types.js';
import { validateReadOnlyLiveSnapshotCaptureFixtureTable } from './validation.js';

export const READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES = READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES.map(fixtureName =>
  buildReadOnlyLiveSnapshotCaptureFixture({ fixtureName }),
) satisfies readonly ReadOnlyLiveSnapshotCaptureFixture[];

export const READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURE_MAP: ReadonlyMap<string, ReadOnlyLiveSnapshotCaptureFixture> =
  new Map(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES.length < 8) {
  throw new Error(
    `Phase 78 fixture count mismatch: expected >= 8, received ${READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES.length}`,
  );
}
if (READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES.length !== READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS.length) {
  throw new Error('Phase 78 name/kind cardinality mismatch');
}

const tableValidation = validateReadOnlyLiveSnapshotCaptureFixtureTable(READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 78 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listReadOnlyLiveSnapshotCaptureFixtures(): readonly ReadOnlyLiveSnapshotCaptureFixture[] {
  return READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURES;
}

export function getReadOnlyLiveSnapshotCaptureFixture(fixtureId: string): ReadOnlyLiveSnapshotCaptureFixture | null {
  return READ_ONLY_LIVE_SNAPSHOT_CAPTURE_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { READ_ONLY_LIVE_SNAPSHOT_CAPTURE_NAMES, READ_ONLY_LIVE_SNAPSHOT_CAPTURE_KINDS };
export type { ReadOnlyLiveSnapshotCaptureName, ReadOnlyLiveSnapshotCaptureKind };
