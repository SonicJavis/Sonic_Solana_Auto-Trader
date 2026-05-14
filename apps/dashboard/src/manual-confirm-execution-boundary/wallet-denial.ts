import type { ExecutionWalletDenial } from './types.js';

export function buildExecutionWalletDenial(input: {
  walletDenialId: string;
  reasonCodes: readonly string[];
}): ExecutionWalletDenial {
  return {
    walletDenialId: input.walletDenialId,
    walletLogicAllowed: false,
    privateKeyHandlingAllowed: false,
    keypairHandlingAllowed: false,
    reasonCodes: input.reasonCodes,
  };
}
