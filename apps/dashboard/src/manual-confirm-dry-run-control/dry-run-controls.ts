import type { ManualConfirmDryRunControl, ManualConfirmDryRunControlStatus } from './types.js';

export function buildManualConfirmDryRunControl(input: {
  controlId: string;
  controlKind: string;
  controlStatus: ManualConfirmDryRunControlStatus;
}): ManualConfirmDryRunControl {
  return {
    controlId: input.controlId,
    controlKind: input.controlKind,
    dryRunOnly: true,
    liveNetworkAllowed: false,
    executionAllowed: false,
    dispatchAllowed: false,
    controlStatus: input.controlStatus,
  };
}
