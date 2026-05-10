/**
 * Phase 51 — Strategy Review Export Audit Report Selector View Model API Contracts v1: fixtures.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
  type StrategyReviewExportAuditReportSelectorViewModelName,
} from '../strategy-review-export-audit-report-selector-view-models/index.js';
import {
  buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract,
  buildStrategyReviewExportAuditReportSelectorViewModelErrorApiContract,
  buildStrategyReviewExportAuditReportSelectorViewModelListApiContract,
  buildStrategyReviewExportAuditReportSelectorViewModelSummaryApiContract,
} from './builders.js';
import type {
  StrategyReviewExportAuditReportSelectorViewModelApiContract,
  StrategyReviewExportAuditReportSelectorViewModelApiContractName,
  StrategyReviewExportAuditReportSelectorViewModelDetailApiContract,
} from './types.js';

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT =
  buildStrategyReviewExportAuditReportSelectorViewModelListApiContract(
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(selectorViewModel =>
    buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract(selectorViewModel),
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACT_MAP: ReadonlyMap<
  string,
  StrategyReviewExportAuditReportSelectorViewModelDetailApiContract
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS.map(contract => [
    contract.sourceSelectorViewModelIds[0],
    contract,
  ]),
);

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT =
  buildStrategyReviewExportAuditReportSelectorViewModelSummaryApiContract(
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_NOT_FOUND_API_CONTRACT =
  buildStrategyReviewExportAuditReportSelectorViewModelErrorApiContract({
    contractName: 'strategy-review-export-audit-report-selector-view-model-error-not-found-api-contract',
    statusCode: 404,
    errorCode: 'STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_NOT_FOUND',
    errorMessage:
      'No selector view model API contract exists for the provided selector view model ID. ' +
      'This is deterministic fixture-only contract data. No runtime request handling is performed.',
    endpointPattern:
      '/api/v1/strategy-review-export-audit-report-selector-view-model-contracts/:selectorViewModelId',
    details: 'Only Phase 50 selector view model IDs are valid in this fixture-only contract surface.',
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_INVALID_ID_API_CONTRACT =
  buildStrategyReviewExportAuditReportSelectorViewModelErrorApiContract({
    contractName: 'strategy-review-export-audit-report-selector-view-model-error-invalid-id-api-contract',
    statusCode: 422,
    errorCode: 'STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_INVALID_ID',
    errorMessage:
      'The selector view model ID is invalid or malformed. ' +
      'This is deterministic fixture-only contract data. No runtime request handling is performed.',
    endpointPattern:
      '/api/v1/strategy-review-export-audit-report-selector-view-model-contracts/:selectorViewModelId',
    details: 'Selector view model IDs must be non-empty strings matching Phase 50 selector view model IDs.',
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_API_CONTRACTS = [
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_NOT_FOUND_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_INVALID_ID_API_CONTRACT,
] as const;

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS = [
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT,
  ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT,
  ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_API_CONTRACTS,
] as const satisfies readonly StrategyReviewExportAuditReportSelectorViewModelApiContract[];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_MAP: ReadonlyMap<
  StrategyReviewExportAuditReportSelectorViewModelApiContractName,
  StrategyReviewExportAuditReportSelectorViewModelApiContract
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.map(contract => [
    contract.contractName,
    contract,
  ]),
);

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length
) {
  throw new Error(
    `Phase 51 detail contract count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS.length}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT.data.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length
) {
  throw new Error(
    `Phase 51 list contract selector count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT.data.length}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT.data
    .totalSelectorViewModels !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length
) {
  throw new Error(
    `Phase 51 summary selector count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT.data.totalSelectorViewModels}`,
  );
}

if (
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.length !==
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length + 4
) {
  throw new Error(
    `Phase 51 total contract count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length + 4}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.length}`,
  );
}

export function listStrategyReviewExportAuditReportSelectorViewModelApiContracts(): readonly StrategyReviewExportAuditReportSelectorViewModelApiContract[] {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS;
}

export function getStrategyReviewExportAuditReportSelectorViewModelApiContract(
  contractName: string,
): StrategyReviewExportAuditReportSelectorViewModelApiContract | null {
  return (
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_MAP.get(
      contractName as StrategyReviewExportAuditReportSelectorViewModelApiContractName,
    ) ?? null
  );
}

export function getStrategyReviewExportAuditReportSelectorViewModelDetailApiContractBySourceViewModelId(
  selectorViewModelId: string,
): StrategyReviewExportAuditReportSelectorViewModelDetailApiContract | null {
  return (
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACT_MAP.get(
      selectorViewModelId,
    ) ?? null
  );
}

export {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
};

export type { StrategyReviewExportAuditReportSelectorViewModelName };
