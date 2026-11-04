/**
 * Client-side entry point. Composes the small, single-purpose behaviours that run on every page
 * load. Each behaviour lives in its own module under `./client` so it can be reasoned about (and
 * tested) in isolation.
 */

import { suppressImageContextMenu } from "./client/context-menu.ts";
import { loadHolidayEffect } from "./client/holiday-effects.ts";
import { setupKonamiCode } from "./client/konami-code.ts";
import { setupPreloadRecovery } from "./client/preload-recovery.ts";
import { setupWakeLockOnDev } from "./client/wakelock-dev.ts";
import { getQueryParam } from "./utils/globals.ts";

const main = (): void => {
  suppressImageContextMenu();
  setupKonamiCode();
  setupPreloadRecovery();
  loadHolidayEffect();
  devtools();
};

const devtools = (): void => {
  if (
    ["1", "true"].some((keyword) => getQueryParam("dev")?.includes(keyword)) ||
    import.meta.env.DEV
  ) {
    setupWakeLockOnDev();
  }
};

export default main;
