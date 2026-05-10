/**
 * Phase 57 — Synthetic Event Stream Replay Harness v1: validation.
 */

import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
  type SyntheticEventStreamLifecycleStreamName,
} from '../synthetic-event-stream-lifecycle/types.js';
import {
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS,
  SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES,
  SYNTHETIC_EVENT_STREAM_REPLAY_MISMATCH_KINDS,
  type SyntheticEventStreamReplayHarnessSafetyResult,
  type SyntheticEventStreamReplayHarnessScenarioName,
  type SyntheticEventStreamReplayHarnessValidationIssue,
  type SyntheticEventStreamReplayHarnessValidationResult,
} from './types.js';
import {
  isValidSyntheticEventStreamReplayHarnessGeneratedAt,
  isValidSyntheticEventStreamReplayHarnessScenarioKind,
  isValidSyntheticEventStreamReplayHarnessScenarioName,
  isValidSyntheticEventStreamReplayHarnessSchemaVersion,
  isValidSyntheticEventStreamReplayHarnessSource,
} from './normalization.js';

const FORBIDDEN_URL_PATTERN = /\bhttps?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /\b(?:fetch\(|axios|WebSocket|RPC)\b/i;
const FORBIDDEN_FILESYSTEM_PATTERN =
  /\b(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)\b/i;
const FORBIDDEN_RUNTIME_PATTERN = /\b(?:route|handler|server|listen\()\b/i;
const FORBIDDEN_WALLET_PATTERN =
  /\b(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)(?![\s_-]*cluster)\b/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|execute|buy|sell|trade|order|recommendation)\b|\btrading\s+signals?\b|\binvestment\s+advice\b/i;
const FORBIDDEN_PROVIDER_REFERENCE_PATTERN =
  /\b(?:pump\.fun|jupiter|raydium|orca|meteora|geyser|yellowstone|solana\s*rpc)\b/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'sourceLifecycleFixtureName',
  'replayId',
  'replayName',
  'replayKind',
  'sourceEventId',
  'sourceEventKind',
  'snapshotId',
  'reportId',
  'contractId',
  'contractName',
  'selectorId',
  'selectedFixtureId',
  'selectedFixtureKind',
  'viewModelId',
  'generatedAt',
  'source',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): SyntheticEventStreamReplayHarnessValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, out: string[] = [], parentKey?: string): readonly string[] {
  if (typeof value === 'string') {
    if (parentKey === undefined || !EXCLUDED_SCAN_FIELDS.has(parentKey)) {
      out.push(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, out, parentKey));
  } else if (isRecord(value)) {
    Object.entries(value).forEach(([key, entry]) => collectStrings(entry, out, key));
  }
  return out;
}

function validateCapabilityFlags(
  flags: unknown,
  issues: SyntheticEventStreamReplayHarnessValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITIES', 'capabilityFlags', 'capabilityFlags must be object'));
    return;
  }

  const requiredTrue = [
    'syntheticEventStreamReplayHarness',
    'syntheticEventStreamReplayHarnessFixtures',
    'deterministicSyntheticEventStreamReplayHarness',
    'localOnlySyntheticEventStreamReplayHarness',
    'readOnlySyntheticEventStreamReplayHarness',
    'fixtureDerivedSyntheticEventStreamReplayHarness',
    'syntheticEventStreamReplayClock',
    'syntheticEventStreamReplaySteps',
    'syntheticEventStreamReplaySnapshots',
    'syntheticEventStreamReplayReports',
    'syntheticEventStreamReplayViewModels',
    'syntheticEventStreamReplayApiContracts',
    'syntheticEventStreamReplaySelectors',
  ] as const;

  const requiredFalse = [
    'syntheticEventStreamReplayLiveData',
    'syntheticEventStreamReplayNetworkAccess',
    'syntheticEventStreamReplayRealProviders',
    'syntheticEventStreamReplayProviderAdapters',
    'syntheticEventStreamReplaySolanaRpc',
    'syntheticEventStreamReplayWebSocketAccess',
    'syntheticEventStreamReplayGeyserYellowstone',
    'syntheticEventStreamReplayPumpFunIntegration',
    'syntheticEventStreamReplayDexIntegration',
    'syntheticEventStreamReplayJitoIntegration',
    'syntheticEventStreamReplayPersistence',
    'syntheticEventStreamReplayFilesystemWrites',
    'syntheticEventStreamReplayDownloads',
    'syntheticEventStreamReplayRouteHandlers',
    'syntheticEventStreamReplayHttpServer',
    'syntheticEventStreamReplayRuntimeRequests',
    'syntheticEventStreamReplayUiRendering',
    'syntheticEventStreamReplayDomAccess',
    'syntheticEventStreamReplayBackgroundJobs',
    'syntheticEventStreamReplayScheduledJobs',
    'syntheticEventStreamReplayWalletLogic',
    'syntheticEventStreamReplayPrivateKeyHandling',
    'syntheticEventStreamReplaySigning',
    'syntheticEventStreamReplayTransactionSending',
    'syntheticEventStreamReplayExecution',
    'syntheticEventStreamReplayTradingSignals',
    'syntheticEventStreamReplayRecommendations',
    'syntheticEventStreamReplayInvestmentAdvice',
    'syntheticEventStreamReplayPaperSimulation',
    'syntheticEventStreamReplayLiveExecution',
  ] as const;

  for (const key of requiredTrue) {
    if (flags[key] !== true) {
      issues.push(issue('CAPABILITY_TRUE_REQUIRED', `capabilityFlags.${key}`, `${key} must be true`));
    }
  }

  for (const key of requiredFalse) {
    if (flags[key] !== false) {
      issues.push(issue('CAPABILITY_FALSE_REQUIRED', `capabilityFlags.${key}`, `${key} must be false`));
    }
  }
}

