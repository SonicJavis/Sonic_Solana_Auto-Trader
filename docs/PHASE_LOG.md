# Phase Log

## Phase 1 - Safe Foundation
- pnpm workspaces TypeScript monorepo
- Strict TypeScript with NodeNext module resolution
- All execution paths blocked
- Telegram bot command shell
- 10 unit tests passing

## Phase 2 - Telegram Control Layer Hardening
- Admin allowlist enforced (fail-closed: empty list locks all control commands)
- Security fix: `isAdmin` returns `false` when admin list is empty
- Full command handlers: `/start`, `/help`, `/status`, `/mode`, `/pause`, `/kill`, `/audit`, `/safety`, `/version`
- Kill switch requires two-step inline keyboard confirmation
- All commands and callbacks fully audit logged
- Formatters extracted: status, help, safety, audit, version
- `FULL_AUTO` and `LIMITED_LIVE` locked at Phase 2 level
- vitest resolve aliases added for workspace packages
- Phase 2 test suite passing

## Phase 3 - Config, Modes, Secrets, and Safety Foundation Hardening
- PHASE constant updated to 3
- `RuntimeSafetyStatus` interface and `buildRuntimeSafetyStatus` function added to `@sonic/shared`
- Config schema expanded: `APP_VERSION`, `SAFETY_PROFILE`, 10 unsafe capability flags, 2 unlock flags
- `APP_MODE` limited to Phase 3 allowed modes at schema level — `LIMITED_LIVE` and `FULL_AUTO` rejected at parse time
- Unsafe flags default `false`; even if set `true`, capabilities remain disabled (fail-closed)
- `loadConfigWithResult` returns full result with `valid`, `unsafeFlagsDetected`, `unsafeFlags`, `warnings`
- `safeConfigSummary` provides redacted config summary safe to log
- `packages/config/src/redact.ts` replaced with comprehensive redaction (key patterns, value patterns, circular ref handling)
- `packages/config/src/provenance.ts` new — tracks field source (env vs default) with safe display
- `ModeManager.setMode` returns `TransitionResult` with `accepted`, `success`, `previousMode`, `resultingMode`, `lockedMode`, `error`, `rejectionReason`, `timestamp`
- Worker performs startup safety check — exits with code 1 if any invariant is violated
- `logSafetyStatus`, `logUnsafeFlagsDetected`, `logWorkerSafetyCheckPassed/Failed` added to observability
- Telegram `/status` and `/safety` commands include `RuntimeSafetyStatus` context
- Phase 3 test suite: 58 new tests covering config, redaction, provenance, safety status, mode manager, formatters
- All 119 tests passing

## Phase 4 - Database + Persistent Audit Logs
- SQLite + Drizzle ORM (`drizzle-orm@0.45.2`, `better-sqlite3@12.9.0`) persistent audit log
- `packages/db`: schema, client, migrate, `SqliteAuditRepository`, `InMemoryAuditLogger`, retention, types, exports
- `audit_events` table: id, timestamp, phase, event_type, severity, source, mode, message, details_json, safe_summary, created_at
- Indexes on: timestamp, event_type, severity, source, mode
- DB init idempotent — `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`
- Missing data directory created automatically on startup
- Worker fails closed if DB init fails (exits with code 1)
- Retention policy: `AUDIT_ROTATION_ENABLED`, `AUDIT_RETENTION_DAYS` (1–365), `AUDIT_MAX_EVENTS` (100–1,000,000)
- `applyRetention()` records `RETENTION_APPLIED` or `RETENTION_FAILED`; failure is warn, not fatal
- Worker boot sequence: load config → init DB → apply retention → init mode manager → safety check → persist startup events
- New config fields: `DATABASE_PATH`, `AUDIT_RETENTION_DAYS`, `AUDIT_MAX_EVENTS`, `AUDIT_ROTATION_ENABLED`
- `DATABASE_URL` and `TELEGRAM_BOT_TOKEN` raw values never persisted (new `SENSITIVE_KEY_EXACT` list in redact.ts)
- `details` and `safeSummary` redacted before DB insertion via `redactObject` / `redactString`
- Circular references in `details` are handled safely (no crash)
- Telegram `/audit` enhanced: `recent`, `page N`, `severity X`, `type X`, `source X`, `stats` sub-commands
- `formatAuditRecords`, `formatPersistentAuditRecord`, `formatAuditStats`, `formatAuditHelp` added to formatter
- Legacy `formatAuditLog` / `formatAuditRecord` preserved for backward compat (Phase 2 tests)
- `SqliteAuditRepository` implements `IAuditRepository` (extends `IAuditLogger`) — fully backward-compatible
- `InMemoryAuditLogger` now also implements `IAuditRepository` — tests use in-memory without file I/O
- All ModeManager transitions persisted to SQLite
- Phase 4 test suite: 82 new tests covering config, DB init, repository, redaction, retention, worker events, mode manager, Telegram formatter, regression
- All 201 tests passing (82 new + 119 regression)


## Phase 5 - State Store and Safe Read Models
- PHASE constant updated to 5; PHASE_NAME updated to "State Store and Safe Read Models"
- New `packages/state` package: safe read-only state/read-model layer
- `SystemStateSnapshot`, `ConfigStateSnapshot`, `ModeStateSnapshot`, `RuntimeSafetyStateSnapshot`, `AuditStateSnapshot`, `WorkerStateSnapshot`, `DatabaseStateSnapshot`, `UnsafeFlagStateSnapshot`, `SystemReadiness` types
- `buildAuditStateSnapshot()` — derives audit stats, last startup/heartbeat/unsafe-flags timestamps from IAuditRepository
- `buildConfigStateSnapshot()` — safe config summary (no raw DATABASE_URL, TELEGRAM_BOT_TOKEN, or credentials)
- `buildModeStateSnapshot()` — reports current mode, locked modes (FULL_AUTO/LIMITED_LIVE), mode safety status
- `buildWorkerStateSnapshot()` — worker health (healthy/degraded/unknown) derived from audit heartbeat age
- `calculateReadiness()` — SystemReadiness: ready/degraded/unsafe/unknown (rules documented and tested)
- `buildSystemStateSnapshot()` — aggregates all read models into a single safe snapshot
- Telegram `/system` command added with subcommands: health, safety, audit, worker, config, help
- `/system` formatters: `formatSystemOverview`, `formatSystemHealth`, `formatSystemSafety`, `formatSystemAudit`, `formatSystemWorker`, `formatSystemConfig`, `formatSystemHelp`, `formatSystemUnknown`
- Telegram output: no raw secrets, no raw detailsJson, never exposes DATABASE_URL or TELEGRAM_BOT_TOKEN
- `packages/state` depends on shared/config/db/mode-manager — no dependency on apps/telegram-bot or apps/worker
- Phase 5 test suite: 88 new tests covering types, read models, readiness, redaction, worker events, Telegram formatters, regression
- All 291 tests passing (88 new + 203 regression)
- FULL_AUTO and LIMITED_LIVE remain locked
- No Solana RPC, market data, wallets, signing, sending, Jito, Pump.fun, or execution code added
