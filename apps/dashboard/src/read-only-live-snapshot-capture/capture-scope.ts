import type { LiveSnapshotCaptureScope, LiveSnapshotCaptureScopeStatus } from './types.js';

export function buildLiveSnapshotCaptureScope(input: {
  scopeId: string;
  scopeKind: string;
  accountSnapshotAllowed: boolean;
  mintSnapshotAllowed: boolean;
  poolSnapshotAllowed: boolean;
  scopeStatus: LiveSnapshotCaptureScopeStatus;
}): LiveSnapshotCaptureScope {
  return {
    scopeId: input.scopeId,
    scopeKind: input.scopeKind,
    accountSnapshotAllowed: input.accountSnapshotAllowed,
    mintSnapshotAllowed: input.mintSnapshotAllowed,
    poolSnapshotAllowed: input.poolSnapshotAllowed,
    transactionWriteAllowed: false,
    scopeStatus: input.scopeStatus,
  };
}
