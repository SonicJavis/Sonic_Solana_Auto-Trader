import type { ExecutionBoundaryState, ExecutionBoundaryStateKind, ExecutionBoundaryStateStatus } from './types.js';

export function buildExecutionBoundaryState(input: {
  boundaryStateId: string;
  boundaryStateKind: ExecutionBoundaryStateKind;
  stateStatus: ExecutionBoundaryStateStatus;
}): ExecutionBoundaryState {
  return {
    boundaryStateId: input.boundaryStateId,
    boundaryStateKind: input.boundaryStateKind,
    designOnly: true,
    liveExecutionAvailable: false,
    futurePhaseRequired: true,
    stateStatus: input.stateStatus,
  };
}
