import type {
  BuildReadOnlySolanaErrorNormalizationRuleInput,
  ReadOnlySolanaErrorNormalizationRule,
} from './types.js';

export function buildReadOnlySolanaErrorNormalizationRule(
  input: BuildReadOnlySolanaErrorNormalizationRuleInput,
): ReadOnlySolanaErrorNormalizationRule {
  return {
    ruleId: `${input.fixtureId}-error-${input.category}`,
    category: input.category,
    sourceErrorCode: input.sourceErrorCode,
    normalizedErrorCode: input.normalizedErrorCode,
    normalizedCategory: input.normalizedCategory,
    safetyNote: input.safetyNote,
  };
}

