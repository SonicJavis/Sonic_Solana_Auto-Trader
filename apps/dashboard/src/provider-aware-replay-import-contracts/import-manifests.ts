import type { SnapshotManifest } from './types.js';

export function buildSnapshotManifest(input: {
  fixtureId: string;
  snapshotName: string;
  snapshotKind: SnapshotManifest['snapshotKind'];
  capturedAt: string;
  sourceProviderId: string;
  sourceReliabilityFixtureName: SnapshotManifest['sourceReliabilityFixtureName'];
  schemaVersion: SnapshotManifest['schemaVersion'];
  phase: SnapshotManifest['phase'];
}): SnapshotManifest {
  return {
    snapshotId: `${input.fixtureId}-snapshot`,
    snapshotName: input.snapshotName,
    snapshotKind: input.snapshotKind,
    phase: input.phase,
    schemaVersion: input.schemaVersion,
    capturedAt: input.capturedAt,
    fixtureOnly: true,
    liveData: false,
    sourceProviderId: input.sourceProviderId,
    sourceReliabilityFixtureName: input.sourceReliabilityFixtureName,
  };
}
