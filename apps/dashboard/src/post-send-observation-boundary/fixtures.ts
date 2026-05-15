import { buildPostSendObservationBoundaryFixture } from './builders.js';
import {
  POST_SEND_OBSERVATION_BOUNDARY_KINDS,
  POST_SEND_OBSERVATION_BOUNDARY_NAMES,
  type PostSendObservationBoundaryFixture,
  type PostSendObservationBoundaryKind,
  type PostSendObservationBoundaryName,
} from './types.js';
import { validatePostSendObservationBoundaryFixtureTable } from './validation.js';

export const POST_SEND_OBSERVATION_BOUNDARY_FIXTURES = POST_SEND_OBSERVATION_BOUNDARY_NAMES.map(fixtureName =>
  buildPostSendObservationBoundaryFixture({ fixtureName }),
) satisfies readonly PostSendObservationBoundaryFixture[];

export const POST_SEND_OBSERVATION_BOUNDARY_FIXTURE_MAP: ReadonlyMap<string, PostSendObservationBoundaryFixture> = new Map(
  POST_SEND_OBSERVATION_BOUNDARY_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (POST_SEND_OBSERVATION_BOUNDARY_FIXTURES.length < 8) {
  throw new Error(
    `Phase 85 fixture count mismatch: expected >= 8, received ${POST_SEND_OBSERVATION_BOUNDARY_FIXTURES.length}`,
  );
}
if (POST_SEND_OBSERVATION_BOUNDARY_NAMES.length !== POST_SEND_OBSERVATION_BOUNDARY_KINDS.length) {
  throw new Error('Phase 85 name/kind cardinality mismatch');
}

const tableValidation = validatePostSendObservationBoundaryFixtureTable(POST_SEND_OBSERVATION_BOUNDARY_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 85 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listPostSendObservationBoundaryFixtures(): readonly PostSendObservationBoundaryFixture[] {
  return POST_SEND_OBSERVATION_BOUNDARY_FIXTURES;
}

export function getPostSendObservationBoundaryFixture(fixtureId: string): PostSendObservationBoundaryFixture | null {
  return POST_SEND_OBSERVATION_BOUNDARY_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { POST_SEND_OBSERVATION_BOUNDARY_NAMES, POST_SEND_OBSERVATION_BOUNDARY_KINDS };
export type { PostSendObservationBoundaryName, PostSendObservationBoundaryKind };
