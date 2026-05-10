/**
 * Phase 49 — Strategy Review Export Audit Report API Contract Selectors v1: selector helpers.
 */

import {
  getStrategyReviewExportAuditReportDetailApiContractByViewModelId,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
  type StrategyReviewExportAuditReportDetailApiContract,
  type StrategyReviewExportAuditReportErrorApiContract,
  type StrategyReviewExportAuditReportListApiContract,
  type StrategyReviewExportAuditReportSummaryApiContract,
} from '../strategy-review-export-audit-report-contracts/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_MAP,
} from './fixtures.js';
import type {
  StrategyReviewExportAuditReportApiContractSelector,
  StrategyReviewExportAuditReportApiContractSelectorName,
} from './types.js';

export function listStrategyReviewExportAuditReportApiContractSelectors(): readonly StrategyReviewExportAuditReportApiContractSelector[] {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS;
}

export function getStrategyReviewExportAuditReportApiContractSelector(
  selectorName: string,
): StrategyReviewExportAuditReportApiContractSelector | null {
  return (
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_MAP.get(
      selectorName as StrategyReviewExportAuditReportApiContractSelectorName,
    ) ?? null
  );
}

export function selectStrategyReviewExportAuditReportListApiContract(): StrategyReviewExportAuditReportListApiContract {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT;
}

export function selectStrategyReviewExportAuditReportDetailApiContract(
  viewModelId: string,
): StrategyReviewExportAuditReportDetailApiContract | StrategyReviewExportAuditReportErrorApiContract {
  if (typeof viewModelId !== 'string' || viewModelId.trim() === '') {
    return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT;
  }
  return (
    getStrategyReviewExportAuditReportDetailApiContractByViewModelId(viewModelId) ??
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT
  );
}

export function selectStrategyReviewExportAuditReportSummaryApiContract(): StrategyReviewExportAuditReportSummaryApiContract {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT;
}

export function selectStrategyReviewExportAuditReportErrorApiContract(
  errorSelector:
    | 'not-found'
    | 'invalid-id'
    | 'strategy-review-export-audit-report-error-not-found-contract'
    | 'strategy-review-export-audit-report-error-invalid-id-contract' = 'not-found',
): StrategyReviewExportAuditReportErrorApiContract {
  if (
    errorSelector === 'invalid-id' ||
    errorSelector === 'strategy-review-export-audit-report-error-invalid-id-contract'
  ) {
    return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT;
  }
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT;
}
