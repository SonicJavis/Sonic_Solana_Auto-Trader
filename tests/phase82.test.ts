import { describe, expect, it } from 'vitest';
import {
  PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_GENERATED_AT,
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURE_MAP,
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES,
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_KINDS,
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES,
  TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_PHASE,
  areTransactionConstructionContractMockFixturesEqual,
  buildAccountMetaMock,
  buildComputeBudgetMock,
  buildFeeModelMock,
  buildMockInstructionPlan,
  buildSerializationDenial,
  buildSlippageGuardMock,
  buildTransactionBoundaryLinkage,
  buildTransactionConstructionApiContract,
  buildTransactionConstructionContractMockFixture,
  buildTransactionConstructionIntent,
  buildTransactionConstructionMockGate,
  buildTransactionDispatchDenial,
  buildTransactionSigningDenial,
  buildTransactionWalletDenial,
  getDashboardUiShellCapabilities,
  getTransactionConstructionContractMockCapabilities,
  getTransactionConstructionContractMockFixture,
  isValidTransactionConstructionContractMockGeneratedAt,
  isValidTransactionConstructionContractMockKind,
  isValidTransactionConstructionContractMockName,
  isValidTransactionConstructionContractMockSchemaVersion,
  isValidTransactionConstructionContractMockSource,
  listTransactionConstructionContractMockFixtures,
  normalizeTransactionConstructionContractMockFixture,
  selectTransactionConstructionContractMockFixture,
  serializeTransactionConstructionContractMockFixture,
  validateTransactionConstructionContractMockFixture,
  validateTransactionConstructionContractMockSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

describe('Phase 82 — Transaction Construction Contract Mocks v1', () => {
  it('has constants and fixture surfaces', () => {
    expect(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_PHASE).toBe(82);
    expect(PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_GENERATED_AT).toBe('2026-05-14T00:00:00.000Z');
    expect(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_NAMES).toHaveLength(8);
    expect(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_KINDS).toHaveLength(8);
    expect(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURE_MAP.size).toBe(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES.length);
  });

  it('supports list/get/select/normalize/serialize/equality', () => {
    const fixture = TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES[0]!;
    expect(listTransactionConstructionContractMockFixtures()).toBe(TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES);
    expect(getTransactionConstructionContractMockFixture(fixture.fixtureId)).toBe(fixture);
    expect(selectTransactionConstructionContractMockFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectTransactionConstructionContractMockFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeTransactionConstructionContractMockFixture(fixture);
    expect(serializeTransactionConstructionContractMockFixture(fixture)).toContain('"fixtureId"');
    expect(areTransactionConstructionContractMockFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('enforces safe fixture denials', () => {
    for (const fixture of TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES) {
      expect(validateTransactionConstructionContractMockFixture(fixture).valid).toBe(true);
      expect(validateTransactionConstructionContractMockSafety(fixture).safe).toBe(true);
      expect(fixture.boundaryGate.failClosed).toBe(true);
      expect(fixture.boundaryGate.unlockAuthority).toBe(false);
      expect(fixture.signingDenial.signingBlocked).toBe(true);
      expect(fixture.dispatchDenial.dispatchBlocked).toBe(true);
      expect(fixture.walletDenial.walletLogicAllowed).toBe(false);
    }
  });

  it('covers required blocked and denied scenarios', () => {
    expect(buildTransactionConstructionContractMockFixture({ fixtureName: 'mock-construction-contract-ready' }).boundaryGate.gateStatus).toBe('ready');
    expect(buildTransactionConstructionContractMockFixture({ fixtureName: 'missing-execution-boundary-blocked' }).dryRunLinkage.linkageStatus).toBe('blocked');
    expect(buildTransactionConstructionContractMockFixture({ fixtureName: 'real-transaction-object-rejected' }).readinessLinkage.linkageStatus).toBe('blocked');
    expect(buildTransactionConstructionContractMockFixture({ fixtureName: 'serialization-request-denied' }).constructionDenial.serializationBlocked).toBe(true);
    expect(buildTransactionConstructionContractMockFixture({ fixtureName: 'unsafe-capability-rejected' }).boundaryGate.gateStatus).toBe('rejected');
  });

  it('builder wrappers are mock-only', () => {
    expect(buildTransactionConstructionMockGate({ boundaryGateId: 'g', boundaryGateName: 'n', gateStatus: 'blocked', blockingReasonCodes: ['x'] }).failClosed).toBe(true);
    expect(buildTransactionConstructionIntent({ constructionIntentId: 'i', intentKind: 'mock_only', intentStatus: 'ready' }).mockOnly).toBe(true);
    expect(buildMockInstructionPlan({ instructionPlanId: 'p', planKind: 'shape', instructionCount: 2, planStatus: 'ready' }).programInvocationAllowed).toBe(false);
    expect(buildAccountMetaMock({ accountMetaMockId: 'a', accountLabel: 'label' }).signer).toBe(false);
    expect(buildComputeBudgetMock({ computeBudgetMockId: 'c', computeUnitLabel: 'cu', priorityFeeLabel: 'pf' }).dynamicFeeFetchAllowed).toBe(false);
    expect(buildFeeModelMock({ feeModelMockId: 'f', feeSource: 'fixture', feeEstimateStatus: 'modeled' }).liveFeeFetchAllowed).toBe(false);
    expect(buildSlippageGuardMock({ slippageGuardMockId: 's', slippageLabel: 'low' }).recommendationOutput).toBe(false);
    expect(buildSerializationDenial({ serializationDenialId: 'd' }).transactionBytesProduced).toBe(false);
    expect(buildTransactionSigningDenial({ signingDenialId: 'sd', reasonCodes: ['x'] }).walletPromptBlocked).toBe(true);
    expect(buildTransactionDispatchDenial({ dispatchDenialId: 'dd', reasonCodes: ['x'] }).sendBlocked).toBe(true);
    expect(buildTransactionWalletDenial({ walletDenialId: 'wd', reasonCodes: ['x'] }).keypairHandlingAllowed).toBe(false);
    expect(buildTransactionBoundaryLinkage({ boundaryLinkageId: 'b', sourceExecutionBoundaryRef: 'phase81-x', linkageStatus: 'linked' }).boundarySupportsExecution).toBe(false);
    expect(buildTransactionConstructionApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);
  });

  it('propagates transaction capability flags', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.transactionConstructionContractMocks).toBe(true);
    expect(dashboard.transactionRuntimeExecution).toBe(false);
    expect(api.transactionConstructionContractMocks).toBe(true);
    expect(api.transactionRuntimeExecution).toBe(false);
    expect(getTransactionConstructionContractMockCapabilities().transactionAutomaticPromotion).toBe(false);
  });

  it('validates normalizers and validators', () => {
    expect(isValidTransactionConstructionContractMockGeneratedAt(PHASE_82_TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_GENERATED_AT)).toBe(true);
    expect(isValidTransactionConstructionContractMockSchemaVersion('1.0.0')).toBe(true);
    expect(isValidTransactionConstructionContractMockSource('phase82_transaction_construction_contract_mocks_v1')).toBe(true);
    expect(isValidTransactionConstructionContractMockName('mock-construction-contract-ready')).toBe(true);
    expect(isValidTransactionConstructionContractMockKind('mock_construction_contract_ready')).toBe(true);
    const fixture = buildTransactionConstructionContractMockFixture({ fixtureName: 'mock-construction-contract-ready' });
    const unsafe = { ...fixture, boundaryGate: { ...fixture.boundaryGate, unlockAuthority: true as const } };
    const codes = new Set(validateTransactionConstructionContractMockFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('UNSAFE_UNLOCK_AUTHORITY')).toBe(true);
  });
});
