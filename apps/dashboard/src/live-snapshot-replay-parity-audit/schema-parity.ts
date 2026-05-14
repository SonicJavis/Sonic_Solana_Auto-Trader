import type { LiveSnapshotSchemaParity } from './types.js';

export function buildLiveSnapshotSchemaParity(input: {
  schemaParityId: string;
  schemaVersion: string;
  schemaStatus: 'pass' | 'warning' | 'fail';
  mismatchFields: readonly string[];
}): LiveSnapshotSchemaParity {
  return {
    schemaParityId: input.schemaParityId,
    schemaVersion: input.schemaVersion,
    schemaStatus: input.schemaStatus,
    mismatchFields: input.mismatchFields,
  };
}
