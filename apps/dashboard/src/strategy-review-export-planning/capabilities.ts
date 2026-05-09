/**
 * Phase 43 — Strategy Review Report Export Planning Fixtures v1: capabilities.
 */

import type { StrategyReviewExportPlanCapabilities } from './types.js';

export function getStrategyReviewExportPlanCapabilities(): StrategyReviewExportPlanCapabilities {
  return {
    strategyReviewExportPlanningFixtures: true,
    syntheticStrategyReviewExportPlans: true,
    strategyReviewExportPlanBuilders: true,
    strategyReviewExportPlanSafetyValidation: true,
    strategyReviewSerializationPreviewReferences: true,
    strategyReviewActualFileExport: false,
    strategyReviewFilesystemWrites: false,
    strategyReviewDownloadSupport: false,
    strategyReviewPdfGeneration: false,
    strategyReviewCsvGeneration: false,
    strategyReviewHtmlGeneration: false,
    strategyReviewExportExternalNetwork: false,
    strategyReviewExportPersistence: false,
    strategyReviewExportExecution: false,
    strategyReviewExportTradingSignals: false,
    strategyReviewExportInvestmentAdvice: false,
  };
}
