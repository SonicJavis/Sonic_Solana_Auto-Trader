import type { SigningDryRunLinkage } from './types.js';

export function buildSigningDryRunLinkage(input: {
  dryRunLinkageId: string;
  sourceDryRunControlRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): SigningDryRunLinkage {
  return {
    dryRunLinkageId: input.dryRunLinkageId,
    sourceDryRunControlRef: input.sourceDryRunControlRef,
    linkageStatus: input.linkageStatus,
  };
}
