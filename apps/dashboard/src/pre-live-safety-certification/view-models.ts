import type {
  PreLiveCertificationStatus,
  PreLiveGateStatus,
  PreLiveSafetyCertificationName,
  PreLiveSignoffStatus,
  PreLiveViewModel,
} from './types.js';

export function buildPreLiveViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: PreLiveSafetyCertificationName;
  gateStatus: PreLiveGateStatus;
  certificationStatus: PreLiveCertificationStatus;
  signoffStatus: PreLiveSignoffStatus;
}): PreLiveViewModel {
  return {
    viewModelId: input.viewModelId,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    gateStatus: input.gateStatus,
    certificationStatus: input.certificationStatus,
    signoffStatus: input.signoffStatus,
    summary: `${input.fixtureName} => ${input.gateStatus} / ${input.certificationStatus} / ${input.signoffStatus}`,
  };
}
