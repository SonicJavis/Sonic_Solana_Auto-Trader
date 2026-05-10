/**
 * Phase 48 — Strategy Review Export Audit Report Read-Only API Contracts v1: fixtures.
 *
 * Prebuilt deterministic API contract fixtures derived from Phase 47
 * strategy review export audit report view models.
 *
 * All fixtures are static, synthetic, fixture-derived, read-only, and deterministic.
 * No real endpoints. No live data. No network. No persistence. No execution.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP,
  listStrategyReviewExportAuditReportViewModels,
} from '../strategy-review-export-audit-report-view-models/index.js';
import type { StrategyReviewExportAuditReportViewModelName } from '../strategy-review-export-audit-report-view-models/types.js';
import {
  buildStrategyReviewExportAuditReportDetailApiContract,
  buildStrategyReviewExportAuditReportErrorApiContract,
  buildStrategyReviewExportAuditReportListApiContract,
  buildStrategyReviewExportAuditReportSummaryApiContract,
} from './builders.js';
import type {
  StrategyReviewExportAuditReportApiContract,
  StrategyReviewExportAuditReportDetailApiContract,
  StrategyReviewExportAuditReportErrorApiContract,
  StrategyReviewExportAuditReportListApiContract,
  StrategyReviewExportAuditReportSummaryApiContract,
} from './types.js';

// ─── Source view models ────────────────────────────────────────────────────────

const PHASE_47_VIEW_MODEL_LIST = listStrategyReviewExportAuditReportViewModels();

// ─── List contract ─────────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT: StrategyReviewExportAuditReportListApiContract =
  buildStrategyReviewExportAuditReportListApiContract(PHASE_47_VIEW_MODEL_LIST);

// ─── Detail contracts ──────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS: readonly StrategyReviewExportAuditReportDetailApiContract[] =
  PHASE_47_VIEW_MODEL_LIST.map(vm => buildStrategyReviewExportAuditReportDetailApiContract(vm));

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_MAP: ReadonlyMap<
  string,
  StrategyReviewExportAuditReportDetailApiContract
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.map(c => [c.data.viewModelId, c]),
);

// ─── Summary contract ──────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT: StrategyReviewExportAuditReportSummaryApiContract =
  buildStrategyReviewExportAuditReportSummaryApiContract(PHASE_47_VIEW_MODEL_LIST);

// ─── Error contracts ───────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT: StrategyReviewExportAuditReportErrorApiContract =
  buildStrategyReviewExportAuditReportErrorApiContract({
    contractName: 'strategy-review-export-audit-report-error-not-found-contract',
    statusCode: 404,
    errorCode: 'STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_CONTRACT_NOT_FOUND',
    errorMessage:
      'No strategy review export audit report API contract found for the given view model ID. ' +
      'This is a fixture-only, deterministic error contract. ' +
      'No real request handling is performed.',
    endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts/:viewModelId',
    details: 'Only Phase 47 view model IDs are valid in fixture-only mode.',
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT: StrategyReviewExportAuditReportErrorApiContract =
  buildStrategyReviewExportAuditReportErrorApiContract({
    contractName: 'strategy-review-export-audit-report-error-invalid-id-contract',
    statusCode: 422,
    errorCode: 'STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_CONTRACT_INVALID_ID',
    errorMessage:
      'The provided view model ID is invalid or malformed. ' +
      'This is a fixture-only, deterministic error contract. ' +
      'No real request handling is performed.',
    endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts/:viewModelId',
    details: 'View model IDs must be non-empty strings matching Phase 47 view model IDs.',
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS: readonly StrategyReviewExportAuditReportErrorApiContract[] =
  [
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
  ];

// ─── Combined fixture map and list ─────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS: readonly StrategyReviewExportAuditReportApiContract[] =
  [
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS,
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
    ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS,
  ];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP: ReadonlyMap<
  string,
  StrategyReviewExportAuditReportApiContract
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.map(c => [c.contractName, c]),
);

// Validate counts are consistent
if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.length
) {
  throw new Error(
    `Phase 48 detail contract count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length} detail contracts, ` +
      `received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.length}`,
  );
}

// ─── List and get helpers ──────────────────────────────────────────────────────

export function listStrategyReviewExportAuditReportApiContracts(): readonly StrategyReviewExportAuditReportApiContract[] {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS;
}

export function getStrategyReviewExportAuditReportApiContract(
  contractName: string,
): StrategyReviewExportAuditReportApiContract | null {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP.get(contractName) ?? null;
}

export function getStrategyReviewExportAuditReportDetailApiContractByViewModelId(
  viewModelId: string,
): StrategyReviewExportAuditReportDetailApiContract | null {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_MAP.get(viewModelId) ?? null;
}

// ─── Re-export source view model references (for test verification) ────────────

export {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP,
};
export type { StrategyReviewExportAuditReportViewModelName };
