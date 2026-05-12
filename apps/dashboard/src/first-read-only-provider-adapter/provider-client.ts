import type { FirstReadOnlyProviderClientContract } from './types.js';

export function buildFirstReadOnlyProviderClientContract(input: {
  fixtureId: string;
}): FirstReadOnlyProviderClientContract {
  return {
    clientContractId: `${input.fixtureId}-client-contract`,
    readOnly: true,
    supportedReadMethods: [
      'getAccountInfoShape',
      'getMintAuthorityShape',
      'getTokenMetadataShape',
      'getProviderHealthShape',
      'getProviderErrorShape',
    ],
    unsupportedWriteMethods: [
      'buildTransaction',
      'signTransaction',
      'sendTransaction',
      'executeOrder',
    ],
    walletRequired: false,
    signingRequired: false,
    transactionSendingRequired: false,
    executionRequired: false,
    constructorHasSideEffects: false,
    moduleImportHasSideEffects: false,
  };
}
