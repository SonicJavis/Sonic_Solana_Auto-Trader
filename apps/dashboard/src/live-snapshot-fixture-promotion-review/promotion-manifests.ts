import type { FixturePromotionManifest, FixturePromotionManifestStatus } from './types.js';

export function buildFixturePromotionManifest(input: {
  manifestId: string;
  manifestKind: string;
  proposedFixtureName: string;
  proposedFixtureVersion: string;
  manifestStatus: FixturePromotionManifestStatus;
}): FixturePromotionManifest {
  return {
    manifestId: input.manifestId,
    manifestKind: input.manifestKind,
    proposedFixtureName: input.proposedFixtureName,
    proposedFixtureVersion: input.proposedFixtureVersion,
    fileWriteAllowed: false,
    automaticCommitAllowed: false,
    manifestStatus: input.manifestStatus,
  };
}
