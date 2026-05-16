import type { OutcomeConstructionLinkage } from './types.js';

export function buildOutcomeConstructionLinkage(input: {
  constructionLinkageId: string;
  sourceTransactionConstructionMockRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): OutcomeConstructionLinkage {
  return {
    constructionLinkageId: input.constructionLinkageId,
    sourceTransactionConstructionMockRef: input.sourceTransactionConstructionMockRef,
    linkageStatus: input.linkageStatus,
  };
}
