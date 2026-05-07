/**
 * apps/dashboard/src/components/DashboardShell.ts
 *
 * Phase 25 — Dashboard UI Shell — DashboardShell Component
 *
 * Top-level dashboard shell. Composes all panels into a single structured output.
 * Includes safety banner, navigation, all panels, and footer metadata.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardShellResult, DashboardNavEntry } from '../types.js';
import type { DashboardViewModel, DashboardViewModelMeta } from '@sonic/dashboard-view-models';
import { SafetyBanner, PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';
import { HealthPanel } from './HealthPanel.js';
import { CapabilitiesPanel } from './CapabilitiesPanel.js';
import { OverviewPanel } from './OverviewPanel.js';
import { EvidencePanel } from './EvidencePanel.js';
import { SafetyPanel } from './SafetyPanel.js';
import { MetadataPanel } from './MetadataPanel.js';

export interface DashboardShellProps {
  readonly viewModel: DashboardViewModel;
}

/** Static navigation entries for the dashboard shell. */
const DASHBOARD_NAV_ENTRIES: readonly DashboardNavEntry[] = [
  { id: 'health', label: 'Health', ariaLabel: 'Navigate to Health section', isCurrent: false },
  { id: 'capabilities', label: 'Capabilities', ariaLabel: 'Navigate to Capabilities section', isCurrent: false },
  { id: 'overview', label: 'Overview', ariaLabel: 'Navigate to Overview section', isCurrent: false },
  { id: 'evidence', label: 'Evidence', ariaLabel: 'Navigate to Evidence section', isCurrent: false },
  { id: 'safety', label: 'Safety', ariaLabel: 'Navigate to Safety section', isCurrent: false },
] as const;

/**
 * DashboardShell component.
 *
 * Renders the full dashboard shell with all panels.
 * Composed from Phase 24 view models only.
 * All panels are read-only and fixture-backed.
 * No live data. No trading controls. No wallet controls.
 * Deterministic.
 */
export function DashboardShell(props: DashboardShellProps): DashboardShellResult {
  const { viewModel } = props;

  const healthPanel = HealthPanel({ viewModel: viewModel.health });
  const capabilitiesPanel = CapabilitiesPanel({ viewModel: viewModel.capabilities });
  const overviewPanel = OverviewPanel({ viewModel: viewModel.overview });
  const evidencePanel = EvidencePanel({ viewModel: viewModel.evidence });
  const safetyPanel = SafetyPanel({ viewModel: viewModel.safety });
  const metadataPanel = MetadataPanel({ meta: viewModel.health.meta });

  const footer = buildFooter(viewModel.health.meta);

  return {
    componentType: 'DashboardShell',
    title: 'Sonic Solana Auto-Trader — Local Read-Only Dashboard',
    role: 'main',
    ariaLabel:
      'Sonic Solana Auto-Trader local read-only dashboard. Fixture-backed. No live data. No execution. No wallet.',
    safetyBanner: SafetyBanner(),
    navigation: DASHBOARD_NAV_ENTRIES,
    panels: {
      health: healthPanel,
      capabilities: capabilitiesPanel,
      overview: overviewPanel,
      evidence: evidencePanel,
      safety: safetyPanel,
      metadata: metadataPanel,
    },
    footer,
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}

/** Builds the footer panel from view model metadata. */
function buildFooter(meta: DashboardViewModelMeta): DashboardRenderResult {
  return {
    componentType: 'Footer',
    title: 'Dashboard Footer',
    ariaLabel: 'Dashboard footer: phase and safety metadata',
    role: 'contentinfo',
    hasHeading: false,
    hasLandmark: true,
    sections: [
      {
        sectionId: 'footer-meta',
        title: 'Phase & Safety Metadata',
        role: 'group',
        ariaLabel: 'Footer metadata',
        items: [
          { key: 'phase', label: 'Phase', value: `Phase ${meta.phase}` },
          { key: 'apiMode', label: 'Mode', value: meta.apiMode },
          { key: 'fixtureOnly', label: 'Fixture Only', value: meta.fixtureOnly },
          { key: 'liveData', label: 'Live Data', value: meta.liveData },
          { key: 'readOnly', label: 'Read Only', value: meta.readOnly },
          { key: 'localOnly', label: 'Local Only', value: meta.localOnly },
          { key: 'phase25', label: 'Phase 25 UI Shell', value: true },
          {
            key: 'safetyConfirmation',
            label: 'Safety Confirmation',
            value:
              'Phase 25 adds no live data, Solana RPC, provider APIs, wallets, execution, trading, external network access, or mutation controls.',
          },
        ],
      },
    ],
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
