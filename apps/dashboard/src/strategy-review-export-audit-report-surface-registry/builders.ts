/**
 * Phase 52 — Strategy Review Export Audit Report Surface Registry v1: builders.
 */

import { PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST } from '../strategy-review-export-audit/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES } from '../strategy-review-export-audit-report/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS } from '../strategy-review-export-audit-report-view-models/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS } from '../strategy-review-export-audit-report-contracts/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS } from '../strategy-review-export-audit-report-contract-selectors/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS } from '../strategy-review-export-audit-report-selector-view-models/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS } from '../strategy-review-export-audit-report-selector-view-model-contracts/index.js';
import { getStrategyReviewExportAuditReportSurfaceRegistryCapabilities } from './capabilities.js';
import { stableDeterministicStrategyReviewExportAuditReportSurfaceRegistryChecksum } from './normalization.js';
import {
  PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT,
  PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE,
  PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE,
  type BuildStrategyReviewExportAuditReportSurfaceRegistryEntryInput,
  type BuildStrategyReviewExportAuditReportSurfaceRegistryInput,
  type StrategyReviewExportAuditReportSurfaceRegistry,
  type StrategyReviewExportAuditReportSurfaceRegistryAggressiveSafePolicy,
  type StrategyReviewExportAuditReportSurfaceRegistryConsumerGuidance,
  type StrategyReviewExportAuditReportSurfaceRegistryEntry,
  type StrategyReviewExportAuditReportSurfaceRegistryEntryName,
  type StrategyReviewExportAuditReportSurfaceRegistryMeta,
  type StrategyReviewExportAuditReportSurfaceRegistryNextMilestoneGate,
  type StrategyReviewExportAuditReportSurfaceRegistryRelationships,
  type StrategyReviewExportAuditReportSurfaceRegistrySafetySummary,
  type StrategyReviewExportAuditReportSurfaceRegistryValidationSummary,
} from './types.js';

interface EntryDefinition {
  readonly phase: 45 | 46 | 47 | 48 | 49 | 50 | 51;
  readonly entryKind: StrategyReviewExportAuditReportSurfaceRegistryEntry['entryKind'];
  readonly modulePath: string;
  readonly docPath: string;
  readonly testPath: string;
  readonly surfaceRole: string;
  readonly sourceEntries: readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[];
  readonly isDerivativeLayer: boolean;
  readonly hasRealConsumer: boolean;
  readonly sourceEntryCount: number;
}

const ENTRY_DEFINITIONS: Readonly<Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, EntryDefinition>> = {
  'strategy-review-export-audit-fixtures': {
    phase: 45,
    entryKind: 'audit-fixtures',
    modulePath: 'apps/dashboard/src/strategy-review-export-audit',
    docPath: 'docs/PHASE_LOG.md',
    testPath: 'tests/phase45.test.ts',
    surfaceRole: 'deterministic fixture audit baseline',
    sourceEntries: [],
    isDerivativeLayer: false,
    hasRealConsumer: true,
    sourceEntryCount: PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.length,
  },
  'strategy-review-export-audit-report-fixtures': {
    phase: 46,
    entryKind: 'report-fixtures',
    modulePath: 'apps/dashboard/src/strategy-review-export-audit-report',
    docPath: 'docs/STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES.md',
    testPath: 'tests/phase46.test.ts',
    surfaceRole: 'deterministic fixture report baseline',
    sourceEntries: ['strategy-review-export-audit-fixtures'],
    isDerivativeLayer: false,
    hasRealConsumer: true,
    sourceEntryCount: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES.length,
  },
  'strategy-review-export-audit-report-view-models': {
    phase: 47,
    entryKind: 'view-models',
    modulePath: 'apps/dashboard/src/strategy-review-export-audit-report-view-models',
    docPath: 'docs/STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.md',
    testPath: 'tests/phase47.test.ts',
    surfaceRole: 'view-model projection for report fixtures',
    sourceEntries: ['strategy-review-export-audit-report-fixtures'],
    isDerivativeLayer: true,
    hasRealConsumer: true,
    sourceEntryCount: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length,
  },
  'strategy-review-export-audit-report-api-contracts': {
    phase: 48,
    entryKind: 'api-contracts',
    modulePath: 'apps/dashboard/src/strategy-review-export-audit-report-contracts',
    docPath: 'docs/STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.md',
    testPath: 'tests/phase48.test.ts',
    surfaceRole: 'read-only synthetic API contract fixtures',
    sourceEntries: ['strategy-review-export-audit-report-view-models'],
    isDerivativeLayer: true,
    hasRealConsumer: true,
    sourceEntryCount: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.length,
  },
  'strategy-review-export-audit-report-contract-selectors': {
    phase: 49,
    entryKind: 'contract-selectors',
    modulePath: 'apps/dashboard/src/strategy-review-export-audit-report-contract-selectors',
    docPath: 'docs/STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.md',
    testPath: 'tests/phase49.test.ts',
    surfaceRole: 'deterministic selectors over API contracts',
    sourceEntries: ['strategy-review-export-audit-report-api-contracts'],
    isDerivativeLayer: true,
    hasRealConsumer: true,
    sourceEntryCount: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.length,
  },
  'strategy-review-export-audit-report-selector-view-models': {
    phase: 50,
    entryKind: 'selector-view-models',
    modulePath: 'apps/dashboard/src/strategy-review-export-audit-report-selector-view-models',
    docPath: 'docs/STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.md',
    testPath: 'tests/phase50.test.ts',
    surfaceRole: 'view-model projection for selector contracts',
    sourceEntries: ['strategy-review-export-audit-report-contract-selectors'],
    isDerivativeLayer: true,
    hasRealConsumer: true,
    sourceEntryCount: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length,
  },
  'strategy-review-export-audit-report-selector-view-model-api-contracts': {
    phase: 51,
    entryKind: 'selector-view-model-api-contracts',
    modulePath: 'apps/dashboard/src/strategy-review-export-audit-report-selector-view-model-contracts',
    docPath: 'docs/STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.md',
    testPath: 'tests/phase51.test.ts',
    surfaceRole: 'read-only synthetic API contracts for selector view models',
    sourceEntries: ['strategy-review-export-audit-report-selector-view-models'],
    isDerivativeLayer: true,
    hasRealConsumer: true,
    sourceEntryCount: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.length,
  },
};

