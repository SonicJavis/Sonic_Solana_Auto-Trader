/**
 * Phase 50 — Strategy Review Export Audit Report Selector View Models v1: normalization.
 */

import type {
  StrategyReviewExportAuditReportSelectorViewModel,
  StrategyReviewExportAuditReportSelectorViewModelKind,
  StrategyReviewExportAuditReportSelectorViewModelName,
} from './types.js';
import {
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_GENERATED_AT,
  PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_KINDS,
} from './types.js';

export function stableDeterministicSelectorViewModelChecksum(content: string): string {
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

export function isValidStrategyReviewExportAuditReportSelectorViewModelName(
  value: unknown,
): value is StrategyReviewExportAuditReportSelectorViewModelName {
  if (typeof value !== 'string') {
    return false;
  }
  return (
    value === 'strategy-review-export-audit-report-selector-list-view-model' ||
    value === 'strategy-review-export-audit-report-selector-summary-view-model' ||
    value === 'strategy-review-export-audit-report-selector-error-not-found-view-model' ||
    value === 'strategy-review-export-audit-report-selector-error-invalid-id-view-model' ||
    value.startsWith('strategy-review-export-audit-report-selector-detail-view-model-')
  );
}

export function isValidStrategyReviewExportAuditReportSelectorViewModelKind(
  value: unknown,
): value is StrategyReviewExportAuditReportSelectorViewModelKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportSelectorViewModelGeneratedAt(
  value: unknown,
): boolean {
  return value === PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_GENERATED_AT;
}

export function isValidStrategyReviewExportAuditReportSelectorViewModelSource(
  value: unknown,
): boolean {
  return value === PHASE_50_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SOURCE;
}

export function normalizeStrategyReviewExportAuditReportSelectorViewModel(
  viewModel: StrategyReviewExportAuditReportSelectorViewModel,
): StrategyReviewExportAuditReportSelectorViewModel {
  return {
    ...viewModel,
    sourceContractIds: [...viewModel.sourceContractIds].sort((left, right) => left.localeCompare(right)),
    sourceViewModelIds: [...viewModel.sourceViewModelIds].sort((left, right) => left.localeCompare(right)),
    sourceReportIds: [...viewModel.sourceReportIds].sort((left, right) => left.localeCompare(right)),
    sourceAuditIds: [...viewModel.sourceAuditIds].sort((left, right) => left.localeCompare(right)),
    queryPanel: {
      ...viewModel.queryPanel,
      filterLabels: [...viewModel.queryPanel.filterLabels].sort((left, right) => left.localeCompare(right)),
    },
    summaryCards: [...viewModel.summaryCards].sort((left, right) => left.order - right.order),
    detailRows: [...viewModel.detailRows].sort((left, right) => left.order - right.order),
    safetyBadges: [...viewModel.safetyBadges].sort((left, right) => left.order - right.order),
    validationBadges: [...viewModel.validationBadges].sort((left, right) => left.order - right.order),
    limitationItems: [...viewModel.limitationItems],
    nextPhaseNotes: [...viewModel.nextPhaseNotes],
  };
}

export function serializeStrategyReviewExportAuditReportSelectorViewModel(
  viewModel: StrategyReviewExportAuditReportSelectorViewModel,
): string {
  return stablePrettyJsonStringify(
    normalizeStrategyReviewExportAuditReportSelectorViewModel(viewModel),
  );
}

export function areStrategyReviewExportAuditReportSelectorViewModelsEqual(
  left: StrategyReviewExportAuditReportSelectorViewModel,
  right: StrategyReviewExportAuditReportSelectorViewModel,
): boolean {
  return (
    serializeStrategyReviewExportAuditReportSelectorViewModel(left) ===
    serializeStrategyReviewExportAuditReportSelectorViewModel(right)
  );
}
