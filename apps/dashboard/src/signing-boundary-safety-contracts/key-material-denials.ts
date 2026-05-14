import type { KeyMaterialDenial } from './types.js';

export function buildKeyMaterialDenial(input: { keyMaterialDenialId: string; reasonCodes: readonly string[] }): KeyMaterialDenial {
  return {
    keyMaterialDenialId: input.keyMaterialDenialId,
    privateKeyAccessAllowed: false,
    keypairAccessAllowed: false,
    seedPhraseAccessAllowed: false,
    mnemonicAccessAllowed: false,
    secretStorageAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
