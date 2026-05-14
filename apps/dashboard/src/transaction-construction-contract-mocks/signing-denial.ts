import type { ExecutionSigningDenial } from './types.js';

export function buildExecutionSigningDenial(input: {
  signingDenialId: string;
  reasonCodes: readonly string[];
}): ExecutionSigningDenial {
  return {
    signingDenialId: input.signingDenialId,
    signingBlocked: true,
    walletPromptBlocked: true,
    keyMaterialRequired: false,
    reasonCodes: input.reasonCodes,
  };
}

export { buildExecutionSigningDenial as buildTransactionSigningDenial };
