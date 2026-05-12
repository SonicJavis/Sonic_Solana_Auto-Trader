import type {
  LiveSmokeSafetyCertificationName,
  LiveSmokeSafetyViewModel,
  ProviderCertificationGate,
  SafetyCertificate,
  SmokeResult,
} from './types.js';

export function buildLiveSmokeSafetyViewModel(input: {
  fixtureId: string;
  fixtureName: LiveSmokeSafetyCertificationName;
  smokeResult: SmokeResult;
  certificationGate: ProviderCertificationGate;
  safetyCertificate: SafetyCertificate;
}): LiveSmokeSafetyViewModel {
  return {
    viewModelId: `${input.fixtureId}-view-model`,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    smokeStatus: input.smokeResult.status,
    gateStatus: input.certificationGate.gateStatus,
    certificationStatus: input.safetyCertificate.certificationStatus,
    summary: `${input.smokeResult.status} / ${input.certificationGate.gateStatus} / ${input.safetyCertificate.certificationStatus}`,
  };
}
