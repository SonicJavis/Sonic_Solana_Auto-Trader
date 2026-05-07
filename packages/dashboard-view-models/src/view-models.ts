import type {
  DashboardEmptyStateViewModel,
  DashboardErrorStateViewModel,
  DashboardLoadingStateViewModel,
  DashboardStatusViewModel,
} from './types.js';
import type { ReadOnlyApiMethod } from '@sonic/read-only-api-client';
import { DASHBOARD_ADAPTER_ERROR_CODES } from './errors.js';

export function buildDashboardErrorViewModel(input: {
  readonly code: DashboardErrorStateViewModel['code'];
  readonly message: string;
  readonly endpoint?: string;
  readonly method?: ReadOnlyApiMethod;
  readonly details?: readonly { readonly field: string; readonly reason: string }[];
}): DashboardErrorStateViewModel {
  const base: DashboardErrorStateViewModel = {
    status: 'error',
    code: input.code,
    message: input.message,
    details: input.details ?? [],
  };
  return {
    ...base,
    ...(input.endpoint !== undefined ? { endpoint: input.endpoint } : {}),
    ...(input.method !== undefined ? { method: input.method } : {}),
  };
}

export function buildDashboardEmptyViewModel(message: string): DashboardEmptyStateViewModel {
  return {
    status: 'empty',
    code: DASHBOARD_ADAPTER_ERROR_CODES.EMPTY,
    message,
  };
}

export function buildDashboardLoadingViewModel(
  message: string = 'Dashboard data is not loaded yet.',
): DashboardLoadingStateViewModel {
  return {
    status: 'loading',
    code: DASHBOARD_ADAPTER_ERROR_CODES.LOADING,
    message,
  };
}

export function isStatusError(status: DashboardStatusViewModel): boolean {
  return status === 'error';
}
