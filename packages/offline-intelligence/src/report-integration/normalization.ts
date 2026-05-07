/**
 * Phase 34 — Offline Intelligence Report Integration Models v1: normalization helpers.
 */

import type {
  OfflineIntelligenceReportModel,
  OfflineIntelligenceTypedReportSection,
} from './types.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function normalizeSection(
  section: OfflineIntelligenceTypedReportSection,
): OfflineIntelligenceTypedReportSection {
  const normalizedNotes = sortStrings(section.notes);
  switch (section.kind) {
    case 'risk':
    case 'quality':
    case 'confidence':
      return {
        ...section,
        indicators: sortStrings(section.indicators),
        notes: normalizedNotes,
      };
    default:
      return {
        ...section,
        notes: normalizedNotes,
      };
  }
}

export function normalizeOfflineIntelligenceReportModel(
  report: OfflineIntelligenceReportModel,
): OfflineIntelligenceReportModel {
  return {
    ...report,
    sections: [...report.sections]
      .map(normalizeSection)
      .sort((left, right) => left.id.localeCompare(right.id)),
    summary: {
      ...report.summary,
      notes: sortStrings(report.summary.notes),
    },
    meta: {
      ...report.meta,
      notes: sortStrings(report.meta.notes),
      sourceCompositeWeighting: {
        ...report.meta.sourceCompositeWeighting,
        notes: sortStrings(report.meta.sourceCompositeWeighting.notes),
      },
    },
    safeNotes: sortStrings(report.safeNotes),
  };
}

export function serializeOfflineIntelligenceReportModel(
  report: OfflineIntelligenceReportModel,
): string {
  return JSON.stringify(normalizeOfflineIntelligenceReportModel(report));
}

export function isOfflineIntelligenceReportModelSerializable(value: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function areOfflineIntelligenceReportModelsEqual(
  left: OfflineIntelligenceReportModel,
  right: OfflineIntelligenceReportModel,
): boolean {
  return (
    serializeOfflineIntelligenceReportModel(left) ===
    serializeOfflineIntelligenceReportModel(right)
  );
}
