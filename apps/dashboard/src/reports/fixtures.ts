/**
 * apps/dashboard/src/reports/fixtures.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Fixtures
 */

import type { DashboardReportFixture, DashboardReportFixtureName, DashboardReportModel } from './types.js';
import {
  buildDefaultDashboardReportModel,
  buildSnapshotBackedReportFromFixture,
  buildSnapshotInventoryReportModel,
} from './builders.js';
import { normalizeDashboardReportModel } from './normalization.js';

export const FULL_DASHBOARD_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'full-dashboard-report',
  description: 'Full dashboard report model generated from the default dashboard shell snapshot.',
  report: normalizeDashboardReportModel(buildDefaultDashboardReportModel()),
};

export const HEALTH_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'health-report-section',
  description: 'Report section model generated from health panel snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('health-panel', 'health-report-section', 'section', 'Health Report Section', [
      'Health section report fixture.',
    ]),
  ),
};

export const CAPABILITIES_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'capabilities-report-section',
  description: 'Report section model generated from capabilities panel snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture(
      'capabilities-panel',
      'capabilities-report-section',
      'section',
      'Capabilities Report Section',
      ['Capabilities section report fixture.'],
    ),
  ),
};

export const OVERVIEW_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'overview-report-section',
  description: 'Report section model generated from overview panel snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('overview-panel', 'overview-report-section', 'section', 'Overview Report Section', [
      'Overview section report fixture.',
    ]),
  ),
};

export const EVIDENCE_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'evidence-report-section',
  description: 'Report section model generated from evidence panel snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('evidence-panel', 'evidence-report-section', 'section', 'Evidence Report Section', [
      'Evidence section report fixture.',
    ]),
  ),
};

export const SAFETY_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'safety-report-section',
  description: 'Report section model generated from safety panel snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('safety-panel', 'safety-report-section', 'section', 'Safety Report Section', [
      'Safety section report fixture.',
    ]),
  ),
};

export const METADATA_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'metadata-report-section',
  description: 'Report section model generated from metadata panel snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('metadata-panel', 'metadata-report-section', 'section', 'Metadata Report Section', [
      'Metadata section report fixture.',
    ]),
  ),
};

export const INTERACTION_STATE_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'interaction-state-report-section',
  description: 'Report section model generated from active-panel interaction snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture(
      'active-panel',
      'interaction-state-report-section',
      'section',
      'Interaction State Report Section',
      ['Interaction state section report fixture.'],
    ),
  ),
};

export const FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'filtered-evidence-report-section',
  description: 'Report section model generated from filtered evidence snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture(
      'filtered-evidence',
      'filtered-evidence-report-section',
      'section',
      'Filtered Evidence Report Section',
      ['Filtered evidence section report fixture.'],
    ),
  ),
};

export const FILTERED_SAFETY_REPORT_SECTION_FIXTURE: DashboardReportFixture = {
  name: 'filtered-safety-report-section',
  description: 'Report section model generated from filtered safety snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture(
      'filtered-safety',
      'filtered-safety-report-section',
      'section',
      'Filtered Safety Report Section',
      ['Filtered safety section report fixture.'],
    ),
  ),
};

export const SNAPSHOT_INVENTORY_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'snapshot-inventory-report',
  description: 'Snapshot inventory report model built from all Phase 27 snapshot fixtures.',
  report: normalizeDashboardReportModel(buildSnapshotInventoryReportModel()),
};

export const SAFETY_BOUNDARY_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'safety-boundary-report',
  description: 'Safety boundary report model generated from safety-boundary snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture(
      'safety-boundary',
      'safety-boundary-report',
      'safety-boundary',
      'Safety Boundary Report',
      ['Safety boundary report fixture.'],
    ),
  ),
};

export const ERROR_STATE_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'error-state-report',
  description: 'Error-state report model generated from error-state snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('error-state', 'error-state-report', 'error', 'Error State Report', [
      'Error state report fixture for deterministic failure-state rendering only.',
    ]),
  ),
};

export const EMPTY_STATE_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'empty-state-report',
  description: 'Empty-state report model generated from empty-state snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('empty-state', 'empty-state-report', 'empty', 'Empty State Report', [
      'Empty state report fixture.',
    ]),
  ),
};

export const LOADING_STATE_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'loading-state-report',
  description: 'Loading-state report model generated from loading-state snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('loading-state', 'loading-state-report', 'loading', 'Loading State Report', [
      'Loading state report fixture.',
    ]),
  ),
};

export const UNAVAILABLE_STATE_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'unavailable-state-report',
  description: 'Unavailable-state report model generated from unavailable-state snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture(
      'unavailable-state',
      'unavailable-state-report',
      'unavailable',
      'Unavailable State Report',
      ['Unavailable state report fixture.'],
    ),
  ),
};

