import type {
  ObservationBoundaryGateStatus,
  PostSendObservationBoundaryName,
  PostSendObservationBoundaryViewModel,
} from './types.js';

export function buildPostSendObservationBoundaryViewModel(input: {
  viewModelId: string;
  fixtureId: string;
  fixtureName: PostSendObservationBoundaryName;
  gateStatus: ObservationBoundaryGateStatus;
}): PostSendObservationBoundaryViewModel {
  return {
    ...input,
    summary: `${input.fixtureName}: gate=${input.gateStatus}, observation=denied`,
  };
}
