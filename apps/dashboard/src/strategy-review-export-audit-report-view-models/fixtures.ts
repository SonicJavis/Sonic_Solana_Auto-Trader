/**
 * Phase 47 — Strategy Review Export Audit Report View Models v1: fixtures.
 */

import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES,
} from '../strategy-review-export-audit-report/index.js';
import { buildStrategyReviewExportAuditReportViewModel } from './builders.js';
import type {
  StrategyReviewExportAuditReportViewModel,
  StrategyReviewExportAuditReportViewModelName,
} from './types.js';

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS: readonly StrategyReviewExportAuditReportViewModel[] =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES.map(sourceReportName => {
    const sourceReportFixture = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.get(sourceReportName);
    if (!sourceReportFixture) {
      throw new Error(`Missing Phase 46 source report fixture: ${sourceReportName}`);
    }
    return buildStrategyReviewExportAuditReportViewModel({ sourceReportFixture });
  });

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP: ReadonlyMap<
  StrategyReviewExportAuditReportViewModelName,
  StrategyReviewExportAuditReportViewModel
> = new Map(
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.map(viewModel => [viewModel.viewModelName, viewModel]),
);

if (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP.size !== STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.size) {
  throw new Error(
    `Phase 47 view model count mismatch: expected ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.size}, received ${STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP.size}`,
  );
}

export function listStrategyReviewExportAuditReportViewModels(): readonly StrategyReviewExportAuditReportViewModel[] {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES.map(sourceReportName => {
    const viewModelName = `${sourceReportName}-view-model` as StrategyReviewExportAuditReportViewModelName;
    const viewModel = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP.get(viewModelName);
    if (!viewModel) {
      throw new Error(`Missing Phase 47 view model: ${viewModelName}`);
    }
    return viewModel;
  });
}

export function getStrategyReviewExportAuditReportViewModel(
  viewModelName: string,
): StrategyReviewExportAuditReportViewModel | null {
  return STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP.get(
    viewModelName as StrategyReviewExportAuditReportViewModelName,
  ) ?? null;
}
