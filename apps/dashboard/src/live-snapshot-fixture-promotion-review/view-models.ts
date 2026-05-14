import type {
  FixturePromotionCandidateStatus,
  FixturePromotionManifestStatus,
  FixturePromotionReviewGateStatus,
  FixturePromotionViewModel,
  LiveSnapshotFixturePromotionReviewName,
} from './types.js';

export function buildFixturePromotionViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: LiveSnapshotFixturePromotionReviewName;
  gateStatus: FixturePromotionReviewGateStatus;
  candidateStatus: FixturePromotionCandidateStatus;
  manifestStatus: FixturePromotionManifestStatus;
}): FixturePromotionViewModel {
  return {
    ...input,
    summary: `${input.fixtureName} => gate:${input.gateStatus} / candidate:${input.candidateStatus} / manifest:${input.manifestStatus}`,
  };
}