function entryId(seed: string): string {
  return `phase52-surface-registry-entry-${stableDeterministicStrategyReviewExportAuditReportSurfaceRegistryChecksum(seed).replace(':', '-')}`;
}

function registryId(seed: string): string {
  return `phase52-surface-registry-${stableDeterministicStrategyReviewExportAuditReportSurfaceRegistryChecksum(seed).replace(':', '-')}`;
}

function buildSafetySummary(): StrategyReviewExportAuditReportSurfaceRegistrySafetySummary {
  return {
    fixtureOnly: true,
    syntheticOnly: true,
    deterministic: true,
    localOnly: true,
    readOnly: true,
    nonEndpoint: true,
    nonHandler: true,
    nonRuntimeRequest: true,
    nonRendering: true,
    nonDom: true,
    nonExecutable: true,
    nonPersistent: true,
    nonNetworked: true,
    nonAdvisory: true,
  };
}

function buildValidationSummary(): StrategyReviewExportAuditReportSurfaceRegistryValidationSummary {
  return {
    fixtureOnly: true,
    structuralValidation: 'passed',
    safetyValidation: 'passed',
    linkageValidation: 'passed',
    policyValidation: 'passed',
    issueCount: 0,
  };
}

function buildConsumerGuidance(): StrategyReviewExportAuditReportSurfaceRegistryConsumerGuidance {
  return {
    preferredConsumptionPath: 'phase52-surface-registry',
    avoidFurtherDerivativeLayers: true,
    requiresRealConsumerForNewDerivatives: true,
    notes: [
      'Consume this registry as the canonical Phase 45–51 strategy-review export surface catalog.',
      'Do not add wrapper-on-wrapper derivative layers without a concrete next-step consumer.',
      'Prefer complete vertical-slice milestones that ship fixtures, contracts, selectors, validation, docs, and tests together when safe.',
    ],
  };
}

function buildAggressiveSafePolicy(): StrategyReviewExportAuditReportSurfaceRegistryAggressiveSafePolicy {
  return {
    preferVerticalSlicesOverMicroPhases: true,
    disallowWrapperOnWrapperWithoutRealConsumer: true,
    bundleFixturesModelsContractsSelectorsValidationDocsTestsWhenSafe: true,
    keepHardLiveSafetyGates: true,
    preventsUnnecessaryDerivativeLayers: true,
    policyDocPath: 'docs/AGGRESSIVE_SAFE_PHASE_POLICY.md',
    notes: [
      'Aggressive-safe policy shifts from micro-phases to milestone slices when safety posture is preserved.',
      'Derivative recursion is blocked unless a real consumer requires the layer.',
      'Live, networked, wallet, signing, execution, and advisory behavior remains locked behind future gated milestones.',
    ],
  };
}

function buildNextMilestone(): StrategyReviewExportAuditReportSurfaceRegistryNextMilestoneGate {
  return {
    nextPhase: 53,
    milestoneName: 'Phase 53 — Synthetic Launch Intelligence Foundation v1',
    implemented: false,
    requiredBeforeAnyLiveTrading: [
      'synthetic fixtures',
      'read-only provider contracts',
      'read-only provider adapters',
      'replay',
      'paper simulation',
      'manual-confirmed tiny live execution',
      'limited-live explicit unlock',
      'full-auto explicit authorization',
    ],
  };
}

