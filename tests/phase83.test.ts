import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURE_MAP,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES,
  SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE,
  areSigningBoundarySafetyFixturesEqual,
  buildKeyMaterialDenial,
  buildSignatureOutputDenial,
  buildSignerIdentityPlaceholder,
  buildSigningAbortContract,
  buildSigningApprovalBoundary,
  buildSigningBoundaryApiContract,
  buildSigningBoundaryBlocker,
  buildSigningBoundaryGate,
  buildSigningBoundaryReport,
  buildSigningBoundarySafetyFixture,
  buildSigningBoundaryViewModel,
  buildSigningCapabilityAudit,
  buildSigningConstructionLinkage,
  buildSigningDryRunLinkage,
  buildSigningExecutionBoundaryLinkage,
  buildSigningOperatorAcknowledgement,
  buildSigningRequestDenial,
  buildSigningRollbackContract,
  buildSigningSafetyInvariants,
  buildSigningScorecard,
  buildWalletPromptDenial,
  getDashboardUiShellCapabilities,
  getSigningBoundarySafetyCapabilities,
  getSigningBoundarySafetyFixture,
  isValidSigningBoundarySafetyGeneratedAt,
  isValidSigningBoundarySafetyKind,
  isValidSigningBoundarySafetyName,
  isValidSigningBoundarySafetySchemaVersion,
  isValidSigningBoundarySafetySource,
  listSigningBoundarySafetyFixtures,
  normalizeSigningBoundarySafetyFixture,
  selectSigningBoundarySafetyFixture,
  serializeSigningBoundarySafetyFixture,
  validateSigningBoundarySafety,
  validateSigningBoundarySafetyFixture,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_83_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/signing-boundary-safety-contracts');

