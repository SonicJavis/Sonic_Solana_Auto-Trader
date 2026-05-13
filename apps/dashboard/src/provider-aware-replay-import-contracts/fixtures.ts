import { buildProviderAwareReplayImportContractFixture } from './builders.js';
import {
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS,
  PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES,
  type ProviderAwareReplayImportContractFixture,
  type ProviderAwareReplayImportContractKind,
  type ProviderAwareReplayImportContractName,
} from './types.js';
import { validateProviderAwareReplayImportContractFixtureTable } from './validation.js';

export const PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES = PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES.map(fixtureName =>
  buildProviderAwareReplayImportContractFixture({ fixtureName }),
) satisfies readonly ProviderAwareReplayImportContractFixture[];

export const PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURE_MAP: ReadonlyMap<string, ProviderAwareReplayImportContractFixture> =
  new Map(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES.length < 8) {
  throw new Error(
    `Phase 71 fixture count mismatch: expected >= 8, received ${PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES.length}`,
  );
}
if (PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES.length !== PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS.length) {
  throw new Error('Phase 71 name/kind cardinality mismatch');
}

const tableValidation = validateProviderAwareReplayImportContractFixtureTable(PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 71 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listProviderAwareReplayImportContractFixtures(): readonly ProviderAwareReplayImportContractFixture[] {
  return PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURES;
}

export function getProviderAwareReplayImportContractFixture(
  fixtureId: string,
): ProviderAwareReplayImportContractFixture | null {
  return PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_NAMES, PROVIDER_AWARE_REPLAY_IMPORT_CONTRACT_KINDS };
export type { ProviderAwareReplayImportContractName, ProviderAwareReplayImportContractKind };
