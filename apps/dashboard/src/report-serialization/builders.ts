/**
 * apps/dashboard/src/report-serialization/builders.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1 — Builders
 */

import { normalizeDashboardReportModel } from '../reports/normalization.js';
import type { DashboardReportModel } from '../reports/types.js';
import { stableDeterministicChecksum, stablePrettyJsonStringify } from './normalization.js';
import { DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS, DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES } from './types.js';
import type {
  DashboardReportSerializationPreview,
  DashboardReportSerializationPreviewBuildInput,
  DashboardReportSerializationPreviewBuildResult,
  DashboardReportSerializationPreviewFormat,
  DashboardReportSerializationPreviewKind,
  DashboardReportSerializationPreviewMeta,
  DashboardReportSerializationPreviewName,
  DashboardReportSerializationPreviewSafetyBoundary,
} from './types.js';

const PREVIEW_SOURCE = 'Phase 29 deterministic local serialization preview — derived from Phase 28 report models';

const PREVIEW_KIND_BY_NAME: Readonly<Record<DashboardReportSerializationPreviewName, DashboardReportSerializationPreviewKind>> = {
  'full-dashboard-json-preview': 'full',
  'full-dashboard-markdown-preview': 'full',
  'full-dashboard-text-preview': 'full',
  'metadata-only-preview': 'metadata',
  'health-section-preview': 'section',
  'capabilities-section-preview': 'section',
  'overview-section-preview': 'section',
  'evidence-section-preview': 'section',
  'safety-section-preview': 'section',
  'snapshot-inventory-preview': 'inventory',
  'safety-boundary-preview': 'safety-boundary',
  'export-disabled-preview': 'safety',
  'malformed-input-safe-preview': 'malformed',
  'validation-failure-preview': 'validation',
  'no-results-preview': 'no-results',
};

function buildPreviewMeta(report: DashboardReportModel, notes: readonly string[]): DashboardReportSerializationPreviewMeta {
  return {
    phase: 29,
    sourceReportPhase: 28,
    sourcePhases: [24, 25, 26, 27, 28, 29],
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    deterministic: true,
    generatedAt: report.meta.generatedAt,
    source: PREVIEW_SOURCE,
    sourceReportName: report.name,
    sourceReportKind: report.kind,
    sourceReportGeneratedAt: report.meta.generatedAt,
    notes: [...notes].sort(),
  };
}

function buildPreviewSafetyBoundary(report: DashboardReportModel): DashboardReportSerializationPreviewSafetyBoundary {
  return {
    ...report.safetyBoundary,
    dashboardReportSerializationPreview: true,
    dashboardReportJsonPreview: true,
    dashboardReportMarkdownPreview: true,
    dashboardReportTextPreview: true,
    dashboardReportMetadataPreview: true,
    dashboardReportActualFileExport: false,
    dashboardReportDownloadSupport: false,
  };
}

function buildMarkdownReportContent(report: DashboardReportModel): string {
  const normalized = normalizeDashboardReportModel(report);
  const lines: string[] = [
    `# ${normalized.title}`,
    '',
    `- Report Name: ${normalized.name}`,
    `- Report Kind: ${normalized.kind}`,
    `- Expected Status: ${normalized.expectedStatus}`,
    `- Section Count: ${normalized.summary.sectionCount}`,
    `- Snapshot Count: ${normalized.summary.snapshotCount}`,
    '',
    '## Sections',
  ];

  normalized.sections.forEach(section => {
    lines.push('');
    lines.push(`### ${section.title}`);
    lines.push(`- Section ID: ${section.id}`);
    lines.push(`- Section Kind: ${section.kind}`);
    lines.push(`- Source Snapshot: ${section.sourceSnapshotName}`);
    lines.push(`- Source Snapshot Kind: ${section.sourceSnapshotKind}`);
    lines.push(`- Component Type: ${section.componentType}`);
    lines.push(`- Status: ${section.status}`);
    lines.push(`- Item Count: ${section.itemCount}`);
    lines.push(`- Visible Panels: ${section.visiblePanelIds.join(', ') || '(none)'}`);
    lines.push(`- Hidden Panels: ${section.hiddenPanelIds.join(', ') || '(none)'}`);
  });

  lines.push('');
  lines.push('## Safety Boundary');
  lines.push('- Local-only fixture-backed serialization preview.');
  lines.push('- No file export, persistence, artifact output, network, wallet, or execution behavior.');

  return `${lines.join('\n')}\n`;
}

function buildTextReportContent(report: DashboardReportModel): string {
  const normalized = normalizeDashboardReportModel(report);
  const sectionSummary = normalized.sections.map(section => `${section.id}:${section.status}:${section.itemCount}`).join(' | ');

  return [
    'Serialization Preview',
    `Report=${normalized.name}`,
    `Kind=${normalized.kind}`,
    `ExpectedStatus=${normalized.expectedStatus}`,
    `Sections=${normalized.summary.sectionCount}`,
    `Snapshots=${normalized.summary.snapshotCount}`,
    `VisiblePanels=${normalized.summary.visiblePanelCount}`,
    `HiddenPanels=${normalized.summary.hiddenPanelCount}`,
    `SectionSummary=${sectionSummary}`,
    'Safety=local_only,read_only,fixture_only,deterministic,in_memory,no_export',
  ].join('\n');
}

