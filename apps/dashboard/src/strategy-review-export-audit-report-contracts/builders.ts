/**
 * Phase 48 — Strategy Review Export Audit Report Read-Only API Contracts v1: builders.
 *
 * Pure deterministic functions that build read-only API contract fixtures
 * from Phase 47 strategy review export audit report view models.
 *
 * No side effects. No mutation. No network. No filesystem.
 * No runtime requests. No route handlers. No live data.
 */

import type { StrategyReviewExportAuditReportViewModel } from '../strategy-review-export-audit-report-view-models/types.js';
import { getStrategyReviewExportAuditReportApiContractCapabilities } from './capabilities.js';
import { stableDeterministicContractChecksum } from './normalization.js';
import {
  PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT,
  PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE,
  PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
  type StrategyReviewExportAuditReportApiContractDetail,
  type StrategyReviewExportAuditReportApiContractDetailName,
  type StrategyReviewExportAuditReportApiContractListItem,
  type StrategyReviewExportAuditReportApiContractMeta,
  type StrategyReviewExportAuditReportApiContractPagination,
  type StrategyReviewExportAuditReportApiContractSafetyEnvelope,
  type StrategyReviewExportAuditReportApiContractSummaryData,
  type StrategyReviewExportAuditReportDetailApiContract,
  type StrategyReviewExportAuditReportErrorApiContract,
  type StrategyReviewExportAuditReportListApiContract,
  type StrategyReviewExportAuditReportSummaryApiContract,
} from './types.js';

// ─── Safety envelope ───────────────────────────────────────────────────────────

function buildSafetyEnvelope(): StrategyReviewExportAuditReportApiContractSafetyEnvelope {
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
    noUiRendering: true,
    noDomAccess: true,
    noBackgroundJobs: true,
    noScheduledJobs: true,
    noRouteHandlers: true,
    noHttpServer: true,
    noRuntimeRequests: true,
  };
}

// ─── Meta builder ──────────────────────────────────────────────────────────────

function buildContractMeta(deterministicSeed: string): StrategyReviewExportAuditReportApiContractMeta {
  return {
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
    contractVersion: PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION,
    generatedAt: PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT,
    deterministicSeed,
    source: PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE,
    fixtureOnly: true,
    readOnly: true,
    liveData: false,
    networkAccess: false,
    persistence: false,
    execution: false,
    recommendations: false,
    tradingSignals: false,
    investmentAdvice: false,
  };
}

// ─── Contract ID ───────────────────────────────────────────────────────────────

function contractId(seed: string): string {
  return `phase48-contract-${stableDeterministicContractChecksum(seed).replace(':', '-')}`;
}

// ─── List item builder ─────────────────────────────────────────────────────────

function buildListItem(
  viewModel: StrategyReviewExportAuditReportViewModel,
): StrategyReviewExportAuditReportApiContractListItem {
  return {
    viewModelId: viewModel.viewModelId,
    viewModelName: viewModel.viewModelName,
    viewModelKind: viewModel.viewModelKind,
    sourceReportId: viewModel.sourceReportId,
    sourceReportName: viewModel.sourceReportName,
    sourceReportKind: viewModel.sourceReportKind,
    sourceAuditId: viewModel.sourceAuditId,
    sourceAuditName: viewModel.sourceAuditName,
    sourceQueueReference: viewModel.sourceQueueReference,
    displayTitle: viewModel.displayTitle,
    displaySubtitle: viewModel.displaySubtitle,
    statusLabel: viewModel.statusLabel,
    severityLabel: viewModel.severityLabel,
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
  };
}

// ─── Detail data builder ───────────────────────────────────────────────────────

