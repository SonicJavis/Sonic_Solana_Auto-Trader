import type {
  BuildReadOnlyProviderGateStateInput,
  ReadOnlyProviderGateState,
} from './types.js';

export function buildReadOnlyProviderGateState(
  input: BuildReadOnlyProviderGateStateInput,
): ReadOnlyProviderGateState {
  return {
    stateId: `${input.fixtureId}-state-${input.stateKind}`,
    stateKind: input.stateKind,
    failClosed: true,
    closedByDefault: true,
    syntheticOnly: true,
    mockOnly: input.mockOnly,
    allowed: input.allowed,
    futurePhaseOnly: input.futurePhaseOnly ?? true,
  };
}
