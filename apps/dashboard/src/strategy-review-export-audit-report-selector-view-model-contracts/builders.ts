/**
 * Phase 51 — Strategy Review Export Audit Report Selector View Model API Contracts v1: builders.
 */

import type {
  StrategyReviewExportAuditReportSelectorMatchedLabel,
  StrategyReviewExportAuditReportSelectorStatusLabel,
  StrategyReviewExportAuditReportSelectorViewModel,
  StrategyReviewExportAuditReportSelectorViewModelKind,
} from '../strategy-review-export-audit-report-selector-view-models/types.js';
import { getStrategyReviewExportAuditReportSelectorViewModelApiContractCapabilities } from './capabilities.js';
import { stableDeterministicSelectorViewModelApiContractChecksum } from './normalization.js';
import {
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_GENERATED_AT,
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_SOURCE,
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
  type BuildStrategyReviewExportAuditReportSelectorViewModelApiContractInput,
  type StrategyReviewExportAuditReportSelectorViewModelApiContract,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractDetailData,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractDetailName,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractErrorName,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractFilter,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractMeta,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractPagination,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractSafetyEnvelope,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractSort,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractSummaryData,
  type StrategyReviewExportAuditReportSelectorViewModelApiContractValidationEnvelope,
  type StrategyReviewExportAuditReportSelectorViewModelDetailApiContract,
  type StrategyReviewExportAuditReportSelectorViewModelErrorApiContract,
  type StrategyReviewExportAuditReportSelectorViewModelListApiContract,
  type StrategyReviewExportAuditReportSelectorViewModelSummaryApiContract,
} from './types.js';

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function contractId(seed: string): string {
  return `phase51-selector-view-model-api-contract-${stableDeterministicSelectorViewModelApiContractChecksum(seed).replace(':', '-')}`;
}

function buildSafetyEnvelope(): StrategyReviewExportAuditReportSelectorViewModelApiContractSafetyEnvelope {
  return {
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
  };
}

function buildValidationEnvelope(): StrategyReviewExportAuditReportSelectorViewModelApiContractValidationEnvelope {
  return {
    fixtureOnly: true,
    structuralValidation: 'passed',
    safetyValidation: 'passed',
    sourceSelectorViewModelValidation: 'passed',
    sourceSelectorValidation: 'passed',
    sourceContractValidation: 'passed',
    responseEnvelopeValidation: 'passed',
    paginationValidation: 'passed',
    limitationValidation: 'passed',
    issueCount: 0,
  };
}

function buildMeta(deterministicSeed: string): StrategyReviewExportAuditReportSelectorViewModelApiContractMeta {
  return {
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
    contractVersion: PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_VERSION,
    generatedAt: PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_GENERATED_AT,
    deterministicSeed,
    source: PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_SOURCE,
    sourceSelectorViewModelPhase: 50,
    sourceSelectorPhase: 49,
    sourceContractPhase: 48,
    sourceViewModelPhase: 47,
    sourceReportPhase: 46,
    sourceAuditPhase: 45,
    sourcePhases: [45, 46, 47, 48, 49, 50, 51],
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
  };
}

function buildSourceSelectorIds(
  selectorViewModels: readonly StrategyReviewExportAuditReportSelectorViewModel[],
): readonly string[] {
  return uniqueSorted(selectorViewModels.map(selectorViewModel => selectorViewModel.sourceSelectorId));
}

function buildSourceContractIds(
  selectorViewModels: readonly StrategyReviewExportAuditReportSelectorViewModel[],
): readonly string[] {
  return uniqueSorted(
    selectorViewModels.flatMap(selectorViewModel => [...selectorViewModel.sourceContractIds]),
  );
}

function buildSummaryCountRows<T extends string>(
  values: readonly T[],
): ReadonlyArray<{ readonly key: T; readonly count: number }> {
  const counts = new Map<T, number>();
  values.forEach(value => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, count]) => ({ key, count }));
}

function buildListFilters(): readonly StrategyReviewExportAuditReportSelectorViewModelApiContractFilter[] {
  return [
    { field: 'viewModelKind', value: 'all', fixtureOnly: true },
    { field: 'statusLabel', value: 'all', fixtureOnly: true },
    { field: 'matchedLabel', value: 'all', fixtureOnly: true },
  ];
}

function buildListSorts(): readonly StrategyReviewExportAuditReportSelectorViewModelApiContractSort[] {
  return [{ field: 'selectorViewModelName', direction: 'asc', fixtureOnly: true }];
}

function buildListPagination(
  selectorViewModels: readonly StrategyReviewExportAuditReportSelectorViewModel[],
): StrategyReviewExportAuditReportSelectorViewModelApiContractPagination {
  return {
    totalCount: selectorViewModels.length,
    pageCount: 1,
    page: 1,
    pageSize: selectorViewModels.length,
    fixtureOnly: true,
    readOnly: true,
  };
}

