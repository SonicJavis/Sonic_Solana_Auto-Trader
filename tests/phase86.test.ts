import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURE_MAP,
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES,
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS,
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES,
  EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE,
  PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT,
  areExecutionOutcomeAuditFixturesEqual,
  buildConfirmationOutcomePlaceholder,
  buildExecutionOutcomeAuditApiContract,
  buildExecutionOutcomeAuditFixture,
  buildExecutionOutcomeAuditReport,
  buildExecutionOutcomeAuditViewModel,
  buildFinalityOutcomePlaceholder,
  buildNetworkObservationDenial,
  buildOutcomeAbortContract,
  buildOutcomeAuditEvidenceBundle,
  buildOutcomeAuditGate,
  buildOutcomeBlocker,
  buildOutcomeCapabilityAudit,
  buildOutcomeConstructionLinkage,
  buildOutcomeEventPlaceholder,
  buildOutcomeExecutionBoundaryLinkage,
  buildOutcomeObservationBoundaryLinkage,
  buildOutcomeRollbackContract,
  buildOutcomeSafetyInvariants,
  buildOutcomeScorecard,
  buildOutcomeSendBoundaryLinkage,
  buildOutcomeSigningBoundaryLinkage,
  buildOutcomeStatusPlaceholder,
  buildTransactionResultDenial,
  getDashboardUiShellCapabilities,
  getExecutionOutcomeAuditCapabilities,
  getExecutionOutcomeAuditFixture,
  isValidExecutionOutcomeAuditContractKind,
  isValidExecutionOutcomeAuditContractName,
  isValidExecutionOutcomeAuditGeneratedAt,
  isValidExecutionOutcomeAuditSchemaVersion,
  isValidExecutionOutcomeAuditSource,
  listExecutionOutcomeAuditFixtures,
  normalizeExecutionOutcomeAuditFixture,
  selectExecutionOutcomeAuditFixture,
  serializeExecutionOutcomeAuditFixture,
  validateExecutionOutcomeAuditFixture,
  validateExecutionOutcomeAuditSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_86_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/execution-outcome-audit-contracts');