function buildRelationships(
  entries: readonly StrategyReviewExportAuditReportSurfaceRegistryEntry[],
): StrategyReviewExportAuditReportSurfaceRegistryRelationships {
  const dependencies = entries.reduce<Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>>(
    (accumulator, entry) => {
      accumulator[entry.entryName] = [...entry.sourceEntries].sort((left, right) => left.localeCompare(right));
      return accumulator;
    },
    {} as Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>,
  );

  const dependentsSeed = entries.reduce<Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>>(
    (accumulator, entry) => {
      accumulator[entry.entryName] = [];
      return accumulator;
    },
    {} as Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>,
  );

  entries.forEach(entry => {
    entry.sourceEntries.forEach(sourceEntry => {
      dependentsSeed[sourceEntry].push(entry.entryName);
    });
  });

  const dependents = Object.entries(dependentsSeed).reduce<Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>>(
    (accumulator, [entryName, nextDependents]) => {
      accumulator[entryName as StrategyReviewExportAuditReportSurfaceRegistryEntryName] = [...new Set(nextDependents)].sort((left, right) =>
        left.localeCompare(right),
      );
      return accumulator;
    },
    {} as Record<StrategyReviewExportAuditReportSurfaceRegistryEntryName, readonly StrategyReviewExportAuditReportSurfaceRegistryEntryName[]>,
  );

  return {
    phaseChain: [45, 46, 47, 48, 49, 50, 51, 52],
    dependencies,
    dependents,
    blocksRecursiveDerivativeLayers: true,
  };
}

function buildMeta(entries: readonly StrategyReviewExportAuditReportSurfaceRegistryEntry[]): StrategyReviewExportAuditReportSurfaceRegistryMeta {
  const deterministicSeed = `phase52:surface-registry:${entries.map(entry => entry.entryId).join(',')}`;

  return {
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE,
    registryVersion: PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_VERSION,
    generatedAt: PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT,
    source: PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE,
    deterministicSeed,
    sourcePhases: [45, 46, 47, 48, 49, 50, 51, 52],
    fixtureOnly: true,
    localOnly: true,
    readOnly: true,
    liveData: false,
    networkAccess: false,
    persistence: false,
    runtimeRequests: false,
    uiRendering: false,
    domAccess: false,
    execution: false,
    tradingSignals: false,
    recommendations: false,
    investmentAdvice: false,
  };
}

export function buildStrategyReviewExportAuditReportSurfaceRegistryEntry(
  input: BuildStrategyReviewExportAuditReportSurfaceRegistryEntryInput,
): StrategyReviewExportAuditReportSurfaceRegistryEntry {
  const definition = ENTRY_DEFINITIONS[input.entryName];
  const seed = `phase52:entry:${input.entryName}:${definition.phase}:${definition.entryKind}`;

  return {
    entryId: entryId(seed),
    entryName: input.entryName,
    entryKind: definition.entryKind,
    phase: definition.phase,
    modulePath: definition.modulePath,
    docPath: definition.docPath,
    testPath: definition.testPath,
    surfaceRole: definition.surfaceRole,
    sourcePhase: definition.phase,
    sourceEntries: [...definition.sourceEntries],
    sourceEntryCount: definition.sourceEntryCount,
    isDerivativeLayer: definition.isDerivativeLayer,
    hasRealConsumer: definition.hasRealConsumer,
    shouldCreateFurtherDerivativeLayer: false,
    consumerGuidance: buildConsumerGuidance(),
    capabilitySummary: getStrategyReviewExportAuditReportSurfaceRegistryCapabilities(),
    safetySummary: buildSafetySummary(),
    validationSummary: buildValidationSummary(),
    nextMilestoneNotes: [
      'Phase 52 consolidates Phase 45–51 strategy-review export surfaces into one read-only registry catalog.',
      'Further selector/view-model/API-contract recursion is blocked unless a future phase proves a real consumer.',
      'Phase 53 is milestone guidance only and remains unimplemented in this phase.',
    ],
  };
}

export function buildStrategyReviewExportAuditReportSurfaceRegistry(
  input: BuildStrategyReviewExportAuditReportSurfaceRegistryInput = {},
): StrategyReviewExportAuditReportSurfaceRegistry {
  const entries =
    input.entries ??
    STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES.map(entryName =>
      buildStrategyReviewExportAuditReportSurfaceRegistryEntry({ entryName }),
    );

  const deterministicSeed = `phase52:registry:${entries.map(entry => entry.entryId).join(',')}`;

  return {
    registryId: registryId(deterministicSeed),
    registryName: 'strategy-review-export-audit-report-surface-registry',
    phase: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE,
    generatedAt: PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT,
    entries,
    relationships: buildRelationships(entries),
    capabilitySummary: getStrategyReviewExportAuditReportSurfaceRegistryCapabilities(),
    safetySummary: buildSafetySummary(),
    aggressiveSafePolicy: buildAggressiveSafePolicy(),
    nextMilestone: buildNextMilestone(),
    meta: buildMeta(entries),
  };
}
