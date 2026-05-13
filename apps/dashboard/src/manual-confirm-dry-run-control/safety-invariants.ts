import type { ManualConfirmDryRunSafetyInvariant } from './types.js';

export function buildManualConfirmDryRunSafetyInvariant(input: {
  invariantId: string;
  invariantKind: string;
  invariantHolds: boolean;
  evidenceRef: string;
}): ManualConfirmDryRunSafetyInvariant {
  return {
    invariantId: input.invariantId,
    invariantKind: input.invariantKind,
    invariantHolds: input.invariantHolds,
    failClosed: true,
    evidenceRef: input.evidenceRef,
  };
}
