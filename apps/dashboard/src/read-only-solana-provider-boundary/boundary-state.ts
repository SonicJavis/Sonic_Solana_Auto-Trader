import type {
  BuildReadOnlySolanaBoundaryStateInput,
  ReadOnlySolanaBoundaryState,
} from './types.js';

export function buildReadOnlySolanaBoundaryState(
  input: BuildReadOnlySolanaBoundaryStateInput,
): ReadOnlySolanaBoundaryState {
  return {
    stateId: `${input.fixtureId}-state-${input.stateKind}`,
    stateKind: input.stateKind,
    notLive: true,
    gateAware: true,
    futureOnly: input.futureOnly,
    allowedByGate: input.allowedByGate,
  };
}