function buildListItem(
  selectorViewModel: StrategyReviewExportAuditReportSelectorViewModel,
): StrategyReviewExportAuditReportSelectorViewModelListApiContract['data'][number] {
  return {
    selectorViewModelId: selectorViewModel.viewModelId,
    selectorViewModelName: selectorViewModel.viewModelName,
    selectorViewModelKind: selectorViewModel.viewModelKind,
    sourceSelectorId: selectorViewModel.sourceSelectorId,
    sourceSelectorName: selectorViewModel.sourceSelectorName,
    statusLabel: selectorViewModel.statusLabel,
    matchedLabel: selectorViewModel.matchedLabel,
    resultStatusCode: selectorViewModel.resultPanel.statusCode,
    sourceContractCount: selectorViewModel.sourceContractIds.length,
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
  };
}

function buildDetailData(
  selectorViewModel: StrategyReviewExportAuditReportSelectorViewModel,
): StrategyReviewExportAuditReportSelectorViewModelApiContractDetailData {
  return {
    selectorViewModel: {
      ...selectorViewModel,
      sourceContractIds: [...selectorViewModel.sourceContractIds],
      sourceViewModelIds: [...selectorViewModel.sourceViewModelIds],
      sourceReportIds: [...selectorViewModel.sourceReportIds],
      sourceAuditIds: [...selectorViewModel.sourceAuditIds],
      summaryCards: [...selectorViewModel.summaryCards],
      detailRows: [...selectorViewModel.detailRows],
      safetyBadges: [...selectorViewModel.safetyBadges],
      validationBadges: [...selectorViewModel.validationBadges],
      limitationItems: [...selectorViewModel.limitationItems],
      nextPhaseNotes: [...selectorViewModel.nextPhaseNotes],
    },
    summary: {
      selectorViewModelId: selectorViewModel.viewModelId,
      selectorViewModelName: selectorViewModel.viewModelName,
      selectorViewModelKind: selectorViewModel.viewModelKind,
      sourceSelectorId: selectorViewModel.sourceSelectorId,
      sourceSelectorName: selectorViewModel.sourceSelectorName,
      statusLabel: selectorViewModel.statusLabel,
      matchedLabel: selectorViewModel.matchedLabel,
      resultStatusCode: selectorViewModel.resultPanel.statusCode,
      sourceContractCount: selectorViewModel.sourceContractIds.length,
      phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
    },
    limitationItems: [...selectorViewModel.limitationItems],
    nextPhaseNotes: [...selectorViewModel.nextPhaseNotes],
  };
}

function buildSummaryData(
  selectorViewModels: readonly StrategyReviewExportAuditReportSelectorViewModel[],
  deterministicSeed: string,
): StrategyReviewExportAuditReportSelectorViewModelApiContractSummaryData {
  const byKind = buildSummaryCountRows<StrategyReviewExportAuditReportSelectorViewModelKind>(
    selectorViewModels.map(selectorViewModel => selectorViewModel.viewModelKind),
  ).map(({ key, count }) => ({ kind: key, count }));

  const byStatus = buildSummaryCountRows<StrategyReviewExportAuditReportSelectorStatusLabel>(
    selectorViewModels.map(selectorViewModel => selectorViewModel.statusLabel),
  ).map(({ key, count }) => ({ status: key, count }));

  const byMatched = buildSummaryCountRows<StrategyReviewExportAuditReportSelectorMatchedLabel>(
    selectorViewModels.map(selectorViewModel => selectorViewModel.matchedLabel),
  ).map(({ key, count }) => ({ matched: key, count }));

  return {
    totalSelectorViewModels: selectorViewModels.length,
    byKind,
    byStatus,
    byMatched,
    sourcePhases: [45, 46, 47, 48, 49, 50, 51],
    deterministicSeed,
  };
}

export function buildStrategyReviewExportAuditReportSelectorViewModelListApiContract(
  selectorViewModels: readonly StrategyReviewExportAuditReportSelectorViewModel[],
): StrategyReviewExportAuditReportSelectorViewModelListApiContract {
  const deterministicSeed = `phase51:list:${selectorViewModels.map(selectorViewModel => selectorViewModel.viewModelId).join(',')}`;
  return {
    contractId: contractId(deterministicSeed),
    contractName: 'strategy-review-export-audit-report-selector-view-model-list-api-contract',
    contractKind: 'list',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
    endpointPattern: '/api/v1/strategy-review-export-audit-report-selector-view-model-contracts',
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceSelectorViewModelIds: selectorViewModels.map(selectorViewModel => selectorViewModel.viewModelId),
    sourceSelectorIds: buildSourceSelectorIds(selectorViewModels),
    sourceContractIds: buildSourceContractIds(selectorViewModels),
    statusCode: 200,
    success: true,
    data: selectorViewModels.map(buildListItem),
    error: null,
    meta: buildMeta(deterministicSeed),
    pagination: buildListPagination(selectorViewModels),
    filters: buildListFilters(),
    sorts: buildListSorts(),
    safety: buildSafetyEnvelope(),
    validation: buildValidationEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportSelectorViewModelApiContractCapabilities(),
  };
}

