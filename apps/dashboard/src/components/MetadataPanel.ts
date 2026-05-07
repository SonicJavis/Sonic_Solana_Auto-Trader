/**
 * apps/dashboard/src/components/MetadataPanel.ts
 *
 * Phase 25 — Dashboard UI Shell — MetadataPanel Component
 *
 * Renders Phase 22/24 view model metadata including phase label,
 * api mode, safety flags, and determinism confirmation.
 * Read-only. No side effects. No network. No mutation.
 */

import type { DashboardRenderResult, DashboardItem } from '../types.js';
import type { DashboardViewModelMeta } from '@sonic/dashboard-view-models';
import { PHASE_25_SAFETY_BOUNDARY } from './SafetyBanner.js';
import { StatusBadge } from './StatusBadge.js';

export interface MetadataPanelProps {
  readonly meta: DashboardViewModelMeta;
}

/**
 * MetadataPanel component.
 *
 * Renders view model metadata as a read-only panel.
 * Preserves phase/safety flags from Phase 22/24.
 * Deterministic. No live data.
 */
export function MetadataPanel(props: MetadataPanelProps): DashboardRenderResult {
  const { meta } = props;

  const coreItems: DashboardItem[] = [
    {
      key: 'phase',
      label: 'Phase',
      value: meta.phase,
      description: 'Phase number of the originating read-only API contract.',
    },
    {
      key: 'apiMode',
      label: 'API Mode',
      value: meta.apiMode,
      description: 'The API mode — always local_read_only for Phase 25.',
    },
    {
      key: 'generatedAt',
      label: 'Generated At',
      value: meta.generatedAt,
      description: 'Deterministic generation timestamp from contract metadata.',
    },
  ];

  const safetyItems: DashboardItem[] = [
    {
      key: 'deterministic',
      label: 'Deterministic',
      value: meta.deterministic,
      badge: StatusBadge({ status: String(meta.deterministic) }),
    },
    {
      key: 'fixtureOnly',
      label: 'Fixture Only',
      value: meta.fixtureOnly,
      badge: StatusBadge({ status: String(meta.fixtureOnly) }),
    },
    {
      key: 'liveData',
      label: 'Live Data',
      value: meta.liveData,
      badge: StatusBadge({ status: String(meta.liveData) }),
    },
    {
      key: 'safeToDisplay',
      label: 'Safe to Display',
      value: meta.safeToDisplay,
      badge: StatusBadge({ status: String(meta.safeToDisplay) }),
    },
    {
      key: 'analysisOnly',
      label: 'Analysis Only',
      value: meta.analysisOnly,
      badge: StatusBadge({ status: String(meta.analysisOnly) }),
    },
    {
      key: 'nonExecutable',
      label: 'Non-Executable',
      value: meta.nonExecutable,
      badge: StatusBadge({ status: String(meta.nonExecutable) }),
    },
    {
      key: 'readOnly',
      label: 'Read Only',
      value: meta.readOnly,
      badge: StatusBadge({ status: String(meta.readOnly) }),
    },
    {
      key: 'localOnly',
      label: 'Local Only',
      value: meta.localOnly,
      badge: StatusBadge({ status: String(meta.localOnly) }),
    },
    {
      key: 'mutating',
      label: 'Mutating',
      value: meta.mutating,
      badge: StatusBadge({ status: String(meta.mutating) }),
    },
    {
      key: 'externalNetwork',
      label: 'External Network',
      value: meta.externalNetwork,
      badge: StatusBadge({ status: String(meta.externalNetwork) }),
    },
  ];

  return {
    componentType: 'MetadataPanel',
    title: 'Dashboard Metadata',
    ariaLabel: 'Dashboard metadata: phase, api mode, and safety flags',
    role: 'region',
    hasHeading: true,
    hasLandmark: true,
    sections: [
      {
        sectionId: 'metadata-core',
        title: 'Core Metadata',
        role: 'group',
        ariaLabel: 'Core metadata fields',
        items: coreItems,
      },
      {
        sectionId: 'metadata-safety',
        title: 'Safety Flags',
        role: 'group',
        ariaLabel: 'Safety flag fields',
        items: safetyItems,
      },
    ],
    safetyBoundary: PHASE_25_SAFETY_BOUNDARY,
  };
}
