import type { ProviderSmokeEligibilityCheck } from './types.js';

export function buildProviderSmokeEligibilityCheck(input: {
  fixtureId: string;
  providerId: string;
  readOnlyProvider: boolean;
  unsafeCapabilitiesDetected: boolean;
  hasProviderConfig: boolean;
  crossProviderQualityReady: boolean;
  replayCertificationReady: boolean;
  reasonCodes: readonly string[];
}): ProviderSmokeEligibilityCheck {
  const eligible =
    input.readOnlyProvider &&
    !input.unsafeCapabilitiesDetected &&
    input.hasProviderConfig &&
    input.crossProviderQualityReady &&
    input.replayCertificationReady;
  return {
    eligibilityId: `${input.fixtureId}-provider-eligibility`,
    providerId: input.providerId,
    readOnlyProvider: input.readOnlyProvider,
    unsafeCapabilitiesDetected: input.unsafeCapabilitiesDetected,
    hasProviderConfig: input.hasProviderConfig,
    crossProviderQualityReady: input.crossProviderQualityReady,
    replayCertificationReady: input.replayCertificationReady,
    eligible,
    reasonCodes: [...input.reasonCodes],
  };
}
