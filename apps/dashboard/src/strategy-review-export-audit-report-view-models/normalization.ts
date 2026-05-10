/**
 * Phase 47 — Strategy Review Export Audit Report View Models v1: normalization.
 */

import type {
  StrategyReviewExportAuditReportViewModel,
  StrategyReviewExportAuditReportViewModelKind,
  StrategyReviewExportAuditReportViewModelName,
  StrategyReviewExportAuditReportViewModelSeverity,
  StrategyReviewExportAuditReportViewModelStatus,
} from './types.js';
import {
  PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT,
  PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SEVERITIES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_STATUSES,
} from './types.js';

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, [key, next]) => {
        acc[key] = sortKeysDeep(next);
        return acc;
      }, {});
  }
  return value;
}

export function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function stableDeterministicChecksum(content: string): string {
  let hash = 2166136261;
  for (let i = 0; i < content.length; i += 1) {
    hash ^= content.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function isValidStrategyReviewExportAuditReportViewModelName(
  value: unknown,
): value is StrategyReviewExportAuditReportViewModelName {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportViewModelKind(
  value: unknown,
): value is StrategyReviewExportAuditReportViewModelKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportViewModelStatus(
  value: unknown,
): value is StrategyReviewExportAuditReportViewModelStatus {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_STATUSES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportViewModelSeverity(
  value: unknown,
): value is StrategyReviewExportAuditReportViewModelSeverity {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SEVERITIES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportViewModelGeneratedAt(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value === PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT
  );
}

export function isValidStrategyReviewExportAuditReportViewModelSource(value: unknown): boolean {
  return (
    typeof value === 'string' && value === PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE
  );
}

export function normalizeStrategyReviewExportAuditReportViewModel(
  viewModel: StrategyReviewExportAuditReportViewModel,
): StrategyReviewExportAuditReportViewModel {
  const summaryCards = [...viewModel.summaryCards].sort((a, b) => a.order - b.order);
  const detailSections = [...viewModel.detailSections]
    .map(section => ({ ...section, rows: [...section.rows].sort((a, b) => a.order - b.order) }))
    .sort((a, b) => a.order - b.order);
  const evidenceItems = [...viewModel.evidenceItems].sort((a, b) => a.order - b.order);
  const safetyBadges = [...viewModel.safetyBadges].sort((a, b) => a.order - b.order);
  const validationBadges = [...viewModel.validationBadges].sort((a, b) => a.order - b.order);

  return {
    ...viewModel,
    summaryCards,
    detailSections,
    evidenceItems,
    safetyBadges,
    validationBadges,
    limitationItems: [...viewModel.limitationItems],
    nextPhaseNotes: [...viewModel.nextPhaseNotes],
    listItem: { ...viewModel.listItem },
    detail: {
      ...viewModel.detail,
      detailSections,
      evidenceItems,
      limitationItems: [...viewModel.detail.limitationItems],
      nextPhaseNotes: [...viewModel.detail.nextPhaseNotes],
    },
    summary: {
      ...viewModel.summary,
      summaryCards,
      safetyBadges,
      validationBadges,
    },
  };
}

export function serializeStrategyReviewExportAuditReportViewModel(
  viewModel: StrategyReviewExportAuditReportViewModel,
): string {
  return stablePrettyJsonStringify(normalizeStrategyReviewExportAuditReportViewModel(viewModel));
}

export function areStrategyReviewExportAuditReportViewModelsEqual(
  a: StrategyReviewExportAuditReportViewModel,
  b: StrategyReviewExportAuditReportViewModel,
): boolean {
  return (
    serializeStrategyReviewExportAuditReportViewModel(a) ===
    serializeStrategyReviewExportAuditReportViewModel(b)
  );
}
