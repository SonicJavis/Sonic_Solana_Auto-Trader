/**
 * apps/dashboard/src/reports/types.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Types
 */

import type { DashboardSafetyBoundary } from '../types.js';
import type { DashboardInteractionState, DashboardPanelId } from '../state/types.js';
import type { DashboardRenderSnapshotKind, DashboardRenderSnapshotName } from '../snapshots/types.js';
import type { DashboardViewModelMeta } from '@sonic/dashboard-view-models';

export type DashboardReportName =
  | 'full-dashboard-report'
  | 'health-report-section'
  | 'capabilities-report-section'
  | 'overview-report-section'
  | 'evidence-report-section'
  | 'safety-report-section'
  | 'metadata-report-section'
  | 'interaction-state-report-section'
  | 'filtered-evidence-report-section'
  | 'filtered-safety-report-section'
  | 'snapshot-inventory-report'
  | 'safety-boundary-report'
  | 'error-state-report'
  | 'empty-state-report'
  | 'loading-state-report'
  | 'unavailable-state-report'
  | 'no-results-report'
  | 'malformed-input-safe-report'
  | 'report-validation-failure-example'
  | 'export-disabled-safety-report';

export const DASHBOARD_REPORT_NAMES: readonly DashboardReportName[] = [
  'full-dashboard-report',
  'health-report-section',
  'capabilities-report-section',
  'overview-report-section',
  'evidence-report-section',
  'safety-report-section',
  'metadata-report-section',
  'interaction-state-report-section',
  'filtered-evidence-report-section',
  'filtered-safety-report-section',
  'snapshot-inventory-report',
  'safety-boundary-report',
  'error-state-report',
  'empty-state-report',
  'loading-state-report',
  'unavailable-state-report',
  'no-results-report',
  'malformed-input-safe-report',
  'report-validation-failure-example',
  'export-disabled-safety-report',
] as const;

export type DashboardReportKind =
  | 'full'
  | 'section'
  | 'inventory'
  | 'safety-boundary'
  | 'error'
  | 'empty'
  | 'loading'
  | 'unavailable'
  | 'no-results'
  | 'malformed'
  | 'validation'
  | 'safety';

export const DASHBOARD_REPORT_KINDS: readonly DashboardReportKind[] = [
  'full',
  'section',
  'inventory',
  'safety-boundary',
  'error',
  'empty',
  'loading',
  'unavailable',
  'no-results',
  'malformed',
  'validation',
  'safety',
] as const;

export type DashboardReportSectionKind =
  | 'health'
  | 'capabilities'
  | 'overview'
  | 'evidence'
  | 'safety'
  | 'metadata'
  | 'interaction'
  | 'filtered-evidence'
  | 'filtered-safety'
  | 'snapshot-inventory'
  | 'safety-boundary'
  | 'status';

export const DASHBOARD_REPORT_SECTION_KINDS: readonly DashboardReportSectionKind[] = [
  'health',
  'capabilities',
  'overview',
  'evidence',
  'safety',
  'metadata',
  'interaction',
  'filtered-evidence',
  'filtered-safety',
  'snapshot-inventory',
  'safety-boundary',
  'status',
] as const;

export interface DashboardReportSection {
  readonly id: string;
  readonly title: string;
  readonly kind: DashboardReportSectionKind;
  readonly componentType: string;
  readonly sourceSnapshotName: DashboardRenderSnapshotName;
  readonly sourceSnapshotKind: DashboardRenderSnapshotKind;
  readonly status: 'ready' | 'empty' | 'loading' | 'error' | 'unavailable';
  readonly itemCount: number;
  readonly visiblePanelIds: readonly DashboardPanelId[];
  readonly hiddenPanelIds: readonly DashboardPanelId[];
  readonly notes: readonly string[];
}

export interface DashboardReportMeta {
  readonly phase: 28;
  readonly sourceSnapshotPhase: 27;
  readonly sourcePhases: readonly [24, 25, 26, 27, 28];
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly deterministic: true;
  readonly generatedAt: string;
  readonly source: string;
  readonly sourceSnapshotNames: readonly DashboardRenderSnapshotName[];
  readonly sourceViewModelMeta: Pick<
    DashboardViewModelMeta,
    'phase' | 'apiMode' | 'fixtureOnly' | 'liveData' | 'readOnly' | 'localOnly' | 'generatedAt'
  >;
  readonly notes: readonly string[];
}

