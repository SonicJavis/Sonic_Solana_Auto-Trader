/**
 * apps/dashboard/src/types.ts
 *
 * Phase 25 — Local Read-Only Dashboard UI Shell v1 — Render Types
 *
 * Defines the typed output shapes produced by all dashboard UI shell components.
 * These are pure TypeScript types for a Node-compatible, deterministic,
 * fixture-backed, read-only rendering system.
 *
 * SAFETY: No live data. No Solana RPC. No provider APIs. No wallets.
 *         No execution. No external network. No mutation controls.
 */

// ─── Dashboard item ───────────────────────────────────────────────────────────

/** A single key-value item displayed in a dashboard panel or section. */
export interface DashboardItem {
  readonly key: string;
  readonly label: string;
  readonly value: string | boolean | number | null;
  readonly description?: string;
  readonly badge?: StatusBadgeResult;
}

// ─── Dashboard section ────────────────────────────────────────────────────────

/**
 * A logical section within a rendered component.
 * Maps to a semantic <section> or <region> landmark.
 */
export interface DashboardSection {
  readonly sectionId: string;
  readonly title: string;
  readonly role: string;
  readonly ariaLabel: string;
  readonly items: readonly DashboardItem[];
  readonly subSections?: readonly DashboardSection[];
}

// ─── Status badge ─────────────────────────────────────────────────────────────

/** Output of the StatusBadge component. */
export interface StatusBadgeResult {
  readonly componentType: 'StatusBadge';
  readonly status: string;
  readonly label: string;
  readonly ariaLabel: string;
}

// ─── Safety boundary flags ────────────────────────────────────────────────────

/** Immutable safety boundary flags present on every render result. */
export interface DashboardSafetyBoundary {
  readonly isReadOnly: true;
  readonly isLocalOnly: true;
  readonly isFixtureBacked: true;
  readonly hasLiveData: false;
  readonly hasTradingControls: false;
  readonly hasWalletControls: false;
  readonly hasMutationControls: false;
  readonly hasExternalNetwork: false;
  readonly hasExecutionControls: false;
}

// ─── Render result ────────────────────────────────────────────────────────────

/**
 * The typed output of every dashboard UI shell component.
 * Designed to be deterministic, testable, and accessible.
 */
export interface DashboardRenderResult {
  readonly componentType: string;
  readonly title: string;
  readonly ariaLabel: string;
  readonly role: string;
  readonly sections: readonly DashboardSection[];
  readonly hasHeading: boolean;
  readonly hasLandmark: boolean;
  readonly safetyBoundary: DashboardSafetyBoundary;
}

// ─── Safety banner ────────────────────────────────────────────────────────────

/** Output of the SafetyBanner component. */
export interface SafetyBannerResult {
  readonly componentType: 'SafetyBanner';
  readonly role: 'banner';
  readonly ariaLabel: string;
  readonly notices: readonly string[];
  readonly safetyBoundary: DashboardSafetyBoundary;
}

// ─── Shell navigation ─────────────────────────────────────────────────────────

/** A single navigation entry in the dashboard shell. */
export interface DashboardNavEntry {
  readonly id: string;
  readonly label: string;
  readonly ariaLabel: string;
  readonly isCurrent: boolean;
}

// ─── Full shell output ────────────────────────────────────────────────────────

/** The fully rendered dashboard shell output. */
export interface DashboardShellResult {
  readonly componentType: 'DashboardShell';
  readonly title: string;
  readonly role: 'main';
  readonly ariaLabel: string;
  readonly safetyBanner: SafetyBannerResult;
  readonly navigation: readonly DashboardNavEntry[];
  readonly panels: {
    readonly health: DashboardRenderResult;
    readonly capabilities: DashboardRenderResult;
    readonly overview: DashboardRenderResult;
    readonly evidence: DashboardRenderResult;
    readonly safety: DashboardRenderResult;
    readonly metadata: DashboardRenderResult;
  };
  readonly footer: DashboardRenderResult;
  readonly safetyBoundary: DashboardSafetyBoundary;
}

// ─── Phase 25/26 capabilities ────────────────────────────────────────────────

/** Phase 25/26 dashboard UI shell capabilities (all unsafe false). */
export interface DashboardUiShellCapabilities {
  readonly dashboardUiShell: true;
  readonly localReadOnlyDashboard: true;
  readonly fixtureBackedDashboardUi: true;
  readonly dashboardUsesViewModels: true;
  readonly dashboardInteractionState: true;
  readonly localDashboardFilters: true;
  readonly inMemoryDashboardState: true;
  readonly deterministicDashboardState: true;
  readonly dashboardPanelVisibility: true;
  readonly dashboardFilterSelectors: true;
  readonly dashboardPersistentState: false;
  readonly dashboardExternalStateSync: false;
  readonly dashboardLiveFilters: false;
  readonly dashboardExternalNetwork: false;
  readonly dashboardLiveData: false;
  readonly dashboardTradingControls: false;
  readonly dashboardWalletControls: false;
  readonly dashboardMutationControls: false;
  readonly dashboardExecutionControls: false;
  readonly dashboardWalletConnection: false;
  readonly dashboardRealTimeUpdates: false;
}
