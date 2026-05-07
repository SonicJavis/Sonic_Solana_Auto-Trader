import type {
  ReadOnlyApiContractMeta,
  ReadOnlyApiEnvelope,
  ReadOnlyApiErrorCode,
  ReadOnlyApiMethod,
} from '@sonic/read-only-api-client';

export type DashboardStatusViewModel = 'ready' | 'empty' | 'loading' | 'error' | 'unavailable';

export interface DashboardWarningViewModel {
  readonly code: string;
  readonly message: string;
}

export interface DashboardSafeErrorDetailViewModel {
  readonly field: string;
  readonly reason: string;
}

export interface DashboardErrorStateViewModel {
  readonly status: 'error';
  readonly code: ReadOnlyApiErrorCode | 'DASHBOARD_ADAPTER_ERROR' | 'DASHBOARD_UNSUPPORTED_ENDPOINT';
  readonly message: string;
  readonly endpoint?: string;
  readonly method?: ReadOnlyApiMethod;
  readonly details: readonly DashboardSafeErrorDetailViewModel[];
}

export interface DashboardEmptyStateViewModel {
  readonly status: 'empty';
  readonly code: 'DASHBOARD_EMPTY';
  readonly message: string;
}

export interface DashboardLoadingStateViewModel {
  readonly status: 'loading';
  readonly code: 'DASHBOARD_LOADING';
  readonly message: string;
}

export interface DashboardViewModelMeta {
  readonly phase: 22;
  readonly apiMode: 'local_read_only';
  readonly deterministic: true;
  readonly mutating: false;
  readonly externalNetwork: false;
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly query?: Record<string, unknown>;
  readonly filters?: Record<string, unknown>;
  readonly sort?: Record<string, unknown>;
  readonly pagination?: Record<string, unknown>;
  readonly capabilities?: Record<string, boolean>;
}

export interface DashboardPanelViewModel {
  readonly panelId: string;
  readonly title: string;
  readonly status: DashboardStatusViewModel;
  readonly severity: string;
  readonly summary: string;
}

export interface DashboardSummaryViewModel {
  readonly totalPanels: number;
  readonly readyPanels: number;
  readonly emptyPanels: number;
  readonly errorPanels: number;
  readonly unavailablePanels: number;
  readonly warningCount: number;
  readonly errorCount: number;
}

export interface DashboardHealthViewModel {
  readonly endpoint: '/health';
  readonly method: 'GET';
  readonly status: DashboardStatusViewModel;
  readonly healthStatus: string;
  readonly message: string;
  readonly phaseLabel: string;
  readonly warnings: readonly DashboardWarningViewModel[];
  readonly error?: DashboardErrorStateViewModel;
  readonly meta: DashboardViewModelMeta;
}

export interface DashboardCapabilitiesViewModel {
  readonly endpoint: '/capabilities';
  readonly method: 'GET';
  readonly status: DashboardStatusViewModel;
  readonly capabilities: Readonly<Record<string, boolean>>;
  readonly unavailableCapabilityNames: readonly string[];
  readonly warnings: readonly DashboardWarningViewModel[];
  readonly error?: DashboardErrorStateViewModel;
  readonly meta: DashboardViewModelMeta;
}

export interface DashboardOverviewViewModel {
  readonly endpoint: '/dashboard';
  readonly method: 'GET';
  readonly status: DashboardStatusViewModel;
  readonly severity: string;
  readonly summaryText: string;
  readonly totalFindings: number;
  readonly panelsAvailable: readonly string[];
  readonly warnings: readonly DashboardWarningViewModel[];
  readonly error?: DashboardErrorStateViewModel;
  readonly meta: DashboardViewModelMeta;
}

export interface DashboardEvidenceViewModel {
  readonly endpoint: '/dashboard/evidence';
  readonly method: 'GET';
  readonly status: DashboardStatusViewModel;
  readonly entries: readonly Record<string, unknown>[];
  readonly totalEntries: number;
  readonly emptyState?: DashboardEmptyStateViewModel;
  readonly warnings: readonly DashboardWarningViewModel[];
  readonly error?: DashboardErrorStateViewModel;
  readonly meta: DashboardViewModelMeta;
}

export interface DashboardSafetyViewModel {
  readonly endpoint: '/dashboard/safety';
  readonly method: 'GET';
  readonly status: DashboardStatusViewModel;
  readonly safetyInvariantsSatisfied: boolean;
  readonly lockedCapabilityNames: readonly string[];
  readonly summaryText: string;
  readonly warnings: readonly DashboardWarningViewModel[];
  readonly error?: DashboardErrorStateViewModel;
  readonly meta: DashboardViewModelMeta;
}

export interface DashboardViewModel {
  readonly status: DashboardStatusViewModel;
  readonly summary: DashboardSummaryViewModel;
  readonly health: DashboardHealthViewModel;
  readonly capabilities: DashboardCapabilitiesViewModel;
  readonly overview: DashboardOverviewViewModel;
  readonly evidence: DashboardEvidenceViewModel;
  readonly safety: DashboardSafetyViewModel;
  readonly panels: readonly DashboardPanelViewModel[];
  readonly warnings: readonly DashboardWarningViewModel[];
  readonly errors: readonly DashboardErrorStateViewModel[];
}

export interface DashboardAdapterOptions {
  readonly unsupportedEndpointStatus?: DashboardStatusViewModel;
  readonly loadingMessage?: string;
}

export interface DashboardAdapterInput {
  readonly envelope: unknown;
  readonly endpoint?: string;
  readonly method?: ReadOnlyApiMethod;
  readonly options?: DashboardAdapterOptions;
}

export interface DashboardAdapterResult {
  readonly endpoint: string;
  readonly method: ReadOnlyApiMethod;
  readonly status: DashboardStatusViewModel;
  readonly viewModel:
    | DashboardHealthViewModel
    | DashboardCapabilitiesViewModel
    | DashboardOverviewViewModel
    | DashboardEvidenceViewModel
    | DashboardSafetyViewModel
    | DashboardErrorStateViewModel
    | DashboardEmptyStateViewModel
    | DashboardLoadingStateViewModel;
}

export interface DashboardBundleAdapterInput {
  readonly health: unknown;
  readonly capabilities: unknown;
  readonly dashboard: unknown;
  readonly evidence: unknown;
  readonly safety: unknown;
  readonly options?: DashboardAdapterOptions;
}

export type KnownDashboardEndpoint =
  | '/health'
  | '/capabilities'
  | '/dashboard'
  | '/dashboard/evidence'
  | '/dashboard/safety';

export type DashboardEnvelope = ReadOnlyApiEnvelope<unknown>;
export type DashboardEnvelopeMeta = ReadOnlyApiContractMeta;
