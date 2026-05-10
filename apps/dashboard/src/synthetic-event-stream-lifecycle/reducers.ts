/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: reducers.
 */

import {
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
  PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
  type SyntheticEventStreamEnvelope,
  type SyntheticEventStreamIdentity,
  type SyntheticEventStreamLifecycleDerivedState,
  type SyntheticEventStreamLifecycleEventKind,
} from './types.js';

function defaultDerivedState(streamId: string): SyntheticEventStreamLifecycleDerivedState {
  return {
    stateId: `phase56-state-${streamId}`,
    streamId,
    lastEventSequence: 0,
    lifecycleStatus: 'observed',
    tokenState: {
      mintObserved: false,
      mintLabel: 'mint-not-observed',
      tokenStateSummary: 'Token mint state not yet observed.',
    },
    metadataState: {
      metadataObserved: false,
      metadataCompletenessLabel: 'incomplete',
      metadataStateSummary: 'Metadata state not yet observed.',
    },
    liquidityState: {
      poolObserved: false,
      liquidityLabel: 'thin',
      latestLiquidityUsd: 0,
      liquidityStateSummary: 'Liquidity state not yet observed.',
    },
    holderState: {
      holderSnapshotObserved: false,
      concentrationLabel: 'high',
      topHolderConcentrationPct: 100,
      holderStateSummary: 'Holder distribution snapshot not yet observed.',
    },
    creatorState: {
      creatorActivityObserved: false,
      creatorRiskLabel: 'medium',
      creatorStateSummary: 'Creator activity not yet observed.',
    },
    walletClusterState: {
      walletClusterObserved: false,
      bundleLikeObserved: false,
      clusterLabel: 'none',
      walletClusterStateSummary: 'No wallet cluster pattern observed.',
    },
    anomalyState: {
      earlyVolumeObserved: false,
      anomalyLabel: 'none',
      anomalyStateSummary: 'No anomaly observed.',
    },
    riskReviewState: {
      reviewRequested: false,
      reviewCompleted: false,
      reviewOutcome: 'pending',
      riskReviewSummary: 'Risk review not yet requested.',
    },
    safetyState: {
      status: 'requires_review',
      nonAdvisory: true,
      notASignal: true,
      safetySummary: 'Fixture-only lifecycle context; not a signal.',
    },
    eventReferences: [],
    meta: {
      generatedAt: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_GENERATED_AT,
      source: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SOURCE,
      schemaVersion: PHASE_56_SYNTHETIC_EVENT_STREAM_LIFECYCLE_SCHEMA_VERSION,
      deterministic: true,
    },
  };
}

