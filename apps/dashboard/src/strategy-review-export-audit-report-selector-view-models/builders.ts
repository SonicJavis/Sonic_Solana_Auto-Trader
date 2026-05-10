/**
 * Phase 50 — Strategy Review Export Audit Report Selector View Models v1: builders.
 */

import type { StrategyReviewExportAuditReportApiContractSelector } from '../strategy-review-export-audit-report-contract-selectors/types.js';
import { getStrategyReviewExportAuditReportSelectorViewModelCapabilities } from './capabilities.js';
import { stableDeterministicSelectorViewModelChecksum } from './normalization.js';
import {
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_GENERATED_AT,
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SOURCE,
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE,
  type BuildStrategyReviewExportAuditReportSelectorViewModelInput,
  type StrategyReviewExportAuditReportSelectorBadgeViewModel,
  type StrategyReviewExportAuditReportSelectorDetailRowViewModel,
  type StrategyReviewExportAuditReportSelectorMatchedLabel,
  type StrategyReviewExportAuditReportSelectorQueryPanelViewModel,
  type StrategyReviewExportAuditReportSelectorResultPanelViewModel,
  type StrategyReviewExportAuditReportSelectorStatusLabel,
  type StrategyReviewExportAuditReportSelectorSummaryCardViewModel,
  type StrategyReviewExportAuditReportSelectorValidationBadgeViewModel,
  type StrategyReviewExportAuditReportSelectorViewModel,
  type StrategyReviewExportAuditReportSelectorViewModelKind,
  type StrategyReviewExportAuditReportSelectorViewModelName,
} from './types.js';

function checksumSeed(seed: string): string {
  return stableDeterministicSelectorViewModelChecksum(seed).replace(':', '-');
}

function viewModelId(seed: string): string {
  return `phase50-selector-view-model-${checksumSeed(seed)}`;
}

function mapStatusLabel(statusCode: 200 | 404 | 422): StrategyReviewExportAuditReportSelectorStatusLabel {
  if (statusCode === 404) {
    return 'not_found';
  }
  if (statusCode === 422) {
    return 'invalid_input';
  }
  return 'ready';
}

function mapMatchedLabel(matched: boolean): StrategyReviewExportAuditReportSelectorMatchedLabel {
  return matched ? 'matched' : 'not_matched';
}

function toViewModelName(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): StrategyReviewExportAuditReportSelectorViewModelName {
  if (selector.selectorKind === 'list') {
    return 'strategy-review-export-audit-report-selector-list-view-model';
  }
  if (selector.selectorKind === 'summary') {
    return 'strategy-review-export-audit-report-selector-summary-view-model';
  }
  if (selector.selectorKind === 'error') {
    return selector.selectorName === 'strategy-review-export-audit-report-error-invalid-id-contract-selector'
      ? 'strategy-review-export-audit-report-selector-error-invalid-id-view-model'
      : 'strategy-review-export-audit-report-selector-error-not-found-view-model';
  }
  const detailKey = selector.sourceViewModelIds[0] ?? checksumSeed(selector.selectorName);
  return `strategy-review-export-audit-report-selector-detail-view-model-${detailKey}`;
}

function toDisplayTitle(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): string {
  return `Selector View Model — ${selector.selectorKind.toUpperCase()}`;
}

function toDisplaySubtitle(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): string {
  return `Deterministic synthetic Phase 50 selector view model derived from Phase 49 selector ${selector.selectorName}.`;
}

function buildQueryPanel(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): StrategyReviewExportAuditReportSelectorQueryPanelViewModel {
  const pagination = selector.query.pagination;
  const sort = selector.query.sort;

  return {
    queryId: selector.query.queryId,
    queryKind: selector.query.queryKind,
    contractKind: selector.query.contractKind,
    contractName: selector.query.contractName,
    paginationLabel: pagination
      ? `page ${pagination.page} / ${pagination.pageCount} (${pagination.totalCount} total, size ${pagination.pageSize})`
      : 'not-applicable',
    filterLabels: selector.query.filters.map(
      filter => `${filter.field} ${filter.operator} ${filter.value}`,
    ),
    sortLabel: sort ? `${sort.field}:${sort.direction}` : 'not-applicable',
    readOnly: true,
    fixtureOnly: true,
  };
}

function buildResultPanel(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): StrategyReviewExportAuditReportSelectorResultPanelViewModel {
  return {
    resultId: selector.result.resultId,
    resultKind: selector.result.resultKind,
    matched: selector.result.matched,
    statusCode: selector.result.statusCode,
    contractCount: selector.result.contracts.length,
    summary: `${selector.result.resultKind} selector returned ${selector.result.contracts.length} contract(s) with status ${selector.result.statusCode}.`,
    safetyNotes: [
      'Fixture-derived result panel only.',
      'No runtime requests, handlers, or endpoints.',
      'No execution, recommendations, or advisory output.',
    ],
  };
}

