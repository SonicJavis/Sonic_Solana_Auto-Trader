/**
 * apps/dashboard/src/components/CapabilitiesPanel.ts
 *
 * Phase 25 — Dashboard UI Shell — CapabilitiesPanel Component
 *
 * Renders the Phase 24 DashboardCapabilitiesViewModel as a read-only panel.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardItem, DashboardSection } from '../types.js';
import type { DashboardCapabilitiesViewModel } from '@sonic/dashboard-view-models';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';
import { StatusBadge } from './StatusBadge.js';
import { EmptyState } from './EmptyState.js';
import { ErrorState } from './ErrorState.js';
import { LoadingState } from './LoadingState.js';
import { UnavailableState } from './UnavailableState.js';

export interface CapabilitiesPanelProps {
  readonly viewModel: DashboardCapabilitiesViewModel;
}

/**
 * CapabilitiesPanel component.
 *
 * Renders capabilities flags as a read-only panel.
 * Shows enabled/disabled status for each capability.
 * Falls back to safe state components for non-ready states.
 * Deterministic. No live data.
 */
export function CapabilitiesPanel(props: CapabilitiesPanelProps): DashboardRenderResult {
  const { viewModel } = props;

  if (viewModel.status === 'loading') {
    return LoadingState({ message: 'Capabilities data is loading.', sectionId: 'capabilities-loading' });
  }
  if (viewModel.status === 'empty') {
    return EmptyState({ message: 'No capabilities data available.', sectionId: 'capabilities-empty' });
  }
  if (viewModel.status === 'unavailable') {
    return UnavailableState({
      message: 'Capabilities data is unavailable.',
      sectionId: 'capabilities-unavailable',
    });
  }
  if (viewModel.status === 'error') {
    const msg = viewModel.error?.message ?? 'Capabilities panel encountered an error.';
    const code = viewModel.error?.code;
    return ErrorState({ message: msg, ...(code !== undefined ? { code } : {}), sectionId: 'capabilities-error' });
  }

  const capabilityEntries = Object.entries(viewModel.capabilities);
  const enabledItems: DashboardItem[] = capabilityEntries
    .filter(([, v]) => v === true)
    .map(([k]) => ({
      key: k,
      label: k,
      value: true,
      badge: StatusBadge({ status: 'true', labelOverride: 'Enabled' }),
    }));

  const disabledItems: DashboardItem[] = capabilityEntries
    .filter(([, v]) => v === false)
    .map(([k]) => ({
      key: k,
      label: k,
      value: false,
      badge: StatusBadge({ status: 'false', labelOverride: 'Disabled' }),
    }));

  const sections: DashboardSection[] = [
    {
      sectionId: 'capabilities-overview',
      title: 'Capabilities Overview',
      role: 'group',
      ariaLabel: 'Capabilities overview',
      items: [
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
        {
          key: 'totalCapabilities',
          label: 'Total Capabilities',
          value: capabilityEntries.length,
        },
      ],
    },
    {
      sectionId: 'capabilities-enabled',
      title: 'Enabled Capabilities',
      role: 'group',
      ariaLabel: 'Enabled capabilities list',
      items: enabledItems,
    },
    {
      sectionId: 'capabilities-disabled',
      title: 'Disabled Capabilities',
      role: 'group',
      ariaLabel: 'Disabled capabilities list',
      items: disabledItems,
    },
  ];

  if (viewModel.unavailableCapabilityNames.length > 0) {
    sections.push({
      sectionId: 'capabilities-unavailable-list',
      title: 'Unavailable Capabilities',
      role: 'group',
      ariaLabel: 'Unavailable capabilities list',
      items: viewModel.unavailableCapabilityNames.map((name, i) => ({
        key: `unavailable-${i}`,
        label: name,
        value: 'unavailable',
        badge: StatusBadge({ status: 'unavailable' }),
      })),
    });
  }

  if (viewModel.warnings.length > 0) {
    sections.push({
      sectionId: 'capabilities-warnings',
      title: 'Capabilities Warnings',
      role: 'group',
      ariaLabel: 'Capabilities warnings list',
      items: viewModel.warnings.map((w, i) => ({
        key: `warning-${i}`,
        label: w.code,
        value: w.message,
      })),
    });
  }

  return {
    componentType: 'CapabilitiesPanel',
    title: 'Capabilities',
    ariaLabel: 'Capabilities panel: feature capability flags',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections,
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
