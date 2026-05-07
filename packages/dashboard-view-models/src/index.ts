export type {
  DashboardStatusViewModel,
  DashboardWarningViewModel,
  DashboardSafeErrorDetailViewModel,
  DashboardErrorStateViewModel,
  DashboardEmptyStateViewModel,
  DashboardLoadingStateViewModel,
  DashboardViewModelMeta,
  DashboardPanelViewModel,
  DashboardSummaryViewModel,
  DashboardHealthViewModel,
  DashboardCapabilitiesViewModel,
  DashboardOverviewViewModel,
  DashboardEvidenceViewModel,
  DashboardSafetyViewModel,
  DashboardViewModel,
  DashboardAdapterOptions,
  DashboardAdapterInput,
  DashboardAdapterResult,
  DashboardBundleAdapterInput,
  KnownDashboardEndpoint,
  DashboardEnvelope,
  DashboardEnvelopeMeta,
} from './types.js';

export { DASHBOARD_ADAPTER_ERROR_CODES } from './errors.js';

export {
  buildDashboardErrorViewModel,
  buildDashboardEmptyViewModel,
  buildDashboardLoadingViewModel,
  isStatusError,
} from './view-models.js';

export {
  buildDashboardViewModel,
  buildHealthViewModel,
  buildCapabilitiesViewModel,
  buildDashboardOverviewViewModel,
  buildEvidenceViewModel,
  buildSafetyViewModel,
  adaptReadOnlyApiEnvelopeToViewModel,
  validateDashboardViewModel,
} from './adapter.js';
