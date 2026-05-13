import type { SmokeReadinessViewModel, ControlledLiveSmokeHarnessName, SmokeGuardState } from './types.js';

export function buildSmokeReadinessViewModel(input: {
  viewModelId: string;
  fixtureName: ControlledLiveSmokeHarnessName;
  fixtureId: string;
  providerId: string;
  readinessStatus: string;
  disabledByDefault: boolean;
  guardState: SmokeGuardState;
}): SmokeReadinessViewModel {
  return {
    viewModelId: input.viewModelId,
    fixtureName: input.fixtureName,
    fixtureId: input.fixtureId,
    providerId: input.providerId,
    readinessStatus: input.readinessStatus,
    disabledByDefault: input.disabledByDefault,
    guardState: input.guardState,
    summary: `${input.fixtureName} => ${input.readinessStatus} (guard: ${input.guardState})`,
  };
}
