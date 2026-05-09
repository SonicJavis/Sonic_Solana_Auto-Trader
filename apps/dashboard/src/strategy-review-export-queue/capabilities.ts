/**
 * Phase 44 — Strategy Review Export Queue Fixtures v1: capabilities.
 */

import type { StrategyReviewExportQueueCapabilities } from './types.js';

export function getStrategyReviewExportQueueCapabilities(): StrategyReviewExportQueueCapabilities {
  return {
    strategyReviewExportQueueFixtures: true,
    syntheticStrategyReviewExportQueues: true,
    strategyReviewExportQueueBuilders: true,
    strategyReviewExportQueueSafetyValidation: true,
    strategyReviewExportPlanReferences: true,
    strategyReviewActualQueueWorkers: false,
    strategyReviewScheduledJobs: false,
    strategyReviewBackgroundJobs: false,
    strategyReviewActualFileExport: false,
    strategyReviewDownloadSupport: false,
    strategyReviewPdfGeneration: false,
    strategyReviewCsvGeneration: false,
    strategyReviewHtmlGeneration: false,
    strategyReviewExportQueueExternalNetwork: false,
    strategyReviewExportQueuePersistence: false,
    strategyReviewExportQueueExecution: false,
    strategyReviewExportQueueTradingSignals: false,
    strategyReviewExportQueueInvestmentAdvice: false,
  };
}
