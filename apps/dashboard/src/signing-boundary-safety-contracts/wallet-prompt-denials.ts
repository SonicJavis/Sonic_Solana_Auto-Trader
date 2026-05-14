import type { WalletPromptDenial } from './types.js';

export function buildWalletPromptDenial(input: { walletPromptDenialId: string; reasonCodes: readonly string[] }): WalletPromptDenial {
  return {
    walletPromptDenialId: input.walletPromptDenialId,
    walletPromptBlocked: true,
    walletAdapterAllowed: false,
    browserWalletAccessAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