function buildDetailData(
  viewModel: StrategyReviewExportAuditReportViewModel,
): StrategyReviewExportAuditReportApiContractDetail {
  return {
    viewModelId: viewModel.viewModelId,
    viewModelName: viewModel.viewModelName,
    viewModelKind: viewModel.viewModelKind,
    sourceReportId: viewModel.sourceReportId,
    sourceReportName: viewModel.sourceReportName,
    sourceReportKind: viewModel.sourceReportKind,
    sourceAuditId: viewModel.sourceAuditId,
    sourceAuditName: viewModel.sourceAuditName,
    sourceQueueReference: viewModel.sourceQueueReference,
    displayTitle: viewModel.displayTitle,
    displaySubtitle: viewModel.displaySubtitle,
    statusLabel: viewModel.statusLabel,
    severityLabel: viewModel.severityLabel,
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
    summaryCards: viewModel.summaryCards.map(card => ({
      cardId: card.cardId,
      cardKind: card.cardKind,
      title: card.title,
      value: card.value,
      description: card.description,
      order: card.order,
    })),
    detailSections: viewModel.detailSections.map(section => ({
      sectionId: section.sectionId,
      sectionTitle: section.sectionTitle,
      sectionKind: section.sectionKind,
      order: section.order,
      summary: section.summary,
      rowCount: section.rows.length,
      evidenceReferenceCount: section.evidenceReferenceIds.length,
    })),
    evidenceItems: viewModel.evidenceItems.map(item => ({
      evidenceId: item.evidenceId,
      label: item.label,
      description: item.description,
      order: item.order,
      syntheticOnly: true,
      liveData: false,
    })),
    safetyBadges: viewModel.safetyBadges.map(badge => ({
      badgeId: badge.badgeId,
      label: badge.label,
      value: badge.value,
      safe: badge.safe,
      order: badge.order,
    })),
    validationBadges: viewModel.validationBadges.map(badge => ({
      badgeId: badge.badgeId,
      label: badge.label,
      status: badge.status,
      order: badge.order,
    })),
    limitationItems: [...viewModel.limitationItems],
    nextPhaseNotes: [...viewModel.nextPhaseNotes],
  };
}

// ─── List API contract builder ─────────────────────────────────────────────────

export function buildStrategyReviewExportAuditReportListApiContract(
  viewModels: readonly StrategyReviewExportAuditReportViewModel[],
): StrategyReviewExportAuditReportListApiContract {
  const seed = `phase48:list:${viewModels.map(vm => vm.viewModelId).join(',')}`;
  const data = viewModels.map(buildListItem);
  const pagination: StrategyReviewExportAuditReportApiContractPagination = {
    totalCount: viewModels.length,
    pageCount: 1,
    page: 1,
    pageSize: viewModels.length,
    fixtureOnly: true,
  };

  return {
    contractId: contractId(seed),
    contractName: 'strategy-review-export-audit-report-list-contract',
    contractKind: 'list',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
    endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts',
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceViewModelIds: viewModels.map(vm => vm.viewModelId),
    sourceReportIds: viewModels.map(vm => vm.sourceReportId),
    sourceAuditIds: viewModels.map(vm => vm.sourceAuditId),
    statusCode: 200,
    success: true,
    data,
    error: null,
    meta: buildContractMeta(seed),
    pagination,
    filters: [
      { field: 'statusLabel', value: 'all', fixtureOnly: true },
      { field: 'severityLabel', value: 'all', fixtureOnly: true },
    ],
    sorts: [{ field: 'viewModelName', direction: 'asc', fixtureOnly: true }],
    safety: buildSafetyEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportApiContractCapabilities(),
  };
}

// ─── Detail API contract builder ───────────────────────────────────────────────

export function buildStrategyReviewExportAuditReportDetailApiContract(
  viewModel: StrategyReviewExportAuditReportViewModel,
): StrategyReviewExportAuditReportDetailApiContract {
  const seed = `phase48:detail:${viewModel.viewModelId}`;
  const contractName: StrategyReviewExportAuditReportApiContractDetailName =
    `strategy-review-export-audit-report-detail-contract-${viewModel.viewModelId}`;

  return {
    contractId: contractId(seed),
    contractName,
    contractKind: 'detail',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
    endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts/:viewModelId',
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceViewModelIds: [viewModel.viewModelId],
    sourceReportIds: [viewModel.sourceReportId],
    sourceAuditIds: [viewModel.sourceAuditId],
    statusCode: 200,
    success: true,
    data: buildDetailData(viewModel),
    error: null,
    meta: buildContractMeta(seed),
    pagination: null,
    filters: [],
    sorts: [],
    safety: buildSafetyEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportApiContractCapabilities(),
  };
}

// ─── Summary API contract builder ──────────────────────────────────────────────

