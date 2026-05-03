import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import { collectUnsafeFlags } from '@sonic/config';
import { buildRuntimeSafetyStatus } from '@sonic/shared';
import { PHASE } from '@sonic/shared';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditLogger } from '@sonic/db';
import { getTelegramUserInfo, hasConfiguredAdmins } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatSafety } from '../formatters/safety.js';

export async function handleSafety(
  ctx: Context,
  config: AppConfig,
  modeManager: ModeManager,
  auditLogger: IAuditLogger,
): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const mode = modeManager.getMode();
  await auditTelegramCommand(auditLogger, {
    info,
    command: '/safety',
    accepted: true,
    modeBefore: mode,
    phase: `Phase ${PHASE}`,
  });

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

  const text = formatSafety({
    mode,
    adminConfigured: hasConfiguredAdmins(config),
    killSwitchActive: modeManager.isKillSwitchActive(),
    runtimeSafety,
  });
  await ctx.reply(text);
}
