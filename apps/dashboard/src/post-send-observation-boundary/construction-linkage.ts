import type { ObservationConstructionLinkage } from './types.js';

export function buildObservationConstructionLinkage(input: {
  constructionLinkageId: string;
  sourceTransactionConstructionMockRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ObservationConstructionLinkage {
  return {
    constructionLinkageId: input.constructionLinkageId,
    sourceTransactionConstructionMockRef: input.sourceTransactionConstructionMockRef,
    linkageStatus: input.linkageStatus,
  };
}
