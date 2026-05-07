/**
 * tests/phase25.test.ts
 *
 * Phase 25 — Local Read-Only Dashboard UI Shell v1
 *
 * Tests for the Phase 25 local read-only dashboard UI shell.
 * Covers: component exports, fixture-backed rendering, safety boundaries,
 * accessibility smoke checks, empty/loading/error/unavailable states,
 * capability metadata, view model compatibility, and security regressions.
 *
 * Environment: Node (no DOM, no browser, no network)
 * Data source: Phase 23 fixtures only. No live data. No network.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── @sonic/dashboard imports ─────────────────────────────────────────────────

import {
  // Components
  DashboardShell,
  SafetyBanner,
  MetadataPanel,
  HealthPanel,
  CapabilitiesPanel,
  OverviewPanel,
  EvidencePanel,
  SafetyPanel,
  EmptyState,
  LoadingState,
  ErrorState,
  UnavailableState,
  StatusBadge,
  // View model source
  buildFixtureDashboardViewModel,
  getViewModelSourceDescription,
  getViewModelSourceMeta,
  // Capabilities
  getDashboardUiShellCapabilities,
  // Constants
  PHASE_25_SAFETY_BOUNDARY,
  SAFETY_BANNER_NOTICES,
} from '@sonic/dashboard';

// ─── @sonic/dashboard-view-models imports ────────────────────────────────────

import {
  buildHealthViewModel,
  buildCapabilitiesViewModel,
  buildDashboardOverviewViewModel,
  buildEvidenceViewModel,
  buildSafetyViewModel,
  buildDashboardEmptyViewModel,
  buildDashboardLoadingViewModel,
  buildDashboardErrorViewModel,
  DASHBOARD_ADAPTER_ERROR_CODES,
} from '@sonic/dashboard-view-models';

// ─── @sonic/read-only-api imports ────────────────────────────────────────────

import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

// ─── @sonic/read-only-api-client imports ─────────────────────────────────────

import {
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
  DASHBOARD_SAFETY_SUCCESS_FIXTURE,
} from '@sonic/read-only-api-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DASHBOARD_SRC = resolve(__dirname, '../apps/dashboard/src');
const DASHBOARD_COMPONENTS_SRC = resolve(DASHBOARD_SRC, 'components');

// ─── 1. Package exports ───────────────────────────────────────────────────────

describe('Phase 25 — Package exports', () => {
  it('exports DashboardShell', () => {
    expect(typeof DashboardShell).toBe('function');
  });
  it('exports SafetyBanner', () => {
    expect(typeof SafetyBanner).toBe('function');
  });
  it('exports MetadataPanel', () => {
    expect(typeof MetadataPanel).toBe('function');
  });
  it('exports HealthPanel', () => {
    expect(typeof HealthPanel).toBe('function');
  });
  it('exports CapabilitiesPanel', () => {
    expect(typeof CapabilitiesPanel).toBe('function');
  });
  it('exports OverviewPanel', () => {
    expect(typeof OverviewPanel).toBe('function');
  });
  it('exports EvidencePanel', () => {
    expect(typeof EvidencePanel).toBe('function');
  });
  it('exports SafetyPanel', () => {
    expect(typeof SafetyPanel).toBe('function');
  });
  it('exports EmptyState', () => {
    expect(typeof EmptyState).toBe('function');
  });
  it('exports LoadingState', () => {
    expect(typeof LoadingState).toBe('function');
  });
  it('exports ErrorState', () => {
    expect(typeof ErrorState).toBe('function');
  });
  it('exports UnavailableState', () => {
    expect(typeof UnavailableState).toBe('function');
  });
  it('exports StatusBadge', () => {
    expect(typeof StatusBadge).toBe('function');
  });
  it('exports buildFixtureDashboardViewModel', () => {
    expect(typeof buildFixtureDashboardViewModel).toBe('function');
  });
  it('exports getViewModelSourceDescription', () => {
    expect(typeof getViewModelSourceDescription).toBe('function');
  });
  it('exports getViewModelSourceMeta', () => {
    expect(typeof getViewModelSourceMeta).toBe('function');
  });
  it('exports getDashboardUiShellCapabilities', () => {
    expect(typeof getDashboardUiShellCapabilities).toBe('function');
  });
  it('exports PHASE_25_SAFETY_BOUNDARY', () => {
    expect(typeof PHASE_25_SAFETY_BOUNDARY).toBe('object');
  });
  it('exports SAFETY_BANNER_NOTICES', () => {
    expect(Array.isArray(SAFETY_BANNER_NOTICES)).toBe(true);
  });
});

// ─── 2. SafetyBanner component ────────────────────────────────────────────────

describe('Phase 25 — SafetyBanner component', () => {
  const banner = SafetyBanner();

  it('returns componentType SafetyBanner', () => {
    expect(banner.componentType).toBe('SafetyBanner');
  });
  it('returns role banner', () => {
    expect(banner.role).toBe('banner');
  });
  it('has ariaLabel', () => {
    expect(typeof banner.ariaLabel).toBe('string');
    expect(banner.ariaLabel.length).toBeGreaterThan(10);
  });
  it('has notices array', () => {
    expect(Array.isArray(banner.notices)).toBe(true);
    expect(banner.notices.length).toBeGreaterThan(0);
  });
  it('notices mention LOCAL ONLY', () => {
    const joined = banner.notices.join(' ');
    expect(joined).toContain('LOCAL ONLY');
  });
  it('notices mention READ-ONLY', () => {
    const joined = banner.notices.join(' ');
    expect(joined).toContain('READ-ONLY');
  });
  it('notices mention FIXTURE-BACKED', () => {
    const joined = banner.notices.join(' ');
    expect(joined).toContain('FIXTURE-BACKED');
  });
  it('notices mention NO LIVE DATA', () => {
    const joined = banner.notices.join(' ');
    expect(joined).toContain('NO LIVE DATA');
  });
  it('notices mention NO EXECUTION', () => {
    const joined = banner.notices.join(' ');
    expect(joined).toContain('NO EXECUTION');
  });
  it('notices mention NO WALLET', () => {
    const joined = banner.notices.join(' ');
    expect(joined).toContain('NO WALLET');
  });
  it('notices mention NO EXTERNAL NETWORK', () => {
    const joined = banner.notices.join(' ');
    expect(joined).toContain('NO EXTERNAL NETWORK');
  });
  it('has safety boundary', () => {
    expect(banner.safetyBoundary).toBeDefined();
  });
  it('safety boundary isReadOnly is true', () => {
    expect(banner.safetyBoundary.isReadOnly).toBe(true);
  });
  it('safety boundary isLocalOnly is true', () => {
    expect(banner.safetyBoundary.isLocalOnly).toBe(true);
  });
  it('safety boundary isFixtureBacked is true', () => {
    expect(banner.safetyBoundary.isFixtureBacked).toBe(true);
  });
  it('safety boundary hasLiveData is false', () => {
    expect(banner.safetyBoundary.hasLiveData).toBe(false);
  });
  it('safety boundary hasTradingControls is false', () => {
    expect(banner.safetyBoundary.hasTradingControls).toBe(false);
  });
  it('safety boundary hasWalletControls is false', () => {
    expect(banner.safetyBoundary.hasWalletControls).toBe(false);
  });
  it('safety boundary hasMutationControls is false', () => {
    expect(banner.safetyBoundary.hasMutationControls).toBe(false);
  });
  it('safety boundary hasExternalNetwork is false', () => {
    expect(banner.safetyBoundary.hasExternalNetwork).toBe(false);
  });
  it('safety boundary hasExecutionControls is false', () => {
    expect(banner.safetyBoundary.hasExecutionControls).toBe(false);
  });
  it('is deterministic — calling twice returns same notices', () => {
    const b1 = SafetyBanner();
    const b2 = SafetyBanner();
    expect(JSON.stringify(b1.notices)).toBe(JSON.stringify(b2.notices));
  });
});

// ─── 3. PHASE_25_SAFETY_BOUNDARY constant ────────────────────────────────────

describe('Phase 25 — PHASE_25_SAFETY_BOUNDARY constant', () => {
  it('isReadOnly is true', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.isReadOnly).toBe(true);
  });
  it('isLocalOnly is true', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.isLocalOnly).toBe(true);
  });
  it('isFixtureBacked is true', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.isFixtureBacked).toBe(true);
  });
  it('hasLiveData is false', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.hasLiveData).toBe(false);
  });
  it('hasTradingControls is false', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.hasTradingControls).toBe(false);
  });
  it('hasWalletControls is false', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.hasWalletControls).toBe(false);
  });
  it('hasMutationControls is false', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.hasMutationControls).toBe(false);
  });
  it('hasExternalNetwork is false', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.hasExternalNetwork).toBe(false);
  });
  it('hasExecutionControls is false', () => {
    expect(PHASE_25_SAFETY_BOUNDARY.hasExecutionControls).toBe(false);
  });
});

// ─── 4. StatusBadge component ─────────────────────────────────────────────────

describe('Phase 25 — StatusBadge component', () => {
  it('returns componentType StatusBadge', () => {
    expect(StatusBadge({ status: 'ready' }).componentType).toBe('StatusBadge');
  });
  it('returns label for ready status', () => {
    expect(StatusBadge({ status: 'ready' }).label).toBe('Ready');
  });
  it('returns label for error status', () => {
    expect(StatusBadge({ status: 'error' }).label).toBe('Error');
  });
  it('returns label for empty status', () => {
    expect(StatusBadge({ status: 'empty' }).label).toBe('Empty');
  });
  it('returns label for loading status', () => {
    expect(StatusBadge({ status: 'loading' }).label).toBe('Loading');
  });
  it('returns label for unavailable status', () => {
    expect(StatusBadge({ status: 'unavailable' }).label).toBe('Unavailable');
  });
  it('returns label for true status', () => {
    expect(StatusBadge({ status: 'true' }).label).toBe('Enabled');
  });
  it('returns label for false status', () => {
    expect(StatusBadge({ status: 'false' }).label).toBe('Disabled');
  });
  it('respects labelOverride', () => {
    expect(StatusBadge({ status: 'ready', labelOverride: 'Custom' }).label).toBe('Custom');
  });
  it('has ariaLabel', () => {
    const badge = StatusBadge({ status: 'ready' });
    expect(badge.ariaLabel).toContain('Status:');
  });
  it('preserves status field', () => {
    expect(StatusBadge({ status: 'error' }).status).toBe('error');
  });
});

// ─── 5. Empty / Loading / Error / Unavailable states ─────────────────────────

describe('Phase 25 — EmptyState component', () => {
  it('returns componentType EmptyState', () => {
    expect(EmptyState().componentType).toBe('EmptyState');
  });
  it('returns role region', () => {
    expect(EmptyState().role).toBe('region');
  });
  it('has hasHeading true', () => {
    expect(EmptyState().hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    expect(EmptyState().hasLandmark).toBe(true);
  });
  it('has default message', () => {
    const items = EmptyState().sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('No data available.');
  });
  it('uses custom message', () => {
    const items = EmptyState({ message: 'Custom empty.' }).sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('Custom empty.');
  });
  it('has status item = empty', () => {
    const items = EmptyState().sections[0]!.items;
    const status = items.find(i => i.key === 'status');
    expect(status?.value).toBe('empty');
  });
  it('has safety boundary', () => {
    expect(EmptyState().safetyBoundary.isReadOnly).toBe(true);
  });
  it('is deterministic', () => {
    expect(JSON.stringify(EmptyState())).toBe(JSON.stringify(EmptyState()));
  });
});

describe('Phase 25 — LoadingState component', () => {
  it('returns componentType LoadingState', () => {
    expect(LoadingState().componentType).toBe('LoadingState');
  });
  it('returns role region', () => {
    expect(LoadingState().role).toBe('region');
  });
  it('has hasHeading true', () => {
    expect(LoadingState().hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    expect(LoadingState().hasLandmark).toBe(true);
  });
  it('has default message', () => {
    const items = LoadingState().sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('Dashboard data is not loaded yet.');
  });
  it('uses custom message', () => {
    const items = LoadingState({ message: 'Loading...' }).sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('Loading...');
  });
  it('has status item = loading', () => {
    const items = LoadingState().sections[0]!.items;
    const status = items.find(i => i.key === 'status');
    expect(status?.value).toBe('loading');
  });
  it('has safety boundary', () => {
    expect(LoadingState().safetyBoundary.hasLiveData).toBe(false);
  });
  it('is deterministic', () => {
    expect(JSON.stringify(LoadingState())).toBe(JSON.stringify(LoadingState()));
  });
});

describe('Phase 25 — ErrorState component', () => {
  it('returns componentType ErrorState', () => {
    expect(ErrorState().componentType).toBe('ErrorState');
  });
  it('returns role region', () => {
    expect(ErrorState().role).toBe('region');
  });
  it('has hasHeading true', () => {
    expect(ErrorState().hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    expect(ErrorState().hasLandmark).toBe(true);
  });
  it('has default message', () => {
    const items = ErrorState().sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('An error occurred. No data is available.');
  });
  it('uses custom message', () => {
    const items = ErrorState({ message: 'Custom error.' }).sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('Custom error.');
  });
  it('has default code', () => {
    const items = ErrorState().sections[0]!.items;
    const code = items.find(i => i.key === 'code');
    expect(code?.value).toBe('DASHBOARD_ERROR');
  });
  it('uses custom code', () => {
    const items = ErrorState({ code: 'MY_ERROR' }).sections[0]!.items;
    const code = items.find(i => i.key === 'code');
    expect(code?.value).toBe('MY_ERROR');
  });
  it('has status item = error', () => {
    const items = ErrorState().sections[0]!.items;
    const status = items.find(i => i.key === 'status');
    expect(status?.value).toBe('error');
  });
  it('sanitizes stack trace in message', () => {
    const result = ErrorState({ message: 'at someFunction (file.ts:10:5)' });
    const items = result.sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toContain('sanitized');
  });
  it('sanitizes private key reference in message', () => {
    const result = ErrorState({ message: 'Error: private key is invalid' });
    const items = result.sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toContain('sanitized');
  });
  it('has safety boundary', () => {
    expect(ErrorState().safetyBoundary.hasWalletControls).toBe(false);
  });
  it('is deterministic', () => {
    expect(JSON.stringify(ErrorState())).toBe(JSON.stringify(ErrorState()));
  });
});

describe('Phase 25 — UnavailableState component', () => {
  it('returns componentType UnavailableState', () => {
    expect(UnavailableState().componentType).toBe('UnavailableState');
  });
  it('returns role region', () => {
    expect(UnavailableState().role).toBe('region');
  });
  it('has hasHeading true', () => {
    expect(UnavailableState().hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    expect(UnavailableState().hasLandmark).toBe(true);
  });
  it('has default message', () => {
    const items = UnavailableState().sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('This section is not available in the current phase.');
  });
  it('uses custom message', () => {
    const items = UnavailableState({ message: 'Not available.' }).sections[0]!.items;
    const msg = items.find(i => i.key === 'message');
    expect(msg?.value).toBe('Not available.');
  });
  it('has status item = unavailable', () => {
    const items = UnavailableState().sections[0]!.items;
    const status = items.find(i => i.key === 'status');
    expect(status?.value).toBe('unavailable');
  });
  it('has safety boundary', () => {
    expect(UnavailableState().safetyBoundary.hasMutationControls).toBe(false);
  });
  it('is deterministic', () => {
    expect(JSON.stringify(UnavailableState())).toBe(JSON.stringify(UnavailableState()));
  });
});

// ─── 6. View model source ─────────────────────────────────────────────────────

describe('Phase 25 — View model source', () => {
  it('buildFixtureDashboardViewModel returns object', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(typeof vm).toBe('object');
    expect(vm).not.toBeNull();
  });
  it('view model has status field', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(typeof vm.status).toBe('string');
  });
  it('view model has health panel', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.health).toBeDefined();
    expect(vm.health.endpoint).toBe('/health');
  });
  it('view model has capabilities panel', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.capabilities).toBeDefined();
    expect(vm.capabilities.endpoint).toBe('/capabilities');
  });
  it('view model has overview panel', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.overview).toBeDefined();
    expect(vm.overview.endpoint).toBe('/dashboard');
  });
  it('view model has evidence panel', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.evidence).toBeDefined();
    expect(vm.evidence.endpoint).toBe('/dashboard/evidence');
  });
  it('view model has safety panel', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.safety).toBeDefined();
    expect(vm.safety.endpoint).toBe('/dashboard/safety');
  });
  it('view model is deterministic — same result each call', () => {
    const vm1 = buildFixtureDashboardViewModel();
    const vm2 = buildFixtureDashboardViewModel();
    expect(JSON.stringify(vm1)).toBe(JSON.stringify(vm2));
  });
  it('getViewModelSourceDescription returns non-empty string', () => {
    const desc = getViewModelSourceDescription();
    expect(typeof desc).toBe('string');
    expect(desc.length).toBeGreaterThan(20);
  });
  it('getViewModelSourceDescription mentions fixture', () => {
    expect(getViewModelSourceDescription().toLowerCase()).toContain('fixture');
  });
  it('getViewModelSourceMeta returns correct phase', () => {
    expect(getViewModelSourceMeta().phase).toBe(25);
  });
  it('getViewModelSourceMeta fixtureOnly is true', () => {
    expect(getViewModelSourceMeta().fixtureOnly).toBe(true);
  });
  it('getViewModelSourceMeta liveData is false', () => {
    expect(getViewModelSourceMeta().liveData).toBe(false);
  });
  it('getViewModelSourceMeta externalNetwork is false', () => {
    expect(getViewModelSourceMeta().externalNetwork).toBe(false);
  });
  it('getViewModelSourceMeta deterministic is true', () => {
    expect(getViewModelSourceMeta().deterministic).toBe(true);
  });
});

// ─── 7. HealthPanel component ─────────────────────────────────────────────────

describe('Phase 25 — HealthPanel component', () => {
  const healthVm = buildHealthViewModel({ envelope: HEALTH_SUCCESS_FIXTURE });

  it('renders from fixture-backed health view model', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.componentType).toBe('HealthPanel');
  });
  it('has role region', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.role).toBe('region');
  });
  it('has title Health', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.title).toBe('Health');
  });
  it('has ariaLabel containing health', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.ariaLabel.toLowerCase()).toContain('health');
  });
  it('has hasHeading true', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.hasLandmark).toBe(true);
  });
  it('sections is an array', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(Array.isArray(result.sections)).toBe(true);
    expect(result.sections.length).toBeGreaterThan(0);
  });
  it('first section has items', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.sections[0]!.items.length).toBeGreaterThan(0);
  });
  it('has endpoint item', () => {
    const result = HealthPanel({ viewModel: healthVm });
    const allItems = result.sections.flatMap(s => s.items);
    const endpointItem = allItems.find(i => i.key === 'endpoint');
    expect(endpointItem?.value).toBe('/health');
  });
  it('has healthStatus item', () => {
    const result = HealthPanel({ viewModel: healthVm });
    const allItems = result.sections.flatMap(s => s.items);
    const statusItem = allItems.find(i => i.key === 'healthStatus');
    expect(statusItem).toBeDefined();
  });
  it('has safety boundary', () => {
    const result = HealthPanel({ viewModel: healthVm });
    expect(result.safetyBoundary.hasLiveData).toBe(false);
  });
  it('falls back to LoadingState for loading status', () => {
    const loadingVm = { ...healthVm, status: 'loading' as const };
    const result = HealthPanel({ viewModel: loadingVm });
    expect(result.componentType).toBe('LoadingState');
  });
  it('falls back to EmptyState for empty status', () => {
    const emptyVm = { ...healthVm, status: 'empty' as const };
    const result = HealthPanel({ viewModel: emptyVm });
    expect(result.componentType).toBe('EmptyState');
  });
  it('falls back to UnavailableState for unavailable status', () => {
    const unavailableVm = { ...healthVm, status: 'unavailable' as const };
    const result = HealthPanel({ viewModel: unavailableVm });
    expect(result.componentType).toBe('UnavailableState');
  });
  it('falls back to ErrorState for error status', () => {
    const errorVm = {
      ...healthVm,
      status: 'error' as const,
      error: buildDashboardErrorViewModel({ code: DASHBOARD_ADAPTER_ERROR_CODES.INVALID_INPUT, message: 'Test error.' }),
    };
    const result = HealthPanel({ viewModel: errorVm });
    expect(result.componentType).toBe('ErrorState');
  });
  it('is deterministic', () => {
    const r1 = HealthPanel({ viewModel: healthVm });
    const r2 = HealthPanel({ viewModel: healthVm });
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

// ─── 8. CapabilitiesPanel component ──────────────────────────────────────────

describe('Phase 25 — CapabilitiesPanel component', () => {
  const capabilitiesVm = buildCapabilitiesViewModel({ envelope: CAPABILITIES_SUCCESS_FIXTURE });

  it('renders from fixture-backed capabilities view model', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(result.componentType).toBe('CapabilitiesPanel');
  });
  it('has role region', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(result.role).toBe('region');
  });
  it('has title Capabilities', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(result.title).toBe('Capabilities');
  });
  it('has ariaLabel containing capabilities', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(result.ariaLabel.toLowerCase()).toContain('capabilities');
  });
  it('has hasHeading true', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(result.hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(result.hasLandmark).toBe(true);
  });
  it('sections is an array with multiple sections', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(Array.isArray(result.sections)).toBe(true);
    expect(result.sections.length).toBeGreaterThanOrEqual(1);
  });
  it('has endpoint item', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    const allItems = result.sections.flatMap(s => s.items);
    const endpointItem = allItems.find(i => i.key === 'endpoint');
    expect(endpointItem?.value).toBe('/capabilities');
  });
  it('has safety boundary', () => {
    const result = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(result.safetyBoundary.hasTradingControls).toBe(false);
  });
  it('falls back to LoadingState for loading status', () => {
    const loadingVm = { ...capabilitiesVm, status: 'loading' as const };
    const result = CapabilitiesPanel({ viewModel: loadingVm });
    expect(result.componentType).toBe('LoadingState');
  });
  it('falls back to EmptyState for empty status', () => {
    const emptyVm = { ...capabilitiesVm, status: 'empty' as const };
    const result = CapabilitiesPanel({ viewModel: emptyVm });
    expect(result.componentType).toBe('EmptyState');
  });
  it('is deterministic', () => {
    const r1 = CapabilitiesPanel({ viewModel: capabilitiesVm });
    const r2 = CapabilitiesPanel({ viewModel: capabilitiesVm });
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

// ─── 9. OverviewPanel component ───────────────────────────────────────────────

describe('Phase 25 — OverviewPanel component', () => {
  const overviewVm = buildDashboardOverviewViewModel({ envelope: DASHBOARD_SUCCESS_FIXTURE });

  it('renders from fixture-backed overview view model', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    expect(result.componentType).toBe('OverviewPanel');
  });
  it('has role region', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    expect(result.role).toBe('region');
  });
  it('has title Dashboard Overview', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    expect(result.title).toBe('Dashboard Overview');
  });
  it('has ariaLabel containing overview', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    expect(result.ariaLabel.toLowerCase()).toContain('overview');
  });
  it('has hasHeading true', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    expect(result.hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    expect(result.hasLandmark).toBe(true);
  });
  it('has endpoint item', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    const allItems = result.sections.flatMap(s => s.items);
    const endpointItem = allItems.find(i => i.key === 'endpoint');
    expect(endpointItem?.value).toBe('/dashboard');
  });
  it('has severity item', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    const allItems = result.sections.flatMap(s => s.items);
    const severityItem = allItems.find(i => i.key === 'severity');
    expect(severityItem).toBeDefined();
  });
  it('has safety boundary', () => {
    const result = OverviewPanel({ viewModel: overviewVm });
    expect(result.safetyBoundary.hasExecutionControls).toBe(false);
  });
  it('falls back to LoadingState for loading status', () => {
    const loadingVm = { ...overviewVm, status: 'loading' as const };
    const result = OverviewPanel({ viewModel: loadingVm });
    expect(result.componentType).toBe('LoadingState');
  });
  it('falls back to ErrorState for error status', () => {
    const errorVm = {
      ...overviewVm,
      status: 'error' as const,
      error: buildDashboardErrorViewModel({ code: DASHBOARD_ADAPTER_ERROR_CODES.INVALID_INPUT, message: 'Err.' }),
    };
    const result = OverviewPanel({ viewModel: errorVm });
    expect(result.componentType).toBe('ErrorState');
  });
  it('is deterministic', () => {
    const r1 = OverviewPanel({ viewModel: overviewVm });
    const r2 = OverviewPanel({ viewModel: overviewVm });
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

// ─── 10. EvidencePanel component ──────────────────────────────────────────────

describe('Phase 25 — EvidencePanel component', () => {
  const evidenceVm = buildEvidenceViewModel({ envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE });

  it('renders from fixture-backed evidence view model', () => {
    const result = EvidencePanel({ viewModel: evidenceVm });
    expect(['EvidencePanel', 'EmptyState']).toContain(result.componentType);
  });
  it('has role region', () => {
    const result = EvidencePanel({ viewModel: evidenceVm });
    expect(result.role).toBe('region');
  });
  it('has hasHeading true', () => {
    const result = EvidencePanel({ viewModel: evidenceVm });
    expect(result.hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    const result = EvidencePanel({ viewModel: evidenceVm });
    expect(result.hasLandmark).toBe(true);
  });
  it('has safety boundary', () => {
    const result = EvidencePanel({ viewModel: evidenceVm });
    expect(result.safetyBoundary.hasLiveData).toBe(false);
  });
  it('falls back to LoadingState for loading status', () => {
    const loadingVm = { ...evidenceVm, status: 'loading' as const };
    const result = EvidencePanel({ viewModel: loadingVm });
    expect(result.componentType).toBe('LoadingState');
  });
  it('falls back to EmptyState when emptyState is set', () => {
    const emptyStateVm = {
      ...evidenceVm,
      status: 'empty' as const,
      emptyState: buildDashboardEmptyViewModel('No evidence.'),
    };
    const result = EvidencePanel({ viewModel: emptyStateVm });
    expect(result.componentType).toBe('EmptyState');
  });
  it('is deterministic', () => {
    const r1 = EvidencePanel({ viewModel: evidenceVm });
    const r2 = EvidencePanel({ viewModel: evidenceVm });
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

// ─── 11. SafetyPanel component ────────────────────────────────────────────────

describe('Phase 25 — SafetyPanel component', () => {
  const safetyVm = buildSafetyViewModel({ envelope: DASHBOARD_SAFETY_SUCCESS_FIXTURE });

  it('renders from fixture-backed safety view model', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    expect(result.componentType).toBe('SafetyPanel');
  });
  it('has role region', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    expect(result.role).toBe('region');
  });
  it('has title Safety', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    expect(result.title).toBe('Safety');
  });
  it('has ariaLabel containing safety', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    expect(result.ariaLabel.toLowerCase()).toContain('safety');
  });
  it('has hasHeading true', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    expect(result.hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    expect(result.hasLandmark).toBe(true);
  });
  it('has endpoint item', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    const allItems = result.sections.flatMap(s => s.items);
    const endpointItem = allItems.find(i => i.key === 'endpoint');
    expect(endpointItem?.value).toBe('/dashboard/safety');
  });
  it('has safetyInvariantsSatisfied item', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    const allItems = result.sections.flatMap(s => s.items);
    const invItem = allItems.find(i => i.key === 'safetyInvariantsSatisfied');
    expect(invItem).toBeDefined();
  });
  it('has safety boundary', () => {
    const result = SafetyPanel({ viewModel: safetyVm });
    expect(result.safetyBoundary.isReadOnly).toBe(true);
  });
  it('falls back to LoadingState for loading status', () => {
    const loadingVm = { ...safetyVm, status: 'loading' as const };
    const result = SafetyPanel({ viewModel: loadingVm });
    expect(result.componentType).toBe('LoadingState');
  });
  it('falls back to EmptyState for empty status', () => {
    const emptyVm = { ...safetyVm, status: 'empty' as const };
    const result = SafetyPanel({ viewModel: emptyVm });
    expect(result.componentType).toBe('EmptyState');
  });
  it('is deterministic', () => {
    const r1 = SafetyPanel({ viewModel: safetyVm });
    const r2 = SafetyPanel({ viewModel: safetyVm });
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

// ─── 12. MetadataPanel component ──────────────────────────────────────────────

describe('Phase 25 — MetadataPanel component', () => {
  const healthVm = buildHealthViewModel({ envelope: HEALTH_SUCCESS_FIXTURE });
  const meta = healthVm.meta;

  it('renders from fixture-backed metadata', () => {
    const result = MetadataPanel({ meta });
    expect(result.componentType).toBe('MetadataPanel');
  });
  it('has title Dashboard Metadata', () => {
    const result = MetadataPanel({ meta });
    expect(result.title).toBe('Dashboard Metadata');
  });
  it('has role region', () => {
    const result = MetadataPanel({ meta });
    expect(result.role).toBe('region');
  });
  it('has hasHeading true', () => {
    const result = MetadataPanel({ meta });
    expect(result.hasHeading).toBe(true);
  });
  it('has hasLandmark true', () => {
    const result = MetadataPanel({ meta });
    expect(result.hasLandmark).toBe(true);
  });
  it('has phase item', () => {
    const result = MetadataPanel({ meta });
    const allItems = result.sections.flatMap(s => s.items);
    const phaseItem = allItems.find(i => i.key === 'phase');
    expect(phaseItem).toBeDefined();
    expect(phaseItem?.value).toBe(22);
  });
  it('has apiMode item', () => {
    const result = MetadataPanel({ meta });
    const allItems = result.sections.flatMap(s => s.items);
    const modeItem = allItems.find(i => i.key === 'apiMode');
    expect(modeItem?.value).toBe('local_read_only');
  });
  it('has fixtureOnly item = true', () => {
    const result = MetadataPanel({ meta });
    const allItems = result.sections.flatMap(s => s.items);
    const fixtureItem = allItems.find(i => i.key === 'fixtureOnly');
    expect(fixtureItem?.value).toBe(true);
  });
  it('has liveData item = false', () => {
    const result = MetadataPanel({ meta });
    const allItems = result.sections.flatMap(s => s.items);
    const liveItem = allItems.find(i => i.key === 'liveData');
    expect(liveItem?.value).toBe(false);
  });
  it('has readOnly item = true', () => {
    const result = MetadataPanel({ meta });
    const allItems = result.sections.flatMap(s => s.items);
    const roItem = allItems.find(i => i.key === 'readOnly');
    expect(roItem?.value).toBe(true);
  });
  it('has localOnly item = true', () => {
    const result = MetadataPanel({ meta });
    const allItems = result.sections.flatMap(s => s.items);
    const loItem = allItems.find(i => i.key === 'localOnly');
    expect(loItem?.value).toBe(true);
  });
  it('has safety boundary', () => {
    const result = MetadataPanel({ meta });
    expect(result.safetyBoundary.isLocalOnly).toBe(true);
  });
  it('is deterministic', () => {
    const r1 = MetadataPanel({ meta });
    const r2 = MetadataPanel({ meta });
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

// ─── 13. DashboardShell component ────────────────────────────────────────────

describe('Phase 25 — DashboardShell component', () => {
  const fullVm = buildFixtureDashboardViewModel();
  const shell = DashboardShell({ viewModel: fullVm });

  it('returns componentType DashboardShell', () => {
    expect(shell.componentType).toBe('DashboardShell');
  });
  it('has role main', () => {
    expect(shell.role).toBe('main');
  });
  it('has title mentioning dashboard', () => {
    expect(shell.title.toLowerCase()).toContain('dashboard');
  });
  it('has ariaLabel mentioning local read-only', () => {
    expect(shell.ariaLabel.toLowerCase()).toContain('local');
    expect(shell.ariaLabel.toLowerCase()).toContain('read-only');
  });
  it('ariaLabel mentions no live data', () => {
    expect(shell.ariaLabel.toLowerCase()).toContain('no live data');
  });
  it('ariaLabel mentions no execution', () => {
    expect(shell.ariaLabel.toLowerCase()).toContain('no execution');
  });
  it('ariaLabel mentions no wallet', () => {
    expect(shell.ariaLabel.toLowerCase()).toContain('no wallet');
  });
  it('has safetyBanner', () => {
    expect(shell.safetyBanner.componentType).toBe('SafetyBanner');
  });
  it('safetyBanner has notices', () => {
    expect(shell.safetyBanner.notices.length).toBeGreaterThan(0);
  });
  it('has navigation entries', () => {
    expect(Array.isArray(shell.navigation)).toBe(true);
    expect(shell.navigation.length).toBeGreaterThan(0);
  });
  it('navigation has health entry', () => {
    const healthNav = shell.navigation.find(n => n.id === 'health');
    expect(healthNav).toBeDefined();
    expect(healthNav?.label).toBe('Health');
  });
  it('navigation has capabilities entry', () => {
    const capsNav = shell.navigation.find(n => n.id === 'capabilities');
    expect(capsNav).toBeDefined();
  });
  it('navigation has overview entry', () => {
    const overviewNav = shell.navigation.find(n => n.id === 'overview');
    expect(overviewNav).toBeDefined();
  });
  it('navigation has evidence entry', () => {
    const evidenceNav = shell.navigation.find(n => n.id === 'evidence');
    expect(evidenceNav).toBeDefined();
  });
  it('navigation has safety entry', () => {
    const safetyNav = shell.navigation.find(n => n.id === 'safety');
    expect(safetyNav).toBeDefined();
  });
  it('navigation entries have ariaLabel', () => {
    shell.navigation.forEach(nav => {
      expect(typeof nav.ariaLabel).toBe('string');
      expect(nav.ariaLabel.length).toBeGreaterThan(0);
    });
  });
  it('has health panel', () => {
    expect(shell.panels.health).toBeDefined();
  });
  it('health panel is not error or unavailable from fixture data', () => {
    expect(['HealthPanel', 'EmptyState', 'LoadingState']).toContain(shell.panels.health.componentType);
  });
  it('has capabilities panel', () => {
    expect(shell.panels.capabilities).toBeDefined();
  });
  it('has overview panel', () => {
    expect(shell.panels.overview).toBeDefined();
  });
  it('has evidence panel', () => {
    expect(shell.panels.evidence).toBeDefined();
  });
  it('has safety panel', () => {
    expect(shell.panels.safety).toBeDefined();
  });
  it('has metadata panel', () => {
    expect(shell.panels.metadata).toBeDefined();
    expect(shell.panels.metadata.componentType).toBe('MetadataPanel');
  });
  it('has footer', () => {
    expect(shell.footer).toBeDefined();
    expect(shell.footer.componentType).toBe('Footer');
  });
  it('footer has role contentinfo', () => {
    expect(shell.footer.role).toBe('contentinfo');
  });
  it('footer has phase 25 item', () => {
    const allItems = shell.footer.sections.flatMap(s => s.items);
    const phase25Item = allItems.find(i => i.key === 'phase25');
    expect(phase25Item?.value).toBe(true);
  });
  it('footer has safetyConfirmation', () => {
    const allItems = shell.footer.sections.flatMap(s => s.items);
    const confItem = allItems.find(i => i.key === 'safetyConfirmation');
    expect(typeof confItem?.value).toBe('string');
    expect((confItem?.value as string).toLowerCase()).toContain('no live data');
  });
  it('has safety boundary isReadOnly true', () => {
    expect(shell.safetyBoundary.isReadOnly).toBe(true);
  });
  it('has safety boundary hasLiveData false', () => {
    expect(shell.safetyBoundary.hasLiveData).toBe(false);
  });
  it('has safety boundary hasTradingControls false', () => {
    expect(shell.safetyBoundary.hasTradingControls).toBe(false);
  });
  it('has safety boundary hasWalletControls false', () => {
    expect(shell.safetyBoundary.hasWalletControls).toBe(false);
  });
  it('has safety boundary hasMutationControls false', () => {
    expect(shell.safetyBoundary.hasMutationControls).toBe(false);
  });
  it('is deterministic', () => {
    const s1 = DashboardShell({ viewModel: fullVm });
    const s2 = DashboardShell({ viewModel: fullVm });
    expect(JSON.stringify(s1)).toBe(JSON.stringify(s2));
  });
});

// ─── 14. Phase 25 capabilities metadata ──────────────────────────────────────

describe('Phase 25 — getDashboardUiShellCapabilities', () => {
  const caps = getDashboardUiShellCapabilities();

  it('dashboardUiShell is true', () => {
    expect(caps.dashboardUiShell).toBe(true);
  });
  it('localReadOnlyDashboard is true', () => {
    expect(caps.localReadOnlyDashboard).toBe(true);
  });
  it('fixtureBackedDashboardUi is true', () => {
    expect(caps.fixtureBackedDashboardUi).toBe(true);
  });
  it('dashboardUsesViewModels is true', () => {
    expect(caps.dashboardUsesViewModels).toBe(true);
  });
  it('dashboardExternalNetwork is false', () => {
    expect(caps.dashboardExternalNetwork).toBe(false);
  });
  it('dashboardLiveData is false', () => {
    expect(caps.dashboardLiveData).toBe(false);
  });
  it('dashboardTradingControls is false', () => {
    expect(caps.dashboardTradingControls).toBe(false);
  });
  it('dashboardWalletControls is false', () => {
    expect(caps.dashboardWalletControls).toBe(false);
  });
  it('dashboardMutationControls is false', () => {
    expect(caps.dashboardMutationControls).toBe(false);
  });
  it('dashboardExecutionControls is false', () => {
    expect(caps.dashboardExecutionControls).toBe(false);
  });
  it('dashboardWalletConnection is false', () => {
    expect(caps.dashboardWalletConnection).toBe(false);
  });
  it('dashboardRealTimeUpdates is false', () => {
    expect(caps.dashboardRealTimeUpdates).toBe(false);
  });
  it('is deterministic', () => {
    const c1 = getDashboardUiShellCapabilities();
    const c2 = getDashboardUiShellCapabilities();
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });
});

// ─── 15. LocalReadOnlyApiCapabilities Phase 25 flags ─────────────────────────

describe('Phase 25 — LocalReadOnlyApiCapabilities Phase 25 flags', () => {
  const apiCaps = getLocalReadOnlyApiCapabilities();

  it('Phase 25 flag dashboardUiShell is true', () => {
    expect(apiCaps.dashboardUiShell).toBe(true);
  });
  it('Phase 25 flag localReadOnlyDashboard is true', () => {
    expect(apiCaps.localReadOnlyDashboard).toBe(true);
  });
  it('Phase 25 flag fixtureBackedDashboardUi is true', () => {
    expect(apiCaps.fixtureBackedDashboardUi).toBe(true);
  });
  it('Phase 25 flag dashboardUsesViewModels is true', () => {
    expect(apiCaps.dashboardUsesViewModels).toBe(true);
  });
  it('Phase 25 flag dashboardExternalNetwork is false', () => {
    expect(apiCaps.dashboardExternalNetwork).toBe(false);
  });
  it('Phase 25 flag dashboardLiveData is false', () => {
    expect(apiCaps.dashboardLiveData).toBe(false);
  });
  it('Phase 25 flag dashboardTradingControls is false', () => {
    expect(apiCaps.dashboardTradingControls).toBe(false);
  });
  it('Phase 25 flag dashboardWalletControls is false', () => {
    expect(apiCaps.dashboardWalletControls).toBe(false);
  });
  it('Phase 25 flag dashboardMutationControls is false', () => {
    expect(apiCaps.dashboardMutationControls).toBe(false);
  });
  it('Phase 25 flag dashboardExecutionControls is false', () => {
    expect(apiCaps.dashboardExecutionControls).toBe(false);
  });
  it('Phase 25 flag dashboardWalletConnection is false', () => {
    expect(apiCaps.dashboardWalletConnection).toBe(false);
  });
  it('Phase 25 flag dashboardRealTimeUpdates is false', () => {
    expect(apiCaps.dashboardRealTimeUpdates).toBe(false);
  });
});

// ─── 16. Phase 24 compatibility regression ───────────────────────────────────

describe('Phase 25 — Phase 24 view model compatibility', () => {
  it('Phase 24 capabilities remain intact on LocalReadOnlyApiCapabilities', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.dashboardDataAdapter).toBe(true);
    expect(caps.dashboardViewModels).toBe(true);
    expect(caps.fixtureBackedViewModels).toBe(true);
    expect(caps.uiReadyDataShapes).toBe(true);
    expect(caps.pureViewModelTransforms).toBe(true);
    expect(caps.dashboardUi).toBe(false);
    expect(caps.externalDashboardData).toBe(false);
  });
  it('Phase 24 capability flag dashboardUi is still false', () => {
    expect(getLocalReadOnlyApiCapabilities().dashboardUi).toBe(false);
  });
  it('buildFixtureDashboardViewModel produces valid view model', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.health.meta.phase).toBe(22);
    expect(vm.health.meta.fixtureOnly).toBe(true);
    expect(vm.health.meta.liveData).toBe(false);
    expect(vm.health.meta.readOnly).toBe(true);
    expect(vm.health.meta.localOnly).toBe(true);
  });
  it('fixture dashboard view model health meta has correct apiMode', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.health.meta.apiMode).toBe('local_read_only');
  });
  it('Phase 24 adapter functions remain usable', () => {
    const healthVm = buildHealthViewModel({ envelope: HEALTH_SUCCESS_FIXTURE });
    expect(healthVm.endpoint).toBe('/health');
  });
  it('Phase 24 error builder remains usable', () => {
    const err = buildDashboardErrorViewModel({
      code: DASHBOARD_ADAPTER_ERROR_CODES.INVALID_INPUT,
      message: 'test',
    });
    expect(err.status).toBe('error');
  });
  it('Phase 24 empty builder remains usable', () => {
    const empty = buildDashboardEmptyViewModel('empty test');
    expect(empty.status).toBe('empty');
  });
  it('Phase 24 loading builder remains usable', () => {
    const loading = buildDashboardLoadingViewModel('loading test');
    expect(loading.status).toBe('loading');
  });
});

// ─── 17. No trading/wallet/execution controls ─────────────────────────────────

describe('Phase 25 — No trading/wallet/execution controls', () => {
  const shell = DashboardShell({ viewModel: buildFixtureDashboardViewModel() });
  const shellJson = JSON.stringify(shell);

  it('shell JSON does not contain "trade" as a control label', () => {
    expect(shellJson.toLowerCase()).not.toContain('"trade"');
  });
  it('shell JSON does not contain "swap"', () => {
    const lower = shellJson.toLowerCase();
    const hasSwap = lower.includes('"swap"') || lower.includes("'swap'");
    expect(hasSwap).toBe(false);
  });
  it('shell JSON does not contain "execute"', () => {
    expect(shellJson.toLowerCase()).not.toContain('"execute"');
  });
  it('shell JSON does not contain "connect wallet"', () => {
    expect(shellJson.toLowerCase()).not.toContain('connect wallet');
  });
  it('shell JSON does not contain "sign transaction"', () => {
    expect(shellJson.toLowerCase()).not.toContain('sign transaction');
  });
  it('shell JSON does not contain "send transaction"', () => {
    expect(shellJson.toLowerCase()).not.toContain('send transaction');
  });
  it('shell JSON does not contain "signTransaction"', () => {
    expect(shellJson.toLowerCase()).not.toContain('signtransaction');
  });
  it('shell JSON does not contain seed phrase', () => {
    expect(shellJson.toLowerCase()).not.toContain('seed phrase');
  });
  it('shell JSON does not contain mnemonic', () => {
    expect(shellJson.toLowerCase()).not.toContain('mnemonic');
  });
  it('all panels have hasTradingControls false', () => {
    expect(shell.panels.health.safetyBoundary.hasTradingControls).toBe(false);
    expect(shell.panels.capabilities.safetyBoundary.hasTradingControls).toBe(false);
    expect(shell.panels.overview.safetyBoundary.hasTradingControls).toBe(false);
    expect(shell.panels.evidence.safetyBoundary.hasTradingControls).toBe(false);
    expect(shell.panels.safety.safetyBoundary.hasTradingControls).toBe(false);
  });
  it('all panels have hasWalletControls false', () => {
    expect(shell.panels.health.safetyBoundary.hasWalletControls).toBe(false);
    expect(shell.panels.capabilities.safetyBoundary.hasWalletControls).toBe(false);
    expect(shell.panels.overview.safetyBoundary.hasWalletControls).toBe(false);
    expect(shell.panels.evidence.safetyBoundary.hasWalletControls).toBe(false);
    expect(shell.panels.safety.safetyBoundary.hasWalletControls).toBe(false);
  });
  it('all panels have hasMutationControls false', () => {
    expect(shell.panels.health.safetyBoundary.hasMutationControls).toBe(false);
    expect(shell.panels.capabilities.safetyBoundary.hasMutationControls).toBe(false);
    expect(shell.panels.overview.safetyBoundary.hasMutationControls).toBe(false);
    expect(shell.panels.evidence.safetyBoundary.hasMutationControls).toBe(false);
    expect(shell.panels.safety.safetyBoundary.hasMutationControls).toBe(false);
  });
});

// ─── 18. Accessibility smoke checks ──────────────────────────────────────────

describe('Phase 25 — Accessibility smoke checks', () => {
  const fullVm = buildFixtureDashboardViewModel();
  const shell = DashboardShell({ viewModel: fullVm });

  it('DashboardShell has role main (landmark)', () => {
    expect(shell.role).toBe('main');
  });
  it('DashboardShell has ariaLabel', () => {
    expect(shell.ariaLabel.length).toBeGreaterThan(0);
  });
  it('SafetyBanner has role banner (landmark)', () => {
    expect(shell.safetyBanner.role).toBe('banner');
  });
  it('SafetyBanner has ariaLabel', () => {
    expect(shell.safetyBanner.ariaLabel.length).toBeGreaterThan(0);
  });
  it('footer has role contentinfo (landmark)', () => {
    expect(shell.footer.role).toBe('contentinfo');
  });
  it('HealthPanel has role region (landmark)', () => {
    expect(['region', 'EmptyState', 'LoadingState'].includes(shell.panels.health.role)).toBe(true);
  });
  it('HealthPanel has ariaLabel', () => {
    expect(shell.panels.health.ariaLabel.length).toBeGreaterThan(0);
  });
  it('CapabilitiesPanel has ariaLabel', () => {
    expect(shell.panels.capabilities.ariaLabel.length).toBeGreaterThan(0);
  });
  it('OverviewPanel has ariaLabel', () => {
    expect(shell.panels.overview.ariaLabel.length).toBeGreaterThan(0);
  });
  it('EvidencePanel has ariaLabel', () => {
    expect(shell.panels.evidence.ariaLabel.length).toBeGreaterThan(0);
  });
  it('SafetyPanel has ariaLabel', () => {
    expect(shell.panels.safety.ariaLabel.length).toBeGreaterThan(0);
  });
  it('MetadataPanel has ariaLabel', () => {
    expect(shell.panels.metadata.ariaLabel.length).toBeGreaterThan(0);
  });
  it('each section has ariaLabel', () => {
    Object.values(shell.panels).forEach(panel => {
      if ('sections' in panel && Array.isArray(panel.sections)) {
        panel.sections.forEach(section => {
          expect(typeof section.ariaLabel).toBe('string');
          expect(section.ariaLabel.length).toBeGreaterThan(0);
        });
      }
    });
  });
  it('each section has sectionId', () => {
    Object.values(shell.panels).forEach(panel => {
      if ('sections' in panel && Array.isArray(panel.sections)) {
        panel.sections.forEach(section => {
          expect(typeof section.sectionId).toBe('string');
          expect(section.sectionId.length).toBeGreaterThan(0);
        });
      }
    });
  });
  it('navigation entries have ariaLabel', () => {
    shell.navigation.forEach(nav => {
      expect(typeof nav.ariaLabel).toBe('string');
      expect(nav.ariaLabel.length).toBeGreaterThan(0);
    });
  });
  it('EmptyState has ariaLabel', () => {
    expect(EmptyState().ariaLabel.length).toBeGreaterThan(0);
  });
  it('LoadingState has ariaLabel', () => {
    expect(LoadingState().ariaLabel.length).toBeGreaterThan(0);
  });
  it('ErrorState has ariaLabel', () => {
    expect(ErrorState().ariaLabel.length).toBeGreaterThan(0);
  });
  it('UnavailableState has ariaLabel', () => {
    expect(UnavailableState().ariaLabel.length).toBeGreaterThan(0);
  });
  it('StatusBadge has ariaLabel with Status prefix', () => {
    expect(StatusBadge({ status: 'ready' }).ariaLabel).toContain('Status:');
  });
});

// ─── 19. Runtime source safety checks ────────────────────────────────────────

describe('Phase 25 — Runtime source safety checks', () => {
  const componentFiles = [
    resolve(DASHBOARD_COMPONENTS_SRC, 'DashboardShell.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'SafetyBanner.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'MetadataPanel.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'HealthPanel.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'CapabilitiesPanel.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'OverviewPanel.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'EvidencePanel.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'SafetyPanel.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'EmptyState.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'LoadingState.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'ErrorState.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'UnavailableState.ts'),
    resolve(DASHBOARD_COMPONENTS_SRC, 'StatusBadge.ts'),
    resolve(DASHBOARD_SRC, 'view-model-source.ts'),
    resolve(DASHBOARD_SRC, 'capabilities.ts'),
    resolve(DASHBOARD_SRC, 'index.ts'),
  ];

  const forbiddenRuntimeTerms = [
    'fetch(',
    'axios',
    'websocket',
    'signTransaction',
    'sendTransaction',
    'child_process',
    'exec(',
    'eval(',
    'new Function(',
  ];

  forbiddenRuntimeTerms.forEach(term => {
    componentFiles.forEach(file => {
      it(`${file.split('/').pop()} does not contain forbidden term "${term}"`, () => {
        const content = readFileSync(file, 'utf8').toLowerCase();
        expect(content).not.toContain(term.toLowerCase());
      });
    });
  });

  it('runtime files contain no wall-clock timestamp usage (Date.now)', () => {
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toContain('Date.now(');
    }
  });

  it('runtime files contain no wall-clock timestamp usage (new Date())', () => {
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toContain('new Date(');
    }
  });

  it('runtime files contain no Math.random usage', () => {
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toContain('Math.random(');
    }
  });

  it('runtime files contain no setTimeout usage', () => {
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toContain('setTimeout(');
    }
  });

  it('runtime files contain no setInterval usage', () => {
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toContain('setInterval(');
    }
  });
});

// ─── 20. No external network regression ──────────────────────────────────────

describe('Phase 25 — No external network regression', () => {
  it('getViewModelSourceMeta externalNetwork is false', () => {
    expect(getViewModelSourceMeta().externalNetwork).toBe(false);
  });
  it('LocalReadOnlyApiCapabilities canUseExternalNetwork is false', () => {
    expect(getLocalReadOnlyApiCapabilities().canUseExternalNetwork).toBe(false);
  });
  it('LocalReadOnlyApiCapabilities externalNetworkClient is false', () => {
    expect(getLocalReadOnlyApiCapabilities().externalNetworkClient).toBe(false);
  });
  it('dashboard view model meta externalNetwork is false', () => {
    const vm = buildFixtureDashboardViewModel();
    expect(vm.health.meta.externalNetwork).toBe(false);
  });
  it('dashboard shell safety boundary hasExternalNetwork is false', () => {
    const shell = DashboardShell({ viewModel: buildFixtureDashboardViewModel() });
    expect(shell.safetyBoundary.hasExternalNetwork).toBe(false);
  });
  it('view-model-source.ts does not contain fetch(', () => {
    const content = readFileSync(resolve(DASHBOARD_SRC, 'view-model-source.ts'), 'utf8');
    expect(content).not.toContain('fetch(');
  });
  it('index.ts does not contain fetch(', () => {
    const content = readFileSync(resolve(DASHBOARD_SRC, 'index.ts'), 'utf8');
    expect(content).not.toContain('fetch(');
  });
});

// ─── 21. Deterministic output checks ─────────────────────────────────────────

describe('Phase 25 — Deterministic output checks', () => {
  it('buildFixtureDashboardViewModel produces same result on multiple calls', () => {
    const results = Array.from({ length: 5 }, () => JSON.stringify(buildFixtureDashboardViewModel()));
    const allSame = results.every(r => r === results[0]);
    expect(allSame).toBe(true);
  });

  it('DashboardShell produces same result on multiple calls', () => {
    const vm = buildFixtureDashboardViewModel();
    const results = Array.from({ length: 3 }, () => JSON.stringify(DashboardShell({ viewModel: vm })));
    const allSame = results.every(r => r === results[0]);
    expect(allSame).toBe(true);
  });

  it('HealthPanel produces same result on multiple calls', () => {
    const healthVm = buildHealthViewModel({ envelope: HEALTH_SUCCESS_FIXTURE });
    const results = Array.from({ length: 3 }, () => JSON.stringify(HealthPanel({ viewModel: healthVm })));
    const allSame = results.every(r => r === results[0]);
    expect(allSame).toBe(true);
  });

  it('SafetyBanner produces same result on multiple calls', () => {
    const results = Array.from({ length: 3 }, () => JSON.stringify(SafetyBanner()));
    const allSame = results.every(r => r === results[0]);
    expect(allSame).toBe(true);
  });

  it('getDashboardUiShellCapabilities produces same result on multiple calls', () => {
    const results = Array.from({ length: 3 }, () => JSON.stringify(getDashboardUiShellCapabilities()));
    const allSame = results.every(r => r === results[0]);
    expect(allSame).toBe(true);
  });

  it('getViewModelSourceMeta produces same result on multiple calls', () => {
    const results = Array.from({ length: 3 }, () => JSON.stringify(getViewModelSourceMeta()));
    const allSame = results.every(r => r === results[0]);
    expect(allSame).toBe(true);
  });
});

// ─── 22. Source file structure checks ────────────────────────────────────────

describe('Phase 25 — Source file structure', () => {
  it('apps/dashboard/src/index.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_SRC, 'index.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/types.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_SRC, 'types.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/view-model-source.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_SRC, 'view-model-source.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/capabilities.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_SRC, 'capabilities.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/DashboardShell.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'DashboardShell.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/SafetyBanner.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'SafetyBanner.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/HealthPanel.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'HealthPanel.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/CapabilitiesPanel.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'CapabilitiesPanel.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/OverviewPanel.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'OverviewPanel.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/EvidencePanel.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'EvidencePanel.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/SafetyPanel.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'SafetyPanel.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/MetadataPanel.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'MetadataPanel.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/EmptyState.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'EmptyState.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/LoadingState.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'LoadingState.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/ErrorState.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'ErrorState.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/UnavailableState.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'UnavailableState.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/src/components/StatusBadge.ts exists', () => {
    const content = readFileSync(resolve(DASHBOARD_COMPONENTS_SRC, 'StatusBadge.ts'), 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('docs/LOCAL_READ_ONLY_DASHBOARD_UI.md exists', () => {
    const docsPath = resolve(__dirname, '../docs/LOCAL_READ_ONLY_DASHBOARD_UI.md');
    const content = readFileSync(docsPath, 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  it('apps/dashboard/README.md exists', () => {
    const readmePath = resolve(__dirname, '../apps/dashboard/README.md');
    const content = readFileSync(readmePath, 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
});

// ─── 23. Safety boundary on all components ───────────────────────────────────

describe('Phase 25 — Safety boundary on all components', () => {
  const components = [
    EmptyState(),
    LoadingState(),
    ErrorState(),
    UnavailableState(),
  ];

  components.forEach(component => {
    it(`${component.componentType} safety boundary isReadOnly is true`, () => {
      expect(component.safetyBoundary.isReadOnly).toBe(true);
    });
    it(`${component.componentType} safety boundary isLocalOnly is true`, () => {
      expect(component.safetyBoundary.isLocalOnly).toBe(true);
    });
    it(`${component.componentType} safety boundary isFixtureBacked is true`, () => {
      expect(component.safetyBoundary.isFixtureBacked).toBe(true);
    });
    it(`${component.componentType} safety boundary hasLiveData is false`, () => {
      expect(component.safetyBoundary.hasLiveData).toBe(false);
    });
    it(`${component.componentType} safety boundary hasTradingControls is false`, () => {
      expect(component.safetyBoundary.hasTradingControls).toBe(false);
    });
    it(`${component.componentType} safety boundary hasWalletControls is false`, () => {
      expect(component.safetyBoundary.hasWalletControls).toBe(false);
    });
    it(`${component.componentType} safety boundary hasMutationControls is false`, () => {
      expect(component.safetyBoundary.hasMutationControls).toBe(false);
    });
  });
});
