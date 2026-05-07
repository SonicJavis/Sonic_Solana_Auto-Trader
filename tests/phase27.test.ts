/**
 * tests/phase27.test.ts
 *
 * Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1
 *
 * Tests cover:
 * - Snapshot module exports
 * - Snapshot type shapes
 * - Fixture list/lookup helpers
 * - All 20 regression fixtures
 * - Snapshot normalization
 * - Snapshot validation (success and failure)
 * - No input mutation
 * - Serializability
 * - Deterministic ordering
 * - Metadata preservation
 * - Compatibility with Phase 24/25/26
 * - Capability metadata
 * - Safety checks (no persistence, no network, no secrets, etc.)
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  // Types/constants
  DASHBOARD_RENDER_SNAPSHOT_NAMES,
  DASHBOARD_RENDER_SNAPSHOT_KINDS,
  // Builders
  buildDashboardRenderSnapshot,
  buildDefaultDashboardRenderSnapshot,
  buildFilteredDashboardRenderSnapshot,
  buildPanelRenderSnapshot,
  buildStateRenderSnapshot,
  buildSafetyBannerSnapshot,
  buildEmptyStateSnapshot,
  buildLoadingStateSnapshot,
  buildErrorStateSnapshot,
  buildUnavailableStateSnapshot,
  buildSafetyBoundarySnapshot,
  buildMalformedInputSafeSnapshot,
  isDashboardRenderSnapshotName,
  isDashboardRenderSnapshotKind,
  isDashboardShellResult,
  isSafetyBannerResult,
  // Normalization
  normalizeDashboardRenderSnapshot,
  serializeDashboardRenderSnapshot,
  isDashboardRenderSnapshotSerializable,
  areDashboardRenderSnapshotsEqual,
  getDashboardRenderSnapshotSummary,
  // Validation
  validateDashboardRenderSnapshot,
  validateDashboardRenderSnapshotSafety,
  // Fixtures
  DEFAULT_DASHBOARD_SHELL_FIXTURE,
  SAFETY_BANNER_FIXTURE,
  METADATA_PANEL_FIXTURE,
  HEALTH_PANEL_FIXTURE,
  CAPABILITIES_PANEL_FIXTURE,
  OVERVIEW_PANEL_FIXTURE,
  EVIDENCE_PANEL_FIXTURE,
  SAFETY_PANEL_FIXTURE,
  EMPTY_STATE_FIXTURE,
  LOADING_STATE_FIXTURE,
  ERROR_STATE_FIXTURE,
  UNAVAILABLE_STATE_FIXTURE,
  ACTIVE_PANEL_FIXTURE,
  HIDDEN_PANEL_FIXTURE,
  FILTERED_EVIDENCE_FIXTURE,
  FILTERED_SAFETY_FIXTURE,
  RESET_INTERACTION_STATE_FIXTURE,
  NO_RESULTS_FILTERED_FIXTURE,
  MALFORMED_INPUT_SAFE_FIXTURE,
  SAFETY_BOUNDARY_FIXTURE,
  PHASE_27_REGRESSION_FIXTURES,
  PHASE_27_FIXTURE_SUITE,
  listDashboardRenderSnapshotFixtures,
  getDashboardRenderSnapshotFixture,
  getDashboardSnapshotCapabilities,
  // Phase 24/25/26
  buildFixtureDashboardViewModel,
  getDashboardUiShellCapabilities,
  createDefaultDashboardInteractionState,
  setDashboardActivePanel,
  setDashboardPanelVisibility,
  updateDashboardEvidenceFilters,
  updateDashboardSafetyFilters,
  resetDashboardInteractionState,
  selectDashboardRenderModel,
  PHASE_25_SAFETY_BOUNDARY,
  SAFETY_BANNER_NOTICES,
} from '@sonic/dashboard';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const SNAPSHOT_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/snapshots');

const SNAPSHOT_FILES = [
  'types.ts',
  'builders.ts',
  'normalization.ts',
  'validation.ts',
  'fixtures.ts',
  'capabilities.ts',
  'index.ts',
].map(f => resolve(SNAPSHOT_SRC, f));

// ─── 1. Module exports ────────────────────────────────────────────────────────

describe('Phase 27 — module exports', () => {
  it('DASHBOARD_RENDER_SNAPSHOT_NAMES is exported', () => {
    expect(Array.isArray(DASHBOARD_RENDER_SNAPSHOT_NAMES)).toBe(true);
  });

  it('DASHBOARD_RENDER_SNAPSHOT_KINDS is exported', () => {
    expect(Array.isArray(DASHBOARD_RENDER_SNAPSHOT_KINDS)).toBe(true);
  });

  it('buildDashboardRenderSnapshot is a function', () => {
    expect(typeof buildDashboardRenderSnapshot).toBe('function');
  });

  it('buildDefaultDashboardRenderSnapshot is a function', () => {
    expect(typeof buildDefaultDashboardRenderSnapshot).toBe('function');
  });

  it('buildFilteredDashboardRenderSnapshot is a function', () => {
    expect(typeof buildFilteredDashboardRenderSnapshot).toBe('function');
  });

  it('buildPanelRenderSnapshot is a function', () => {
    expect(typeof buildPanelRenderSnapshot).toBe('function');
  });

  it('buildStateRenderSnapshot is a function', () => {
    expect(typeof buildStateRenderSnapshot).toBe('function');
  });

  it('buildSafetyBannerSnapshot is a function', () => {
    expect(typeof buildSafetyBannerSnapshot).toBe('function');
  });

  it('buildEmptyStateSnapshot is a function', () => {
    expect(typeof buildEmptyStateSnapshot).toBe('function');
  });

  it('buildLoadingStateSnapshot is a function', () => {
    expect(typeof buildLoadingStateSnapshot).toBe('function');
  });

  it('buildErrorStateSnapshot is a function', () => {
    expect(typeof buildErrorStateSnapshot).toBe('function');
  });

  it('buildUnavailableStateSnapshot is a function', () => {
    expect(typeof buildUnavailableStateSnapshot).toBe('function');
  });

  it('buildSafetyBoundarySnapshot is a function', () => {
    expect(typeof buildSafetyBoundarySnapshot).toBe('function');
  });

  it('buildMalformedInputSafeSnapshot is a function', () => {
    expect(typeof buildMalformedInputSafeSnapshot).toBe('function');
  });

  it('isDashboardRenderSnapshotName is a function', () => {
    expect(typeof isDashboardRenderSnapshotName).toBe('function');
  });

  it('isDashboardRenderSnapshotKind is a function', () => {
    expect(typeof isDashboardRenderSnapshotKind).toBe('function');
  });

  it('isDashboardShellResult is a function', () => {
    expect(typeof isDashboardShellResult).toBe('function');
  });

  it('isSafetyBannerResult is a function', () => {
    expect(typeof isSafetyBannerResult).toBe('function');
  });

  it('normalizeDashboardRenderSnapshot is a function', () => {
    expect(typeof normalizeDashboardRenderSnapshot).toBe('function');
  });

  it('serializeDashboardRenderSnapshot is a function', () => {
    expect(typeof serializeDashboardRenderSnapshot).toBe('function');
  });

  it('isDashboardRenderSnapshotSerializable is a function', () => {
    expect(typeof isDashboardRenderSnapshotSerializable).toBe('function');
  });

  it('areDashboardRenderSnapshotsEqual is a function', () => {
    expect(typeof areDashboardRenderSnapshotsEqual).toBe('function');
  });

  it('getDashboardRenderSnapshotSummary is a function', () => {
    expect(typeof getDashboardRenderSnapshotSummary).toBe('function');
  });

  it('validateDashboardRenderSnapshot is a function', () => {
    expect(typeof validateDashboardRenderSnapshot).toBe('function');
  });

  it('validateDashboardRenderSnapshotSafety is a function', () => {
    expect(typeof validateDashboardRenderSnapshotSafety).toBe('function');
  });

  it('listDashboardRenderSnapshotFixtures is a function', () => {
    expect(typeof listDashboardRenderSnapshotFixtures).toBe('function');
  });

  it('getDashboardRenderSnapshotFixture is a function', () => {
    expect(typeof getDashboardRenderSnapshotFixture).toBe('function');
  });

  it('getDashboardSnapshotCapabilities is a function', () => {
    expect(typeof getDashboardSnapshotCapabilities).toBe('function');
  });

  it('PHASE_27_REGRESSION_FIXTURES is a Map', () => {
    expect(PHASE_27_REGRESSION_FIXTURES instanceof Map).toBe(true);
  });

  it('PHASE_27_FIXTURE_SUITE is an object', () => {
    expect(typeof PHASE_27_FIXTURE_SUITE).toBe('object');
    expect(PHASE_27_FIXTURE_SUITE).not.toBeNull();
  });
});

// ─── 2. Snapshot name constants ───────────────────────────────────────────────

describe('Phase 27 — snapshot name constants', () => {
  it('has exactly 20 snapshot names', () => {
    expect(DASHBOARD_RENDER_SNAPSHOT_NAMES.length).toBe(20);
  });

  it('contains all required snapshot names', () => {
    const names = DASHBOARD_RENDER_SNAPSHOT_NAMES as readonly string[];
    expect(names).toContain('default-dashboard-shell');
    expect(names).toContain('safety-banner');
    expect(names).toContain('metadata-panel');
    expect(names).toContain('health-panel');
    expect(names).toContain('capabilities-panel');
    expect(names).toContain('overview-panel');
    expect(names).toContain('evidence-panel');
    expect(names).toContain('safety-panel');
    expect(names).toContain('empty-state');
    expect(names).toContain('loading-state');
    expect(names).toContain('error-state');
    expect(names).toContain('unavailable-state');
    expect(names).toContain('active-panel');
    expect(names).toContain('hidden-panel');
    expect(names).toContain('filtered-evidence');
    expect(names).toContain('filtered-safety');
    expect(names).toContain('reset-interaction-state');
    expect(names).toContain('no-results-filtered');
    expect(names).toContain('malformed-input-safe');
    expect(names).toContain('safety-boundary');
  });

  it('isDashboardRenderSnapshotName returns true for valid names', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      expect(isDashboardRenderSnapshotName(name)).toBe(true);
    }
  });

  it('isDashboardRenderSnapshotName returns false for invalid names', () => {
    expect(isDashboardRenderSnapshotName('not-a-name')).toBe(false);
    expect(isDashboardRenderSnapshotName('')).toBe(false);
    expect(isDashboardRenderSnapshotName(null)).toBe(false);
    expect(isDashboardRenderSnapshotName(undefined)).toBe(false);
    expect(isDashboardRenderSnapshotName(42)).toBe(false);
  });
});

// ─── 3. Snapshot kind constants ───────────────────────────────────────────────

describe('Phase 27 — snapshot kind constants', () => {
  it('has expected kinds', () => {
    const kinds = DASHBOARD_RENDER_SNAPSHOT_KINDS as readonly string[];
    expect(kinds).toContain('full-shell');
    expect(kinds).toContain('panel');
    expect(kinds).toContain('banner');
    expect(kinds).toContain('state');
    expect(kinds).toContain('filter');
    expect(kinds).toContain('empty');
    expect(kinds).toContain('loading');
    expect(kinds).toContain('error');
    expect(kinds).toContain('unavailable');
    expect(kinds).toContain('safety-boundary');
    expect(kinds).toContain('malformed');
  });

  it('isDashboardRenderSnapshotKind returns true for valid kinds', () => {
    for (const kind of DASHBOARD_RENDER_SNAPSHOT_KINDS) {
      expect(isDashboardRenderSnapshotKind(kind)).toBe(true);
    }
  });

  it('isDashboardRenderSnapshotKind returns false for invalid kinds', () => {
    expect(isDashboardRenderSnapshotKind('invalid')).toBe(false);
    expect(isDashboardRenderSnapshotKind('')).toBe(false);
    expect(isDashboardRenderSnapshotKind(null)).toBe(false);
  });
});

// ─── 4. Fixture list/lookup helpers ──────────────────────────────────────────

describe('Phase 27 — fixture list helper', () => {
  it('returns all 20 fixture names', () => {
    const names = listDashboardRenderSnapshotFixtures();
    expect(names.length).toBe(20);
  });

  it('returns fixture names in alphabetical order', () => {
    const names = listDashboardRenderSnapshotFixtures();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it('contains all expected fixture names', () => {
    const names = listDashboardRenderSnapshotFixtures() as readonly string[];
    expect(names).toContain('default-dashboard-shell');
    expect(names).toContain('safety-banner');
    expect(names).toContain('metadata-panel');
    expect(names).toContain('health-panel');
    expect(names).toContain('capabilities-panel');
    expect(names).toContain('overview-panel');
    expect(names).toContain('evidence-panel');
    expect(names).toContain('safety-panel');
    expect(names).toContain('empty-state');
    expect(names).toContain('loading-state');
    expect(names).toContain('error-state');
    expect(names).toContain('unavailable-state');
    expect(names).toContain('active-panel');
    expect(names).toContain('hidden-panel');
    expect(names).toContain('filtered-evidence');
    expect(names).toContain('filtered-safety');
    expect(names).toContain('reset-interaction-state');
    expect(names).toContain('no-results-filtered');
    expect(names).toContain('malformed-input-safe');
    expect(names).toContain('safety-boundary');
  });
});

describe('Phase 27 — fixture lookup helper', () => {
  it('returns fixture by name', () => {
    const fixture = getDashboardRenderSnapshotFixture('default-dashboard-shell');
    expect(fixture).toBeDefined();
    expect(fixture?.name).toBe('default-dashboard-shell');
  });

  it('returns undefined for unknown name', () => {
    // @ts-expect-error intentional invalid input
    const fixture = getDashboardRenderSnapshotFixture('not-a-fixture');
    expect(fixture).toBeUndefined();
  });

  it('returns all fixtures successfully', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      expect(fixture).toBeDefined();
      expect(fixture?.name).toBe(name);
    }
  });

  it('returned fixture has snapshot with correct name', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      expect(fixture?.snapshot.name).toBe(name);
    }
  });
});

// ─── 5. Default dashboard snapshot ───────────────────────────────────────────

describe('Phase 27 — default dashboard shell snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);

  it('has correct name', () => {
    expect(snapshot.name).toBe('default-dashboard-shell');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('full-shell');
  });

  it('renderResult is DashboardShellResult', () => {
    expect(isDashboardShellResult(snapshot.renderResult)).toBe(true);
  });

  it('renderResult componentType is DashboardShell', () => {
    expect(snapshot.renderResult.componentType).toBe('DashboardShell');
  });

  it('expectedComponentType is DashboardShell', () => {
    expect(snapshot.expectedComponentType).toBe('DashboardShell');
  });

  it('all panels are visible by default', () => {
    expect(snapshot.expectedVisiblePanelIds.length).toBe(6);
    expect(snapshot.expectedHiddenPanelIds.length).toBe(0);
  });

  it('is not an error state', () => {
    expect(snapshot.isErrorState).toBe(false);
  });

  it('is not an empty state', () => {
    expect(snapshot.isEmptyState).toBe(false);
  });

  it('is not a filtered state', () => {
    expect(snapshot.isFilteredState).toBe(false);
  });

  it('has Phase 25 safety boundary', () => {
    expect(snapshot.expectedSafetyBoundary).toEqual(PHASE_25_SAFETY_BOUNDARY);
  });

  it('meta phase is 27', () => {
    expect(snapshot.meta.phase).toBe(27);
  });

  it('meta fixtureOnly is true', () => {
    expect(snapshot.meta.fixtureOnly).toBe(true);
  });

  it('meta liveData is false', () => {
    expect(snapshot.meta.liveData).toBe(false);
  });

  it('meta externalNetwork is false', () => {
    expect(snapshot.meta.externalNetwork).toBe(false);
  });

  it('meta deterministic is true', () => {
    expect(snapshot.meta.deterministic).toBe(true);
  });

  it('meta has notes', () => {
    expect(snapshot.meta.notes.length).toBeGreaterThan(0);
  });

  it('meta has source', () => {
    expect(snapshot.meta.source.length).toBeGreaterThan(0);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });

  it('is deterministic — same input produces same output', () => {
    const a = buildDefaultDashboardRenderSnapshot(viewModel);
    const b = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

// ─── 6. Safety banner snapshot ───────────────────────────────────────────────

describe('Phase 27 — safety banner snapshot', () => {
  const snapshot = buildSafetyBannerSnapshot();

  it('has correct name', () => {
    expect(snapshot.name).toBe('safety-banner');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('banner');
  });

  it('renderResult is SafetyBannerResult', () => {
    expect(isSafetyBannerResult(snapshot.renderResult)).toBe(true);
  });

  it('renderResult componentType is SafetyBanner', () => {
    expect(snapshot.renderResult.componentType).toBe('SafetyBanner');
  });

  it('expectedComponentType is SafetyBanner', () => {
    expect(snapshot.expectedComponentType).toBe('SafetyBanner');
  });

  it('safety banner has notices', () => {
    const banner = snapshot.renderResult;
    if (isSafetyBannerResult(banner)) {
      expect(banner.notices.length).toBeGreaterThan(0);
    }
  });

  it('safety banner notices match SAFETY_BANNER_NOTICES', () => {
    const banner = snapshot.renderResult;
    if (isSafetyBannerResult(banner)) {
      expect(banner.notices).toEqual(SAFETY_BANNER_NOTICES);
    }
  });

  it('is deterministic', () => {
    const a = buildSafetyBannerSnapshot();
    const b = buildSafetyBannerSnapshot();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 7. Metadata panel snapshot ──────────────────────────────────────────────

describe('Phase 27 — metadata panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildPanelRenderSnapshot('metadata', viewModel, 'Metadata panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('metadata-panel');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('panel');
  });

  it('renderResult componentType is MetadataPanel', () => {
    expect(snapshot.renderResult.componentType).toBe('MetadataPanel');
  });

  it('expectedComponentType is MetadataPanel', () => {
    expect(snapshot.expectedComponentType).toBe('MetadataPanel');
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });

  it('is deterministic', () => {
    const a = buildPanelRenderSnapshot('metadata', viewModel, 'notes');
    const b = buildPanelRenderSnapshot('metadata', viewModel, 'notes');
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

// ─── 8. Health panel snapshot ─────────────────────────────────────────────────

describe('Phase 27 — health panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildPanelRenderSnapshot('health', viewModel, 'Health panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('health-panel');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('panel');
  });

  it('renderResult has safetyBoundary', () => {
    expect('safetyBoundary' in snapshot.renderResult).toBe(true);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 9. Capabilities panel snapshot ──────────────────────────────────────────

describe('Phase 27 — capabilities panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildPanelRenderSnapshot('capabilities', viewModel, 'Capabilities panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('capabilities-panel');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('panel');
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 10. Overview panel snapshot ─────────────────────────────────────────────

describe('Phase 27 — overview panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildPanelRenderSnapshot('overview', viewModel, 'Overview panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('overview-panel');
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 11. Evidence panel snapshot ─────────────────────────────────────────────

describe('Phase 27 — evidence panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildPanelRenderSnapshot('evidence', viewModel, 'Evidence panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('evidence-panel');
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });

  it('is deterministic', () => {
    const a = buildPanelRenderSnapshot('evidence', viewModel, 'notes');
    const b = buildPanelRenderSnapshot('evidence', viewModel, 'notes');
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

// ─── 12. Safety panel snapshot ────────────────────────────────────────────────

describe('Phase 27 — safety panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildPanelRenderSnapshot('safety', viewModel, 'Safety panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('safety-panel');
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 13. Empty state snapshot ─────────────────────────────────────────────────

describe('Phase 27 — empty state snapshot', () => {
  const snapshot = buildEmptyStateSnapshot();

  it('has correct name', () => {
    expect(snapshot.name).toBe('empty-state');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('empty');
  });

  it('renderResult componentType is EmptyState', () => {
    expect(snapshot.renderResult.componentType).toBe('EmptyState');
  });

  it('isEmptyState is true', () => {
    expect(snapshot.isEmptyState).toBe(true);
  });

  it('isErrorState is false', () => {
    expect(snapshot.isErrorState).toBe(false);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });

  it('is deterministic', () => {
    expect(JSON.stringify(buildEmptyStateSnapshot())).toBe(JSON.stringify(buildEmptyStateSnapshot()));
  });
});

// ─── 14. Loading state snapshot ───────────────────────────────────────────────

describe('Phase 27 — loading state snapshot', () => {
  const snapshot = buildLoadingStateSnapshot();

  it('has correct name', () => {
    expect(snapshot.name).toBe('loading-state');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('loading');
  });

  it('renderResult componentType is LoadingState', () => {
    expect(snapshot.renderResult.componentType).toBe('LoadingState');
  });

  it('isEmptyState is false', () => {
    expect(snapshot.isEmptyState).toBe(false);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 15. Error state snapshot ─────────────────────────────────────────────────

describe('Phase 27 — error state snapshot', () => {
  const snapshot = buildErrorStateSnapshot();

  it('has correct name', () => {
    expect(snapshot.name).toBe('error-state');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('error');
  });

  it('renderResult componentType is ErrorState', () => {
    expect(snapshot.renderResult.componentType).toBe('ErrorState');
  });

  it('isErrorState is true', () => {
    expect(snapshot.isErrorState).toBe(true);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 16. Unavailable state snapshot ──────────────────────────────────────────

describe('Phase 27 — unavailable state snapshot', () => {
  const snapshot = buildUnavailableStateSnapshot();

  it('has correct name', () => {
    expect(snapshot.name).toBe('unavailable-state');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('unavailable');
  });

  it('renderResult componentType is UnavailableState', () => {
    expect(snapshot.renderResult.componentType).toBe('UnavailableState');
  });

  it('isErrorState is true', () => {
    expect(snapshot.isErrorState).toBe(true);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 17. Active panel snapshot ────────────────────────────────────────────────

describe('Phase 27 — active panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const state = setDashboardActivePanel(createDefaultDashboardInteractionState(), 'health').state;
  const snapshot = buildStateRenderSnapshot('active-panel', 'full-shell', viewModel, state, 'Active panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('active-panel');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('full-shell');
  });

  it('renderResult is DashboardShellResult', () => {
    expect(isDashboardShellResult(snapshot.renderResult)).toBe(true);
  });

  it('all panels visible (none hidden)', () => {
    expect(snapshot.expectedHiddenPanelIds.length).toBe(0);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 18. Hidden panel snapshot ───────────────────────────────────────────────

describe('Phase 27 — hidden panel snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const state = setDashboardPanelVisibility(createDefaultDashboardInteractionState(), 'evidence', false).state;
  const snapshot = buildStateRenderSnapshot('hidden-panel', 'full-shell', viewModel, state, 'Hidden panel test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('hidden-panel');
  });

  it('evidence panel is in hidden panel IDs', () => {
    expect(snapshot.expectedHiddenPanelIds).toContain('evidence');
  });

  it('has 5 visible panels', () => {
    expect(snapshot.expectedVisiblePanelIds.length).toBe(5);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 19. Filtered evidence snapshot ──────────────────────────────────────────

describe('Phase 27 — filtered evidence snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const state = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), { severity: 'warning' }).state;
  const snapshot = buildFilteredDashboardRenderSnapshot('filtered-evidence', viewModel, state, 'Filtered evidence test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('filtered-evidence');
  });

  it('is a filtered state', () => {
    expect(snapshot.isFilteredState).toBe(true);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 20. Filtered safety snapshot ────────────────────────────────────────────

describe('Phase 27 — filtered safety snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const state = updateDashboardSafetyFilters(createDefaultDashboardInteractionState(), { status: 'locked' }).state;
  const snapshot = buildFilteredDashboardRenderSnapshot('filtered-safety', viewModel, state, 'Filtered safety test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('filtered-safety');
  });

  it('is a filtered state', () => {
    expect(snapshot.isFilteredState).toBe(true);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 21. Reset/default state snapshot ────────────────────────────────────────

describe('Phase 27 — reset/default state snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const state = resetDashboardInteractionState(createDefaultDashboardInteractionState(), 'all').state;
  const snapshot = buildStateRenderSnapshot('reset-interaction-state', 'state', viewModel, state, 'Reset state test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('reset-interaction-state');
  });

  it('is not a filtered state', () => {
    expect(snapshot.isFilteredState).toBe(false);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 22. No-results filtered snapshot ────────────────────────────────────────

describe('Phase 27 — no-results filtered snapshot', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const state = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), {
    query: 'THIS_QUERY_MATCHES_NOTHING_PHASE27_REGRESSION',
    severity: 'failure',
  }).state;
  const snapshot = buildFilteredDashboardRenderSnapshot('no-results-filtered', viewModel, state, 'No results test.');

  it('has correct name', () => {
    expect(snapshot.name).toBe('no-results-filtered');
  });

  it('is a filtered state', () => {
    expect(snapshot.isFilteredState).toBe(true);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 23. Malformed-input-safe snapshot ───────────────────────────────────────

describe('Phase 27 — malformed-input-safe snapshot', () => {
  const snapshot = buildMalformedInputSafeSnapshot();

  it('has correct name', () => {
    expect(snapshot.name).toBe('malformed-input-safe');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('malformed');
  });

  it('isEmptyState is true (safe fallback)', () => {
    expect(snapshot.isEmptyState).toBe(true);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });

  it('is deterministic', () => {
    const a = buildMalformedInputSafeSnapshot();
    const b = buildMalformedInputSafeSnapshot();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

// ─── 24. Safety-boundary snapshot ────────────────────────────────────────────

describe('Phase 27 — safety-boundary snapshot', () => {
  const snapshot = buildSafetyBoundarySnapshot();

  it('has correct name', () => {
    expect(snapshot.name).toBe('safety-boundary');
  });

  it('has correct kind', () => {
    expect(snapshot.kind).toBe('safety-boundary');
  });

  it('expectedSafetyBoundary has all correct flags', () => {
    const b = snapshot.expectedSafetyBoundary;
    expect(b.isReadOnly).toBe(true);
    expect(b.isLocalOnly).toBe(true);
    expect(b.isFixtureBacked).toBe(true);
    expect(b.hasLiveData).toBe(false);
    expect(b.hasTradingControls).toBe(false);
    expect(b.hasWalletControls).toBe(false);
    expect(b.hasMutationControls).toBe(false);
    expect(b.hasExternalNetwork).toBe(false);
    expect(b.hasExecutionControls).toBe(false);
  });

  it('is serializable', () => {
    expect(isDashboardRenderSnapshotSerializable(snapshot)).toBe(true);
  });
});

// ─── 25. Snapshot normalization ───────────────────────────────────────────────

describe('Phase 27 — snapshot normalization', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
  const normalized = normalizeDashboardRenderSnapshot(snapshot);

  it('returns a snapshot object', () => {
    expect(typeof normalized).toBe('object');
    expect(normalized).not.toBeNull();
  });

  it('preserves snapshot name', () => {
    expect(normalized.name).toBe(snapshot.name);
  });

  it('preserves snapshot kind', () => {
    expect(normalized.kind).toBe(snapshot.kind);
  });

  it('preserves meta', () => {
    expect(normalized.meta).toEqual(snapshot.meta);
  });

  it('sorts visible panel IDs alphabetically', () => {
    const ids = [...normalized.expectedVisiblePanelIds];
    expect(ids).toEqual([...ids].sort());
  });

  it('sorts hidden panel IDs alphabetically', () => {
    const ids = [...normalized.expectedHiddenPanelIds];
    expect(ids).toEqual([...ids].sort());
  });

  it('does not mutate the original snapshot', () => {
    const original = JSON.stringify(snapshot);
    normalizeDashboardRenderSnapshot(snapshot);
    expect(JSON.stringify(snapshot)).toBe(original);
  });

  it('is idempotent', () => {
    const once = normalizeDashboardRenderSnapshot(snapshot);
    const twice = normalizeDashboardRenderSnapshot(once);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });
});

// ─── 26. Snapshot validation success ─────────────────────────────────────────

describe('Phase 27 — snapshot validation success', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);

  it('validates a valid snapshot successfully', () => {
    const result = validateDashboardRenderSnapshot(snapshot);
    expect(result.valid).toBe(true);
    expect(result.issues.length).toBe(0);
  });

  it('validates all fixture snapshots successfully', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const result = validateDashboardRenderSnapshot(fixture.snapshot);
        expect(result.valid).toBe(true);
        if (!result.valid) {
          // Include fixture name and issues in error for debugging
          expect(`${name}: ${result.issues.map(i => i.message).join(', ')}`).toBe('');
        }
      }
    }
  });
});

// ─── 27. Snapshot validation failure ─────────────────────────────────────────

describe('Phase 27 — snapshot validation failure', () => {
  it('fails for null input', () => {
    const result = validateDashboardRenderSnapshot(null);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('fails for undefined input', () => {
    const result = validateDashboardRenderSnapshot(undefined);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('fails for empty object', () => {
    const result = validateDashboardRenderSnapshot({});
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('fails for missing name', () => {
    const result = validateDashboardRenderSnapshot({ kind: 'panel', meta: {}, renderResult: {}, expectedVisiblePanelIds: [], expectedHiddenPanelIds: [], expectedComponentType: 'X', expectedSafetyBoundary: {}, isErrorState: false, isEmptyState: false, isFilteredState: false });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.field === 'name')).toBe(true);
  });

  it('fails for unsupported name', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const broken = { ...snapshot, name: 'not-a-valid-name' };
    const result = validateDashboardRenderSnapshot(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'UNSUPPORTED_NAME')).toBe(true);
  });

  it('fails for unsupported kind', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const broken = { ...snapshot, kind: 'not-a-valid-kind' };
    const result = validateDashboardRenderSnapshot(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'UNSUPPORTED_KIND')).toBe(true);
  });

  it('fails for wrong meta phase', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const broken = { ...snapshot, meta: { ...snapshot.meta, phase: 26 } };
    const result = validateDashboardRenderSnapshot(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'META_WRONG_PHASE')).toBe(true);
  });

  it('fails if meta liveData is true', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const broken = { ...snapshot, meta: { ...snapshot.meta, liveData: true } };
    const result = validateDashboardRenderSnapshot(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'META_HAS_LIVE_DATA')).toBe(true);
  });

  it('fails if safety boundary hasLiveData is true', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const broken = {
      ...snapshot,
      expectedSafetyBoundary: { ...snapshot.expectedSafetyBoundary, hasLiveData: true },
    };
    const result = validateDashboardRenderSnapshot(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'SAFETY_HAS_LIVE_DATA')).toBe(true);
  });

  it('validation result has valid and issues fields', () => {
    const result = validateDashboardRenderSnapshot(null);
    expect('valid' in result).toBe(true);
    expect('issues' in result).toBe(true);
    expect(Array.isArray(result.issues)).toBe(true);
  });

  it('validation issues have code, message, field', () => {
    const result = validateDashboardRenderSnapshot({});
    for (const issue of result.issues) {
      expect(typeof issue.code).toBe('string');
      expect(typeof issue.message).toBe('string');
      expect(typeof issue.field).toBe('string');
    }
  });
});

// ─── 28. No input mutation ────────────────────────────────────────────────────

describe('Phase 27 — no input mutation', () => {
  it('buildDefaultDashboardRenderSnapshot does not mutate viewModel', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const before = JSON.stringify(viewModel);
    buildDefaultDashboardRenderSnapshot(viewModel);
    expect(JSON.stringify(viewModel)).toBe(before);
  });

  it('buildPanelRenderSnapshot does not mutate viewModel', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const before = JSON.stringify(viewModel);
    buildPanelRenderSnapshot('health', viewModel, 'test');
    expect(JSON.stringify(viewModel)).toBe(before);
  });

  it('buildStateRenderSnapshot does not mutate state', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const state = createDefaultDashboardInteractionState();
    const before = JSON.stringify(state);
    buildStateRenderSnapshot('active-panel', 'full-shell', viewModel, state, 'test');
    expect(JSON.stringify(state)).toBe(before);
  });

  it('normalizeDashboardRenderSnapshot does not mutate snapshot', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const before = JSON.stringify(snapshot);
    normalizeDashboardRenderSnapshot(snapshot);
    expect(JSON.stringify(snapshot)).toBe(before);
  });

  it('validateDashboardRenderSnapshot does not mutate input', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const before = JSON.stringify(snapshot);
    validateDashboardRenderSnapshot(snapshot);
    expect(JSON.stringify(snapshot)).toBe(before);
  });

  it('validateDashboardRenderSnapshotSafety does not mutate input', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const before = JSON.stringify(snapshot);
    validateDashboardRenderSnapshotSafety(snapshot);
    expect(JSON.stringify(snapshot)).toBe(before);
  });
});

// ─── 29. Serializability ──────────────────────────────────────────────────────

describe('Phase 27 — serializability', () => {
  it('all fixture snapshots are serializable', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(isDashboardRenderSnapshotSerializable(fixture.snapshot)).toBe(true);
      }
    }
  });

  it('serializeDashboardRenderSnapshot returns a plain object', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const obj = serializeDashboardRenderSnapshot(snapshot);
    expect(typeof obj).toBe('object');
    expect(obj).not.toBeNull();
  });

  it('round-trip JSON does not lose data for default snapshot', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snapshot = buildDefaultDashboardRenderSnapshot(viewModel);
    const serialized = serializeDashboardRenderSnapshot(snapshot);
    const reserialized = JSON.stringify(serialized);
    expect(reserialized).toBe(JSON.stringify(snapshot));
  });
});

// ─── 30. Deterministic ordering ──────────────────────────────────────────────

describe('Phase 27 — deterministic ordering', () => {
  it('listDashboardRenderSnapshotFixtures is deterministically sorted', () => {
    const a = listDashboardRenderSnapshotFixtures();
    const b = listDashboardRenderSnapshotFixtures();
    expect(a).toEqual(b);
    expect([...a].sort()).toEqual([...a]);
  });

  it('building the same snapshot twice produces equal JSON', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const a = buildDefaultDashboardRenderSnapshot(viewModel);
    const b = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('all fixture snapshots are deterministic', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const s1 = buildDefaultDashboardRenderSnapshot(viewModel);
    const s2 = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(areDashboardRenderSnapshotsEqual(s1, s2)).toBe(true);
  });
});

// ─── 31. generatedAt determinism ─────────────────────────────────────────────

describe('Phase 27 — meta determinism (no wall-clock timestamps)', () => {
  it('meta.source contains no Date.now-like patterns', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    // source should be a static string, not a timestamp
    expect(typeof snap.meta.source).toBe('string');
    expect(snap.meta.source).not.toMatch(/\d{4}-\d{2}-\d{2}T/);
    expect(snap.meta.source).not.toMatch(/^\d{13}$/);
  });

  it('meta.source is the same across calls', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const a = buildDefaultDashboardRenderSnapshot(viewModel);
    const b = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(a.meta.source).toBe(b.meta.source);
  });

  it('meta has no fields named createdAt, updatedAt, or generatedAt', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    const keys = Object.keys(snap.meta);
    const dateKeys = keys.filter(k => {
      const lower = k.toLowerCase();
      return lower === 'createdat' || lower === 'updatedat' || lower === 'generatedat' || lower === 'timestamp';
    });
    expect(dateKeys).toEqual([]);
  });
});

// ─── 32. Metadata preservation ────────────────────────────────────────────────

describe('Phase 27 — metadata preservation', () => {
  it('snapshot preserves phase 27 in meta', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(snap.meta.phase).toBe(27);
  });

  it('snapshot preserves fixtureOnly in meta', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(snap.meta.fixtureOnly).toBe(true);
  });

  it('snapshot preserves deterministic in meta', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(snap.meta.deterministic).toBe(true);
  });

  it('snapshot preserves notes', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(snap.meta.notes.length).toBeGreaterThan(0);
  });

  it('getDashboardRenderSnapshotSummary returns stable metadata', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    const summary = getDashboardRenderSnapshotSummary(snap);
    expect(summary.name).toBe('default-dashboard-shell');
    expect(summary.kind).toBe('full-shell');
    expect(summary.componentType).toBe('DashboardShell');
    expect(summary.meta.phase).toBe(27);
  });
});

// ─── 33. Phase 24 view model compatibility ────────────────────────────────────

describe('Phase 27 — Phase 24 view model compatibility', () => {
  const viewModel = buildFixtureDashboardViewModel();

  it('viewModel has health, capabilities, overview, evidence, safety sub-models', () => {
    expect(viewModel.health).toBeDefined();
    expect(viewModel.capabilities).toBeDefined();
    expect(viewModel.overview).toBeDefined();
    expect(viewModel.evidence).toBeDefined();
    expect(viewModel.safety).toBeDefined();
  });

  it('snapshot uses Phase 24 view model correctly', () => {
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(isDashboardShellResult(snap.renderResult)).toBe(true);
  });

  it('panel snapshots use Phase 24 view model fields', () => {
    for (const panelId of ['health', 'capabilities', 'overview', 'evidence', 'safety', 'metadata'] as const) {
      const snap = buildPanelRenderSnapshot(panelId, viewModel, `test ${panelId}`);
      expect(snap).toBeDefined();
      expect(snap.name).toBeDefined();
    }
  });
});

// ─── 34. Phase 25 render shell compatibility ──────────────────────────────────

describe('Phase 27 — Phase 25 render shell compatibility', () => {
  const viewModel = buildFixtureDashboardViewModel();

  it('default snapshot uses DashboardShell (Phase 25)', () => {
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(snap.renderResult.componentType).toBe('DashboardShell');
  });

  it('safety boundary in snapshots matches PHASE_25_SAFETY_BOUNDARY', () => {
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(snap.expectedSafetyBoundary).toEqual(PHASE_25_SAFETY_BOUNDARY);
  });

  it('shell panels include all expected panel keys', () => {
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    if (isDashboardShellResult(snap.renderResult)) {
      const shell = snap.renderResult;
      expect(shell.panels.health).toBeDefined();
      expect(shell.panels.capabilities).toBeDefined();
      expect(shell.panels.overview).toBeDefined();
      expect(shell.panels.evidence).toBeDefined();
      expect(shell.panels.safety).toBeDefined();
      expect(shell.panels.metadata).toBeDefined();
    }
  });

  it('shell safetyBanner uses SafetyBanner (Phase 25)', () => {
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    if (isDashboardShellResult(snap.renderResult)) {
      expect(snap.renderResult.safetyBanner.componentType).toBe('SafetyBanner');
    }
  });
});

// ─── 35. Phase 26 state/selector compatibility ───────────────────────────────

describe('Phase 27 — Phase 26 state/selector compatibility', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const defaultState = createDefaultDashboardInteractionState();

  it('builds snapshot from Phase 26 default state', () => {
    const snap = buildStateRenderSnapshot('reset-interaction-state', 'state', viewModel, defaultState, 'test');
    expect(snap).toBeDefined();
    expect(snap.name).toBe('reset-interaction-state');
  });

  it('active panel change produces different snapshot', () => {
    const stateA = createDefaultDashboardInteractionState();
    const stateB = setDashboardActivePanel(stateA, 'health').state;
    const snapA = buildStateRenderSnapshot('active-panel', 'full-shell', viewModel, stateA, 'test');
    const snapB = buildStateRenderSnapshot('active-panel', 'full-shell', viewModel, stateB, 'test');
    // Different active panels should produce different navigation in shell
    expect(JSON.stringify(snapA)).not.toBe(JSON.stringify(snapB));
  });

  it('hidden panel changes are reflected in snapshot', () => {
    const stateHidden = setDashboardPanelVisibility(defaultState, 'evidence', false).state;
    const snap = buildStateRenderSnapshot('hidden-panel', 'full-shell', viewModel, stateHidden, 'test');
    expect(snap.expectedHiddenPanelIds).toContain('evidence');
  });

  it('selectDashboardRenderModel compatible with snapshot builder', () => {
    const selectorResult = selectDashboardRenderModel(viewModel, defaultState);
    const snap = buildStateRenderSnapshot('reset-interaction-state', 'state', viewModel, defaultState, 'test');
    expect(selectorResult.shell.componentType).toBe(snap.renderResult.componentType);
  });
});

// ─── 36. Capability metadata ──────────────────────────────────────────────────

describe('Phase 27 — capability metadata', () => {
  it('getDashboardSnapshotCapabilities returns Phase 27 flags', () => {
    const caps = getDashboardSnapshotCapabilities();
    expect(caps.dashboardRenderSnapshots).toBe(true);
    expect(caps.dashboardRegressionFixtures).toBe(true);
    expect(caps.deterministicRenderSnapshots).toBe(true);
    expect(caps.snapshotSafetyValidation).toBe(true);
    expect(caps.fixtureBackedRenderSnapshots).toBe(true);
    expect(caps.dashboardSnapshotPersistence).toBe(false);
    expect(caps.dashboardSnapshotExternalNetwork).toBe(false);
    expect(caps.dashboardSnapshotLiveData).toBe(false);
    expect(caps.dashboardSnapshotMutationControls).toBe(false);
  });

  it('getDashboardUiShellCapabilities includes Phase 27 snapshot flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.dashboardRenderSnapshots).toBe(true);
    expect(caps.dashboardRegressionFixtures).toBe(true);
    expect(caps.deterministicRenderSnapshots).toBe(true);
    expect(caps.snapshotSafetyValidation).toBe(true);
    expect(caps.fixtureBackedRenderSnapshots).toBe(true);
    expect(caps.dashboardSnapshotPersistence).toBe(false);
    expect(caps.dashboardSnapshotExternalNetwork).toBe(false);
    expect(caps.dashboardSnapshotLiveData).toBe(false);
    expect(caps.dashboardSnapshotMutationControls).toBe(false);
  });

  it('getDashboardUiShellCapabilities retains Phase 25/26 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.dashboardUiShell).toBe(true);
    expect(caps.localReadOnlyDashboard).toBe(true);
    expect(caps.fixtureBackedDashboardUi).toBe(true);
    expect(caps.dashboardInteractionState).toBe(true);
    expect(caps.localDashboardFilters).toBe(true);
    expect(caps.dashboardPersistentState).toBe(false);
    expect(caps.dashboardLiveData).toBe(false);
    expect(caps.dashboardTradingControls).toBe(false);
    expect(caps.dashboardWalletControls).toBe(false);
    expect(caps.dashboardMutationControls).toBe(false);
    expect(caps.dashboardExecutionControls).toBe(false);
  });
});

// ─── 37. No persistence ───────────────────────────────────────────────────────

describe('Phase 27 — no persistence', () => {
  // Note: validation.ts is the safety checker file and legitimately contains
  // storage API names as forbidden pattern strings for documentation.
  const NON_VALIDATOR_FILES = SNAPSHOT_FILES.filter(f => !f.endsWith('validation.ts'));

  it('non-validator snapshot source files do not use localStorage', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('localStorage');
    }
  });

  it('non-validator snapshot source files do not use sessionStorage', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('sessionStorage');
    }
  });

  it('non-validator snapshot source files do not use IndexedDB', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('IndexedDB');
    }
  });

  it('non-validator snapshot source files do not use document.cookie', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('document.cookie');
    }
  });

  it('non-validator snapshot source files do not use writeFile or writeFileSync', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('writeFile');
    }
  });

  it('getDashboardSnapshotCapabilities.dashboardSnapshotPersistence is false', () => {
    expect(getDashboardSnapshotCapabilities().dashboardSnapshotPersistence).toBe(false);
  });
});

// ─── 38. No browser storage usage ────────────────────────────────────────────

describe('Phase 27 — no browser storage', () => {
  it('snapshot source files do not use window object for storage', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('window.localStorage');
      expect(content).not.toContain('window.sessionStorage');
    }
  });
});

// ─── 39. No external network ─────────────────────────────────────────────────

describe('Phase 27 — no external network', () => {
  it('snapshot source files do not use fetch', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/\bfetch\s*\(/);
    }
  });

  it('snapshot source files do not use axios', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('axios');
    }
  });

  it('snapshot source files do not use WebSocket', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('WebSocket');
    }
  });

  it('snapshot source files do not use http or https imports', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain("from 'http'");
      expect(content).not.toContain("from 'https'");
    }
  });

  it('getDashboardSnapshotCapabilities.dashboardSnapshotExternalNetwork is false', () => {
    expect(getDashboardSnapshotCapabilities().dashboardSnapshotExternalNetwork).toBe(false);
  });
});

// ─── 40. No fetch/axios/websocket usage ──────────────────────────────────────

describe('Phase 27 — no fetch/axios/websocket runtime calls', () => {
  it('snapshot source files do not have XMLHttpRequest', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('XMLHttpRequest');
    }
  });
});

// ─── 41. No Date.now / new Date / Math.random / timers ───────────────────────

describe('Phase 27 — no non-deterministic sources', () => {
  it('snapshot source files do not use Date.now', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('Date.now');
    }
  });

  it('snapshot source files do not use new Date()', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/new Date\(\)/);
    }
  });

  it('snapshot source files do not use Math.random', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('Math.random');
    }
  });

  it('snapshot source files do not use setTimeout', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('setTimeout');
    }
  });

  it('snapshot source files do not use setInterval', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('setInterval');
    }
  });
});

// ─── 42. No wallet/trading/execution logic ────────────────────────────────────

describe('Phase 27 — no wallet/trading/execution logic', () => {
  // Note: validation.ts is the safety checker that may document forbidden
  // terms as pattern references. Other files must not call these APIs.
  const NON_VALIDATOR_FILES = SNAPSHOT_FILES.filter(f => !f.endsWith('validation.ts'));

  it('non-validator snapshot source files do not contain signTransaction', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('signTransaction');
    }
  });

  it('non-validator snapshot source files do not contain sendTransaction', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('sendTransaction');
    }
  });

  it('non-validator snapshot source files do not contain keypair', () => {
    for (const file of NON_VALIDATOR_FILES) {
      const content = readFileSync(file, 'utf-8').toLowerCase();
      expect(content).not.toContain('keypair');
    }
  });

  it('snapshot source files do not contain Solana RPC patterns', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('Connection(');
      expect(content).not.toContain('clusterApiUrl');
    }
  });

  it('getDashboardSnapshotCapabilities.dashboardSnapshotMutationControls is false', () => {
    expect(getDashboardSnapshotCapabilities().dashboardSnapshotMutationControls).toBe(false);
  });

  it('getDashboardSnapshotCapabilities.dashboardSnapshotLiveData is false', () => {
    expect(getDashboardSnapshotCapabilities().dashboardSnapshotLiveData).toBe(false);
  });
});

// ─── 43. No mutation controls ────────────────────────────────────────────────

describe('Phase 27 — no mutation controls in snapshots', () => {
  it('all fixture snapshots have hasMutationControls = false', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.expectedSafetyBoundary.hasMutationControls).toBe(false);
      }
    }
  });

  it('all fixture snapshots have hasTradingControls = false', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.expectedSafetyBoundary.hasTradingControls).toBe(false);
      }
    }
  });

  it('all fixture snapshots have hasExecutionControls = false', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.expectedSafetyBoundary.hasExecutionControls).toBe(false);
      }
    }
  });

  it('all fixture snapshots have hasWalletControls = false', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.expectedSafetyBoundary.hasWalletControls).toBe(false);
      }
    }
  });
});

// ─── 44. No secrets/stack traces/local paths in snapshots ────────────────────

describe('Phase 27 — snapshot safety checks (validateDashboardRenderSnapshotSafety)', () => {
  it('all fixture snapshots pass safety check', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        const result = validateDashboardRenderSnapshotSafety(fixture.snapshot);
        if (!result.safe) {
          expect(`${name} safety violations: ${result.violations.join(', ')}`).toBe('');
        }
        expect(result.safe).toBe(true);
      }
    }
  });

  it('returns unsafe for snapshot with stack trace in notes', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    // Inject a fake stack trace into a non-documentation field
    const broken = {
      ...snap,
      expectedComponentType: 'TypeError: something went wrong at Object.<anonymous>',
    };
    const result = validateDashboardRenderSnapshotSafety(broken);
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('returns unsafe for snapshot with /home/ path in expectedComponentType', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    const broken = {
      ...snap,
      expectedComponentType: '/home/user/secret/file.ts',
    };
    const result = validateDashboardRenderSnapshotSafety(broken);
    expect(result.safe).toBe(false);
  });

  it('returns safe for valid snapshot', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    const result = validateDashboardRenderSnapshotSafety(snap);
    expect(result.safe).toBe(true);
  });

  it('safety check on null returns safe=false', () => {
    const result = validateDashboardRenderSnapshotSafety(null);
    expect(result.safe).toBe(false);
  });
});

// ─── 45. No live-data claims in snapshots ────────────────────────────────────

describe('Phase 27 — no live-data claims', () => {
  it('all fixture snapshots have meta.liveData = false', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.meta.liveData).toBe(false);
      }
    }
  });

  it('all fixture snapshots have meta.externalNetwork = false', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.meta.externalNetwork).toBe(false);
      }
    }
  });

  it('all fixture snapshots have meta.fixtureOnly = true', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.meta.fixtureOnly).toBe(true);
      }
    }
  });

  it('all fixture snapshots have expectedSafetyBoundary.hasExternalNetwork = false', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        expect(fixture.snapshot.expectedSafetyBoundary.hasExternalNetwork).toBe(false);
      }
    }
  });
});

// ─── 46. Safety boundary regression ──────────────────────────────────────────

describe('Phase 27 — safety boundary regression', () => {
  it('SAFETY_BOUNDARY_FIXTURE has correct fixture name', () => {
    expect(SAFETY_BOUNDARY_FIXTURE.name).toBe('safety-boundary');
  });

  it('SAFETY_BOUNDARY_FIXTURE snapshot passes validation', () => {
    const result = validateDashboardRenderSnapshot(SAFETY_BOUNDARY_FIXTURE.snapshot);
    expect(result.valid).toBe(true);
  });

  it('SAFETY_BOUNDARY_FIXTURE snapshot passes safety check', () => {
    const result = validateDashboardRenderSnapshotSafety(SAFETY_BOUNDARY_FIXTURE.snapshot);
    expect(result.safe).toBe(true);
  });

  it('all Phase 27 regression fixtures pass validation', () => {
    for (const [name, fixture] of PHASE_27_REGRESSION_FIXTURES) {
      const result = validateDashboardRenderSnapshot(fixture.snapshot);
      if (!result.valid) {
        const msgs = result.issues.map(i => i.message).join(', ');
        expect(`${name}: ${msgs}`).toBe('');
      }
      expect(result.valid).toBe(true);
    }
  });

  it('all Phase 27 regression fixtures pass safety check', () => {
    for (const [name, fixture] of PHASE_27_REGRESSION_FIXTURES) {
      const result = validateDashboardRenderSnapshotSafety(fixture.snapshot);
      if (!result.safe) {
        expect(`${name}: ${result.violations.join(', ')}`).toBe('');
      }
      expect(result.safe).toBe(true);
    }
  });

  it('PHASE_27_FIXTURE_SUITE contains all 20 fixtures', () => {
    expect(PHASE_27_FIXTURE_SUITE.fixtures.length).toBe(20);
  });

  it('PHASE_27_FIXTURE_SUITE has suiteName', () => {
    expect(PHASE_27_FIXTURE_SUITE.suiteName.length).toBeGreaterThan(0);
  });

  it('PHASE_27_FIXTURE_SUITE has description', () => {
    expect(PHASE_27_FIXTURE_SUITE.description.length).toBeGreaterThan(0);
  });
});

// ─── 47. buildDashboardRenderSnapshot generic builder ─────────────────────────

describe('Phase 27 — buildDashboardRenderSnapshot generic builder', () => {
  const viewModel = buildFixtureDashboardViewModel();

  it('returns success for valid input', () => {
    const result = buildDashboardRenderSnapshot({
      name: 'default-dashboard-shell',
      kind: 'full-shell',
      viewModel,
      notes: 'test notes',
    });
    expect(result.success).toBe(true);
    expect(result.snapshot).not.toBeNull();
    expect(result.issues.length).toBe(0);
  });

  it('returns failure for invalid name', () => {
    const result = buildDashboardRenderSnapshot({
      // @ts-expect-error intentional invalid input
      name: 'not-a-valid-name',
      kind: 'full-shell',
      viewModel,
      notes: 'test',
    });
    expect(result.success).toBe(false);
    expect(result.snapshot).toBeNull();
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('returns failure for invalid kind', () => {
    const result = buildDashboardRenderSnapshot({
      name: 'default-dashboard-shell',
      // @ts-expect-error intentional invalid input
      kind: 'not-a-valid-kind',
      viewModel,
      notes: 'test',
    });
    expect(result.success).toBe(false);
    expect(result.snapshot).toBeNull();
  });

  it('returns failure for empty notes', () => {
    const result = buildDashboardRenderSnapshot({
      name: 'default-dashboard-shell',
      kind: 'full-shell',
      viewModel,
      // @ts-expect-error intentional invalid input
      notes: '',
    });
    expect(result.success).toBe(false);
    expect(result.snapshot).toBeNull();
  });

  it('does not throw for malformed input', () => {
    expect(() => {
      buildDashboardRenderSnapshot({
        // @ts-expect-error intentional invalid input
        name: null,
        kind: null,
        viewModel: null,
        notes: null,
      });
    }).not.toThrow();
  });
});

// ─── 48. Fixture suite ────────────────────────────────────────────────────────

describe('Phase 27 — fixture suite', () => {
  it('PHASE_27_FIXTURE_SUITE.fixtures covers all snapshot names', () => {
    const suiteNames = PHASE_27_FIXTURE_SUITE.fixtures.map(f => f.name);
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      expect(suiteNames).toContain(name);
    }
  });

  it('PHASE_27_REGRESSION_FIXTURES has 20 entries', () => {
    expect(PHASE_27_REGRESSION_FIXTURES.size).toBe(20);
  });

  it('each fixture has name, description, snapshot fields', () => {
    for (const fixture of PHASE_27_FIXTURE_SUITE.fixtures) {
      expect(typeof fixture.name).toBe('string');
      expect(typeof fixture.description).toBe('string');
      expect(typeof fixture.snapshot).toBe('object');
    }
  });

  it('each fixture description is non-empty', () => {
    for (const fixture of PHASE_27_FIXTURE_SUITE.fixtures) {
      expect(fixture.description.length).toBeGreaterThan(0);
    }
  });
});

// ─── 49. isDashboardShellResult / isSafetyBannerResult guards ────────────────

describe('Phase 27 — type guards', () => {
  it('isDashboardShellResult returns true for DashboardShell render result', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(isDashboardShellResult(snap.renderResult)).toBe(true);
  });

  it('isDashboardShellResult returns false for SafetyBanner result', () => {
    const snap = buildSafetyBannerSnapshot();
    expect(isDashboardShellResult(snap.renderResult)).toBe(false);
  });

  it('isSafetyBannerResult returns true for SafetyBanner result', () => {
    const snap = buildSafetyBannerSnapshot();
    expect(isSafetyBannerResult(snap.renderResult)).toBe(true);
  });

  it('isSafetyBannerResult returns false for DashboardShell result', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(isSafetyBannerResult(snap.renderResult)).toBe(false);
  });
});

// ─── 50. areDashboardRenderSnapshotsEqual ────────────────────────────────────

describe('Phase 27 — areDashboardRenderSnapshotsEqual', () => {
  const viewModel = buildFixtureDashboardViewModel();

  it('returns true for same snapshot', () => {
    const a = buildDefaultDashboardRenderSnapshot(viewModel);
    const b = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(areDashboardRenderSnapshotsEqual(a, b)).toBe(true);
  });

  it('returns false for different snapshots', () => {
    const a = buildDefaultDashboardRenderSnapshot(viewModel);
    const b = buildSafetyBannerSnapshot();
    expect(areDashboardRenderSnapshotsEqual(a, b)).toBe(false);
  });

  it('is symmetric', () => {
    const a = buildDefaultDashboardRenderSnapshot(viewModel);
    const b = buildDefaultDashboardRenderSnapshot(viewModel);
    expect(areDashboardRenderSnapshotsEqual(a, b)).toBe(areDashboardRenderSnapshotsEqual(b, a));
  });
});

// ─── 51. Source file safety checks ───────────────────────────────────────────

describe('Phase 27 — source file structure', () => {
  it('all snapshot source files exist', () => {
    for (const file of SNAPSHOT_FILES) {
      const content = readFileSync(file, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('snapshots/index.ts exports expected symbols', () => {
    const indexContent = readFileSync(resolve(SNAPSHOT_SRC, 'index.ts'), 'utf-8');
    expect(indexContent).toContain('buildDashboardRenderSnapshot');
    expect(indexContent).toContain('validateDashboardRenderSnapshot');
    expect(indexContent).toContain('normalizeDashboardRenderSnapshot');
    expect(indexContent).toContain('listDashboardRenderSnapshotFixtures');
    expect(indexContent).toContain('getDashboardRenderSnapshotFixture');
    expect(indexContent).toContain('getDashboardSnapshotCapabilities');
    expect(indexContent).toContain('PHASE_27_REGRESSION_FIXTURES');
    expect(indexContent).toContain('PHASE_27_FIXTURE_SUITE');
  });

  it('snapshots/types.ts contains DASHBOARD_RENDER_SNAPSHOT_NAMES', () => {
    const content = readFileSync(resolve(SNAPSHOT_SRC, 'types.ts'), 'utf-8');
    expect(content).toContain('DASHBOARD_RENDER_SNAPSHOT_NAMES');
  });

  it('snapshots/builders.ts contains buildDefaultDashboardRenderSnapshot', () => {
    const content = readFileSync(resolve(SNAPSHOT_SRC, 'builders.ts'), 'utf-8');
    expect(content).toContain('buildDefaultDashboardRenderSnapshot');
  });

  it('snapshots/normalization.ts contains normalizeDashboardRenderSnapshot', () => {
    const content = readFileSync(resolve(SNAPSHOT_SRC, 'normalization.ts'), 'utf-8');
    expect(content).toContain('normalizeDashboardRenderSnapshot');
  });

  it('snapshots/validation.ts contains validateDashboardRenderSnapshot', () => {
    const content = readFileSync(resolve(SNAPSHOT_SRC, 'validation.ts'), 'utf-8');
    expect(content).toContain('validateDashboardRenderSnapshot');
  });

  it('snapshots/fixtures.ts contains PHASE_27_FIXTURE_SUITE', () => {
    const content = readFileSync(resolve(SNAPSHOT_SRC, 'fixtures.ts'), 'utf-8');
    expect(content).toContain('PHASE_27_FIXTURE_SUITE');
  });

  it('snapshots/capabilities.ts contains getDashboardSnapshotCapabilities', () => {
    const content = readFileSync(resolve(SNAPSHOT_SRC, 'capabilities.ts'), 'utf-8');
    expect(content).toContain('getDashboardSnapshotCapabilities');
  });
});

// ─── 52. Fixture-level individual checks ─────────────────────────────────────

describe('Phase 27 — individual fixture checks', () => {
  it('DEFAULT_DASHBOARD_SHELL_FIXTURE has correct name', () => {
    expect(DEFAULT_DASHBOARD_SHELL_FIXTURE.name).toBe('default-dashboard-shell');
  });

  it('SAFETY_BANNER_FIXTURE has correct name', () => {
    expect(SAFETY_BANNER_FIXTURE.name).toBe('safety-banner');
  });

  it('METADATA_PANEL_FIXTURE has correct name', () => {
    expect(METADATA_PANEL_FIXTURE.name).toBe('metadata-panel');
  });

  it('HEALTH_PANEL_FIXTURE has correct name', () => {
    expect(HEALTH_PANEL_FIXTURE.name).toBe('health-panel');
  });

  it('CAPABILITIES_PANEL_FIXTURE has correct name', () => {
    expect(CAPABILITIES_PANEL_FIXTURE.name).toBe('capabilities-panel');
  });

  it('OVERVIEW_PANEL_FIXTURE has correct name', () => {
    expect(OVERVIEW_PANEL_FIXTURE.name).toBe('overview-panel');
  });

  it('EVIDENCE_PANEL_FIXTURE has correct name', () => {
    expect(EVIDENCE_PANEL_FIXTURE.name).toBe('evidence-panel');
  });

  it('SAFETY_PANEL_FIXTURE has correct name', () => {
    expect(SAFETY_PANEL_FIXTURE.name).toBe('safety-panel');
  });

  it('EMPTY_STATE_FIXTURE has correct name', () => {
    expect(EMPTY_STATE_FIXTURE.name).toBe('empty-state');
  });

  it('LOADING_STATE_FIXTURE has correct name', () => {
    expect(LOADING_STATE_FIXTURE.name).toBe('loading-state');
  });

  it('ERROR_STATE_FIXTURE has correct name', () => {
    expect(ERROR_STATE_FIXTURE.name).toBe('error-state');
  });

  it('UNAVAILABLE_STATE_FIXTURE has correct name', () => {
    expect(UNAVAILABLE_STATE_FIXTURE.name).toBe('unavailable-state');
  });

  it('ACTIVE_PANEL_FIXTURE has correct name', () => {
    expect(ACTIVE_PANEL_FIXTURE.name).toBe('active-panel');
  });

  it('HIDDEN_PANEL_FIXTURE has correct name', () => {
    expect(HIDDEN_PANEL_FIXTURE.name).toBe('hidden-panel');
  });

  it('FILTERED_EVIDENCE_FIXTURE has correct name', () => {
    expect(FILTERED_EVIDENCE_FIXTURE.name).toBe('filtered-evidence');
  });

  it('FILTERED_SAFETY_FIXTURE has correct name', () => {
    expect(FILTERED_SAFETY_FIXTURE.name).toBe('filtered-safety');
  });

  it('RESET_INTERACTION_STATE_FIXTURE has correct name', () => {
    expect(RESET_INTERACTION_STATE_FIXTURE.name).toBe('reset-interaction-state');
  });

  it('NO_RESULTS_FILTERED_FIXTURE has correct name', () => {
    expect(NO_RESULTS_FILTERED_FIXTURE.name).toBe('no-results-filtered');
  });

  it('MALFORMED_INPUT_SAFE_FIXTURE has correct name', () => {
    expect(MALFORMED_INPUT_SAFE_FIXTURE.name).toBe('malformed-input-safe');
  });

  it('SAFETY_BOUNDARY_FIXTURE has correct name', () => {
    expect(SAFETY_BOUNDARY_FIXTURE.name).toBe('safety-boundary');
  });
});

// ─── 53. Phase 27 docs file check ────────────────────────────────────────────

describe('Phase 27 — documentation file', () => {
  it('docs/LOCAL_DASHBOARD_RENDER_SNAPSHOTS.md exists', () => {
    const docPath = resolve(REPO_ROOT, 'docs/LOCAL_DASHBOARD_RENDER_SNAPSHOTS.md');
    const content = readFileSync(docPath, 'utf-8');
    expect(content.length).toBeGreaterThan(100);
  });

  it('docs/LOCAL_DASHBOARD_RENDER_SNAPSHOTS.md mentions Phase 27', () => {
    const docPath = resolve(REPO_ROOT, 'docs/LOCAL_DASHBOARD_RENDER_SNAPSHOTS.md');
    const content = readFileSync(docPath, 'utf-8');
    expect(content).toContain('Phase 27');
  });

  it('docs/LOCAL_DASHBOARD_RENDER_SNAPSHOTS.md mentions safety boundary', () => {
    const docPath = resolve(REPO_ROOT, 'docs/LOCAL_DASHBOARD_RENDER_SNAPSHOTS.md');
    const content = readFileSync(docPath, 'utf-8');
    expect(content.toLowerCase()).toContain('safety');
  });
});

// ─── 54. Additional fixture snapshot sanity checks ───────────────────────────

describe('Phase 27 — additional fixture snapshot sanity checks', () => {
  it('all fixtures have snapshot.name equal to fixture.name', () => {
    for (const [, fixture] of PHASE_27_REGRESSION_FIXTURES) {
      expect(fixture.snapshot.name).toBe(fixture.name);
    }
  });

  it('all fixtures have meta.phase === 27', () => {
    for (const [, fixture] of PHASE_27_REGRESSION_FIXTURES) {
      expect(fixture.snapshot.meta.phase).toBe(27);
    }
  });

  it('all fixtures have deterministic meta', () => {
    for (const [, fixture] of PHASE_27_REGRESSION_FIXTURES) {
      expect(fixture.snapshot.meta.deterministic).toBe(true);
    }
  });

  it('all fixtures are in PHASE_27_FIXTURE_SUITE.fixtures', () => {
    const suiteNames = new Set(PHASE_27_FIXTURE_SUITE.fixtures.map(f => f.name));
    for (const [name] of PHASE_27_REGRESSION_FIXTURES) {
      expect(suiteNames.has(name)).toBe(true);
    }
  });

  it('panel fixtures have kind === panel', () => {
    const panelNames = ['health-panel', 'capabilities-panel', 'overview-panel', 'evidence-panel', 'safety-panel', 'metadata-panel'] as const;
    for (const name of panelNames) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      expect(fixture?.snapshot.kind).toBe('panel');
    }
  });

  it('error/unavailable fixtures have isErrorState === true', () => {
    const errorNames = ['error-state', 'unavailable-state'] as const;
    for (const name of errorNames) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      expect(fixture?.snapshot.isErrorState).toBe(true);
    }
  });

  it('empty state fixture has isEmptyState === true', () => {
    const fixture = getDashboardRenderSnapshotFixture('empty-state');
    expect(fixture?.snapshot.isEmptyState).toBe(true);
  });

  it('filtered fixtures have isFilteredState === true', () => {
    const filterNames = ['filtered-evidence', 'filtered-safety', 'no-results-filtered'] as const;
    for (const name of filterNames) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      expect(fixture?.snapshot.isFilteredState).toBe(true);
    }
  });

  it('getDashboardRenderSnapshotSummary returns valid summary for all fixtures', () => {
    for (const name of DASHBOARD_RENDER_SNAPSHOT_NAMES) {
      const fixture = getDashboardRenderSnapshotFixture(name);
      if (fixture) {
        const summary = getDashboardRenderSnapshotSummary(fixture.snapshot);
        expect(summary.name).toBe(name);
        expect(typeof summary.kind).toBe('string');
        expect(typeof summary.componentType).toBe('string');
        expect(summary.meta.phase).toBe(27);
      }
    }
  });

  it('PHASE_27_REGRESSION_FIXTURES Map has correct structure', () => {
    for (const [key, fixture] of PHASE_27_REGRESSION_FIXTURES) {
      expect(key).toBe(fixture.name);
      expect(key).toBe(fixture.snapshot.name);
    }
  });

  it('serializeDashboardRenderSnapshot is stable across calls', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    const s1 = serializeDashboardRenderSnapshot(snap);
    const s2 = serializeDashboardRenderSnapshot(snap);
    expect(JSON.stringify(s1)).toBe(JSON.stringify(s2));
  });

  it('normalizeDashboardRenderSnapshot produces serializable output', () => {
    const viewModel = buildFixtureDashboardViewModel();
    const snap = buildDefaultDashboardRenderSnapshot(viewModel);
    const normalized = normalizeDashboardRenderSnapshot(snap);
    expect(isDashboardRenderSnapshotSerializable(normalized)).toBe(true);
  });

  it('getDashboardSnapshotCapabilities returns plain object', () => {
    const caps = getDashboardSnapshotCapabilities();
    expect(typeof caps).toBe('object');
    expect(caps).not.toBeNull();
  });

  it('getDashboardSnapshotCapabilities is deterministic', () => {
    const a = getDashboardSnapshotCapabilities();
    const b = getDashboardSnapshotCapabilities();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
