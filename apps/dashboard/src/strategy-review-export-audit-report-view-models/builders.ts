/**
 * Phase 47 — Strategy Review Export Audit Report View Models v1: builders.
 */

import { getStrategyReviewExportAuditReportViewModelCapabilities } from './capabilities.js';
import {
  normalizeStrategyReviewExportAuditReportViewModel,
  stableDeterministicChecksum,
} from './normalization.js';
import {
  PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT,
  PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE,
  type StrategyReviewExportAuditReportDetailSectionViewModel,
  type StrategyReviewExportAuditReportDetailViewModel,
  type StrategyReviewExportAuditReportListItemViewModel,
  type StrategyReviewExportAuditReportSummaryCardViewModel,
  type StrategyReviewExportAuditReportSummaryViewModel,
  type StrategyReviewExportAuditReportViewModel,
  type StrategyReviewExportAuditReportViewModelBuildInput,
  type StrategyReviewExportAuditReportViewModelKind,
  type StrategyReviewExportAuditReportViewModelName,
} from './types.js';

function deterministicViewModelId(seed: string): string {
  return `strategy-review-export-audit-report-view-model-${stableDeterministicChecksum(seed).replace(':', '-')}`;
}

function buildSummaryCards(
  sourceReportFixture: StrategyReviewExportAuditReportViewModelBuildInput['sourceReportFixture'],
): readonly StrategyReviewExportAuditReportSummaryCardViewModel[] {
  return [
    {
      cardId: `${sourceReportFixture.reportId}-card-findings`,
      cardKind: 'findings',
      title: 'Findings',
      value: String(sourceReportFixture.findingsOverview.totalFindings),
      description: 'Total synthetic findings linked from source audit fixture.',
      order: 1,
      safetyNotes: ['Synthetic fixture-derived count only.'],
    },
    {
      cardId: `${sourceReportFixture.reportId}-card-severity`,
      cardKind: 'severity',
      title: 'Severity',
      value: sourceReportFixture.reportSeverity,
      description: 'Deterministic source report severity label.',
      order: 2,
      safetyNotes: ['No recommendation or trading signal output.'],
    },
    {
      cardId: `${sourceReportFixture.reportId}-card-state`,
      cardKind: 'state',
      title: 'Status',
      value: sourceReportFixture.reportState,
      description: 'Deterministic source report state label.',
      order: 3,
      safetyNotes: ['Read-only, non-operational status projection.'],
    },
    {
      cardId: `${sourceReportFixture.reportId}-card-evidence`,
      cardKind: 'evidence',
      title: 'Evidence References',
      value: String(sourceReportFixture.evidenceReferences.length),
      description: 'Total synthetic evidence references from source report fixture.',
      order: 4,
      safetyNotes: ['No live evidence retrieval.'],
    },
    {
      cardId: `${sourceReportFixture.reportId}-card-validation`,
      cardKind: 'validation',
      title: 'Validation',
      value: sourceReportFixture.validationReview.status,
      description: 'Deterministic source validation review status.',
      order: 5,
      safetyNotes: ['Fixture-shape validation status only.'],
    },
  ];
}

function buildDetailSections(
  sourceReportFixture: StrategyReviewExportAuditReportViewModelBuildInput['sourceReportFixture'],
): readonly StrategyReviewExportAuditReportDetailSectionViewModel[] {
  return sourceReportFixture.sections.map(section => ({
    sectionId: section.sectionId,
    sectionTitle: section.sectionTitle,
    sectionKind: section.sectionKind,
    order: section.order,
    summary: section.summary,
    rows: section.items.map((item, index) => ({
      rowId: `${section.sectionId}-row-${String(index + 1).padStart(2, '0')}`,
      label: `Item ${index + 1}`,
      value: item,
      order: index + 1,
    })),
    evidenceReferenceIds: [...section.evidenceReferenceIds],
    safetyNotes: [...section.safetyNotes],
  }));
}

export function buildStrategyReviewExportAuditReportListItemViewModel(
  sourceReportFixture: StrategyReviewExportAuditReportViewModelBuildInput['sourceReportFixture'],
): StrategyReviewExportAuditReportListItemViewModel {
  const deterministicSeed =
    `phase47:${sourceReportFixture.reportName}:${sourceReportFixture.reportKind}:${sourceReportFixture.reportId}`;
  const viewModelId = deterministicViewModelId(deterministicSeed);

  return {
    viewModelId,
    viewModelName: `${sourceReportFixture.reportName}-view-model` as StrategyReviewExportAuditReportViewModelName,
    viewModelKind: `${sourceReportFixture.reportKind}-view-model` as StrategyReviewExportAuditReportViewModelKind,
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE,
    sourceReportId: sourceReportFixture.reportId,
    sourceReportName: sourceReportFixture.reportName,
    sourceReportKind: sourceReportFixture.reportKind,
    sourceAuditId: sourceReportFixture.sourceAuditId,
    sourceAuditName: sourceReportFixture.sourceAuditName,
    sourceQueueReference: sourceReportFixture.sourceQueueReference.sourceQueueFixtureName,
    displayTitle: `${sourceReportFixture.title} — View Model`,
    displaySubtitle:
      'Deterministic synthetic strategy review export audit report view model derived from Phase 46 fixtures.',
    statusLabel: sourceReportFixture.reportState,
    severityLabel: sourceReportFixture.reportSeverity,
  };
}

