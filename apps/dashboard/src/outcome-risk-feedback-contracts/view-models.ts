import type {
  FeedbackLoopGateStatus,
  OutcomeRiskFeedbackContractName,
  OutcomeRiskFeedbackViewModel,
} from './types.js';

export function buildOutcomeRiskFeedbackViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: OutcomeRiskFeedbackContractName;
  gateStatus: FeedbackLoopGateStatus;
}): OutcomeRiskFeedbackViewModel {
  return {
    ...input,
    summary: `${input.fixtureName}: gate=${input.gateStatus}, feedback=deterministic-only`,
  };
}
