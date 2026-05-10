/**
 * Phase 52 — Strategy Review Export Audit Report Surface Registry v1: fixtures.
 */

import {
  buildStrategyReviewExportAuditReportSurfaceRegistry,
  buildStrategyReviewExportAuditReportSurfaceRegistryEntry,
} from './builders.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES,
  type StrategyReviewExportAuditReportSurfaceRegistry,
  type StrategyReviewExportAuditReportSurfaceRegistryEntry,
  type StrategyReviewExportAuditReportSurfaceRegistryEntryKind,
  type StrategyReviewExportAuditReportSurfaceRegistryEntryName,
} from './types.js';

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES.map(entryName =>
    buildStrategyReviewExportAuditReportSurfaceRegistryEntry({ entryName }),
  ) satisfies readonly StrategyReviewExportAuditReportSurfaceRegistryEntry[];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_MAP: ReadonlyMap<
  StrategyReviewExportAuditReportSurfaceRegistryEntryName,
  StrategyReviewExportAuditReportSurfaceRegistryEntry
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES.map(entry => [entry.entryName, entry]),
);

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY =
  buildStrategyReviewExportAuditReportSurfaceRegistry({
    entries: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES,
  }) satisfies StrategyReviewExportAuditReportSurfaceRegistry;

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES.length
) {
  throw new Error(
    `Phase 52 entry count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES.length}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.entries.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES.length
) {
  throw new Error(
    `Phase 52 registry entry count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.entries.length}`,
  );
}

export function listStrategyReviewExportAuditReportSurfaceRegistryEntries(): readonly StrategyReviewExportAuditReportSurfaceRegistryEntry[] {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES;
}

export function getStrategyReviewExportAuditReportSurfaceRegistryEntry(
  entryName: string,
): StrategyReviewExportAuditReportSurfaceRegistryEntry | null {
  return (
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_MAP.get(
      entryName as StrategyReviewExportAuditReportSurfaceRegistryEntryName,
    ) ?? null
  );
}

export {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS,
};

export type { StrategyReviewExportAuditReportSurfaceRegistryEntryName, StrategyReviewExportAuditReportSurfaceRegistryEntryKind };
