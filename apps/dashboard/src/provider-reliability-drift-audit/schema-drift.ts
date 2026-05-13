import type { ProviderSchemaDrift } from './types.js';

export function buildProviderSchemaDrift(input: {
  fixtureId: string;
  providerId: string;
  expectedSchemaVersion: string;
  observedSchemaVersion: string;
  missingFields: readonly string[];
  extraFields: readonly string[];
  incompatibleFields: readonly string[];
  safeToUse: boolean;
}): ProviderSchemaDrift {
  return {
    schemaDriftId: `${input.fixtureId}-schema-drift`,
    providerId: input.providerId,
    expectedSchemaVersion: input.expectedSchemaVersion,
    observedSchemaVersion: input.observedSchemaVersion,
    missingFields: [...input.missingFields].sort((left, right) => left.localeCompare(right, 'en-US')),
    extraFields: [...input.extraFields].sort((left, right) => left.localeCompare(right, 'en-US')),
    incompatibleFields: [...input.incompatibleFields].sort((left, right) => left.localeCompare(right, 'en-US')),
    safeToUse: input.safeToUse,
  };
}
