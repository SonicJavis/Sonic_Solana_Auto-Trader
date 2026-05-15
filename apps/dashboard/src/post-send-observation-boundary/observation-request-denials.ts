import type { ObservationRequestDenial } from './types.js';

export function buildObservationRequestDenial(input: {
  observationRequestDenialId: string;
  reasonCodes: readonly string[];
}): ObservationRequestDenial {
  return {
    observationRequestDenialId: input.observationRequestDenialId,
    observationRequestBlocked: true,
    confirmationLookupBlocked: true,
    transactionLookupBlocked: true,
    reasonCodes: [...input.reasonCodes],
  };
}