export function buildStrategyReviewExportAuditReportSummaryViewModel(
  sourceReportFixture: StrategyReviewExportAuditReportViewModelBuildInput['sourceReportFixture'],
): StrategyReviewExportAuditReportSummaryViewModel {
  const listItem = buildStrategyReviewExportAuditReportListItemViewModel(sourceReportFixture);

  return {
    viewModelId: listItem.viewModelId,
    summaryCards: buildSummaryCards(sourceReportFixture),
    safetyBadges: [
      {
        badgeId: `${listItem.viewModelId}-safety-read-only`,
        label: 'Read only',
        value: 'enabled',
        safe: true,
        order: 1,
      },
      {
        badgeId: `${listItem.viewModelId}-safety-local-only`,
        label: 'Local only',
        value: 'enabled',
        safe: true,
        order: 2,
      },
      {
        badgeId: `${listItem.viewModelId}-safety-no-network`,
        label: 'Network access',
        value: 'disabled',
        safe: true,
        order: 3,
      },
      {
        badgeId: `${listItem.viewModelId}-safety-no-execution`,
        label: 'Execution',
        value: 'disabled',
        safe: true,
        order: 4,
      },
    ],
    validationBadges: sourceReportFixture.validationReview.notes.map((note, index) => ({
      badgeId: `${listItem.viewModelId}-validation-${String(index + 1).padStart(2, '0')}`,
      label: note.noteKind,
      status: note.status,
      order: index + 1,
    })),
  };
}

export function buildStrategyReviewExportAuditReportDetailViewModel(
  sourceReportFixture: StrategyReviewExportAuditReportViewModelBuildInput['sourceReportFixture'],
): StrategyReviewExportAuditReportDetailViewModel {
  const listItem = buildStrategyReviewExportAuditReportListItemViewModel(sourceReportFixture);

  return {
    viewModelId: listItem.viewModelId,
    detailSections: buildDetailSections(sourceReportFixture),
    evidenceItems: sourceReportFixture.evidenceReferences.map((evidence, index) => ({
      evidenceId: evidence.evidenceReferenceId,
      label: `Evidence ${index + 1}`,
      sourceReportId: sourceReportFixture.reportId,
      sourceSectionId:
        sourceReportFixture.sections.find(section =>
          section.evidenceReferenceIds.includes(evidence.evidenceReferenceId),
        )?.sectionId ?? 'unmapped',
      description: evidence.summary,
      order: index + 1,
      syntheticOnly: true,
      liveData: false,
    })),
    limitationItems: [...sourceReportFixture.limitations],
    nextPhaseNotes: [...sourceReportFixture.nextPhaseNotes],
  };
}

export function buildStrategyReviewExportAuditReportViewModel(
  input: StrategyReviewExportAuditReportViewModelBuildInput,
): StrategyReviewExportAuditReportViewModel {
  const listItem = buildStrategyReviewExportAuditReportListItemViewModel(input.sourceReportFixture);
  const detail = buildStrategyReviewExportAuditReportDetailViewModel(input.sourceReportFixture);
  const summary = buildStrategyReviewExportAuditReportSummaryViewModel(input.sourceReportFixture);

  return normalizeStrategyReviewExportAuditReportViewModel({
    ...listItem,
    summaryCards: summary.summaryCards,
    detailSections: detail.detailSections,
    evidenceItems: detail.evidenceItems,
    safetyBadges: summary.safetyBadges,
    validationBadges: summary.validationBadges,
    limitationItems: detail.limitationItems,
    nextPhaseNotes: detail.nextPhaseNotes,
    capabilityFlags: getStrategyReviewExportAuditReportViewModelCapabilities(),
    listItem,
    detail,
    summary,
    meta: {
      phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE,
      sourceReportPhase: 46,
      sourceAuditPhase: 45,
      sourceQueuePhase: 44,
      sourcePhases: [44, 45, 46, 47],
      generatedAt: PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT,
      source: PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      localOnly: true,
      readOnly: true,
      inMemoryOnly: true,
      liveData: false,
      networkAccess: false,
      persistence: false,
      filesystemWrites: false,
      uiRendering: false,
      domAccess: false,
      execution: false,
      tradingSignals: false,
      recommendations: false,
      investmentAdvice: false,
    },
    safety: {
      fixtureOnly: true,
      syntheticOnly: true,
      deterministic: true,
      localOnly: true,
      readOnly: true,
      nonExecutable: true,
      nonAdvisory: true,
      noLiveData: true,
      noNetworkAccess: true,
      noPersistence: true,
      noFilesystemWrites: true,
      noDownloads: true,
      noPdfGeneration: true,
      noCsvGeneration: true,
      noHtmlGeneration: true,
      noUiRendering: true,
      noDomAccess: true,
      noBackgroundJobs: true,
      noScheduledJobs: true,
    },
  });
}
