import type { LiveSnapshotCaptureBounds } from './types.js';

export function buildLiveSnapshotCaptureBounds(input: {
  boundsId: string;
  maxRequestCount: number;
  maxObservationCount: number;
  deterministicWindowLabel: string;
}): LiveSnapshotCaptureBounds {
  return {
    boundsId: input.boundsId,
    maxRequestCount: input.maxRequestCount,
    maxObservationCount: input.maxObservationCount,
    deterministicWindowLabel: input.deterministicWindowLabel,
    usesRuntimeTimers: false,
    scheduledCaptureAllowed: false,
  };
}