function buildMetadataOnlyPayload(report: DashboardReportModel): Record<string, unknown> {
  const normalized = normalizeDashboardReportModel(report);
  return {
    report: {
      name: normalized.name,
      kind: normalized.kind,
      expectedStatus: normalized.expectedStatus,
      title: normalized.title,
    },
    summary: normalized.summary,
    sourceReportMeta: {
      generatedAt: normalized.meta.generatedAt,
      source: normalized.meta.source,
      sourceSnapshotNames: normalized.meta.sourceSnapshotNames,
      fixtureOnly: normalized.meta.fixtureOnly,
      liveData: normalized.meta.liveData,
      externalNetwork: normalized.meta.externalNetwork,
      deterministic: normalized.meta.deterministic,
    },
    safetyBoundary: {
      dashboardReportFileExport: normalized.safetyBoundary.dashboardReportFileExport,
      dashboardReportPersistence: normalized.safetyBoundary.dashboardReportPersistence,
      dashboardReportExternalNetwork: normalized.safetyBoundary.dashboardReportExternalNetwork,
      dashboardReportLiveData: normalized.safetyBoundary.dashboardReportLiveData,
      dashboardReportMutationControls: normalized.safetyBoundary.dashboardReportMutationControls,
      hasTradingControls: normalized.safetyBoundary.hasTradingControls,
      hasWalletControls: normalized.safetyBoundary.hasWalletControls,
      hasExecutionControls: normalized.safetyBoundary.hasExecutionControls,
      hasMutationControls: normalized.safetyBoundary.hasMutationControls,
    },
  };
}

function buildPreviewFromParts(
  input: DashboardReportSerializationPreviewBuildInput,
  format: DashboardReportSerializationPreviewFormat,
  content: string | null,
  metadataPayload: Record<string, unknown> | null,
): DashboardReportSerializationPreview {
  const safeNotes = [
    ...(input.safeNotes ?? []),
    'Local deterministic preview only.',
    'No file export, artifact output, write behavior, persistence, or network behavior is implemented.',
  ].sort();

  const checksumSource = content ?? stablePrettyJsonStringify(metadataPayload);

  return {
    name: input.name,
    kind: PREVIEW_KIND_BY_NAME[input.name],
    format,
    title: input.title ?? `Serialization Preview — ${input.report.title}`,
    sourceReportName: input.report.name,
    sourceReportKind: input.report.kind,
    sourceReportMeta: {
      generatedAt: input.report.meta.generatedAt,
      source: input.report.meta.source,
      sourceSnapshotNames: [...input.report.meta.sourceSnapshotNames].sort(),
      fixtureOnly: input.report.meta.fixtureOnly,
      liveData: input.report.meta.liveData,
      externalNetwork: input.report.meta.externalNetwork,
      deterministic: input.report.meta.deterministic,
    },
    content,
    metadataPayload,
    contentLength: content?.length ?? 0,
    checksum: stableDeterministicChecksum(checksumSource),
    meta: buildPreviewMeta(input.report, safeNotes),
    safetyBoundary: buildPreviewSafetyBoundary(input.report),
    safeNotes,
  };
}

export function buildJsonReportPreview(input: DashboardReportSerializationPreviewBuildInput): DashboardReportSerializationPreview {
  const normalizedReport = normalizeDashboardReportModel(input.report);
  return buildPreviewFromParts(input, 'json', stablePrettyJsonStringify(normalizedReport), null);
}

export function buildMarkdownReportPreview(input: DashboardReportSerializationPreviewBuildInput): DashboardReportSerializationPreview {
  return buildPreviewFromParts(input, 'markdown', buildMarkdownReportContent(input.report), null);
}

export function buildTextReportPreview(input: DashboardReportSerializationPreviewBuildInput): DashboardReportSerializationPreview {
  return buildPreviewFromParts(input, 'text', buildTextReportContent(input.report), null);
}

export function buildMetadataReportPreview(input: DashboardReportSerializationPreviewBuildInput): DashboardReportSerializationPreview {
  return buildPreviewFromParts(input, 'metadata', null, buildMetadataOnlyPayload(input.report));
}

export function buildDashboardReportSerializationPreview(
  input: DashboardReportSerializationPreviewBuildInput,
): DashboardReportSerializationPreviewBuildResult {
  const issues: string[] = [];

  if (!DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES.includes(input.name)) {
    issues.push(`Unsupported preview name: ${String(input.name)}`);
  }
  if (!DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS.includes(input.format)) {
    issues.push(`Unsupported preview format: ${String(input.format)}`);
  }
  if (!input.report || typeof input.report !== 'object') {
    issues.push('Preview source report must be a non-null object.');
  }

  if (issues.length > 0) {
    return { success: false, preview: null, issues };
  }

  try {
    switch (input.format) {
      case 'json':
        return { success: true, preview: buildJsonReportPreview(input), issues: [] };
      case 'markdown':
        return { success: true, preview: buildMarkdownReportPreview(input), issues: [] };
      case 'text':
        return { success: true, preview: buildTextReportPreview(input), issues: [] };
      case 'metadata':
        return { success: true, preview: buildMetadataReportPreview(input), issues: [] };
      default:
        return { success: false, preview: null, issues: ['Preview format is not supported.'] };
    }
  } catch {
    return {
      success: false,
      preview: null,
      issues: ['Preview build failed due to an unexpected error.'],
    };
  }
}
