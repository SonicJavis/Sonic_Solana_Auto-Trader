import type { ReplayImportGatePolicy } from './types.js';

export function buildReplayImportGatePolicy(
  input: Omit<ReplayImportGatePolicy, 'gatePolicyId'> & { fixtureId: string },
): ReplayImportGatePolicy {
  return {
    gatePolicyId: `${input.fixtureId}-gate-policy`,
    gateState: input.gateState,
    disabledByDefault: true,
    requiresManualEnable: true,
    allowsLiveImport: false,
    allowsFilesystemImport: false,
    allowsRuntimeIngestion: false,
    failClosed: input.failClosed,
  };
}

export const buildSnapshotFreshnessContract = buildReplayImportGatePolicy;
