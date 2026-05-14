import type { SignatureOutputDenial } from './types.js';

export function buildSignatureOutputDenial(input: { signatureOutputDenialId: string; reasonCodes: readonly string[] }): SignatureOutputDenial {
  return {
    signatureOutputDenialId: input.signatureOutputDenialId,
    signatureBytesProduced: false,
    signedTransactionProduced: false,
    signedMessageProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
