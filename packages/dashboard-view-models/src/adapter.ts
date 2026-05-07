import {
  PHASE_22_GENERATED_AT,
  buildReadOnlyApiContractMeta,
  type ReadOnlyApiMethod,
} from '@sonic/read-only-api';
import {
  isReadOnlyApiErrorEnvelope,
  isReadOnlyApiSuccessEnvelope,
  parseReadOnlyApiEnvelope,
  type ReadOnlyApiContractMeta,
} from '@sonic/read-only-api-client';
import { DASHBOARD_ADAPTER_ERROR_CODES } from './errors.js';
import {
  buildDashboardEmptyViewModel,
  buildDashboardErrorViewModel,
  buildDashboardLoadingViewModel,
} from './view-models.js';
import type {
  DashboardAdapterInput,
  DashboardAdapterResult,
  DashboardBundleAdapterInput,
  DashboardCapabilitiesViewModel,
  DashboardEnvelope,
  DashboardErrorStateViewModel,
  DashboardEvidenceViewModel,
  DashboardHealthViewModel,
  DashboardOverviewViewModel,
  DashboardPanelViewModel,
  DashboardSafetyViewModel,
  DashboardStatusViewModel,
  DashboardSummaryViewModel,
  DashboardViewModel,
  DashboardViewModelMeta,
  DashboardWarningViewModel,
  KnownDashboardEndpoint,
} from './types.js';

const SUPPORTED_ENDPOINTS: readonly KnownDashboardEndpoint[] = [
  '/health',
  '/capabilities',
  '/dashboard',
  '/dashboard/evidence',
  '/dashboard/safety',
];

const FORBIDDEN_MESSAGE_PATTERNS = [/\bat\s.+\(.+\)/, /\/home\//i, /[A-Z]:\\Users\\/i, /private[_ -]?key/i, /seed[_ -]?phrase/i, /mnemonic/i, /apikey/i, /secret/i];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeMessage(message: unknown): string {
  const raw = typeof message === 'string' ? message : 'Unknown adapter error.';
  return FORBIDDEN_MESSAGE_PATTERNS.some(pattern => pattern.test(raw))
    ? 'A sanitized dashboard adapter error occurred.'
    : raw;
}

function sanitizeDetails(details: unknown): readonly { readonly field: string; readonly reason: string }[] {
  if (!Array.isArray(details)) return [];
  return details.map(item => {
    if (!isRecord(item)) {
      return { field: 'unknown', reason: 'Malformed error detail.' };
    }
    return {
      field: typeof item['field'] === 'string' ? item['field'] : 'unknown',
      reason: sanitizeMessage(item['reason']),
    };
  });
}

function toMeta(meta: ReadOnlyApiContractMeta | undefined): DashboardViewModelMeta {
  const fallback = buildReadOnlyApiContractMeta();
  const source = meta ?? fallback;
  return {
    phase: 22,
    apiMode: 'local_read_only',
    deterministic: true,
    mutating: false,
    externalNetwork: false,
    generatedAt: typeof source.generatedAt === 'string' ? source.generatedAt : PHASE_22_GENERATED_AT,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    localOnly: true,
    query: isRecord(source.query) ? source.query : undefined,
    filters: isRecord(source.filters) ? source.filters : undefined,
    sort: isRecord(source.sort) ? source.sort : undefined,
    pagination: isRecord(source.pagination) ? source.pagination : undefined,
    capabilities: isRecord(source.capabilities)
      ? Object.fromEntries(
          Object.entries(source.capabilities).filter(([, value]) => typeof value === 'boolean'),
        )
      : undefined,
  };
}

function toWarnings(warnings: unknown): readonly DashboardWarningViewModel[] {
  if (!Array.isArray(warnings)) return [];
  return warnings
    .filter((value): value is string => typeof value === 'string')
    .map((message, index) => ({ code: `warning_${index}`, message: sanitizeMessage(message) }));
}

