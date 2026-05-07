/**
 * apps/dashboard/src/snapshots/types.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1 — Types
 *
 * Defines strict TypeScript types for deterministic dashboard render snapshots
 * and regression fixtures.
 *
 * SAFETY: No live data. No Solana RPC. No provider APIs. No wallets.
 *         No execution. No external network. No mutation controls.
 *         No persistence. No browser storage. No timers. No randomness.
 */

import type { DashboardRenderResult, DashboardShellResult, DashboardSafetyBoundary, SafetyBannerResult } from '../types.js';
import type { DashboardInteractionState, DashboardPanelId, DashboardStateSelectorResult } from '../state/types.js';
import type { DashboardViewModel } from '@sonic/dashboard-view-models';

// ─── Snapshot name ────────────────────────────────────────────────────────────

/** Stable, enumerated snapshot names for regression fixture lookup. */
export type DashboardRenderSnapshotName =
  | 'default-dashboard-shell'
  | 'safety-banner'
  | 'metadata-panel'
  | 'health-panel'
  | 'capabilities-panel'
  | 'overview-panel'
  | 'evidence-panel'
  | 'safety-panel'
  | 'empty-state'
  | 'loading-state'
  | 'error-state'
  | 'unavailable-state'
  | 'active-panel'
  | 'hidden-panel'
  | 'filtered-evidence'
  | 'filtered-safety'
  | 'reset-interaction-state'
  | 'no-results-filtered'
  | 'malformed-input-safe'
  | 'safety-boundary';

/** All supported snapshot names as a constant tuple for validation. */
export const DASHBOARD_RENDER_SNAPSHOT_NAMES: readonly DashboardRenderSnapshotName[] = [
  'default-dashboard-shell',
  'safety-banner',
  'metadata-panel',
  'health-panel',
  'capabilities-panel',
  'overview-panel',
  'evidence-panel',
  'safety-panel',
  'empty-state',
  'loading-state',
  'error-state',
  'unavailable-state',
  'active-panel',
  'hidden-panel',
  'filtered-evidence',
  'filtered-safety',
  'reset-interaction-state',
  'no-results-filtered',
  'malformed-input-safe',
  'safety-boundary',
] as const;

// ─── Snapshot kind ────────────────────────────────────────────────────────────

/** Category of a dashboard render snapshot. */
export type DashboardRenderSnapshotKind =
  | 'full-shell'
  | 'panel'
  | 'banner'
  | 'state'
  | 'filter'
  | 'empty'
  | 'loading'
  | 'error'
  | 'unavailable'
  | 'safety-boundary'
  | 'malformed';

/** All supported snapshot kinds. */
export const DASHBOARD_RENDER_SNAPSHOT_KINDS: readonly DashboardRenderSnapshotKind[] = [
  'full-shell',
  'panel',
  'banner',
  'state',
  'filter',
  'empty',
  'loading',
  'error',
  'unavailable',
  'safety-boundary',
  'malformed',
] as const;

// ─── Snapshot metadata ────────────────────────────────────────────────────────

/**
 * Immutable metadata describing the source and context of a snapshot.
 * All fields are deterministic. No wall-clock timestamps.
 */
export interface DashboardRenderSnapshotMeta {
  /** Phase that generated this snapshot. */
  readonly phase: 27;
  /** The data source phase used to build the view model. */
  readonly viewModelPhase: 24 | 25 | 26;
  /** Whether this snapshot uses only fixture data. */
  readonly fixtureOnly: true;
  /** Whether this snapshot uses live data. Always false. */
  readonly liveData: false;
  /** Whether this snapshot has external network dependency. Always false. */
  readonly externalNetwork: false;
  /** Whether this snapshot is deterministic. Always true. */
  readonly deterministic: true;
  /** Human-readable description of what this snapshot tests. */
  readonly notes: string;
  /** Stable source tag (no wall-clock timestamp). */
  readonly source: string;
}

// ─── Core snapshot ────────────────────────────────────────────────────────────

/**
 * A deterministic render snapshot of a dashboard component or state.
 * The render result is typed as the union of all possible component outputs.
 */
export interface DashboardRenderSnapshot {
  /** Stable name for this snapshot. */
  readonly name: DashboardRenderSnapshotName;
  /** Category of this snapshot. */
  readonly kind: DashboardRenderSnapshotKind;
  /** Snapshot metadata. */
  readonly meta: DashboardRenderSnapshotMeta;
  /** The captured render result (shell, panel, banner, or state). */
  readonly renderResult: DashboardShellResult | DashboardRenderResult | SafetyBannerResult;
  /** Expected visible panel IDs at snapshot time (if applicable). */
  readonly expectedVisiblePanelIds: readonly DashboardPanelId[];
  /** Expected hidden panel IDs at snapshot time (if applicable). */
  readonly expectedHiddenPanelIds: readonly DashboardPanelId[];
  /** Expected component type in the render result. */
  readonly expectedComponentType: string;
  /** Expected safety flags. */
  readonly expectedSafetyBoundary: DashboardSafetyBoundary;
  /** Whether this snapshot represents an error or unavailable state. */
  readonly isErrorState: boolean;
  /** Whether this snapshot represents an empty or no-results state. */
  readonly isEmptyState: boolean;
  /** Whether this snapshot was built from filtered state. */
  readonly isFilteredState: boolean;
}

