import type { LiveSnapshotCaptureReport } from './types.js';

export function buildLiveSnapshotCaptureReport(input: {
  reportId: string;
  gateSummary: string;
  requestSummary: string;
  providerSummary: string;
  scopeSummary: string;
  boundsSummary: string;
  stagingSummary: string;
  quarantineSummary: string;
  promotionSummary: string;
  safetySummary: string;
}): LiveSnapshotCaptureReport {
  return { ...input };
}
