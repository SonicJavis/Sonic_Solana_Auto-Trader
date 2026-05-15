import type { SendConstructionLinkage } from './types.js';

export function buildSendConstructionLinkage(input: {
  constructionLinkageId: string;
  sourceTransactionConstructionMockRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): SendConstructionLinkage {
  return {
    constructionLinkageId: input.constructionLinkageId,
    sourceTransactionConstructionMockRef: input.sourceTransactionConstructionMockRef,
    linkageStatus: input.linkageStatus,
  };
}
