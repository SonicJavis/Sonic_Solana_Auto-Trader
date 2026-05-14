import type { SigningConstructionLinkage } from './types.js';

export function buildSigningConstructionLinkage(input: {
  constructionLinkageId: string;
  sourceTransactionConstructionMockRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): SigningConstructionLinkage {
  return {
    constructionLinkageId: input.constructionLinkageId,
    sourceTransactionConstructionMockRef: input.sourceTransactionConstructionMockRef,
    linkageStatus: input.linkageStatus,
  };
}
