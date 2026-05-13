import type { SmokeCertificationReport } from './types.js';

export function buildSmokeReport(report: SmokeCertificationReport): SmokeCertificationReport {
  return { ...report };
}
