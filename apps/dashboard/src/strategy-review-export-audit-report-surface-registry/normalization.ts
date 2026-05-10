/**
 * Phase 52 — Strategy Review Export Audit Report Surface Registry v1: normalization.
 */

import {
  PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT,
  PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES,
  type StrategyReviewExportAuditReportSurfaceRegistry,
  type StrategyReviewExportAuditReportSurfaceRegistryEntryKind,
  type StrategyReviewExportAuditReportSurfaceRegistryEntryName,
  type StrategyReviewExportAuditReportSurfaceRegistryRelationships,
} from './types.js';

export function stableDeterministicStrategyReviewExportAuditReportSurfaceRegistryChecksum(
  content: string,
): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((accumulator, [key, nextValue]) => {
        accumulator[key] = sortKeysDeep(nextValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidStrategyReviewExportAuditReportSurfaceRegistryEntryName(
  value: unknown,
): value is StrategyReviewExportAuditReportSurfaceRegistryEntryName {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportSurfaceRegistryEntryKind(
  value: unknown,
): value is StrategyReviewExportAuditReportSurfaceRegistryEntryKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportSurfaceRegistryGeneratedAt(value: unknown): boolean {
  return value === PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT;
}

export function isValidStrategyReviewExportAuditReportSurfaceRegistrySource(value: unknown): boolean {
  return value === PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE;
}

export function normalizeStrategyReviewExportAuditReportSurfaceRegistry(
  registry: StrategyReviewExportAuditReportSurfaceRegistry,
): StrategyReviewExportAuditReportSurfaceRegistry {
  const normalizedEntries = [...registry.entries]
    .map(entry => ({
      ...entry,
      sourceEntries: [...entry.sourceEntries].sort((left, right) => left.localeCompare(right)),
      nextMilestoneNotes: [...entry.nextMilestoneNotes],
      consumerGuidance: {
        ...entry.consumerGuidance,
        notes: [...entry.consumerGuidance.notes],
      },
    }))
    .sort((left, right) => left.entryName.localeCompare(right.entryName));

  const sortedDependencyEntries = [...Object.entries(registry.relationships.dependencies)].sort(
    ([left], [right]) => left.localeCompare(right),
  );
  const sortedDependentEntries = [...Object.entries(registry.relationships.dependents)].sort(
    ([left], [right]) => left.localeCompare(right),
  );

  const dependencies = sortedDependencyEntries.reduce<Record<string, readonly string[]>>(
    (accumulator, [entryName, sourceEntries]) => {
      accumulator[entryName] = [...sourceEntries].sort((left, right) => left.localeCompare(right));
      return accumulator;
    },
    {},
  );

  const dependents = sortedDependentEntries.reduce<Record<string, readonly string[]>>(
    (accumulator, [entryName, sourceEntries]) => {
      accumulator[entryName] = [...sourceEntries].sort((left, right) => left.localeCompare(right));
      return accumulator;
    },
    {},
  );

  return {
    ...registry,
    entries: normalizedEntries,
    relationships: {
      ...registry.relationships,
      dependencies:
        dependencies as StrategyReviewExportAuditReportSurfaceRegistryRelationships['dependencies'],
      dependents:
        dependents as StrategyReviewExportAuditReportSurfaceRegistryRelationships['dependents'],
    },
    aggressiveSafePolicy: {
      ...registry.aggressiveSafePolicy,
      notes: [...registry.aggressiveSafePolicy.notes],
    },
    meta: {
      ...registry.meta,
      sourcePhases: [...registry.meta.sourcePhases] as typeof registry.meta.sourcePhases,
    },
  };
}

export function serializeStrategyReviewExportAuditReportSurfaceRegistry(
  registry: StrategyReviewExportAuditReportSurfaceRegistry,
): string {
  return stablePrettyJsonStringify(normalizeStrategyReviewExportAuditReportSurfaceRegistry(registry));
}

export function areStrategyReviewExportAuditReportSurfaceRegistriesEqual(
  left: StrategyReviewExportAuditReportSurfaceRegistry,
  right: StrategyReviewExportAuditReportSurfaceRegistry,
): boolean {
  return (
    serializeStrategyReviewExportAuditReportSurfaceRegistry(left) ===
    serializeStrategyReviewExportAuditReportSurfaceRegistry(right)
  );
}
