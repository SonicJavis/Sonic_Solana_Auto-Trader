import type {
  BuildReadOnlyProviderCompatibilityCheckInput,
  ReadOnlyProviderCompatibilityCheck,
} from './types.js';

export function buildReadOnlyProviderCompatibilityCheck(
  input: BuildReadOnlyProviderCompatibilityCheckInput,
): ReadOnlyProviderCompatibilityCheck {
  return {
    checkId: `${input.fixtureId}-compatibility-${input.checkKind}`,
    checkKind: input.checkKind,
    pass: input.pass,
    sourceContractName: input.sourceContractName,
    sourceMockName: input.sourceMockName,
    notes: input.notes,
  };
}
