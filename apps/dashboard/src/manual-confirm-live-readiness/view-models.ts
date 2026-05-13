import type {
  ManualConfirmApprovalStatus,
  ManualConfirmChecklistStatus,
  ManualConfirmCoolingOffStatus,
  ManualConfirmGateStatus,
  ManualConfirmLiveReadinessName,
  ManualConfirmPhraseStatus,
  ManualConfirmRoleStatus,
  ManualConfirmViewModel,
} from './types.js';

export function buildManualConfirmViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: ManualConfirmLiveReadinessName;
  gateStatus: ManualConfirmGateStatus;
  approvalStatus: ManualConfirmApprovalStatus;
  phraseStatus: ManualConfirmPhraseStatus;
  roleSeparationStatus: ManualConfirmRoleStatus;
  coolingOffStatus: ManualConfirmCoolingOffStatus;
  checklistStatus: ManualConfirmChecklistStatus;
}): ManualConfirmViewModel {
  return {
    viewModelId: input.viewModelId,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    gateStatus: input.gateStatus,
    approvalStatus: input.approvalStatus,
    phraseStatus: input.phraseStatus,
    roleSeparationStatus: input.roleSeparationStatus,
    coolingOffStatus: input.coolingOffStatus,
    checklistStatus: input.checklistStatus,
    summary: `${input.fixtureName} => gate:${input.gateStatus} / approval:${input.approvalStatus} / phrase:${input.phraseStatus}`,
  };
}
