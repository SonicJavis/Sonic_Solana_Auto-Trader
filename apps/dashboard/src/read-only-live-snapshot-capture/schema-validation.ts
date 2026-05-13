import type { LiveSnapshotSchemaValidationContract } from './types.js';

export function buildLiveSnapshotSchemaValidationContract(input: {
  validationId: string;
  schemaVersion: string;
  validationStatus: 'pass' | 'warning' | 'fail';
  warningCodes: readonly string[];
  reviewRequired: boolean;
}): LiveSnapshotSchemaValidationContract {
  return {
    validationId: input.validationId,
    schemaVersion: input.schemaVersion,
    validationStatus: input.validationStatus,
    warningCodes: input.warningCodes,
    reviewRequired: input.reviewRequired,
  };
}
