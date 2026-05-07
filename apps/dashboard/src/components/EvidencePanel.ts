/**
 * apps/dashboard/src/components/EvidencePanel.ts
 *
 * Phase 25 — Dashboard UI Shell — EvidencePanel Component
 *
 * Renders the Phase 24 DashboardEvidenceViewModel as a read-only panel.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardItem, DashboardSection } from '../types.js';
import type { DashboardEvidenceViewModel } from '@sonic/dashboard-view-models';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';
import { StatusBadge } from './StatusBadge.js';
import { EmptyState } from './EmptyState.js';
import { ErrorState } from './ErrorState.js';
import { LoadingState } from './LoadingState.js';
import { UnavailableState } from './UnavailableState.js';

export interface EvidencePanelProps {
  readonly viewModel: DashboardEvidenceViewModel;
}

/** Maximum number of evidence entries to render (safety limit). */
const MAX_EVIDENCE_ENTRIES = 50;

/**
 * EvidencePanel component.
 *
 * Renders evidence entries as a read-only panel.
 * Shows entry count and individual entry data.
 * Falls back to safe state components for non-ready states.
 * Limits displayed entries for safety.
 * Deterministic. No live data.
 */
export function EvidencePanel(props: EvidencePanelProps): DashboardRenderResult {
  const { viewModel } = props;

  if (viewModel.status === 'loading') {
    return LoadingState({ message: 'Evidence data is loading.', sectionId: 'evidence-loading' });
  }
  if (viewModel.status === 'empty' || viewModel.emptyState !== undefined) {
    const msg = viewModel.emptyState?.message ?? 'No evidence entries available.';
    return EmptyState({ message: msg, sectionId: 'evidence-empty' });
  }
  if (viewModel.status === 'unavailable') {
    return UnavailableState({ message: 'Evidence data is unavailable.', sectionId: 'evidence-unavailable' });
  }
  if (viewModel.status === 'error') {
    const msg = viewModel.error?.message ?? 'Evidence panel encountered an error.';
    const code = viewModel.error?.code;
    return ErrorState({ message: msg, ...(code !== undefined ? { code } : {}), sectionId: 'evidence-error' });
  }

  const overviewItems: DashboardItem[] = [
    {
      key: 'totalEntries',
      label: 'Total Entries',
      value: viewModel.totalEntries,
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
      sectionId: 'evidence-overview',
      title: 'Evidence Overview',
      role: 'group',
      ariaLabel: 'Evidence overview fields',
      items: overviewItems,
    },
  ];

  const displayEntries = viewModel.entries.slice(0, MAX_EVIDENCE_ENTRIES);
  if (displayEntries.length > 0) {
    const entryItems: DashboardItem[] = displayEntries.map((entry, i) => ({
      key: `entry-${i}`,
      label: `Entry ${i + 1}`,
      value: JSON.stringify(entry),
    }));

    sections.push({
      sectionId: 'evidence-entries',
      title: 'Evidence Entries',
      role: 'group',
      ariaLabel: 'Evidence entries list',
      items: entryItems,
    });
  }

  if (viewModel.warnings.length > 0) {
    sections.push({
      sectionId: 'evidence-warnings',
      title: 'Evidence Warnings',
      role: 'group',
      ariaLabel: 'Evidence warnings list',
      items: viewModel.warnings.map((w, i) => ({
        key: `warning-${i}`,
        label: w.code,
        value: w.message,
      })),
    });
  }

  return {
    componentType: 'EvidencePanel',
    title: 'Evidence',
    ariaLabel: 'Evidence panel: evidence entries and analysis data',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections,
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