function buildUnsupportedEndpointError(endpoint: string, method: ReadOnlyApiMethod): DashboardErrorStateViewModel {
  return buildDashboardErrorViewModel({
    code: DASHBOARD_ADAPTER_ERROR_CODES.UNSUPPORTED_ENDPOINT,
    message: 'Dashboard adapter does not support this endpoint.',
    endpoint,
    method,
    details: [{ field: 'endpoint', reason: 'Unsupported endpoint for dashboard adapter.' }],
  });
}

function resolveStatusFromEnvelope(envelope: DashboardEnvelope | undefined): DashboardStatusViewModel {
  if (!envelope) return 'error';
  if (envelope.ok) return 'ready';
  return 'error';
}

function buildErrorFromEnvelope(envelope: unknown, endpoint: string, method: ReadOnlyApiMethod): DashboardErrorStateViewModel {
  if (isReadOnlyApiErrorEnvelope(envelope)) {
    return buildDashboardErrorViewModel({
      code: envelope.error.code,
      message: sanitizeMessage(envelope.error.message),
      endpoint: envelope.endpoint,
      method: envelope.method,
      details: sanitizeDetails(envelope.error.details),
    });
  }
  return buildDashboardErrorViewModel({
    code: DASHBOARD_ADAPTER_ERROR_CODES.INVALID_INPUT,
    message: 'Invalid dashboard adapter input.',
    endpoint,
    method,
    details: [{ field: 'envelope', reason: 'Malformed envelope shape.' }],
  });
}

function getEndpoint(input: DashboardAdapterInput): string {
  if (typeof input.endpoint === 'string' && input.endpoint.length > 0) return input.endpoint;
  if (isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope)) {
    return input.envelope.endpoint;
  }
  return '/dashboard';
}

function getMethod(input: DashboardAdapterInput): ReadOnlyApiMethod {
  if (input.method === 'GET') return 'GET';
  if (isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope)) {
    return input.envelope.method;
  }
  return 'GET';
}

function isKnownDashboardEndpoint(endpoint: string): endpoint is KnownDashboardEndpoint {
  return SUPPORTED_ENDPOINTS.includes(endpoint as KnownDashboardEndpoint);
}

function getSuccessData(envelope: unknown): Record<string, unknown> {
  if (!isReadOnlyApiSuccessEnvelope(envelope)) return {};
  return isRecord(envelope.data) ? envelope.data : {};
}

export function buildHealthViewModel(input: DashboardAdapterInput): DashboardHealthViewModel {
  const endpoint: '/health' = '/health';
  const method: 'GET' = 'GET';
  const meta = isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope)
    ? toMeta(input.envelope.meta)
    : toMeta(undefined);
  const warnings = isReadOnlyApiSuccessEnvelope(input.envelope) ? toWarnings(input.envelope.warnings) : [];
  const data = getSuccessData(input.envelope);
  const status = resolveStatusFromEnvelope(
    (isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope))
      ? input.envelope
      : undefined,
  );
  return {
    endpoint,
    method,
    status,
    healthStatus: typeof data['status'] === 'string' ? data['status'] : 'unavailable',
    message: typeof data['message'] === 'string' ? sanitizeMessage(data['message']) : 'Health data unavailable.',
    phaseLabel: typeof data['phase'] === 'string' ? data['phase'] : 'phase-22',
    warnings,
    error: status === 'error' ? buildErrorFromEnvelope(input.envelope, endpoint, method) : undefined,
    meta,
  };
}

