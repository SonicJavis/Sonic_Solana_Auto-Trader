import type { RiskFeedbackSafetyGateReevaluationName } from '../risk-feedback-safety-gate-reevaluation/types.js';
import type { DossierLinkStatus, DossierReevaluationLinkage } from './types.js';

export function buildDossierReevaluationLinkage(input: {
  id: string;
  sourceReevaluationFixtureRefs: readonly RiskFeedbackSafetyGateReevaluationName[];
  linkageStatus: DossierLinkStatus;
}): DossierReevaluationLinkage {
  return {
    reevaluationLinkageId: input.id,
    sourceReevaluationPhase: 88,
    sourceReevaluationFixtureRefs: input.sourceReevaluationFixtureRefs,
    linkageStatus: input.linkageStatus,
    liveGateStatusFetchAllowed: false,
  };
}