const PHASE_83_FILES = [
  'types.ts',
  'signing-boundary-gates.ts',
  'signing-request-denials.ts',
  'wallet-prompt-denials.ts',
  'key-material-denials.ts',
  'signature-output-denials.ts',
  'signer-identity-placeholders.ts',
  'approval-boundaries.ts',
  'operator-acknowledgements.ts',
  'construction-linkage.ts',
  'execution-boundary-linkage.ts',
  'dry-run-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'safety-invariants.ts',
  'blocker-taxonomy.ts',
  'capability-audits.ts',
  'signing-scorecards.ts',
  'signing-reports.ts',
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

describe('Phase 83 — Signing Boundary Safety Design Contracts v1', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_83_FILES) {
      expect(() => readFileSync(resolve(PHASE_83_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/SIGNING_BOUNDARY_SAFETY_CONTRACTS.md'), 'utf8')).not.toThrow();
  });

  it('has constants and fixture surfaces', () => {
    expect(SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE).toBe(83);
    expect(PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT).toBe('2026-05-14T00:00:00.000Z');
    expect(SIGNING_BOUNDARY_SAFETY_CONTRACTS_NAMES).toHaveLength(8);
    expect(SIGNING_BOUNDARY_SAFETY_CONTRACTS_KINDS).toHaveLength(8);
    expect(SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURE_MAP.size).toBe(SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES.length);
  });

  it('supports list/get/select/normalize/serialize/equality', () => {
    const fixture = SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES[0]!;
    expect(listSigningBoundarySafetyFixtures()).toBe(SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES);
    expect(getSigningBoundarySafetyFixture(fixture.fixtureId)).toBe(fixture);
    expect(selectSigningBoundarySafetyFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectSigningBoundarySafetyFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeSigningBoundarySafetyFixture(fixture);
    expect(serializeSigningBoundarySafetyFixture(fixture)).toContain('"fixtureId"');
    expect(areSigningBoundarySafetyFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('enforces fail-closed signing boundary denials', () => {
    for (const fixture of SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES) {
      expect(validateSigningBoundarySafetyFixture(fixture).valid).toBe(true);
      expect(validateSigningBoundarySafety(fixture).safe).toBe(true);
      expect(fixture.boundaryGate.failClosed).toBe(true);
      expect(fixture.boundaryGate.unlockAuthority).toBe(false);
      expect(fixture.boundaryGate.signingAllowed).toBe(false);
      expect(fixture.boundaryGate.walletPromptAllowed).toBe(false);
      expect(fixture.boundaryGate.signatureOutputAllowed).toBe(false);
      expect(fixture.signingRequestDenial.signingRequestBlocked).toBe(true);
      expect(fixture.walletPromptDenial.walletPromptBlocked).toBe(true);
      expect(fixture.keyMaterialDenial.privateKeyAccessAllowed).toBe(false);
      expect(fixture.signatureOutputDenial.signatureBytesProduced).toBe(false);
      expect(fixture.approvalBoundary.approvalAuthorizesSigning).toBe(false);
      expect(fixture.abortContract.runtimeSideEffectsAllowed).toBe(false);
      expect(fixture.rollbackContract.runtimeSideEffectsAllowed).toBe(false);
      expect(fixture.safety.noSigning).toBe(true);
      expect(fixture.safety.noSignatureOutput).toBe(true);
      expect(fixture.safety.noDispatchOrExecution).toBe(true);
    }
  });

  it('covers required fixture scenarios', () => {
    expect(buildSigningBoundarySafetyFixture({ fixtureName: 'signing-boundary-design-ready' }).boundaryGate.gateStatus).toBe('ready');
    expect(
      buildSigningBoundarySafetyFixture({ fixtureName: 'missing-transaction-construction-mock-blocked' }).constructionLinkage
        .linkageStatus,
    ).toBe('blocked');
    expect(
      buildSigningBoundarySafetyFixture({ fixtureName: 'signing-request-denied' }).signingRequestDenial.signTransactionBlocked,
    ).toBe(true);
    expect(buildSigningBoundarySafetyFixture({ fixtureName: 'wallet-prompt-denied' }).walletPromptDenial.walletPromptBlocked).toBe(
      true,
    );
    expect(
      buildSigningBoundarySafetyFixture({ fixtureName: 'key-material-request-denied' }).keyMaterialDenial.secretStorageAllowed,
    ).toBe(false);
    expect(
      buildSigningBoundarySafetyFixture({ fixtureName: 'signature-output-denied' }).signatureOutputDenial.signedMessageProduced,
    ).toBe(false);
    expect(
      buildSigningBoundarySafetyFixture({ fixtureName: 'approval-does-not-authorize-signing' }).approvalBoundary.approvalStatus,
    ).toBe('recorded');
    expect(buildSigningBoundarySafetyFixture({ fixtureName: 'unsafe-capability-rejected' }).boundaryGate.gateStatus).toBe('rejected');
  });

  it('builder helpers and validators work', () => {
    expect(buildSigningBoundaryGate({ signingBoundaryGateId: 'g', signingBoundaryGateName: 'n', gateStatus: 'blocked', blockingReasonCodes: ['x'] }).phase).toBe(83);
    expect(buildSigningRequestDenial({ signingRequestDenialId: 's', reasonCodes: ['x'] }).signAllTransactionsBlocked).toBe(true);
    expect(buildWalletPromptDenial({ walletPromptDenialId: 'w', reasonCodes: ['x'] }).walletAdapterAllowed).toBe(false);
    expect(buildKeyMaterialDenial({ keyMaterialDenialId: 'k', reasonCodes: ['x'] }).mnemonicAccessAllowed).toBe(false);
    expect(buildSignatureOutputDenial({ signatureOutputDenialId: 'o', reasonCodes: ['x'] }).signedTransactionProduced).toBe(false);
    expect(buildSignerIdentityPlaceholder({ signerIdentityPlaceholderId: 'i', signerLabel: 'p' }).placeholderOnly).toBe(true);
    expect(buildSigningApprovalBoundary({ approvalBoundaryId: 'a', approvalStatus: 'required' }).separateSigningPhaseRequired).toBe(true);
    expect(buildSigningOperatorAcknowledgement({ operatorAcknowledgementId: 'oa', acknowledgementRecorded: true }).acknowledgementAuthorizesSigning).toBe(false);
    expect(buildSigningConstructionLinkage({ constructionLinkageId: 'c', sourceTransactionConstructionMockRef: 'x', linkageStatus: 'linked' }).linkageStatus).toBe('linked');
    expect(buildSigningExecutionBoundaryLinkage({ executionBoundaryLinkageId: 'e', sourceExecutionBoundaryRef: 'x', linkageStatus: 'warning' }).linkageStatus).toBe('warning');
    expect(buildSigningDryRunLinkage({ dryRunLinkageId: 'd', sourceDryRunControlRef: 'x', linkageStatus: 'blocked' }).linkageStatus).toBe('blocked');
    expect(buildSigningAbortContract({ abortContractId: 'ab', status: 'ready' }).abortModeled).toBe(true);
    expect(buildSigningRollbackContract({ rollbackContractId: 'rb', status: 'ready' }).rollbackModeled).toBe(true);
    expect(buildSigningSafetyInvariants({ safetyInvariantId: 'si' }).fullAutoLocked).toBe(true);
    expect(buildSigningBoundaryBlocker({ blockerId: 'b', blockerCode: 'x', severity: 'high', blocking: true, reason: 'r' }).blocking).toBe(true);
    expect(buildSigningCapabilityAudit({ capabilityAuditId: 'ca' }).signingCapabilityPresent).toBe(false);
    expect(buildSigningScorecard({ scorecardId: 'sc', boundaryScore: 80, classification: 'warning', reviewRequired: true }).boundaryScore).toBe(80);
    expect(buildSigningBoundaryReport({ reportId: 'r', gateSummary: 'g', signingRequestSummary: 's', walletPromptSummary: 'w', keyMaterialSummary: 'k', signatureOutputSummary: 'o', signerIdentitySummary: 'i', approvalSummary: 'a', abortRollbackSummary: 'ar', evidenceSummary: 'e', safetySummary: 'safe' }).reportId).toBe('r');
    expect(buildSigningBoundaryViewModel({ viewModelId: 'v', fixtureId: 'f', fixtureName: 'signing-boundary-design-ready', gateStatus: 'ready', approvalStatus: 'required' }).summary).toContain('signing-boundary-design-ready');
    expect(buildSigningBoundaryApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);

    expect(isValidSigningBoundarySafetyGeneratedAt(PHASE_83_SIGNING_BOUNDARY_SAFETY_CONTRACTS_GENERATED_AT)).toBe(true);
    expect(isValidSigningBoundarySafetySchemaVersion('1.0.0')).toBe(true);
    expect(isValidSigningBoundarySafetySource('phase83_signing_boundary_safety_design_contracts_v1')).toBe(true);
    expect(isValidSigningBoundarySafetyName('signing-boundary-design-ready')).toBe(true);
    expect(isValidSigningBoundarySafetyKind('signing_boundary_design_ready')).toBe(true);
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildSigningBoundarySafetyFixture({ fixtureName: 'signing-boundary-design-ready' });
    const unsafe = {
      ...fixture,
      boundaryGate: { ...fixture.boundaryGate, signingAllowed: true as const },
      approvalBoundary: { ...fixture.approvalBoundary, approvalAuthorizesSigning: true as const },
      report: { ...fixture.report, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validateSigningBoundarySafetyFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('SIGNING_ALLOWED_FORBIDDEN')).toBe(true);
    expect(codes.has('APPROVAL_AUTHORIZES_SIGNING_FORBIDDEN')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('propagates capability flags to dashboard/read-only-api', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.signingBoundarySafetyContracts).toBe(true);
    expect(dashboard.signingRuntimeSigning).toBe(false);
    expect(api.signingBoundarySafetyContracts).toBe(true);
    expect(api.signingRuntimeSigning).toBe(false);
    expect(getSigningBoundarySafetyCapabilities().signingAutomaticPromotion).toBe(false);
  });

  it('is deterministic and source snapshots are immutable', () => {
    const a = buildSigningBoundarySafetyFixture({ fixtureName: 'signing-boundary-design-ready' });
    const b = buildSigningBoundarySafetyFixture({ fixtureName: 'signing-boundary-design-ready' });
    expect(areSigningBoundarySafetyFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase82FixtureSnapshot)).toBe(true);
    for (const file of PHASE_83_FILES) {
      const source = readFileSync(resolve(PHASE_83_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });

  it('documents clean-runner blocker evidence and Phase 84 preview-only guidance', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/SIGNING_BOUNDARY_SAFETY_CONTRACTS.md'), 'utf8');
    expect(doc).toContain('better-sqlite3');
    expect(doc).toContain('Could not locate the bindings file');
    expect(doc).toContain('Phase 84');
    expect(doc.toLowerCase()).toContain('preview only');
  });
});
