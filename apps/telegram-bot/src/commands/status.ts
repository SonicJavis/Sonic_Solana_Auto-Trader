import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import { collectUnsafeFlags } from '@sonic/config';
import { buildRuntimeSafetyStatus } from '@sonic/shared';
import { PHASE } from '@sonic/shared';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditRepository } from '@sonic/db';
import { getTelegramUserInfo, hasConfiguredAdmins } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatStatus } from '../formatters/status.js';

const startTime = Date.now();

export async function handleStatus(
  ctx: Context,
  config: AppConfig,
  modeManager: ModeManager,
  auditLogger: IAuditRepository,
): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const mode = modeManager.getMode();
  await auditTelegramCommand(auditLogger, {
    info,
    command: '/status',
    accepted: true,
    modeBefore: mode,
    phase: `Phase ${PHASE}`,
  });
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const unsafeFlags = collectUnsafeFlags(config);

  const runtimeSafety = buildRuntimeSafetyStatus({
    currentPhase: PHASE,
    currentMode: mode,
    configValid: true,
    unsafeFlagsDetected: unsafeFlags.length > 0,
    unsafeFlags,
    warnings: unsafeFlags.length > 0
      ? [`Unsafe flags detected: ${unsafeFlags.join(', ')} — capabilities remain disabled`]
      : [],
    killSwitchActive: modeManager.isKillSwitchActive(),
    adminAllowlistConfigured: hasConfiguredAdmins(config),
    telegramEnabled: config.TELEGRAM_BOT_TOKEN !== undefined,
    databaseConfigured: config.DATABASE_URL !== '',
  });

  const text = formatStatus({
    mode,
    uptimeSeconds,
    telegramEnabled: !!config.TELEGRAM_BOT_TOKEN,
    adminConfigured: hasConfiguredAdmins(config),
    killSwitchActive: modeManager.isKillSwitchActive(),
    runtimeSafety,
  });
  await ctx.reply(text);
}
