/**
 * apps/dashboard/src/reports/builders.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Builders
 */

import type {
  DashboardReportBuildInput,
  DashboardReportBuildResult,
  DashboardReportKind,
  DashboardReportModel,
  DashboardReportName,
  DashboardReportSafetyBoundary,
  DashboardReportSection,
  DashboardReportSectionKind,
} from './types.js';
import { DASHBOARD_REPORT_KINDS, DASHBOARD_REPORT_NAMES } from './types.js';
import type { DashboardRenderSnapshot, DashboardRenderSnapshotFixture } from '../snapshots/types.js';
import {
  buildDefaultDashboardRenderSnapshot,
  DEFAULT_DASHBOARD_SHELL_FIXTURE,
  PHASE_27_REGRESSION_FIXTURES,
  getDashboardRenderSnapshotFixture,
  listDashboardRenderSnapshotFixtures,
} from '../snapshots/index.js';
import { buildFixtureDashboardViewModel } from '../view-model-source.js';
import { createDefaultDashboardInteractionState } from '../state/default-state.js';
import { PHASE_25_SAFETY_BOUNDARY } from '../components/SafetyBanner.js';
import { getDashboardReportCapabilities } from './capabilities.js';

const REPORT_SOURCE = 'Phase 28 deterministic local report model — derived from Phase 27 snapshots and Phase 24/25/26 metadata';

type SnapshotLike = DashboardReportBuildInput['primarySnapshot'];
type SourceViewModelMeta = DashboardReportBuildInput['sourceViewModelMeta'];

function inferSectionKind(snapshotName: DashboardRenderSnapshot['name']): DashboardReportSectionKind {
  switch (snapshotName) {
    case 'health-panel':
      return 'health';
    case 'capabilities-panel':
      return 'capabilities';
    case 'overview-panel':
      return 'overview';
    case 'evidence-panel':
      return 'evidence';
    case 'safety-panel':
      return 'safety';
    case 'metadata-panel':
      return 'metadata';
    case 'filtered-evidence':
      return 'filtered-evidence';
    case 'filtered-safety':
      return 'filtered-safety';
    case 'safety-boundary':
      return 'safety-boundary';
    case 'default-dashboard-shell':
    case 'active-panel':
    case 'hidden-panel':
    case 'reset-interaction-state':
    case 'no-results-filtered':
      return 'interaction';
    default:
      return 'status';
  }
}

function inferStatus(snapshotName: DashboardRenderSnapshot['name']): DashboardReportSection['status'] {
  switch (snapshotName) {
    case 'empty-state':
    case 'no-results-filtered':
      return 'empty';
    case 'loading-state':
      return 'loading';
    case 'error-state':
      return 'error';
    case 'unavailable-state':
      return 'unavailable';
    default:
      return 'ready';
  }
}

function countItems(snapshot: SnapshotLike): number {
  const renderResult = snapshot.renderResult;
  if ('sections' in renderResult && Array.isArray(renderResult.sections)) {
    return renderResult.sections.reduce((total, section) => {
      const base = total + section.items.length;
      const nested = section.subSections?.reduce((subTotal, sub) => subTotal + sub.items.length, 0) ?? 0;
      return base + nested;
    }, 0);
  }
  if ('notices' in renderResult && Array.isArray(renderResult.notices)) {
    return renderResult.notices.length;
  }
  return 0;
}

function buildReportMeta(
  snapshots: readonly SnapshotLike[],
  sourceViewModelMeta: SourceViewModelMeta,
  safeNotes: readonly string[],
): DashboardReportModel['meta'] {
  return {
    phase: 28,
    sourceSnapshotPhase: 27,
    sourcePhases: [24, 25, 26, 27, 28],
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    deterministic: true,
    generatedAt: sourceViewModelMeta.generatedAt,
    source: REPORT_SOURCE,
    sourceSnapshotNames: snapshots.map(snapshot => snapshot.name).sort(),
    sourceViewModelMeta,
    notes: [...safeNotes].sort(),
  };
}

