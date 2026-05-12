import type { LiveSmokeCertificationStatus, SafetyCertificate } from './types.js';

export function buildSafetyCertificate(input: {
  fixtureId: string;
  providerId: string;
  certifiedReadOnly: boolean;
  certifiedOfflineCi: boolean;
  certifiedNoSecrets: boolean;
  certifiedNoExecution: boolean;
  certifiedNoAdvisory: boolean;
  certificationStatus: LiveSmokeCertificationStatus;
  failureReasons: readonly string[];
}): SafetyCertificate {
  return {
    certificateId: `${input.fixtureId}-safety-certificate`,
    providerId: input.providerId,
    certifiedReadOnly: input.certifiedReadOnly,
    certifiedOfflineCi: input.certifiedOfflineCi,
    certifiedNoSecrets: input.certifiedNoSecrets,
    certifiedNoExecution: input.certifiedNoExecution,
    certifiedNoAdvisory: input.certifiedNoAdvisory,
    certificationStatus: input.certificationStatus,
    failureReasons: [...input.failureReasons],
  };
}
