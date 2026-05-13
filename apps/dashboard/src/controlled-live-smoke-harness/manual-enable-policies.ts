import type { ManualEnableSmokePolicy } from './types.js';

export function buildManualEnableSmokePolicy(input: {
  policyId: string;
  policyName: string;
}): ManualEnableSmokePolicy {
  return {
    policyId: input.policyId,
    policyName: input.policyName,
    requiresManualTrigger: true,
    requiresExplicitFlag: true,
    allowsStandardCi: false,
    allowsScheduledRuns: false,
    requiresSecretsInCi: false,
    failClosed: true,
  };
}
