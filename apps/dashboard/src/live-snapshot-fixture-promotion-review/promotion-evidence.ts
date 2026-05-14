import type { FixturePromotionEvidenceBundle } from './types.js';

export function buildFixturePromotionEvidenceBundle(input: {
  evidenceBundleId: string;
  sourcePhaseRefs: readonly string[];
  sourceFixtureRefs: readonly string[];
  parityAuditRefs: readonly string[];
  validationCommandRefs: readonly string[];
  safetyGrepRefs: readonly string[];
  docsRefs: readonly string[];
  evidenceComplete: boolean;
}): FixturePromotionEvidenceBundle {
  return {
    evidenceBundleId: input.evidenceBundleId,
    sourcePhaseRefs: [...input.sourcePhaseRefs],
    sourceFixtureRefs: [...input.sourceFixtureRefs],
    parityAuditRefs: [...input.parityAuditRefs],
    validationCommandRefs: [...input.validationCommandRefs],
    safetyGrepRefs: [...input.safetyGrepRefs],
    docsRefs: [...input.docsRefs],
    evidenceComplete: input.evidenceComplete,
  };
}