export function buildCapabilitiesViewModel(input: DashboardAdapterInput): DashboardCapabilitiesViewModel {
  const endpoint: '/capabilities' = '/capabilities';
  const method: 'GET' = 'GET';
  const data = getSuccessData(input.envelope);
  const capabilities = Object.fromEntries(
    Object.entries(data).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
  );
  const unavailableCapabilityNames = Object.entries(capabilities)
    .filter(([, value]) => value === false)
    .map(([name]) => name)
    .sort();
  const status = isReadOnlyApiSuccessEnvelope(input.envelope) ? 'ready' : 'error';
  return {
    endpoint,
    method,
    status,
    capabilities,
    unavailableCapabilityNames,
    warnings: isReadOnlyApiSuccessEnvelope(input.envelope) ? toWarnings(input.envelope.warnings) : [],
    error: status === 'error' ? buildErrorFromEnvelope(input.envelope, endpoint, method) : undefined,
    meta:
      isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope)
        ? toMeta(input.envelope.meta)
        : toMeta(undefined),
  };
}

export function buildDashboardOverviewViewModel(input: DashboardAdapterInput): DashboardOverviewViewModel {
  const endpoint: '/dashboard' = '/dashboard';
  const method: 'GET' = 'GET';
  const data = getSuccessData(input.envelope);
  const dashboard = isRecord(data['dashboard']) ? data['dashboard'] : {};
  const panelsAvailable = Array.isArray(dashboard['panelsAvailable'])
    ? dashboard['panelsAvailable'].filter((value): value is string => typeof value === 'string')
    : [];
  const status: DashboardStatusViewModel =
    isReadOnlyApiSuccessEnvelope(input.envelope)
      ? (panelsAvailable.length > 0 ? 'ready' : 'empty')
      : 'error';
  return {
    endpoint,
    method,
    status,
    severity: typeof dashboard['severity'] === 'string' ? dashboard['severity'] : 'unknown',
    summaryText:
      typeof dashboard['summaryText'] === 'string'
        ? sanitizeMessage(dashboard['summaryText'])
        : 'Dashboard overview unavailable.',
    totalFindings: typeof dashboard['totalFindings'] === 'number' ? dashboard['totalFindings'] : 0,
    panelsAvailable,
    warnings: isReadOnlyApiSuccessEnvelope(input.envelope) ? toWarnings(input.envelope.warnings) : [],
    error: status === 'error' ? buildErrorFromEnvelope(input.envelope, endpoint, method) : undefined,
    meta:
      isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope)
        ? toMeta(input.envelope.meta)
        : toMeta(undefined),
  };
}

export function buildEvidenceViewModel(input: DashboardAdapterInput): DashboardEvidenceViewModel {
  const endpoint: '/dashboard/evidence' = '/dashboard/evidence';
  const method: 'GET' = 'GET';
  const data = getSuccessData(input.envelope);
  const entries = Array.isArray(data['entries'])
    ? data['entries'].filter((entry): entry is Record<string, unknown> => isRecord(entry))
    : [];
  const status: DashboardStatusViewModel = isReadOnlyApiSuccessEnvelope(input.envelope)
    ? (entries.length > 0 ? 'ready' : 'empty')
    : 'error';
  return {
    endpoint,
    method,
    status,
    entries,
    totalEntries: entries.length,
    emptyState: status === 'empty' ? buildDashboardEmptyViewModel('No evidence entries are available.') : undefined,
    warnings: isReadOnlyApiSuccessEnvelope(input.envelope) ? toWarnings(input.envelope.warnings) : [],
    error: status === 'error' ? buildErrorFromEnvelope(input.envelope, endpoint, method) : undefined,
    meta:
      isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope)
        ? toMeta(input.envelope.meta)
        : toMeta(undefined),
  };
}

