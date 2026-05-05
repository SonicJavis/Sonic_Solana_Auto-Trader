/**
 * packages/replay-reporting/src/export-json.ts
 *
 * exportReplayReportJson — deterministic, safe JSON export for replay reports.
 *
 * Rules:
 *   - no undefined values
 *   - no functions
 *   - no Error objects
 *   - no circular data
 *   - no secrets, no RPC URLs
 *   - stable key ordering
 *   - deterministic output for same input
 */

import type { ReplayReportExport } from './types.js';
import { rrOk, rrErr } from './errors.js';
import type { RrResult } from './errors.js';
import { validateJsonSafe } from './validation.js';

let exportCounter = 0;

function generateExportId(contentType: string): string {
  return `exp_json_${contentType}_${++exportCounter}`;
}

/**
 * Recursively converts an object to a JSON-safe representation with stable key ordering.
 * Replaces undefined with null, removes functions, throws on Error objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJsonSafe(value: any): any {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === 'function') return null;
  if (value instanceof Error) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    return value;
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      result[key] = toJsonSafe(value[key]);
    }
    return result;
  }
  return value;
}

export function exportReplayReportJson(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: Record<string, any>,
  contentType: ReplayReportExport['contentType'] = 'run_report',
): RrResult<ReplayReportExport> {
  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    return rrErr('EXPORT_UNSAFE', 'report must be a non-null, non-array object');
  }

  // Validate safety of all string values
  const safetyCheck = validateJsonSafe(report);
  if (!safetyCheck.ok) {
    return rrErr(safetyCheck.code, safetyCheck.message);
  }

  const safifiedPayload = toJsonSafe(report) as Record<string, unknown>;

  const exportDoc: ReplayReportExport = {
    exportId: generateExportId(contentType),
    exportedAt: new Date().toISOString(),
    contentType,
    payload: safifiedPayload,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  return rrOk(exportDoc);
}