export function buildDashboardSafetyBoundaryReport(): DashboardReportSafetyBoundary {
  const reportCapabilities = getDashboardReportCapabilities();
  return {
    ...PHASE_25_SAFETY_BOUNDARY,
    ...reportCapabilities,
  };
}

export function buildDashboardReportSection(
  snapshot: SnapshotLike,
  kind: DashboardReportSectionKind = inferSectionKind(snapshot.name),
  notes: readonly string[] = [],
): DashboardReportSection {
  return {
    id: `section:${snapshot.name}`,
    title: `Report Section — ${snapshot.name}`,
    kind,
    componentType: snapshot.expectedComponentType,
    sourceSnapshotName: snapshot.name,
    sourceSnapshotKind: snapshot.kind,
    status: inferStatus(snapshot.name),
    itemCount: countItems(snapshot),
    visiblePanelIds: [...snapshot.expectedVisiblePanelIds].sort(),
    hiddenPanelIds: [...snapshot.expectedHiddenPanelIds].sort(),
    notes: [...notes].sort(),
  };
}

function buildDashboardReportModelInternal(input: DashboardReportBuildInput): DashboardReportModel {
  const snapshots = [input.primarySnapshot, ...(input.sourceSnapshots ?? [])];
  const sections = snapshots
    .map(snapshot =>
      buildDashboardReportSection(snapshot, inferSectionKind(snapshot.name), [`Derived from snapshot ${snapshot.name}.`]),
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const expectedComponentTypes = Array.from(new Set(snapshots.map(snapshot => snapshot.expectedComponentType))).sort();
  const visiblePanelIds = Array.from(new Set(snapshots.flatMap(snapshot => snapshot.expectedVisiblePanelIds))).sort();
  const hiddenPanelIds = Array.from(new Set(snapshots.flatMap(snapshot => snapshot.expectedHiddenPanelIds))).sort();

  const summary: DashboardReportModel['summary'] = {
    reportName: input.name,
    reportKind: input.kind,
    sectionCount: sections.length,
    snapshotCount: snapshots.length,
    visiblePanelCount: visiblePanelIds.length,
    hiddenPanelCount: hiddenPanelIds.length,
    isErrorState: snapshots.some(snapshot => snapshot.isErrorState),
    isEmptyState: snapshots.some(snapshot => snapshot.isEmptyState),
    isFilteredState: snapshots.some(snapshot => snapshot.isFilteredState),
    expectedComponentTypes,
  };

  return {
    name: input.name,
    kind: input.kind,
    title: input.title,
    sections,
    summary,
    meta: buildReportMeta(snapshots, input.sourceViewModelMeta, input.safeNotes),
    safetyBoundary: buildDashboardSafetyBoundaryReport(),
    expectedStatus: sections[0]?.status ?? 'ready',
    safeNotes: [...input.safeNotes].sort(),
  };
}

export function buildDashboardReportModel(input: DashboardReportBuildInput): DashboardReportBuildResult {
  const issues: string[] = [];

  if (!DASHBOARD_REPORT_NAMES.includes(input.name)) {
    issues.push(`Unsupported report name: ${String(input.name)}`);
  }
  if (!DASHBOARD_REPORT_KINDS.includes(input.kind)) {
    issues.push(`Unsupported report kind: ${String(input.kind)}`);
  }
  if (!input.title || typeof input.title !== 'string') {
    issues.push('Report title must be a non-empty string.');
  }
  if (!Array.isArray(input.safeNotes) || input.safeNotes.some(note => typeof note !== 'string')) {
    issues.push('Report safeNotes must be an array of strings.');
  }

  if (issues.length > 0) {
    return { success: false, report: null, issues };
  }

  try {
    return {
      success: true,
      report: buildDashboardReportModelInternal(input),
      issues: [],
    };
  } catch {
    return {
      success: false,
      report: null,
      issues: ['Report model build failed due to an unexpected error.'],
    };
  }
}

function buildDefaultReportInput(name: DashboardReportName, kind: DashboardReportKind): DashboardReportBuildInput {
  const viewModel = buildFixtureDashboardViewModel();
  const defaultSnapshot = buildDefaultDashboardRenderSnapshot(viewModel);

  return {
    name,
    kind,
    primarySnapshot: defaultSnapshot,
    sourceSnapshots: [],
    interactionState: createDefaultDashboardInteractionState(),
    sourceViewModelMeta: {
      phase: viewModel.health.meta.phase,
      apiMode: viewModel.health.meta.apiMode,
      fixtureOnly: viewModel.health.meta.fixtureOnly,
      liveData: viewModel.health.meta.liveData,
      readOnly: viewModel.health.meta.readOnly,
      localOnly: viewModel.health.meta.localOnly,
      generatedAt: viewModel.health.meta.generatedAt,
    },
    title: 'Local Dashboard Report Export Model',
    safeNotes: [
      'Local-only report model derived from deterministic fixtures.',
      'No file writes. No exports. No persistence. No network calls.',
    ],
  };
}

export function buildDefaultDashboardReportModel(): DashboardReportModel {
  const result = buildDashboardReportModel(buildDefaultReportInput('full-dashboard-report', 'full'));
  if (result.success && result.report !== null) {
    return result.report;
  }
  return buildDashboardReportModelInternal(buildDefaultReportInput('full-dashboard-report', 'full'));
}

export function buildSnapshotInventoryReportModel(): DashboardReportModel {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshotNames = listDashboardRenderSnapshotFixtures();
  const snapshots = snapshotNames
    .map(name => getDashboardRenderSnapshotFixture(name))
    .filter((fixture): fixture is DashboardRenderSnapshotFixture => fixture !== undefined)
    .map(fixture => fixture.snapshot);

  const report = buildDashboardReportModelInternal({
    name: 'snapshot-inventory-report',
    kind: 'inventory',
    primarySnapshot: snapshots[0] ?? DEFAULT_DASHBOARD_SHELL_FIXTURE.snapshot,
    sourceSnapshots: snapshots.slice(1),
    interactionState: createDefaultDashboardInteractionState(),
    sourceViewModelMeta: {
      phase: viewModel.health.meta.phase,
      apiMode: viewModel.health.meta.apiMode,
      fixtureOnly: viewModel.health.meta.fixtureOnly,
      liveData: viewModel.health.meta.liveData,
      readOnly: viewModel.health.meta.readOnly,
      localOnly: viewModel.health.meta.localOnly,
      generatedAt: viewModel.health.meta.generatedAt,
    },
    title: 'Dashboard Snapshot Inventory Report Model',
    safeNotes: [
      'Inventory report lists deterministic snapshot sources only.',
      'No export/download/write behavior is implemented in Phase 28.',
    ],
  });

  return {
    ...report,
    sections: report.sections.map(section => ({
      ...section,
      kind: section.kind === 'status' ? 'snapshot-inventory' : section.kind,
    })),
  };
}

export function buildSnapshotBackedReportFromFixture(
  fixtureName: DashboardRenderSnapshot['name'],
  reportName: DashboardReportName,
  reportKind: DashboardReportKind,
  title: string,
  safeNotes: readonly string[],
): DashboardReportModel {
  const viewModel = buildFixtureDashboardViewModel();
  const fixture = PHASE_27_REGRESSION_FIXTURES.get(fixtureName);
  const primarySnapshot = fixture?.snapshot ?? DEFAULT_DASHBOARD_SHELL_FIXTURE.snapshot;

  const result = buildDashboardReportModel({
    name: reportName,
    kind: reportKind,
    primarySnapshot,
    sourceViewModelMeta: {
      phase: viewModel.health.meta.phase,
      apiMode: viewModel.health.meta.apiMode,
      fixtureOnly: viewModel.health.meta.fixtureOnly,
      liveData: viewModel.health.meta.liveData,
      readOnly: viewModel.health.meta.readOnly,
      localOnly: viewModel.health.meta.localOnly,
      generatedAt: viewModel.health.meta.generatedAt,
    },
    title,
    safeNotes,
  });

  if (result.success && result.report !== null) {
    return result.report;
  }

  return buildDashboardReportModelInternal({
    ...buildDefaultReportInput(reportName, reportKind),
    primarySnapshot,
    title,
    safeNotes,
  });
}
