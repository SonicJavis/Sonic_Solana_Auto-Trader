import type { RiskFeedbackLink } from './types.js';

export function buildRiskFeedbackLink(input: {
  riskFeedbackLinkId: string;
  sourceRiskFixtureRef: string;
  sourceEvidenceFixtureRef: string;
  sourceOutcomeAuditFixtureRef: string;
  linkStatus: 'linked' | 'warning' | 'blocked';
}): RiskFeedbackLink {
  return {
    riskFeedbackLinkId: input.riskFeedbackLinkId,
    sourceRiskFixtureRef: input.sourceRiskFixtureRef,
    sourceEvidenceFixtureRef: input.sourceEvidenceFixtureRef,
    sourceOutcomeAuditFixtureRef: input.sourceOutcomeAuditFixtureRef,
    linkStatus: input.linkStatus,
    liveRiskRefreshAllowed: false,
  };
}
