import type {
  ManualConfirmDryRunControlName,
  ManualConfirmDryRunControlStatus,
  ManualConfirmDryRunGateStatus,
  ManualConfirmDryRunPreflightStatus,
  ManualConfirmDryRunViewModel,
} from './types.js';

export function buildManualConfirmDryRunViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: ManualConfirmDryRunControlName;
  gateStatus: ManualConfirmDryRunGateStatus;
  preflightStatus: ManualConfirmDryRunPreflightStatus;
  controlStatus: ManualConfirmDryRunControlStatus;
}): ManualConfirmDryRunViewModel {
  return {
    ...input,
    summary: `${input.fixtureName} => gate:${input.gateStatus} / preflight:${input.preflightStatus} / control:${input.controlStatus}`,
  };
}