export const NO_RESULTS_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'no-results-report',
  description: 'No-results report model generated from no-results-filtered snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture('no-results-filtered', 'no-results-report', 'no-results', 'No Results Report', [
      'No-results report fixture derived from deterministic filter state.',
    ]),
  ),
};

export const MALFORMED_INPUT_SAFE_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'malformed-input-safe-report',
  description: 'Malformed-input-safe report model generated from malformed-input-safe snapshot.',
  report: normalizeDashboardReportModel(
    buildSnapshotBackedReportFromFixture(
      'malformed-input-safe',
      'malformed-input-safe-report',
      'malformed',
      'Malformed Input Safe Report',
      ['Malformed input safe report fixture.'],
    ),
  ),
};

const BROKEN_VALIDATION_REPORT = {
  ...FULL_DASHBOARD_REPORT_FIXTURE.report,
  name: 'report-validation-failure-example' as const,
  kind: 'validation' as const,
  summary: {
    ...FULL_DASHBOARD_REPORT_FIXTURE.report.summary,
    reportName: 'report-validation-failure-example',
    reportKind: 'validation',
  },
  sections: [
    {
      ...FULL_DASHBOARD_REPORT_FIXTURE.report.sections[0],
      sourceSnapshotName: 'not-a-snapshot-name' as unknown as DashboardReportModel['sections'][number]['sourceSnapshotName'],
    },
  ],
  meta: {
    ...FULL_DASHBOARD_REPORT_FIXTURE.report.meta,
    sourceSnapshotNames: ['not-a-snapshot-name'] as unknown as DashboardReportModel['meta']['sourceSnapshotNames'],
  },
} as DashboardReportModel;

export const REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE: DashboardReportFixture = {
  name: 'report-validation-failure-example',
  description: 'Intentionally malformed report example used to verify validation failure behavior.',
  report: BROKEN_VALIDATION_REPORT,
};

export const EXPORT_DISABLED_SAFETY_REPORT_FIXTURE: DashboardReportFixture = {
  name: 'export-disabled-safety-report',
  description: 'Safety report explicitly confirming dashboard report file export remains disabled.',
  report: normalizeDashboardReportModel({
    ...SAFETY_BOUNDARY_REPORT_FIXTURE.report,
    name: 'export-disabled-safety-report',
    kind: 'safety',
    summary: {
      ...SAFETY_BOUNDARY_REPORT_FIXTURE.report.summary,
      reportName: 'export-disabled-safety-report',
      reportKind: 'safety',
    },
    title: 'Export Disabled Safety Report',
    safeNotes: [
      'Export is intentionally disabled in Phase 28.',
      'No filesystem write, download, persistence, or network behavior is implemented.',
    ],
  }),
};

export const PHASE_28_REPORT_FIXTURES: ReadonlyMap<DashboardReportFixtureName, DashboardReportFixture> = new Map([
  ['full-dashboard-report', FULL_DASHBOARD_REPORT_FIXTURE],
  ['health-report-section', HEALTH_REPORT_SECTION_FIXTURE],
  ['capabilities-report-section', CAPABILITIES_REPORT_SECTION_FIXTURE],
  ['overview-report-section', OVERVIEW_REPORT_SECTION_FIXTURE],
  ['evidence-report-section', EVIDENCE_REPORT_SECTION_FIXTURE],
  ['safety-report-section', SAFETY_REPORT_SECTION_FIXTURE],
  ['metadata-report-section', METADATA_REPORT_SECTION_FIXTURE],
  ['interaction-state-report-section', INTERACTION_STATE_REPORT_SECTION_FIXTURE],
  ['filtered-evidence-report-section', FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE],
  ['filtered-safety-report-section', FILTERED_SAFETY_REPORT_SECTION_FIXTURE],
  ['snapshot-inventory-report', SNAPSHOT_INVENTORY_REPORT_FIXTURE],
  ['safety-boundary-report', SAFETY_BOUNDARY_REPORT_FIXTURE],
  ['error-state-report', ERROR_STATE_REPORT_FIXTURE],
  ['empty-state-report', EMPTY_STATE_REPORT_FIXTURE],
  ['loading-state-report', LOADING_STATE_REPORT_FIXTURE],
  ['unavailable-state-report', UNAVAILABLE_STATE_REPORT_FIXTURE],
  ['no-results-report', NO_RESULTS_REPORT_FIXTURE],
  ['malformed-input-safe-report', MALFORMED_INPUT_SAFE_REPORT_FIXTURE],
  ['report-validation-failure-example', REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE],
  ['export-disabled-safety-report', EXPORT_DISABLED_SAFETY_REPORT_FIXTURE],
]);

export function listDashboardReportFixtures(): readonly DashboardReportFixtureName[] {
  return [...PHASE_28_REPORT_FIXTURES.keys()].sort();
}

export function getDashboardReportFixture(name: DashboardReportFixtureName): DashboardReportFixture | undefined {
  return PHASE_28_REPORT_FIXTURES.get(name);
}
