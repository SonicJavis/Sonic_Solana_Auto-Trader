/**
 * apps/dashboard/src/components/UnavailableState.ts
 *
 * Phase 25 — Dashboard UI Shell — UnavailableState Component
 *
 * Renders a safe unavailable state panel for endpoints or features
 * not yet implemented or outside the scope of this phase.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult } from '../types.js';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';

export interface UnavailableStateProps {
  readonly message?: string;
  readonly reason?: string;
  readonly sectionId?: string;
}

/**
 * UnavailableState component.
 *
 * Renders a safe "feature unavailable" state.
 * Used for endpoints or features outside Phase 25 scope.
 * Deterministic output. No live data.
 */
export function UnavailableState(props: UnavailableStateProps = {}): DashboardRenderResult {
  const message = props.message ?? 'This section is not available in the current phase.';
  const reason = props.reason ?? 'Feature not implemented in Phase 25.';
  const sectionId = props.sectionId ?? 'unavailable-state';
  return {
    componentType: 'UnavailableState',
    title: 'Unavailable',
    ariaLabel: 'Unavailable state: this section is not available',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections: [
      {
        sectionId,
        title: 'Unavailable',
        role: 'region',
        ariaLabel: 'Unavailable state',
        items: [
          {
            key: 'message',
            label: 'Message',
            value: message,
          },
          {
            key: 'reason',
            label: 'Reason',
            value: reason,
          },
          {
            key: 'status',
            label: 'Status',
            value: 'unavailable',
          },
        ],
      },
    ],
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
