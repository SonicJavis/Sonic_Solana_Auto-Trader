/**
 * apps/dashboard/src/components/EmptyState.ts
 *
 * Phase 25 — Dashboard UI Shell — EmptyState Component
 *
 * Renders a safe empty state panel.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult } from '../types.js';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';

export interface EmptyStateProps {
  readonly message?: string;
  readonly sectionId?: string;
}

/**
 * EmptyState component.
 *
 * Renders a safe "no data available" state.
 * Deterministic output. No live data.
 */
export function EmptyState(props: EmptyStateProps = {}): DashboardRenderResult {
  const message = props.message ?? 'No data available.';
  const sectionId = props.sectionId ?? 'empty-state';
  return {
    componentType: 'EmptyState',
    title: 'Empty',
    ariaLabel: 'Empty state: no data available',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections: [
      {
        sectionId,
        title: 'Empty',
        role: 'region',
        ariaLabel: 'Empty state',
        items: [
          {
            key: 'message',
            label: 'Message',
            value: message,
          },
          {
            key: 'status',
            label: 'Status',
            value: 'empty',
          },
        ],
      },
    ],
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