export function buildSafetyViewModel(input: DashboardAdapterInput): DashboardSafetyViewModel {
  const endpoint: '/dashboard/safety' = '/dashboard/safety';
  const method: 'GET' = 'GET';
  const data = getSuccessData(input.envelope);
  const safetyPanel = isRecord(data['safetyPanel']) ? data['safetyPanel'] : {};
  const lockedCapabilityNames = Array.isArray(safetyPanel['lockedCapabilityNames'])
    ? safetyPanel['lockedCapabilityNames'].filter((value): value is string => typeof value === 'string').sort()
    : [];
  const status: DashboardStatusViewModel = isReadOnlyApiSuccessEnvelope(input.envelope)
    ? (Object.keys(safetyPanel).length > 0 ? 'ready' : 'unavailable')
    : 'error';
  return {
    endpoint,
    method,
    status,
    safetyInvariantsSatisfied:
      typeof safetyPanel['safetyInvariantsSatisfied'] === 'boolean'
        ? safetyPanel['safetyInvariantsSatisfied']
        : false,
    lockedCapabilityNames,
    summaryText:
      typeof safetyPanel['summaryText'] === 'string'
        ? sanitizeMessage(safetyPanel['summaryText'])
        : 'Safety status unavailable.',
    warnings: isReadOnlyApiSuccessEnvelope(input.envelope) ? toWarnings(input.envelope.warnings) : [],
    error: status === 'error' ? buildErrorFromEnvelope(input.envelope, endpoint, method) : undefined,
    meta:
      isReadOnlyApiSuccessEnvelope(input.envelope) || isReadOnlyApiErrorEnvelope(input.envelope)
        ? toMeta(input.envelope.meta)
        : toMeta(undefined),
  };
}

function buildPanelViewModels(
  overview: DashboardOverviewViewModel,
  evidence: DashboardEvidenceViewModel,
  safety: DashboardSafetyViewModel,
): readonly DashboardPanelViewModel[] {
  return [
    {
      panelId: 'overview',
      title: 'Overview',
      status: overview.status,
      severity: overview.severity,
      summary: overview.summaryText,
    },
    {
      panelId: 'evidence',
      title: 'Evidence',
      status: evidence.status,
      severity: evidence.status === 'error' ? 'error' : 'info',
      summary: evidence.status === 'empty' ? 'No evidence entries are available.' : `${evidence.totalEntries} entries`,
    },
    {
      panelId: 'safety',
      title: 'Safety',
      status: safety.status,
      severity: safety.safetyInvariantsSatisfied ? 'info' : 'warning',
      summary: safety.summaryText,
    },
  ];
}

function buildDashboardSummary(
  statuses: readonly DashboardStatusViewModel[],
  warningCount: number,
  errorCount: number,
): DashboardSummaryViewModel {
  return {
    totalPanels: statuses.length,
    readyPanels: statuses.filter(status => status === 'ready').length,
    emptyPanels: statuses.filter(status => status === 'empty').length,
    errorPanels: statuses.filter(status => status === 'error').length,
    unavailablePanels: statuses.filter(status => status === 'unavailable').length,
    warningCount,
    errorCount,
  };
}

function computeDashboardStatus(summary: DashboardSummaryViewModel): DashboardStatusViewModel {
  if (summary.errorPanels > 0) return 'error';
  if (summary.readyPanels > 0) return 'ready';
  if (summary.emptyPanels > 0) return 'empty';
  if (summary.unavailablePanels > 0) return 'unavailable';
  return 'loading';
}

export function buildDashboardViewModel(input: DashboardBundleAdapterInput): DashboardViewModel {
  const health = buildHealthViewModel({ envelope: input.health, endpoint: '/health', method: 'GET', options: input.options });
  const capabilities = buildCapabilitiesViewModel({
    envelope: input.capabilities,
    endpoint: '/capabilities',
    method: 'GET',
    options: input.options,
  });
  const overview = buildDashboardOverviewViewModel({
    envelope: input.dashboard,
    endpoint: '/dashboard',
    method: 'GET',
    options: input.options,
  });
  const evidence = buildEvidenceViewModel({
    envelope: input.evidence,
    endpoint: '/dashboard/evidence',
    method: 'GET',
    options: input.options,
  });
  const safety = buildSafetyViewModel({
    envelope: input.safety,
    endpoint: '/dashboard/safety',
    method: 'GET',
    options: input.options,
  });

  const panels = buildPanelViewModels(overview, evidence, safety);
  const warnings = [...health.warnings, ...capabilities.warnings, ...overview.warnings, ...evidence.warnings, ...safety.warnings];
  const errors = [health.error, capabilities.error, overview.error, evidence.error, safety.error].filter(
    (error): error is DashboardErrorStateViewModel => Boolean(error),
  );
  const summary = buildDashboardSummary(
    panels.map(panel => panel.status),
    warnings.length,
    errors.length,
  );

  return {
    status: computeDashboardStatus(summary),
    summary,
    health,
    capabilities,
    overview,
    evidence,
    safety,
    panels,
    warnings,
    errors,
  };
}

