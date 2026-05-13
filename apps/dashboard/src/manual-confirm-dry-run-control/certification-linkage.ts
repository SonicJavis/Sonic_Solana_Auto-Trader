import type { ManualConfirmDryRunCertificationLinkage } from './types.js';

export function buildManualConfirmDryRunCertificationLinkage(input: {
  linkageId: string;
  phase75FixtureRef: string;
  certificationLinked: boolean;
}): ManualConfirmDryRunCertificationLinkage {
  return input;
}