export function buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract(
  selectorViewModel: StrategyReviewExportAuditReportSelectorViewModel,
): StrategyReviewExportAuditReportSelectorViewModelDetailApiContract {
  const deterministicSeed = `phase51:detail:${selectorViewModel.viewModelId}`;
  const contractName: StrategyReviewExportAuditReportSelectorViewModelApiContractDetailName =
    `strategy-review-export-audit-report-selector-view-model-detail-api-contract-${selectorViewModel.viewModelId}`;

  return {
    contractId: contractId(deterministicSeed),
    contractName,
    contractKind: 'detail',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
    endpointPattern:
      '/api/v1/strategy-review-export-audit-report-selector-view-model-contracts/:selectorViewModelId',
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceSelectorViewModelIds: [selectorViewModel.viewModelId],
    sourceSelectorIds: [selectorViewModel.sourceSelectorId],
    sourceContractIds: uniqueSorted(selectorViewModel.sourceContractIds),
    statusCode: 200,
    success: true,
    data: buildDetailData(selectorViewModel),
    error: null,
    meta: buildMeta(deterministicSeed),
    pagination: null,
    filters: [],
    sorts: [],
    safety: buildSafetyEnvelope(),
    validation: buildValidationEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportSelectorViewModelApiContractCapabilities(),
  };
}

export function buildStrategyReviewExportAuditReportSelectorViewModelSummaryApiContract(
  selectorViewModels: readonly StrategyReviewExportAuditReportSelectorViewModel[],
): StrategyReviewExportAuditReportSelectorViewModelSummaryApiContract {
  const deterministicSeed = `phase51:summary:${selectorViewModels.map(selectorViewModel => selectorViewModel.viewModelId).join(',')}`;

  return {
    contractId: contractId(deterministicSeed),
    contractName: 'strategy-review-export-audit-report-selector-view-model-summary-api-contract',
    contractKind: 'summary',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
    endpointPattern:
      '/api/v1/strategy-review-export-audit-report-selector-view-model-contracts/summary',
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceSelectorViewModelIds: selectorViewModels.map(selectorViewModel => selectorViewModel.viewModelId),
    sourceSelectorIds: buildSourceSelectorIds(selectorViewModels),
    sourceContractIds: buildSourceContractIds(selectorViewModels),
    statusCode: 200,
    success: true,
    data: buildSummaryData(selectorViewModels, deterministicSeed),
    error: null,
    meta: buildMeta(deterministicSeed),
    pagination: null,
    filters: [],
    sorts: [],
    safety: buildSafetyEnvelope(),
    validation: buildValidationEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportSelectorViewModelApiContractCapabilities(),
  };
}

export function buildStrategyReviewExportAuditReportSelectorViewModelErrorApiContract(input: {
  readonly contractName: StrategyReviewExportAuditReportSelectorViewModelApiContractErrorName;
  readonly statusCode: 404 | 422;
  readonly errorCode: string;
  readonly errorMessage: string;
  readonly endpointPattern: string;
  readonly details?: string;
}): StrategyReviewExportAuditReportSelectorViewModelErrorApiContract {
  const deterministicSeed = `phase51:error:${input.contractName}:${input.statusCode}:${input.errorCode}`;
  return {
    contractId: contractId(deterministicSeed),
    contractName: input.contractName,
    contractKind: 'error',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
    endpointPattern: input.endpointPattern,
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceSelectorViewModelIds: [],
    sourceSelectorIds: [],
    sourceContractIds: [],
    statusCode: input.statusCode,
    success: false,
    data: null,
    error: {
      code: input.errorCode,
      message: input.errorMessage,
      fixtureOnly: true,
      ...(input.details !== undefined ? { details: input.details } : {}),
    },
    meta: buildMeta(deterministicSeed),
    pagination: null,
    filters: [],
    sorts: [],
    safety: buildSafetyEnvelope(),
    validation: buildValidationEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportSelectorViewModelApiContractCapabilities(),
  };
}

export function buildStrategyReviewExportAuditReportSelectorViewModelApiContract(
  input: BuildStrategyReviewExportAuditReportSelectorViewModelApiContractInput,
): StrategyReviewExportAuditReportSelectorViewModelApiContract {
  switch (input.kind) {
    case 'list':
      return buildStrategyReviewExportAuditReportSelectorViewModelListApiContract(input.selectorViewModels);
    case 'detail':
      return buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract(input.selectorViewModel);
    case 'summary':
      return buildStrategyReviewExportAuditReportSelectorViewModelSummaryApiContract(input.selectorViewModels);
    case 'error':
      return buildStrategyReviewExportAuditReportSelectorViewModelErrorApiContract(input);
  }
}
