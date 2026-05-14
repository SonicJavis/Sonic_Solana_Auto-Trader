import type { SigningRequestDenial } from './types.js';

export function buildSigningRequestDenial(input: { signingRequestDenialId: string; reasonCodes: readonly string[] }): SigningRequestDenial {
  return {
    signingRequestDenialId: input.signingRequestDenialId,
    signingRequestBlocked: true,
    signTransactionBlocked: true,
    signAllTransactionsBlocked: true,
    signatureOutputProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
