/**
 * apps/dashboard/src/components/SafetyPanel.ts
 *
 * Phase 25 — Dashboard UI Shell — SafetyPanel Component
 *
 * Renders the Phase 24 DashboardSafetyViewModel as a read-only panel.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardItem, DashboardSection } from '../types.js';
import type { DashboardSafetyViewModel } from '@sonic/dashboard-view-models';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';
import { StatusBadge } from './StatusBadge.js';
import { EmptyState } from './EmptyState.js';
import { ErrorState } from './ErrorState.js';
import { LoadingState } from './LoadingState.js';
import { UnavailableState } from './UnavailableState.js';

export interface SafetyPanelProps {
  readonly viewModel: DashboardSafetyViewModel;
}

/**
 * SafetyPanel component.
 *
 * Renders safety invariants and locked capabilities as a read-only panel.
 * Falls back to safe state components for non-ready states.
 * Deterministic. No live data.
 */
export function SafetyPanel(props: SafetyPanelProps): DashboardRenderResult {
  const { viewModel } = props;

  if (viewModel.status === 'loading') {
    return LoadingState({ message: 'Safety data is loading.', sectionId: 'safety-loading' });
  }
  if (viewModel.status === 'empty') {
    return EmptyState({ message: 'No safety data available.', sectionId: 'safety-empty' });
  }
  if (viewModel.status === 'unavailable') {
    return UnavailableState({ message: 'Safety data is unavailable.', sectionId: 'safety-unavailable' });
  }
  if (viewModel.status === 'error') {
    const msg = viewModel.error?.message ?? 'Safety panel encountered an error.';
    const code = viewModel.error?.code;
    return ErrorState({ message: msg, ...(code !== undefined ? { code } : {}), sectionId: 'safety-error' });
  }

  const overviewItems: DashboardItem[] = [
    {
      key: 'safetyInvariantsSatisfied',
      label: 'Safety Invariants Satisfied',
      value: viewModel.safetyInvariantsSatisfied,
      badge: StatusBadge({ status: String(viewModel.safetyInvariantsSatisfied) }),
    },
    {
      key: 'summaryText',
      label: 'Summary',
      value: viewModel.summaryText,
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
      sectionId: 'safety-overview',
      title: 'Safety Overview',
      role: 'group',
      ariaLabel: 'Safety overview fields',
      items: overviewItems,
    },
  ];

  if (viewModel.lockedCapabilityNames.length > 0) {
    sections.push({
      sectionId: 'safety-locked',
      title: 'Locked Capabilities',
      role: 'group',
      ariaLabel: 'Locked capabilities list',
      items: viewModel.lockedCapabilityNames.map((name, i) => ({
        key: `locked-${i}`,
        label: name,
        value: 'locked',
        badge: StatusBadge({ status: 'unavailable', labelOverride: 'Locked' }),
      })),
    });
  }

  if (viewModel.warnings.length > 0) {
    sections.push({
      sectionId: 'safety-warnings',
      title: 'Safety Warnings',
      role: 'group',
      ariaLabel: 'Safety warnings list',
      items: viewModel.warnings.map((w, i) => ({
        key: `warning-${i}`,
        label: w.code,
        value: w.message,
      })),
    });
  }

  return {
    componentType: 'SafetyPanel',
    title: 'Safety',
    ariaLabel: 'Safety panel: safety invariants and locked capabilities',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections,
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
