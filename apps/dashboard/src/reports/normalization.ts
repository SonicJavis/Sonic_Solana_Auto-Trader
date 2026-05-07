/**
 * apps/dashboard/src/reports/normalization.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Normalization
 */

import type { DashboardReportModel, DashboardReportSection } from './types.js';

function normalizeSection(section: DashboardReportSection): DashboardReportSection {
  return {
    ...section,
    visiblePanelIds: [...section.visiblePanelIds].sort(),
    hiddenPanelIds: [...section.hiddenPanelIds].sort(),
    notes: [...section.notes].sort(),
  };
}

export function normalizeDashboardReportModel(report: DashboardReportModel): DashboardReportModel {
  return {
    ...report,
    sections: [...report.sections]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(normalizeSection),
    summary: {
      ...report.summary,
      expectedComponentTypes: [...report.summary.expectedComponentTypes].sort(),
    },
    meta: {
      ...report.meta,
      sourceSnapshotNames: [...report.meta.sourceSnapshotNames].sort(),
      notes: [...report.meta.notes].sort(),
    },
    safeNotes: [...report.safeNotes].sort(),
  };
}

export function serializeDashboardReportModel(report: DashboardReportModel): Record<string, unknown> {
  return JSON.parse(JSON.stringify(report)) as Record<string, unknown>;
}

export function isDashboardReportSerializable(report: DashboardReportModel): boolean {
  try {
    const serialized = JSON.stringify(report);
    if (typeof serialized !== 'string') return false;
    JSON.parse(serialized);
    return true;
  } catch {
    return false;
  }
}

export function areDashboardReportsEqual(a: DashboardReportModel, b: DashboardReportModel): boolean {
  return JSON.stringify(normalizeDashboardReportModel(a)) === JSON.stringify(normalizeDashboardReportModel(b));
}
