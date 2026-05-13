import type { PreLiveCertificationReport } from './types.js';

export function buildPreLiveReport(report: PreLiveCertificationReport): PreLiveCertificationReport {
  return { ...report };
}