export interface DashboardReportSummary {
  readonly reportName: DashboardReportName;
  readonly reportKind: DashboardReportKind;
  readonly sectionCount: number;
  readonly snapshotCount: number;
  readonly visiblePanelCount: number;
  readonly hiddenPanelCount: number;
  readonly isErrorState: boolean;
  readonly isEmptyState: boolean;
  readonly isFilteredState: boolean;
  readonly expectedComponentTypes: readonly string[];
}

export interface DashboardReportSafetyBoundary extends DashboardSafetyBoundary {
  readonly dashboardReportModels: true;
  readonly dashboardReportFixtures: true;
  readonly deterministicReportModels: true;
  readonly reportSafetyValidation: true;
  readonly fixtureBackedReports: true;
  readonly dashboardReportFileExport: false;
  readonly dashboardReportPersistence: false;
  readonly dashboardReportExternalNetwork: false;
  readonly dashboardReportLiveData: false;
  readonly dashboardReportMutationControls: false;
}

export interface DashboardReportModel {
  readonly name: DashboardReportName;
  readonly kind: DashboardReportKind;
  readonly title: string;
  readonly sections: readonly DashboardReportSection[];
  readonly summary: DashboardReportSummary;
  readonly meta: DashboardReportMeta;
  readonly safetyBoundary: DashboardReportSafetyBoundary;
  readonly expectedStatus: 'ready' | 'empty' | 'loading' | 'error' | 'unavailable';
  readonly safeNotes: readonly string[];
}

export interface DashboardReportValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly field: string;
}

export interface DashboardReportValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DashboardReportValidationIssue[];
}

export interface DashboardReportSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface DashboardReportBuildInput {
  readonly name: DashboardReportName;
  readonly kind: DashboardReportKind;
  readonly primarySnapshot: {
    readonly name: DashboardRenderSnapshotName;
    readonly kind: DashboardRenderSnapshotKind;
    readonly renderResult: { readonly componentType: string };
    readonly expectedVisiblePanelIds: readonly DashboardPanelId[];
    readonly expectedHiddenPanelIds: readonly DashboardPanelId[];
    readonly expectedComponentType: string;
    readonly isErrorState: boolean;
    readonly isEmptyState: boolean;
    readonly isFilteredState: boolean;
  };
  readonly sourceSnapshots?: readonly {
    readonly name: DashboardRenderSnapshotName;
    readonly kind: DashboardRenderSnapshotKind;
    readonly renderResult: { readonly componentType: string };
    readonly expectedVisiblePanelIds: readonly DashboardPanelId[];
    readonly expectedHiddenPanelIds: readonly DashboardPanelId[];
    readonly expectedComponentType: string;
    readonly isErrorState: boolean;
    readonly isEmptyState: boolean;
    readonly isFilteredState: boolean;
  }[];
  readonly interactionState?: DashboardInteractionState | undefined;
  readonly sourceViewModelMeta: Pick<
    DashboardViewModelMeta,
    'phase' | 'apiMode' | 'fixtureOnly' | 'liveData' | 'readOnly' | 'localOnly' | 'generatedAt'
  >;
  readonly title: string;
  readonly safeNotes: readonly string[];
}

export interface DashboardReportBuildResult {
  readonly success: boolean;
  readonly report: DashboardReportModel | null;
  readonly issues: readonly string[];
}

export interface DashboardReportFixture {
  readonly name: DashboardReportFixtureName;
  readonly description: string;
  readonly report: DashboardReportModel;
}

export type DashboardReportFixtureName = DashboardReportName;

export interface DashboardReportCapabilities {
  readonly dashboardReportModels: true;
  readonly dashboardReportFixtures: true;
  readonly deterministicReportModels: true;
  readonly reportSafetyValidation: true;
  readonly fixtureBackedReports: true;
  readonly dashboardReportFileExport: false;
  readonly dashboardReportPersistence: false;
  readonly dashboardReportExternalNetwork: false;
  readonly dashboardReportLiveData: false;
  readonly dashboardReportMutationControls: false;
}
