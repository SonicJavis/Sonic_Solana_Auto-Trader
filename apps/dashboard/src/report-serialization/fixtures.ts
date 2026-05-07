/**
 * apps/dashboard/src/report-serialization/fixtures.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Fixtures
 */

import {
  EXPORT_DISABLED_SAFETY_REPORT_FIXTURE,
  FULL_DASHBOARD_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_REPORT_FIXTURE,
  NO_RESULTS_REPORT_FIXTURE,
  REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE,
  SAFETY_BOUNDARY_REPORT_FIXTURE,
  SNAPSHOT_INVENTORY_REPORT_FIXTURE,
  getDashboardReportFixture,
} from '../reports/index.js';
import { buildJsonReportPreview, buildMarkdownReportPreview, buildTextReportPreview, buildMetadataReportPreview } from './builders.js';
import { normalizeDashboardReportSerializationPreview } from './normalization.js';
import type { DashboardReportSerializationPreviewFixture, DashboardReportSerializationPreviewFixtureName } from './types.js';

function requireFixture(name: Parameters<typeof getDashboardReportFixture>[0]) {
  const fixture = getDashboardReportFixture(name);
  if (fixture) {
    return fixture;
  }
  return FULL_DASHBOARD_REPORT_FIXTURE;
}

export const FULL_DASHBOARD_JSON_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'full-dashboard-json-preview',
  description: 'Full dashboard report JSON serialization preview string.',
  preview: normalizeDashboardReportSerializationPreview(
    buildJsonReportPreview({
      name: 'full-dashboard-json-preview',
      format: 'json',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
      safeNotes: ['Full JSON serialization preview fixture.'],
    }),
  ),
};

export const FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'full-dashboard-markdown-preview',
  description: 'Full dashboard report Markdown serialization preview string.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMarkdownReportPreview({
      name: 'full-dashboard-markdown-preview',
      format: 'markdown',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
      safeNotes: ['Full Markdown serialization preview fixture.'],
    }),
  ),
};

export const FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'full-dashboard-text-preview',
  description: 'Full dashboard report text serialization preview string.',
  preview: normalizeDashboardReportSerializationPreview(
    buildTextReportPreview({
      name: 'full-dashboard-text-preview',
      format: 'text',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
      safeNotes: ['Full text serialization preview fixture.'],
    }),
  ),
};

export const METADATA_ONLY_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'metadata-only-preview',
  description: 'Metadata-only serialization preview object without content text.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMetadataReportPreview({
      name: 'metadata-only-preview',
      format: 'metadata',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
      safeNotes: ['Metadata-only serialization preview fixture.'],
    }),
  ),
};

export const HEALTH_SECTION_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'health-section-preview',
  description: 'Health section serialization preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMarkdownReportPreview({
      name: 'health-section-preview',
      format: 'markdown',
      report: requireFixture('health-report-section').report,
      safeNotes: ['Health section preview fixture.'],
    }),
  ),
};

export const CAPABILITIES_SECTION_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'capabilities-section-preview',
  description: 'Capabilities section serialization preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMarkdownReportPreview({
      name: 'capabilities-section-preview',
      format: 'markdown',
      report: requireFixture('capabilities-report-section').report,
      safeNotes: ['Capabilities section preview fixture.'],
    }),
  ),
};

export const OVERVIEW_SECTION_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'overview-section-preview',
  description: 'Overview section serialization preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMarkdownReportPreview({
      name: 'overview-section-preview',
      format: 'markdown',
      report: requireFixture('overview-report-section').report,
      safeNotes: ['Overview section preview fixture.'],
    }),
  ),
};

export const EVIDENCE_SECTION_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'evidence-section-preview',
  description: 'Evidence section serialization preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMarkdownReportPreview({
      name: 'evidence-section-preview',
      format: 'markdown',
      report: requireFixture('evidence-report-section').report,
      safeNotes: ['Evidence section preview fixture.'],
    }),
  ),
};

export const SAFETY_SECTION_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'safety-section-preview',
  description: 'Safety section serialization preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMarkdownReportPreview({
      name: 'safety-section-preview',
      format: 'markdown',
      report: requireFixture('safety-report-section').report,
      safeNotes: ['Safety section preview fixture.'],
    }),
  ),
};

export const SNAPSHOT_INVENTORY_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'snapshot-inventory-preview',
  description: 'Snapshot inventory serialization preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildTextReportPreview({
      name: 'snapshot-inventory-preview',
      format: 'text',
      report: SNAPSHOT_INVENTORY_REPORT_FIXTURE.report,
      safeNotes: ['Snapshot inventory preview fixture.'],
    }),
  ),
};

