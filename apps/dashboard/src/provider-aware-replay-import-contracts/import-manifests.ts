import type { ReplayImportManifest } from './types.js';

export function buildReplayImportManifest(input: {
  fixtureId: string;
  manifestName: string;
  generatedAt: ReplayImportManifest['generatedAt'];
  schemaVersion: ReplayImportManifest['schemaVersion'];
  sourceCandidateIds: readonly string[];
  checksum: string;
}): ReplayImportManifest {
  return {
    manifestId: `${input.fixtureId}-manifest`,
    manifestName: input.manifestName,
    manifestKind: 'replay_import_manifest',
    schemaVersion: input.schemaVersion,
    generatedAt: input.generatedAt,
    sourceCandidateIds: [...input.sourceCandidateIds],
    checksum: input.checksum,
    deterministic: true,
  };
}

export const buildSnapshotManifest = buildReplayImportManifest;
