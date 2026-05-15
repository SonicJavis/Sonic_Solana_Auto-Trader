import type { SignedPayloadDenial } from './types.js';

export function buildSignedPayloadDenial(input: {
  signedPayloadDenialId: string;
  reasonCodes: readonly string[];
}): SignedPayloadDenial {
  return {
    signedPayloadDenialId: input.signedPayloadDenialId,
    signatureOutputProduced: false,
    signedPayloadProduced: false,
    signedTransactionPayloadProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
