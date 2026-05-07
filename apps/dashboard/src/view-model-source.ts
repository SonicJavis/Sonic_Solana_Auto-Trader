/**
 * apps/dashboard/src/view-model-source.ts
 *
 * Phase 25 — Local Read-Only Dashboard UI Shell v1 — View Model Source
 *
 * Builds fixture-backed, deterministic dashboard view models from
 * Phase 23 read-only API client fixtures using Phase 24 adapter functions.
 *
 * DATA SOURCES: Phase 23 fixtures only. No live data. No network requests.
 * No HTTP calls. No web socket connections. No Solana RPC. No provider APIs.
 * No wallet access. No private keys. No execution logic. No mutation.
 *
 * This module is deterministic: the same fixtures always produce
 * the same view models. No wall-clock timestamps, no random values, no timers.
 */

import {
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
  DASHBOARD_SAFETY_SUCCESS_FIXTURE,
} from '@sonic/read-only-api-client';

import { buildDashboardViewModel } from '@sonic/dashboard-view-models';

import type { DashboardViewModel } from '@sonic/dashboard-view-models';

/**
 * Builds a fixture-backed DashboardViewModel from Phase 23 fixtures.
 *
 * Always deterministic. Never makes network calls.
 * Data source: Phase 23 local contract fixtures only.
 */
export function buildFixtureDashboardViewModel(): DashboardViewModel {
  return buildDashboardViewModel({
    health: HEALTH_SUCCESS_FIXTURE,
    capabilities: CAPABILITIES_SUCCESS_FIXTURE,
    dashboard: DASHBOARD_SUCCESS_FIXTURE,
    evidence: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
    safety: DASHBOARD_SAFETY_SUCCESS_FIXTURE,
  });
}

/**
 * Returns a static description of the view model data source.
 * Used for display in the UI shell.
 */
export function getViewModelSourceDescription(): string {
  return (
    'Phase 25 dashboard view models are built from Phase 23 read-only API client fixtures. ' +
    'No live data. No network requests. No external APIs. Fixture-backed and deterministic.'
  );
}

/**
 * Returns static Phase 25 data source metadata.
 * Safe to display. No wall-clock timestamps.
 */
export function getViewModelSourceMeta(): {
  readonly source: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly deterministic: true;
  readonly phase: 25;
} {
  return {
    source: 'Phase 23 read-only API client fixtures',
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    deterministic: true,
    phase: 25,
  };
}