function numberPayload(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function stringPayload(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function applyEvent(
  state: SyntheticEventStreamLifecycleDerivedState,
  event: SyntheticEventStreamEnvelope,
): SyntheticEventStreamLifecycleDerivedState {
  const nextEventReferences = [...state.eventReferences, event.eventId];

  const base: SyntheticEventStreamLifecycleDerivedState = {
    ...state,
    lastEventSequence: Math.max(state.lastEventSequence, event.sequence),
    eventReferences: nextEventReferences,
  };

  const kind: SyntheticEventStreamLifecycleEventKind = event.eventKind;

  if (kind === 'launch_detected') {
    return {
      ...base,
      lifecycleStatus: 'observed',
    };
  }

  if (kind === 'mint_state_observed') {
    return {
      ...base,
      tokenState: {
        mintObserved: true,
        mintLabel: stringPayload(event.payload['mintLabel'], 'mint-observed'),
        tokenStateSummary: 'Mint state observed from synthetic event stream.',
      },
    };
  }

  if (kind === 'metadata_state_observed') {
    const completeness = stringPayload(event.payload['metadataCompletenessLabel'], 'partial');
    return {
      ...base,
      metadataState: {
        metadataObserved: true,
        metadataCompletenessLabel:
          completeness === 'complete' || completeness === 'incomplete' ? completeness : 'partial',
        metadataStateSummary: 'Metadata state observed from synthetic event stream.',
      },
    };
  }

  if (kind === 'pool_created') {
    return {
      ...base,
      liquidityState: {
        ...base.liquidityState,
        poolObserved: true,
        liquidityStateSummary: 'Pool observed from synthetic event stream.',
      },
    };
  }

  if (kind === 'initial_liquidity_added' || kind === 'liquidity_changed') {
    const liquidityUsd = numberPayload(event.payload['liquidityUsd']);
    const liquidityLabel =
      liquidityUsd < 30_000 ? 'thin' : liquidityUsd < 100_000 ? 'moderate' : 'balanced';

    return {
      ...base,
      liquidityState: {
        ...base.liquidityState,
        poolObserved: true,
        liquidityLabel,
        latestLiquidityUsd: liquidityUsd,
        liquidityStateSummary: 'Liquidity state derived from synthetic event stream.',
      },
    };
  }

  if (kind === 'early_volume_burst_observed') {
    const burstLabel = stringPayload(event.payload['burstLabel'], 'moderate');
    return {
      ...base,
      anomalyState: {
        earlyVolumeObserved: true,
        anomalyLabel: burstLabel === 'high' ? 'high' : burstLabel === 'none' ? 'none' : 'moderate',
        anomalyStateSummary: 'Early volume burst observed; fixture-only and non-actionable.',
      },
    };
  }

  if (kind === 'holder_distribution_snapshot_captured') {
    const concentration = numberPayload(event.payload['topHolderConcentrationPct']);
    return {
      ...base,
      holderState: {
        holderSnapshotObserved: true,
        concentrationLabel: concentration > 70 ? 'high' : concentration > 45 ? 'medium' : 'low',
        topHolderConcentrationPct: concentration,
        holderStateSummary: 'Holder distribution snapshot captured from synthetic stream.',
      },
    };
  }

  if (kind === 'creator_activity_observed') {
    const riskLabel = stringPayload(event.payload['creatorRiskLabel'], 'medium');
    return {
      ...base,
      creatorState: {
        creatorActivityObserved: true,
        creatorRiskLabel: riskLabel === 'low' || riskLabel === 'high' ? riskLabel : 'medium',
        creatorStateSummary: 'Creator activity observed from synthetic event stream.',
      },
    };
  }

  if (kind === 'wallet_cluster_pattern_observed') {
    const clusterLabel = stringPayload(event.payload['clusterLabel'], 'possible');
    return {
      ...base,
      walletClusterState: {
        ...base.walletClusterState,
        walletClusterObserved: true,
        clusterLabel: clusterLabel === 'none' || clusterLabel === 'elevated' ? clusterLabel : 'possible',
        walletClusterStateSummary: 'Wallet cluster pattern observed from synthetic event stream.',
      },
    };
  }

  if (kind === 'bundle_like_pattern_observed') {
    return {
      ...base,
      walletClusterState: {
        ...base.walletClusterState,
        bundleLikeObserved: true,
        clusterLabel: 'elevated',
        walletClusterStateSummary: 'Bundle-like pattern observed from synthetic event stream.',
      },
    };
  }

  if (kind === 'risk_review_requested') {
    return {
      ...base,
      lifecycleStatus: 'under_review',
      riskReviewState: {
        ...base.riskReviewState,
        reviewRequested: true,
        riskReviewSummary: 'Risk review requested for fixture-only lifecycle context.',
      },
    };
  }

  if (kind === 'risk_review_completed') {
    return {
      ...base,
      lifecycleStatus: 'review_completed',
      riskReviewState: {
        reviewRequested: true,
        reviewCompleted: true,
        reviewOutcome: 'completed',
        riskReviewSummary: 'Risk review completed for fixture-only lifecycle context.',
      },
      safetyState: {
        ...base.safetyState,
        status: 'safe_for_fixture_display',
        safetySummary: 'Lifecycle reviewed for fixture display; still not a signal.',
      },
    };
  }

  if (kind === 'lifecycle_snapshot_derived') {
    return {
      ...base,
      lifecycleStatus:
        base.lifecycleStatus === 'observed' ? 'under_review' : base.lifecycleStatus,
    };
  }

  if (kind === 'safety_rejection_recorded') {
    return {
      ...base,
      lifecycleStatus: 'safety_rejected',
      riskReviewState: {
        reviewRequested: true,
        reviewCompleted: true,
        reviewOutcome: 'rejected',
        riskReviewSummary: 'Safety rejection recorded for fixture-only lifecycle context.',
      },
      safetyState: {
        ...base.safetyState,
        status: 'safety_rejection',
        safetySummary: 'Safety rejection recorded; fixture-only and not a signal.',
      },
    };
  }

  return base;
}

export function reduceSyntheticEventStreamLifecycle(
  events: readonly SyntheticEventStreamEnvelope[],
  streamIdentity?: SyntheticEventStreamIdentity,
): SyntheticEventStreamLifecycleDerivedState {
  const streamId = streamIdentity?.streamId ?? 'phase56-stream-unknown';
  const sorted = [...events].sort((left, right) => {
    if (left.sequence !== right.sequence) {
      return left.sequence - right.sequence;
    }
    if (left.syntheticTimestamp !== right.syntheticTimestamp) {
      return left.syntheticTimestamp.localeCompare(right.syntheticTimestamp);
    }
    return left.eventId.localeCompare(right.eventId);
  });

  return sorted.reduce(
    (state, event) => applyEvent(state, event),
    defaultDerivedState(streamId),
  );
}
