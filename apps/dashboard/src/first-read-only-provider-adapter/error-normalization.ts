import {
  FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES,
  type FirstReadOnlyProviderErrorCategory,
  type FirstReadOnlyProviderErrorNormalization,
} from './types.js';

export function buildFirstReadOnlyProviderErrorNormalization(input: {
  fixtureId: string;
  primaryCategory: FirstReadOnlyProviderErrorCategory;
}): FirstReadOnlyProviderErrorNormalization {
  return {
    normalizationId: `${input.fixtureId}-error-normalization`,
    categories: FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES,
    primaryCategory: input.primaryCategory,
  };
}
