import type { PreLiveEvidenceBundle } from './types.js';

export function buildPreLiveEvidenceBundle(input: {
  evidenceBundleId: string;
  sourcePhaseRefs: readonly string[];
  sourceFixtureRefs: readonly string[];
  validationCommandRefs: readonly string[];
  safetyGrepRefs: readonly string[];
  reviewRefs: readonly string[];
  docsRefs: readonly string[];
  evidenceComplete: boolean;
}): PreLiveEvidenceBundle {
  return {
    evidenceBundleId: input.evidenceBundleId,
    sourcePhaseRefs: [...input.sourcePhaseRefs],
    sourceFixtureRefs: [...input.sourceFixtureRefs],
    validationCommandRefs: [...input.validationCommandRefs],
    safetyGrepRefs: [...input.safetyGrepRefs],
    reviewRefs: [...input.reviewRefs],
    docsRefs: [...input.docsRefs],
    evidenceComplete: input.evidenceComplete,
  };
}
