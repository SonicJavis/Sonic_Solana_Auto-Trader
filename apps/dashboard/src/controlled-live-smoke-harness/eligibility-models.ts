import type { SmokeEligibilityModel } from './types.js';

export function buildSmokeEligibilityModel(input: {
  eligibilityId: string;
  providerId: string;
  reliabilityCompatible: boolean;
  certificationCompatible: boolean;
  replayImportCompatible: boolean;
  eligibleForManualSmoke: boolean;
  ineligibleReasonCodes: readonly string[];
}): SmokeEligibilityModel {
  return {
    eligibilityId: input.eligibilityId,
    providerId: input.providerId,
    reliabilityCompatible: input.reliabilityCompatible,
    certificationCompatible: input.certificationCompatible,
    replayImportCompatible: input.replayImportCompatible,
    eligibleForManualSmoke: input.eligibleForManualSmoke,
    ineligibleReasonCodes: [...input.ineligibleReasonCodes],
    failClosed: true,
  };
}
