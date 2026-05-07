/**
 * apps/dashboard/src/components/LoadingState.ts
 *
 * Phase 25 — Dashboard UI Shell — LoadingState Component
 *
 * Renders a safe loading state panel.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult } from '../types.js';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';

export interface LoadingStateProps {
  readonly message?: string;
  readonly sectionId?: string;
}

/**
 * LoadingState component.
 *
 * Renders a safe "data is loading" state placeholder.
 * Note: This dashboard is fixture-backed and does not perform real loading.
 * This state is used when a fixture envelope has not been provided yet.
 * Deterministic output. No live data.
 */
export function LoadingState(props: LoadingStateProps = {}): DashboardRenderResult {
  const message = props.message ?? 'Dashboard data is not loaded yet.';
  const sectionId = props.sectionId ?? 'loading-state';
  return {
    componentType: 'LoadingState',
    title: 'Loading',
    ariaLabel: 'Loading state: dashboard data is not yet available',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections: [
      {
        sectionId,
        title: 'Loading',
        role: 'region',
        ariaLabel: 'Loading state',
        items: [
          {
            key: 'message',
            label: 'Message',
            value: message,
          },
          {
            key: 'status',
            label: 'Status',
            value: 'loading',
          },
        ],
      },
    ],
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
