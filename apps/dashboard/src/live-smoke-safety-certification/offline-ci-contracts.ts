import type { OfflineCiCertificationContract } from './types.js';

export function buildOfflineCiCertificationContract(input: {
  fixtureId: string;
  validationCommands: readonly string[];
}): OfflineCiCertificationContract {
  return {
    contractId: `${input.fixtureId}-offline-ci-contract`,
    standardCiDeterministic: true,
    networkAccess: false,
    liveChecksRun: false,
    optionalSmokeSkipped: true,
    validationCommands: [...input.validationCommands],
    safetyGrepRequired: true,
  };
}
