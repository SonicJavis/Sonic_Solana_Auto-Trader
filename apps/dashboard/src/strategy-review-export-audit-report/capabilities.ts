/**
 * Phase 46 — Strategy Review Export Audit Report Fixtures v1: capabilities.
 */

import type { StrategyReviewExportAuditReportCapabilityFlags } from './types.js';

export function getStrategyReviewExportAuditReportCapabilities(): StrategyReviewExportAuditReportCapabilityFlags {
  return {
    strategyReviewExportAuditReportFixtures: true,
    syntheticStrategyReviewExportAuditReports: true,
    deterministicStrategyReviewExportAuditReports: true,
    localOnlyStrategyReviewExportAuditReports: true,
    readOnlyStrategyReviewExportAuditReports: true,
    strategyReviewActualAuditReports: false,
    strategyReviewReportDownloads: false,
    strategyReviewReportPdfGeneration: false,
    strategyReviewReportCsvGeneration: false,
    strategyReviewReportHtmlGeneration: false,
    strategyReviewReportFilesystemWrites: false,
    strategyReviewReportPersistence: false,
    strategyReviewReportBackgroundJobs: false,
    strategyReviewReportScheduledJobs: false,
    strategyReviewReportLiveData: false,
    strategyReviewReportNetworkAccess: false,
    strategyReviewReportTradingSignals: false,
    strategyReviewReportRecommendations: false,
    strategyReviewReportInvestmentAdvice: false,
    strategyReviewReportExecution: false,
  };
}
