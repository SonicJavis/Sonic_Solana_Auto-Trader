/**
 * apps/dashboard/src/components/ErrorState.ts
 *
 * Phase 25 — Dashboard UI Shell — ErrorState Component
 *
 * Renders a safe error state panel without exposing stack traces,
 * raw errors, local filesystem paths, or secrets.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardItem } from '../types.js';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';

export interface ErrorStateProps {
  readonly message?: string;
  readonly code?: string;
  readonly sectionId?: string;
}

/**
 * ErrorState component.
 *
 * Renders a sanitized error state. Never exposes raw errors, stack traces,
 * local paths, or sensitive information.
 * Deterministic output. No live data.
 */
export function ErrorState(props: ErrorStateProps = {}): DashboardRenderResult {
  const message = sanitizeErrorMessage(props.message ?? 'An error occurred. No data is available.');
  const code = props.code ?? 'DASHBOARD_ERROR';
  const sectionId = props.sectionId ?? 'error-state';

  const items: DashboardItem[] = [
    {
      key: 'message',
      label: 'Message',
      value: message,
    },
    {
      key: 'code',
      label: 'Error Code',
      value: code,
    },
    {
      key: 'status',
      label: 'Status',
      value: 'error',
    },
  ];

  return {
    componentType: 'ErrorState',
    title: 'Error',
    ariaLabel: 'Error state: an error occurred',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections: [
      {
        sectionId,
        title: 'Error',
        role: 'region',
        ariaLabel: 'Error state',
        items,
      },
    ],
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}

/** Sanitizes an error message to prevent leaking stack traces, paths, or secrets. */
function sanitizeErrorMessage(message: string): string {
  if (
    message.includes('at ') ||
    /\/home\//i.test(message) ||
    /[A-Z]:\\Users\\/i.test(message) ||
    /private.?key/i.test(message) ||
    /seed.?phrase/i.test(message) ||
    /mnemonic/i.test(message) ||
    /api.?key/i.test(message) ||
    /secret/i.test(message)
  ) {
    return 'A sanitized dashboard error occurred. No sensitive data is exposed.';
  }
  return message;
}
