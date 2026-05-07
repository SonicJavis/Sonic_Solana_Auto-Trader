/**
 * tests/phase26.test.ts
 *
 * Phase 26 — Local Dashboard Interaction State and Filters v1
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DASHBOARD_PANEL_IDS,
  DASHBOARD_EVIDENCE_SEVERITIES,
  DASHBOARD_ITEM_STATUS_FILTERS,
  DASHBOARD_LOCAL_ITEM_STATES,
  DASHBOARD_EVIDENCE_SORT_FIELDS,
  DASHBOARD_SAFETY_SORT_FIELDS,
  DASHBOARD_SORT_DIRECTIONS,
  createDefaultDashboardInteractionState,
  createDefaultDashboardPanelVisibilityState,
  createDefaultDashboardEvidenceFilterState,
  createDefaultDashboardSafetyFilterState,
  createDefaultDashboardFilterState,
  createDefaultDashboardSortState,
  sanitizeDashboardFilterInput,
  sanitizeDashboardPanelId,
  sanitizeDashboardEvidenceFilters,
  sanitizeDashboardSafetyFilters,
  sanitizeDashboardEvidenceSortField,
  sanitizeDashboardSafetySortField,
  sanitizeDashboardSortDirection,
  sanitizeDashboardStatusFilter,
  sanitizeDashboardLocalStatusFilter,
  validateDashboardInteractionState,
  buildDashboardEvidenceItems,
  buildDashboardSafetyItems,
  applyDashboardEvidenceFilters,
  applyDashboardSafetyFilters,
  applyDashboardEvidenceSort,
  applyDashboardSafetySort,
  setDashboardActivePanel,
  toggleDashboardPanelVisibility,
  setDashboardPanelVisibility,
  updateDashboardEvidenceFilters,
  updateDashboardSafetyFilters,
  updateDashboardSortState,
  resetDashboardInteractionState,
  updateDashboardInteractionState,
  validateAndNormalizeDashboardInteractionState,
  selectDashboardPanels,
  selectVisibleDashboardPanels,
  selectActiveDashboardPanel,
  selectFilteredEvidenceItems,
  selectFilteredSafetyItems,
  selectDashboardRenderModel,
  applyDashboardInteractionState,
  buildFixtureDashboardViewModel,
  getDashboardUiShellCapabilities,
} from '@sonic/dashboard';

import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const DASHBOARD_STATE_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/state');

const STATE_FILES = [
  'types.ts',
  'default-state.ts',
  'validation.ts',
  'filters.ts',
  'reducer.ts',
  'selectors.ts',
  'index.ts',
].map(file => resolve(DASHBOARD_STATE_SRC, file));

describe('Phase 26 — exports', () => {
  const functionExports: Array<[string, unknown]> = [
    ['createDefaultDashboardInteractionState', createDefaultDashboardInteractionState],
    ['createDefaultDashboardPanelVisibilityState', createDefaultDashboardPanelVisibilityState],
    ['createDefaultDashboardEvidenceFilterState', createDefaultDashboardEvidenceFilterState],
    ['createDefaultDashboardSafetyFilterState', createDefaultDashboardSafetyFilterState],
    ['createDefaultDashboardFilterState', createDefaultDashboardFilterState],
    ['createDefaultDashboardSortState', createDefaultDashboardSortState],
    ['sanitizeDashboardFilterInput', sanitizeDashboardFilterInput],
    ['sanitizeDashboardPanelId', sanitizeDashboardPanelId],
    ['sanitizeDashboardEvidenceFilters', sanitizeDashboardEvidenceFilters],
    ['sanitizeDashboardSafetyFilters', sanitizeDashboardSafetyFilters],
    ['sanitizeDashboardEvidenceSortField', sanitizeDashboardEvidenceSortField],
    ['sanitizeDashboardSafetySortField', sanitizeDashboardSafetySortField],
    ['sanitizeDashboardSortDirection', sanitizeDashboardSortDirection],
    ['sanitizeDashboardStatusFilter', sanitizeDashboardStatusFilter],
    ['sanitizeDashboardLocalStatusFilter', sanitizeDashboardLocalStatusFilter],
    ['validateDashboardInteractionState', validateDashboardInteractionState],
    ['buildDashboardEvidenceItems', buildDashboardEvidenceItems],
    ['buildDashboardSafetyItems', buildDashboardSafetyItems],
    ['applyDashboardEvidenceFilters', applyDashboardEvidenceFilters],
    ['applyDashboardSafetyFilters', applyDashboardSafetyFilters],
    ['applyDashboardEvidenceSort', applyDashboardEvidenceSort],
    ['applyDashboardSafetySort', applyDashboardSafetySort],
    ['setDashboardActivePanel', setDashboardActivePanel],
    ['toggleDashboardPanelVisibility', toggleDashboardPanelVisibility],
    ['setDashboardPanelVisibility', setDashboardPanelVisibility],
    ['updateDashboardEvidenceFilters', updateDashboardEvidenceFilters],
    ['updateDashboardSafetyFilters', updateDashboardSafetyFilters],
    ['updateDashboardSortState', updateDashboardSortState],
    ['resetDashboardInteractionState', resetDashboardInteractionState],
    ['updateDashboardInteractionState', updateDashboardInteractionState],
    ['validateAndNormalizeDashboardInteractionState', validateAndNormalizeDashboardInteractionState],
    ['selectDashboardPanels', selectDashboardPanels],
    ['selectVisibleDashboardPanels', selectVisibleDashboardPanels],
    ['selectActiveDashboardPanel', selectActiveDashboardPanel],
    ['selectFilteredEvidenceItems', selectFilteredEvidenceItems],
    ['selectFilteredSafetyItems', selectFilteredSafetyItems],
    ['selectDashboardRenderModel', selectDashboardRenderModel],
    ['applyDashboardInteractionState', applyDashboardInteractionState],
  ];

  functionExports.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  const constExports: Array<[string, readonly string[]]> = [
    ['DASHBOARD_PANEL_IDS', DASHBOARD_PANEL_IDS],
    ['DASHBOARD_EVIDENCE_SEVERITIES', DASHBOARD_EVIDENCE_SEVERITIES],
    ['DASHBOARD_ITEM_STATUS_FILTERS', DASHBOARD_ITEM_STATUS_FILTERS],
    ['DASHBOARD_LOCAL_ITEM_STATES', DASHBOARD_LOCAL_ITEM_STATES],
    ['DASHBOARD_EVIDENCE_SORT_FIELDS', DASHBOARD_EVIDENCE_SORT_FIELDS],
    ['DASHBOARD_SAFETY_SORT_FIELDS', DASHBOARD_SAFETY_SORT_FIELDS],
    ['DASHBOARD_SORT_DIRECTIONS', DASHBOARD_SORT_DIRECTIONS],
  ];

  constExports.forEach(([name, value]) => {
    it(`${name} is a non-empty array`, () => {
      expect(Array.isArray(value)).toBe(true);
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

describe('Phase 26 — default state and serializability', () => {
  const state = createDefaultDashboardInteractionState();

  it('default state uses phase 26', () => {
    expect(state.phase).toBe(26);
  });

  it('default active panel is overview', () => {
    expect(state.activePanelId).toBe('overview');
  });

  it('default panel visibility is all true', () => {
    Object.values(state.panelVisibility).forEach(value => {
      expect(value).toBe(true);
    });
  });

  it('default state is serializable', () => {
    const parsed = JSON.parse(JSON.stringify(state)) as ReturnType<typeof createDefaultDashboardInteractionState>;
    expect(parsed.phase).toBe(26);
  });

  it('default state has deterministic JSON', () => {
    const a = JSON.stringify(createDefaultDashboardInteractionState());
    const b = JSON.stringify(createDefaultDashboardInteractionState());
    expect(a).toBe(b);
  });

  it('state validation passes for default state', () => {
    const result = validateDashboardInteractionState(state);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});

describe('Phase 26 — panel and reducer updates', () => {
  it('setDashboardActivePanel updates active panel for valid panel', () => {
    const current = createDefaultDashboardInteractionState();
    const next = setDashboardActivePanel(current, 'evidence');
    expect(next.state.activePanelId).toBe('evidence');
    expect(next.changed).toBe(true);
  });

  it('setDashboardActivePanel keeps state for invalid panel', () => {
    const current = createDefaultDashboardInteractionState();
    const next = setDashboardActivePanel(current, 'invalid-panel');
    expect(next.state.activePanelId).toBe(current.activePanelId);
    expect(next.changed).toBe(false);
    expect(next.errors.length).toBeGreaterThan(0);
  });

  it('toggleDashboardPanelVisibility flips panel visibility', () => {
    const current = createDefaultDashboardInteractionState();
    const next = toggleDashboardPanelVisibility(current, 'metadata');
    expect(next.state.panelVisibility.metadata).toBe(false);
  });

  it('toggleDashboardPanelVisibility rejects invalid panel', () => {
    const current = createDefaultDashboardInteractionState();
    const next = toggleDashboardPanelVisibility(current, 'nope');
    expect(next.changed).toBe(false);
    expect(next.errors.length).toBeGreaterThan(0);
  });

  it('setDashboardPanelVisibility updates panel visibility', () => {
    const current = createDefaultDashboardInteractionState();
    const next = setDashboardPanelVisibility(current, 'safety', false);
    expect(next.state.panelVisibility.safety).toBe(false);
  });

  it('setDashboardPanelVisibility keeps active panel visible by fallback', () => {
    const current = createDefaultDashboardInteractionState();
    const setOverviewHidden = setDashboardPanelVisibility(current, 'overview', false);
    expect(setOverviewHidden.state.activePanelId).not.toBe('overview');
  });

  it('resetDashboardInteractionState all resets defaults', () => {
    let state = createDefaultDashboardInteractionState();
    state = setDashboardActivePanel(state, 'evidence').state;
    state = updateDashboardEvidenceFilters(state, { query: 'alpha' }).state;
    const reset = resetDashboardInteractionState(state, 'all');
    expect(reset.state).toEqual(createDefaultDashboardInteractionState());
  });

  it('updateDashboardInteractionState supports each known action', () => {
    let state = createDefaultDashboardInteractionState();
    state = updateDashboardInteractionState(state, { type: 'SET_ACTIVE_PANEL', panelId: 'health' }).state;
    state = updateDashboardInteractionState(state, { type: 'TOGGLE_PANEL_VISIBILITY', panelId: 'health' }).state;
    state = updateDashboardInteractionState(state, { type: 'SET_PANEL_VISIBILITY', panelId: 'health', visible: true }).state;
    state = updateDashboardInteractionState(state, { type: 'UPDATE_EVIDENCE_FILTERS', filters: { query: 'x' } }).state;
    state = updateDashboardInteractionState(state, { type: 'UPDATE_SAFETY_FILTERS', filters: { query: 'y' } }).state;
    state = updateDashboardInteractionState(state, {
      type: 'UPDATE_SORT_STATE',
      sort: { evidence: { sortBy: 'severity', direction: 'desc' } },
    }).state;
    state = updateDashboardInteractionState(state, { type: 'RESET_STATE', mode: 'filters' }).state;
    expect(state.phase).toBe(26);
  });

  it('updateDashboardInteractionState unknown action is safe', () => {
    const state = createDefaultDashboardInteractionState();
    const next = updateDashboardInteractionState(state, { type: 'UNKNOWN' } as never);
    expect(next.changed).toBe(false);
    expect(next.errors.length).toBeGreaterThan(0);
  });

  it('update helpers do not mutate input state', () => {
    const state = createDefaultDashboardInteractionState();
    const snapshot = JSON.stringify(state);
    void updateDashboardEvidenceFilters(state, { query: 'immutable' });
    void updateDashboardSafetyFilters(state, { query: 'immutable' });
    void updateDashboardSortState(state, { evidence: { sortBy: 'severity', direction: 'desc' } });
    expect(JSON.stringify(state)).toBe(snapshot);
  });
});

describe('Phase 26 — filter sanitization and validation', () => {
  it('sanitizeDashboardFilterInput removes unsupported characters', () => {
    expect(sanitizeDashboardFilterInput('abc<>$%^')).toBe('abc');
  });

  it('sanitizeDashboardPanelId falls back safely', () => {
    expect(sanitizeDashboardPanelId('bad', 'health')).toBe('health');
  });

  it('sanitizeDashboardEvidenceFilters clamps maxItems', () => {
    expect(sanitizeDashboardEvidenceFilters({ maxItems: 9999 }).maxItems).toBe(200);
    expect(sanitizeDashboardEvidenceFilters({ maxItems: 0 }).maxItems).toBe(1);
  });

  it('sanitizeDashboardEvidenceSortField falls back for invalid value', () => {
    expect(sanitizeDashboardEvidenceSortField('unknown')).toBe('label');
  });

  it('sanitizeDashboardSafetySortField falls back for invalid value', () => {
    expect(sanitizeDashboardSafetySortField('unknown')).toBe('label');
  });

  it('sanitizeDashboardSortDirection falls back for invalid value', () => {
    expect(sanitizeDashboardSortDirection('up')).toBe('asc');
  });

  it('sanitizeDashboardStatusFilter falls back for invalid value', () => {
    expect(sanitizeDashboardStatusFilter('up')).toBe('all');
  });

  it('sanitizeDashboardLocalStatusFilter falls back for invalid value', () => {
    expect(sanitizeDashboardLocalStatusFilter('up')).toBe('all');
  });

  it('validateDashboardInteractionState rejects invalid shape', () => {
    const result = validateDashboardInteractionState(null);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('validateAndNormalizeDashboardInteractionState normalizes invalid state to defaults', () => {
    const result = validateAndNormalizeDashboardInteractionState({ phase: 99 });
    expect(result.state.phase).toBe(26);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('Phase 26 — selectors and filtered outputs', () => {
  const viewModel = buildFixtureDashboardViewModel();

  it('selectDashboardPanels returns expected panel order', () => {
    expect(selectDashboardPanels()).toEqual(DASHBOARD_PANEL_IDS);
  });

  it('selectVisibleDashboardPanels returns all by default', () => {
    const visible = selectVisibleDashboardPanels(createDefaultDashboardInteractionState());
    expect(visible).toEqual(DASHBOARD_PANEL_IDS);
  });

  it('selectActiveDashboardPanel returns fallback visible panel when active hidden', () => {
    const state = setDashboardPanelVisibility(createDefaultDashboardInteractionState(), 'overview', false).state;
    expect(selectActiveDashboardPanel(state)).not.toBe('overview');
  });

  it('selectFilteredEvidenceItems returns deterministic result', () => {
    const state = createDefaultDashboardInteractionState();
    const a = JSON.stringify(selectFilteredEvidenceItems(viewModel, state));
    const b = JSON.stringify(selectFilteredEvidenceItems(viewModel, state));
    expect(a).toBe(b);
  });

  it('selectFilteredSafetyItems returns deterministic result', () => {
    const state = createDefaultDashboardInteractionState();
    const a = JSON.stringify(selectFilteredSafetyItems(viewModel, state));
    const b = JSON.stringify(selectFilteredSafetyItems(viewModel, state));
    expect(a).toBe(b);
  });

  it('selectDashboardRenderModel preserves shell compatibility', () => {
    const result = selectDashboardRenderModel(viewModel, createDefaultDashboardInteractionState());
    expect(result.shell.componentType).toBe('DashboardShell');
    expect(result.shell.panels.health).toBeDefined();
    expect(result.shell.panels.capabilities).toBeDefined();
    expect(result.shell.panels.overview).toBeDefined();
    expect(result.shell.panels.evidence).toBeDefined();
    expect(result.shell.panels.safety).toBeDefined();
    expect(result.shell.panels.metadata).toBeDefined();
  });

  it('selectDashboardRenderModel preserves metadata and footer', () => {
    const result = selectDashboardRenderModel(viewModel, createDefaultDashboardInteractionState());
    expect(result.shell.footer.componentType).toBe('Footer');
    expect(result.shell.safetyBoundary.hasLiveData).toBe(false);
  });

  it('applyDashboardInteractionState returns selector result shape', () => {
    const result = applyDashboardInteractionState(viewModel, createDefaultDashboardInteractionState());
    expect(result.summary.visiblePanelCount).toBeGreaterThan(0);
    expect(result.activePanelId).toBeDefined();
  });

  it('evidence filter can produce empty safe state', () => {
    const state = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), { query: 'NO_MATCH_VALUE' }).state;
    const result = selectDashboardRenderModel(viewModel, state);
    expect(result.filteredEvidenceItems.length).toBe(0);
    expect(['EmptyState', 'EvidencePanel']).toContain(result.shell.panels.evidence.componentType);
  });

  it('safety filter can produce empty safe state', () => {
    const state = updateDashboardSafetyFilters(createDefaultDashboardInteractionState(), {
      query: 'NO_MATCH_VALUE',
      includeSummary: false,
    }).state;
    const result = selectDashboardRenderModel(viewModel, state);
    expect(result.filteredSafetyItems.length).toBe(0);
    expect(['EmptyState', 'SafetyPanel']).toContain(result.shell.panels.safety.componentType);
  });

  it('selector summary tracks visible and hidden panel counts', () => {
    const hidden = setDashboardPanelVisibility(createDefaultDashboardInteractionState(), 'metadata', false).state;
    const result = selectDashboardRenderModel(viewModel, hidden);
    expect(result.summary.hiddenPanelCount).toBe(1);
    expect(result.summary.visiblePanelCount).toBe(5);
  });
});

describe('Phase 26 — capabilities include Phase 26 flags', () => {
  it('dashboard capabilities include true Phase 26 state/filter flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.dashboardInteractionState).toBe(true);
    expect(caps.localDashboardFilters).toBe(true);
    expect(caps.inMemoryDashboardState).toBe(true);
    expect(caps.deterministicDashboardState).toBe(true);
    expect(caps.dashboardPanelVisibility).toBe(true);
    expect(caps.dashboardFilterSelectors).toBe(true);
  });

  it('dashboard capabilities include false Phase 26 unsafe flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.dashboardPersistentState).toBe(false);
    expect(caps.dashboardExternalStateSync).toBe(false);
    expect(caps.dashboardLiveFilters).toBe(false);
    expect(caps.dashboardMutationControls).toBe(false);
    expect(caps.dashboardExternalNetwork).toBe(false);
  });

  it('read-only-api capabilities include Phase 26 dashboard flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.dashboardInteractionState).toBe(true);
    expect(caps.localDashboardFilters).toBe(true);
    expect(caps.inMemoryDashboardState).toBe(true);
    expect(caps.deterministicDashboardState).toBe(true);
    expect(caps.dashboardPanelVisibility).toBe(true);
    expect(caps.dashboardFilterSelectors).toBe(true);
    expect(caps.dashboardPersistentState).toBe(false);
    expect(caps.dashboardExternalStateSync).toBe(false);
    expect(caps.dashboardLiveFilters).toBe(false);
  });

  it('dashboard capabilities keep wallet/trading/execution/mutation controls disabled', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.dashboardWalletControls).toBe(false);
    expect(caps.dashboardTradingControls).toBe(false);
    expect(caps.dashboardExecutionControls).toBe(false);
    expect(caps.dashboardMutationControls).toBe(false);
  });

  it('read-only-api capabilities keep external network and mutation disabled', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.canUseExternalNetwork).toBe(false);
    expect(caps.canMutatePriorEvidence).toBe(false);
    expect(caps.dashboardExternalNetwork).toBe(false);
  });
});

describe('Phase 26 — deterministic ordering checks', () => {
  const evidenceItems = [
    {
      id: '2',
      label: 'B',
      description: '',
      severity: 'warning',
      status: 'ready' as const,
      panel: 'evidence' as const,
      classification: 'c',
      sourceKind: 's',
      raw: {},
    },
    {
      id: '1',
      label: 'A',
      description: '',
      severity: 'info',
      status: 'ready' as const,
      panel: 'evidence' as const,
      classification: 'c',
      sourceKind: 's',
      raw: {},
    },
  ];

  const safetyItems = [
    {
      id: '2',
      label: 'B',
      description: '',
      severity: 'warning',
      status: 'locked' as const,
      panel: 'safety' as const,
      classification: 'locked_capability',
      sourceKind: 'safety_panel',
    },
    {
      id: '1',
      label: 'A',
      description: '',
      severity: 'info',
      status: 'unlocked' as const,
      panel: 'safety' as const,
      classification: 'summary',
      sourceKind: 'safety_panel',
    },
  ];

  it('applyDashboardEvidenceSort sorts asc deterministically', () => {
    const sorted = applyDashboardEvidenceSort(evidenceItems, 'label', 'asc');
    expect(sorted[0]?.label).toBe('A');
  });

  it('applyDashboardEvidenceSort sorts desc deterministically', () => {
    const sorted = applyDashboardEvidenceSort(evidenceItems, 'label', 'desc');
    expect(sorted[0]?.label).toBe('B');
  });

  it('applyDashboardSafetySort sorts asc deterministically', () => {
    const sorted = applyDashboardSafetySort(safetyItems, 'label', 'asc');
    expect(sorted[0]?.label).toBe('A');
  });

  it('applyDashboardSafetySort sorts desc deterministically', () => {
    const sorted = applyDashboardSafetySort(safetyItems, 'label', 'desc');
    expect(sorted[0]?.label).toBe('B');
  });
});

describe('Phase 26 — no persistence/browser storage/network/runtime hazards', () => {
  const forbiddenRuntimeTerms = [
    'fetch(',
    'axios',
    'websocket',
    'localStorage',
    'sessionStorage',
    'IndexedDB',
    'document.cookie',
    'Date.now(',
    'new Date(',
    'Math.random(',
    'setTimeout(',
    'setInterval(',
    'signTransaction',
    'sendTransaction',
    'child_process',
    'exec(',
    'eval(',
    'new Function(',
  ];

  forbiddenRuntimeTerms.forEach(term => {
    STATE_FILES.forEach(file => {
      it(`${file.split('/').pop()} does not contain forbidden term ${term}`, () => {
        const content = readFileSync(file, 'utf8');
        expect(content.toLowerCase()).not.toContain(term.toLowerCase());
      });
    });
  });

  it('state files exist', () => {
    STATE_FILES.forEach(file => {
      expect(readFileSync(file, 'utf8').length).toBeGreaterThan(0);
    });
  });
});

describe('Phase 26 — safety and sanitization regression', () => {
  it('sanitizes malicious evidence query text', () => {
    const state = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), {
      query: 'abc<script>alert(1)</script>',
    }).state;
    expect(state.filters.evidence.query.includes('<')).toBe(false);
  });

  it('sanitizes malicious safety query text', () => {
    const state = updateDashboardSafetyFilters(createDefaultDashboardInteractionState(), {
      query: 'abc<script>alert(1)</script>',
    }).state;
    expect(state.filters.safety.query.includes('<')).toBe(false);
  });

  it('state JSON has no stack trace text', () => {
    const state = createDefaultDashboardInteractionState();
    const json = JSON.stringify(state);
    expect(json.includes('at ')).toBe(false);
  });

  it('state JSON has no local filesystem paths', () => {
    const json = JSON.stringify(createDefaultDashboardInteractionState());
    expect(json.includes('/home/')).toBe(false);
    expect(json.includes('/Users/')).toBe(false);
    expect(json.includes('C:\\Users\\')).toBe(false);
  });

  it('state JSON has no secret patterns', () => {
    const json = JSON.stringify(createDefaultDashboardInteractionState()).toLowerCase();
    expect(json.includes('private key')).toBe(false);
    expect(json.includes('seed phrase')).toBe(false);
    expect(json.includes('mnemonic')).toBe(false);
  });
});

describe('Phase 26 — action/selector matrix coverage', () => {
  const panelTargets = ['health', 'capabilities', 'overview', 'evidence', 'safety', 'metadata'] as const;

  panelTargets.forEach(panel => {
    it(`SET_ACTIVE_PANEL supports ${panel}`, () => {
      const result = setDashboardActivePanel(createDefaultDashboardInteractionState(), panel);
      expect(result.state.activePanelId).toBe(panel);
    });

    it(`TOGGLE_PANEL_VISIBILITY supports ${panel}`, () => {
      const result = toggleDashboardPanelVisibility(createDefaultDashboardInteractionState(), panel);
      expect(result.state.panelVisibility[panel]).toBe(false);
    });

    it(`SET_PANEL_VISIBILITY supports ${panel}=false`, () => {
      const result = setDashboardPanelVisibility(createDefaultDashboardInteractionState(), panel, false);
      expect(result.state.panelVisibility[panel]).toBe(false);
    });

    it(`SET_PANEL_VISIBILITY supports ${panel}=true`, () => {
      const hidden = setDashboardPanelVisibility(createDefaultDashboardInteractionState(), panel, false).state;
      const shown = setDashboardPanelVisibility(hidden, panel, true);
      expect(shown.state.panelVisibility[panel]).toBe(true);
    });
  });

  DASHBOARD_EVIDENCE_SEVERITIES.forEach(severity => {
    it(`evidence filter accepts severity ${severity}`, () => {
      const state = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), { severity }).state;
      expect(state.filters.evidence.severity).toBe(severity);
    });
  });

  DASHBOARD_ITEM_STATUS_FILTERS.forEach(status => {
    it(`evidence filter accepts status ${status}`, () => {
      const state = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), { status }).state;
      expect(state.filters.evidence.status).toBe(status);
    });
  });

  DASHBOARD_LOCAL_ITEM_STATES.forEach(status => {
    it(`safety filter accepts status ${status}`, () => {
      const state = updateDashboardSafetyFilters(createDefaultDashboardInteractionState(), { status }).state;
      expect(state.filters.safety.status).toBe(status);
    });
  });

  DASHBOARD_EVIDENCE_SORT_FIELDS.forEach(sortBy => {
    DASHBOARD_SORT_DIRECTIONS.forEach(direction => {
      it(`evidence sort accepts ${sortBy}/${direction}`, () => {
        const state = updateDashboardSortState(createDefaultDashboardInteractionState(), {
          evidence: { sortBy, direction },
        }).state;
        expect(state.sort.evidence.sortBy).toBe(sortBy);
        expect(state.sort.evidence.direction).toBe(direction);
      });
    });
  });

  DASHBOARD_SAFETY_SORT_FIELDS.forEach(sortBy => {
    DASHBOARD_SORT_DIRECTIONS.forEach(direction => {
      it(`safety sort accepts ${sortBy}/${direction}`, () => {
        const state = updateDashboardSortState(createDefaultDashboardInteractionState(), {
          safety: { sortBy, direction },
        }).state;
        expect(state.sort.safety.sortBy).toBe(sortBy);
        expect(state.sort.safety.direction).toBe(direction);
      });
    });
  });

  const vm = buildFixtureDashboardViewModel();
  const querySamples = ['', 'risk', 'warning', 'summary', 'locked'];

  querySamples.forEach(query => {
    it(`selector roundtrip deterministic for evidence query '${query}'`, () => {
      const state = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), { query }).state;
      const a = JSON.stringify(selectDashboardRenderModel(vm, state));
      const b = JSON.stringify(selectDashboardRenderModel(vm, state));
      expect(a).toBe(b);
    });

    it(`selector roundtrip deterministic for safety query '${query}'`, () => {
      const state = updateDashboardSafetyFilters(createDefaultDashboardInteractionState(), { query }).state;
      const a = JSON.stringify(selectDashboardRenderModel(vm, state));
      const b = JSON.stringify(selectDashboardRenderModel(vm, state));
      expect(a).toBe(b);
    });
  });
});

describe('Phase 26 — additional reset and selector regressions', () => {
  const resetModes = ['all', 'activePanel', 'panelVisibility', 'filters', 'sort'] as const;

  resetModes.forEach(mode => {
    it(`resetDashboardInteractionState supports mode ${mode}`, () => {
      const state = createDefaultDashboardInteractionState();
      const result = resetDashboardInteractionState(state, mode);
      expect(result.state.phase).toBe(26);
    });
  });

  const invalidPanels = ['bad', '', '123', 'panel', 'wallet', 'trade'] as const;
  invalidPanels.forEach(value => {
    it(`sanitizeDashboardPanelId rejects invalid panel ${value}`, () => {
      expect(sanitizeDashboardPanelId(value, 'overview')).toBe('overview');
    });
  });

  const vm = buildFixtureDashboardViewModel();
  const visibilityTargets = ['health', 'capabilities', 'overview', 'evidence', 'safety', 'metadata'] as const;
  visibilityTargets.forEach(panel => {
    it(`visible selector excludes hidden panel ${panel}`, () => {
      const state = setDashboardPanelVisibility(createDefaultDashboardInteractionState(), panel, false).state;
      const visible = selectVisibleDashboardPanels(state);
      expect(visible.includes(panel)).toBe(false);
    });
  });

  it('applyDashboardInteractionState keeps shell safety boundary read-only', () => {
    const result = applyDashboardInteractionState(vm, createDefaultDashboardInteractionState());
    expect(result.shell.safetyBoundary.isReadOnly).toBe(true);
  });

  it('applyDashboardInteractionState keeps shell external-network-free', () => {
    const result = applyDashboardInteractionState(vm, createDefaultDashboardInteractionState());
    expect(result.shell.safetyBoundary.hasExternalNetwork).toBe(false);
  });

  it('applyDashboardInteractionState keeps shell mutation controls disabled', () => {
    const result = applyDashboardInteractionState(vm, createDefaultDashboardInteractionState());
    expect(result.shell.safetyBoundary.hasMutationControls).toBe(false);
  });
});
