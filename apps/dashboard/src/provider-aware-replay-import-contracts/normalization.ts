import {
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT,
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION,
  PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SOURCE,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES,
  type ProviderAwareReplayImportContractFixture,
  type ProviderAwareReplayImportContractKind,
  type ProviderAwareReplayImportContractName,
} from './types.js';

export function stableDeterministicProviderAwareReplayImportContractChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, 'en-US'))
      .reduce<Record<string, unknown>>((accumulator, [key, nestedValue]) => {
        accumulator[key] = sortKeysDeep(nestedValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidProviderAwareReplayImportContractName(value: unknown): value is ProviderAwareReplayImportContractName {
  return typeof value === 'string' && (PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES as readonly string[]).includes(value);
}

export function isValidProviderAwareReplayImportContractKind(value: unknown): value is ProviderAwareReplayImportContractKind {
  return typeof value === 'string' && (PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS as readonly string[]).includes(value);
}

export function isValidProviderAwareReplayImportContractGeneratedAt(
  value: unknown,
): value is typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT {
  return value === PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_GENERATED_AT;
}

export function isValidProviderAwareReplayImportContractSource(
  value: unknown,
): value is typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SOURCE {
  return value === PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SOURCE;
}

export function isValidProviderAwareReplayImportContractSchemaVersion(
  value: unknown,
): value is typeof PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION {
  return value === PHASE_73_PROVIDER_AWARE_REPLAY_IMPORT_CONTRACTS_SCHEMA_VERSION;
}

export function normalizeProviderAwareReplayImportContractFixture(
  fixture: ProviderAwareReplayImportContractFixture,
): ProviderAwareReplayImportContractFixture {
  return {
    ...fixture,
    manifest: {
      ...fixture.manifest,
      sourceCandidateIds: [...fixture.manifest.sourceCandidateIds].sort((a, b) => a.localeCompare(b, 'en-US')),
    },
    sourceMetadata: {
      ...fixture.sourceMetadata,
      sourcePhaseRefs: [...fixture.sourceMetadata.sourcePhaseRefs].sort((a, b) => a - b),
      sourceFixtureRefs: [...fixture.sourceMetadata.sourceFixtureRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
      sourceProviderIds: [...fixture.sourceMetadata.sourceProviderIds].sort((a, b) => a.localeCompare(b, 'en-US')),
      sourceScenarioRefs: [...fixture.sourceMetadata.sourceScenarioRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
      sourceSnapshotRefs: [...fixture.sourceMetadata.sourceSnapshotRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
      sourceReliabilityRefs: [...fixture.sourceMetadata.sourceReliabilityRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
    },
    compatibilityContract: {
      ...fixture.compatibilityContract,
      incompatibilityReasonCodes: [...fixture.compatibilityContract.incompatibilityReasonCodes].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
    },
    importPlan: {
      ...fixture.importPlan,
      candidateIds: [...fixture.importPlan.candidateIds].sort((a, b) => a.localeCompare(b, 'en-US')),
    },
    rejectionContract: {
      ...fixture.rejectionContract,
      safetyNotes: [...fixture.rejectionContract.safetyNotes].sort((a, b) => a.localeCompare(b, 'en-US')),
    },
    validationContract: {
      ...fixture.validationContract,
      rules: [...fixture.validationContract.rules].sort((a, b) => a.localeCompare(b, 'en-US')),
      rejectionReasons: [...fixture.validationContract.rejectionReasons].sort((a, b) => a.localeCompare(b, 'en-US')),
      criticalFailureReasons: [...fixture.validationContract.criticalFailureReasons].sort((a, b) => a.localeCompare(b, 'en-US')),
      warningReasons: [...fixture.validationContract.warningReasons].sort((a, b) => a.localeCompare(b, 'en-US')),
    },
    provenanceContract: {
      ...fixture.provenanceContract,
      sourceScenarioRefs: [...fixture.provenanceContract.sourceScenarioRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
      sourceSnapshotRefs: [...fixture.provenanceContract.sourceSnapshotRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
      sourceReliabilityRefs: [...fixture.provenanceContract.sourceReliabilityRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
      sourceQualityRefs: [...fixture.provenanceContract.sourceQualityRefs].sort((a, b) => a.localeCompare(b, 'en-US')),
    },
    qualityLinkage: {
      ...fixture.qualityLinkage,
      reasonCodes: [...fixture.qualityLinkage.reasonCodes].sort((a, b) => a.localeCompare(b, 'en-US')),
    },
    sourcePhase65FixtureSnapshot: [...fixture.sourcePhase65FixtureSnapshot],
    sourcePhase66FixtureSnapshot: [...fixture.sourcePhase66FixtureSnapshot],
    sourcePhase67FixtureSnapshot: [...fixture.sourcePhase67FixtureSnapshot],
    sourcePhase68FixtureSnapshot: [...fixture.sourcePhase68FixtureSnapshot],
    sourcePhase70FixtureSnapshot: [...fixture.sourcePhase70FixtureSnapshot],
    sourcePhase71FixtureSnapshot: [...fixture.sourcePhase71FixtureSnapshot],
    sourcePhase72FixtureSnapshot: [...fixture.sourcePhase72FixtureSnapshot],
  };
}

export function serializeProviderAwareReplayImportContractFixture(
  fixture: ProviderAwareReplayImportContractFixture,
): string {
  return stablePrettyJsonStringify(normalizeProviderAwareReplayImportContractFixture(fixture));
}

export function areProviderAwareReplayImportContractFixturesEqual(
  left: ProviderAwareReplayImportContractFixture,
  right: ProviderAwareReplayImportContractFixture,
): boolean {
  return (
    stableDeterministicProviderAwareReplayImportContractChecksum(serializeProviderAwareReplayImportContractFixture(left)) ===
    stableDeterministicProviderAwareReplayImportContractChecksum(serializeProviderAwareReplayImportContractFixture(right))
  );
}
