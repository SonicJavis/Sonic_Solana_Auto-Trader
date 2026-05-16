import type { ExecutionOutcomeAuditContractName } from '../execution-outcome-audit-contracts/types.js';
import type { OutcomeRiskFeedbackContractName } from '../outcome-risk-feedback-contracts/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { RiskExplanationEvidenceName } from '../risk-explanation-evidence/types.js';
import type {
  ReevaluationCertificationLinkage,
  ReevaluationFeedbackLinkage,
  ReevaluationLinkStatus,
  ReevaluationOutcomeLinkage,
  ReevaluationRiskLinkage,
} from './types.js';

export function buildReevaluationFeedbackLinkage(input: {
  id: string;
  sourceFeedbackFixtureRefs: readonly OutcomeRiskFeedbackContractName[];
  feedbackLinkStatus: ReevaluationLinkStatus;
}): ReevaluationFeedbackLinkage {
  return {
    feedbackLinkageId: input.id,
    sourceFeedbackPhase: 87,
    sourceFeedbackFixtureRefs: input.sourceFeedbackFixtureRefs,
    feedbackLinkStatus: input.feedbackLinkStatus,
    liveFeedbackUpdateAllowed: false,
  };
}

export function buildReevaluationRiskLinkage(input: {
  id: string;
  sourceRiskPhases: readonly (58 | 59)[];
  sourceRiskRefs: readonly RiskExplanationEvidenceName[];
  riskLinkStatus: ReevaluationLinkStatus;
}): ReevaluationRiskLinkage {
  return {
    riskLinkageId: input.id,
    sourceRiskPhases: input.sourceRiskPhases,
    sourceRiskRefs: input.sourceRiskRefs,
    riskLinkStatus: input.riskLinkStatus,
    liveRiskUpdateAllowed: false,
  };
}

export function buildReevaluationOutcomeLinkage(input: {
  id: string;
  sourceOutcomeRefs: readonly ExecutionOutcomeAuditContractName[];
  outcomeLinkStatus: ReevaluationLinkStatus;
}): ReevaluationOutcomeLinkage {
  return {
    outcomeLinkageId: input.id,
    sourceOutcomePhase: 86,
    sourceOutcomeRefs: input.sourceOutcomeRefs,
    outcomeLinkStatus: input.outcomeLinkStatus,
    liveOutcomeLookupAllowed: false,
  };
}

export function buildReevaluationCertificationLinkage(input: {
  id: string;
  sourceCertPhases: readonly (75 | 69)[];
  sourceCertRefs: readonly (PreLiveSafetyCertificationName | LiveSmokeSafetyCertificationName)[];
  certLinkStatus: ReevaluationLinkStatus;
}): ReevaluationCertificationLinkage {
  return {
    certificationLinkageId: input.id,
    sourceCertPhases: input.sourceCertPhases,
    sourceCertRefs: input.sourceCertRefs,
    certLinkStatus: input.certLinkStatus,
    liveCertFetchAllowed: false,
  };
}
