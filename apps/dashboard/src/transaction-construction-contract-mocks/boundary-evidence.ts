import type { ExecutionBoundaryEvidence } from './types.js';

export function buildExecutionBoundaryEvidence(input: {
  evidenceBundleId: string;
  sourcePhaseRefs: readonly string[];
  sourceFixtureRefs: readonly string[];
  validationCommandRefs: readonly string[];
  safetyGrepRefs: readonly string[];
  docsRefs: readonly string[];
  evidenceComplete: boolean;
}): ExecutionBoundaryEvidence {
  return {
    evidenceBundleId: input.evidenceBundleId,
    sourcePhaseRefs: [...input.sourcePhaseRefs],
    sourceFixtureRefs: [...input.sourceFixtureRefs],
    validationCommandRefs: [...input.validationCommandRefs],
    safetyGrepRefs: [...input.safetyGrepRefs],
    docsRefs: [...input.docsRefs],
    evidenceComplete: input.evidenceComplete,
  };
}
