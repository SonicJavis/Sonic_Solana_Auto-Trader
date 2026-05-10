/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: validation.
 */

import {
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_EVENT_KINDS,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES,
  type SyntheticEventStreamEnvelope,
  type SyntheticEventStreamLifecycleSafetyResult,
  type SyntheticEventStreamLifecycleValidationIssue,
  type SyntheticEventStreamLifecycleValidationResult,
} from './types.js';
import {
  isValidSyntheticEventStreamLifecycleGeneratedAt,
  isValidSyntheticEventStreamLifecycleSchemaVersion,
  isValidSyntheticEventStreamLifecycleSource,
  isValidSyntheticEventStreamLifecycleStreamKind,
  isValidSyntheticEventStreamLifecycleStreamName,
} from './normalization.js';
import { reduceSyntheticEventStreamLifecycle } from './reducers.js';

const FORBIDDEN_URL_PATTERN = /https?:\/\/[\w.-]+/i;
const FORBIDDEN_NETWORK_PATTERN = /(?:fetch\(|axios|WebSocket|RPC)/i;
const FORBIDDEN_FILESYSTEM_PATTERN =
  /(?:fs\.|writeFile|createWriteStream|localStorage|indexedDB)/i;
const FORBIDDEN_RUNTIME_PATTERN = /(?:route|handler|server|listen\()/i;
const FORBIDDEN_WALLET_PATTERN =
  /(?:privateKey|secretKey|seedPhrase|mnemonic|Keypair|wallet)(?![\s_-]*cluster)/i;
const FORBIDDEN_EXECUTION_PATTERN =
  /(?:signTransaction|sendTransaction|execute|buy|sell|trade|order|recommendation|signal)|investment\s+advice/i;

const EXCLUDED_SCAN_FIELDS = new Set([
  'fixtureId',
  'fixtureName',
  'fixtureKind',
  'streamId',
  'streamName',
  'streamKind',
  'eventId',
  'eventKind',
  'source',
  'generatedAt',
  'sourceSyntheticLaunchFixtureName',
  'sourceProviderAdapterMockName',
  'stateId',
  'contractId',
  'contractName',
  'selectorId',
  'selectedFixtureId',
  'selectedStreamKind',
  'viewModelId',
]);

const PAYLOAD_REQUIRED_KEYS: Readonly<Record<string, readonly string[]>> = {
  launch_detected: ['observation'],
  mint_state_observed: ['mintLabel'],
  metadata_state_observed: ['metadataCompletenessLabel'],
  pool_created: ['poolLabel'],
  initial_liquidity_added: ['liquidityUsd'],
  liquidity_changed: ['liquidityUsd'],
  early_volume_burst_observed: ['burstLabel'],
  holder_distribution_snapshot_captured: ['topHolderConcentrationPct'],
  creator_activity_observed: ['creatorRiskLabel'],
  wallet_cluster_pattern_observed: ['clusterLabel'],
  bundle_like_pattern_observed: ['bundleLabel'],
  risk_review_requested: ['reviewContext'],
  risk_review_completed: ['reviewOutcome'],
  lifecycle_snapshot_derived: ['snapshotLabel'],
  safety_rejection_recorded: ['rejectionLabel'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): SyntheticEventStreamLifecycleValidationIssue {
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
  issues: SyntheticEventStreamLifecycleValidationIssue[],
): void {
  if (!isRecord(flags)) {
    issues.push(issue('INVALID_CAPABILITIES', 'capabilityFlags', 'capabilityFlags must be object'));
    return;
  }

  const requiredTrue = [
    'syntheticEventStreamLifecycle',
    'syntheticEventStreamLifecycleFixtures',
    'deterministicSyntheticEventStreamLifecycle',
    'localOnlySyntheticEventStreamLifecycle',
    'readOnlySyntheticEventStreamLifecycle',
    'fixtureDerivedSyntheticEventStreamLifecycle',
    'appendOnlySyntheticEventStreams',
    'syntheticEventStreamReducers',
    'syntheticEventStreamViewModels',
    'syntheticEventStreamApiContracts',
    'syntheticEventStreamSelectors',
  ] as const;

  const requiredFalse = [
    'syntheticEventStreamLiveData',
    'syntheticEventStreamNetworkAccess',
    'syntheticEventStreamRealProviders',
    'syntheticEventStreamProviderAdapters',
    'syntheticEventStreamSolanaRpc',
    'syntheticEventStreamWebSocketAccess',
    'syntheticEventStreamGeyserYellowstone',
    'syntheticEventStreamPumpFunIntegration',
    'syntheticEventStreamDexIntegration',
    'syntheticEventStreamJitoIntegration',
    'syntheticEventStreamPersistence',
    'syntheticEventStreamFilesystemWrites',
    'syntheticEventStreamDownloads',
    'syntheticEventStreamRouteHandlers',
    'syntheticEventStreamHttpServer',
    'syntheticEventStreamRuntimeRequests',
    'syntheticEventStreamUiRendering',
    'syntheticEventStreamDomAccess',
    'syntheticEventStreamBackgroundJobs',
    'syntheticEventStreamScheduledJobs',
    'syntheticEventStreamWalletLogic',
    'syntheticEventStreamPrivateKeyHandling',
    'syntheticEventStreamSigning',
    'syntheticEventStreamTransactionSending',
    'syntheticEventStreamExecution',
    'syntheticEventStreamTradingSignals',
    'syntheticEventStreamRecommendations',
    'syntheticEventStreamInvestmentAdvice',
    'syntheticEventStreamReplayHarness',
    'syntheticEventStreamPaperSimulation',
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

function validateEventPayload(
  event: SyntheticEventStreamEnvelope,
  index: number,
  issues: SyntheticEventStreamLifecycleValidationIssue[],
): void {
  const required = PAYLOAD_REQUIRED_KEYS[event.eventKind];
  if (!required) {
    issues.push(issue('INVALID_EVENT_KIND', `events[${index}].eventKind`, 'eventKind is invalid'));
    return;
  }

  for (const requiredKey of required) {
    if (!(requiredKey in event.payload)) {
      issues.push(
        issue(
          'INVALID_EVENT_PAYLOAD',
          `events[${index}].payload.${requiredKey}`,
          `payload missing required key ${requiredKey}`,
        ),
      );
    }
  }
}

function validateEventModel(
  events: readonly SyntheticEventStreamEnvelope[],
  issues: SyntheticEventStreamLifecycleValidationIssue[],
): void {
  if (events.length < 8) {
    issues.push(issue('INVALID_EVENT_COUNT', 'events', 'events must contain at least 8 entries'));
  }

  const eventIds = events.map(event => event.eventId);
  if (new Set(eventIds).size !== eventIds.length) {
    issues.push(issue('DUPLICATE_EVENT_ID', 'events', 'event IDs must be unique within stream'));
  }

  const sequenceValues = events.map(event => event.sequence);
  const hasDuplicateSequence = new Set(sequenceValues).size !== sequenceValues.length;
  if (hasDuplicateSequence) {
    issues.push(issue('DUPLICATE_EVENT_SEQUENCE', 'events.sequence', 'event sequence values must be unique'));
  }

  const sortedSequence = [...sequenceValues].sort((left, right) => left - right);
  const monotonic = sequenceValues.every((value, index) => value === sortedSequence[index]);
  if (!monotonic) {
    issues.push(issue('OUT_OF_ORDER_EVENT', 'events.sequence', 'event sequence must be monotonic'));
  }

  const idSet = new Set(eventIds);

  events.forEach((event, index) => {
    if (!SYNTHETIC_EVENT_STREAM_LIFECYCLE_EVENT_KINDS.includes(event.eventKind)) {
      issues.push(issue('INVALID_EVENT_KIND', `events[${index}].eventKind`, 'event kind is invalid'));
    }

    if (event.schemaVersion !== PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION) {
      issues.push(
        issue(
          'INVALID_EVENT_SCHEMA_VERSION',
          `events[${index}].schemaVersion`,
          'event schemaVersion must match phase schema version',
        ),
      );
    }

    if (!event.syntheticTimestamp.endsWith('Z')) {
      issues.push(
        issue(
          'INVALID_EVENT_TIMESTAMP',
          `events[${index}].syntheticTimestamp`,
          'syntheticTimestamp must be deterministic ISO UTC string',
        ),
      );
    }

    const previousEventIds = new Set(eventIds.slice(0, index));
    event.causalParentEventIds.forEach(parentEventId => {
      if (!idSet.has(parentEventId)) {
        issues.push(
          issue(
            'MISSING_CAUSAL_PARENT',
            `events[${index}].causalParentEventIds`,
            `causal parent ${parentEventId} does not exist`,
          ),
        );
      } else if (!previousEventIds.has(parentEventId)) {
        issues.push(
          issue(
            'INVALID_CAUSAL_PARENT_ORDER',
            `events[${index}].causalParentEventIds`,
            `causal parent ${parentEventId} must reference earlier event`,
          ),
        );
      }
    });

    event.derivedFromEventIds.forEach(referenceEventId => {
      if (!idSet.has(referenceEventId)) {
        issues.push(
          issue(
            'INVALID_DERIVED_FROM',
            `events[${index}].derivedFromEventIds`,
            `derived reference ${referenceEventId} does not exist`,
          ),
        );
      }
    });

    validateEventPayload(event, index, issues);
  });
}

export function validateSyntheticEventStreamLifecycleSafety(
  input: unknown,
): SyntheticEventStreamLifecycleSafetyResult {
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
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

export function validateSyntheticEventStreamLifecycleFixture(
  input: unknown,
): SyntheticEventStreamLifecycleValidationResult {
  const issues: SyntheticEventStreamLifecycleValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('NOT_OBJECT', 'root', 'Input must be a non-null object')],
    };
  }

  if (input['phase'] !== SYNTHETIC_EVENT_STREAM_LIFECYCLE_PHASE) {
    issues.push(issue('INVALID_PHASE', 'phase', 'phase must be 56'));
  }

  if (!isValidSyntheticEventStreamLifecycleStreamName(input['fixtureName'])) {
    issues.push(issue('INVALID_FIXTURE_NAME', 'fixtureName', 'fixtureName is invalid'));
  }

  if (!isValidSyntheticEventStreamLifecycleStreamKind(input['fixtureKind'])) {
    issues.push(issue('INVALID_FIXTURE_KIND', 'fixtureKind', 'fixtureKind is invalid'));
  }

  if (!isValidSyntheticEventStreamLifecycleSchemaVersion(input['schemaVersion'])) {
    issues.push(issue('INVALID_SCHEMA_VERSION', 'schemaVersion', 'schemaVersion must be deterministic constant'));
  }

  if (!isRecord(input['streamIdentity'])) {
    issues.push(issue('INVALID_STREAM_IDENTITY', 'streamIdentity', 'streamIdentity must be object'));
  } else {
    const streamIdentity = input['streamIdentity'];
    if (!isValidSyntheticEventStreamLifecycleStreamName(streamIdentity['streamName'])) {
      issues.push(issue('INVALID_STREAM_NAME', 'streamIdentity.streamName', 'streamName is invalid'));
    }
    if (!isValidSyntheticEventStreamLifecycleStreamKind(streamIdentity['streamKind'])) {
      issues.push(issue('INVALID_STREAM_KIND', 'streamIdentity.streamKind', 'streamKind is invalid'));
    }
    if (!isValidSyntheticEventStreamLifecycleSchemaVersion(streamIdentity['schemaVersion'])) {
      issues.push(
        issue(
          'INVALID_STREAM_SCHEMA_VERSION',
          'streamIdentity.schemaVersion',
          'streamIdentity.schemaVersion must be stable',
        ),
      );
    }
    if (!isValidSyntheticEventStreamLifecycleGeneratedAt(streamIdentity['generatedAt'])) {
      issues.push(
        issue(
          'INVALID_STREAM_GENERATED_AT',
          'streamIdentity.generatedAt',
          'streamIdentity.generatedAt must be deterministic constant',
        ),
      );
    }
    if (
      typeof streamIdentity['deterministicSeed'] !== 'string' ||
      streamIdentity['deterministicSeed'].trim() === ''
    ) {
      issues.push(
        issue(
          'INVALID_STREAM_DETERMINISTIC_SEED',
          'streamIdentity.deterministicSeed',
          'streamIdentity.deterministicSeed must be non-empty',
        ),
      );
    }
  }

  if (!SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_NAMES.includes(input['fixtureName'] as never)) {
    issues.push(issue('INVALID_FIXTURE_NAME_SET', 'fixtureName', 'fixtureName must be from stable set'));
  }

  if (!SYNTHETIC_EVENT_STREAM_LIFECYCLE_STREAM_KINDS.includes(input['fixtureKind'] as never)) {
    issues.push(issue('INVALID_FIXTURE_KIND_SET', 'fixtureKind', 'fixtureKind must be from stable set'));
  }

  if (!Array.isArray(input['events'])) {
    issues.push(issue('INVALID_EVENTS', 'events', 'events must be array'));
  } else {
    validateEventModel(input['events'] as readonly SyntheticEventStreamEnvelope[], issues);
  }

  if (!isRecord(input['derivedLifecycleState'])) {
    issues.push(issue('INVALID_DERIVED_STATE', 'derivedLifecycleState', 'derivedLifecycleState must be object'));
  } else if (Array.isArray(input['events'])) {
    const reduced = reduceSyntheticEventStreamLifecycle(
      input['events'] as readonly SyntheticEventStreamEnvelope[],
      isRecord(input['streamIdentity'])
        ? (input['streamIdentity'] as never)
        : undefined,
    );
    const derived = input['derivedLifecycleState'];
    if (derived['streamId'] !== reduced.streamId) {
      issues.push(issue('INVALID_DERIVED_STREAM_ID', 'derivedLifecycleState.streamId', 'derived streamId must match stream identity'));
    }
    if (derived['lastEventSequence'] !== reduced.lastEventSequence) {
      issues.push(
        issue(
          'INVALID_DERIVED_LAST_SEQUENCE',
          'derivedLifecycleState.lastEventSequence',
          'derived lastEventSequence must match reduced stream output',
        ),
      );
    }
    if (!Array.isArray(derived['eventReferences']) || derived['eventReferences'].length === 0) {
      issues.push(issue('INVALID_DERIVED_EVENT_REFERENCES', 'derivedLifecycleState.eventReferences', 'derived eventReferences must contain source event IDs'));
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
    if (!isValidSyntheticEventStreamLifecycleGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt must be deterministic constant'));
    }
    if (!isValidSyntheticEventStreamLifecycleSource(meta['source'])) {
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

  const safetyCheck = validateSyntheticEventStreamLifecycleSafety(input);
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
