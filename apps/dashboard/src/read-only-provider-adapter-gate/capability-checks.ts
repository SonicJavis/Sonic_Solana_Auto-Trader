import type {
  BuildReadOnlyProviderCapabilityCheckInput,
  ReadOnlyProviderCapabilityCheck,
} from './types.js';

export function buildReadOnlyProviderCapabilityCheck(
  input: BuildReadOnlyProviderCapabilityCheckInput,
): ReadOnlyProviderCapabilityCheck {
  return {
    checkId: `${input.fixtureId}-capability-check-${input.checkKind}`,
    checkKind: input.checkKind,
    expectedSafeValue: input.expectedSafeValue,
    actualFixtureValue: input.actualFixtureValue,
    pass: input.expectedSafeValue === input.actualFixtureValue,
    safetyNotes: input.safetyNotes,
  };
}
