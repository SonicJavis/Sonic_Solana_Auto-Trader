import type { ProviderCertificationTelemetryLinkage } from './types.js';

export function buildProviderCertificationTelemetryLinkage(input: {
  fixtureId: string;
  providerId: string;
  sourceCertificateId: string;
  certificationStatus: ProviderCertificationTelemetryLinkage['certificationStatus'];
  telemetryCompatible: boolean;
  driftCompatible: boolean;
  failClosed: boolean;
}): ProviderCertificationTelemetryLinkage {
  return {
    linkageId: `${input.fixtureId}-certification-linkage`,
    providerId: input.providerId,
    sourceCertificateId: input.sourceCertificateId,
    certificationStatus: input.certificationStatus,
    telemetryCompatible: input.telemetryCompatible,
    driftCompatible: input.driftCompatible,
    failClosed: input.failClosed,
  };
}
