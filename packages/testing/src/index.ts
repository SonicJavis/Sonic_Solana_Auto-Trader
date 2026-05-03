export { InMemoryAuditLogger } from '@sonic/db';
export { ModeManager } from '@sonic/mode-manager';

import { InMemoryAuditLogger } from '@sonic/db';
import { ModeManager } from '@sonic/mode-manager';

export function createTestModeManager(): ModeManager {
  return new ModeManager(new InMemoryAuditLogger());
}
