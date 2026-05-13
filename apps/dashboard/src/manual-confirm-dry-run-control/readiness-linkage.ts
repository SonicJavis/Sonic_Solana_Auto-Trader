import type { ManualConfirmDryRunReadinessLinkage } from './types.js';

export function buildManualConfirmDryRunReadinessLinkage(input: {
  linkageId: string;
  phase76FixtureRef: string;
  readinessLinked: boolean;
}): ManualConfirmDryRunReadinessLinkage {
  return input;
}