// ─── Regression fixture ───────────────────────────────────────────────────────

/**
 * A named regression fixture pairing a snapshot with its stable expected output.
 */
export interface DashboardRenderSnapshotFixture {
  /** The regression fixture name (same as snapshot name). */
  readonly name: DashboardRenderSnapshotName;
  /** Human-readable description of the fixture. */
  readonly description: string;
  /** The stable snapshot. */
  readonly snapshot: DashboardRenderSnapshot;
}

/**
 * A suite of regression fixtures for a related group of dashboard render snapshots.
 */
export interface DashboardRenderSnapshotSuite {
  /** Human-readable suite name. */
  readonly suiteName: string;
  /** Human-readable suite description. */
  readonly description: string;
  /** The fixtures in this suite. */
  readonly fixtures: readonly DashboardRenderSnapshotFixture[];
}

// ─── Regression case ─────────────────────────────────────────────────────────

/**
 * A single regression test case comparing a live snapshot against a stored fixture.
 */
export interface DashboardRenderSnapshotRegressionCase {
  /** The fixture name being tested. */
  readonly name: DashboardRenderSnapshotName;
  /** The stored stable fixture. */
  readonly fixture: DashboardRenderSnapshotFixture;
  /** The newly built snapshot to compare against the fixture. */
  readonly current: DashboardRenderSnapshot;
  /** Whether this regression case passes (current matches fixture). */
  readonly passes: boolean;
  /** Issues detected during regression comparison. */
  readonly issues: readonly string[];
}

// ─── Build input / result ─────────────────────────────────────────────────────

/**
 * Input for building a dashboard render snapshot.
 */
export interface DashboardRenderSnapshotBuildInput {
  /** Snapshot name to use. */
  readonly name: DashboardRenderSnapshotName;
  /** Snapshot kind to use. */
  readonly kind: DashboardRenderSnapshotKind;
  /** Source view model (from Phase 24 fixtures). */
  readonly viewModel: DashboardViewModel;
  /** Optional interaction state (from Phase 26). */
  readonly interactionState?: DashboardInteractionState | undefined;
  /** Optional selector result (from Phase 26). */
  readonly selectorResult?: DashboardStateSelectorResult | undefined;
  /** Human-readable notes for this snapshot. */
  readonly notes: string;
}

/**
 * Result of building a dashboard render snapshot.
 */
export interface DashboardRenderSnapshotBuildResult {
  /** Whether the build succeeded. */
  readonly success: boolean;
  /** The built snapshot if successful. */
  readonly snapshot: DashboardRenderSnapshot | null;
  /** Issues detected during build. */
  readonly issues: readonly string[];
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * A single validation issue found in a snapshot.
 */
export interface DashboardRenderSnapshotValidationIssue {
  /** Machine-readable issue code. */
  readonly code: string;
  /** Human-readable message. */
  readonly message: string;
  /** The field path that failed validation. */
  readonly field: string;
}

/**
 * The result of validating a dashboard render snapshot.
 */
export interface DashboardRenderSnapshotValidationResult {
  /** Whether the snapshot is valid. */
  readonly valid: boolean;
  /** Issues found during validation. */
  readonly issues: readonly DashboardRenderSnapshotValidationIssue[];
}

// ─── Safety result ────────────────────────────────────────────────────────────

/**
 * The result of a snapshot safety check.
 */
export interface DashboardRenderSnapshotSafetyResult {
  /** Whether the snapshot passes all safety checks. */
  readonly safe: boolean;
  /** Safety violations found (if any). */
  readonly violations: readonly string[];
}

// ─── Phase 27 capabilities ────────────────────────────────────────────────────

/** Phase 27 dashboard render snapshot capabilities (all unsafe flags false). */
export interface DashboardSnapshotCapabilities {
  readonly dashboardRenderSnapshots: true;
  readonly dashboardRegressionFixtures: true;
  readonly deterministicRenderSnapshots: true;
  readonly snapshotSafetyValidation: true;
  readonly fixtureBackedRenderSnapshots: true;
  readonly dashboardSnapshotPersistence: false;
  readonly dashboardSnapshotExternalNetwork: false;
  readonly dashboardSnapshotLiveData: false;
  readonly dashboardSnapshotMutationControls: false;
}