export const SAFETY_BOUNDARY_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'safety-boundary-preview',
  description: 'Safety boundary metadata preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildMetadataReportPreview({
      name: 'safety-boundary-preview',
      format: 'metadata',
      report: SAFETY_BOUNDARY_REPORT_FIXTURE.report,
      safeNotes: ['Safety boundary preview fixture.'],
    }),
  ),
};

export const EXPORT_DISABLED_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'export-disabled-preview',
  description: 'Export-disabled safety preview confirming no actual export behavior.',
  preview: normalizeDashboardReportSerializationPreview(
    buildTextReportPreview({
      name: 'export-disabled-preview',
      format: 'text',
      report: EXPORT_DISABLED_SAFETY_REPORT_FIXTURE.report,
      safeNotes: ['Export-disabled preview fixture.'],
    }),
  ),
};

export const MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'malformed-input-safe-preview',
  description: 'Malformed-input-safe serialization preview.',
  preview: normalizeDashboardReportSerializationPreview(
    buildJsonReportPreview({
      name: 'malformed-input-safe-preview',
      format: 'json',
      report: MALFORMED_INPUT_SAFE_REPORT_FIXTURE.report,
      safeNotes: ['Malformed-input-safe preview fixture.'],
    }),
  ),
};

export const VALIDATION_FAILURE_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'validation-failure-preview',
  description: 'Validation-failure preview fixture for deterministic negative validation cases.',
  preview: normalizeDashboardReportSerializationPreview({
    ...buildJsonReportPreview({
      name: 'validation-failure-preview',
      format: 'json',
      report: REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE.report,
      safeNotes: ['Validation-failure preview fixture.'],
    }),
    sourceReportName: 'invalid-source-report' as unknown as DashboardReportSerializationPreviewFixture['preview']['sourceReportName'],
  }),
};

export const NO_RESULTS_PREVIEW_FIXTURE: DashboardReportSerializationPreviewFixture = {
  name: 'no-results-preview',
  description: 'No-results serialization preview fixture.',
  preview: normalizeDashboardReportSerializationPreview(
    buildTextReportPreview({
      name: 'no-results-preview',
      format: 'text',
      report: NO_RESULTS_REPORT_FIXTURE.report,
      safeNotes: ['No-results preview fixture.'],
    }),
  ),
};

export const PHASE_29_SERIALIZATION_PREVIEW_FIXTURES: ReadonlyMap<
  DashboardReportSerializationPreviewFixtureName,
  DashboardReportSerializationPreviewFixture
> = new Map([
  ['full-dashboard-json-preview', FULL_DASHBOARD_JSON_PREVIEW_FIXTURE],
  ['full-dashboard-markdown-preview', FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE],
  ['full-dashboard-text-preview', FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE],
  ['metadata-only-preview', METADATA_ONLY_PREVIEW_FIXTURE],
  ['health-section-preview', HEALTH_SECTION_PREVIEW_FIXTURE],
  ['capabilities-section-preview', CAPABILITIES_SECTION_PREVIEW_FIXTURE],
  ['overview-section-preview', OVERVIEW_SECTION_PREVIEW_FIXTURE],
  ['evidence-section-preview', EVIDENCE_SECTION_PREVIEW_FIXTURE],
  ['safety-section-preview', SAFETY_SECTION_PREVIEW_FIXTURE],
  ['snapshot-inventory-preview', SNAPSHOT_INVENTORY_PREVIEW_FIXTURE],
  ['safety-boundary-preview', SAFETY_BOUNDARY_PREVIEW_FIXTURE],
  ['export-disabled-preview', EXPORT_DISABLED_PREVIEW_FIXTURE],
  ['malformed-input-safe-preview', MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE],
  ['validation-failure-preview', VALIDATION_FAILURE_PREVIEW_FIXTURE],
  ['no-results-preview', NO_RESULTS_PREVIEW_FIXTURE],
]);

export function listDashboardReportSerializationPreviewFixtures(): readonly DashboardReportSerializationPreviewFixtureName[] {
  return [...PHASE_29_SERIALIZATION_PREVIEW_FIXTURES.keys()].sort();
}

export function getDashboardReportSerializationPreviewFixture(
  name: DashboardReportSerializationPreviewFixtureName,
): DashboardReportSerializationPreviewFixture | undefined {
  return PHASE_29_SERIALIZATION_PREVIEW_FIXTURES.get(name);
}