function buildSummaryCards(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): readonly StrategyReviewExportAuditReportSelectorSummaryCardViewModel[] {
  return [
    {
      cardId: `${selector.selectorId}-card-kind`,
      title: 'Selector kind',
      value: selector.selectorKind,
      order: 1,
    },
    {
      cardId: `${selector.selectorId}-card-status`,
      title: 'Status code',
      value: String(selector.result.statusCode),
      order: 2,
    },
    {
      cardId: `${selector.selectorId}-card-contracts`,
      title: 'Source contracts',
      value: String(selector.sourceContractIds.length),
      order: 3,
    },
    {
      cardId: `${selector.selectorId}-card-view-models`,
      title: 'Source view models',
      value: String(selector.sourceViewModelIds.length),
      order: 4,
    },
    {
      cardId: `${selector.selectorId}-card-safety`,
      title: 'Safety boundary',
      value: 'read-only fixture-only',
      order: 5,
    },
  ];
}

function buildDetailRows(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): readonly StrategyReviewExportAuditReportSelectorDetailRowViewModel[] {
  return [
    {
      rowId: `${selector.selectorId}-row-source-selector-id`,
      label: 'sourceSelectorId',
      value: selector.selectorId,
      order: 1,
    },
    {
      rowId: `${selector.selectorId}-row-source-selector-name`,
      label: 'sourceSelectorName',
      value: selector.selectorName,
      order: 2,
    },
    {
      rowId: `${selector.selectorId}-row-source-selector-kind`,
      label: 'sourceSelectorKind',
      value: selector.selectorKind,
      order: 3,
    },
    {
      rowId: `${selector.selectorId}-row-query-id`,
      label: 'queryId',
      value: selector.query.queryId,
      order: 4,
    },
    {
      rowId: `${selector.selectorId}-row-result-id`,
      label: 'resultId',
      value: selector.result.resultId,
      order: 5,
    },
    {
      rowId: `${selector.selectorId}-row-contract-count`,
      label: 'sourceContractCount',
      value: String(selector.sourceContractIds.length),
      order: 6,
    },
  ];
}

function buildSafetyBadges(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): readonly StrategyReviewExportAuditReportSelectorBadgeViewModel[] {
  return [
    {
      badgeId: `${selector.selectorId}-badge-read-only`,
      label: 'readOnly',
      value: 'true',
      safe: true,
      order: 1,
    },
    {
      badgeId: `${selector.selectorId}-badge-local-only`,
      label: 'localOnly',
      value: 'true',
      safe: true,
      order: 2,
    },
    {
      badgeId: `${selector.selectorId}-badge-runtime-requests`,
      label: 'runtimeRequests',
      value: 'false',
      safe: true,
      order: 3,
    },
    {
      badgeId: `${selector.selectorId}-badge-execution`,
      label: 'execution',
      value: 'false',
      safe: true,
      order: 4,
    },
  ];
}

function buildValidationBadges(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): readonly StrategyReviewExportAuditReportSelectorValidationBadgeViewModel[] {
  return [
    {
      badgeId: `${selector.selectorId}-validation-structural`,
      label: 'structural',
      status: 'passed',
      order: 1,
    },
    {
      badgeId: `${selector.selectorId}-validation-safety`,
      label: 'safety',
      status: 'passed',
      order: 2,
    },
    {
      badgeId: `${selector.selectorId}-validation-source`,
      label: 'source-linkage',
      status: 'passed',
      order: 3,
    },
  ];
}

function buildLimitationItems(
  selector: StrategyReviewExportAuditReportApiContractSelector,
): readonly string[] {
  return [
    'Synthetic fixture-derived selector view-model output only.',
    'No route handlers, HTTP server behavior, or runtime request handling.',
    `Selector kind '${selector.selectorKind}' is represented as static display-contract data only.`,
  ];
}

function buildNextPhaseNotes(): readonly string[] {
  return [
    'Phase 50 does not implement real UI rendering or DOM behavior.',
    'Phase 50 does not implement real endpoints, handlers, or runtime query parsing.',
    'Phase 50 does not implement report generation, downloads, persistence, or execution flows.',
  ];
}

