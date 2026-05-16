import {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
  type ReevaluationReport,
} from './types.js';

export function buildReevaluationReport(input: {
  id: string;
  gateSummary: string;
  feedbackReviewSummary: string;
  safetyGateLinkSummary: string;
  manualReviewSummary: string;
  gateStatusSummary: string;
  blockerEscalationSummary: string;
  evidenceSummary: string;
  safetySummary: string;
}): ReevaluationReport {
  return {
    reportId: input.id,
    phase: RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
    gateSummary: input.gateSummary,
    feedbackReviewSummary: input.feedbackReviewSummary,
    safetyGateLinkSummary: input.safetyGateLinkSummary,
    manualReviewSummary: input.manualReviewSummary,
    gateStatusSummary: input.gateStatusSummary,
    blockerEscalationSummary: input.blockerEscalationSummary,
    evidenceSummary: input.evidenceSummary,
    safetySummary: input.safetySummary,
  };
}
