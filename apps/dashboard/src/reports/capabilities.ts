/**
 * apps/dashboard/src/reports/capabilities.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1 — Capabilities
 */

import type { DashboardReportCapabilities } from './types.js';

export function getDashboardReportCapabilities(): DashboardReportCapabilities {
  return {
    dashboardReportModels: true,
    dashboardReportFixtures: true,
    deterministicReportModels: true,
    reportSafetyValidation: true,
    fixtureBackedReports: true,
    dashboardReportFileExport: false,
    dashboardReportPersistence: false,
    dashboardReportExternalNetwork: false,
    dashboardReportLiveData: false,
    dashboardReportMutationControls: false,
  };
}
