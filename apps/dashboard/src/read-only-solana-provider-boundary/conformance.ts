import type {
  BuildReadOnlySolanaConformanceCheckInput,
  ReadOnlySolanaConformanceCheck,
} from './types.js';

export function buildReadOnlySolanaConformanceCheck(
  input: BuildReadOnlySolanaConformanceCheckInput,
): ReadOnlySolanaConformanceCheck {
  return {
    checkId: `${input.fixtureId}-conformance-${input.checkKind}`,
    checkKind: input.checkKind,
    pass: input.pass,
    summary: input.summary,
  };
}

