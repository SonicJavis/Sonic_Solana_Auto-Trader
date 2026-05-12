import type {
  BuildReadOnlySolanaFieldMappingRuleInput,
  ReadOnlySolanaFieldMappingRule,
} from './types.js';

export function buildReadOnlySolanaFieldMappingRule(
  input: BuildReadOnlySolanaFieldMappingRuleInput,
): ReadOnlySolanaFieldMappingRule {
  return {
    mappingId: `${input.fixtureId}-mapping-${input.mappingKind}`,
    mappingKind: input.mappingKind,
    sourceMockField: input.sourceMockField,
    futureRealField: input.futureRealField,
    normalizedField: input.normalizedField,
    required: input.required,
    nullable: input.nullable,
    coverageStatus: input.coverageStatus,
    semanticCaveat: input.semanticCaveat,
    sourceContractName: input.sourceContractName,
  };
}

