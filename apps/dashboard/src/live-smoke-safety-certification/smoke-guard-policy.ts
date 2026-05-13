import type { SmokeGuardPolicy } from './types.js';

export function buildSmokeGuardPolicy(input: { fixtureId: string }): SmokeGuardPolicy {
  return {
    policyId: `${input.fixtureId}-smoke-guard-policy`,
    failClosed: true,
    skipByDefault: true,
    blockUnsafeCapabilities: true,
    blockWriteMethods: true,
    blockRuntimeRequests: true,
    blockSecrets: true,
    blockExecution: true,
    standardCiOffline: true,
  };
}
