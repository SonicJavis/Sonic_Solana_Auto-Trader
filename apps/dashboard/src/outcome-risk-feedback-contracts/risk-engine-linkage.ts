import type { FeedbackRiskEngineLinkage } from './types.js';

export function buildFeedbackRiskEngineLinkage(input: {
  feedbackRiskEngineLinkageId: string;
  sourceRiskEngineRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): FeedbackRiskEngineLinkage {
  return {
    feedbackRiskEngineLinkageId: input.feedbackRiskEngineLinkageId,
    sourceRiskEngineRef: input.sourceRiskEngineRef,
    linkageStatus: input.linkageStatus,
  };
}
