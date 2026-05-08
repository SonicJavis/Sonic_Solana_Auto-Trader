/**
 * Phase 34 — Offline Intelligence Report Integration Models v1: capability helpers.
 */

import type { OfflineIntelligenceReportCapabilities } from './types.js';

export function getOfflineIntelligenceReportCapabilities(): OfflineIntelligenceReportCapabilities {
  return {
    offlineIntelligenceReportModels: true,
    offlineIntelligenceReportFixtures: true,
    offlineIntelligenceCompositeReportIntegration: true,
    offlineIntelligenceReportRiskSections: true,
    offlineIntelligenceReportQualitySections: true,
    offlineIntelligenceReportConfidenceSections: true,
    offlineIntelligenceReportSourceReferences: true,
    offlineIntelligenceReportSafetyValidation: true,
    offlineIntelligenceReportLiveData: false,
    offlineIntelligenceReportSolanaRpc: false,
    offlineIntelligenceReportProviderApis: false,
    offlineIntelligenceReportJitoIntegration: false,
    offlineIntelligenceReportMempoolAccess: false,
    offlineIntelligenceReportTradingSignals: false,
    offlineIntelligenceReportInvestmentAdvice: false,
    offlineIntelligenceReportExternalNetwork: false,
    offlineIntelligenceReportPersistence: false,
    offlineIntelligenceReportExecution: false,
    offlineIntelligenceReportFileExport: false,
    offlineIntelligenceReportDownloadSupport: false,
  };
}