export function validateSyntheticEventStreamReplayHarnessSafety(
  input: unknown,
): SyntheticEventStreamReplayHarnessSafetyResult {
  const strings = collectStrings(input);
  const violations: string[] = [];

  for (const value of strings) {
    if (FORBIDDEN_URL_PATTERN.test(value)) {
      violations.push(`Detected live URL reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_NETWORK_PATTERN.test(value)) {
      violations.push(`Detected network runtime reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_FILESYSTEM_PATTERN.test(value)) {
      violations.push(`Detected filesystem reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_RUNTIME_PATTERN.test(value)) {
      violations.push(`Detected route/runtime reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_WALLET_PATTERN.test(value)) {
      violations.push(`Detected wallet reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_EXECUTION_PATTERN.test(value)) {
      violations.push(`Detected execution/advisory reference: "${value.slice(0, 80)}"`);
    }
    if (FORBIDDEN_PROVIDER_REFERENCE_PATTERN.test(value)) {
      violations.push(`Detected provider integration reference: "${value.slice(0, 80)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateSyntheticEventStreamReplayHarnessFixture(
  input: unknown,
): SyntheticEventStreamReplayHarnessValidationResult {
  const issues: SyntheticEventStreamReplayHarnessValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (input['phase'] !== SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 57'));
  }

  if (!isValidSyntheticEventStreamReplayHarnessScenarioName(input['fixtureName'])) {
    issues.push(issue('INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid'));
  }

  if (!isValidSyntheticEventStreamReplayHarnessScenarioKind(input['fixtureKind'])) {
    issues.push(issue('INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid'));
  }

  if (!isValidSyntheticEventStreamReplayHarnessSchemaVersion(input['schemaVersion'])) {
    issues.push(issue('INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion must be deterministic constant'));
  }

  if (!SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_NAMES.includes(input['fixtureName'] as never)) {
    issues.push(issue('INVALID_FIXTURE_NAME_SET', 'fixtureName', 'fixtureName must be from stable set'));
  }

  if (!SYNTHETIC_EVENT_STREAM_REPLAY_HARNESS_SCENARIO_KINDS.includes(input['fixtureKind'] as never)) {
    issues.push(issue('INVALID_FIXTURE_KIND_SET', 'fixtureKind', 'fixtureKind must be from stable set'));
  }

  if (!SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES.includes(input['sourceLifecycleFixtureName'] as never)) {
    issues.push(
      issue(
        'INVALID_SOURCE_LIFECYCLE_FIXTURE',
        'sourceLifecycleFixtureName',
        'sourceLifecycleFixtureName must reference a Phase 56 lifecycle fixture',
      ),
    );
  }

  if (!isRecord(input['replayIdentity'])) {
    issues.push(issue('INVALID_REPLAY_IDENTITY', 'replayIdentity', 'replayIdentity must be object'));
  } else {
    const identity = input['replayIdentity'];
    if (!isValidSyntheticEventStreamReplayHarnessScenarioName(identity['replayName'])) {
      issues.push(issue('INVALID_REPLAY_NAME', 'replayIdentity.replayName', 'replayName is invalid'));
    }
    if (!isValidSyntheticEventStreamReplayHarnessScenarioKind(identity['replayKind'])) {
      issues.push(issue('INVALID_REPLAY_KIND', 'replayIdentity.replayKind', 'replayKind is invalid'));
    }
    if (!isValidSyntheticEventStreamReplayHarnessSchemaVersion(identity['schemaVersion'])) {
      issues.push(
        issue(
          'INVALID_REPLAY_SCHEMA_VERSION',
          'replayIdentity.schemaVersion',
          'replayIdentity.schemaVersion must be stable',
        ),
      );
    }
    if (!isValidSyntheticEventStreamReplayHarnessGeneratedAt(identity['generatedAt'])) {
      issues.push(
        issue(
          'INVALID_REPLAY_GENERATED_AT',
          'replayIdentity.generatedAt',
          'replayIdentity.generatedAt must be deterministic constant',
        ),
      );
    }
    if (
      typeof identity['deterministicSeed'] !== 'string' ||
      identity['deterministicSeed'].trim() === ''
    ) {
      issues.push(
        issue(
          'INVALID_REPLAY_DETERMINISTIC_SEED',
          'replayIdentity.deterministicSeed',
          'replayIdentity.deterministicSeed must be non-empty',
        ),
      );
    }
  }

  if (!isRecord(input['replayClock'])) {
    issues.push(issue('INVALID_REPLAY_CLOCK', 'replayClock', 'replayClock must be object'));
  } else {
    const clock = input['replayClock'];
    if (clock['deterministic'] !== true) {
      issues.push(issue('INVALID_REPLAY_CLOCK_DETERMINISM', 'replayClock.deterministic', 'replayClock.deterministic must be true'));
    }
    if (!isValidSyntheticEventStreamReplayHarnessSchemaVersion(clock['schemaVersion'])) {
      issues.push(issue('INVALID_REPLAY_CLOCK_SCHEMA', 'replayClock.schemaVersion', 'replayClock.schemaVersion must be stable'));
    }
  }

  if (!Array.isArray(input['replaySteps']) || input['replaySteps'].length === 0) {
    issues.push(issue('INVALID_REPLAY_STEPS', 'replaySteps', 'replaySteps must contain entries'));
  } else {
    const steps = input['replaySteps'] as readonly Record<string, unknown>[];
    const sequences = steps.map(step => Number(step['stepSequence']));
    const sorted = [...sequences].sort((left, right) => left - right);
    if (new Set(sequences).size !== sequences.length) {
      issues.push(issue('DUPLICATE_STEP_SEQUENCE', 'replaySteps.stepSequence', 'stepSequence values must be unique'));
    }
    if (sequences.some((value, index) => value !== sorted[index])) {
      issues.push(issue('OUT_OF_ORDER_STEP', 'replaySteps.stepSequence', 'replay steps must be monotonic'));
    }

    steps.forEach((step, index) => {
      if (!Array.isArray(step['mismatches'])) {
        issues.push(issue('INVALID_STEP_MISMATCHES', `replaySteps[${index}].mismatches`, 'mismatches must be an array'));
        return;
      }
      for (const mismatch of step['mismatches'] as readonly Record<string, unknown>[]) {
        if (!SYNTHETIC_EVENT_STREAM_REPLAY_MISMATCH_KINDS.includes(mismatch['kind'] as never)) {
          issues.push(issue('INVALID_MISMATCH_KIND', `replaySteps[${index}].mismatches.kind`, 'mismatch kind is invalid'));
        }
      }
    });
  }

  if (!Array.isArray(input['expectedSnapshots']) || input['expectedSnapshots'].length === 0) {
    issues.push(issue('INVALID_EXPECTED_SNAPSHOTS', 'expectedSnapshots', 'expectedSnapshots must contain entries'));
  } else {
    const snapshots = input['expectedSnapshots'] as readonly Record<string, unknown>[];
    const sequences = snapshots.map(snapshot => Number(snapshot['snapshotSequence']));
    const sorted = [...sequences].sort((left, right) => left - right);
    if (sequences.some((value, index) => value !== sorted[index])) {
      issues.push(
        issue(
          'OUT_OF_ORDER_SNAPSHOT',
          'expectedSnapshots.snapshotSequence',
          'expected snapshot sequence must be monotonic',
        ),
      );
    }

    snapshots.forEach((snapshot, index) => {
      if (!isValidSyntheticEventStreamReplayHarnessSchemaVersion(snapshot['schemaVersion'])) {
        issues.push(issue('INVALID_SNAPSHOT_SCHEMA', `expectedSnapshots[${index}].schemaVersion`, 'snapshot schemaVersion must match phase schema version'));
      }
      if (typeof snapshot['lifecycleStateChecksum'] !== 'string' || snapshot['lifecycleStateChecksum'].trim() === '') {
        issues.push(issue('INVALID_SNAPSHOT_CHECKSUM', `expectedSnapshots[${index}].lifecycleStateChecksum`, 'snapshot checksum must be non-empty'));
      }
    });
  }

  if (!isRecord(input['actualReport'])) {
    issues.push(issue('INVALID_REPLAY_REPORT', 'actualReport', 'actualReport must be object'));
  } else {
    const report = input['actualReport'];
    const totalSteps = Number(report['totalSteps']);
    const passedSteps = Number(report['passedSteps']);
    const failedSteps = Number(report['failedSteps']);
    if (!Number.isFinite(totalSteps) || !Number.isFinite(passedSteps) || !Number.isFinite(failedSteps)) {
      issues.push(issue('INVALID_REPORT_TOTALS', 'actualReport', 'report totals must be numeric'));
    } else if (passedSteps + failedSteps !== totalSteps) {
      issues.push(issue('INVALID_REPORT_TOTALS', 'actualReport', 'passedSteps + failedSteps must equal totalSteps'));
    }
  }

  if (!isRecord(input['viewModel'])) {
    issues.push(issue('INVALID_VIEW_MODEL', 'viewModel', 'viewModel must be object'));
  }

  if (!isRecord(input['apiContracts'])) {
    issues.push(issue('INVALID_API_CONTRACTS', 'apiContracts', 'apiContracts must be object'));
  }

  if (!Array.isArray(input['selectorExamples']) || input['selectorExamples'].length === 0) {
    issues.push(issue('INVALID_SELECTOR_EXAMPLES', 'selectorExamples', 'selectorExamples must contain entries'));
  }

  validateCapabilityFlags(input['capabilityFlags'], issues);

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be object'));
  } else {
    const meta = input['meta'];
    if (!isValidSyntheticEventStreamReplayHarnessGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant'));
    }
    if (!isValidSyntheticEventStreamReplayHarnessSource(meta['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source must be deterministic constant'));
    }
  }

  if (!isRecord(input['safety'])) {
    issues.push(issue('INVALID_SAFETY', 'safety', 'safety must be object'));
  } else {
    const safety = input['safety'];
    if (safety['nonAdvisory'] !== true || safety['notASignal'] !== true) {
      issues.push(issue('INVALID_SAFETY_NON_ADVISORY', 'safety', 'safety must enforce non-advisory non-signal posture'));
    }
  }

  const safetyCheck = validateSyntheticEventStreamReplayHarnessSafety(input);
  if (!safetyCheck.safe) {
    issues.push(
      issue(
        'UNSAFE_FIXTURE_CONTENT',
        'root',
        `fixture contains unsafe content (${safetyCheck.violations.length} violation(s))`,
      ),
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function isValidSyntheticEventStreamReplayHarnessSourceLifecycleFixtureName(
  value: unknown,
): value is SyntheticEventStreamLifecycleStreamName {
  return (
    typeof value === 'string' &&
    (SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES as readonly string[]).includes(value)
  );
}

export function validateSyntheticEventStreamReplayHarnessFixtureTable(
  fixtureIds: readonly string[],
  fixtureNames: readonly SyntheticEventStreamReplayHarnessScenarioName[],
): SyntheticEventStreamReplayHarnessValidationResult {
  const issues: SyntheticEventStreamReplayHarnessValidationIssue[] = [];
  if (new Set(fixtureIds).size !== fixtureIds.length) {
    issues.push(issue('DUPLICATE_FIXTURE_ID', 'fixtures', 'fixture IDs must be unique'));
  }
  if (new Set(fixtureNames).size !== fixtureNames.length) {
    issues.push(issue('DUPLICATE_FIXTURE_NAME', 'fixtures', 'fixture names must be unique'));
  }
  return {
    valid: issues.length === 0,
    issues,
  };
}
