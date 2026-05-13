import type {
  ManualConfirmInvariantKind,
  ManualConfirmSafetyInvariant,
} from './types.js';

export function buildManualConfirmSafetyInvariant(input: {
  invariantId: string;
  invariantKind: ManualConfirmInvariantKind;
  invariantHolds: boolean;
  evidenceRef: string;
}): ManualConfirmSafetyInvariant {
  return {
    invariantId: input.invariantId,
    invariantKind: input.invariantKind,
    invariantHolds: input.invariantHolds,
    failClosed: true,
    unlockAuthority: false,
    evidenceRef: input.evidenceRef,
  };
}
