/**
 * Phase 42 — Strategy Review Serialization Preview Fixtures v1: capabilities.
 */

import type { StrategyReviewSerializationPreviewCapabilities } from './types.js';

export function getStrategyReviewSerializationPreviewCapabilities(): StrategyReviewSerializationPreviewCapabilities {
  return {
    strategyReviewSerializationPreviewFixtures: true,
    syntheticStrategyReviewSerializationPreviews: true,
    strategyReviewSerializationPreviewBuilders: true,
    strategyReviewSerializationSafetyValidation: true,
    strategyReviewReportReferences: true,
    strategyReviewJsonPreview: true,
    strategyReviewMarkdownPreview: true,
    strategyReviewTextPreview: true,
    strategyReviewMetadataPreview: true,
    strategyReviewActualFileExport: false,
    strategyReviewDownloadSupport: false,
    strategyReviewSerializationExternalNetwork: false,
    strategyReviewSerializationPersistence: false,
    strategyReviewSerializationExecution: false,
    strategyReviewSerializationTradingSignals: false,
    strategyReviewSerializationInvestmentAdvice: false,
  };
}
