/**
 * Phase 50 — Strategy Review Export Audit Report Selector View Models v1: fixtures.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR,
} from '../strategy-review-export-audit-report-contract-selectors/index.js';
import {
  buildStrategyReviewExportAuditReportSelectorDetailViewModel,
  buildStrategyReviewExportAuditReportSelectorErrorViewModel,
  buildStrategyReviewExportAuditReportSelectorListViewModel,
  buildStrategyReviewExportAuditReportSelectorSummaryViewModel,
} from './builders.js';
import type {
  StrategyReviewExportAuditReportSelectorViewModel,
  StrategyReviewExportAuditReportSelectorViewModelName,
} from './types.js';

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL =
  buildStrategyReviewExportAuditReportSelectorListViewModel({
    sourceSelector: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT_SELECTOR,
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_SELECTOR_VIEW_MODELS =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS.map(sourceSelector =>
    buildStrategyReviewExportAuditReportSelectorDetailViewModel({ sourceSelector }),
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_SELECTOR_VIEW_MODEL =
  buildStrategyReviewExportAuditReportSelectorSummaryViewModel({
    sourceSelector: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT_SELECTOR,
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_SELECTOR_VIEW_MODELS =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS.map(sourceSelector =>
    buildStrategyReviewExportAuditReportSelectorErrorViewModel({ sourceSelector }),
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS = [
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_SELECTOR_VIEW_MODEL,
  ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_SELECTOR_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_SELECTOR_VIEW_MODEL,
  ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_SELECTOR_VIEW_MODELS,
] as const satisfies readonly StrategyReviewExportAuditReportSelectorViewModel[];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_NAMES =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(
    viewModel => viewModel.viewModelName,
  ) as readonly StrategyReviewExportAuditReportSelectorViewModelName[];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP: ReadonlyMap<
  StrategyReviewExportAuditReportSelectorViewModelName,
  StrategyReviewExportAuditReportSelectorViewModel
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(viewModel => [
    viewModel.viewModelName,
    viewModel,
  ]),
);

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.length
) {
  throw new Error(
    `Phase 50 selector view-model count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_SELECTOR_VIEW_MODELS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS.length
) {
  throw new Error(
    `Phase 50 detail selector view-model count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_SELECTORS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_SELECTOR_VIEW_MODELS.length}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_SELECTOR_VIEW_MODELS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS.length
) {
  throw new Error(
    `Phase 50 error selector view-model count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACT_SELECTORS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_SELECTOR_VIEW_MODELS.length}`,
  );
}

export function listStrategyReviewExportAuditReportSelectorViewModels(): readonly StrategyReviewExportAuditReportSelectorViewModel[] {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS;
}

export function getStrategyReviewExportAuditReportSelectorViewModel(
  viewModelName: string,
): StrategyReviewExportAuditReportSelectorViewModel | null {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP.get(
    viewModelName as StrategyReviewExportAuditReportSelectorViewModelName,
  ) ?? null;
}