function buildViewModel(
  selector: StrategyReviewExportAuditReportApiContractSelector,
  viewModelKind: StrategyReviewExportAuditReportSelectorViewModelKind,
): StrategyReviewExportAuditReportSelectorViewModel {
  const deterministicSeed = [
    'phase50:selector-view-model',
    selector.selectorName,
    selector.selectorKind,
    selector.selectorId,
    selector.query.queryId,
    selector.result.resultId,
  ].join(':');

  return {
    viewModelId: viewModelId(deterministicSeed),
    viewModelName: toViewModelName(selector),
    viewModelKind,
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE,
    sourceSelectorId: selector.selectorId,
    sourceSelectorName: selector.selectorName,
    sourceSelectorKind: selector.selectorKind,
    sourceContractIds: [...selector.sourceContractIds],
    sourceViewModelIds: [...selector.sourceViewModelIds],
    sourceReportIds: [...selector.sourceReportIds],
    sourceAuditIds: [...selector.sourceAuditIds],
    displayTitle: toDisplayTitle(selector),
    displaySubtitle: toDisplaySubtitle(selector),
    statusLabel: mapStatusLabel(selector.result.statusCode),
    matchedLabel: mapMatchedLabel(selector.result.matched),
    queryPanel: buildQueryPanel(selector),
    resultPanel: buildResultPanel(selector),
    summaryCards: buildSummaryCards(selector),
    detailRows: buildDetailRows(selector),
    safetyBadges: buildSafetyBadges(selector),
    validationBadges: buildValidationBadges(selector),
    limitationItems: buildLimitationItems(selector),
    nextPhaseNotes: buildNextPhaseNotes(),
    meta: {
      phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE,
      viewModelVersion: PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_VERSION,
      generatedAt: PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_GENERATED_AT,
      source: PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SOURCE,
      deterministicSeed,
      sourceSelectorPhase: 49,
      sourceContractPhase: 48,
      sourceViewModelPhase: 47,
      sourceReportPhase: 46,
      sourceAuditPhase: 45,
      sourcePhases: [45, 46, 47, 48, 49, 50],
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      liveData: false,
      networkAccess: false,
      persistence: false,
      filesystemWrites: false,
      downloads: false,
      pdfGeneration: false,
      csvGeneration: false,
      htmlGeneration: false,
      routeHandlers: false,
      httpServer: false,
      runtimeRequests: false,
      uiRendering: false,
      domAccess: false,
      backgroundJobs: false,
      scheduledJobs: false,
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
      noRouteHandlers: true,
      noHttpServer: true,
      noRuntimeRequests: true,
      noUiRendering: true,
      noDomAccess: true,
      noBackgroundJobs: true,
      noScheduledJobs: true,
      noExecution: true,
      noTradingSignals: true,
      noRecommendations: true,
      noInvestmentAdvice: true,
    },
    validation: {
      fixtureOnly: true,
      structuralValidation: 'passed',
      safetyValidation: 'passed',
      sourceSelectorValidation: 'passed',
      sourceContractValidation: 'passed',
      sourceViewModelValidation: 'passed',
      queryPanelValidation: 'passed',
      resultPanelValidation: 'passed',
      issueCount: 0,
    },
    capabilityFlags: getStrategyReviewExportAuditReportSelectorViewModelCapabilities(),
  };
}

export function buildStrategyReviewExportAuditReportSelectorListViewModel(
  input: BuildStrategyReviewExportAuditReportSelectorViewModelInput,
): StrategyReviewExportAuditReportSelectorViewModel {
  return buildViewModel(input.sourceSelector, 'list');
}

export function buildStrategyReviewExportAuditReportSelectorDetailViewModel(
  input: BuildStrategyReviewExportAuditReportSelectorViewModelInput,
): StrategyReviewExportAuditReportSelectorViewModel {
  return buildViewModel(input.sourceSelector, 'detail');
}

export function buildStrategyReviewExportAuditReportSelectorSummaryViewModel(
  input: BuildStrategyReviewExportAuditReportSelectorViewModelInput,
): StrategyReviewExportAuditReportSelectorViewModel {
  return buildViewModel(input.sourceSelector, 'summary');
}

export function buildStrategyReviewExportAuditReportSelectorErrorViewModel(
  input: BuildStrategyReviewExportAuditReportSelectorViewModelInput,
): StrategyReviewExportAuditReportSelectorViewModel {
  return buildViewModel(input.sourceSelector, 'error');
}

export function buildStrategyReviewExportAuditReportSelectorViewModel(
  input: BuildStrategyReviewExportAuditReportSelectorViewModelInput,
): StrategyReviewExportAuditReportSelectorViewModel {
  if (input.sourceSelector.selectorKind === 'list') {
    return buildStrategyReviewExportAuditReportSelectorListViewModel(input);
  }
  if (input.sourceSelector.selectorKind === 'detail') {
    return buildStrategyReviewExportAuditReportSelectorDetailViewModel(input);
  }
  if (input.sourceSelector.selectorKind === 'summary') {
    return buildStrategyReviewExportAuditReportSelectorSummaryViewModel(input);
  }
  return buildStrategyReviewExportAuditReportSelectorErrorViewModel(input);
}
