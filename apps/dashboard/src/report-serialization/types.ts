/**
 * apps/dashboard/src/report-serialization/types.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Types
 */

import type { DashboardReportKind, DashboardReportModel, DashboardReportName, DashboardReportSafetyBoundary } from '../reports/types.js';

export type DashboardReportSerializationPreviewFormat = 'json' | 'markdown' | 'text' | 'metadata';

export const DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS: readonly DashboardReportSerializationPreviewFormat[] = [
  'json',
  'markdown',
  'text',
  'metadata',
] as const;

export type DashboardReportSerializationPreviewName =
  | 'full-dashboard-json-preview'
  | 'full-dashboard-markdown-preview'
  | 'full-dashboard-text-preview'
  | 'metadata-only-preview'
  | 'health-section-preview'
  | 'capabilities-section-preview'
  | 'overview-section-preview'
  | 'evidence-section-preview'
  | 'safety-section-preview'
  | 'snapshot-inventory-preview'
  | 'safety-boundary-preview'
  | 'export-disabled-preview'
  | 'malformed-input-safe-preview'
  | 'validation-failure-preview'
  | 'no-results-preview';

export const DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES: readonly DashboardReportSerializationPreviewName[] = [
  'full-dashboard-json-preview',
  'full-dashboard-markdown-preview',
  'full-dashboard-text-preview',
  'metadata-only-preview',
  'health-section-preview',
  'capabilities-section-preview',
  'overview-section-preview',
  'evidence-section-preview',
  'safety-section-preview',
  'snapshot-inventory-preview',
  'safety-boundary-preview',
  'export-disabled-preview',
  'malformed-input-safe-preview',
  'validation-failure-preview',
  'no-results-preview',
] as const;

export type DashboardReportSerializationPreviewKind =
  | 'full'
  | 'section'
  | 'metadata'
  | 'inventory'
  | 'safety-boundary'
  | 'safety'
  | 'malformed'
  | 'validation'
  | 'no-results';

export const DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS: readonly DashboardReportSerializationPreviewKind[] = [
  'full',
  'section',
  'metadata',
  'inventory',
  'safety-boundary',
  'safety',
  'malformed',
  'validation',
  'no-results',
] as const;

export interface DashboardReportSerializationPreviewMeta {
  readonly phase: 29;
  readonly sourceReportPhase: 28;
  readonly sourcePhases: readonly [24, 25, 26, 27, 28, 29];
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly deterministic: true;
  readonly generatedAt: string;
  readonly source: string;
  readonly sourceReportName: DashboardReportName;
  readonly sourceReportKind: DashboardReportKind;
  readonly sourceReportGeneratedAt: string;
  readonly notes: readonly string[];
}

export interface DashboardReportSerializationPreviewSafetyBoundary extends DashboardReportSafetyBoundary {
  readonly dashboardReportSerializationPreview: true;
  readonly dashboardReportJsonPreview: true;
  readonly dashboardReportMarkdownPreview: true;
  readonly dashboardReportTextPreview: true;
  readonly dashboardReportMetadataPreview: true;
  readonly dashboardReportActualFileExport: false;
  readonly dashboardReportDownloadSupport: false;
}

export interface DashboardReportSerializationPreview {
  readonly name: DashboardReportSerializationPreviewName;
  readonly kind: DashboardReportSerializationPreviewKind;
  readonly format: DashboardReportSerializationPreviewFormat;
  readonly title: string;
  readonly sourceReportName: DashboardReportName;
  readonly sourceReportKind: DashboardReportKind;
  readonly sourceReportMeta: Pick<
    DashboardReportModel['meta'],
    'generatedAt' | 'source' | 'sourceSnapshotNames' | 'fixtureOnly' | 'liveData' | 'externalNetwork' | 'deterministic'
  >;
  readonly content: string | null;
  readonly metadataPayload: Record<string, unknown> | null;
  readonly contentLength: number;
  readonly checksum: string;
  readonly meta: DashboardReportSerializationPreviewMeta;
  readonly safetyBoundary: DashboardReportSerializationPreviewSafetyBoundary;
  readonly safeNotes: readonly string[];
}

export interface DashboardReportSerializationPreviewBuildInput {
  readonly name: DashboardReportSerializationPreviewName;
  readonly format: DashboardReportSerializationPreviewFormat;
  readonly report: DashboardReportModel;
  readonly title?: string;
  readonly safeNotes?: readonly string[];
}

export interface DashboardReportSerializationPreviewBuildResult {
  readonly success: boolean;
  readonly preview: DashboardReportSerializationPreview | null;
  readonly issues: readonly string[];
}

export interface DashboardReportSerializationPreviewValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly field: string;
}

export interface DashboardReportSerializationPreviewValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DashboardReportSerializationPreviewValidationIssue[];
}

export interface DashboardReportSerializationPreviewSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface DashboardReportSerializationPreviewFixture {
  readonly name: DashboardReportSerializationPreviewFixtureName;
  readonly description: string;
  readonly preview: DashboardReportSerializationPreview;
}

export type DashboardReportSerializationPreviewFixtureName = DashboardReportSerializationPreviewName;

export interface DashboardReportSerializationPreviewCapabilities {
  readonly dashboardReportSerializationPreview: true;
  readonly dashboardReportJsonPreview: true;
  readonly dashboardReportMarkdownPreview: true;
  readonly dashboardReportTextPreview: true;
  readonly dashboardReportMetadataPreview: true;
  readonly dashboardReportActualFileExport: false;
  readonly dashboardReportDownloadSupport: false;
  readonly dashboardReportPersistence: false;
  readonly dashboardReportExternalNetwork: false;
  readonly dashboardReportLiveData: false;
  readonly dashboardReportMutationControls: false;
}
