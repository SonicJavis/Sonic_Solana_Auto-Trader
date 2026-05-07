/**
 * apps/dashboard/src/components/HealthPanel.ts
 *
 * Phase 25 — Dashboard UI Shell — HealthPanel Component
 *
 * Renders the Phase 24 DashboardHealthViewModel as a read-only panel.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardItem, DashboardSection } from '../types.js';
import type { DashboardHealthViewModel } from '@sonic/dashboard-view-models';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';
import { StatusBadge } from './StatusBadge.js';
import { EmptyState } from './EmptyState.js';
import { ErrorState } from './ErrorState.js';
import { LoadingState } from './LoadingState.js';
import { UnavailableState } from './UnavailableState.js';

export interface HealthPanelProps {
  readonly viewModel: DashboardHealthViewModel;
}

/**
 * HealthPanel component.
 *
 * Renders the health view model as a read-only panel.
 * Shows health status, phase label, message, and warnings.
 * Falls back to safe state components for non-ready states.
 * Deterministic. No live data.
 */
export function HealthPanel(props: HealthPanelProps): DashboardRenderResult {
  const { viewModel } = props;

  if (viewModel.status === 'loading') {
    return LoadingState({ message: 'Health data is loading.', sectionId: 'health-loading' });
  }
  if (viewModel.status === 'empty') {
    return EmptyState({ message: 'No health data available.', sectionId: 'health-empty' });
  }
  if (viewModel.status === 'unavailable') {
    return UnavailableState({ message: 'Health data is unavailable.', sectionId: 'health-unavailable' });
  }
  if (viewModel.status === 'error') {
    const msg = viewModel.error?.message ?? 'Health panel encountered an error.';
    const code = viewModel.error?.code;
    return ErrorState({ message: msg, ...(code !== undefined ? { code } : {}), sectionId: 'health-error' });
  }

  const overviewItems: DashboardItem[] = [
    {
      key: 'healthStatus',
      label: 'Health Status',
      value: viewModel.healthStatus,
      badge: StatusBadge({ status: viewModel.healthStatus }),
    },
    {
      key: 'phaseLabel',
      label: 'Phase Label',
      value: viewModel.phaseLabel,
    },
    {
      key: 'message',
      label: 'Message',
      value: viewModel.message,
    },
    {
      key: 'endpoint',
      label: 'Endpoint',
      value: viewModel.endpoint,
    },
    {
      key: 'method',
      label: 'Method',
      value: viewModel.method,
    },
    {
      key: 'status',
      label: 'View Model Status',
      value: viewModel.status,
      badge: StatusBadge({ status: viewModel.status }),
    },
  ];

  const sections: DashboardSection[] = [
    {
      sectionId: 'health-overview',
      title: 'Health Overview',
      role: 'group',
      ariaLabel: 'Health overview fields',
      items: overviewItems,
    },
  ];

  if (viewModel.warnings.length > 0) {
    sections.push({
      sectionId: 'health-warnings',
      title: 'Health Warnings',
      role: 'group',
      ariaLabel: 'Health warnings list',
      items: viewModel.warnings.map((w, i) => ({
        key: `warning-${i}`,
        label: w.code,
        value: w.message,
      })),
    });
  }

  return {
    componentType: 'HealthPanel',
    title: 'Health',
    ariaLabel: 'Health panel: dashboard health status',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections,
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