const PHASE_86_FILES = [
  'types.ts',
  'outcome-audit-gates.ts',
  'outcome-event-placeholders.ts',
  'outcome-status-placeholders.ts',
  'confirmation-outcome-placeholders.ts',
  'finality-outcome-placeholders.ts',
  'transaction-result-denials.ts',
  'network-observation-denials.ts',
  'audit-evidence-bundles.ts',
  'outcome-linkage.ts',
  'observation-boundary-linkage.ts',
  'send-boundary-linkage.ts',
  'signing-boundary-linkage.ts',
  'construction-linkage.ts',
  'execution-boundary-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'safety-invariants.ts',
  'blocker-taxonomy.ts',
  'capability-audits.ts',
  'outcome-scorecards.ts',
  'outcome-reports.ts',
  'reports.ts',
  'builders.ts',
  'fixtures.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

describe('Phase 86 — Execution Outcome Audit Contracts v1', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_86_FILES) {
      expect(() => readFileSync(resolve(PHASE_86_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() =>
      readFileSync(resolve(REPO_ROOT, 'docs/EXECUTION_OUTCOME_AUDIT_CONTRACTS.md'), 'utf8'),
    ).not.toThrow();
  });

  it('has constants and fixture surfaces', () => {
    expect(EXECUTION_OUTCOME_AUDIT_CONTRACTS_PHASE).toBe(86);
    expect(PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT).toBe('2026-05-16T00:00:00.000Z');
    expect(EXECUTION_OUTCOME_AUDIT_CONTRACTS_NAMES).toHaveLength(8);
    expect(EXECUTION_OUTCOME_AUDIT_CONTRACTS_KINDS).toHaveLength(8);
    expect(EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURE_MAP.size).toBe(
      EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES.length,
    );
  });

  it('supports list/get/select/normalize/serialize/equality', () => {
    const fixture = EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES[0]!;
    expect(listExecutionOutcomeAuditFixtures()).toBe(EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES);
    expect(getExecutionOutcomeAuditFixture(fixture.fixtureId)).toBe(fixture);
    expect(selectExecutionOutcomeAuditFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectExecutionOutcomeAuditFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeExecutionOutcomeAuditFixture(fixture);
    expect(serializeExecutionOutcomeAuditFixture(fixture)).toContain('"fixtureId"');
    expect(areExecutionOutcomeAuditFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('enforces fail-closed outcome audit denials', () => {
    for (const fixture of EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES) {
      expect(validateExecutionOutcomeAuditFixture(fixture).valid).toBe(true);
      expect(validateExecutionOutcomeAuditSafety(fixture).safe).toBe(true);
      expect(fixture.auditGate.unlockAuthority).toBe(false);
      expect(fixture.auditGate.liveOutcomeObservationAllowed).toBe(false);
      expect(fixture.auditGate.transactionLookupAllowed).toBe(false);
      expect(fixture.auditGate.confirmationLookupAllowed).toBe(false);
      expect(fixture.auditGate.networkReadAllowed).toBe(false);
      expect(fixture.outcomeEventPlaceholder.realOutcomeEventProduced).toBe(false);
      expect(fixture.outcomeEventPlaceholder.transactionSignatureRequired).toBe(false);
      expect(fixture.outcomeStatusPlaceholder.liveStatusFetched).toBe(false);
      expect(fixture.outcomeStatusPlaceholder.outcomeStatusProduced).toBe(false);
      expect(fixture.confirmationOutcomePlaceholder.liveConfirmationFetched).toBe(false);
      expect(fixture.finalityOutcomePlaceholder.liveFinalityFetched).toBe(false);
      expect(fixture.transactionResultDenial.transactionLookupBlocked).toBe(true);
      expect(fixture.transactionResultDenial.transactionResultProduced).toBe(false);
      expect(fixture.transactionResultDenial.transactionMetaProduced).toBe(false);
      expect(fixture.networkObservationDenial.networkReadBlocked).toBe(true);
      expect(fixture.networkObservationDenial.subscriptionBlocked).toBe(true);
      expect(fixture.networkObservationDenial.pollingBlocked).toBe(true);
    }
  });

  it('covers required fixture scenarios', () => {
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'outcome-audit-design-ready' }).auditGate
        .gateStatus,
    ).toBe('ready');
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'missing-observation-boundary-blocked' })
        .observationBoundaryLinkage.linkageStatus,
    ).toBe('blocked');
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'transaction-result-lookup-denied' })
        .transactionResultDenial.transactionLookupBlocked,
    ).toBe(true);
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'confirmation-outcome-denied' })
        .confirmationOutcomePlaceholder.liveConfirmationFetched,
    ).toBe(false);
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'finality-outcome-denied' })
        .finalityOutcomePlaceholder.liveFinalityFetched,
    ).toBe(false);
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'network-observation-denied' })
        .networkObservationDenial.networkReadBlocked,
    ).toBe(true);
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'audit-evidence-incomplete-blocked' })
        .evidenceBundle.evidenceComplete,
    ).toBe(false);
    expect(
      buildExecutionOutcomeAuditFixture({ fixtureName: 'unsafe-capability-rejected' }).auditGate
        .gateStatus,
    ).toBe('rejected');
  });

  it('builder wrappers work correctly', () => {
    expect(
      buildOutcomeAuditGate({
        outcomeAuditGateId: 'g',
        outcomeAuditGateName: 'n',
        gateStatus: 'blocked',
        blockingReasonCodes: ['x'],
      }).phase,
    ).toBe(86);
    expect(
      buildOutcomeEventPlaceholder({ outcomeEventPlaceholderId: 'e', reasonCodes: ['x'] })
        .realOutcomeEventProduced,
    ).toBe(false);
    expect(
      buildOutcomeStatusPlaceholder({ outcomeStatusPlaceholderId: 's', reasonCodes: ['x'] })
        .outcomeStatusProduced,
    ).toBe(false);
    expect(
      buildConfirmationOutcomePlaceholder({
        confirmationOutcomePlaceholderId: 'c',
        reasonCodes: ['x'],
      }).liveConfirmationFetched,
    ).toBe(false);
    expect(
      buildFinalityOutcomePlaceholder({ finalityOutcomePlaceholderId: 'f', reasonCodes: ['x'] })
        .liveFinalityFetched,
    ).toBe(false);
    expect(
      buildTransactionResultDenial({ transactionResultDenialId: 't', reasonCodes: ['x'] })
        .transactionLookupBlocked,
    ).toBe(true);
    expect(
      buildNetworkObservationDenial({ networkObservationDenialId: 'n', reasonCodes: ['x'] })
        .subscriptionBlocked,
    ).toBe(true);
    expect(
      buildOutcomeAuditEvidenceBundle({
        evidenceBundleId: 'eb',
        sourcePhaseRefs: ['phase85'],
        sourceFixtureRefs: ['phase85-x'],
        validationCommandRefs: ['pnpm test'],
        safetyGrepRefs: ['rg privateKey'],
        docsRefs: ['docs/X.md'],
        evidenceComplete: true,
      }).evidenceComplete,
    ).toBe(true);
    expect(
      buildOutcomeObservationBoundaryLinkage({
        observationBoundaryLinkageId: 'ol',
        sourceObservationBoundaryRef: 'phase85-x',
        linkageStatus: 'linked',
      }).linkageStatus,
    ).toBe('linked');
    expect(
      buildOutcomeSendBoundaryLinkage({
        sendBoundaryLinkageId: 'sl',
        sourceSendBoundaryRef: 'phase84-x',
        linkageStatus: 'linked',
      }).linkageStatus,
    ).toBe('linked');
    expect(
      buildOutcomeSigningBoundaryLinkage({
        signingBoundaryLinkageId: 'sg',
        sourceSigningBoundaryRef: 'phase83-x',
        linkageStatus: 'warning',
      }).linkageStatus,
    ).toBe('warning');
    expect(
      buildOutcomeConstructionLinkage({
        constructionLinkageId: 'cl',
        sourceTransactionConstructionMockRef: 'phase82-x',
        linkageStatus: 'blocked',
      }).linkageStatus,
    ).toBe('blocked');
    expect(
      buildOutcomeExecutionBoundaryLinkage({
        executionBoundaryLinkageId: 'el',
        sourceExecutionBoundaryRef: 'phase81-x',
        linkageStatus: 'linked',
      }).linkageStatus,
    ).toBe('linked');
    expect(
      buildOutcomeAbortContract({ abortContractId: 'ab', status: 'ready' }).abortModeled,
    ).toBe(true);
    expect(
      buildOutcomeRollbackContract({ rollbackContractId: 'rb', status: 'ready' }).rollbackModeled,
    ).toBe(true);
    expect(
      buildOutcomeSafetyInvariants({ safetyInvariantId: 'si' }).fullAutoLocked,
    ).toBe(true);
    expect(
      buildOutcomeBlocker({
        blockerId: 'bl',
        blockerCode: 'x',
        severity: 'high',
        blocking: true,
        reason: 'r',
      }).blocking,
    ).toBe(true);
    expect(
      buildOutcomeCapabilityAudit({ capabilityAuditId: 'ca' }).liveOutcomeObservationCapabilityPresent,
    ).toBe(false);
    expect(
      buildOutcomeScorecard({
        scorecardId: 'sc',
        auditScore: 80,
        classification: 'warning',
        reviewRequired: true,
      }).auditScore,
    ).toBe(80);
    expect(
      buildExecutionOutcomeAuditReport({
        reportId: 'r',
        gateSummary: 'g',
        eventSummary: 'ev',
        statusSummary: 'st',
        confirmationFinalitySummary: 'cf',
        transactionResultSummary: 'tr',
        networkObservationSummary: 'no',
        linkageSummary: 'l',
        evidenceSummary: 'es',
        safetySummary: 'safe',
      }).reportId,
    ).toBe('r');
    expect(
      buildExecutionOutcomeAuditViewModel({
        viewModelId: 'v',
        fixtureId: 'f',
        fixtureName: 'outcome-audit-design-ready',
        gateStatus: 'ready',
      }).summary,
    ).toContain('outcome-audit-design-ready');
    expect(
      buildExecutionOutcomeAuditApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data
        .totalCount,
    ).toBe(1);
    expect(
      isValidExecutionOutcomeAuditGeneratedAt(PHASE_86_EXECUTION_OUTCOME_AUDIT_CONTRACTS_GENERATED_AT),
    ).toBe(true);
    expect(isValidExecutionOutcomeAuditSchemaVersion('1.0.0')).toBe(true);
    expect(
      isValidExecutionOutcomeAuditSource('phase86_execution_outcome_audit_contracts_v1'),
    ).toBe(true);
    expect(isValidExecutionOutcomeAuditContractName('outcome-audit-design-ready')).toBe(true);
    expect(isValidExecutionOutcomeAuditContractKind('outcome_audit_design_ready')).toBe(true);
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildExecutionOutcomeAuditFixture({ fixtureName: 'outcome-audit-design-ready' });
    const unsafe = {
      ...fixture,
      auditGate: { ...fixture.auditGate, liveOutcomeObservationAllowed: true as const },
      capabilities: { ...fixture.capabilities, outcomeAutomaticPromotion: true as const },
      report: { ...fixture.report, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(
      validateExecutionOutcomeAuditFixture(unsafe as never).issues.map(issue => issue.code),
    );
    expect(codes.has('LIVE_OUTCOME_OBSERVATION_FORBIDDEN')).toBe(true);
    expect(codes.has('AUTO_PROMOTION_FORBIDDEN')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('rejects when transactionLookupBlocked is false', () => {
    const fixture = buildExecutionOutcomeAuditFixture({ fixtureName: 'outcome-audit-design-ready' });
    const unsafe = {
      ...fixture,
      transactionResultDenial: {
        ...fixture.transactionResultDenial,
        transactionLookupBlocked: false as const,
      },
    };
    const result = validateExecutionOutcomeAuditFixture(unsafe as never);
    expect(result.valid).toBe(false);
    const codes = new Set(result.issues.map(issue => issue.code));
    expect(codes.has('TRANSACTION_LOOKUP_BLOCK_REQUIRED')).toBe(true);
  });

  it('rejects when networkReadBlocked is false', () => {
    const fixture = buildExecutionOutcomeAuditFixture({ fixtureName: 'outcome-audit-design-ready' });
    const unsafe = {
      ...fixture,
      networkObservationDenial: {
        ...fixture.networkObservationDenial,
        networkReadBlocked: false as const,
      },
    };
    const result = validateExecutionOutcomeAuditFixture(unsafe as never);
    expect(result.valid).toBe(false);
    const codes = new Set(result.issues.map(issue => issue.code));
    expect(codes.has('NETWORK_READ_BLOCK_REQUIRED')).toBe(true);
  });

  it('rejects wrong phase', () => {
    const fixture = buildExecutionOutcomeAuditFixture({ fixtureName: 'outcome-audit-design-ready' });
    const wrongPhase = { ...fixture, phase: 85 as never };
    const result = validateExecutionOutcomeAuditFixture(wrongPhase as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'WRONG_PHASE')).toBe(true);
  });

  it('propagates capability flags to dashboard/read-only-api', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.executionOutcomeAuditContracts).toBe(true);
    expect(dashboard.outcomeRuntimeObservation).toBe(false);
    expect(dashboard.outcomeLiveTransactionLookup).toBe(false);
    expect(api.executionOutcomeAuditContracts).toBe(true);
    expect(api.outcomeRuntimeObservation).toBe(false);
    expect(getExecutionOutcomeAuditCapabilities().outcomeAutomaticPromotion).toBe(false);
  });

  it('is deterministic and source snapshots are immutable', () => {
    const a = buildExecutionOutcomeAuditFixture({ fixtureName: 'outcome-audit-design-ready' });
    const b = buildExecutionOutcomeAuditFixture({ fixtureName: 'outcome-audit-design-ready' });
    expect(areExecutionOutcomeAuditFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase85FixtureSnapshot)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase84FixtureSnapshot)).toBe(true);
    for (const file of PHASE_86_FILES) {
      const source = readFileSync(resolve(PHASE_86_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });

  it('source immutability — source snapshots cannot be mutated', () => {
    const fixture = EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES[0]!;
    expect(Object.isFrozen(fixture.sourcePhase85FixtureSnapshot)).toBe(true);
    expect(Object.isFrozen(fixture.sourcePhase83FixtureSnapshot)).toBe(true);
  });

  it('no unsafe runtime calls in source files', () => {
    for (const file of PHASE_86_FILES) {
      const source = readFileSync(resolve(PHASE_86_SRC, file), 'utf8');
      // Check for actual runtime calls/usage, not capability flag names
      expect(source).not.toMatch(/\bsignTransaction\s*\(/);
      expect(source).not.toMatch(/\bsendTransaction\s*\(/);
      expect(source).not.toMatch(/\bsendRawTransaction\s*\(/);
      expect(source).not.toMatch(/\bgetTransaction\s*\(/);
      expect(source).not.toMatch(/\bgetSignatureStatuses\s*\(/);
      expect(source).not.toMatch(/\bconfirmTransaction\s*\(/);
      expect(source).not.toMatch(/Date\.now\(\)/);
      expect(source).not.toMatch(/Math\.random\(\)/);
      expect(source).not.toMatch(/\bfetch\s*\(/);
      expect(source).not.toMatch(/\bsetInterval\s*\(/);
      expect(source).not.toMatch(/\bsetTimeout\s*\(/);
    }
  });
});
