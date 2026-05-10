/**
 * Phase 49 — Strategy Review Export Audit Report API Contract Selectors v1: fixtures.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
} from '../strategy-review-export-audit-report-contracts/index.js';
import { buildStrategyReviewExportAuditReportApiContractSelectorFixture } from './builders.js';
import type {
  StrategyReviewExportAuditReportApiContractSelector,
  StrategyReviewExportAuditReportApiContractSelectorName,
} from './types.js';

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR =
  buildStrategyReviewExportAuditReportApiContractSelectorFixture({
    selectorName: 'strategy-review-export-audit-report-list-contract-selector',
    selectorKind: 'list',
    contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.map(contract =>
    buildStrategyReviewExportAuditReportApiContractSelectorFixture({
      selectorName: `strategy-review-export-audit-report-detail-contract-selector-${contract.data.viewModelId}`,
      selectorKind: 'detail',
      contract,
    }),
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTOR_MAP: ReadonlyMap<
  string,
  StrategyReviewExportAuditReportApiContractSelector
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS.map(selector => [
    selector.sourceViewModelIds[0] ?? selector.selectorName,
    selector,
  ]),
);

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR =
  buildStrategyReviewExportAuditReportApiContractSelectorFixture({
    selectorName: 'strategy-review-export-audit-report-summary-contract-selector',
    selectorKind: 'summary',
    contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT_SELECTOR =
  buildStrategyReviewExportAuditReportApiContractSelectorFixture({
    selectorName: 'strategy-review-export-audit-report-error-not-found-contract-selector',
    selectorKind: 'error',
    contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT_SELECTOR =
  buildStrategyReviewExportAuditReportApiContractSelectorFixture({
    selectorName: 'strategy-review-export-audit-report-error-invalid-id-contract-selector',
    selectorKind: 'error',
    contract: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS = [
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT_SELECTOR,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT_SELECTOR,
] as const satisfies readonly StrategyReviewExportAuditReportApiContractSelector[];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS = [
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
  ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR,
  ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS,
] as const satisfies readonly StrategyReviewExportAuditReportApiContractSelector[];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_NAMES =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.map(
    selector => selector.selectorName,
  ) as readonly StrategyReviewExportAuditReportApiContractSelectorName[];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTOR_MAP: ReadonlyMap<
  StrategyReviewExportAuditReportApiContractSelectorName,
  StrategyReviewExportAuditReportApiContractSelector
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.map(selector => [
    selector.selectorName,
    selector,
  ]),
);

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.length
) {
  throw new Error(
    `Phase 49 detail selector count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS.length}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS.length
) {
  throw new Error(
    `Phase 49 error selector count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS.length}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.length
) {
  throw new Error(
    `Phase 49 selector count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.length}`,
  );
}