export function adaptReadOnlyApiEnvelopeToViewModel(input: DashboardAdapterInput): DashboardAdapterResult {
  const endpoint = getEndpoint(input);
  const method = getMethod(input);

  if (!isKnownDashboardEndpoint(endpoint)) {
    const status = input.options?.unsupportedEndpointStatus ?? 'unavailable';
    const error = buildUnsupportedEndpointError(endpoint, method);
    return {
      endpoint,
      method,
      status,
      viewModel: status === 'loading' ? buildDashboardLoadingViewModel(input.options?.loadingMessage) : error,
    };
  }

  if (input.envelope === undefined || input.envelope === null) {
    return {
      endpoint,
      method,
      status: 'error',
      viewModel: buildDashboardErrorViewModel({
        code: DASHBOARD_ADAPTER_ERROR_CODES.INVALID_INPUT,
        message: 'Invalid adapter input: envelope is required.',
        endpoint,
        method,
        details: [{ field: 'envelope', reason: 'Value must be a non-null object.' }],
      }),
    };
  }

  const parsed = parseReadOnlyApiEnvelope(input.envelope);
  if (!parsed.ok && !isReadOnlyApiErrorEnvelope(input.envelope)) {
    return {
      endpoint,
      method,
      status: 'error',
      viewModel: buildDashboardErrorViewModel({
        code: DASHBOARD_ADAPTER_ERROR_CODES.INVALID_INPUT,
        message: 'Received malformed read-only API envelope.',
        endpoint,
        method,
        details: [{ field: 'envelope', reason: 'Envelope did not match success or error contract shape.' }],
      }),
    };
  }

  switch (endpoint) {
    case '/health': {
      const viewModel = buildHealthViewModel({ ...input, endpoint, method });
      return { endpoint, method, status: viewModel.status, viewModel };
    }
    case '/capabilities': {
      const viewModel = buildCapabilitiesViewModel({ ...input, endpoint, method });
      return { endpoint, method, status: viewModel.status, viewModel };
    }
    case '/dashboard': {
      const viewModel = buildDashboardOverviewViewModel({ ...input, endpoint, method });
      return { endpoint, method, status: viewModel.status, viewModel };
    }
    case '/dashboard/evidence': {
      const viewModel = buildEvidenceViewModel({ ...input, endpoint, method });
      return { endpoint, method, status: viewModel.status, viewModel };
    }
    case '/dashboard/safety': {
      const viewModel = buildSafetyViewModel({ ...input, endpoint, method });
      return { endpoint, method, status: viewModel.status, viewModel };
    }
  }
}

export function validateDashboardViewModel(value: unknown): readonly string[] {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return ['dashboard view model must be an object'];
  }

  const status = value['status'];
  if (!['ready', 'empty', 'loading', 'error', 'unavailable'].includes(String(status))) {
    errors.push('status must be ready|empty|loading|error|unavailable');
  }

  const serialised = JSON.stringify(value);
  if (serialised.includes('/home/runner') || serialised.includes('/Users/') || serialised.includes('C:\\Users\\')) {
    errors.push('view model must not contain local filesystem paths');
  }
  if (/private[_ -]?key|seed[_ -]?phrase|mnemonic|apikey/i.test(serialised)) {
    errors.push('view model must not contain secrets');
  }
  if (/\bat\s.+\(.+\)/.test(serialised) || serialised.includes('Error\n')) {
    errors.push('view model must not contain stack traces');
  }

  return errors;
}
