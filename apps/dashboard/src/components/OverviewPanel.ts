/**
 * apps/dashboard/src/components/OverviewPanel.ts
 *
 * Phase 25 — Dashboard UI Shell — OverviewPanel Component
 *
 * Renders the Phase 24 DashboardOverviewViewModel as a read-only panel.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardItem, DashboardSection } from '../types.js';
import type { DashboardOverviewViewModel } from '@sonic/dashboard-view-models';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';
import { StatusBadge } from './StatusBadge.js';
import { EmptyState } from './EmptyState.js';
import { ErrorState } from './ErrorState.js';
import { LoadingState } from './LoadingState.js';
import { UnavailableState } from './UnavailableState.js';

export interface OverviewPanelProps {
  readonly viewModel: DashboardOverviewViewModel;
}

/**
 * OverviewPanel component.
 *
 * Renders dashboard overview as a read-only panel.
 * Shows severity, summary, findings count, and available panels.
 * Falls back to safe state components for non-ready states.
 * Deterministic. No live data.
 */
export function OverviewPanel(props: OverviewPanelProps): DashboardRenderResult {
  const { viewModel } = props;

  if (viewModel.status === 'loading') {
    return LoadingState({ message: 'Overview data is loading.', sectionId: 'overview-loading' });
  }
  if (viewModel.status === 'empty') {
    return EmptyState({ message: 'No overview data available.', sectionId: 'overview-empty' });
  }
  if (viewModel.status === 'unavailable') {
    return UnavailableState({ message: 'Overview data is unavailable.', sectionId: 'overview-unavailable' });
  }
  if (viewModel.status === 'error') {
    const msg = viewModel.error?.message ?? 'Overview panel encountered an error.';
    const code = viewModel.error?.code;
    return ErrorState({ message: msg, ...(code !== undefined ? { code } : {}), sectionId: 'overview-error' });
  }

  const overviewItems: DashboardItem[] = [
    {
      key: 'severity',
      label: 'Severity',
      value: viewModel.severity,
      badge: StatusBadge({ status: viewModel.severity }),
    },
    {
      key: 'summaryText',
      label: 'Summary',
      value: viewModel.summaryText,
    },
    {
      key: 'totalFindings',
      label: 'Total Findings',
      value: viewModel.totalFindings,
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
      sectionId: 'overview-details',
      title: 'Overview Details',
      role: 'group',
      ariaLabel: 'Dashboard overview details',
      items: overviewItems,
    },
  ];

  if (viewModel.panelsAvailable.length > 0) {
    sections.push({
      sectionId: 'overview-panels',
      title: 'Available Panels',
      role: 'group',
      ariaLabel: 'Available dashboard panels list',
      items: viewModel.panelsAvailable.map((panel, i) => ({
        key: `panel-${i}`,
        label: `Panel ${i + 1}`,
        value: panel,
      })),
    });
  }

  if (viewModel.warnings.length > 0) {
    sections.push({
      sectionId: 'overview-warnings',
      title: 'Overview Warnings',
      role: 'group',
      ariaLabel: 'Overview warnings list',
      items: viewModel.warnings.map((w, i) => ({
        key: `warning-${i}`,
        label: w.code,
        value: w.message,
      })),
    });
  }

  return {
    componentType: 'OverviewPanel',
    title: 'Dashboard Overview',
    ariaLabel: 'Dashboard overview panel: severity, summary, and findings',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections,
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
