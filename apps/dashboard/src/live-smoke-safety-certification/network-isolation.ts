import type { NetworkIsolationPolicy } from './types.js';

export function buildNetworkIsolationPolicy(input: {
  fixtureId: string;
  timeoutPolicy: string;
  retryPolicyMetadataOnly: string;
}): NetworkIsolationPolicy {
  return {
    isolationPolicyId: `${input.fixtureId}-network-isolation`,
    standardCiNetworkAccess: false,
    manualSmokeNetworkAccessAllowed: false,
    endpointRequired: false,
    apiKeyRequired: false,
    timeoutPolicy: input.timeoutPolicy,
    retryPolicyMetadataOnly: input.retryPolicyMetadataOnly,
  };
}
