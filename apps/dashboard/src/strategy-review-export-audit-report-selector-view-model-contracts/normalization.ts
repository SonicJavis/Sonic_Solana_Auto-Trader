/**
 * Phase 51 — Strategy Review Export Audit Report Selector View Model API Contracts v1: normalization.
 */

import type {
  StrategyReviewExportAuditReportSelectorViewModelApiContract,
  StrategyReviewExportAuditReportSelectorViewModelApiContractKind,
  StrategyReviewExportAuditReportSelectorViewModelApiContractName,
} from './types.js';
import {
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_GENERATED_AT,
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_KINDS,
} from './types.js';

export function stableDeterministicSelectorViewModelApiContractChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((accumulator, [key, nextValue]) => {
        accumulator[key] = sortKeysDeep(nextValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidStrategyReviewExportAuditReportSelectorViewModelApiContractName(
  value: unknown,
): value is StrategyReviewExportAuditReportSelectorViewModelApiContractName {
  if (typeof value !== 'string') {
    return false;
  }
  return (
    value === 'strategy-review-export-audit-report-selector-view-model-list-api-contract' ||
    value === 'strategy-review-export-audit-report-selector-view-model-summary-api-contract' ||
    value === 'strategy-review-export-audit-report-selector-view-model-error-not-found-api-contract' ||
    value === 'strategy-review-export-audit-report-selector-view-model-error-invalid-id-api-contract' ||
    value.startsWith('strategy-review-export-audit-report-selector-view-model-detail-api-contract-')
  );
}

export function isValidStrategyReviewExportAuditReportSelectorViewModelApiContractKind(
  value: unknown,
): value is StrategyReviewExportAuditReportSelectorViewModelApiContractKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportSelectorViewModelApiContractGeneratedAt(
  value: unknown,
): boolean {
  return value === PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_GENERATED_AT;
}

export function isValidStrategyReviewExportAuditReportSelectorViewModelApiContractSource(
  value: unknown,
): boolean {
  return value === PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_SOURCE;
}

export function normalizeStrategyReviewExportAuditReportSelectorViewModelApiContract(
  contract: StrategyReviewExportAuditReportSelectorViewModelApiContract,
): StrategyReviewExportAuditReportSelectorViewModelApiContract {
  const normalizedBase: StrategyReviewExportAuditReportSelectorViewModelApiContract = {
    ...contract,
    sourceSelectorViewModelIds: [...contract.sourceSelectorViewModelIds].sort((left, right) =>
      left.localeCompare(right),
    ),
    sourceSelectorIds: [...contract.sourceSelectorIds].sort((left, right) => left.localeCompare(right)),
    sourceContractIds: [...contract.sourceContractIds].sort((left, right) => left.localeCompare(right)),
  } as StrategyReviewExportAuditReportSelectorViewModelApiContract;

  if (normalizedBase.contractKind === 'list') {
    return {
      ...normalizedBase,
      data: [...normalizedBase.data].sort((left, right) =>
        left.selectorViewModelName.localeCompare(right.selectorViewModelName),
      ),
      filters: [...normalizedBase.filters].sort((left, right) => left.field.localeCompare(right.field)),
      sorts: [...normalizedBase.sorts].sort((left, right) => left.field.localeCompare(right.field)),
    };
  }

  if (normalizedBase.contractKind === 'detail') {
    return {
      ...normalizedBase,
      sourceContractIds: [...normalizedBase.sourceContractIds].sort((left, right) =>
        left.localeCompare(right),
      ),
      data: {
        ...normalizedBase.data,
        selectorViewModel: {
          ...normalizedBase.data.selectorViewModel,
          sourceContractIds: [...normalizedBase.data.selectorViewModel.sourceContractIds].sort((left, right) =>
            left.localeCompare(right),
          ),
          sourceViewModelIds: [...normalizedBase.data.selectorViewModel.sourceViewModelIds].sort((left, right) =>
            left.localeCompare(right),
          ),
          sourceReportIds: [...normalizedBase.data.selectorViewModel.sourceReportIds].sort((left, right) =>
            left.localeCompare(right),
          ),
          sourceAuditIds: [...normalizedBase.data.selectorViewModel.sourceAuditIds].sort((left, right) =>
            left.localeCompare(right),
          ),
          summaryCards: [...normalizedBase.data.selectorViewModel.summaryCards].sort((left, right) =>
            left.order - right.order,
          ),
          detailRows: [...normalizedBase.data.selectorViewModel.detailRows].sort((left, right) =>
            left.order - right.order,
          ),
          safetyBadges: [...normalizedBase.data.selectorViewModel.safetyBadges].sort((left, right) =>
            left.order - right.order,
          ),
          validationBadges: [...normalizedBase.data.selectorViewModel.validationBadges].sort((left, right) =>
            left.order - right.order,
          ),
          queryPanel: {
            ...normalizedBase.data.selectorViewModel.queryPanel,
            filterLabels: [...normalizedBase.data.selectorViewModel.queryPanel.filterLabels].sort((left, right) =>
              left.localeCompare(right),
            ),
          },
        },
      },
    };
  }

  if (normalizedBase.contractKind === 'summary') {
    return {
      ...normalizedBase,
      data: {
        ...normalizedBase.data,
        byKind: [...normalizedBase.data.byKind].sort((left, right) =>
          left.kind.localeCompare(right.kind),
        ),
        byStatus: [...normalizedBase.data.byStatus].sort((left, right) =>
          left.status.localeCompare(right.status),
        ),
        byMatched: [...normalizedBase.data.byMatched].sort((left, right) =>
          left.matched.localeCompare(right.matched),
        ),
      },
    };
  }

  return normalizedBase;
}

export function serializeStrategyReviewExportAuditReportSelectorViewModelApiContract(
  contract: StrategyReviewExportAuditReportSelectorViewModelApiContract,
): string {
  return stablePrettyJsonStringify(
    normalizeStrategyReviewExportAuditReportSelectorViewModelApiContract(contract),
  );
}

export function areStrategyReviewExportAuditReportSelectorViewModelApiContractsEqual(
  left: StrategyReviewExportAuditReportSelectorViewModelApiContract,
  right: StrategyReviewExportAuditReportSelectorViewModelApiContract,
): boolean {
  return (
    serializeStrategyReviewExportAuditReportSelectorViewModelApiContract(left) ===
    serializeStrategyReviewExportAuditReportSelectorViewModelApiContract(right)
  );
}
