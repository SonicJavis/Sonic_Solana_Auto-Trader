import type { SmokeSecretDenialContract } from './types.js';

export function buildSmokeSecretDenialContract(input: {
  denialId: string;
  safetyNotes: string;
}): SmokeSecretDenialContract {
  return {
    denialId: input.denialId,
    deniesSecretRead: true,
    deniesSecretLogging: true,
    deniesApiKeyRequirementInCi: true,
    safetyNotes: input.safetyNotes,
  };
}
