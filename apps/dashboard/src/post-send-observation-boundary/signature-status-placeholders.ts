import type { SignatureStatusPlaceholder } from './types.js';

export function buildSignatureStatusPlaceholder(input: {
  signatureStatusPlaceholderId: string;
  reasonCodes: readonly string[];
}): SignatureStatusPlaceholder {
  return {
    signatureStatusPlaceholderId: input.signatureStatusPlaceholderId,
    placeholderOnly: true,
    realSignatureRequired: false,
    liveSignatureLookupAllowed: false,
    signatureStatusProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
