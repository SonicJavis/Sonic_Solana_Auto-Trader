/**
 * apps/dashboard/src/components/StatusBadge.ts
 *
 * Phase 25 — Dashboard UI Shell — StatusBadge Component
 *
 * Presentational component. Returns a typed StatusBadgeResult.
 * Read-only. No side effects. No network. No mutation.
 */

import type { StatusBadgeResult } from '../types.js';

const STATUS_LABEL_MAP: Readonly<Record<string, string>> = {
  ready: 'Ready',
  empty: 'Empty',
  loading: 'Loading',
  error: 'Error',
  unavailable: 'Unavailable',
  ok: 'OK',
  unknown: 'Unknown',
  true: 'Enabled',
  false: 'Disabled',
};

export interface StatusBadgeProps {
  readonly status: string;
  readonly labelOverride?: string;
}

/**
 * StatusBadge component.
 *
 * Returns a typed StatusBadgeResult with accessible label and aria attribute.
 * Always deterministic. No live data. No side effects.
 */
export function StatusBadge(props: StatusBadgeProps): StatusBadgeResult {
  const label = props.labelOverride ?? STATUS_LABEL_MAP[props.status.toLowerCase()] ?? props.status;
  return {
    componentType: 'StatusBadge',
    status: props.status,
    label,
    ariaLabel: `Status: ${label}`,
  };
}
