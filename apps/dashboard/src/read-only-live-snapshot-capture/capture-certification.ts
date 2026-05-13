import type { LiveSnapshotCaptureCertification } from './types.js';

export function buildLiveSnapshotCaptureCertification(input: {
  certificationId: string;
  certificationStatus: 'pass' | 'warning' | 'fail';
}): LiveSnapshotCaptureCertification {
  return {
    certificationId: input.certificationId,
    certifiedReadOnly: true,
    failClosed: true,
    certificationStatus: input.certificationStatus,
  };
}
