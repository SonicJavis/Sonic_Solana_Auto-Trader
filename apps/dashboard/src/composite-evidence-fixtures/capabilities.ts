/**
 * apps/dashboard/src/composite-evidence-fixtures/capabilities.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Capabilities
 */

import type { CompositeEvidenceDashboardReportFixtureCapabilities } from './types.js';

export function getCompositeEvidenceDashboardReportFixtureCapabilities(): CompositeEvidenceDashboardReportFixtureCapabilities {
  return {
    compositeEvidenceDashboardFixtures: true,
    compositeEvidenceReportFixtures: true,
    compositeEvidenceDashboardReportFixtures: true,
    compositeEvidenceFixtureBuilders: true,
    compositeEvidenceFixtureSafetyValidation: true,
    compositeEvidenceFixtureLiveData: false,
    compositeEvidenceFixtureSolanaRpc: false,
    compositeEvidenceFixtureExternalNetwork: false,
    compositeEvidenceFixtureTradingSignals: false,
    compositeEvidenceFixtureInvestmentAdvice: false,
    compositeEvidenceFixtureExecution: false,
    compositeEvidenceFixturePersistence: false,
    compositeEvidenceFixtureFileExport: false,
    compositeEvidenceFixtureDownloadSupport: false,
  };
}
