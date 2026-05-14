import type { SignerIdentityPlaceholder } from './types.js';

export function buildSignerIdentityPlaceholder(input: {
  signerIdentityPlaceholderId: string;
  signerLabel: string;
}): SignerIdentityPlaceholder {
  return {
    signerIdentityPlaceholderId: input.signerIdentityPlaceholderId,
    signerLabel: input.signerLabel,
    placeholderOnly: true,
    realPublicKeyRequired: false,
    signerAuthorityGranted: false,
  };
}
