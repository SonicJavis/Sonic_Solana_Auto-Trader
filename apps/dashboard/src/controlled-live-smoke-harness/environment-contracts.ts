import type { SmokeEnvironmentContract } from './types.js';

export function buildSmokeEnvironmentContract(input: {
  environmentContractId: string;
  standardCiMode: boolean;
  manualOnlyMode: boolean;
}): SmokeEnvironmentContract {
  return {
    environmentContractId: input.environmentContractId,
    standardCiMode: input.standardCiMode,
    manualOnlyMode: input.manualOnlyMode,
    networkDisabledByDefault: true,
    secretsRequiredInStandardCi: false,
    providerKeyRequiredInStandardCi: false,
  };
}