export function buildStrategyReviewExportAuditReportSummaryApiContract(
  viewModels: readonly StrategyReviewExportAuditReportViewModel[],
): StrategyReviewExportAuditReportSummaryApiContract {
  const seed = `phase48:summary:${viewModels.map(vm => vm.viewModelId).join(',')}`;

  const statusCounts = new Map<string, number>();
  const severityCounts = new Map<string, number>();
  const kindCounts = new Map<string, number>();

  for (const vm of viewModels) {
    statusCounts.set(vm.statusLabel, (statusCounts.get(vm.statusLabel) ?? 0) + 1);
    severityCounts.set(vm.severityLabel, (severityCounts.get(vm.severityLabel) ?? 0) + 1);
    kindCounts.set(vm.viewModelKind, (kindCounts.get(vm.viewModelKind) ?? 0) + 1);
  }

  const byStatus = [...statusCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([status, count]) => ({ status, count }));
  const bySeverity = [...severityCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([severity, count]) => ({ severity, count }));
  const byKind = [...kindCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([kind, count]) => ({ kind, count }));

  const summaryData: StrategyReviewExportAuditReportApiContractSummaryData = {
    totalViewModels: viewModels.length,
    byStatus,
    bySeverity,
    byKind,
    sourcePhases: [44, 45, 46, 47, 48],
    deterministicSeed: seed,
  };

  return {
    contractId: contractId(seed),
    contractName: 'strategy-review-export-audit-report-summary-contract',
    contractKind: 'summary',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
    endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts/summary',
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceViewModelIds: viewModels.map(vm => vm.viewModelId),
    sourceReportIds: viewModels.map(vm => vm.sourceReportId),
    sourceAuditIds: viewModels.map(vm => vm.sourceAuditId),
    statusCode: 200,
    success: true,
    data: summaryData,
    error: null,
    meta: buildContractMeta(seed),
    pagination: null,
    filters: [],
    sorts: [],
    safety: buildSafetyEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportApiContractCapabilities(),
  };
}

// ─── Error API contract builder ────────────────────────────────────────────────

export function buildStrategyReviewExportAuditReportErrorApiContract(input: {
  readonly contractName:
    | 'strategy-review-export-audit-report-error-not-found-contract'
    | 'strategy-review-export-audit-report-error-invalid-id-contract';
  readonly statusCode: 404 | 422;
  readonly errorCode: string;
  readonly errorMessage: string;
  readonly endpointPattern: string;
  readonly details?: string;
}): StrategyReviewExportAuditReportErrorApiContract {
  const seed = `phase48:error:${input.contractName}:${input.statusCode}:${input.errorCode}`;

  return {
    contractId: contractId(seed),
    contractName: input.contractName,
    contractKind: 'error',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
    endpointPattern: input.endpointPattern,
    method: 'GET',
    readOnly: true,
    fixtureOnly: true,
    sourceViewModelIds: [],
    sourceReportIds: [],
    sourceAuditIds: [],
    statusCode: input.statusCode,
    success: false,
    data: null,
    error: {
      code: input.errorCode,
      message: input.errorMessage,
      fixtureOnly: true,
      ...(input.details !== undefined ? { details: input.details } : {}),
    },
    meta: buildContractMeta(seed),
    pagination: null,
    filters: [],
    sorts: [],
    safety: buildSafetyEnvelope(),
    capabilityFlags: getStrategyReviewExportAuditReportApiContractCapabilities(),
  };
}

// ─── Generic contract builder ──────────────────────────────────────────────────

export type BuildStrategyReviewExportAuditReportApiContractInput =
  | { readonly kind: 'list'; readonly viewModels: readonly StrategyReviewExportAuditReportViewModel[] }
  | { readonly kind: 'detail'; readonly viewModel: StrategyReviewExportAuditReportViewModel }
  | { readonly kind: 'summary'; readonly viewModels: readonly StrategyReviewExportAuditReportViewModel[] }
  | {
      readonly kind: 'error';
      readonly contractName:
        | 'strategy-review-export-audit-report-error-not-found-contract'
        | 'strategy-review-export-audit-report-error-invalid-id-contract';
      readonly statusCode: 404 | 422;
      readonly errorCode: string;
      readonly errorMessage: string;
      readonly endpointPattern: string;
      readonly details?: string;
    };

export function buildStrategyReviewExportAuditReportApiContract(
  input: BuildStrategyReviewExportAuditReportApiContractInput,
):
  | StrategyReviewExportAuditReportListApiContract
  | StrategyReviewExportAuditReportDetailApiContract
  | StrategyReviewExportAuditReportSummaryApiContract
  | StrategyReviewExportAuditReportErrorApiContract {
  switch (input.kind) {
    case 'list':
      return buildStrategyReviewExportAuditReportListApiContract(input.viewModels);
    case 'detail':
      return buildStrategyReviewExportAuditReportDetailApiContract(input.viewModel);
    case 'summary':
      return buildStrategyReviewExportAuditReportSummaryApiContract(input.viewModels);
    case 'error':
      return buildStrategyReviewExportAuditReportErrorApiContract(input);
  }
}
